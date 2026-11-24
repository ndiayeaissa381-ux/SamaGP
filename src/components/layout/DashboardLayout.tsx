import { useEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { useAuth } from '../../context/AuthContext'
import { SITE_NAME, titleForPath } from '../../lib/seo'

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    document.title = `${titleForPath(pathname)} · ${SITE_NAME}`
  }, [pathname])

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="mx-auto flex max-w-7xl gap-0 px-0 sm:px-6 lg:gap-6">
        <Sidebar role={user.role} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="min-w-0 flex-1 px-4 pb-16 sm:px-0 sm:py-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mt-4 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600"
            aria-label="Ouvrir le menu latéral"
          >
            <Menu size={20} />
          </button>
          {children}
        </main>
      </div>
    </div>
  )
}