import { Link } from 'react-router-dom'
import { Plane, MapPin, PlusCircle, Calendar } from 'lucide-react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/States'
import { Button } from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { offersForProvider, getDB } from '../lib/db'
import { useDB } from '../hooks'
import { money, formatDate } from '../lib/utils'

export default function GPMesVoyages() {
  const { user } = useAuth()
  useDB()
  if (!user) return null

  const trips = offersForProvider(user).filter((o) => o.provider_kind === 'gp')

  return (
    <DashboardLayout>
      <div className="pt-6 sm:pt-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#0F2450] sm:text-3xl">Mes voyages</h1>
            <p className="mt-1.5 text-[#64748B]">
              Gérez les voyages que vous avez publiés sur la plateforme.
            </p>
          </div>
          <Link to="/gp/voyages/nouveau">
            <Button><PlusCircle size={17} /> Publier un voyage</Button>
          </Link>
        </div>

        {trips.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="Aucun voyage publié"
              message="Votre premier voyage vous permettra de recevoir vos premières demandes."
              icon={<Plane size={28} />}
              action={{ label: 'Publier un voyage', to: '/gp/voyages/nouveau' }}
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {trips.map((t) => (
              <Card key={t.id} className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="flex items-center gap-1.5 font-display text-lg font-bold text-[#0F2450]">
                    <MapPin size={17} className="text-[#059669]" /> {t.from} → {t.to}
                  </p>
                  <Badge tone={t.capacity > 0 ? 'green' : 'slate'}>
                    {t.capacity > 0 ? 'Actif' : 'Capacité utilisée'}
                  </Badge>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-xs text-[#64748B]">Date de départ</dt>
                    <dd className="mt-1 flex items-center gap-1.5 font-semibold text-slate-800">
                      <Calendar size={14} className="text-[#2A50A0]" /> {formatDate(t.date!)}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-xs text-[#64748B]">Capacité</dt>
                    <dd className="mt-1 font-semibold text-slate-800">
                      {new Intl.NumberFormat('fr-FR').format(t.capacity)} kg
                    </dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-xs text-[#64748B]">Prix</dt>
                    <dd className="mt-1 font-semibold text-[#0F2450]">{money(t.price_per_kg)} / kg</dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-xs text-[#64748B]">Demandes</dt>
                    <dd className="mt-1 font-semibold text-slate-800">
                      {demandCountFor(t.id)}
                    </dd>
                  </div>
                </dl>
                {t.description && (
                  <p className="mt-3 text-sm text-[#64748B]">{t.description}</p>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

function demandCountFor(offerId: string): number {
  return getDB().requests.filter((r) => r.offer_id === offerId).length
}