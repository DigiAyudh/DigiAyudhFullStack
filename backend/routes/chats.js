import express from 'express'
import Chat from '../models/Chat.js'

const router = express.Router()

// Get chats for a user
router.get('/', async (req, res) => {
  try {
    const { company, userId } = req.query
    const chats = await Chat.find({ company, participants: userId })
      .populate('participants', 'name email')
      .sort({ updatedAt: -1 })
    res.json({ success: true, data: chats })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Create chat
router.post('/', async (req, res) => {
  try {
    const chat = new Chat(req.body)
    await chat.save()
    await chat.populate('participants', 'name email')
    res.status(201).json({ success: true, data: chat })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Get chat by ID
router.get('/:id', async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id).populate('participants', 'name email')
    if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' })
    res.json({ success: true, data: chat })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
