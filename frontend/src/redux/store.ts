import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import projectsReducer from './slices/projectsSlice'
import tasksReducer from './slices/tasksSlice'
import employeesReducer from './slices/employeesSlice'
import leadsReducer from './slices/leadsSlice'
import chatsReducer from './slices/chatsSlice'
import notificationsReducer from './slices/notificationsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    tasks: tasksReducer,
    employees: employeesReducer,
    leads: leadsReducer,
    chats: chatsReducer,
    notifications: notificationsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
