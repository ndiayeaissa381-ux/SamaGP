import { Link } from 'react-router-dom'
import {
  Package,
  History,
  Bell,
  Settings,
  MapPin,
  BadgeCheck,
  Plane,
  Truck,
  Mail,
  Phone,
} from 'lucide-react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { getProfile, requestRoleChange, getDB } from '../lib/db'
import { useToast } from '../context/ToastContext'
import { useDB } from '../hooks'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'
import { formatDate } from '../lib/utils'

export default function Profile() {
  const { user } = useAuth()
  const { toast } = useToast()
  useDB()
  if (!user) return null

  const profile = getProfile(user.id) ?? user
  const pendingRequest = getDB().verifications.find(
    (v) => v.user_id === user.id && v.status === 'pending'
  )
  const displayName = profile.company || `${profile.first_name} ${profile.last_name}`.trim()
  const roleLabel =
    user.role === 'admin'
      ? 'Admin'
      : user.role === 'gp'
        ? 'GP / Voyageur'
        : user.role === 'transitaire'
          ? 'Transitaire'
          : 'Particulier'

  const requestRole = (role: 'gp' | 'transitaire') => {
    if (pendingRequest) {
      toast('Une demande de vérification est déjà en cours.', 'info')
      return
    }
    requestRoleChange(user.id, role)
    toast('Votre demande de vérification a été envoyée à l\'administration.')
  }

  return (
    <DashboardLayout>
      <div className="pt-6 sm:pt-0">
        <h1 className="font-display text-2xl font-bold text-[#0F2450] sm:text-3xl">Mon profil</h1>
        <p className="mt-1.5 text-[#64748B]">Gérez vos informations personnelles et votre compte.</p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
          <div className="space-y-5">
            <Card className="p-6 text-center">
              <Avatar
                src={profile.avatar_url}
                name={displayName}
                className="mx-auto h-24 w-24 text-2xl"
              />
              <h2 className="mt-4 font-display text-xl font-bold text-[#0F2450]">{displayName}</h2>
              <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-[#64748B]">
                <MapPin size={14} /> {profile.city}, {profile.country}
              </p>
              <div className="mt-4 flex flex-col items-center gap-2">
                <Badge tone={user.role === 'admin' ? 'dark' : user.role === 'gp' ? 'blue' : user.role === 'transitaire' ? 'violet' : 'green'}>
                  {roleLabel}
                </Badge>
                {profile.verification_status === 'verified' ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#D1FAE5] px-2.5 py-0.5 text-xs font-semibold text-[#047857]">
                    <BadgeCheck size={13} /> Profil vérifié
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                    Profil non vérifié
                  </span>
                )}
              </div>
              <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-5 text-left text-sm">
                <p className="flex items-center gap-2 text-[#64748B]">
                  <Mail size={15} className="shrink-0 text-[#2A50A0]" /> {profile.email}
                </p>
                <p className="flex items-center gap-2 text-[#64748B]">
                  <Phone size={15} className="shrink-0 text-[#2A50A0]" /> {profile.phone}
                </p>
              </div>
              <div className="mt-5 rounded-xl bg-[#F8FAFC] p-3 text-left">
                <p className="text-xs uppercase tracking-wide text-[#64748B]">Type de compte</p>
                <p className="mt-1 text-sm font-bold text-[#0F2450]">{roleLabel}</p>
                <p className="mt-1 text-xs text-[#64748B]">
                  Le rôle ne peut pas être modifié manuellement. Depuis le {formatDate(profile.created_at)}, votre compte est de type {roleLabel.toLowerCase()}.
                </p>
              </div>
            </Card>

            {user.role === 'particulier' && (
              <Card className="p-5">
                <h3 className="font-display font-bold text-[#0F2450]">Devenir un professionnel</h3>
                <p className="mt-1.5 text-sm text-[#64748B]">
                  Demandez à devenir GP ou transitaire. L'administration vérifiera votre demande
                  avant tout changement de rôle.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Button variant="secondary" size="sm" onClick={() => requestRole('gp')} disabled={!!pendingRequest}>
                    <Plane size={15} /> Devenir GP
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => requestRole('transitaire')} disabled={!!pendingRequest}>
                    <Truck size={15} /> Transitaire
                  </Button>
                </div>
                {pendingRequest && (
                  <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                    Demande de vérification en cours d'examen par l'administration.
                  </p>
                )}
              </Card>
            )}
          </div>

          <div className="space-y-4">
            {[
              { to: '/colis', icon: <Package size={18} />, title: 'Mes colis', desc: 'Consultez vos expéditions et leurs suivis.' },
              { to: '/notifications', icon: <Bell size={18} />, title: 'Notifications', desc: 'Retrouvez toutes vos alertes et messages.' },
              { to: '/settings', icon: <Settings size={18} />, title: 'Paramètres', desc: 'Modifiez vos informations personnelles.' },
            ].map((item) => (
              <Link key={item.to} to={item.to}>
                <Card className="flex items-center gap-4 p-5 transition-colors hover:border-[#2A50A0]/40">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF2F8] text-[#1B3A70]">
                    {item.icon}
                  </span>
                  <div>
                    <p className="font-semibold text-[#0F2450]">{item.title}</p>
                    <p className="text-sm text-[#64748B]">{item.desc}</p>
                  </div>
                </Card>
              </Link>
            ))}

            <Card className="p-5">
              <h3 className="flex items-center gap-2 font-display font-bold text-[#0F2450]">
                <History size={17} /> Historique
              </h3>
              <p className="mt-2 text-sm text-[#64748B]">
                Retrouvez l'historique de vos expéditions, demandes et évaluations dans le
                tableau de bord. Le suivi de chaque colis est disponible dans « Mes colis ».
              </p>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}