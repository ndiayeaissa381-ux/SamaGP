import type { ReactNode } from 'react'
import { cx } from '../../lib/utils'
import { BadgeCheck } from 'lucide-react'

type Tone = 'blue' | 'green' | 'amber' | 'red' | 'slate' | 'violet' | 'dark'

const tones: Record<Tone, string> = {
  blue: 'bg-[#EEF2F8] text-[#1B3A70] border-[#D5E3F5]',
  green: 'bg-[#D1FAE5] text-[#047857] border-[#A7F3D0]',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  slate: 'bg-slate-100 text-slate-600 border-slate-200',
  violet: 'bg-violet-50 text-violet-700 border-violet-200',
  dark: 'bg-[#0F2450] text-white border-[#0F2450]',
}

export function Badge({
  tone = 'slate',
  className,
  children,
}: {
  tone?: Tone
  className?: string
  children: ReactNode
}) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  )
}

export function VerificationBadge({ verified }: { verified: boolean }) {
  if (!verified) return null
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#D1FAE5] px-2 py-0.5 text-xs font-semibold text-[#047857]">
      <BadgeCheck size={14} />
      Vérifié
    </span>
  )
}

export function KindBadge({ kind }: { kind: 'gp' | 'transitaire' }) {
  return (
    <Badge tone={kind === 'gp' ? 'blue' : 'violet'}>
      {kind === 'gp' ? 'GP / Voyageur' : 'Transitaire'}
    </Badge>
  )
}