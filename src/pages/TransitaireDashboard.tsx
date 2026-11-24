import { Link } from 'react-router-dom'
import { Package, Inbox, Boxes, PlusCircle, ArrowRight, Plane, Clock, MapPin } from 'lucide-react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { Card } from '../components/ui/Card'
import { Stat } from '../components/ui/Stat'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/States'
import { Button } from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { offersForProvider, requestsForProvider, shipmentsForProvider } from '../lib/db'
import { useDB } from '../hooks'
import { money, TRANSPORT_LABEL } from '../lib/utils'

const ACTIVE_SHIP = ['demande_envoyee', 'demande_acceptee', 'remis', 'en_transit', 'arrive']

export default function TransitaireDashboard() {
  const { user } = useAuth()
  useDB()
  if (!user) return null

  const offers = offersForProvider(user)
  const active = offers.filter((o) => o.status === 'active')
  const requests = requestsForProvider(user)
  const shipments = shipmentsForProvider(user)
  const enCours = shipments.filter((s) => ACTIVE_SHIP.includes(s.status))
  const companyName = user.company || `${user.first_name} ${user.last_name}`.trim()

  return (
    <DashboardLayout>
      <div className="pt-6 sm:pt-0">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#0F2450] sm:text-3xl">
              Bonjour {companyName}
            </h1>
            <p className="mt-1.5 text-[#64748B]">
              {user.city}, {user.country} · Profil vérifié
            </p>
          </div>
          <Link to="/transitaire/offres/nouveau">
            <Button size="lg"><PlusCircle size={18} /> Publier une offre</Button>
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Stat label="Offres actives" value={String(active.length)} icon={<Package size={20} />} tone="blue" />
          <Stat label="Demandes reçues" value={String(requests.length)} icon={<Inbox size={20} />} tone="amber" />
          <Stat label="Colis en cours" value={String(enCours.length)} icon={<Boxes size={20} />} tone="green" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#0F2450]">Mes offres</h2>
              <Link to="/transitaire/offres" className="text-sm font-semibold text-[#1B3A70] hover:text-[#0F2450]">
                Tout voir <ArrowRight size={14} className="inline" />
              </Link>
            </div>
            {offers.length === 0 ? (
              <EmptyState
                title="Aucune offre publiée"
                message="Publiez votre première offre de transport pour être visible dans la recherche."
                icon={<Package size={28} />}
              />
            ) : (
              <div className="space-y-3">
                {offers.slice(0, 3).map((o) => (
                  <Card key={o.id} className="flex items-center justify-between gap-3 p-4">
                    <div>
                      <p className="flex items-center gap-1.5 font-display font-bold text-[#0F2450]">
                        <MapPin size={15} className="text-[#059669]" /> {o.from} → {o.to}
                      </p>
                      <p className="mt-1 flex flex-wrap items-center gap-x-3 text-sm text-[#64748B]">
                        {o.transport && (
                          <span className="flex items-center gap-1"><Plane size={13} /> {TRANSPORT_LABEL[o.transport]}</span>
                        )}
                        <span className="flex items-center gap-1"><Clock size={13} /> {o.delivery_days}</span>
                        <span className="font-semibold text-[#0F2450]">{money(o.price_per_kg)} / kg</span>
                      </p>
                    </div>
                    <Badge tone={o.status === 'active' ? 'green' : 'slate'}>
                      {o.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </Card>
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#0F2450]">Expéditions en cours</h2>
              <Link to="/transitaire/expeditions" className="text-sm font-semibold text-[#1B3A70] hover:text-[#0F2450]">
                Tout voir
              </Link>
            </div>
            {enCours.length === 0 ? (
              <Card className="p-6 text-center text-sm text-[#64748B]">
                Aucune expédition en cours de livraison.
              </Card>
            ) : (
              <div className="space-y-3">
                {enCours.slice(0, 4).map((s) => (
                  <Card key={s.id} className="flex items-center justify-between gap-3 p-4">
                    <div>
                      <p className="font-display text-sm font-bold text-[#0F2450]">{s.reference}</p>
                      <p className="mt-0.5 text-sm text-[#64748B]">
                        {s.from} → {s.to} · {s.weight} kg
                      </p>
                    </div>
                    <Badge tone="blue">En cours</Badge>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </DashboardLayout>
  )
}