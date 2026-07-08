import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { signup } from '../redux/slices/authSlice'
import { Mail, Lock, User, Loader, Building2 } from 'lucide-react'

export default function SignupPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.auth)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
    companyName: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await dispatch(signup(formData))
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
          <h1 className="text-3xl font-bold text-text">Create Account</h1>
          <p className="text-text-light mt-2">Join DigiAyudh today</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-text-light" size={20} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

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

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">Company Name</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 text-text-light" size={20} />
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Your Company"
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
              <option value="client">Client</option>
            </select>
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
                Creating account...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-text-light">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary-dark font-medium">
              Sign in
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
