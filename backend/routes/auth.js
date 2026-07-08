import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Company from '../models/Company.js'

const router = express.Router()

const generateTokens = (userId) => {
  const jwtSecret = process.env.JWT_SECRET || 'digiayudh_local_jwt_secret'
  const refreshSecret = process.env.REFRESH_TOKEN_SECRET || 'digiayudh_local_refresh_secret'

  const token = jwt.sign({ userId }, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRY || '7d',
  })
  const refreshToken = jwt.sign({ userId }, refreshSecret, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '30d',
  })
  return { token, refreshToken }
}

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role, companyName } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' })
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: role || 'admin',
    })

    await user.save()

    // Create company if user is admin
    let company = null
    if (role === 'admin' && companyName) {
      company = new Company({
        name: companyName,
        email,
        adminId: user._id,
      })
      await company.save()
      user.company = company._id
      await user.save()
    }

    const { token, refreshToken } = generateTokens(user._id)

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      token,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
      },
    })
  } catch (error) {
    console.error('[v0] Signup error:', error)
    res.status(500).json({ success: false, message: 'Signup failed', error: error.message })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' })
    }

    // Find user
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    const { token, refreshToken } = generateTokens(user._id)

    res.json({
      success: true,
      message: 'Login successful',
      token,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
      },
    })
  } catch (error) {
    console.error('[v0] Login error:', error)
    res.status(500).json({ success: false, message: 'Login failed', error: error.message })
  }
})

// Refresh Token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'Refresh token required' })
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || 'digiayudh_local_refresh_secret')
    const { token: newToken } = generateTokens(decoded.userId)

    res.json({ success: true, token: newToken })
  } catch (error) {
    console.error('[v0] Token refresh error:', error)
    res.status(401).json({ success: false, message: 'Invalid refresh token' })
  }
})

export default router
