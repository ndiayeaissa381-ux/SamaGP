import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Package, MapPin } from 'lucide-react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/States'
import { useAuth } from '../context/AuthContext'
import { shipmentsForOwner, getOffer, getProfile } from '../lib/db'
import { useDB } from '../hooks'
import { money, formatDate, cx } from '../lib/utils'
import type { Shipment } from '../lib/types'

const ACTIVE = ['demande_envoyee', 'demande_acceptee', 'remis', 'en_transit', 'arrive']

function statusTone(status: string): 'blue' | 'green' | 'amber' | 'slate' {
  if (status === 'livre') return 'green'
  if (status === 'en_transit' || status === 'arrive') return 'blue'
  if (status === 'annule') return 'amber'
  return 'slate'
}

function ShipmentCard({ s }: { s: Shipment }) {
  const offer = getOffer(s.offer_id)
  const provider = offer ? getProfile(offer.provider_id) : null
  return (
    <Card className="p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-display text-lg font-bold text-[#0F2450]">{s.reference}</p>
            <Badge tone={statusTone(s.status)}>{statusLabel(s.status)}</Badge>
          </div>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-[#64748B]">
            <MapPin size={14} className="text-[#059669]" /> {s.from} → {s.to}
          </p>
          <p className="mt-1 text-sm text-[#64748B]">
            {s.weight} kg · {money(s.total)}
            {provider && (
              <span className="ml-1 text-slate-400">· par {providerName(provider.first_name, provider.last_name, provider.company)}</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to={`/colis/${s.id}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#1B3A70] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0F2450]"
          >
            Voir le suivi <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </Card>
  )
}

function providerName(first: string, last?: string, company?: string): string {
  if (company) return company
  return `${first} ${last || ''}`.trim()
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    demande_envoyee: 'En attente',
    demande_acceptee: 'Accepté',
    remis: 'Remis',
    en_transit: 'En transit',
    arrive: 'Arrivé',
    livre: 'Livré',
    annule: 'Annulé',
  }
  return map[status] ?? status
}

export default function MesColis() {
  const { user } = useAuth()
  useDB()
  const [tab, setTab] = useState<'en_cours' | 'termines'>('en_cours')

  if (!user) return null
  const shipments = shipmentsForOwner(user)

  const enCours = shipments.filter((s) => ACTIVE.includes(s.status))
  const termines = shipments.filter((s) => !ACTIVE.includes(s.status))

  const list = tab === 'en_cours' ? enCours : termines

  return (
    <DashboardLayout>
      <div className="pt-6 sm:pt-0">
        <PageHeader
          title="Mes colis"
          subtitle="Retrouvez tous vos envois et suivez leur évolution en temps réel."
          action={
            <Link to="/expedition/nouvelle?offer=">
              <span className="inline-flex items-center gap-2 rounded-xl bg-[#059669] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#047857]">
                <Package size={16} /> Nouvelle expédition
              </span>
            </Link>
          }
        />

        <div className="mb-6 inline-flex gap-1 rounded-xl border border-slate-200 bg-white p-1">
          {(
            [
              ['en_cours', `En cours (${enCours.length})`],
              ['termines', `Terminés (${termines.length})`],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cx(
                'rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
                tab === key ? 'bg-[#1B3A70] text-white' : 'text-slate-600 hover:text-[#0F2450]'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <EmptyState
            title={`Aucun colis ${tab === 'en_cours' ? 'en cours' : 'terminé'} pour le moment.`}
            message={
              tab === 'en_cours'
                ? 'Recherchez une offre et envoyez votre premier colis.'
                : 'Vos colis livrés apparaîtront ici.'
            }
            icon={<Package size={28} />}
            action={tab === 'en_cours' ? { label: 'Rechercher des offres', to: '/rechercher' } : undefined}
          />
        ) : (
          <div className="space-y-4">
            {list.map((s) => (
              <ShipmentCard key={s.id} s={s} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}