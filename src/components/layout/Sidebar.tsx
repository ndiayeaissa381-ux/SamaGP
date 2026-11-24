import { useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Search,
  Package,
  Bell,
  User,
  Settings,
  Plane,
  PlusCircle,
  Inbox,
  Boxes,
  Users,
  BadgeCheck,
  Flag,
  BarChart3,
  Home,
  X,
} from 'lucide-react'
import type { Role } from '../../lib/types'
import { cx } from '../../lib/utils'
import { getDB } from '../../lib/db'

interface NavItem {
  to: string
  label: string
  icon: React.ComponentType<{ size?: number | string; className?: string }>
  badge?: number
}

function navFor(role: Role): NavItem[] {
  void getDB()
  switch (role) {
    case 'particulier':
      return [
        { to: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
        { to: '/rechercher', label: 'Rechercher', icon: Search },
        { to: '/colis', label: 'Mes colis', icon: Package },
        { to: '/notifications', label: 'Notifications', icon: Bell },
        { to: '/profile', label: 'Profil', icon: User },
        { to: '/settings', label: 'Paramètres', icon: Settings },
      ]
    case 'gp':
      return [
        { to: '/gp', label: 'Tableau de bord', icon: LayoutDashboard },
        { to: '/gp/voyages', label: 'Mes voyages', icon: Plane },
        { to: '/gp/voyages/nouveau', label: 'Publier un voyage', icon: PlusCircle },
        { to: '/gp/demandes', label: 'Demandes', icon: Inbox },
        { to: '/profile', label: 'Profil', icon: User },
        { to: '/settings', label: 'Paramètres', icon: Settings },
      ]
    case 'transitaire':
      return [
        { to: '/transitaire', label: 'Tableau de bord', icon: LayoutDashboard },
        { to: '/transitaire/offres', label: 'Mes offres', icon: Package },
        { to: '/transitaire/offres/nouveau', label: 'Publier une offre', icon: PlusCircle },
        { to: '/transitaire/demandes', label: 'Demandes', icon: Inbox },
        { to: '/transitaire/expeditions', label: 'Expéditions', icon: Boxes },
        { to: '/profile', label: 'Profil', icon: User },
        { to: '/settings', label: 'Paramètres', icon: Settings },
      ]
    case 'admin':
      return [
        { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/admin/utilisateurs', label: 'Utilisateurs', icon: Users },
        { to: '/admin/verifications', label: 'Vérifications', icon: BadgeCheck },
        { to: '/admin/offres', label: 'Offres', icon: Package },
        { to: '/admin/colis', label: 'Colis', icon: Boxes },
        { to: '/admin/signalements', label: 'Signalements', icon: Flag },
        { to: '/admin/statistiques', label: 'Statistiques', icon: BarChart3 },
      ]
  }
}

export function Sidebar({ role, open, onClose }: { role: Role; open: boolean; onClose: () => void }) {
  const items = navFor(role)
  const location = useLocation()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (open && ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open, onClose])

  const content = (
    <nav className="flex flex-1 flex-col gap-1 px-3 py-4" aria-label="Navigation du tableau de bord">
      {items.map((item) => {
        const Icon = item.icon
        const isActive =
          item.to === '/dashboard'
            ? location.pathname === '/dashboard'
            : location.pathname.startsWith(item.to)
        return (
          <NavLink
            key={item.to + item.label}
            to={item.to}
            onClick={onClose}
            aria-current={isActive ? 'page' : undefined}
            className={({ isActive: active }) =>
              cx(
                'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-[#1B3A70] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-[#EEF2F8] hover:text-[#0F2450]'
              )
            }
          >
            <Icon size={18} className="shrink-0" />
            <span className="flex-1">{item.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )

  return (
    <>
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
        {content}
      </aside>

      <div
        className={cx(
          'fixed inset-0 z-[60] bg-slate-900/50 lg:hidden transition-opacity',
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        aria-hidden={!open}
      >
        <div
          ref={ref}
          role="dialog"
          aria-label="Menu latéral"
          className={cx(
            'absolute left-0 top-0 h-full w-72 bg-white shadow-2xl transition-transform duration-200 flex flex-col',
            open ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <span className="flex items-center gap-2">
              <Home size={18} className="text-[#2A50A0]" />
              <span className="font-display text-lg font-extrabold text-[#0F2450]">
                SAMA<span className="text-[#059669]"> GP</span>
              </span>
            </span>
            <button
              onClick={onClose}
              aria-label="Fermer le menu"
              className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
          </div>
          {content}
        </div>
      </div>
    </>
  )
}