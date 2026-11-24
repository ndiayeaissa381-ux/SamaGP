import { Link } from 'react-router-dom'
import { Plane, Package, Inbox, PlusCircle, ArrowRight, Calendar, MapPin } from 'lucide-react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { Card } from '../components/ui/Card'
import { Stat } from '../components/ui/Stat'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/States'
import { Button } from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { offersForProvider, requestsForProvider, getProfile } from '../lib/db'
import { useDB } from '../hooks'
import { money, formatDateShort } from '../lib/utils'
import { Avatar } from '../components/ui/Avatar'

export default function GPDashboard() {
  const { user } = useAuth()
  useDB()
  if (!user) return null

  const trips = offersForProvider(user).filter((o) => o.provider_kind === 'gp')
  const requests = requestsForProvider(user)
  const pending = requests.filter((r) => r.status === 'pending')
  const capacity = trips.filter((o) => o.status === 'active').reduce((s, o) => s + o.capacity, 0)

  return (
    <DashboardLayout>
      <div className="pt-6 sm:pt-0">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#0F2450] sm:text-3xl">
              Bonjour {user.first_name} <span aria-hidden>👋</span>
            </h1>
            <p className="mt-1.5 text-[#64748B]">
              {user.city}, {user.country} · Profil vérifié
            </p>
          </div>
          <Link to="/gp/voyages/nouveau">
            <Button size="lg">
              <PlusCircle size={18} /> Publier un voyage
            </Button>
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Stat label="Voyages publiés" value={String(trips.length)} icon={<Plane size={20} />} tone="blue" />
          <Stat
            label="Capacité disponible"
            value={`${new Intl.NumberFormat('fr-FR').format(capacity)} kg`}
            icon={<Package size={20} />}
            tone="green"
          />
          <Stat label="Demandes reçues" value={String(requests.length)} icon={<Inbox size={20} />} tone="amber" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#0F2450]">Mes voyages</h2>
              <Link to="/gp/voyages" className="text-sm font-semibold text-[#1B3A70] hover:text-[#0F2450]">
                Tout voir <ArrowRight size={14} className="inline" />
              </Link>
            </div>
            {trips.length === 0 ? (
              <EmptyState
                title="Aucun voyage publié"
                message="Publiez votre prochain voyage pour recevoir des demandes de colis."
                icon={<Plane size={28} />}
              />
            ) : (
              <div className="space-y-3">
                {trips.slice(0, 3).map((t) => (
                  <Card key={t.id} className="p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="flex items-center gap-1.5 font-display font-bold text-[#0F2450]">
                          <MapPin size={15} className="text-[#059669]" /> {t.from} → {t.to}
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-3 text-sm text-[#64748B]">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} /> {formatDateShort(t.date!)}
                          </span>
                          <span>{new Intl.NumberFormat('fr-FR').format(t.capacity)} kg disponibles</span>
                          <span className="font-semibold text-[#0F2450]">{money(t.price_per_kg)} / kg</span>
                        </div>
                      </div>
                      <Badge tone={t.capacity > 0 ? 'green' : 'slate'}>
                        {t.capacity > 0 ? 'Actif' : 'Capacité utilisée'}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#0F2450]">Demandes récentes</h2>
              <Link to="/gp/demandes" className="text-sm font-semibold text-[#1B3A70] hover:text-[#0F2450]">
                Tout voir
              </Link>
            </div>
            {pending.length === 0 ? (
              <Card className="p-6 text-center text-sm text-[#64748B]">
                Aucune demande en attente.
              </Card>
            ) : (
              <div className="space-y-3">
                {pending.slice(0, 3).map((r) => {
                  const sender = getProfile(r.sender_id)
                  return (
                    <Card key={r.id} className="flex items-center gap-3 p-4">
                      <Avatar
                        src={sender?.avatar_url}
                        name={r.sender_name}
                        className="h-10 w-10 text-xs"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-900">{r.sender_name}</p>
                        <p className="truncate text-xs text-[#64748B]">
                          {r.weight} kg · {r.destination}
                        </p>
                      </div>
                      <Badge tone="amber">En attente</Badge>
                    </Card>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </DashboardLayout>
  )
}