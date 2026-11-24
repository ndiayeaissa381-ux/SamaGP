import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/utils'

type Variant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'white'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2A50A0] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap'

const variants: Record<Variant, string> = {
  primary: 'bg-[#1B3A70] text-white hover:bg-[#0F2450] shadow-sm',
  secondary:
    'bg-white text-[#1B3A70] border border-slate-200 hover:border-[#2A50A0] hover:bg-slate-50',
  success: 'bg-[#059669] text-white hover:bg-[#047857] shadow-sm',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
  ghost: 'text-[#1B3A70] hover:bg-[#EEF2F8]',
  white: 'bg-white text-[#1B3A70] hover:bg-slate-100 shadow-sm',
}

const sizes: Record<Size, string> = {
  sm: 'text-sm px-3 py-2',
  md: 'text-sm px-4 py-2.5',
  lg: 'text-base px-6 py-3.5',
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  children: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = 'primary', size = 'md', loading, className, children, disabled, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      className={cx(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <span
          aria-hidden
          className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin"
        />
      )}
      {children}
    </button>
  )
})