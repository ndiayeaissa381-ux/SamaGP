import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { MapPin, Scale } from 'lucide-react'
import { createShipmentRequest, getOffer, getProfile } from '../lib/db'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { money } from '../lib/utils'
import { Button } from '../components/ui/Button'
import { ErrorState } from '../components/ui/States'
import { KindBadge, VerificationBadge } from '../components/ui/Badge'

interface Draft {
  offer_id: string
  sender_name: string
  sender_phone: string
  destination: string
  parcel_type: string
  weight: number
  description: string
}

function loadDraft(): Draft | null {
  try {
    const raw = sessionStorage.getItem('samagp_draft')
    return raw ? (JSON.parse(raw) as Draft) : null
  } catch {
    return null
  }
}

export default function ExpeditionRecap() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { toast } = useToast()
  const [sending, setSending] = useState(false)

  const draft = useMemo(() => {
    const d = loadDraft()
    if (!d) return null
    const offer = getOffer(d.offer_id)
    if (!offer) return null
    const provider = getProfile(offer.provider_id)
    const providerName = provider
      ? `${provider.first_name} ${provider.last_name || ''}`.trim()
      : 'SAMA GP'
    return { ...d, offer, provider, providerName }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key, user?.id])

  if (!draft || !user) {
    return (
      <ErrorState message="Aucune demande en cours. Reprenez une recherche pour envoyer un colis." />
    )
  }

  const { offer, provider, providerName } = draft
  const total = draft.weight * offer.price_per_kg

  const send = () => {
    if (sending) return
    setSending(true)
    try {
      const request = createShipmentRequest({
        offer,
        sender: user,
        parcel_type: draft.parcel_type,
        weight: draft.weight,
        description: draft.description,
        sender_name: draft.sender_name,
        sender_phone: draft.sender_phone,
      })
      sessionStorage.setItem('samagp_confirmation', JSON.stringify(request.reference))
      sessionStorage.removeItem('samagp_draft')
      toast('Votre demande a été envoyée au transporteur.')
      navigate('/expedition/confirmation')
    } catch (err) {
      setSending(false)
      toast(
        err instanceof Error ? err.message : "Une erreur est survenue. Veuillez réessayer.",
        'error'
      )
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        to={`/expedition/nouvelle?offer=${offer.id}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B3A70] hover:text-[#0F2450]"
      >
        ← Modifier les informations
      </Link>

      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-[#0F2450]">
        Récapitulatif
      </h1>
      <p className="mt-2 text-[#64748B]">Vérifiez les informations avant d'envoyer votre demande.</p>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <dl className="divide-y divide-slate-100">
          <Row label="Expéditeur" value={draft.sender_name} />
          <Row label="Téléphone" value={draft.sender_phone} />
          <Row
            label="Trajet"
            value={
              <span className="inline-flex items-center gap-1.5 text-slate-800">
                <MapPin size={15} className="text-[#059669]" /> {offer.from} → {offer.to}
              </span>
            }
          />
          <div className="flex items-center justify-between gap-4 py-4">
            <dt className="text-sm text-[#64748B]">Transporteur</dt>
            <dd className="flex flex-wrap items-center justify-end gap-2">
              <span className="text-sm font-semibold text-slate-800">{providerName}</span>
              <VerificationBadge verified={provider?.verification_status === 'verified'} />
              <KindBadge kind={offer.provider_kind} />
            </dd>
          </div>
          <Row label="Type de colis" value={draft.parcel_type} />
          <Row
            label="Poids"
            value={
              <span className="inline-flex items-center gap-1.5 text-slate-800">
                <Scale size={15} className="text-[#2A50A0]" /> {draft.weight} kg
              </span>
            }
          />
          {draft.description && <Row label="Description" value={draft.description} />}
        </dl>

        <div className="mt-6 flex items-center justify-between rounded-2xl bg-[#0F2450] px-5 py-4">
          <p className="text-sm font-semibold text-[#D1FAE5]">Tarif estimé</p>
          <p className="font-display text-xl font-bold text-white">{money(total)}</p>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3.5">
          <span className="mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full bg-amber-500" />
          <p className="text-xs text-amber-800">
            Les objets interdits au transport ne sont pas acceptés. Le transporteur devra
            accepter votre demande avant la remise du colis.
          </p>
        </div>

        <Button size="lg" className="mt-5 w-full" onClick={send} loading={sending}>
          Envoyer la demande
        </Button>
      </div>
    </main>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <dt className="text-sm text-[#64748B]">{label}</dt>
      <dd className="text-right text-sm font-semibold text-slate-800">{value}</dd>
    </div>
  )
}