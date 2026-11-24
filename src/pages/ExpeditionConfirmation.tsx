import { Link, Navigate, useNavigate } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '../components/ui/Button'

export default function ExpeditionConfirmation() {
  const navigate = useNavigate()
  const reference = (() => {
    try {
      return sessionStorage.getItem('samagp_confirmation') ?? ''
    } catch {
      return ''
    }
  })()

  if (!reference) {
    return <Navigate to="/rechercher" replace />
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center sm:p-10">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#D1FAE5]">
          <CheckCircle2 size={34} className="text-[#059669]" />
        </span>
        <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-[#0F2450]">
          Demande envoyée !
        </h1>
        <p className="mt-2 text-[#64748B]">
          Votre demande a été transmise au transporteur.
        </p>

        <div className="mx-auto mt-6 w-fit rounded-2xl bg-[#F8FAFC] px-6 py-4">
          <p className="text-xs uppercase tracking-wide text-[#64748B]">Référence</p>
          <p className="mt-1 font-display text-2xl font-extrabold tracking-wide text-[#1B3A70]">
            {reference}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button size="lg" onClick={() => navigate('/colis')}>
            Suivre mon colis
          </Button>
          <Link to="/">
            <Button variant="secondary" size="lg">
              Retour à l'accueil
            </Button>
          </Link>
        </div>

        <p className="mt-6 text-sm text-[#64748B]">
          Vous recevrez une notification dès que le transporteur répondra à votre demande.
        </p>
      </div>
    </main>
  )
}