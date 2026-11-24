import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Search,
  Settings,
  User,
  X,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getProfile, getDB } from '../../lib/db'
import { timeAgo } from '../../lib/utils'
import { Avatar } from '../ui/Avatar'
import { Badge } from '../ui/Badge'
import { useDB } from '../../hooks'
import { cx } from '../../lib/utils'
import { useToast } from '../../context/ToastContext'
import { openCommandPalette } from '../CommandPalette'

const publicLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/rechercher', label: 'Rechercher' },
  { to: '/suivi', label: 'Suivi colis' },
  { to: '/comment-ca-marche', label: 'Comment ça marche' },
  { to: '/devenir-gp', label: 'Devenir GP' },
  { to: '/devenir-transitaire', label: 'Transitaire' },
]

function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className="flex items-center gap-2.5"
      aria-label="SAMA GP — Accueil"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1B3A70]">
        <Package size={18} className="text-[#D1FAE5]" />
      </span>
      <span className="font-display text-xl font-extrabold tracking-tight text-[#0F2450]">
        SAMA<span className="text-[#059669]"> GP</span>
      </span>
    </Link>
  )
}

function RoleLabel({ role }: { role: string }) {
  const label =
    role === 'admin'
      ? 'Admin'
      : role === 'gp'
        ? 'GP / Voyageur'
        : role === 'transitaire'
          ? 'Transitaire'
          : 'Particulier'
  return <Badge tone={role === 'admin' ? 'dark' : role === 'gp' ? 'blue' : role === 'transitaire' ? 'violet' : 'green'}>{label}</Badge>
}

export function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const bellRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  useDB()

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false)
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const notifications = user ? getDB().notifications.filter((n) => n.user_id === user.id) : []
  const unread = notifications.filter((n) => !n.read).length
  const profile = user ? getProfile(user.id) : null

  const handleLogout = () => {
    logout()
    toast('Vous avez été déconnecté.', 'info')
    navigate('/')
  }

  const roleTo = (role: string) =>
    role === 'admin' ? '/admin' : role === 'gp' ? '/gp' : role === 'transitaire' ? '/transitaire' : '/dashboard'

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Brand onClick={() => setMobileOpen(false)} />

        {!user && (
          <nav className="hidden lg:flex items-center gap-1" aria-label="Navigation principale">
            {publicLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  cx(
                    'rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#0F2450]',
                    isActive && 'text-[#0F2450] bg-slate-50'
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={openCommandPalette}
            className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-500 transition-colors hover:border-slate-300 hover:text-[#0F2450] md:inline-flex"
            aria-label="Ouvrir la recherche rapide (Ctrl K)"
          >
            <Search size={16} />
            <span className="hidden xl:inline">Recherche rapide</span>
            <kbd className="hidden rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 xl:inline">
              Ctrl K
            </kbd>
          </button>
          {user ? (
            <>
              <div className="relative" ref={bellRef}>
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    setBellOpen((v) => !v)
                  }}
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-[#0F2450]"
                  aria-label={`Notifications${unread ? ` (${unread} non lues)` : ''}`}
                >
                  <Bell size={19} />
                  {unread > 0 && (
                    <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#059669] px-1 text-[10px] font-bold text-white">
                      {unread}
                    </span>
                  )}
                </button>
                {bellOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                    <p className="px-3 py-2 text-sm font-bold text-[#0F2450]">Notifications</p>
                    {notifications.length === 0 ? (
                      <p className="px-3 py-6 text-center text-sm text-[#64748B]">Aucune notification.</p>
                    ) : (
                      <ul className="max-h-80 overflow-auto">
                        {notifications.slice(0, 6).map((n) => (
                          <li key={n.id} className="px-3 py-2.5 rounded-xl hover:bg-slate-50">
                            <p className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                              {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />}
                              {n.title}
                            </p>
                            <p className="mt-0.5 pl-3.5 text-sm text-[#64748B]">{n.body}</p>
                            <p className="mt-1 pl-3.5 text-xs text-slate-400">{timeAgo(n.created_at)}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                    <Link
                      to="/notifications"
                      onClick={() => setBellOpen(false)}
                      className="block rounded-xl px-3 py-2 text-center text-sm font-semibold text-[#1B3A70] hover:bg-[#EEF2F8]"
                    >
                      Voir toutes les notifications
                    </Link>
                  </div>
                )}
              </div>

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => {
                    setBellOpen(false)
                    setMenuOpen((v) => !v)
                  }}
                  className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-100"
                  aria-label="Menu du compte"
                >
                  <Avatar
                    src={profile?.avatar_url}
                    name={profile ? `${profile.first_name} ${profile.last_name}`.trim() : ''}
                    className="h-9 w-9 text-xs"
                  />
                  <ChevronDown size={16} className="text-slate-400 hidden sm:block" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                    <div className="px-3 py-2.5">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {profile ? `${profile.first_name} ${profile.last_name}`.trim() : ''}
                      </p>
                      <p className="mt-1 flex items-center gap-2 text-xs text-[#64748B]">
                        <RoleLabel role={user.role} />
                      </p>
                    </div>
                    <div className="my-1 h-px bg-slate-100" />
                    <button
                      onClick={() => {
                        setMenuOpen(false)
                        navigate(roleTo(user.role))
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <LayoutDashboard size={16} className="text-slate-400" />
                      Tableau de bord
                    </button>
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <User size={16} className="text-slate-400" />
                      Mon profil
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <Settings size={16} className="text-slate-400" />
                      Paramètres
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} />
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#1B3A70] transition-colors hover:bg-slate-50"
              >
                Se connecter
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-[#1B3A70] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0F2450]"
              >
                Créer un compte
              </Link>
            </div>
          )}

          <button
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="lg:hidden border-t border-slate-100 bg-white px-4 py-3" aria-label="Navigation mobile">
          <div className="flex flex-col gap-1">
            {(user ? [] : publicLinks).map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cx(
                    'rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50',
                    isActive && 'bg-slate-50 text-[#0F2450]'
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            {user ? (
              <>
                <Link
                  to={roleTo(user.role)}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Tableau de bord
                </Link>
                <Link
                  to="/suivi"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Suivre un colis
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Mon profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Se déconnecter
                </button>
              </>
            ) : (
              <div className="mt-2 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-[#1B3A70]"
                >
                  Se connecter
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="w-full rounded-xl bg-[#1B3A70] px-4 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Créer un compte
                </Link>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}