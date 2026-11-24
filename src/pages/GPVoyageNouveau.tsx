import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plane, MapPin, Calendar, Package, Calculator } from 'lucide-react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { Input, Select, Textarea, Field } from '../components/ui/Field'
import { Button } from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { createGpTrip, getProfile } from '../lib/db'
import { useToast } from '../context/ToastContext'
import { COMMON_ROUTES, money } from '../lib/utils'

export default function GPVoyageNouveau() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [from, setFrom] = useState(user?.city ?? '')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')
  const [capacity, setCapacity] = useState(10)
  const [price, setPrice] = useState(3000)
  const [info, setInfo] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!user) return null
  const profile = getProfile(user.id)

  const submit = () => {
    const errs: Record<string, string> = {}
    if (!from.trim()) errs.from = `Indiquez la ville de départ.`
    if (!to.trim()) errs.to = 'Indiquez la destination.'
    if (!date) errs.date = 'Choisissez une date de départ.'
    else if (new Date(date) < new Date(new Date().toDateString()))
      errs.date = 'La date de départ doit être dans le futur.'
    if (capacity <= 0) errs.capacity = 'La capacité doit être supérieure à 0.'
    if (price <= 0) errs.price = 'Le prix par kg doit être supérieur à 0.'
    setErrors(errs)
    if (Object.keys(errs).length > 0) {
      toast('Vérifiez les champs du formulaire.', 'error')
      return
    }
    try {
      createGpTrip(user, {
        from: from.trim(),
        to: to.trim(),
        date,
        capacity,
        price_per_kg: price,
        info: info.trim(),
      })
      toast('Votre voyage a été publié avec succès.')
      navigate('/gp/voyages')
    } catch (err) {
      toast(err instanceof Error ? err.message : "Une erreur est survenue.", 'error')
    }
  }

  return (
    <DashboardLayout>
      <div className="pt-6 sm:pt-0">
        <h1 className="font-display text-2xl font-bold text-[#0F2450] sm:text-3xl">Publier un voyage</h1>
        <p className="mt-1.5 text-[#64748B]">
          Renseignez votre trajet et votre capacité disponible pour recevoir des demandes.
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
                <Plane size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2A50A0]" />
                <Select className="pl-10" value={to || '\u0000'} onChange={(e) => setTo(e.target.value === '\u0000' ? '' : e.target.value)}>
                  <option value="">Choisir une destination</option>
                  {COMMON_ROUTES.filter((r) => !r.startsWith(from)).map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </Select>
              </div>
            </Field>
          </div>

          <Field label="Date de départ" error={errors.date}>
            <div className="relative">
              <Calendar size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2A50A0]" />
              <Input
                className="pl-10"
                type="date"
                min={new Date().toISOString().slice(0, 10)}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Capacité disponible (kg)" error={errors.capacity}>
              <div className="relative">
                <Package size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2A50A0]" />
                <Input
                  className="pl-10"
                  type="number"
                  min={1}
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                />
              </div>
            </Field>
            <Field label="Prix par kg (FCFA)" error={errors.price}>
              <div className="relative">
                <Calculator size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2A50A0]" />
                <Input
                  className="pl-10"
                  type="number"
                  min={1}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </div>
            </Field>
          </div>

          <Field label="Informations complémentaires" hint="Ex : vol direct, horaires d'arrivée, points de remise.">
            <Textarea
              value={info}
              onChange={(e) => setInfo(e.target.value)}
              placeholder="Vol direct Dakar → Paris"
            />
          </Field>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-[#64748B]">
              Tarif appliqué aux colis que vous transporterez.
            </p>
            <p className="font-display text-lg font-bold text-[#0F2450]">{money(price)} / kg</p>
          </div>

          <Button size="lg" className="w-full sm:w-auto" onClick={submit}>
            Publier le voyage
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}