import express from 'express'
import Lead from '../models/Lead.js'

const router = express.Router()

// Get all leads
router.get('/', async (req, res) => {
  try {
    const { company_id } = req.query
    const leads = await Lead.find({ company_id }).populate('assignedTo', 'name email')
    res.json({ success: true, data: leads })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Create lead
router.post('/', async (req, res) => {
  try {
    const lead = new Lead(req.body)
    await lead.save()
    await lead.populate('assignedTo', 'name email')
    res.status(201).json({ success: true, data: lead })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Get lead by ID
router.get('/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('assignedTo', 'name email')
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' })
    res.json({ success: true, data: lead })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Update lead
router.put('/:id', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('assignedTo', 'name email')
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' })
    res.json({ success: true, data: lead })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Delete lead
router.delete('/:id', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id)
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' })
    res.json({ success: true, message: 'Lead deleted' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
