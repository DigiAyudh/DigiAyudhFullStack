import { body, validationResult } from 'express-validator'

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    })
  }
  next()
}

const passwordRules = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/[a-z]/)
  .withMessage('Password must contain at least one lowercase letter')
  .matches(/[0-9]/)
  .withMessage('Password must contain at least one number')
  .matches(/[^A-Za-z0-9]/)
  .withMessage('Password must contain at least one special character')

export const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('expectedRole')
    .optional()
    .isIn(['admin', 'employee', 'client'])
    .withMessage('Invalid login type'),
  handleValidationErrors,
]

export const clientSignupValidation = [
  body('name').trim().notEmpty().withMessage('Full name is required'),
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('countryCode').trim().notEmpty().withMessage('Country code is required'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Mobile number is required')
    .matches(/^[0-9]{6,15}$/)
    .withMessage('Mobile number must be 6-15 digits'),
  passwordRules,
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match')
    }
    return true
  }),
  body('companyType').trim().notEmpty().withMessage('Company type is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('termsAccepted')
    .custom((value) => value === true || value === 'true')
    .withMessage('You must accept the terms and conditions'),
  body('verificationToken').optional().isString(),
  handleValidationErrors,
]

export const createEmployeeValidation = [
  body('name').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').optional(),
  body('phone').optional().trim(),
  body('department').optional().trim(),
  body('position').optional().trim(),
  handleValidationErrors,
]

export const sendOtpValidation = [
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Mobile number is required')
    .matches(/^[0-9]{6,15}$/)
    .withMessage('Mobile number must be 6-15 digits'),
  body('countryCode').trim().notEmpty().withMessage('Country code is required'),
  handleValidationErrors,
]

export const verifyOtpValidation = [
  body('phone').trim().notEmpty().withMessage('Mobile number is required'),
  body('otp').trim().isLength({ min: 4, max: 6 }).withMessage('Valid OTP is required'),
  handleValidationErrors,
]
