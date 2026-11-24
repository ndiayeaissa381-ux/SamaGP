import { Link } from 'react-router-dom'
import { Package, Plane, PlusCircle, MapPin, Clock } from 'lucide-react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/States'
import { Button } from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { offersForProvider, deactivateOffer } from '../lib/db'
import { useToast } from '../context/ToastContext'
import { useDB } from '../hooks'
import { money, TRANSPORT_LABEL } from '../lib/utils'

export default function TransitaireOffres() {
  const { user } = useAuth()
  const { toast } = useToast()
  useDB()
  if (!user) return null

  const offers = offersForProvider(user).filter((o) => o.provider_kind === 'transitaire')

  return (
    <DashboardLayout>
      <div className="pt-6 sm:pt-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#0F2450] sm:text-3xl">Mes offres</h1>
            <p className="mt-1.5 text-[#64748B]">
              Managez vos offres de transport publiées dans la marketplace.
            </p>
          </div>
          <Link to="/transitaire/offres/nouveau">
            <Button><PlusCircle size={17} /> Publier une offre</Button>
          </Link>
        </div>

        {offers.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="Aucune offre publiée"
              message="Votre première offre vous permettra de recevoir des demandes de transport."
              icon={<Package size={28} />}
              action={{ label: 'Publier une offre', to: '/transitaire/offres/nouveau' }}
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {offers.map((o) => (
              <Card key={o.id} className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="flex items-center gap-1.5 font-display text-lg font-bold text-[#0F2450]">
                    <MapPin size={17} className="text-[#059669]" /> {o.from} → {o.to}
                  </p>
                  <Badge tone={o.status === 'active' ? 'green' : 'slate'}>
                    {o.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-xs text-[#64748B]">Transport</dt>
                    <dd className="mt-1 flex items-center gap-1.5 font-semibold text-slate-800">
                      <Plane size={14} className="text-[#2A50A0]" /> {o.transport ? TRANSPORT_LABEL[o.transport] : '—'}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-xs text-[#64748B]">Délai estimé</dt>
                    <dd className="mt-1 flex items-center gap-1.5 font-semibold text-slate-800">
                      <Clock size={14} className="text-[#2A50A0]" /> {o.delivery_days ?? '—'}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-xs text-[#64748B]">Tarif</dt>
                    <dd className="mt-1 font-semibold text-[#0F2450]">{money(o.price_per_kg)} / kg</dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-xs text-[#64748B]">Capacité</dt>
                    <dd className="mt-1 font-semibold text-slate-800">
                      {new Intl.NumberFormat('fr-FR').format(o.capacity)} kg
                    </dd>
                  </div>
                </dl>
                {o.status === 'active' && (
                  <button
                    onClick={() => {
                      deactivateOffer(o.id)
                      toast('Offre désactivée.', 'info')
                    }}
                    className="mt-4 text-sm font-semibold text-red-600 hover:text-red-700"
                  >
                    Désactiver l'offre
                  </button>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}