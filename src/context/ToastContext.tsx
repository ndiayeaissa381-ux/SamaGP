import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react'
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react'
import { cx } from '../lib/utils'

type ToastKind = 'success' | 'error' | 'info'

interface Toast {
  id: string
  kind: ToastKind
  message: string
}

interface ToastState {
  toast: (message: string, kind?: ToastKind) => void
}

const ToastContext = createContext<ToastState | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (message: string, kind: ToastKind = 'success') => {
      const id = Math.random().toString(36).slice(2)
      setToasts((prev) => [...prev, { id, kind, message }])
      setTimeout(() => dismiss(id), 4500)
    },
    [dismiss]
  )

  const icons: Record<ToastKind, ReactNode> = {
    success: <CheckCircle2 size={18} className="text-green-600 shrink-0" />,
    error: <AlertTriangle size={18} className="text-red-600 shrink-0" />,
    info: <Info size={18} className="text-[#2A50A0] shrink-0" />,
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-[calc(100vw-2rem)] max-w-sm"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cx(
              'flex items-start gap-3 rounded-xl border bg-white px-4 py-3 shadow-lg shadow-slate-900/5 animate-[toast-in_.25s_ease]',
              t.kind === 'success' && 'border-green-200',
              t.kind === 'error' && 'border-red-200',
              t.kind === 'info' && 'border-slate-200'
            )}
          >
            {icons[t.kind]}
            <p className="text-sm text-slate-700 flex-1 leading-snug">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Fermer"
              className="text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastState {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}