import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, Package, Scale, Calculator, ChevronRight } from 'lucide-react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { TrackingTimeline } from '../components/TrackingTimeline'
import { ErrorState } from '../components/ui/States'
import { Button } from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import {
  getShipment,
  trackingForShipment,
  getOffer,
  getProfile,
  advanceShipment,
  deliveryTarget,
} from '../lib/db'
import { useToast } from '../context/ToastContext'
import { useDB } from '../hooks'
import { money, formatDate, cx } from '../lib/utils'
import { Avatar } from '../components/ui/Avatar'

const statusBadge: Record<string, { label: string; tone: 'blue' | 'green' | 'amber' | 'slate' | 'red' }> = {
  demande_envoyee: { label: 'Demande envoyée', tone: 'slate' },
  demande_acceptee: { label: 'Demande acceptée', tone: 'blue' },
  remis: { label: 'Colis remis au transporteur', tone: 'blue' },
  en_transit: { label: 'En transit', tone: 'blue' },
  arrive: { label: 'Arrivé à destination', tone: 'amber' },
  livre: { label: 'Livré', tone: 'green' },
  annule: { label: 'Annulé', tone: 'red' },
}

export default function ColisDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const { toast } = useToast()
  useDB()

  if (!id) return <ErrorState />
  const shipment = getShipment(id)
  if (!shipment) return <ErrorState message="Ce colis est introuvable." />

  if (!user || (user.id !== shipment.owner_id && user.id !== shipment.provider_id && user.role !== 'admin')) {
    return <ErrorState message="Vous n'avez pas accès à ce colis." />
  }

  const events = trackingForShipment(shipment.id)
  const offer = getOffer(shipment.offer_id)
  const provider = offer ? getProfile(offer.provider_id) : null
  const badge = statusBadge[shipment.status] ?? { label: shipment.status, tone: 'slate' as const }
  const canAdvance =
    user.role === 'admin' || user.id === shipment.provider_id
  const nextLabel = deliveryTarget(shipment) ? 'Livrer le colis' : 'Faire avancer le statut'

  const advance = () => {
    const res = advanceShipment(shipment.id)
    if (res.ok) toast('Statut du colis mis à jour.')
    else toast(res.error ?? 'Impossible de mettre à jour.', 'error')
  }

  return (
    <DashboardLayout>
      <div className="pt-6 sm:pt-0">
        <Link to="/colis" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B3A70] hover:text-[#0F2450]">
          <ArrowLeft size={16} /> Mes colis
        </Link>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#0F2450] sm:text-3xl">{shipment.reference}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-[#64748B]">
              <MapPin size={14} className="text-[#059669]" /> {shipment.from} → {shipment.to}
            </p>
          </div>
          <Badge tone={badge.tone} className="w-fit px-3 py-1.5 text-sm">{badge.label}</Badge>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <Card className="p-6 sm:p-8">
            <h2 className="font-display text-lg font-bold text-[#0F2450]">Suivi de l'expédition</h2>
            <div className="mt-6">
              <TrackingTimeline status={shipment.status} events={events} />
            </div>
            <p className="mt-6 rounded-xl bg-[#EEF2F8] p-3.5 text-sm text-slate-600">
              Le suivi fonctionne par statut : chaque étape étant mise à jour par votre
              transporteur. Soyez averti à chaque changement.
            </p>
          </Card>

          <div className="space-y-5">
            <Card className="p-5">
              <h3 className="font-display font-bold text-[#0F2450]">Colis</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1.5 text-[#64748B]"><Scale size={14} /> Poids</dt>
                  <dd className="font-semibold text-slate-800">{shipment.weight} kg</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1.5 text-[#64748B]"><Calculator size={14} /> Tarif</dt>
                  <dd className="font-semibold text-slate-800">{money(shipment.total)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1.5 text-[#64748B]"><Package size={14} /> Créé le</dt>
                  <dd className="font-semibold text-slate-800">{formatDate(shipment.created_at)}</dd>
                </div>
              </dl>
            </Card>

            <Card className="p-5">
              <h3 className="font-display font-bold text-[#0F2450]">Transporteur</h3>
              {provider && (
                <div className="mt-4 flex items-center gap-3">
                  <Avatar src={provider.avatar_url} name={`${provider.first_name} ${provider.last_name}`.trim()} className="h-11 w-11 text-sm" />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">
                      {provider.company || `${provider.first_name} ${provider.last_name}`.trim()}
                    </p>
                    <p className="text-xs text-[#64748B]">
                      {provider.role === 'gp' ? 'GP / Voyageur' : 'Transitaire'}
                      {offer?.transport ? ` · ${offer.transport}` : ''}
                    </p>
                  </div>
                </div>
              )}
              <Link to={`/offres/${offer?.id ?? ''}`} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#1B3A70] hover:text-[#0F2450]">
                Voir l'offre <ChevronRight size={15} />
              </Link>
            </Card>

            {canAdvance && (
              <Card className="p-5">
                <h3 className="font-display font-bold text-[#0F2450]">Statut</h3>
                <p className="mt-2 text-sm text-[#64748B]">
                  En tant que transporteur, mettez à jour le statut du colis à chaque étape.
                </p>
                <Button className={cx('mt-4 w-full')} onClick={advance}>
                  {nextLabel}
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}