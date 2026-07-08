import express from 'express'
import Task from '../models/Task.js'

const router = express.Router()

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const { company, projectId } = req.query
    const query = { company }
    if (projectId) query.projectId = projectId
    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('projectId', 'title')
    res.json({ success: true, data: tasks })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Create task
router.post('/', async (req, res) => {
  try {
    const task = new Task(req.body)
    await task.save()
    await task.populate(['assignedTo', 'createdBy', 'projectId'])
    res.status(201).json({ success: true, data: task })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Get task by ID
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('projectId', 'title')
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' })
    res.json({ success: true, data: task })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Update task
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('projectId', 'title')
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' })
    res.json({ success: true, data: task })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' })
    res.json({ success: true, message: 'Task deleted' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
