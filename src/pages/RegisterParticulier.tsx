import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Phone, Lock, User, ArrowRight, Send } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Field, Input, Select } from '../components/ui/Field'
import { Button } from '../components/ui/Button'
import { AuthScaffold, BackToChoice, FlowTag } from '../components/registration/AuthScaffold'
import { AgreeCheck } from '../components/registration/AgreeCheck'
import { registerProfile } from '../lib/db'
import { isValidEmail, isValidPhone } from '../lib/utils'
import { COUNTRIES } from '../components/registration/options'

export default function RegisterParticulier() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { login } = useAuth()

  const [f, setF] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    password: '',
    confirm: '',
    city: '',
    country: 'Sénégal',
  })
  const [cgu, setCgu] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)

  const set = (k: keyof typeof f) => (e: { target: { value: string } }) =>
    setF((s) => ({ ...s, [k]: e.target.value }))

  const submit = async () => {
    const errs: Record<string, string> = {}
    if (!f.first_name.trim()) errs.first_name = 'Indiquez votre prénom.'
    if (!f.last_name.trim()) errs.last_name = 'Indiquez votre nom.'
    if (!isValidPhone(f.phone)) errs.phone = 'Numéro de téléphone invalide.'
    if (!isValidEmail(f.email)) errs.email = 'Adresse email invalide.'
    if (f.password.length < 6) errs.password = 'Le mot de passe doit contenir au moins 6 caractères.'
    if (f.confirm !== f.password) errs.confirm = 'La confirmation ne correspond pas au mot de passe.'
    if (!f.city.trim()) errs.city = 'Indiquez votre ville.'
    if (!cgu) errs.cgu = 'Vous devez accepter les conditions générales.'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setBusy(true)
    try {
      registerProfile({
        first_name: f.first_name.trim(),
        last_name: f.last_name.trim(),
        email: f.email,
        phone: f.phone,
        role: 'particulier',
        password: f.password,
        city: f.city.trim(),
        country: f.country,
      })
      await login(f.email, f.password)
      toast('Votre compte a été créé avec succès. Bienvenue !')
      navigate('/dashboard')
    } catch (err) {
      setBusy(false)
      if (err instanceof Error && err.message === 'EMAIL_EXISTS') {
        setErrors({ email: 'Un compte existe déjà avec cette adresse email.' })
      } else {
        toast('Une erreur est survenue lors de la création du compte.', 'error')
      }
    }
  }

  return (
    <AuthScaffold variant="split">
      <div className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-9 animate-fade-up">
        <FlowTag tone="blue">Parcours Particulier</FlowTag>
        <h1 className="mt-4 font-display text-2xl font-bold text-[#0F2450] sm:text-3xl">
          Créer mon compte particulier
        </h1>
        <p className="mt-1.5 text-[#64748B]">
          Envoyez vos colis simplement et trouvez la solution de transport qui vous convient.
        </p>

        <form
          className="mt-6 space-y-5"
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Prénom" error={errors.first_name}>
              <div className="relative">
                <User size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input className="pl-9" value={f.first_name} onChange={set('first_name')} placeholder="Awa" autoComplete="given-name" />
              </div>
            </Field>
            <Field label="Nom" error={errors.last_name}>
              <div className="relative">
                <User size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input className="pl-9" value={f.last_name} onChange={set('last_name')} placeholder="Ndiaye" autoComplete="family-name" />
              </div>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Numéro de téléphone" error={errors.phone}>
              <div className="relative">
                <Phone size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input className="pl-9" value={f.phone} onChange={set('phone')} placeholder="77 123 45 67" inputMode="tel" autoComplete="tel" />
              </div>
            </Field>
            <Field label="Adresse e-mail" error={errors.email}>
              <div className="relative">
                <Mail size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input className="pl-9" type="email" value={f.email} onChange={set('email')} placeholder="awa@exemple.sn" autoComplete="email" />
              </div>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Ville" error={errors.city}>
              <Input value={f.city} onChange={set('city')} placeholder="Dakar" />
            </Field>
            <Field label="Pays" error={errors.country}>
              <Select value={f.country} onChange={set('country')}>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Mot de passe" error={errors.password}>
              <div className="relative">
                <Lock size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input className="pl-9" type="password" value={f.password} onChange={set('password')} placeholder="6 caractères minimum" autoComplete="new-password" />
              </div>
            </Field>
            <Field label="Confirmation du mot de passe" error={errors.confirm}>
              <div className="relative">
                <Lock size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input className="pl-9" type="password" value={f.confirm} onChange={set('confirm')} placeholder="Confirmez le mot de passe" autoComplete="new-password" />
              </div>
            </Field>
          </div>

          <AgreeCheck id="cgu" checked={cgu} onChange={setCgu} error={errors.cgu}>
            J’accepte les conditions générales
          </AgreeCheck>

          <Button type="submit" size="lg" className="w-full" loading={busy}>
            Créer mon compte <ArrowRight size={16} />
          </Button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-3 text-sm text-[#64748B]">
          <Link to="/login" className="font-semibold text-[#1B3A70] hover:underline">
            Déjà inscrit ? Se connecter
          </Link>
          <BackToChoice />
        </div>
      </div>
    </AuthScaffold>
  )
}