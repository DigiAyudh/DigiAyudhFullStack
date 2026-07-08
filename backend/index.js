import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

// Load environment variables
dotenv.config()

// Import routes
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import projectRoutes from './routes/projects.js'
import taskRoutes from './routes/tasks.js'
import employeeRoutes from './routes/employees.js'
import leadRoutes from './routes/leads.js'
import messageRoutes from './routes/messages.js'
import chatRoutes from './routes/chats.js'
import notificationRoutes from './routes/notifications.js'
import reportRoutes from './routes/reports.js'

const app = express()
const httpServer = createServer(app)
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/digiayudh')
  .then(() => console.log('[v0] MongoDB connected'))
  .catch((err) => console.error('[v0] MongoDB connection error:', err))

// Auth Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' })
  }
}

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/employees', employeeRoutes)
app.use('/api/leads', leadRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/chats', chatRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/reports', reportRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  })
})

// Socket.io events
io.on('connection', (socket) => {
  console.log('[v0] New client connected:', socket.id)

  socket.on('join-chat', (data) => {
    socket.join(`chat-${data.chatId}`)
    io.to(`chat-${data.chatId}`).emit('user-joined', { userId: socket.id })
  })

  socket.on('leave-chat', (data) => {
    socket.leave(`chat-${data.chatId}`)
  })

  socket.on('send-message', (data) => {
    io.to(`chat-${data.chatId}`).emit('message-received', data)
  })

  socket.on('user-typing', (data) => {
    io.to(`chat-${data.chatId}`).emit('user-typing', data)
  })

  socket.on('disconnect', () => {
    console.log('[v0] Client disconnected:', socket.id)
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[v0] Error:', err)
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  })
})

// Start server
const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => {
  console.log(`[v0] Server running on http://localhost:${PORT}`)
})
