import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { fetchCurrentUser } from '../redux/slices/authSlice'
import { Loader } from 'lucide-react'

interface AuthInitializerProps {
  children: React.ReactNode
}

export default function AuthInitializer({ children }: AuthInitializerProps) {
  const dispatch = useAppDispatch()
  const { initializing, token } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser())
    }
  }, [dispatch, token])

  if (initializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin text-primary mx-auto mb-4" size={40} />
          <p className="text-text-light">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
