import jwt from 'jsonwebtoken'

const getSecrets = () => {
  const jwtSecret = process.env.JWT_SECRET
  const refreshSecret = process.env.REFRESH_TOKEN_SECRET

  if (!jwtSecret || !refreshSecret) {
    throw new Error('JWT secrets are not configured')
  }

  return { jwtSecret, refreshSecret }
}

export const generateTokens = (user) => {
  const { jwtSecret, refreshSecret } = getSecrets()
  const payload = { userId: user._id.toString(), role: user.role }

  const token = jwt.sign(payload, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRY || '15m',
  })

  const refreshToken = jwt.sign({ userId: user._id.toString() }, refreshSecret, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d',
  })

  return { token, refreshToken }
}

export const verifyRefreshToken = (refreshToken) => {
  const { refreshSecret } = getSecrets()
  return jwt.verify(refreshToken, refreshSecret)
}

export const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  countryCode: user.countryCode,
  role: user.role,
  companyName: user.companyName,
  companyType: user.companyType,
  city: user.city,
  state: user.state,
  country: user.country,
  department: user.department,
  profileImage: user.profileImage,
  isActive: user.isActive,
  company: user.company,
  joinDate: user.joinDate,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
})
