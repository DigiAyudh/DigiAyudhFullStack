import express from 'express'
import Report from '../models/Report.js'

const router = express.Router()

// Get reports for a company
router.get('/', async (req, res) => {
  try {
    const { company } = req.query
    const reports = await Report.find({ company }).populate('createdBy', 'name email')
    res.json({ success: true, data: reports })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Create report
router.post('/', async (req, res) => {
  try {
    const report = new Report(req.body)
    await report.save()
    await report.populate('createdBy', 'name email')
    res.status(201).json({ success: true, data: report })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Get report by ID
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate('createdBy', 'name email')
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' })
    res.json({ success: true, data: report })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Export report
router.get('/:id/export', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' })
    
    const data = JSON.stringify(report, null, 2)
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', `attachment; filename=report-${report._id}.json`)
    res.send(data)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
