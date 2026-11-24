import {
  forwardRef,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react'
import { cx } from '../../lib/utils'

interface FieldWrapperProps {
  label?: string
  error?: string
  hint?: string
  children: ReactNode
}

import type { ReactNode } from 'react'

export function FieldWrapper({ label, error, hint, children }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-[#64748B]">{hint}</p>
      ) : null}
    </div>
  )
}

const fieldStyles =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:border-[#2A50A0] focus:ring-2 focus:ring-[#2A50A0]/15 disabled:bg-slate-50 disabled:text-slate-400'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...rest }, ref) {
    return <input ref={ref} className={cx(fieldStyles, className)} {...rest} />
  }
)

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, children, ...rest },
  ref
) {
  return (
    <select ref={ref} className={cx(fieldStyles, 'appearance-none pr-9', className)} {...rest}>
      {children}
    </select>
  )
})

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...rest }, ref) {
    return <textarea ref={ref} className={cx(fieldStyles, 'min-h-28 resize-y', className)} {...rest} />
  }
)

export function Field({
  label,
  error,
  hint,
  children,
}: FieldWrapperProps) {
  return (
    <FieldWrapper label={label} error={error} hint={hint}>
      {children}
    </FieldWrapper>
  )
}