import { Package, MapPin } from 'lucide-react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/States'
import { getDB, deactivateOffer, getProfile } from '../lib/db'
import { useToast } from '../context/ToastContext'
import { useDB } from '../hooks'
import { money, TRANSPORT_LABEL, formatDateShort } from '../lib/utils'

export default function AdminOffres() {
  const { toast } = useToast()
  useDB()
  const db = getDB()

  const offers = [...db.offers].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return (
    <DashboardLayout>
      <div className="pt-6 sm:pt-0">
        <h1 className="font-display text-2xl font-bold text-[#0F2450] sm:text-3xl">Offres</h1>
        <p className="mt-1.5 text-[#64748B]">
          Toutes les offres publiées par les GP et les transitaires.
        </p>

        {offers.length === 0 ? (
          <div className="mt-8">
            <EmptyState title="Aucune offre" message="Aucune offre n'est publiée pour le moment." icon={<Package size={28} />} />
          </div>
        ) : (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {offers.map((o) => {
              const p = getProfile(o.provider_id)
              return (
                <Card key={o.id} className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="flex items-center gap-1.5 font-display font-bold text-[#0F2450]">
                        <MapPin size={15} className="text-[#059669]" /> {o.from} → {o.to}
                      </p>
                      <p className="mt-1 text-sm text-[#64748B]">
                        {p ? (p.company || `${p.first_name} ${p.last_name}`.trim()) : 'SAMA GP'}
                        {' · '}
                        {o.provider_kind === 'gp' ? 'GP / Voyageur' : 'Transitaire'}
                        {o.transport && ` · ${TRANSPORT_LABEL[o.transport]}`}
                      </p>
                    </div>
                    <Badge tone={o.status === 'active' ? 'green' : 'slate'}>
                      {o.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#64748B]">
                    <span className="font-semibold text-[#0F2450]">{money(o.price_per_kg)} / kg</span>
                    <span>{new Intl.NumberFormat('fr-FR').format(o.capacity)} kg</span>
                    {o.delivery_days && <span>Délai {o.delivery_days}</span>}
                    {o.date && <span>Départ {formatDateShort(o.date)}</span>}
                  </div>
                  {o.status === 'active' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="mt-4"
                      onClick={() => {
                        deactivateOffer(o.id)
                        toast('Offre désactivée.', 'info')
                      }}
                    >
                      Désactiver
                    </Button>
                  )}
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}