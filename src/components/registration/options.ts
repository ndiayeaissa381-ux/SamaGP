export const COUNTRIES = [
  'Sénégal',
  'France',
  "Côte d'Ivoire",
  'Mali',
  'Mauritanie',
  'Guinée',
  'Burkina Faso',
  'Italie',
  'Espagne',
  'Belgique',
  'Canada',
  'États-Unis',
  'Émirats',
  'Maroc',
  'Autre',
]

export const NATIONALITIES = [
  'Sénégalaise',
  'Française',
  'Malienne',
  'Mauritanienne',
  'Guinéenne',
  'Ivoirienne',
  'Burkinabè',
  'Italienne',
  'Espagnole',
  'Belge',
  'Marocaine',
  'Autre',
]

export const ID_TYPES = ['CNI', 'Passeport', 'Carte de séjour', 'Autre'] as const

export const GP_TYPES = [
  { value: 'particulier', label: 'GP particulier' },
  { value: 'professionnel', label: 'GP professionnel' },
] as const

export const TRANSPORT_MODES = ['Avion', 'Bus', 'Voiture', 'Autre'] as const

export const LEGAL_FORMS = [
  'SARL',
  'SA',
  'EURL',
  'SAS',
  'SUARL',
  'Entreprise individuelle',
  'Groupement d’intérêt économique',
  'Association',
  'Autre',
] as const

export const SERVICES_OPTIONS = [
  'Transport aérien',
  'Transport maritime',
  'Transport routier',
  'Transport express',
  'Fret',
  'Dédouanement',
  'Autre',
] as const

export function isValidNinea(v: string): boolean {
  return /^[0-9]{9}$/.test(v.replace(/[\s.-]/g, ''))
}

export function isValidUrl(v: string): boolean {
  if (!v.trim()) return true
  return /^(https?:\/\/)?[\w-]+(\.[\w-]+)+/.test(v.trim())
}

export function normalizePhone(v: string): string {
  return v.replace(/[\s.-]/g, '')
}