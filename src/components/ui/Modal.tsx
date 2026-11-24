import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cx } from '../../lib/utils'

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = 'max-w-md',
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  maxWidth?: string
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        aria-label="Fermer"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] cursor-default"
        onClick={onClose}
      />
      <div
        className={cx(
          'relative w-full bg-white sm:rounded-2xl rounded-t-2xl shadow-xl animate-[modal-in_.2s_ease]',
          maxWidth
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-[#0F2450]">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Fermer la fenêtre"
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  )
}