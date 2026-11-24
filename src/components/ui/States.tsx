import type { ReactNode } from 'react'
import { PackageOpen, AlertCircle, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'

export function EmptyState({
  title,
  message,
  icon,
  action,
}: {
  title: string
  message: string
  icon?: ReactNode
  action?: { label: string; to: string }
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        {icon ?? <PackageOpen size={28} />}
      </div>
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-[#64748B]">{message}</p>
      {action && (
        <Link
          to={action.to}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#1B3A70] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0F2450]"
        >
          {action.label}
        </Link>
      )}
    </div>
  )
}

export function LoadingState({ label = 'Chargement…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-[#64748B]">
      <span
        aria-hidden
        className="h-6 w-6 rounded-full border-2 border-[#2A50A0] border-t-transparent animate-spin"
      />
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}

export function ErrorState({ message = "Une erreur est survenue. Veuillez réessayer." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50/50 px-6 py-14 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
        <AlertCircle size={28} />
      </div>
      <h3 className="text-lg font-bold text-slate-800">Impossible de charger</h3>
      <p className="mt-1 max-w-sm text-sm text-[#64748B]">{message}</p>
    </div>
  )
}

export function UnauthorizedState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <Lock size={28} />
      </div>
      <h3 className="text-lg font-bold text-slate-800">Vous n'avez pas accès à cette page.</h3>
      <p className="mt-1 max-w-sm text-sm text-[#64748B]">
        Cette section requiert un profil spécifique sur SAMA GP.
      </p>
      <Link
        to="/dashboard"
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#1B3A70] transition-colors hover:border-[#2A50A0] hover:bg-slate-50"
      >
        Retour à mon tableau de bord
      </Link>
    </div>
  )
}