import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import apiClient, { ClientSignupData, UserRole } from '../../services/api'
import { User } from '../../types'

export const login = createAsyncThunk(
  'auth/login',
  async (
    { email, password, expectedRole }: { email: string; password: string; expectedRole: UserRole },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.login(email, password, expectedRole)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('refreshToken', response.data.refreshToken)
      return response.data
    } catch (error) {
      return rejectWithValue(apiClient.getErrorMessage(error))
    }
  }
)

export const clientSignup = createAsyncThunk(
  'auth/clientSignup',
  async (data: ClientSignupData, { rejectWithValue }) => {
    try {
      const response = await apiClient.clientSignup(data)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('refreshToken', response.data.refreshToken)
      return response.data
    } catch (error) {
      return rejectWithValue(apiClient.getErrorMessage(error))
    }
  }
)

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        return rejectWithValue('No token')
      }
      const response = await apiClient.getMe()
      return response.data.user
    } catch (error) {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      return rejectWithValue(apiClient.getErrorMessage(error))
    }
  }
)

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await apiClient.logout()
  } catch {
    // Clear local session even if server call fails
  }
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  return null
})

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  initializing: boolean
  error: string | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  initializing: !!localStorage.getItem('token'),
  error: null,
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.initializing = false
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(clientSignup.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(clientSignup.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.initializing = false
      })
      .addCase(clientSignup.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.initializing = true
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.initializing = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.initializing = false
        state.user = null
        state.token = null
        state.isAuthenticated = false
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = null
        state.initializing = false
      })
  },
})

export const { clearError, setUser } = authSlice.actions
export default authSlice.reducer
