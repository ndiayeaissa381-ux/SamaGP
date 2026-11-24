import { Check } from 'lucide-react'
import { cx } from '../../lib/utils'

export function WizardProgress({
  title,
  current,
  steps,
  tone = 'blue',
}: {
  title: string
  current: number
  steps: string[]
  tone?: 'blue' | 'green'
}) {
  const active = tone === 'green' ? 'bg-[#059669]' : 'bg-[#1B3A70]'
  const done = tone === 'green' ? 'bg-[#A7F3D0]' : 'bg-[#B7CCEC]'
  const currentTone = tone === 'green' ? 'text-[#047857]' : 'text-[#1B3A70]'

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-[#64748B]">
        {title} <span className="text-[#94A3B8]">· Étape {current} sur {steps.length}</span>
      </p>
      <div className="mt-3 flex gap-1.5">
        {steps.map((s, i) => {
          const idx = i + 1
          return (
            <span
              key={s}
              className={cx(
                'h-1.5 flex-1 rounded-full transition-colors',
                idx < current ? done : idx === current ? active : 'bg-slate-200'
              )}
            />
          )
        })}
      </div>
      <ol className="mt-2.5 hidden gap-2 sm:flex">
        {steps.map((s, i) => {
          const idx = i + 1
          return (
            <li
              key={s}
              className={cx(
                'flex flex-1 items-center gap-1.5 text-[11px] font-semibold',
                idx === current ? currentTone : idx < current ? 'text-[#1B3A70]' : 'text-slate-400'
              )}
            >
              <span
                className={cx(
                  'flex h-4 w-4 items-center justify-center rounded-full text-[10px]',
                  idx < current
                    ? 'bg-[#059669] text-white'
                    : idx === current
                      ? tone === 'green'
                        ? 'bg-[#059669] text-white'
                        : 'bg-[#1B3A70] text-white'
                      : 'bg-slate-200 text-slate-400'
                )}
              >
                {idx < current ? <Check size={10} /> : idx}
              </span>
              <span className="truncate">{s}</span>
            </li>
          )
        })}
      </ol>
      <p className="mt-2 text-xs font-semibold text-[#94A3B8] sm:hidden">
        {steps[current - 1]}
      </p>
    </div>
  )
}