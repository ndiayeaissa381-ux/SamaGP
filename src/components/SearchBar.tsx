import { useId, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Calendar, Package, ArrowRightLeft } from 'lucide-react'
import { COMMON_ROUTES } from '../lib/utils'
import { Input, Select } from './ui/Field'

export interface SearchValues {
  from: string
  to: string
  date: string
  weight: number
}

const WEIGHTS = [1, 2, 3, 4, 5, 6, 8, 10, 15, 20, 30]

export function SearchBar({
  initial,
  compact = false,
}: {
  initial?: Partial<SearchValues>
  compact?: boolean
}) {
  const navigate = useNavigate()
  const fromId = useId()
  const toId = useId()
  const [values, setValues] = useState<SearchValues>({
    from: initial?.from ?? '',
    to: initial?.to ?? '',
    date: initial?.date ?? '',
    weight: initial?.weight ?? 5,
  })

  const apply = (patch: Partial<SearchValues>) =>
    setValues((v) => ({ ...v, ...patch }))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (values.from) params.set('from', values.from)
    if (values.to) params.set('to', values.to)
    if (values.date) params.set('date', values.date)
    params.set('weight', String(values.weight))
    navigate(`/rechercher?${params.toString()}`)
  }

  return (
    <form
      onSubmit={submit}
      className={`grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-[#0F2450]/10 ${
        compact
          ? 'grid-cols-1 lg:grid-cols-[1fr_1fr_minmax(160px,200px)_minmax(120px,150px)_auto]'
          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.2fr_1.2fr_minmax(170px,210px)_minmax(130px,160px)_auto]'
      } items-end`}
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor={fromId} className="text-sm font-medium text-slate-700">
          Départ
        </label>
        <div className="relative">
          <MapPin size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2A50A0]" />
          <Input
            id={fromId}
            list="sama-routes"
            placeholder="Dakar, Sénégal"
            className="pl-10"
            value={values.from}
            onChange={(e) => apply({ from: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={toId} className="text-sm font-medium text-slate-700">
          Destination
        </label>
        <div className="relative">
          <ArrowRightLeft size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2A50A0]" />
          <Input
            id={toId}
            list="sama-routes"
            placeholder="Paris, France"
            className="pl-10"
            value={values.to}
            onChange={(e) => apply({ to: e.target.value })}
            required
          />
        </div>
      </div>

      <datalist id="sama-routes">
        {COMMON_ROUTES.map((r) => (
          <option key={r} value={r} />
        ))}
      </datalist>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${fromId}-date`} className="text-sm font-medium text-slate-700">
          Date
        </label>
        <div className="relative">
          <Calendar size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2A50A0]" />
          <Input
            id={`${fromId}-date`}
            type="date"
            className="pl-10"
            value={values.date}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(e) => apply({ date: e.target.value })}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${fromId}-weight`} className="text-sm font-medium text-slate-700">
          Poids
        </label>
        <div className="relative">
          <Package size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2A50A0]" />
          <Select
            id={`${fromId}-weight`}
            className="pl-10"
            value={values.weight}
            onChange={(e) => apply({ weight: Number(e.target.value) })}
          >
            {WEIGHTS.map((w) => (
              <option key={w} value={w}>
                {w} kg
              </option>
            ))}
          </Select>
        </div>
      </div>

      <button
        type="submit"
        className="inline-flex h-[42px] items-center justify-center gap-2 rounded-xl bg-[#1B3A70] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0F2450]"
      >
        <Search size={16} />
        Rechercher des offres
      </button>
    </form>
  )
}