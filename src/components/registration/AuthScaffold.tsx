import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { cx } from '../../lib/utils'
import { AuthAside } from '../../pages/Login'

export function AuthScaffold({
  variant = 'split',
  children,
  className,
}: {
  variant?: 'split' | 'centered'
  children: ReactNode
  className?: string
}) {
  if (variant === 'centered') {
    return (
      <main className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6">
        <div className={cx('w-full max-w-3xl', className)}>{children}</div>
      </main>
    )
  }
  return (
    <main className="mx-auto grid min-h-[80vh] max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1.2fr]">
      <div className="hidden lg:block">
        <AuthAside />
      </div>
      <div className={className}>{children}</div>
    </main>
  )
}

export function BackToChoice() {
  return (
    <Link
      to="/register"
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#64748B] transition-colors hover:text-[#1B3A70]"
    >
      <ArrowLeft size={15} /> Choisir un autre type de compte
    </Link>
  )
}

export function FlowTag({
  tone = 'blue',
  children,
}: {
  tone?: 'blue' | 'green' | 'violet'
  children: ReactNode
}) {
  const tones = {
    blue: 'bg-[#EEF2F8] text-[#1B3A70] border-[#D5E3F5]',
    green: 'bg-[#D1FAE5] text-[#047857] border-[#A7F3D0]',
    violet: 'bg-violet-50 text-violet-700 border-violet-200',
  }
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide',
        tones[tone]
      )}
    >
      {children}
    </span>
  )
}