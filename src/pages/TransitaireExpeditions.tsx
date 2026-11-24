import { Link } from 'react-router-dom'
import { Boxes, MapPin, ChevronRight } from 'lucide-react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/States'
import { useAuth } from '../context/AuthContext'
import { shipmentsForProvider, getProfile } from '../lib/db'
import { useDB } from '../hooks'
import { money } from '../lib/utils'

const badgeFor: Record<string, { label: string; tone: 'blue' | 'green' | 'amber' | 'slate' | 'red' }> = {
  demande_envoyee: { label: 'Demande envoyée', tone: 'slate' },
  demande_acceptee: { label: 'Demande acceptée', tone: 'blue' },
  remis: { label: 'Colis remis', tone: 'blue' },
  en_transit: { label: 'En transit', tone: 'blue' },
  arrive: { label: 'Arrivé à destination', tone: 'amber' },
  livre: { label: 'Livré', tone: 'green' },
  annule: { label: 'Annulé', tone: 'red' },
}

export default function TransitaireExpeditions() {
  const { user } = useAuth()
  useDB()
  if (!user) return null

  const shipments = shipmentsForProvider(user)

  return (
    <DashboardLayout>
      <div className="pt-6 sm:pt-0">
        <h1 className="font-display text-2xl font-bold text-[#0F2450] sm:text-3xl">Expéditions</h1>
        <p className="mt-1.5 text-[#64748B]">
          Toutes les expéditions en cours et livrées via vos offres.
        </p>

        {shipments.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="Aucune expédition"
              message="Les expéditions apparaîtront ici une fois vos demandes acceptées."
              icon={<Boxes size={28} />}
            />
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {shipments.map((s) => {
              const owner = getProfile(s.owner_id)
              const badge = badgeFor[s.status] ?? { label: s.status, tone: 'slate' as const }
              return (
                <Card key={s.id} className="p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-display text-lg font-bold text-[#0F2450]">{s.reference}</p>
                        <Badge tone={badge.tone}>{badge.label}</Badge>
                      </div>
                      <p className="mt-1.5 flex items-center gap-1.5 text-sm text-[#64748B]">
                        <MapPin size={14} className="text-[#059669]" /> {s.from} → {s.to}
                      </p>
                      <p className="mt-1 text-sm text-[#64748B]">
                        {s.weight} kg · {money(s.total)}
                        {owner && (
                          <span className="ml-1 text-slate-400">· expéditeur {owner.first_name} {owner.last_name}</span>
                        )}
                      </p>
                    </div>
                    <Link
                      to={`/colis/${s.id}`}
                      className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[#1B3A70] hover:text-[#0F2450]"
                    >
                      Mettre à jour <ChevronRight size={15} />
                    </Link>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}