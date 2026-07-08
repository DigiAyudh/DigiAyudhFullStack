import axios, { AxiosInstance } from 'axios'
import { mockLogin, mockSignup } from './mockAuth'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          try {
            const refreshToken = localStorage.getItem('refreshToken')
            const response = await this.client.post('/auth/refresh', { refreshToken })
            localStorage.setItem('token', response.data.token)
            originalRequest.headers.Authorization = `Bearer ${response.data.token}`
            return this.client(originalRequest)
          } catch {
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            window.location.href = '/login'
          }
        }
        return Promise.reject(error)
      }
    )
  }

  // Auth
  async login(email: string, password: string) {
    if (USE_MOCK_AUTH) {
      const result = await mockLogin(email, password)
      return { data: result }
    }

    return this.client.post('/auth/login', { email, password })
  }

  async signup(data: {
    name: string
    email: string
    password: string
    role: string
    companyName?: string
  }) {
    if (USE_MOCK_AUTH) {
      const result = await mockSignup(data)
      return { data: result }
    }

    return this.client.post('/auth/signup', data)
  }

  refresh(refreshToken: string) {
    return this.client.post('/auth/refresh', { refreshToken })
  }

  // Users
  getUsers(company: string) {
    return this.client.get(`/users?company=${company}`)
  }

  getUserById(id: string) {
    return this.client.get(`/users/${id}`)
  }

  updateUser(id: string, data: any) {
    return this.client.put(`/users/${id}`, data)
  }

  // Projects
  getProjects(company: string) {
    return this.client.get(`/projects?company=${company}`)
  }

  createProject(data: any) {
    return this.client.post('/projects', data)
  }

  getProjectById(id: string) {
    return this.client.get(`/projects/${id}`)
  }

  updateProject(id: string, data: any) {
    return this.client.put(`/projects/${id}`, data)
  }

  deleteProject(id: string) {
    return this.client.delete(`/projects/${id}`)
  }

  // Tasks
  getTasks(company: string, projectId?: string) {
    const url = projectId ? `/tasks?company=${company}&projectId=${projectId}` : `/tasks?company=${company}`
    return this.client.get(url)
  }

  createTask(data: any) {
    return this.client.post('/tasks', data)
  }

  getTaskById(id: string) {
    return this.client.get(`/tasks/${id}`)
  }

  updateTask(id: string, data: any) {
    return this.client.put(`/tasks/${id}`, data)
  }

  deleteTask(id: string) {
    return this.client.delete(`/tasks/${id}`)
  }

  // Employees
  getEmployees(company: string) {
    return this.client.get(`/employees?company=${company}`)
  }

  createEmployee(data: any) {
    return this.client.post('/employees', data)
  }

  getEmployeeById(id: string) {
    return this.client.get(`/employees/${id}`)
  }

  updateEmployee(id: string, data: any) {
    return this.client.put(`/employees/${id}`, data)
  }

  deleteEmployee(id: string) {
    return this.client.delete(`/employees/${id}`)
  }

  // Leads
  getLeads(company: string) {
    return this.client.get(`/leads?company=${company}`)
  }

  createLead(data: any) {
    return this.client.post('/leads', data)
  }

  getLeadById(id: string) {
    return this.client.get(`/leads/${id}`)
  }

  updateLead(id: string, data: any) {
    return this.client.put(`/leads/${id}`, data)
  }

  deleteLead(id: string) {
    return this.client.delete(`/leads/${id}`)
  }

  // Messages
  getMessages(chatId: string) {
    return this.client.get(`/messages/${chatId}`)
  }

  // Chats
  getChats(company: string, userId: string) {
    return this.client.get(`/chats?company=${company}&userId=${userId}`)
  }

  createChat(data: any) {
    return this.client.post('/chats', data)
  }

  // Notifications
  getNotifications(userId: string) {
    return this.client.get(`/notifications/${userId}`)
  }

  markNotificationAsRead(id: string) {
    return this.client.put(`/notifications/${id}/read`)
  }

  // Reports
  getReports(company: string) {
    return this.client.get(`/reports?company=${company}`)
  }

  createReport(data: any) {
    return this.client.post('/reports', data)
  }

  exportReport(reportId: string) {
    return this.client.get(`/reports/${reportId}/export`, { responseType: 'blob' })
  }
}

export default new ApiClient()
