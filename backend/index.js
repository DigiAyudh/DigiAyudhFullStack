import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

dotenv.config()

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
import { verifyToken } from './middleware/auth.js'

const app = express()
const httpServer = createServer(app)

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: frontendUrl,
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

app.use(helmet())
app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many authentication attempts. Please try again later.' },
})

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
})

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/digiayudh')
  .then(() => console.log('[DigiAyudh] MongoDB connected'))
  .catch((err) => console.error('[DigiAyudh] MongoDB connection error:', err))

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  })
})

app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/users', apiLimiter, userRoutes)
app.use('/api/projects', apiLimiter, verifyToken, projectRoutes)
app.use('/api/tasks', apiLimiter, verifyToken, taskRoutes)
app.use('/api/employees', apiLimiter, verifyToken, employeeRoutes)
app.use('/api/leads', apiLimiter, verifyToken, leadRoutes)
app.use('/api/messages', apiLimiter, verifyToken, messageRoutes)
app.use('/api/chats', apiLimiter, verifyToken, chatRoutes)
app.use('/api/notifications', apiLimiter, verifyToken, notificationRoutes)
app.use('/api/reports', apiLimiter, verifyToken, reportRoutes)

io.use((socket, next) => {
  const token = socket.handshake.auth?.token
  if (!token) {
    return next(new Error('Authentication required'))
  }
  try {
    const secret = process.env.JWT_SECRET
    if (!secret) return next(new Error('Server configuration error'))
    const decoded = jwt.verify(token, secret)
    socket.userId = decoded.userId
    next()
  } catch {
    next(new Error('Invalid token'))
  }
})

io.on('connection', (socket) => {
  console.log('[DigiAyudh] Client connected:', socket.id, 'user:', socket.userId)

  socket.on('join-chat', (data) => {
    socket.join(`chat-${data.chatId}`)
    io.to(`chat-${data.chatId}`).emit('user-joined', { userId: socket.userId })
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
    console.log('[DigiAyudh] Client disconnected:', socket.id)
  })
})

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Resource not found' })
})

app.use((err, req, res, next) => {
  console.error('[DigiAyudh] Error:', err)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => {
  console.log(`[DigiAyudh] Server running on http://localhost:${PORT}`)
})
