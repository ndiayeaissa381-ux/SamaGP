import { Link } from 'react-router-dom'
import { Users, BadgeCheck, Package, Boxes, Flag, ArrowRight, TrendingUp } from 'lucide-react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { Stat } from '../components/ui/Stat'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { useAuth } from '../context/AuthContext'
import { getDB } from '../lib/db'
import { useDB } from '../hooks'
import { formatDateShort, timeAgo } from '../lib/utils'

export default function AdminDashboard() {
  const { user } = useAuth()
  useDB()
  if (!user) return null

  const db = getDB()
  const pendingVerifs = db.verifications.filter((v) => v.status === 'pending')
  const activeOffers = db.offers.filter((o) => o.status === 'active')
  const shipments = db.shipments
  const openReports = db.reports.filter((r) => r.status === 'open')

  return (
    <DashboardLayout>
      <div className="pt-6 sm:pt-0">
        <h1 className="font-display text-2xl font-bold text-[#0F2450] sm:text-3xl">
          Bonjour {user.first_name}
        </h1>
        <p className="mt-1.5 text-[#64748B]">
          Vue d'ensemble de la plateforme SAMA GP.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Utilisateurs" value={String(db.profiles.length)} icon={<Users size={20} />} tone="blue" />
          <Stat label="Offres actives" value={String(activeOffers.length)} icon={<Package size={20} />} tone="blue" />
          <Stat label="Expéditions" value={String(shipments.length)} icon={<Boxes size={20} />} tone="green" />
          <Stat label="Vérifications en attente" value={String(pendingVerifs.length)} icon={<BadgeCheck size={20} />} tone="amber" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#0F2450]">Vérifications en attente</h2>
              <Link to="/admin/verifications" className="text-sm font-semibold text-[#1B3A70] hover:text-[#0F2450]">
                Tout voir <ArrowRight size={14} className="inline" />
              </Link>
            </div>
            <Card className="divide-y divide-slate-100">
              {pendingVerifs.length === 0 ? (
                <p className="p-6 text-center text-sm text-[#64748B]">Aucune vérification en attente.</p>
              ) : (
                pendingVerifs.slice(0, 4).map((v) => {
                  const p = db.profiles.find((x) => x.id === v.user_id)
                  return (
                    <div key={v.id} className="flex items-center justify-between gap-3 p-4">
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {p ? `${p.first_name} ${p.last_name}`.trim() : 'Utilisateur'}
                        </p>
                        <p className="text-xs text-[#64748B]">
                          Demande : {v.requested_role === 'gp' ? 'GP / Voyageur' : 'Transitaire'} · {timeAgo(v.created_at)}
                        </p>
                      </div>
                      <Badge tone="amber">En attente</Badge>
                    </div>
                  )
                })
              )}
            </Card>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#0F2450]">Signalements ouverts</h2>
              <Link to="/admin/signalements" className="text-sm font-semibold text-[#1B3A70] hover:text-[#0F2450]">
                Tout voir <ArrowRight size={14} className="inline" />
              </Link>
            </div>
            <Card className="divide-y divide-slate-100">
              {openReports.length === 0 ? (
                <p className="p-6 text-center text-sm text-[#64748B]">Aucun signalement ouvert.</p>
              ) : (
                openReports.slice(0, 4).map((r) => (
                  <div key={r.id} className="flex items-center justify-between gap-3 p-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900">{r.reason}</p>
                      <p className="text-xs text-[#64748B]">
                        Signalé le {formatDateShort(r.created_at)} · #{r.reported_user_id.slice(0, 6)}
                      </p>
                    </div>
                    <Badge tone="red"><Flag size={12} /> Ouvert</Badge>
                  </div>
                ))
              )}
            </Card>
          </section>
        </div>

        <Card className="mt-6 p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-[#0F2450]">
            <TrendingUp size={18} className="text-[#059669]" /> Activité récente
          </h2>
          <p className="mt-2 text-sm text-[#64748B]">
            La plateforme connecte des expéditeurs et des transporteurs sur des trajets
            comme Dakar → Paris, Dakar → Lyon ou Dakar → Milan. Consultez les pages
            dédiées pour piloter les utilisateurs, les offres et les colis.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/admin/utilisateurs" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#1B3A70] hover:bg-slate-50">Utilisateurs</Link>
            <Link to="/admin/offres" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#1B3A70] hover:bg-slate-50">Offres</Link>
            <Link to="/admin/colis" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#1B3A70] hover:bg-slate-50">Colis</Link>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}