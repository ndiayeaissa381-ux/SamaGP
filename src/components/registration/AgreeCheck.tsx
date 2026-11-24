import type { ReactNode } from 'react'
import { cx } from '../../lib/utils'

export function AgreeCheck({
  id,
  checked,
  onChange,
  error,
  children,
}: {
  id: string
  checked: boolean
  onChange: (v: boolean) => void
  error?: string
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-[#1B3A70] focus:ring-[#1B3A70]/30"
        />
        <span className={cx('text-sm leading-relaxed text-slate-600', error && 'text-slate-700')}>
          {children}
        </span>
      </label>
      {error && (
        <p className="mt-1 pl-7 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}