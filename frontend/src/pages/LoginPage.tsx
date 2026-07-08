import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { login } from '../redux/slices/authSlice'
import { Mail, Lock, Loader } from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.auth)
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await dispatch(login(formData))
    if (result.payload?.user) {
      const user = result.payload.user
      if (user.role === 'admin') navigate('/admin/dashboard')
      else if (user.role === 'employee') navigate('/employee/dashboard')
      else if (user.role === 'client') navigate('/client/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <img src="/digiayudh-logo.svg" alt="DigiAyudh" className="h-12 w-12 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-text">Welcome Back</h1>
          <p className="text-text-light mt-2">Sign in to your DigiAyudh account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-text-light" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-text-light" size={20} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
          >
            {loading ? (
              <>
                <Loader size={20} className="animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-text-light">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-primary hover:text-primary-dark font-medium">
              Sign up
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-text-light hover:text-text text-sm">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
