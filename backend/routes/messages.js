import express from 'express'
import Message from '../models/Message.js'

const router = express.Router()

// Get messages for a chat
router.get('/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params
    const messages = await Message.find({ chatId })
      .populate('senderId', 'name email profileImage')
      .sort({ createdAt: -1 })
    res.json({ success: true, data: messages.reverse() })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Create message
router.post('/', async (req, res) => {
  try {
    const message = new Message(req.body)
    await message.save()
    await message.populate('senderId', 'name email profileImage')
    res.status(201).json({ success: true, data: message })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
