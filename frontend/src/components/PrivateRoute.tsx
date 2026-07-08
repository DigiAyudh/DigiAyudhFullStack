import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../redux/hooks'

interface PrivateRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'employee' | 'client'
}

export default function PrivateRoute({ children, requiredRole }: PrivateRouteProps) {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" />
  }

  return <>{children}</>
}
