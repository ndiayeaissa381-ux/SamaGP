import { useMemo } from 'react'
import { Users, BadgeCheck, Package, Boxes, Flag, TrendingUp } from 'lucide-react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { Stat } from '../components/ui/Stat'
import { Card } from '../components/ui/Card'
import { useAuth } from '../context/AuthContext'
import { getDB } from '../lib/db'
import { useDB } from '../hooks'

export default function AdminStatistiques() {
  const { user } = useAuth()
  useDB()
  if (!user) return null

  const db = getDB()

  const stats = useMemo(() => {
    const routes = new Map<string, number>()
    db.shipments.forEach((s) => {
      const key = `${s.from} → ${s.to}`
      routes.set(key, (routes.get(key) ?? 0) + 1)
    })
    const topRoutes = Array.from(routes.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
    const maxRoute = topRoutes.length ? topRoutes[0][1] : 1

    const byRole: Record<string, number> = { particulier: 0, gp: 0, transitaire: 0, admin: 0 }
    db.profiles.forEach((p) => {
      byRole[p.role] = (byRole[p.role] ?? 0) + 1
    })

    return { topRoutes, maxRoute, byRole }
  }, [db])

  const rol = [
    { key: 'particulier', label: 'Particuliers', color: 'bg-[#2A50A0]' },
    { key: 'gp', label: 'GP / Voyageurs', color: 'bg-[#059669]' },
    { key: 'transitaire', label: 'Transitaires', color: 'bg-violet-500' },
  ]

  return (
    <DashboardLayout>
      <div className="pt-6 sm:pt-0">
        <h1 className="font-display text-2xl font-bold text-[#0F2450] sm:text-3xl">Statistiques</h1>
        <p className="mt-1.5 text-[#64748B]">
          Indicateurs globaux de la plateforme (données de démonstration).
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Utilisateurs" value={String(db.profiles.length)} icon={<Users size={20} />} tone="blue" />
          <Stat label="Profilés vérifiés" value={String(db.profiles.filter((p) => p.verification_status === 'verified').length)} icon={<BadgeCheck size={20} />} tone="green" />
          <Stat label="Offres" value={String(db.offers.length)} icon={<Package size={20} />} tone="blue" />
          <Stat label="Colis expédiés" value={String(db.shipments.length)} icon={<Boxes size={20} />} tone="amber" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-[#0F2450]">
              <TrendingUp size={17} className="text-[#059669]" /> Trajets les plus demandés
            </h2>
            {stats.topRoutes.length === 0 ? (
              <p className="mt-4 text-sm text-[#64748B]">Aucune donnée pour le moment.</p>
            ) : (
              <div className="mt-5 space-y-4">
                {stats.topRoutes.map(([route, count]) => (
                  <div key={route}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-semibold text-slate-700">{route}</span>
                      <span className="text-[#64748B]">{count} colis</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-[#1B3A70]"
                        style={{ width: `${(count / stats.maxRoute) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-[#0F2450]">
              <Users size={17} className="text-[#059669]" /> Répartition des comptes
            </h2>
            <div className="mt-5 space-y-4">
              {rol.map((r) => (
                <div key={r.key}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-700">{r.label}</span>
                    <span className="text-[#64748B]">{stats.byRole[r.key] ?? 0}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${r.color}`}
                      style={{
                        width: `${((stats.byRole[r.key] ?? 0) / Math.max(db.profiles.length, 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs text-[#64748B]">
              <Flag size={14} className="mt-0.5 shrink-0" />
              Les chiffres présentés ici sont des données de démonstration, pas des statistiques réelles.
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}