import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET is not configured')
  }
  return secret
}

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required' })
    }

    const decoded = jwt.verify(token, getJwtSecret())
    const user = await User.findById(decoded.userId).select('-password')

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' })
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated' })
    }

    req.user = user
    req.userId = user._id.toString()
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired' })
    }
    return res.status(401).json({ success: false, message: 'Invalid token' })
  }
}

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required' })
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Insufficient permissions' })
  }

  next()
}

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null

    if (token) {
      const decoded = jwt.verify(token, getJwtSecret())
      const user = await User.findById(decoded.userId).select('-password')
      if (user?.isActive) {
        req.user = user
        req.userId = user._id.toString()
      }
    }
    next()
  } catch {
    next()
  }
}
