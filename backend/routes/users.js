import express from 'express'
import User from '../models/User.js'
import Employee from '../models/Employee.js'
import { verifyToken, requireRole } from '../middleware/auth.js'
import { createEmployeeValidation, handleValidationErrors } from '../middleware/validate.js'
import { body } from 'express-validator'
import { sanitizeUser } from '../utils/tokens.js'

const router = express.Router()

router.use(verifyToken)

// Get all users (admin only)
router.get('/', requireRole('admin'), async (req, res) => {
  try {
    const { role, company } = req.query
    const query = {}
    if (role) query.role = role
    if (company) query.company = company

    const users = await User.find(query).select('-password').sort({ createdAt: -1 })
    res.json({ success: true, data: users })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Get employees (admin only)
router.get('/employees', requireRole('admin'), async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' })
      .select('-password')
      .sort({ createdAt: -1 })
    res.json({ success: true, data: employees })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Create employee account (admin only)
router.post(
  '/employees',
  requireRole('admin'),
  createEmployeeValidation,
  async (req, res) => {
    try {
      const { name, email, password, phone, countryCode, department, position } = req.body

      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already registered' })
      }

      if (phone && countryCode) {
        const existingPhone = await User.findOne({ phone, countryCode })
        if (existingPhone) {
          return res.status(400).json({ success: false, message: 'Mobile number already registered' })
        }
      }

      const tempPassword = password || `Emp@${Date.now().toString(36)}`

      const user = await User.create({
        name,
        email,
        password: tempPassword,
        role: 'employee',
        phone,
        countryCode,
        department,
        isActive: true,
        createdBy: req.userId,
        company: req.user.company,
      })

      const employee = await Employee.create({
        userId: user._id,
        name: user.name,
        email: user.email,
        phone: phone || '',
        position: position || 'Employee',
        department: department || 'General',
        joiningDate: new Date(),
        isActive: true,
        company: req.user.company || user._id,
        address: '',
        city: '',
        country: '',
      })

      res.status(201).json({
        success: true,
        message: 'Employee account created successfully',
        data: {
          user: sanitizeUser(user),
          employee,
          ...(password ? {} : { temporaryPassword: tempPassword }),
        },
      })
    } catch (error) {
      console.error('[Users] Create employee error:', error)
      if (error.code === 11000) {
        return res.status(400).json({ success: false, message: 'Duplicate email or phone number' })
      }
      res.status(500).json({ success: false, message: 'Failed to create employee account' })
    }
  }
)

// Update employee account (admin only)
router.put(
  '/employees/:id',
  requireRole('admin'),
  async (req, res) => {
    try {
      const { name, email, phone, countryCode, department, isActive, position } = req.body

      const user = await User.findOne({ _id: req.params.id, role: 'employee' })
      if (!user) {
        return res.status(404).json({ success: false, message: 'Employee not found' })
      }

      if (email && email !== user.email) {
        const existing = await User.findOne({ email, _id: { $ne: user._id } })
        if (existing) {
          return res.status(400).json({ success: false, message: 'Email already in use' })
        }
        user.email = email
      }

      if (name) user.name = name
      if (phone !== undefined) user.phone = phone
      if (countryCode !== undefined) user.countryCode = countryCode
      if (department !== undefined) user.department = department
      if (typeof isActive === 'boolean') user.isActive = isActive

      await user.save()

      const employeeUpdate = {}
      if (name) employeeUpdate.name = name
      if (email) employeeUpdate.email = email
      if (phone !== undefined) employeeUpdate.phone = phone
      if (department !== undefined) employeeUpdate.department = department
      if (position !== undefined) employeeUpdate.position = position
      if (typeof isActive === 'boolean') employeeUpdate.isActive = isActive

      if (Object.keys(employeeUpdate).length > 0) {
        await Employee.findOneAndUpdate({ userId: user._id }, employeeUpdate)
      }

      res.json({
        success: true,
        message: 'Employee updated successfully',
        data: sanitizeUser(user),
      })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
)

// Reset employee password (admin only)
router.post(
  '/employees/:id/reset-password',
  requireRole('admin'),
  [
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter')
      .matches(/[a-z]/)
      .withMessage('Password must contain at least one lowercase letter')
      .matches(/[0-9]/)
      .withMessage('Password must contain at least one number'),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.params.id, role: 'employee' }).select('+password')
      if (!user) {
        return res.status(404).json({ success: false, message: 'Employee not found' })
      }

      user.password = req.body.newPassword
      await user.save()

      res.json({ success: true, message: 'Password reset successfully' })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
)

// Delete employee account (admin only)
router.delete('/employees/:id', requireRole('admin'), async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, role: 'employee' })
    if (!user) {
      return res.status(404).json({ success: false, message: 'Employee not found' })
    }

    await Employee.deleteOne({ userId: user._id })
    await User.deleteOne({ _id: user._id })

    res.json({ success: true, message: 'Employee account deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Assign client to employee (admin only)
router.post(
  '/assign-client',
  requireRole('admin'),
  [
    body('clientId').notEmpty().withMessage('Client ID is required'),
    body('employeeId').notEmpty().withMessage('Employee ID is required'),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const { clientId, employeeId } = req.body

      const client = await User.findOne({ _id: clientId, role: 'client' })
      if (!client) {
        return res.status(404).json({ success: false, message: 'Client not found' })
      }

      const employee = await User.findOne({ _id: employeeId, role: 'employee', isActive: true })
      if (!employee) {
        return res.status(404).json({ success: false, message: 'Employee not found or inactive' })
      }

      client.assignedEmployee = employee._id
      await client.save()

      res.json({
        success: true,
        message: 'Client assigned to employee successfully',
        data: sanitizeUser(client),
      })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
)

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.userId !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Access denied' })
    }

    const user = await User.findById(req.params.id).select('-password')
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })
    res.json({ success: true, data: sanitizeUser(user) })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Update own profile or admin updates any user
router.put('/:id', async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin'
    const isSelf = req.userId === req.params.id

    if (!isAdmin && !isSelf) {
      return res.status(403).json({ success: false, message: 'Access denied' })
    }

    const allowedFields = isAdmin
      ? ['name', 'phone', 'countryCode', 'department', 'profileImage', 'isActive']
      : ['name', 'phone', 'countryCode', 'profileImage']

    const updates = {}
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field]
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select('-password')

    if (!user) return res.status(404).json({ success: false, message: 'User not found' })
    res.json({ success: true, data: sanitizeUser(user) })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
