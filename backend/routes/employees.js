import express from 'express'
import Employee from '../models/Employee.js'

const router = express.Router()

// Get all employees
router.get('/', async (req, res) => {
  try {
    const { company } = req.query
    const employees = await Employee.find({ company }).populate('userId', 'name email')
    res.json({ success: true, data: employees })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Create employee
router.post('/', async (req, res) => {
  try {
    const employee = new Employee(req.body)
    await employee.save()
    await employee.populate('userId', 'name email')
    res.status(201).json({ success: true, data: employee })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Get employee by ID
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('userId', 'name email')
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' })
    res.json({ success: true, data: employee })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Update employee
router.put('/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('userId', 'name email')
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' })
    res.json({ success: true, data: employee })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Delete employee
router.delete('/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id)
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' })
    res.json({ success: true, message: 'Employee deleted' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
