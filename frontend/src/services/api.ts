import axios, { AxiosInstance, AxiosError } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export type UserRole = 'admin' | 'employee' | 'client'

export interface ClientSignupData {
  name: string
  companyName: string
  email: string
  countryCode: string
  phone: string
  password: string
  confirmPassword: string
  companyType: string
  city: string
  state: string
  country: string
  termsAccepted: boolean
  verificationToken?: string
}

export interface CreateEmployeeData {
  name: string
  email: string
  password?: string
  phone?: string
  countryCode?: string
  department?: string
  position?: string
}

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
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
      async (error: AxiosError) => {
        const originalRequest = error.config as typeof error.config & { _retry?: boolean }

        if (
          error.response?.status === 401 &&
          originalRequest &&
          !originalRequest._retry &&
          !originalRequest.url?.includes('/auth/login') &&
          !originalRequest.url?.includes('/auth/refresh') &&
          !originalRequest.url?.includes('/auth/signup')
        ) {
          originalRequest._retry = true
          try {
            const refreshToken = localStorage.getItem('refreshToken')
            if (!refreshToken) throw new Error('No refresh token')

            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken })
            const { token, refreshToken: newRefreshToken } = response.data

            localStorage.setItem('token', token)
            if (newRefreshToken) {
              localStorage.setItem('refreshToken', newRefreshToken)
            }

            originalRequest.headers.Authorization = `Bearer ${token}`
            return this.client(originalRequest)
          } catch {
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/signup')) {
              window.location.href = '/login'
            }
          }
        }

        return Promise.reject(error)
      }
    )
  }

  getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data as { message?: string; errors?: { message: string }[] }
      if (data?.errors?.length) {
        return data.errors.map((e) => e.message).join('. ')
      }
      if (data?.message) return data.message
      if (error.response?.status === 403) return 'You do not have permission to perform this action'
      if (error.response?.status === 404) return 'Resource not found'
      if (error.response?.status === 500) return 'Server error. Please try again later'
      if (!error.response) return 'Network error. Please check your connection'
    }
    return 'An unexpected error occurred'
  }

  // Auth
  login(email: string, password: string, expectedRole?: UserRole) {
    return this.client.post('/auth/login', { email, password, expectedRole })
  }

  clientSignup(data: ClientSignupData) {
    return this.client.post('/auth/signup', data)
  }

  getMe() {
    return this.client.get('/auth/me')
  }

  logout() {
    return this.client.post('/auth/logout')
  }

  sendOtp(phone: string, countryCode: string) {
    return this.client.post('/auth/send-otp', { phone, countryCode })
  }

  verifyOtp(phone: string, otp: string) {
    return this.client.post('/auth/verify-otp', { phone, otp })
  }

  refresh(refreshToken: string) {
    return this.client.post('/auth/refresh', { refreshToken })
  }

  // Admin employee management
  getEmployeeAccounts() {
    return this.client.get('/users/employees')
  }

  createEmployeeAccount(data: CreateEmployeeData) {
    return this.client.post('/users/employees', data)
  }

  updateEmployeeAccount(id: string, data: Record<string, unknown>) {
    return this.client.put(`/users/employees/${id}`, data)
  }

  resetEmployeePassword(id: string, newPassword: string) {
    return this.client.post(`/users/employees/${id}/reset-password`, { newPassword })
  }

  deleteEmployeeAccount(id: string) {
    return this.client.delete(`/users/employees/${id}`)
  }

  assignClientToEmployee(clientId: string, employeeId: string) {
    return this.client.post('/users/assign-client', { clientId, employeeId })
  }

  // Users
  getUsers(company: string) {
    return this.client.get(`/users?company=${company}`)
  }

  getUserById(id: string) {
    return this.client.get(`/users/${id}`)
  }

  updateUser(id: string, data: Record<string, unknown>) {
    return this.client.put(`/users/${id}`, data)
  }

  // Projects
  getProjects(company: string) {
    return this.client.get(`/projects?company=${company}`)
  }

  createProject(data: Record<string, unknown>) {
    return this.client.post('/projects', data)
  }

  getProjectById(id: string) {
    return this.client.get(`/projects/${id}`)
  }

  updateProject(id: string, data: Record<string, unknown>) {
    return this.client.put(`/projects/${id}`, data)
  }

  deleteProject(id: string) {
    return this.client.delete(`/projects/${id}`)
  }

  // Tasks
  getTasks(company: string, projectId?: string) {
    const url = projectId
      ? `/tasks?company=${company}&projectId=${projectId}`
      : `/tasks?company=${company}`
    return this.client.get(url)
  }

  createTask(data: Record<string, unknown>) {
    return this.client.post('/tasks', data)
  }

  getTaskById(id: string) {
    return this.client.get(`/tasks/${id}`)
  }

  updateTask(id: string, data: Record<string, unknown>) {
    return this.client.put(`/tasks/${id}`, data)
  }

  deleteTask(id: string) {
    return this.client.delete(`/tasks/${id}`)
  }

  // Employees (HR records)
  getEmployees(company: string) {
    return this.client.get(`/employees?company=${company}`)
  }

  createEmployee(data: Record<string, unknown>) {
    return this.client.post('/employees', data)
  }

  getEmployeeById(id: string) {
    return this.client.get(`/employees/${id}`)
  }

  updateEmployee(id: string, data: Record<string, unknown>) {
    return this.client.put(`/employees/${id}`, data)
  }

  deleteEmployee(id: string) {
    return this.client.delete(`/employees/${id}`)
  }

  // Leads
  getLeads(company: string) {
    return this.client.get(`/leads?company_id=${company}`)
  }

  createLead(data: Record<string, unknown>) {
    return this.client.post('/leads', data)
  }

  getLeadById(id: string) {
    return this.client.get(`/leads/${id}`)
  }

  updateLead(id: string, data: Record<string, unknown>) {
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

  createChat(data: Record<string, unknown>) {
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

  createReport(data: Record<string, unknown>) {
    return this.client.post('/reports', data)
  }

  exportReport(reportId: string) {
    return this.client.get(`/reports/${reportId}/export`, { responseType: 'blob' })
  }
}

export default new ApiClient()
