import type { ReactNode } from 'react'
import { cx } from '../../lib/utils'

export function Card({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cx(
        'rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-900/[0.03]',
        className
      )}
    >
      {children}
    </div>
  )
}