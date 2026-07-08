import express from 'express'
import Project from '../models/Project.js'

const router = express.Router()

// Get all projects
router.get('/', async (req, res) => {
  try {
    const { company } = req.query
    const projects = await Project.find({ company })
      .populate('clientId', 'name email')
      .populate('managerId', 'name email')
      .populate('teamMembers', 'name email')
    res.json({ success: true, data: projects })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Create project
router.post('/', async (req, res) => {
  try {
    const project = new Project(req.body)
    await project.save()
    await project.populate(['clientId', 'managerId', 'teamMembers'])
    res.status(201).json({ success: true, data: project })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('clientId', 'name email')
      .populate('managerId', 'name email')
      .populate('teamMembers', 'name email')
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' })
    res.json({ success: true, data: project })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Update project
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('clientId', 'name email')
      .populate('managerId', 'name email')
      .populate('teamMembers', 'name email')
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' })
    res.json({ success: true, data: project })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id)
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' })
    res.json({ success: true, message: 'Project deleted' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
