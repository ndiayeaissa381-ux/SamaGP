import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Mail, Phone, Lock, ArrowRight, Package } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Field, Input } from '../components/ui/Field'
import { Button } from '../components/ui/Button'
import { demoUsers } from '../lib/db'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)

  const from = (location.state as { from?: string } | null)?.from
  const demo = demoUsers().slice(0, 4)

  const submit = async () => {
    const errs: Record<string, string> = {}
    if (!identifier.trim()) errs.identifier = 'Indiquez votre email ou votre téléphone.'
    if (!password) errs.password = 'Indiquez votre mot de passe.'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setBusy(true)
    const res = await login(identifier, password)
    setBusy(false)
    if (!res.ok) {
      setErrors({ password: res.error ?? 'Connexion impossible.' })
      return
    }
    toast('Bienvenue sur SAMA GP.')
    navigate(from ?? homeFor(res.profile?.role))
  }

  return (
    <main className="mx-auto grid min-h-[80vh] max-w-5xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
      <div className="hidden lg:block">
        <AuthAside />
      </div>

      <div>
        <div className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-9">
          <h1 className="font-display text-2xl font-bold text-[#0F2450] sm:text-3xl">Connexion</h1>
          <p className="mt-1.5 text-[#64748B]">
            Accédez à votre espace SAMA GP.
          </p>

          <form
            className="mt-7 space-y-5"
            onSubmit={(e) => {
              e.preventDefault()
              submit()
            }}
          >
            <Field label="Email ou téléphone" error={errors.identifier}>
              <div className="relative">
                <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  className="pl-10"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="awa@samagp.sn"
                  autoComplete="username"
                />
              </div>
            </Field>
            <Field label="Mot de passe" error={errors.password}>
              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  className="pl-10"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
            </Field>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-[#1B3A70]" />
                Se souvenir de moi
              </label>
              <Link to="/forgot-password" className="font-semibold text-[#1B3A70] hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>
            <Button type="submit" size="lg" className="w-full" loading={busy}>
              Se connecter <ArrowRight size={16} />
            </Button>
          </form>

          <div className="mt-6 rounded-2xl bg-[#F8FAFC] p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-[#64748B]">
              Comptes de démonstration
            </p>
            <div className="mt-3 space-y-1.5">
              {demo.map((d) => (
                <button
                  key={d.email}
                  onClick={() => {
                    setIdentifier(d.email)
                    setPassword('samagp2026')
                    setErrors({})
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-sm hover:bg-white"
                >
                  <span className="font-medium text-slate-700">{d.label}</span>
                  <span className="text-xs text-slate-400">
                    {d.role === 'gp' ? 'GP' : d.role === 'transitaire' ? 'Transitaire' : 'Particulier'}
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-[#64748B]">
              Mot de passe pour tous : <code className="rounded bg-white px-1.5 py-0.5 font-semibold">samagp2026</code>
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-[#64748B]">
            Pas encore de compte ?
            <Link to="/register" className="font-semibold text-[#1B3A70] hover:underline">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

export function AuthAside() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#0F2450] p-9">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(500px 300px at 10% 0%, rgba(42,80,160,0.6), transparent 60%), radial-gradient(400px 300px at 100% 100%, rgba(5,150,105,0.4), transparent 60%)',
        }}
      />
      <div className="relative">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
          <Package size={24} className="text-[#D1FAE5]" />
        </span>
        <h2 className="mt-6 font-display text-2xl font-bold text-white">
          Ton colis, notre voyage.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Recherchez, comparez, réservez et suivez vos colis entre le Sénégal et
          l'international grâce à notre réseau de voyageurs et de transporteurs.
        </p>
        <ul className="mt-6 space-y-2 text-sm text-slate-200">
          {['Profils vérifiés avant publication', 'Tarifs transparents au kilogramme', 'Suivi par statut à chaque étape'].map((t) => (
            <li key={t} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#6EE7B7]" /> {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function homeFor(role?: string): string {
  if (role === 'admin') return '/admin'
  if (role === 'gp') return '/gp'
  if (role === 'transitaire') return '/transitaire'
  return '/dashboard'
}