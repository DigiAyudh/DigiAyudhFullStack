import express from 'express'
import crypto from 'crypto'
import User from '../models/User.js'
import OtpVerification from '../models/OtpVerification.js'
import { generateTokens, sanitizeUser, verifyRefreshToken } from '../utils/tokens.js'
import { verifyToken } from '../middleware/auth.js'
import {
  loginValidation,
  clientSignupValidation,
  sendOtpValidation,
  verifyOtpValidation,
} from '../middleware/validate.js'

const router = express.Router()

const OTP_EXPIRY_MINUTES = 10
const REQUIRE_OTP = process.env.REQUIRE_OTP_VERIFICATION === 'true'

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000))

const buildFullPhone = (countryCode, phone) => `${countryCode}${phone}`

// Send OTP for mobile verification (client signup)
router.post('/send-otp', sendOtpValidation, async (req, res) => {
  try {
    const { phone, countryCode } = req.body
    const fullPhone = buildFullPhone(countryCode, phone)

    const existingUser = await User.findOne({ phone, countryCode })
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Mobile number already registered' })
    }

    const otp = generateOtp()
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)

    await OtpVerification.deleteMany({ phone, countryCode })
    await OtpVerification.create({ phone, countryCode, otp, expiresAt })

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[OTP] ${fullPhone}: ${otp}`)
    }

    res.json({
      success: true,
      message: 'OTP sent successfully',
      ...(process.env.NODE_ENV !== 'production' && { devOtp: otp }),
    })
  } catch (error) {
    console.error('[Auth] Send OTP error:', error)
    res.status(500).json({ success: false, message: 'Failed to send OTP' })
  }
})

// Verify OTP and return verification token for signup
router.post('/verify-otp', verifyOtpValidation, async (req, res) => {
  try {
    const { phone, otp } = req.body

    const record = await OtpVerification.findOne({ phone, otp, expiresAt: { $gt: new Date() } })
    if (!record) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' })
    }

    const verificationToken = crypto.randomBytes(32).toString('hex')
    record.verified = true
    record.verificationToken = verificationToken
    await record.save()

    res.json({
      success: true,
      message: 'OTP verified successfully',
      verificationToken,
    })
  } catch (error) {
    console.error('[Auth] Verify OTP error:', error)
    res.status(500).json({ success: false, message: 'OTP verification failed' })
  }
})

// Client signup only — public registration
router.post('/signup', clientSignupValidation, async (req, res) => {
  try {
    const {
      name,
      companyName,
      email,
      password,
      countryCode,
      phone,
      companyType,
      city,
      state,
      country,
      termsAccepted,
      verificationToken,
    } = req.body

    if (REQUIRE_OTP) {
      if (!verificationToken) {
        return res.status(400).json({ success: false, message: 'Phone verification required' })
      }
      const otpRecord = await OtpVerification.findOne({
        phone,
        countryCode,
        verificationToken,
        verified: true,
        expiresAt: { $gt: new Date() },
      })
      if (!otpRecord) {
        return res.status(400).json({ success: false, message: 'Invalid phone verification' })
      }
    }

    const existingEmail = await User.findOne({ email })
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'Email already registered' })
    }

    const existingPhone = await User.findOne({ phone, countryCode })
    if (existingPhone) {
      return res.status(400).json({ success: false, message: 'Mobile number already registered' })
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'client',
      companyName,
      companyType,
      city,
      state,
      country,
      countryCode,
      phone,
      termsAccepted: termsAccepted === true || termsAccepted === 'true',
      phoneVerified: REQUIRE_OTP,
      isActive: true,
    })

    if (REQUIRE_OTP && verificationToken) {
      await OtpVerification.deleteOne({ verificationToken })
    }

    const { token, refreshToken } = generateTokens(user)

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      refreshToken,
      user: sanitizeUser(user),
    })
  } catch (error) {
    console.error('[Auth] Client signup error:', error)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0]
      return res.status(400).json({
        success: false,
        message: field === 'email' ? 'Email already registered' : 'Mobile number already registered',
      })
    }
    res.status(500).json({ success: false, message: 'Registration failed' })
  }
})

// Login with optional role enforcement (admin / employee / client)
router.post('/login', loginValidation, async (req, res) => {
  try {
    const { email, password, expectedRole } = req.body

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    if (expectedRole && user.role !== expectedRole) {
      const roleLabels = { admin: 'Super Admin', employee: 'Employee', client: 'Client' }
      return res.status(403).json({
        success: false,
        message: `This account is not authorized for ${roleLabels[expectedRole] || expectedRole} login`,
      })
    }

    if (user.role === 'employee' && !user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account is inactive. Contact your administrator.',
      })
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated' })
    }

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    const { token, refreshToken } = generateTokens(user)

    res.json({
      success: true,
      message: 'Login successful',
      token,
      refreshToken,
      user: sanitizeUser(user),
    })
  } catch (error) {
    console.error('[Auth] Login error:', error)
    res.status(500).json({ success: false, message: 'Login failed' })
  }
})

// Get current authenticated user
router.get('/me', verifyToken, async (req, res) => {
  res.json({ success: true, user: sanitizeUser(req.user) })
})

// Refresh access token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'Refresh token required' })
    }

    const decoded = verifyRefreshToken(refreshToken)
    const user = await User.findById(decoded.userId)

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' })
    }

    const { token: newToken, refreshToken: newRefreshToken } = generateTokens(user)

    res.json({
      success: true,
      token: newToken,
      refreshToken: newRefreshToken,
    })
  } catch (error) {
    console.error('[Auth] Token refresh error:', error)
    res.status(401).json({ success: false, message: 'Invalid or expired refresh token' })
  }
})

// Logout (client-side token removal; server acknowledges)
router.post('/logout', verifyToken, async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' })
})

export default router
