import express from 'express'
import Employee from '../models/Employee.js'
import { requireRole } from '../middleware/auth.js'

const router = express.Router()

router.get('/', requireRole('admin', 'employee'), async (req, res) => {
  try {
    const { company } = req.query
    const query = company ? { company } : {}
    const employees = await Employee.find(query).populate('userId', 'name email isActive')
    res.json({ success: true, data: employees })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.post('/', requireRole('admin'), async (req, res) => {
  try {
    const employee = new Employee(req.body)
    await employee.save()
    await employee.populate('userId', 'name email')
    res.status(201).json({ success: true, data: employee })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.get('/:id', requireRole('admin', 'employee'), async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('userId', 'name email isActive')
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' })
    res.json({ success: true, data: employee })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.put('/:id', requireRole('admin'), async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate(
      'userId',
      'name email isActive'
    )
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' })
    res.json({ success: true, data: employee })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.delete('/:id', requireRole('admin'), async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id)
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' })
    res.json({ success: true, message: 'Employee deleted' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
