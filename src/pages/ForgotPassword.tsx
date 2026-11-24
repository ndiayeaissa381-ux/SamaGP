import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, ArrowRight, MailCheck } from 'lucide-react'
import { Field, Input } from '../components/ui/Field'
import { Button } from '../components/ui/Button'
import { useToast } from '../context/ToastContext'
import { isValidEmail } from '../lib/utils'
import { Card } from '../components/ui/Card'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const submit = () => {
    if (!isValidEmail(email)) {
      setError('Adresse email invalide.')
      return
    }
    setError('')
    setSent(true)
    toast('Lien de récupération envoyé à votre adresse email.', 'info')
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <Card className="p-7 sm:p-9">
        {sent ? (
          <div className="text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#D1FAE5]">
              <MailCheck size={26} className="text-[#059669]" />
            </span>
            <h1 className="mt-5 font-display text-2xl font-bold text-[#0F2450]">
              Email envoyé
            </h1>
            <p className="mt-2 text-sm text-[#64748B]">
              Si un compte existe pour <strong>{email}</strong>, vous recevrez un lien pour
              réinitialiser votre mot de passe.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Button onClick={() => navigate('/login')}>Retour à la connexion</Button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="font-display text-2xl font-bold text-[#0F2450]">
              Mot de passe oublié
            </h1>
            <p className="mt-1.5 text-sm text-[#64748B]">
              Saisissez votre adresse email pour recevoir un lien de réinitialisation.
            </p>
            <form
              className="mt-6 space-y-5"
              onSubmit={(e) => {
                e.preventDefault()
                submit()
              }}
            >
              <Field label="Adresse email" error={error}>
                <div className="relative">
                  <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    className="pl-10"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="awa@samagp.sn"
                  />
                </div>
              </Field>
              <Button type="submit" className="w-full" size="lg">
                Envoyer le lien <ArrowRight size={16} />
              </Button>
            </form>
            <p className="mt-5 text-center text-sm text-[#64748B]">
              <Link to="/login" className="font-semibold text-[#1B3A70] hover:underline">
                Retour à la connexion
              </Link>
            </p>
          </>
        )}
      </Card>
    </main>
  )
}