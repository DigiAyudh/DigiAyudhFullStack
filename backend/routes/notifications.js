import express from 'express'
import Notification from '../models/Notification.js'

const router = express.Router()

// Get notifications for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 })
    res.json({ success: true, data: notifications })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Create notification
router.post('/', async (req, res) => {
  try {
    const notification = new Notification(req.body)
    await notification.save()
    res.status(201).json({ success: true, data: notification })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Mark notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    )
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' })
    res.json({ success: true, data: notification })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
