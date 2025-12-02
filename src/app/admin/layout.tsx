import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Building2, Calendar, Users } from 'lucide-react'
import { LogoutButton } from '@/components/admin/LogoutButton'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">🏢</div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  MOSTI STEM & AI
                </h1>
                <p className="text-xs text-gray-500">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {session.user?.name || session.user?.email}
              </span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            <Link
              href="/admin/dashboard"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LayoutDashboard className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-700">Dashboard</span>
            </Link>
            <Link
              href="/admin/event"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Calendar className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-700">Event Settings</span>
            </Link>
            <Link
              href="/admin/booths"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Building2 className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-700">Booth Management</span>
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Users className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-700">User Management</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
