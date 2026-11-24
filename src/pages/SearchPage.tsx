import { useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { SlidersHorizontal, X, Search, Scale } from 'lucide-react'
import { getPublicOffers, getProfile, getDB, getOffer } from '../lib/db'
import { useDB } from '../hooks'
import type { Offer, TransportMode } from '../lib/types'
import { COMMON_ROUTES, cx, formatDateShort, money, TRANSPORT_LABEL } from '../lib/utils'
import { OfferCard } from '../components/OfferCard'
import { SearchBar } from '../components/SearchBar'
import { Input, Select } from '../components/ui/Field'
import { EmptyState, LoadingState } from '../components/ui/States'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Badge } from '../components/ui/Badge'
import { Avatar } from '../components/ui/Avatar'
import { useToast } from '../context/ToastContext'

interface Filters {
  kinds: Set<'gp' | 'transitaire'>
  minPrice: number
  maxPrice: number
  date: string
  dest: string
  minRating: number
  transports: Set<TransportMode>
}

const DEFAULT_FILTERS: Filters = {
  kinds: new Set(['gp', 'transitaire']),
  minPrice: 0,
  maxPrice: 10000,
  date: '',
  dest: '',
  minRating: 0,
  transports: new Set(['aerien', 'maritime', 'terrestre']),
}

export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  useDB()

  const from = params.get('from') ?? ''
  const to = params.get('to') ?? ''
  const date = params.get('date') ?? ''
  const weight = Number(params.get('weight') ?? 5)

  const [loaded, setLoaded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>({ ...DEFAULT_FILTERS })
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [compareOpen, setCompareOpen] = useState(false)
  const { toast } = useToast()

  useMemo(() => {
    setLoading(true)
    const t = setTimeout(() => {
      setLoading(false)
      setLoaded(true)
    }, 500)
    return () => clearTimeout(t)
  }, [])

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next)
  }

  const results = useMemo(() => {
    const db = getDB()
    const profileRating = new Map(db.profiles.map((p) => [p.id, p.rating]))
    const q = (s: string) => s.toLowerCase()

    return getPublicOffers().filter((o) => {
      if (from && !q(o.from).includes(q(from))) return false
      if (to && !q(o.to).includes(q(to))) return false
      if (filters.dest && !q(o.to).includes(q(filters.dest))) return false
      if (weight > 0 && o.capacity < weight) return false
      if (!filters.kinds.has(o.provider_kind)) return false
      if (o.provider_kind === 'gp' && date) {
        if (!o.date || new Date(o.date) < new Date(date)) return false
      }
      if (filters.date && o.provider_kind === 'gp') {
        if (!o.date || new Date(o.date) < new Date(filters.date)) return false
      }
      const pkg = o.price_per_kg
      if (pkg < filters.minPrice || pkg > filters.maxPrice) return false
      if (o.transport && !filters.transports.has(o.transport)) return false
      const rating = profileRating.get(o.provider_id) ?? 0
      if (rating < filters.minRating) return false
      return true
    })
  }, [from, to, weight, date, filters])

  const toggleKind = (kind: 'gp' | 'transitaire') => {
    setFilters((f) => {
      const k = new Set(f.kinds)
      if (k.has(kind) && k.size > 1) k.delete(kind)
      else k.add(kind)
      return { ...f, kinds: k }
    })
  }

  const toggleTransport = (t: TransportMode) => {
    setFilters((f) => {
      const set = new Set(f.transports)
      if (set.has(t) && set.size > 1) set.delete(t)
      else set.add(t)
      return { ...f, transports: set }
    })
  }

  const resetFilters = () => setFilters({ ...DEFAULT_FILTERS })

  const toggleCompare = (id: string) => {
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter((value) => value !== id))
      return
    }
    if (compareIds.length >= 3) {
      toast('Vous pouvez comparer jusqu’à 3 offres à la fois.', 'info')
      return
    }
    setCompareIds([...compareIds, id])
  }

  const comparedOffers = compareIds
    .map((id) => getOffer(id))
    .filter((offer): offer is Offer => Boolean(offer))

  const appliedCount =
    (filters.dest ? 1 : 0) +
    (filters.date ? 1 : 0) +
    (filters.minRating ? 1 : 0) +
    (filters.minPrice > 0 ? 1 : 0) +
    (filters.maxPrice < 10000 ? 1 : 0)

  const FilterPanel = (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold text-[#0F2450]">Type</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {(['gp', 'transitaire'] as const).map((k) => (
            <button
              key={k}
              onClick={() => toggleKind(k)}
              className={cx(
                'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                filters.kinds.has(k)
                  ? 'border-[#1B3A70] bg-[#1B3A70] text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              )}
            >
              {k === 'gp' ? 'GP' : 'Transitaire'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-bold text-[#0F2450]">Budget (FCFA / kg)</p>
        <div className="mt-2 flex items-center gap-2">
          <Input
            type="number"
            min={0}
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => setFilters((f) => ({ ...f, minPrice: Number(e.target.value) || 0 }))}
          />
          <Input
            type="number"
            min={0}
            placeholder="Max"
            value={filters.maxPrice >= 10000 ? '' : filters.maxPrice}
            onChange={(e) => {
              const v = Number(e.target.value)
              setFilters((f) => ({ ...f, maxPrice: e.target.value === '' ? 10000 : v }))
            }}
          />
        </div>
      </div>

      <div>
        <p className="text-sm font-bold text-[#0F2450]">Mode de transport</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {(['aerien', 'maritime', 'terrestre'] as const).map((t) => (
            <button
              key={t}
              onClick={() => toggleTransport(t)}
              className={cx(
                'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                filters.transports.has(t)
                  ? 'border-[#059669] bg-[#D1FAE5] text-[#047857]'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              )}
            >
              {TRANSPORT_LABEL[t]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="filter-dest" className="text-sm font-bold text-[#0F2450]">
          Destination
        </label>
        <div className="mt-2">
          <Select
            id="filter-dest"
            value={filters.dest}
            onChange={(e) => setFilters((f) => ({ ...f, dest: e.target.value }))}
          >
            <option value="">Toutes les destinations</option>
            {COMMON_ROUTES.slice(1).map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <p className="text-sm font-bold text-[#0F2450]">Évaluation minimale</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setFilters((f) => ({ ...f, minRating: r }))}
              className={cx(
                'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                filters.minRating === r
                  ? 'border-amber-500 bg-amber-50 text-amber-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              )}
            >
              {r === 0 ? 'Tout' : `${r} ★`}
            </button>
          ))}
        </div>
      </div>

      <Button variant="secondary" className="w-full" onClick={resetFilters}>
        Réinitialiser les filtres
      </Button>
    </div>
  )

  return (
    <main
      className={cx(
        'mx-auto max-w-7xl px-4 py-8 sm:px-6',
        compareIds.length > 0 && 'pb-32'
      )}
    >
      <div className="mb-8">
        <SearchBar compact initial={{ from, to, date, weight }} />
      </div>

      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#0F2450]">
            Offres disponibles
          </h1>
          <p className="mt-1 text-sm text-[#64748B]">
            {results.length} offre{results.length > 1 ? 's' : ''} correspondant à votre recherche
          </p>
          <p className="sr-only" role="status" aria-live="polite">
            {results.length} offres trouvées
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#1B3A70] lg:hidden"
          onClick={() => setFiltersOpen(true)}
        >
          <SlidersHorizontal size={16} />
          Filtres{appliedCount > 0 ? ` (${appliedCount})` : ''}
        </button>
      </div>

      <div className="mt-6 flex gap-8">
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-5">
            <p className="mb-4 flex items-center gap-2 font-display font-bold text-[#0F2450]">
              <SlidersHorizontal size={16} /> Filtres
            </p>
            {FilterPanel}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {loading && <LoadingState label="Recherche des offres…" />}
          {loaded && results.length === 0 && (
            <EmptyState
              title="Aucune offre ne correspond"
              message="Ajustez vos filtres ou élargissez vos dates de départ pour voir plus de résultats."
              action={{ label: 'Nouvelle recherche', to: '/rechercher' }}
            />
          )}
          {!loading && (
            <div className="grid gap-5 md:grid-cols-1 xl:grid-cols-2">
              {results.map((o) => (
                <OfferCard
                  key={o.id}
                  offer={o}
                  selectable
                  selected={compareIds.includes(o.id)}
                  onToggleCompare={() => toggleCompare(o.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <div
        className={cx(
          'fixed inset-0 z-[70] bg-slate-900/50 transition-opacity lg:hidden',
          filtersOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        aria-hidden={!filtersOpen}
      >
        <div
          role="dialog"
          aria-label="Filtres"
          className={cx(
            'absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-auto rounded-t-3xl bg-white p-5 transition-transform duration-200',
            filtersOpen ? 'translate-y-0' : 'translate-y-full'
          )}
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="font-display text-lg font-bold text-[#0F2450]">Filtres</p>
            <button
              onClick={() => setFiltersOpen(false)}
              aria-label="Fermer les filtres"
              className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
          </div>
          {FilterPanel}
          <Button className="mt-6 w-full" onClick={() => setFiltersOpen(false)}>
            Voir {results.length} offre{results.length > 1 ? 's' : ''}
          </Button>
        </div>
      </div>

      {compareIds.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-slate-200 bg-white/95 shadow-[0_-8px_24px_rgba(15,36,80,0.08)] backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:px-6">
            <p className="flex items-center gap-2 text-sm font-semibold text-[#0F2450]">
              <Scale size={16} className="text-[#059669]" />
              {compareIds.length} offre{compareIds.length > 1 ? 's' : ''} à comparer
            </p>
            <div className="flex flex-1 flex-wrap gap-2">
              {comparedOffers.map((offer) => (
                <span
                  key={offer.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700"
                >
                  {offer.from} → {offer.to}
                  <button
                    type="button"
                    onClick={() => toggleCompare(offer.id)}
                    aria-label={`Retirer ${offer.from} vers ${offer.to} de la comparaison`}
                    className="rounded-full p-0.5 text-slate-400 hover:text-slate-700"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setCompareIds([])}>
                Tout effacer
              </Button>
              <Button size="sm" onClick={() => setCompareOpen(true)} disabled={compareIds.length < 2}>
                Comparer
              </Button>
            </div>
          </div>
        </div>
      )}

      <Modal
        open={compareOpen}
        onClose={() => setCompareOpen(false)}
        title="Comparer les offres"
        maxWidth="max-w-4xl"
      >
        {comparedOffers.length < 2 ? (
          <p className="text-sm text-[#64748B]">
            Sélectionnez au moins deux offres pour lancer la comparaison.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="w-36 border-b border-slate-200 px-3 py-3 text-left text-xs font-bold uppercase tracking-widest text-slate-400"
                  >
                    Critère
                  </th>
                  {comparedOffers.map((offer) => {
                    const provider = getProfile(offer.provider_id)
                    const name = provider
                      ? provider.company || `${provider.first_name} ${provider.last_name}`.trim()
                      : 'Transporteur'
                    return (
                      <th
                        key={offer.id}
                        scope="col"
                        className="border-b border-slate-200 px-3 py-3 text-left align-top"
                      >
                        <span className="flex items-center gap-2">
                          <Avatar src={provider?.avatar_url} name={name} className="h-8 w-8 text-xs" />
                          <span className="min-w-0">
                            <span className="block truncate font-bold text-slate-900">{name}</span>
                            <span className="mt-0.5 block">
                              <Badge tone={offer.provider_kind === 'gp' ? 'blue' : 'violet'}>
                                {offer.provider_kind === 'gp' ? 'GP / Voyageur' : 'Transitaire'}
                              </Badge>
                            </span>
                          </span>
                        </span>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row" className="border-t border-slate-100 px-3 py-3 text-left font-semibold text-slate-500">
                    Trajet
                  </th>
                  {comparedOffers.map((offer) => (
                    <td key={offer.id} className="border-t border-slate-100 px-3 py-3 font-semibold text-slate-900">
                      {offer.from} → {offer.to}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="border-t border-slate-100 px-3 py-3 text-left font-semibold text-slate-500">
                    Départ / délai
                  </th>
                  {comparedOffers.map((offer) => (
                    <td key={offer.id} className="border-t border-slate-100 px-3 py-3 text-slate-700">
                      {offer.date
                        ? formatDateShort(offer.date)
                        : offer.delivery_days
                          ? `Délai ${offer.delivery_days}`
                          : 'Flexible'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="border-t border-slate-100 px-3 py-3 text-left font-semibold text-slate-500">
                    Capacité
                  </th>
                  {comparedOffers.map((offer) => (
                    <td key={offer.id} className="border-t border-slate-100 px-3 py-3 text-slate-700">
                      {new Intl.NumberFormat('fr-FR').format(offer.capacity)} kg
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="border-t border-slate-100 px-3 py-3 text-left font-semibold text-slate-500">
                    Prix au kg
                  </th>
                  {comparedOffers.map((offer) => (
                    <td key={offer.id} className="border-t border-slate-100 px-3 py-3 font-semibold text-[#0F2450]">
                      {money(offer.price_per_kg)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="border-t border-slate-100 px-3 py-3 text-left font-semibold text-slate-500">
                    Estimation ({weight} kg)
                  </th>
                  {comparedOffers.map((offer) => (
                    <td key={offer.id} className="border-t border-slate-100 px-3 py-3 font-bold text-[#047857]">
                      {money(offer.price_per_kg * weight)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="border-t border-slate-100 px-3 py-3 text-left font-semibold text-slate-500">
                    Évaluation
                  </th>
                  {comparedOffers.map((offer) => {
                    const provider = getProfile(offer.provider_id)
                    return (
                      <td key={offer.id} className="border-t border-slate-100 px-3 py-3 text-slate-700">
                        {provider && provider.review_count > 0
                          ? `${provider.rating.toFixed(1)} ★ (${provider.review_count} avis)`
                          : 'Nouveau'}
                      </td>
                    )
                  })}
                </tr>
                <tr>
                  <th scope="row" className="border-t border-slate-100 px-3 py-3 text-left font-semibold text-slate-500">
                    Action
                  </th>
                  {comparedOffers.map((offer) => (
                    <td key={offer.id} className="border-t border-slate-100 px-3 py-3">
                      <Link
                        to={`/offres/${offer.id}`}
                        onClick={() => setCompareOpen(false)}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#1B3A70] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#0F2450]"
                      >
                        Voir l'offre
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-4 text-xs text-slate-400">
          Estimation indicative pour {weight} kg. Le montant final est confirmé par le
          transporteur au moment de l'acceptation.
        </p>
      </Modal>
    </main>
  )
}