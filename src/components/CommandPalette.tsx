import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  HelpCircle,
  Home,
  LogIn,
  Mail,
  MapPin,
  Package,
  Plane,
  Search,
  Truck,
  UserPlus,
} from 'lucide-react'
import { getProfile, getPublicOffers } from '../lib/db'
import { useDB } from '../hooks'
import { cx, money } from '../lib/utils'

type Icon = ComponentType<{ size?: number | string; className?: string }>

interface PaletteItem {
  id: string
  group: 'Pages' | 'Offres'
  label: string
  hint?: string
  icon: Icon
  keywords?: string
  run: () => void
}

const OPEN_EVENT = 'samagp:open-command'

export function openCommandPalette(): void {
  window.dispatchEvent(new Event(OPEN_EVENT))
}

export function CommandPalette() {
  const navigate = useNavigate()
  const version = useDB()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const restoreRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((value) => !value)
      }
    }
    const onOpen = () => setOpen(true)
    document.addEventListener('keydown', onKey)
    window.addEventListener(OPEN_EVENT, onOpen)
    return () => {
      document.removeEventListener('keydown', onKey)
      window.removeEventListener(OPEN_EVENT, onOpen)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    restoreRef.current = document.activeElement as HTMLElement
    setQuery('')
    setActive(0)
    document.body.style.overflow = 'hidden'
    const timer = window.setTimeout(() => inputRef.current?.focus(), 20)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
        return
      }
      if (e.key !== 'Tab' || !panelRef.current) return
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'input, button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      restoreRef.current?.focus?.()
    }
  }, [open])

  const pages = useMemo<PaletteItem[]>(() => {
    const go = (to: string) => () => {
      setOpen(false)
      navigate(to)
    }
    return [
      { id: 'p-home', group: 'Pages', label: 'Accueil', icon: Home, keywords: 'accueil home', run: go('/') },
      { id: 'p-search', group: 'Pages', label: 'Rechercher une offre', hint: 'Colis, trajets et tarifs', icon: Search, keywords: 'recherche colis offre trajet', run: go('/rechercher') },
      { id: 'p-track', group: 'Pages', label: 'Suivre un colis', hint: 'Avec une référence SGP', icon: MapPin, keywords: 'suivi tracking reference sgp colis', run: go('/suivi') },
      { id: 'p-how', group: 'Pages', label: 'Comment ça marche', icon: HelpCircle, keywords: 'fonctionnement etapes guide', run: go('/comment-ca-marche') },
      { id: 'p-gp', group: 'Pages', label: 'Devenir GP / Voyageur', icon: Plane, keywords: 'voyageur gp revenus bagages', run: go('/devenir-gp') },
      { id: 'p-trans', group: 'Pages', label: 'Devenir transitaire', icon: Truck, keywords: 'transitaire entreprise transport', run: go('/devenir-transitaire') },
      { id: 'p-faq', group: 'Pages', label: 'FAQ', icon: HelpCircle, keywords: 'questions aide reponses', run: go('/faq') },
      { id: 'p-contact', group: 'Pages', label: 'Contact', icon: Mail, keywords: 'contact support aide', run: go('/contact') },
      { id: 'p-login', group: 'Pages', label: 'Se connecter', icon: LogIn, keywords: 'connexion login compte', run: go('/login') },
      { id: 'p-register', group: 'Pages', label: 'Créer un compte', icon: UserPlus, keywords: 'inscription register compte', run: go('/register') },
    ]
  }, [navigate])

  const offers = useMemo<PaletteItem[]>(() => {
    const q = query.trim().toLowerCase()
    return getPublicOffers()
      .map((offer) => {
        const provider = getProfile(offer.provider_id)
        const name = provider
          ? provider.company || `${provider.first_name} ${provider.last_name}`.trim()
          : 'Transporteur'
        return { offer, name }
      })
      .filter(({ offer, name }) => {
        if (!q) return true
        return `${offer.from} ${offer.to} ${name} ${offer.description}`
          .toLowerCase()
          .includes(q)
      })
      .slice(0, 6)
      .map(({ offer, name }) => ({
        id: `o-${offer.id}`,
        group: 'Offres' as const,
        label: `${offer.from} → ${offer.to}`,
        hint: `${name} · ${money(offer.price_per_kg)}/kg`,
        icon: Package,
        keywords: `${offer.from} ${offer.to} ${name}`,
        run: () => {
          setOpen(false)
          navigate(`/offres/${offer.id}`)
        },
      }))
  }, [query, navigate, version])

  const filteredPages = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return pages
    return pages.filter((page) =>
      `${page.label} ${page.keywords ?? ''}`.toLowerCase().includes(q)
    )
  }, [pages, query])

  const items = useMemo(
    () => [...filteredPages, ...offers],
    [filteredPages, offers]
  )

  useEffect(() => {
    setActive(0)
  }, [query])

  const onInputKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((index) => Math.min(index + 1, Math.max(items.length - 1, 0)))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((index) => Math.max(index - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      items[active]?.run()
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Recherche et navigation rapide"
    >
      <button
        aria-label="Fermer la recherche rapide"
        onClick={() => setOpen(false)}
        className="absolute inset-0 cursor-default bg-slate-900/50 backdrop-blur-[2px]"
      />
      <div
        ref={panelRef}
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-[modal-in_.2s_ease]"
      >
        <div className="flex items-center gap-3 border-b border-slate-100 px-4">
          <Search size={18} className="shrink-0 text-slate-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            role="combobox"
            aria-expanded="true"
            aria-controls="command-list"
            aria-autocomplete="list"
            placeholder="Rechercher une page, un trajet, une offre…"
            className="h-14 w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <kbd className="hidden shrink-0 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 sm:block">
            Échap
          </kbd>
        </div>

        <div
          id="command-list"
          role="listbox"
          aria-label="Résultats de la recherche rapide"
          className="max-h-[55vh] overflow-auto p-2"
        >
          {items.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-[#64748B]">
              Aucun résultat pour « {query} ».
            </p>
          )}
          {items.map((item, index) => {
            const Icon = item.icon
            const showGroup = index === 0 || items[index - 1].group !== item.group
            return (
              <Fragment key={item.id}>
                {showGroup && (
                  <p className="px-3 pb-1 pt-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    {item.group}
                  </p>
                )}
                <button
                  type="button"
                  role="option"
                  aria-selected={index === active}
                  onMouseMove={() => setActive(index)}
                  onClick={item.run}
                  className={cx(
                    'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
                    index === active ? 'bg-[#EEF2F8]' : 'hover:bg-slate-50'
                  )}
                >
                  <span
                    className={cx(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                      index === active
                        ? 'bg-[#1B3A70] text-white'
                        : 'bg-slate-100 text-slate-500'
                    )}
                  >
                    <Icon size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-slate-900">
                      {item.label}
                    </span>
                    {item.hint && (
                      <span className="block truncate text-xs text-[#64748B]">
                        {item.hint}
                      </span>
                    )}
                  </span>
                  <ArrowRight
                    size={15}
                    className={cx(
                      'shrink-0',
                      index === active ? 'text-[#1B3A70]' : 'text-slate-300'
                    )}
                  />
                </button>
              </Fragment>
            )
          })}
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2.5 text-[11px] text-slate-400">
          <span className="flex items-center gap-3">
            <span>↑ ↓ naviguer</span>
            <span>↵ ouvrir</span>
          </span>
          <span className="hidden sm:block">Ctrl K pour ouvrir</span>
        </div>
      </div>
    </div>
  )
}
