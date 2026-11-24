import { useRef, useState } from 'react'
import { UploadCloud, FileText, X, Lock } from 'lucide-react'
import { cx, formatBytes } from '../../lib/utils'

export interface UploadedFile {
  name: string
  size: number
}

function acceptedExtensions(accept?: string): string[] {
  if (!accept) return []
  return accept
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export function FileDrop({
  id,
  label,
  hint,
  required,
  maxMB = 5,
  accept = '.pdf,.jpg,.jpeg,.png',
  multiple = false,
  value,
  onChange,
  secure = false,
}: {
  id: string
  label: string
  hint?: string
  required?: boolean
  maxMB?: number
  accept?: string
  multiple?: boolean
  value: UploadedFile[]
  onChange: (files: UploadedFile[]) => void
  secure?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [rejected, setRejected] = useState<string | null>(null)

  const exts = acceptedExtensions(accept)

  const handle = (list: FileList | null) => {
    if (!list || list.length === 0) return
    setRejected(null)
    const ok: UploadedFile[] = []
    let badName: string | null = null
    Array.from(list).forEach((f) => {
      const ext = '.' + f.name.split('.').pop()?.toLowerCase()
      if ((exts.length > 0 && !exts.includes(ext)) || f.size > maxMB * 1024 * 1024) {
        badName = f.name
        return
      }
      ok.push({ name: f.name, size: f.size })
    })
    if (badName) {
      setRejected(
        `« ${badName} » n'a pas été ajouté (format autorisé : ${accept.replace(/\./g, '').toUpperCase()}, ${maxMB} Mo max).`
      )
    }
    if (ok.length === 0) return
    onChange(multiple ? [...value, ...ok] : [...ok])
  }

  return (
    <div>
      <p className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </p>

      <div className="mt-1.5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cx(
            'inline-flex items-center gap-2 rounded-xl border border-dashed px-4 py-3 text-sm font-medium transition-colors',
            value.length > 0
              ? 'border-[#059669] bg-[#D1FAE5]/50 text-[#047857]'
              : 'border-slate-300 bg-white text-[#64748B] hover:border-[#1B3A70] hover:text-[#1B3A70]'
          )}
        >
          <UploadCloud size={16} /> Ajouter {multiple ? 'des documents' : 'un document'}
        </button>
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          hidden
          onChange={(e) => {
            handle(e.target.files)
            e.target.value = ''
          }}
        />
      </div>

      {hint && !value.length && <p className="mt-1.5 text-xs text-[#64748B]">{hint}</p>}
      {rejected && (
        <p className="mt-1.5 text-xs text-red-600" role="alert">
          {rejected}
        </p>
      )}

      {value.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {value.map((f) => (
            <li
              key={f.name}
              className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-sm"
            >
              <span className="flex min-w-0 items-center gap-2 text-slate-700">
                <FileText size={15} className="shrink-0 text-[#1B3A70]" />
                <span className="truncate font-medium">{f.name}</span>
                <span className="shrink-0 text-xs text-slate-400">{formatBytes(f.size)}</span>
              </span>
              <button
                type="button"
                aria-label={`Retirer ${f.name}`}
                onClick={() => onChange(value.filter((x) => x !== f))}
                className="shrink-0 rounded-md p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <X size={15} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {secure && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-slate-400">
          <Lock size={12} /> Accessibles uniquement à vous et aux administrateurs SAMA GP.
        </p>
      )}
    </div>
  )
}