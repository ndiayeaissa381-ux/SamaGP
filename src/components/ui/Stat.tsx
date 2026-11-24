import type { ReactNode } from 'react'
import { cx } from '../../lib/utils'

export function Stat({
  label,
  value,
  icon,
  tone = 'blue',
}: {
  label: string
  value: string
  icon: ReactNode
  tone?: 'blue' | 'green' | 'amber' | 'violet'
}) {
  const tones = {
    blue: 'bg-[#EEF2F8] text-[#1B3A70]',
    green: 'bg-[#D1FAE5] text-[#047857]',
    amber: 'bg-amber-50 text-amber-700',
    violet: 'bg-violet-50 text-violet-700',
  }
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div className={cx('flex h-11 w-11 items-center justify-center rounded-xl', tones[tone])}>
          {icon}
        </div>
      </div>
      <p className="mt-4 font-display text-3xl font-bold text-[#0F2450]">{value}</p>
      <p className="mt-1 text-sm text-[#64748B]">{label}</p>
    </div>
  )
}