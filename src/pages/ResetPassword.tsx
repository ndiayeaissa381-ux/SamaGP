import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Check, ArrowRight, Copy } from 'lucide-react'
import { Field, Input } from '../components/ui/Field'
import { Button } from '../components/ui/Button'
import { useToast } from '../context/ToastContext'
import { Card } from '../components/ui/Card'

export default function ResetPassword() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const submit = () => {
    const errs: Record<string, string> = {}
    if (password.length < 6) errs.password = 'Le mot de passe doit contenir au moins 6 caractères.'
    if (confirm !== password) errs.confirm = 'La confirmation ne correspond pas.'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    toast('Votre mot de passe a été réinitialisé.')
    navigate('/login')
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <Card className="p-7 sm:p-9">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF2F8] text-[#1B3A70]">
          <Lock size={22} />
        </span>
        <h1 className="mt-4 font-display text-2xl font-bold text-[#0F2450]">
          Nouveau mot de passe
        </h1>
        <p className="mt-1.5 text-sm text-[#64748B]">
          Choisissez un nouveau mot de passe pour votre compte.
        </p>
        <form
          className="mt-6 space-y-5"
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
        >
          <Field label="Nouveau mot de passe" error={errors.password}>
            <div className="relative">
              <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input className="pl-10" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="6 caractères minimum" autoComplete="new-password" />
            </div>
          </Field>
          <Field label="Confirmer le mot de passe" error={errors.confirm}>
            <div className="relative">
              <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input className="pl-10" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirmez" autoComplete="new-password" />
            </div>
          </Field>
          <Button type="submit" className="w-full" size="lg">
            <Check size={16} /> Réinitialiser le mot de passe
          </Button>
        </form>
        <p className="mt-5 text-center text-sm text-[#64748B]">
          <Link to="/login" className="font-semibold text-[#1B3A70] hover:underline">
            Retour à la connexion
          </Link>
        </p>
      </Card>
      <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-[#64748B]">
        <Copy size={12} /> Vitesse de démo — cette page illustre le parcours de récupération.
      </p>
    </main>
  )
}
