export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

export function money(n: number): string {
  return `${new Intl.NumberFormat('fr-FR').format(Math.round(n))} FCFA`
}

export function daysFromNow(days: number, hour = 9): Date {
  const d = new Date()
  d.setDate(d.getDate() + days)
  d.setHours(hour, 0, 0, 0)
  return d
}

export function formatDate(iso: string | Date): string {
  const d = typeof iso === 'string' ? new Date(iso) : iso
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

export function formatDateShort(iso: string | Date): string {
  const d = typeof iso === 'string' ? new Date(iso) : iso
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
  }).format(d)
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function initials(first: string, last?: string): string {
  const a = (first || '').trim()
  const b = (last || '').trim()
  if (!a && !b) return 'SG'
  return `${a.charAt(0)}${b ? b.charAt(0) : ''}`.toUpperCase()
}

export function initialsForName(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return (parts[0] || 'S')[0].toUpperCase()
}

export const REFERENCE_PREFIX = 'SGP'

export function buildReference(seed = 2481): string {
  return `${REFERENCE_PREFIX}-${new Intl.NumberFormat('fr-FR', {
    minimumIntegerDigits: 5,
    useGrouping: false,
  }).format(seed % 50000)}`
}

export function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export function isValidPhone(v: string): boolean {
  return /^[+0-9 ().-]{8,}$/.test(v)
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'à l\'instant'
  if (min < 60) return `il y a ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `il y a ${h} h`
  const d = Math.floor(h / 24)
  if (d < 7) return `il y a ${d} j`
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(new Date(iso))
}

export const TRANSPORT_LABEL: Record<string, string> = {
  aerien: 'Aérien',
  maritime: 'Maritime',
  terrestre: 'Terrestre',
}

export const STATUS_LABEL: Record<string, string> = {
  demande_envoyee: 'Demande envoyée',
  demande_acceptee: 'Demande acceptée',
  remis: 'Colis remis au transporteur',
  en_transit: 'En transit',
  arrive: 'Arrivé à destination',
  livre: 'Livré',
  annule: 'Annulé',
}

export const PARCEL_TYPES = [
  'Documents / effets personnels',
  'Vêtements',
  'Appareils électroniques',
  'Cosmétiques',
  'Produits alimentaires',
]

export const COMMON_ROUTES = [
  'Dakar, Sénégal',
  'Paris, France',
  'Lyon, France',
  'Marseille, France',
  'Milan, Italie',
  'Madrid, Espagne',
  'New York, États-Unis',
  'Dubai, Émirats',
  'Abidjan, Côte d\'Ivoire',
  'Toulouse, France',
]