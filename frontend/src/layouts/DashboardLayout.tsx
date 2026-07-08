import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="ml-64 flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
