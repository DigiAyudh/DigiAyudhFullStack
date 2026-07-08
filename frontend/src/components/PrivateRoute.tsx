import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '../redux/hooks'
import { Loader } from 'lucide-react'

interface PrivateRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'employee' | 'client'
}

const roleDashboardMap = {
  admin: '/admin/dashboard',
  employee: '/employee/dashboard',
  client: '/client/dashboard',
} as const

export default function PrivateRoute({ children, requiredRole }: PrivateRouteProps) {
  const { isAuthenticated, user, initializing } = useAppSelector((state) => state.auth)
  const location = useLocation()

  if (initializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader className="animate-spin text-primary" size={32} />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    const correctDashboard = roleDashboardMap[user.role]
    return <Navigate to={correctDashboard} replace />
  }

  return <>{children}</>
}
