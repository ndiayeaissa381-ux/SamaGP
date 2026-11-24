import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Package, AlertTriangle, ShieldCheck } from 'lucide-react'
import { getOffer } from '../lib/db'
import { useAuth } from '../context/AuthContext'
import { PARCEL_TYPES, money } from '../lib/utils'
import { Input, Select, Textarea, Field } from '../components/ui/Field'
import { Button } from '../components/ui/Button'
import { ErrorState } from '../components/ui/States'
import { KindBadge, VerificationBadge } from '../components/ui/Badge'
import { Avatar } from '../components/ui/Avatar'

export interface Draft {
  offer_id: string
  sender_name: string
  sender_phone: string
  destination: string
  parcel_type: string
  weight: number
  description: string
}

export function saveDraft(draft: Draft): void {
  sessionStorage.setItem('samagp_draft', JSON.stringify(draft))
}

const WEIGHTS = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20]

export default function ExpeditionNouvelle() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const offerId = params.get('offer') ?? ''
  const offer = getOffer(offerId)

  const [senderName, setSenderName] = useState(user ? `${user.first_name} ${user.last_name}`.trim() : '')
  const [senderPhone, setSenderPhone] = useState(user?.phone ?? '')
  const [parcelType, setParcelType] = useState(PARCEL_TYPES[0])
  const [weight, setWeight] = useState(5)
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const total = useMemo(() => (offer ? weight * offer.price_per_kg : 0), [offer, weight])

  if (!offer) return <ErrorState message="Offre introuvable. Retournez à la recherche pour choisir une offre." />

  const submit = () => {
    const errs: Record<string, string> = {}
    if (!senderName.trim()) errs.sender_name = 'Indiquez le nom de l\'expéditeur.'
    if (!senderPhone.trim()) errs.sender_phone = 'Indiquez votre numéro de téléphone.'
    if (weight <= 0) errs.weight = 'Le poids doit être supérieur à 0.'
    if (weight > offer.capacity)
      errs.weight = `La capacité maximale de cette offre est de ${new Intl.NumberFormat('fr-FR').format(offer.capacity)} kg.`
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    saveDraft({
      offer_id: offer.id,
      sender_name: senderName.trim(),
      sender_phone: senderPhone.trim(),
      destination: offer.to,
      parcel_type: parcelType,
      weight,
      description: description.trim(),
    })
    navigate('/expedition/recap', { state: { offer_id: offer.id } })
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        to={`/offres/${offer.id}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B3A70] hover:text-[#0F2450]"
      >
        <ArrowLeft size={16} /> Retour à l'offre
      </Link>

      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-[#0F2450]">
        Informations sur votre colis
      </h1>
      <p className="mt-2 text-[#64748B]">
        Complétez les informations ci-dessous pour envoyer votre demande au transporteur.
      </p>

      {/* Summary of selected offer */}
      <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF2F8] text-[#1B3A70]">
            <Package size={20} />
          </span>
          <div>
            <p className="font-display text-base font-bold text-[#0F2450]">
              {offer.from} → {offer.to}
            </p>
            <p className="text-sm text-[#64748B]">
              {new Intl.NumberFormat('fr-FR').format(offer.capacity)} kg disponibles · {money(offer.price_per_kg)} / kg
            </p>
          </div>
        </div>
        <p className="text-sm font-semibold text-[#059669]">
          Tarif estimé : <span className="font-display text-lg font-bold">{money(total)}</span>
        </p>
      </div>

      <form
        className="mt-6 space-y-5 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nom de l'expéditeur" error={errors.sender_name}>
            <Input
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Awa Ndiaye"
            />
          </Field>
          <Field label="Téléphone" error={errors.sender_phone}>
            <Input
              value={senderPhone}
              onChange={(e) => setSenderPhone(e.target.value)}
              placeholder="77 123 45 67"
              inputMode="tel"
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Destination">
            <Input value={offer.to} disabled />
          </Field>
          <Field label="Type de colis">
            <Select value={parcelType} onChange={(e) => setParcelType(e.target.value)}>
              {PARCEL_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Poids (kg)"
            error={errors.weight}
            hint={`Capacité disponible : ${new Intl.NumberFormat('fr-FR').format(offer.capacity)} kg`}
          >
            <Select value={weight} onChange={(e) => setWeight(Number(e.target.value))}>
              {WEIGHTS.filter((w) => w <= offer.capacity).map((w) => (
                <option key={w} value={w}>{w} kg</option>
              ))}
              {WEIGHTS.filter((w) => w > offer.capacity).length > 0 && (
                <option value="">Poids non proposé</option>
              )}
            </Select>
          </Field>
          <Field label="Description du colis">
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Documents et vêtements"
            />
          </Field>
        </div>

        <div className="flex items-start gap-3 rounded-2xl bg-amber-50 p-4">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-600" />
          <p className="text-sm text-amber-800">
            <strong>Les objets interdits au transport ne sont pas acceptés.</strong>{' '}
            Vous êtes responsable de la conformité du contenu de votre colis avec la
            réglementation applicable.
          </p>
        </div>

        <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-xs text-[#64748B]">
            <ShieldCheck size={14} className="text-[#059669]" />
            Votre demande sera transmise au transporteur pour confirmation.
          </p>
          <Button type="submit" size="lg" className="sm:w-auto">
            Continuer
          </Button>
        </div>
      </form>
    </main>
  )
}