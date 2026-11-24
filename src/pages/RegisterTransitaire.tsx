import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2,
  Phone,
  MessageCircle,
  Mail,
  Lock,
  MapPin,
  Globe,
  User,
  Check,
  ChevronLeft,
  ChevronRight,
  Send,
  Home,
  Briefcase,
  ShieldCheck,
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
import { COUNTRIES, LEGAL_FORMS, SERVICES_OPTIONS, isValidNinea, isValidUrl } from '../components/registration/options'

const STEPS = ['Entreprise', 'Responsable', 'Activité', 'Documents', 'Confirmation']

interface CompanyForm {
  commercial_name: string
  legal_name: string
  ninea: string
  rccm: string
  legal_form: string
  address: string
  city: string
  country: string
  phone: string
  whatsapp: string
  email: string
  website: string
  password: string
  password_confirm: string
  resp_first_name: string
  resp_last_name: string
  resp_fonction: string
  resp_phone: string
  resp_email: string
  services: string[]
  destinations: string
  description: string
}

const EMPTY: CompanyForm = {
  commercial_name: '',
  legal_name: '',
  ninea: '',
  rccm: '',
  legal_form: 'SARL',
  address: '',
  city: '',
  country: 'Sénégal',
  phone: '',
  whatsapp: '',
  email: '',
  website: '',
  password: '',
  password_confirm: '',
  resp_first_name: '',
  resp_last_name: '',
  resp_fonction: '',
  resp_phone: '',
  resp_email: '',
  services: [],
  destinations: '',
  description: '',
}

const DOC_LABEL: Record<string, string> = {
  ninea: 'NINEA / justificatif',
  rccm: 'Registre de commerce (RCCM)',
  identity: 'Pièce d’identité du responsable',
  address: 'Justificatif d’adresse',
  other: 'Autres documents',
}

export default function RegisterTransitaire() {
  const { toast } = useToast()
  const { login } = useAuth()

  const [step, setStep] = useState(0)
  const [form, setForm] = useState<CompanyForm>(EMPTY)
  const [docs, setDocs] = useState<Record<string, UploadedFile[]>>({
    ninea: [],
    rccm: [],
    identity: [],
    address: [],
    other: [],
  })
  const [agree, setAgree] = useState({ cgu: false, represent: false, certify: false })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const set = (k: keyof CompanyForm) => (e: { target: { value: string } }) => {
    const v = e.target.value
    setForm((s) => ({ ...s, [k]: v }))
  }

  const setDocsFor = (key: string) => (files: UploadedFile[]) =>
    setDocs((s) => ({ ...s, [key]: files }))

  const toggleService = (service: string) =>
    setForm((s) => ({
      ...s,
      services: s.services.includes(service)
        ? s.services.filter((x) => x !== service)
        : [...s.services, service],
    }))

  const validateStep = (idx: number): Record<string, string> => {
    const errs: Record<string, string> = {}
    if (idx === 0) {
      if (!form.commercial_name.trim()) errs.commercial_name = 'Indiquez le nom commercial.'
      if (!form.legal_name.trim()) errs.legal_name = 'Indiquez la raison sociale.'
      if (!isValidNinea(form.ninea)) errs.ninea = 'Le NINEA est obligatoire et doit contenir 9 chiffres.'
      if (!form.rccm.trim()) errs.rccm = 'Le registre de commerce (RCCM) est obligatoire.'
      if (!form.legal_form) errs.legal_form = 'Sélectionnez la forme juridique.'
      if (!form.address.trim()) errs.address = 'Indiquez l’adresse du siège.'
      if (!form.city.trim()) errs.city = 'Indiquez la ville.'
      if (!isValidPhone(form.phone)) errs.phone = 'Numéro de téléphone professionnel invalide.'
      if (form.whatsapp && !isValidPhone(form.whatsapp)) errs.whatsapp = 'Numéro WhatsApp invalide.'
      if (!isValidEmail(form.email)) errs.email = 'E-mail professionnel invalide.'
      if (!isValidUrl(form.website)) errs.website = 'Adresse de site web invalide.'
      if (form.password.length < 6) errs.password = 'Le mot de passe doit contenir au moins 6 caractères.'
      if (form.password_confirm !== form.password) errs.password_confirm = 'La confirmation ne correspond pas au mot de passe.'
    }
    if (idx === 1) {
      if (!form.resp_first_name.trim()) errs.resp_first_name = 'Indiquez le prénom du responsable.'
      if (!form.resp_last_name.trim()) errs.resp_last_name = 'Indiquez le nom du responsable.'
      if (!form.resp_fonction.trim()) errs.resp_fonction = 'Indiquez la fonction.'
      if (!isValidPhone(form.resp_phone)) errs.resp_phone = 'Numéro de téléphone invalide.'
      if (!isValidEmail(form.resp_email)) errs.resp_email = 'Adresse email invalide.'
    }
    if (idx === 2) {
      if (form.services.length === 0) errs.services = 'Sélectionnez au moins un service.'
      if (!form.destinations.trim()) errs.destinations = 'Indiquez les destinations desservies.'
      if (form.description.trim().length < 20) errs.description = 'Décrivez votre activité (20 caractères minimum).'
    }
    if (idx === 3) {
      if (docs.ninea.length === 0) errs.ninea_doc = 'Joignez votre NINEA / justificatif.'
      if (docs.rccm.length === 0) errs.rccm_doc = 'Joignez votre registre de commerce (RCCM).'
    }
    if (idx === 4) {
      if (!agree.cgu) errs.cgu = 'Vous devez accepter les conditions générales.'
      if (!agree.represent) errs.represent = 'Vous devez certifier être habilité à représenter cette entreprise.'
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
        first_name: form.resp_first_name.trim(),
        last_name: form.resp_last_name.trim(),
        email: form.email,
        phone: form.phone,
        role: 'transitaire',
        password: form.password,
        city: form.city.trim(),
        country: form.country,
      })
      saveDossier(user.email, 'transitaire', {
        company: {
          commercial_name: form.commercial_name,
          legal_name: form.legal_name,
          ninea: form.ninea,
          rccm: form.rccm,
          legal_form: form.legal_form,
          address: form.address,
          city: form.city,
          country: form.country,
          whatsapp: form.whatsapp,
          website: form.website,
        },
        responsible: {
          first_name: form.resp_first_name,
          last_name: form.resp_last_name,
          fonction: form.resp_fonction,
          phone: form.resp_phone,
          email: form.resp_email,
        },
        activity: {
          services: form.services,
          destinations: form.destinations
            .split(',')
            .flatMap((d) => d.split('\n'))
            .map((d) => d.trim())
            .filter(Boolean),
          description: form.description,
        },
        docs: Object.entries(docs)
          .filter(([, v]) => v.length > 0)
          .map(([k, v]) => ({ type: k, files: v.map((f) => f.name) })),
      })
      await login(form.email, form.password)
      toast('Votre demande a été envoyée.')
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
            Votre demande a été envoyée
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[#64748B]">
            Votre entreprise sera vérifiée avant que vous puissiez publier vos
            offres sur SAMA GP.
          </p>
          <div className="mt-5 flex justify-center">
            <Badge tone="amber">
              <ShieldCheck size={13} /> Vérification en attente
            </Badge>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/transitaire"
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
        <FlowTag tone="violet">Parcours Transitaire</FlowTag>
        <BackToChoice />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 animate-fade-up">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#0F2450] sm:text-3xl">
              Devenir transitaire
            </h1>
            <p className="mt-1.5 text-[#64748B]">
              Présentez votre entreprise et proposez vos solutions de transport
              sur SAMA GP.
            </p>
          </div>
          <WizardProgress title="Inscription Transitaire" current={step + 1} steps={STEPS} />
        </div>

        <div className="mt-7">
          {step === 0 && (
            <section className="space-y-5">
              <SectionTitle icon={<Building2 size={16} />}>Informations de l’entreprise</SectionTitle>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nom commercial" error={errors.commercial_name}>
                  <Input value={form.commercial_name} onChange={set('commercial_name')} placeholder="SenTrans Express" />
                </Field>
                <Field label="Raison sociale" error={errors.legal_name}>
                  <Input value={form.legal_name} onChange={set('legal_name')} placeholder="SENEGAL TRANSPORT SARL" />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="NINEA" error={errors.ninea} hint="9 chiffres.">
                  <Input value={form.ninea} onChange={set('ninea')} placeholder="412345678" inputMode="numeric" />
                </Field>
                <Field label="Registre de commerce (RCCM)" error={errors.rccm}>
                  <Input value={form.rccm} onChange={set('rccm')} placeholder="SN-DKR-2023-B-12345" />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Forme juridique" error={errors.legal_form}>
                  <Select value={form.legal_form} onChange={set('legal_form')}>
                    {LEGAL_FORMS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Adresse du siège" error={errors.address}>
                  <div className="relative">
                    <MapPin size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input className="pl-9" value={form.address} onChange={set('address')} placeholder="Zone industrielle, Dakar" autoComplete="street-address" />
                  </div>
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Ville" error={errors.city}>
                  <Input value={form.city} onChange={set('city')} placeholder="Dakar" />
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
              <SectionTitle icon={<Phone size={16} />}>Coordonnées professionnelles</SectionTitle>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Téléphone professionnel" error={errors.phone}>
                  <div className="relative">
                    <Phone size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input className="pl-9" value={form.phone} onChange={set('phone')} placeholder="33 800 00 00" inputMode="tel" autoComplete="tel" />
                  </div>
                </Field>
                <Field label="WhatsApp professionnel" error={errors.whatsapp}>
                  <div className="relative">
                    <MessageCircle size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input className="pl-9" value={form.whatsapp} onChange={set('whatsapp')} placeholder="77 123 45 67" inputMode="tel" />
                  </div>
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="E-mail professionnel" error={errors.email}>
                  <div className="relative">
                    <Mail size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input className="pl-9" type="email" value={form.email} onChange={set('email')} placeholder="contact@entreprise.sn" autoComplete="email" />
                  </div>
                </Field>
                <Field label="Site web" error={errors.website} hint="Facultatif.">
                  <Input value={form.website} onChange={set('website')} placeholder="www.entreprise.sn" />
                </Field>
              </div>

              <SectionTitle icon={<Lock size={16} />}>Création de votre compte</SectionTitle>
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
              <SectionTitle icon={<User size={16} />}>Responsable de l’entreprise</SectionTitle>
              <p className="text-sm text-[#64748B]">
                Contact principal pour la vérification et le suivi de la demande.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Prénom" error={errors.resp_first_name}>
                  <Input value={form.resp_first_name} onChange={set('resp_first_name')} placeholder="Moussa" autoComplete="given-name" />
                </Field>
                <Field label="Nom" error={errors.resp_last_name}>
                  <Input value={form.resp_last_name} onChange={set('resp_last_name')} placeholder="Sow" autoComplete="family-name" />
                </Field>
              </div>
              <Field label="Fonction" error={errors.resp_fonction}>
                <div className="relative">
                  <Briefcase size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input className="pl-9" value={form.resp_fonction} onChange={set('resp_fonction')} placeholder="Gérant" />
                </div>
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Téléphone" error={errors.resp_phone}>
                  <div className="relative">
                    <Phone size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input className="pl-9" value={form.resp_phone} onChange={set('resp_phone')} placeholder="77 123 45 67" inputMode="tel" />
                  </div>
                </Field>
                <Field label="E-mail" error={errors.resp_email}>
                  <div className="relative">
                    <Mail size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input className="pl-9" type="email" value={form.resp_email} onChange={set('resp_email')} placeholder="direction@entreprise.sn" autoComplete="email" />
                  </div>
                </Field>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-5">
              <SectionTitle icon={<Briefcase size={16} />}>Présentez votre activité</SectionTitle>

              <div>
                <p className="text-sm font-medium text-slate-700">
                  Services proposés <span className="text-red-500">*</span>
                </p>
                {errors.services && <p className="mt-1 text-sm text-red-600">{errors.services}</p>}
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {SERVICES_OPTIONS.map((s) => {
                    const on = form.services.includes(s)
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleService(s)}
                        aria-pressed={on}
                        className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-semibold transition-colors ${
                          on
                            ? 'border-[#1B3A70] bg-[#1B3A70] text-white'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {on && <Check size={14} />}
                        {s}
                      </button>
                    )
                  })}
                </div>
              </div>

              <Field
                label="Pays / destinations desservis"
                error={errors.destinations}
                hint="Une destination par ligne ou séparées par des virgules."
              >
                <Textarea
                  value={form.destinations}
                  onChange={set('destinations')}
                  placeholder={'Dakar, Sénégal\nParis, France\nAbidjan, Côte d’Ivoire'}
                />
              </Field>

              <Field label="Description de l’activité" error={errors.description} hint="Décrivez vos activités, votre flotte ou vos partenaires (20 caractères minimum).">
                <Textarea
                  value={form.description}
                  onChange={set('description')}
                  placeholder="Transport express entre Dakar et l’Europe, fret aérien et maritime..."
                />
              </Field>
            </section>
          )}

          {step === 3 && (
            <section className="space-y-6">
              <SectionTitle icon={<ShieldCheck size={16} />}>Documents de l’entreprise</SectionTitle>
              <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <ShieldCheck size={18} className="mt-0.5 shrink-0 text-amber-600" />
                <p className="text-sm font-medium text-amber-800">
                  Ces informations permettent de vérifier votre entreprise avant
                  sa publication sur SAMA GP.
                </p>
              </div>

              <div className="space-y-5">
                <FileDrop
                  id="tr-ninea"
                  label="NINEA / justificatif"
                  required
                  hint="PDF, JPG ou PNG — 5 Mo maximum."
                  value={docs.ninea}
                  onChange={setDocsFor('ninea')}
                  secure
                />
                {errors.ninea_doc && <p className="text-sm text-red-600">{errors.ninea_doc}</p>}
                <FileDrop
                  id="tr-rccm"
                  label="Registre de commerce (RCCM)"
                  required
                  hint="PDF, JPG ou PNG — 5 Mo maximum."
                  value={docs.rccm}
                  onChange={setDocsFor('rccm')}
                  secure
                />
                {errors.rccm_doc && <p className="text-sm text-red-600">{errors.rccm_doc}</p>}
                <FileDrop
                  id="tr-identity"
                  label="Pièce d’identité du responsable"
                  hint="CNI ou passeport du responsable."
                  value={docs.identity}
                  onChange={setDocsFor('identity')}
                  secure
                />
                <FileDrop
                  id="tr-address"
                  label="Justificatif d’adresse"
                  hint="Facture récente d’eau ou d’électricité, contrat de bail…"
                  value={docs.address}
                  onChange={setDocsFor('address')}
                  secure
                />
                <FileDrop
                  id="tr-other"
                  label="Autres documents"
                  hint="Facultatif — attestations, agréments, assurances…"
                  multiple
                  value={docs.other}
                  onChange={setDocsFor('other')}
                  secure
                />
              </div>
            </section>
          )}

          {step === 4 && (
            <section className="space-y-6">
              <SectionTitle>Vérifiez votre demande avant l’envoi</SectionTitle>

              <Recap
                label="Entreprise"
                rows={[
                  { label: 'Nom commercial', value: form.commercial_name },
                  { label: 'Raison sociale', value: form.legal_name },
                  { label: 'NINEA', value: form.ninea },
                  { label: 'RCCM', value: form.rccm },
                  { label: 'Forme juridique', value: form.legal_form },
                  { label: 'Siège', value: `${form.address}, ${form.city}, ${form.country}` },
                  { label: 'Téléphone', value: form.phone },
                  { label: 'WhatsApp', value: form.whatsapp || '—' },
                  { label: 'Email', value: form.email },
                  { label: 'Site web', value: form.website || '—' },
                ]}
              />
              <Recap
                label="Responsable"
                rows={[
                  { label: 'Nom', value: `${form.resp_first_name} ${form.resp_last_name}` },
                  { label: 'Fonction', value: form.resp_fonction },
                  { label: 'Téléphone', value: form.resp_phone },
                  { label: 'Email', value: form.resp_email },
                ]}
              />
              <Recap
                label="Activité"
                rows={[
                  { label: 'Services', value: form.services.join(', ') },
                  {
                    label: 'Destinations',
                    value: form.destinations
                      .split(',')
                      .flatMap((d) => d.split('\n'))
                      .map((d) => d.trim())
                      .filter(Boolean)
                      .join(', '),
                  },
                  { label: 'Description', value: form.description },
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
                <AgreeCheck id="tr-cgu" checked={agree.cgu} onChange={(v) => setAgree((s) => ({ ...s, cgu: v }))} error={errors.cgu}>
                  J’accepte les conditions générales de SAMA GP
                </AgreeCheck>
                <AgreeCheck id="tr-rep" checked={agree.represent} onChange={(v) => setAgree((s) => ({ ...s, represent: v }))} error={errors.represent}>
                  Je certifie être habilité à représenter cette entreprise
                </AgreeCheck>
                <AgreeCheck id="tr-cert" checked={agree.certify} onChange={(v) => setAgree((s) => ({ ...s, certify: v }))} error={errors.certify}>
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
              <Send size={16} /> Soumettre ma demande
            </Button>
          )}
        </div>
      </div>
    </AuthScaffold>
  )
}

function SectionTitle({ children, icon }: { children: string; icon?: ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 font-display text-lg font-bold text-[#0F2450]">
      {icon && <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 text-violet-700">{icon}</span>}
      {children}
    </h2>
  )
}

function Recap({ label, rows }: { label: string; rows: { label: string; value: string }[] }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-[#64748B]">{label}</h3>
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