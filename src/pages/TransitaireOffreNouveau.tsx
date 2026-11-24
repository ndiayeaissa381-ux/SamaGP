import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plane, MapPin, Calendar, Package, Calculator, Truck, Ship, Car } from 'lucide-react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { Input, Select, Textarea, Field } from '../components/ui/Field'
import { Button } from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { createTransitaireOffer } from '../lib/db'
import { useToast } from '../context/ToastContext'
import { COMMON_ROUTES, money, TRANSPORT_LABEL } from '../lib/utils'
import type { TransportMode } from '../lib/types'

const TRANSPORTS: { value: TransportMode; icon: React.ReactNode }[] = [
  { value: 'aerien', icon: <Plane size={18} /> },
  { value: 'maritime', icon: <Ship size={18} /> },
  { value: 'terrestre', icon: <Car size={18} /> },
]

export default function TransitaireOffreNouveau() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [from, setFrom] = useState(user?.city ?? '')
  const [to, setTo] = useState('')
  const [transport, setTransport] = useState<TransportMode>('aerien')
  const [deliveryDays, setDeliveryDays] = useState('5–7 jours')
  const [price, setPrice] = useState(4000)
  const [capacity, setCapacity] = useState(200)
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!user) return null

  const submit = () => {
    const errs: Record<string, string> = {}
    if (!from.trim()) errs.from = 'Indiquez le départ.'
    if (!to.trim()) errs.to = 'Indiquez la destination.'
    if (!deliveryDays.trim()) errs.delivery_days = 'Indiquez un délai estimé.'
    if (capacity <= 0) errs.capacity = 'La capacité doit être supérieure à 0.'
    if (price <= 0) errs.price = 'Le prix par kg doit être supérieur à 0.'
    setErrors(errs)
    if (Object.keys(errs).length > 0) {
      toast('Vérifiez les champs du formulaire.', 'error')
      return
    }
    try {
      createTransitaireOffer(user, {
        from: from.trim(),
        to: to.trim(),
        transport,
        date: null,
        delivery_days: deliveryDays.trim(),
        price_per_kg: price,
        capacity,
        description: description.trim(),
      })
      toast('Votre offre a été publiée avec succès.')
      navigate('/transitaire/offres')
    } catch (err) {
      toast(err instanceof Error ? err.message : "Une erreur est survenue.", 'error')
    }
  }

  return (
    <DashboardLayout>
      <div className="pt-6 sm:pt-0">
        <h1 className="font-display text-2xl font-bold text-[#0F2450] sm:text-3xl">Publier une offre</h1>
        <p className="mt-1.5 text-[#64748B]">
          Créez une offre de transport pour vos clients potentiels.
        </p>

        <div className="mt-6 max-w-3xl space-y-5 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Ville de départ" error={errors.from}>
              <div className="relative">
                <MapPin size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2A50A0]" />
                <Input className="pl-10" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Dakar" />
              </div>
            </Field>
            <Field label="Destination" error={errors.to}>
              <div className="relative">
                <MapPin size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2A50A0]" />
                <Input className="pl-10" value={to} onChange={(e) => setTo(e.target.value)} placeholder="Paris, France" />
              </div>
            </Field>
          </div>

          <Field label="Mode de transport">
            <div className="flex flex-wrap gap-2">
              {TRANSPORTS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTransport(t.value)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
                    transport === t.value
                      ? 'border-[#1B3A70] bg-[#1B3A70] text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {t.icon} {TRANSPORT_LABEL[t.value]}
                </button>
              ))}
            </div>
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Délai estimé" error={errors.delivery_days}>
              <div className="relative">
                <Calendar size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2A50A0]" />
                <Input
                  className="pl-10"
                  value={deliveryDays}
                  onChange={(e) => setDeliveryDays(e.target.value)}
                  placeholder="5–7 jours"
                />
              </div>
            </Field>
            <Field label="Prix par kg (FCFA)" error={errors.price}>
              <div className="relative">
                <Calculator size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2A50A0]" />
                <Input className="pl-10" type="number" min={1} value={price} onChange={(e) => setPrice(Number(e.target.value))} />
              </div>
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Capacité (kg)" error={errors.capacity}>
              <div className="relative">
                <Package size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2A50A0]" />
                <Input className="pl-10" type="number" min={1} value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} />
              </div>
            </Field>
          </div>

          <Field label="Description de l'offre">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Expédition aérienne chaque semaine. Assurance et suivi inclus."
            />
          </Field>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-[#64748B]">Tarif appliqué aux colis transportés.</p>
            <p className="font-display text-lg font-bold text-[#0F2450]">{money(price)} / kg</p>
          </div>

          <Button size="lg" onClick={submit}>
            Publier l'offre
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}