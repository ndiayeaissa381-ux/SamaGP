import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  User,
  Phone,
  MessageCircle,
  Mail,
  Lock,
  MapPin,
  Calendar,
  Globe,
  ShieldCheck,
  BadgeCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  Send,
  Home,
  FileCheck2,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Field, Input, Select, Textarea } from '../components/ui/Field'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { AuthScaffold, BackToChoice, FlowTag } from '../components/registration/AuthScaffold'
import { AgreeCheck } from '../components/registration/AgreeCheck'
import { FileDrop, type UploadedFile } from '../components/registration/FileDrop'
import { WizardProgress } from '../components/registration/WizardProgress'
import { registerProfile } from '../lib/db'
import { saveDossier } from '../lib/registrationDossier'
import { isValidEmail, isValidPhone } from '../lib/utils'
import {
  COUNTRIES,
  NATIONALITIES,
  ID_TYPES,
  GP_TYPES,
  TRANSPORT_MODES,
  isValidNinea,
} from '../components/registration/options'

const STEPS = ['Personnelles', 'Profil GP', 'Voyage', 'Vérification', 'Confirmation']

interface GpForm {
  first_name: string
  last_name: string
  birth_date: string
  phone: string
  whatsapp: string
  email: string
  address: string
  city: string
  country: string
  nationality: string
  gp_type: 'particulier' | 'professionnel'
  ninea: string
  id_type: string
  id_number: string
  id_country: string
  transport_mode: string
  departure: string
  destinations: string
  carrier: string
  password: string
  password_confirm: string
}

const EMPTY: GpForm = {
  first_name: '',
  last_name: '',
  birth_date: '',
  phone: '',
  whatsapp: '',
  email: '',
  address: '',
  city: '',
  country: 'Sénégal',
  nationality: 'Sénégalaise',
  gp_type: 'particulier',
  ninea: '',
  id_type: 'CNI',
  id_number: '',
  id_country: 'Sénégal',
  transport_mode: 'Avion',
  departure: '',
  destinations: '',
  carrier: '',
  password: '',
  password_confirm: '',
}

const DOC_LABEL: Record<string, string> = {
  photo: 'Photo de profil',
  identity: 'Pièce d’identité',
  professional: 'Document professionnel',
  extra: 'Justificatif complémentaire',
}

const ID_TYPE_LABEL: Record<string, string> = {
  CNI: 'Carte Nationale d’Identité',
  Passeport: 'Passeport',
  'Carte de séjour': 'Carte de séjour',
  Autre: 'Autre',
}

export default function RegisterGP() {
  const { toast } = useToast()
  const { login } = useAuth()

  const [step, setStep] = useState(0)
  const [form, setForm] = useState<GpForm>(EMPTY)
  const [docs, setDocs] = useState<Record<string, UploadedFile[]>>({
    photo: [],
    identity: [],
    professional: [],
    extra: [],
  })
  const [agree, setAgree] = useState({ cgu: false, transport: false, certify: false })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const set = (k: keyof GpForm) => (e: { target: { value: string } }) =>
    setForm((s) => ({ ...s, [k]: e.target.value }))

  const setDocsFor = (key: string) => (files: UploadedFile[]) =>
    setDocs((s) => ({ ...s, [key]: files }))

  const ageOk = (birth: string): boolean => {
    if (!birth) return true
    const d = new Date(birth)
    if (isNaN(d.getTime())) return false
    const now = new Date()
    return now.getTime() - d.getTime() >= 18 * 365.25 * 24 * 3600 * 1000
  }

  const validateStep = (idx: number): Record<string, string> => {
    const errs: Record<string, string> = {}
    if (idx === 0) {
      if (!form.first_name.trim()) errs.first_name = 'Indiquez votre prénom.'
      if (!form.last_name.trim()) errs.last_name = 'Indiquez votre nom.'
      if (!form.birth_date) errs.birth_date = 'Indiquez votre date de naissance.'
      else if (!ageOk(form.birth_date)) errs.birth_date = 'Vous devez avoir au moins 18 ans.'
      if (!isValidPhone(form.phone)) errs.phone = 'Numéro de téléphone invalide.'
      if (form.whatsapp && !isValidPhone(form.whatsapp)) errs.whatsapp = 'Numéro WhatsApp invalide.'
      if (!isValidEmail(form.email)) errs.email = 'Adresse email invalide.'
      if (!form.address.trim()) errs.address = 'Indiquez votre adresse complète.'
      if (!form.city.trim()) errs.city = 'Indiquez votre ville.'
      if (!form.nationality.trim()) errs.nationality = 'Indiquez votre nationalité.'
      if (form.password.length < 6) errs.password = 'Le mot de passe doit contenir au moins 6 caractères.'
      if (form.password_confirm !== form.password) errs.password_confirm = 'La confirmation ne correspond pas au mot de passe.'
    }
    if (idx === 1) {
      if (form.gp_type === 'professionnel' && !isValidNinea(form.ninea)) {
        errs.ninea = 'Le NINEA est obligatoire et doit contenir 9 chiffres.'
      }
      if (!form.id_number.trim()) errs.id_number = 'Indiquez le numéro de la pièce.'
      if (!form.id_country.trim()) errs.id_country = 'Indiquez le pays d’émission.'
    }
    if (idx === 2) {
      if (!form.transport_mode) errs.transport_mode = 'Sélectionnez un mode de transport.'
      if (!form.departure.trim()) errs.departure = 'Indiquez votre ville de départ habituelle.'
      if (!form.destinations.trim()) errs.destinations = 'Indiquez vos destinations habituelles.'
    }
    if (idx === 4) {
      if (!agree.cgu) errs.cgu = 'Vous devez accepter les conditions générales.'
      if (!agree.transport) errs.transport = 'Vous devez accepter les conditions de transport de colis.'
      if (!agree.certify) errs.certify = 'Vous devez certifier l’exactitude des informations.'
    }
    return errs
  }

  const next = () => {
    if (step >= STEPS.length - 1) return
    const errs = validateStep(step)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setStep((s) => s + 1)
  }

  const back = () => {
    setErrors({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setStep((s) => Math.max(0, s - 1))
  }

  const submit = async () => {
    const errs = validateStep(4)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setBusy(true)
    try {
      const user = registerProfile({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email,
        phone: form.phone,
        role: 'gp',
        password: form.password,
        city: form.city.trim(),
        country: form.country,
      })
      saveDossier(user.email, 'gp', {
        gp_type: form.gp_type,
        ninea: form.ninea,
        birth_date: form.birth_date,
        nationality: form.nationality,
        address: form.address,
        whatsapp: form.whatsapp,
        id_type: form.id_type,
        id_number: form.id_number,
        id_country: form.id_country,
        transport_mode: form.transport_mode,
        departure: form.departure,
        destinations: form.destinations.split(',')
          .flatMap((d) => d.split('\n'))
          .map((d) => d.trim())
          .filter(Boolean),
        carrier: form.carrier,
        docs: Object.entries(docs)
          .filter(([, v]) => v.length > 0)
          .map(([k, v]) => ({ type: k, files: v.map((f) => f.name) })),
      })
      await login(form.email, form.password)
      toast('Votre demande GP a été envoyée.')
      setSubmitted(true)
    } catch (err) {
      setBusy(false)
      if (err instanceof Error && err.message === 'EMAIL_EXISTS') {
        setErrors({ email: 'Un compte existe déjà avec cette adresse email.' })
      } else {
        toast('Une erreur est survenue lors de l’envoi de votre demande.', 'error')
      }
    }
  }

  if (submitted) {
    return (
      <AuthScaffold variant="centered">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center sm:p-10 animate-fade-up">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#D1FAE5]">
            <Check size={28} className="text-[#047857]" />
          </span>
          <h1 className="mt-6 font-display text-2xl font-bold text-[#0F2450] sm:text-3xl">
            Votre demande GP a été envoyée
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[#64748B]">
            Nous allons vérifier vos informations avant l’activation de votre
            profil GP. Vous pourrez proposer des voyages dès votre validation.
          </p>
          <div className="mt-5 flex justify-center">
            <Badge tone="amber">
              <ShieldCheck size={13} /> Vérification en attente
            </Badge>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/gp"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1B3A70] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0F2450]"
            >
              Accéder à mon espace <ChevronRight size={16} />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-[#1B3A70] hover:bg-slate-50"
            >
              <Home size={16} /> Retour à l’accueil
            </Link>
          </div>
        </div>
      </AuthScaffold>
    )
  }

  return (
    <AuthScaffold variant="centered">
      <div className="mb-4 flex items-center justify-between">
        <FlowTag tone="green">Parcours GP / Voyageur</FlowTag>
        <BackToChoice />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 animate-fade-up">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#0F2450] sm:text-3xl">
              Devenir GP / Voyageur
            </h1>
            <p className="mt-1.5 text-[#64748B]">
              Profitez de vos déplacements pour transporter des colis et générer
              un revenu supplémentaire.
            </p>
          </div>
          <WizardProgress
            title="Inscription GP"
            current={step + 1}
            steps={STEPS}
            tone="green"
          />
        </div>

        <div className="mt-7">
          {step === 0 && (
            <section className="space-y-5">
              <SectionTitle icon={<User size={16} />} subtitle="Ces informations servent à créer votre compte sécurisé.">
                Informations personnelles
              </SectionTitle>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Prénom" error={errors.first_name}>
                  <Input value={form.first_name} onChange={set('first_name')} placeholder="Mamadou" autoComplete="given-name" />
                </Field>
                <Field label="Nom" error={errors.last_name}>
                  <Input value={form.last_name} onChange={set('last_name')} placeholder="Diop" autoComplete="family-name" />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Date de naissance" error={errors.birth_date} hint="Vous devez avoir au moins 18 ans.">
                  <div className="relative">
                    <Calendar size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input className="pl-9" type="date" value={form.birth_date} onChange={set('birth_date')} />
                  </div>
                </Field>
                <Field label="Nationalité" error={errors.nationality}>
                  <Select value={form.nationality} onChange={set('nationality')}>
                    {NATIONALITIES.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </Select>
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Numéro de téléphone" error={errors.phone}>
                  <div className="relative">
                    <Phone size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input className="pl-9" value={form.phone} onChange={set('phone')} placeholder="77 123 45 67" inputMode="tel" autoComplete="tel" />
                  </div>
                </Field>
                <Field label="Numéro WhatsApp" error={errors.whatsapp}>
                  <div className="relative">
                    <MessageCircle size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input className="pl-9" value={form.whatsapp} onChange={set('whatsapp')} placeholder="77 123 45 67" inputMode="tel" />
                  </div>
                </Field>
              </div>
              <Field label="Adresse e-mail" error={errors.email}>
                <div className="relative">
                  <Mail size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input className="pl-9" type="email" value={form.email} onChange={set('email')} placeholder="mamadou@exemple.sn" autoComplete="email" />
                </div>
              </Field>
              <Field label="Adresse complète" error={errors.address}>
                <Input value={form.address} onChange={set('address')} placeholder="Ouakam, Villa n°12, Dakar" autoComplete="street-address" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Ville" error={errors.city}>
                  <div className="relative">
                    <MapPin size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input className="pl-9" value={form.city} onChange={set('city')} placeholder="Dakar" />
                  </div>
                </Field>
                <Field label="Pays" error={errors.country}>
                  <div className="relative">
                    <Globe size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Select className="pl-9" value={form.country} onChange={set('country')}>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </Select>
                  </div>
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Mot de passe" error={errors.password}>
                  <div className="relative">
                    <Lock size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input className="pl-9" type="password" value={form.password} onChange={set('password')} placeholder="6 caractères minimum" autoComplete="new-password" />
                  </div>
                </Field>
                <Field label="Confirmation du mot de passe" error={errors.password_confirm}>
                  <div className="relative">
                    <Lock size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input className="pl-9" type="password" value={form.password_confirm} onChange={set('password_confirm')} placeholder="Confirmez le mot de passe" autoComplete="new-password" />
                  </div>
                </Field>
              </div>
            </section>
          )}

          {step === 1 && (
            <section className="space-y-5">
              <SectionTitle>Parlez-nous de votre activité de voyageur</SectionTitle>

              <Field label="Type de profil">
                <div className="grid gap-3 sm:grid-cols-2">
                  {GP_TYPES.map((t) => {
                    const selected = form.gp_type === t.value
                    return (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setForm((s) => ({ ...s, gp_type: t.value }))}
                        aria-pressed={selected}
                        className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors ${
                          selected
                            ? 'border-[#059669] bg-[#D1FAE5]/60 ring-2 ring-[#059669]/30'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${selected ? 'bg-[#059669] text-white' : 'bg-[#EEF2F8] text-[#1B3A70]'}`}>
                          {t.value === 'particulier' ? <User size={16} /> : <BadgeCheck size={16} />}
                        </span>
                        <span>
                          <span className="block text-sm font-bold text-[#0F2450]">{t.label}</span>
                          <span className="mt-0.5 block text-xs text-[#64748B]">
                            {t.value === 'particulier'
                              ? 'Je transporte des colis lors de mes déplacements personnels.'
                              : 'Le transport de colis est une activité régulière / rémunérée.'}
                          </span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </Field>

              {form.gp_type === 'professionnel' && (
                <div className="rounded-2xl border border-[#A7F3D0] bg-[#F0FDF9] p-4">
                  <Field label="NINEA" error={errors.ninea} hint="9 chiffres, tel qu’indiqué sur votre document officiel.">
                    <Input value={form.ninea} onChange={set('ninea')} placeholder="412345678" inputMode="numeric" />
                  </Field>
                </div>
              )}

              <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4">
                <p className="mb-4 flex items-center gap-2 text-sm font-bold text-[#0F2450]">
                  <ShieldCheck size={16} className="text-[#059669]" />
                  Pièce d’identité
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Type de pièce">
                    <Select value={form.id_type} onChange={set('id_type')}>
                      {ID_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Pays d’émission" error={errors.id_country}>
                    <Select value={form.id_country} onChange={set('id_country')}>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </Select>
                  </Field>
                </div>
                <div className="mt-4">
                  <Field label="Numéro de pièce" error={errors.id_number}>
                    <Input value={form.id_number} onChange={set('id_number')} placeholder="Ex. 1 275 1999 00123" />
                  </Field>
                </div>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-5">
              <SectionTitle>Vos habitudes de voyage</SectionTitle>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Mode de transport habituel" error={errors.transport_mode}>
                  <Select value={form.transport_mode} onChange={set('transport_mode')}>
                    {TRANSPORT_MODES.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Ville de départ habituelle" error={errors.departure}>
                  <div className="relative">
                    <MapPin size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input className="pl-9" value={form.departure} onChange={set('departure')} placeholder="Dakar, Sénégal" />
                  </div>
                </Field>
              </div>

              <Field
                label="Destinations habituelles"
                error={errors.destinations}
                hint="Une destination par ligne ou séparées par des virgules."
              >
                <Textarea
                  value={form.destinations}
                  onChange={set('destinations')}
                  placeholder={'Paris, France\nLyon, France\nMadrid, Espagne'}
                />
              </Field>

              <Field label="Compagnie de transport habituelle" error={errors.carrier} hint="Facultatif — par exemple Air Sénégal, une compagnie de bus, etc.">
                <Input value={form.carrier} onChange={set('carrier')} placeholder="Air Sénégal" />
              </Field>

              <div className="flex items-start gap-2 rounded-2xl bg-[#EEF2F8] p-4 text-sm text-[#1B3A70]">
                <FileCheck2 size={16} className="mt-0.5 shrink-0" />
                <p>
                  La capacité disponible et le prix par kg seront renseignés
                  <strong> à chaque publication de voyage</strong>, en fonction de votre déplacement.
                </p>
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="space-y-6">
              <SectionTitle>Vérification du profil</SectionTitle>

              <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <ShieldCheck size={18} className="mt-0.5 shrink-0 text-amber-600" />
                <p className="text-sm font-medium text-amber-800">
                  Votre profil GP sera vérifié avant que vous puissiez proposer des voyages.
                </p>
              </div>

              <div className="space-y-5">
                <FileDrop
                  id="gp-photo"
                  label="Photo de profil"
                  hint="Format JPG ou PNG, 2 Mo maximum."
                  maxMB={2}
                  accept=".jpg,.jpeg,.png"
                  value={docs.photo}
                  onChange={setDocsFor('photo')}
                />
                <FileDrop
                  id="gp-identity"
                  label="Pièce d’identité"
                  hint="CNI, passeport ou carte de séjour — PDF, JPG ou PNG, 5 Mo maximum."
                  value={docs.identity}
                  onChange={setDocsFor('identity')}
                  secure
                />
                {form.gp_type === 'professionnel' && (
                  <FileDrop
                    id="gp-professional"
                    label="Document professionnel"
                    hint="Justificatif de votre activité professionnelle (NINEA, attestation…)."
                    value={docs.professional}
                    onChange={setDocsFor('professional')}
                    secure
                  />
                )}
                <FileDrop
                  id="gp-extra"
                  label="Justificatif complémentaire"
                  hint="Facultatif — tout document appuyant votre demande."
                  multiple
                  value={docs.extra}
                  onChange={setDocsFor('extra')}
                  secure
                />
              </div>
            </section>
          )}

          {step === 4 && (
            <section className="space-y-6">
              <SectionTitle>Vérifiez votre demande avant l’envoi</SectionTitle>

              <Recap
                label={null}
                rows={[
                  { label: 'Identité', value: `${form.first_name} ${form.last_name}` },
                  { label: 'Date de naissance', value: new Date(form.birth_date).toLocaleDateString('fr-FR') },
                  { label: 'Nationalité', value: form.nationality },
                  { label: 'Téléphone', value: form.phone },
                  { label: 'WhatsApp', value: form.whatsapp || '—' },
                  { label: 'Email', value: form.email },
                  { label: 'Adresse', value: `${form.address}, ${form.city}, ${form.country}` },
                ]}
              />
              <Recap
                label="Profil GP"
                rows={[
                  { label: 'Type de profil', value: form.gp_type === 'professionnel' ? 'GP professionnel' : 'GP particulier' },
                  ...(form.gp_type === 'professionnel' ? [{ label: 'NINEA', value: form.ninea }] : []),
                  { label: 'Pièce d’identité', value: `${ID_TYPE_LABEL[form.id_type] ?? form.id_type} — ${form.id_number}` },
                  { label: 'Pays d’émission', value: form.id_country },
                ]}
              />
              <Recap
                label="Voyage"
                rows={[
                  { label: 'Mode de transport', value: form.transport_mode },
                  { label: 'Départ habituel', value: form.departure },
                  {
                    label: 'Destinations',
                    value: form.destinations
                      .split(',')
                      .flatMap((d) => d.split('\n'))
                      .map((d) => d.trim())
                      .filter(Boolean)
                      .join(', '),
                  },
                  { label: 'Compagnie', value: form.carrier || '—' },
                  {
                    label: 'Documents',
                    value:
                      Object.values(docs).reduce((n, v) => n + v.length, 0) > 0
                        ? `${Object.values(docs).reduce((n, v) => n + v.length, 0)} document(s) joint(s)`
                        : 'Aucun document joint',
                  },
                ]}
              />

              <div className="space-y-3 rounded-2xl bg-[#F8FAFC] p-5">
                <AgreeCheck id="gp-cgu" checked={agree.cgu} onChange={(v) => setAgree((s) => ({ ...s, cgu: v }))} error={errors.cgu}>
                  J’accepte les conditions générales de SAMA GP
                </AgreeCheck>
                <AgreeCheck id="gp-tc" checked={agree.transport} onChange={(v) => setAgree((s) => ({ ...s, transport: v }))} error={errors.transport}>
                  J’accepte les conditions applicables au transport de colis
                </AgreeCheck>
                <AgreeCheck id="gp-cert" checked={agree.certify} onChange={(v) => setAgree((s) => ({ ...s, certify: v }))} error={errors.certify}>
                  Je certifie que les informations fournies sont exactes
                </AgreeCheck>
              </div>
            </section>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
          {step > 0 ? (
            <Button variant="secondary" onClick={back}>
              <ChevronLeft size={16} /> Précédent
            </Button>
          ) : (
            <span />
          )}
          {step < STEPS.length - 1 ? (
            <Button onClick={next}>
              Continuer <ChevronRight size={16} />
            </Button>
          ) : (
            <Button variant="success" loading={busy} onClick={submit}>
              <Send size={16} /> Envoyer ma demande GP
            </Button>
          )}
        </div>
      </div>
    </AuthScaffold>
  )
}

function SectionTitle({ children, icon, subtitle }: { children: string; icon?: ReactNode; subtitle?: string }) {
  return (
    <div>
      <h2 className="flex items-center gap-2 font-display text-lg font-bold text-[#0F2450]">
        {icon && <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EEF2F8] text-[#1B3A70]">{icon}</span>}
        {children}
      </h2>
      {subtitle && <p className="mt-1 text-sm text-[#64748B]">{subtitle}</p>}
    </div>
  )
}

function Recap({
  label,
  rows,
}: {
  label: string | null
  rows: { label: string; value: string }[]
}) {
  return (
    <div>
      {label && (
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-[#64748B]">{label}</h3>
      )}
      <dl className="overflow-hidden rounded-2xl border border-slate-200">
        {rows.map((r, i) => (
          <div
            key={r.label}
            className={`grid grid-cols-1 gap-0.5 px-4 py-2.5 text-sm sm:grid-cols-[minmax(0,200px)_1fr] ${
              i % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'
            }`}
          >
            <dt className="text-[#64748B]">{r.label}</dt>
            <dd className="font-medium text-slate-800">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}