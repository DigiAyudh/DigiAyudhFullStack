export interface User {
  _id: string
  name: string
  email: string
  phone?: string
  role: 'admin' | 'employee' | 'client'
  profileImage?: string
  department?: string
  joinDate: Date
  isActive: boolean
  company?: string
  createdAt: Date
  updatedAt: Date
}

export interface Company {
  _id: string
  name: string
  email: string
  phone: string
  industry: string
  size: string
  website?: string
  logo?: string
  address: string
  city: string
  country: string
  postalCode: string
  subscription: 'free' | 'pro' | 'enterprise'
  subscriptionEndDate?: Date
  adminId: string
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  _id: string
  title: string
  description: string
  status: 'planning' | 'active' | 'completed' | 'on-hold'
  startDate: Date
  endDate?: Date
  budget?: number
  budget_used?: number
  priority: 'low' | 'medium' | 'high' | 'critical'
  clientId: string
  managerId: string
  teamMembers: string[]
  company: string
  createdAt: Date
  updatedAt: Date
}

export interface Task {
  _id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'review' | 'completed'
  priority: 'low' | 'medium' | 'high'
  projectId: string
  assignedTo: string
  createdBy: string
  dueDate: Date
  estimatedHours?: number
  actualHours?: number
  attachments?: string[]
  company: string
  createdAt: Date
  updatedAt: Date
}

export interface Employee {
  _id: string
  userId: string
  name: string
  email: string
  position: string
  department: string
  salary?: number
  joiningDate: Date
  phone: string
  address: string
  city: string
  country: string
  emergencyContact?: string
  emergencyPhone?: string
  isActive: boolean
  company: string
  createdAt: Date
  updatedAt: Date
}

export interface Lead {
  _id: string
  name: string
  email: string
  phone: string
  company: string
  source: string
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed'
  budget?: number
  notes?: string
  assignedTo?: string
  company_id: string
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  _id: string
  senderId: string
  senderName: string
  senderProfileImage?: string
  content: string
  chatId: string
  isRead: boolean
  createdAt: Date
}

export interface Chat {
  _id: string
  participants: string[]
  participantNames: string[]
  lastMessage?: string
  lastMessageTime?: Date
  isGroup: boolean
  groupName?: string
  groupImage?: string
  company: string
  createdAt: Date
  updatedAt: Date
}

export interface Notification {
  _id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  link?: string
  createdAt: Date
}

export interface Report {
  _id: string
  title: string
  type: 'projects' | 'employees' | 'tasks' | 'finances' | 'leads'
  filters: Record<string, any>
  createdBy: string
  company: string
  createdAt: Date
  updatedAt: Date
}

export interface AuthResponse {
  success: boolean
  message: string
  token?: string
  refreshToken?: string
  user?: User
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
  error?: string
}
