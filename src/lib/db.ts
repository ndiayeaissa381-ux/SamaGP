import { buildSeed, type DB } from './seed'
import type {
  Notification,
  Offer,
  Profile,
  Shipment,
  ShipmentRequest,
  ShipmentStatus,
  TrackingEvent,
} from './types'
import {
  buildReference,
  STATUS_LABEL,
  uid,
  daysFromNow,
  sleep,
} from './utils'

const KEY = 'samagp_db_v1'
const SESSION_KEY = 'samagp_session_v1'
const CRED_KEY = 'samagp_credentials_v1'
const DEMO_PASSWORD = 'samagp2026'

let cache: DB | null = null
let sessionCache: string | null = null

type Listener = () => void
const listeners = new Set<Listener>()

function read(): DB {
  if (cache) return cache
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      cache = JSON.parse(raw) as DB
      return cache
    }
  } catch {
    cache = null
  }
  cache = buildSeed()
  persist(cache)
  return cache
}

function persist(db: DB): void {
  cache = db
  localStorage.setItem(KEY, JSON.stringify(db))
}

export function getDB(): DB {
  return read()
}

function cloneDB(): DB {
  return {
    profiles: read().profiles.map((p) => ({ ...p })),
    offers: read().offers.map((o) => ({ ...o })),
    requests: read().requests.map((r) => ({ ...r })),
    shipments: read().shipments.map((s) => ({ ...s })),
    tracking: read().tracking.map((t) => ({ ...t })),
    notifications: read().notifications.map((n) => ({ ...n })),
    verifications: read().verifications.map((v) => ({ ...v })),
    reports: read().reports.map((r) => ({ ...r })),
  }
}

function commit(mutator: (db: DB) => void): void {
  const db = cloneDB()
  mutator(db)
  persist(db)
  listeners.forEach((l) => l())
}

export function subscribe(fn: Listener): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

/* ------------------------- notifications ------------------------- */

export function notify(user_id: string, title: string, body: string): void {
  commit((db) => {
    db.notifications.unshift({
      id: uid(),
      user_id,
      title,
      body,
      read: false,
      created_at: new Date().toISOString(),
    })
  })
}

export function markNotificationsRead(user_id: string): void {
  commit((db) => {
    db.notifications.forEach((n) => {
      if (n.user_id === user_id) n.read = true
    })
  })
}

/* --------------------------- session --------------------------- */

export function readSession(): string | null {
  if (sessionCache) return sessionCache
  sessionCache = localStorage.getItem(SESSION_KEY)
  return sessionCache
}

function writeSession(userId: string): void {
  sessionCache = userId
  localStorage.setItem(SESSION_KEY, userId)
}

export function clearSession(): void {
  sessionCache = null
  localStorage.removeItem(SESSION_KEY)
}

export function findProfileByLogin(identifier: string, password: string): Profile | null {
  const email = identifier.trim().toLowerCase()
  const profiles = read().profiles
  const byLogin =
    profiles.find((p) => p.email.toLowerCase() === email) ??
    profiles.find((p) => p.phone.replace(/\s/g, '') === identifier.replace(/\s/g, '')) ??
    null
  if (!byLogin) return null
  try {
    const creds = JSON.parse(localStorage.getItem(CRED_KEY) || '{}') as Record<string, string>
    if (creds[byLogin.id] && creds[byLogin.id] === password) return byLogin
  } catch {
    /* ignore */
  }
  if (password === DEMO_PASSWORD) return byLogin
  return null
}

export function registerProfile(
  input: Pick<Profile, 'first_name' | 'last_name' | 'email' | 'phone'> & {
    role: Exclude<Profile['role'], 'admin'>
    password: string
    city: string
    country: string
  }
): Profile {
  const email = input.email.trim().toLowerCase()
  if (read().profiles.some((p) => p.email.toLowerCase() === email)) {
    throw new Error('EMAIL_EXISTS')
  }
  const user: Profile = {
    id: uid(),
    first_name: input.first_name,
    last_name: input.last_name,
    email,
    phone: input.phone,
    role: input.role,
    city: input.city,
    country: input.country,
    avatar_url: null,
    verification_status: input.role === 'particulier' ? 'none' : 'pending',
    rating: 0,
    review_count: 0,
    bio: '',
    created_at: new Date().toISOString(),
  }
  commit((db) => {
    db.profiles.push(user)
    const creds = JSON.parse(localStorage.getItem(CRED_KEY) || '{}') as Record<string, string>
    creds[user.id] = input.password
    localStorage.setItem(CRED_KEY, JSON.stringify(creds))
    if (input.role !== 'particulier') {
      db.verifications.push({
        id: uid(),
        user_id: user.id,
        requested_role: input.role,
        status: 'pending',
        documents_note:
          'Demande de vérification envoyée à l\'administration de SAMA GP.',
        created_at: new Date().toISOString(),
      })
    }
    db.notifications.unshift({
      id: uid(),
      user_id: user.id,
      title: 'Bienvenue sur SAMA GP',
      body: `Bienvenue ${input.first_name} ! Votre compte a été créé avec succès.`,
      read: false,
      created_at: new Date().toISOString(),
    })
  })
  writeSession(user.id)
  return user
}

export function getProfile(userId: string): Profile | null {
  return read().profiles.find((p) => p.id === userId) ?? null
}

export function updateProfile(
  userId: string,
  patch: Partial<Pick<Profile, 'first_name' | 'last_name' | 'phone' | 'city' | 'country' | 'bio'>>
): Profile {
  let updated!: Profile
  commit((db) => {
    const p = db.profiles.find((p) => p.id === userId)
    if (!p) throw new Error('PROFILE_NOT_FOUND')
    Object.assign(p, patch)
    updated = { ...p }
  })
  return updated
}

export function requestRoleChange(userId: string, role: Exclude<Profile['role'], 'admin'>): void {
  commit((db) => {
    db.verifications.push({
      id: uid(),
      user_id: userId,
      requested_role: role,
      status: 'pending',
      documents_note:
        'Demande de changement de rôle envoyée. En attente de validation de l\'administration.',
      created_at: new Date().toISOString(),
    })
    db.notifications.unshift({
      id: uid(),
      user_id: userId,
      title: 'Demande de vérification envoyée',
      body: `Votre demande pour devenir ${role === 'gp' ? 'GP / Voyageur' : 'Transitaire'} a été transmise à l'administration.`,
      read: false,
      created_at: new Date().toISOString(),
    })
  })
}

/* --------------------------- offers --------------------------- */

export function getOffer(offerId: string): Offer | null {
  return read().offers.find((o) => o.id === offerId) ?? null
}

export function getPublicOffers(): Offer[] {
  return read().offers.filter((o) => o.status === 'active')
}

export function offersForProvider(profile: Profile): Offer[] {
  return read().offers.filter((o) => o.provider_id === profile.id)
}

export function createGpTrip(
  profile: Profile,
  input: {
    from: string
    to: string
    date: string
    capacity: number
    price_per_kg: number
    info: string
  }
): void {
  if (input.capacity <= 0) throw new Error('La capacité doit être supérieure à 0.')
  if (input.price_per_kg <= 0) throw new Error('Le prix par kg doit être supérieur à 0.')
  const offer: Offer = {
    id: uid(),
    provider_id: profile.id,
    provider_kind: 'gp',
    from: input.from,
    to: input.to,
    date: new Date(input.date).toISOString(),
    capacity: input.capacity,
    price_per_kg: input.price_per_kg,
    transport: null,
    delivery_days: null,
    description: input.info,
    status: 'active',
    created_at: new Date().toISOString(),
  }
  commit((db) => db.offers.push(offer))
  notify(
    profile.id,
    'Voyage publié',
    `Votre voyage ${offer.from} → ${offer.to} est maintenant visible dans la recherche.`
  )
}

export function createTransitaireOffer(
  profile: Profile,
  input: {
    from: string
    to: string
    transport: Offer['transport']
    date: string | null
    delivery_days: string
    price_per_kg: number
    capacity: number
    description: string
  }
): void {
  if (input.capacity <= 0) throw new Error('La capacité doit être supérieure à 0.')
  if (input.price_per_kg <= 0) throw new Error('Le prix par kg doit être supérieur à 0.')
  const offer: Offer = {
    id: uid(),
    provider_id: profile.id,
    provider_kind: 'transitaire',
    from: input.from,
    to: input.to,
    date: input.date ? new Date(input.date).toISOString() : null,
    capacity: input.capacity,
    price_per_kg: input.price_per_kg,
    transport: input.transport,
    delivery_days: input.delivery_days,
    description: input.description,
    status: 'active',
    created_at: new Date().toISOString(),
  }
  commit((db) => db.offers.push(offer))
  notify(
    profile.id,
    'Offre publiée',
    `Votre offre ${offer.from} → ${offer.to} est maintenant visible dans la marketplace.`
  )
}

/* ----------------------- shipment requests ----------------------- */

function nextReference(db: DB): string {
  const nums = db.requests.map((r) => {
    const m = r.reference.match(/SGP-(\d+)/)
    return m ? parseInt(m[1], 10) : 0
  })
  const max = nums.length ? Math.max(...nums) : 2480
  return buildReference(max + 1)
}

export function createShipmentRequest(input: {
  offer: Offer
  sender: Profile
  parcel_type: string
  weight: number
  description: string
  sender_name: string
  sender_phone: string
}): ShipmentRequest {
  if (input.weight <= 0) throw new Error('Le poids doit être supérieur à 0.')
  let created!: ShipmentRequest
  commit((db) => {
    const offer = db.offers.find((o) => o.id === input.offer.id)
    if (!offer) throw new Error('OFFER_NOT_FOUND')
    if (offer.status !== 'active') throw new Error('Cette offre n\'est plus disponible.')
    const request: ShipmentRequest = {
      id: uid(),
      reference: nextReference(db),
      offer_id: offer.id,
      sender_id: input.sender.id,
      sender_name: input.sender_name,
      sender_phone: input.sender_phone,
      destination: offer.to,
      parcel_type: input.parcel_type,
      weight: input.weight,
      description: input.description,
      total: Math.round(input.weight * offer.price_per_kg),
      status: 'pending',
      created_at: new Date().toISOString(),
    }
    db.requests.push(request)
    created = { ...request }
    db.notifications.unshift({
      id: uid(),
      user_id: offer.provider_id,
      title: 'Nouvelle demande reçue',
      body: `${request.sender_name} souhaite envoyer ${request.weight} kg vers ${offer.to}.`,
      read: false,
      created_at: new Date().toISOString(),
    })
  })
  return created
}

export function getRequest(requestId: string): ShipmentRequest | null {
  return read().requests.find((r) => r.id === requestId) ?? null
}

export function requestsForProvider(profile: Profile): ShipmentRequest[] {
  const ids = new Set(read().offers.filter((o) => o.provider_id === profile.id).map((o) => o.id))
  return read().requests.filter((r) => ids.has(r.offer_id))
}

export function requestsForSender(profile: Profile): ShipmentRequest[] {
  return read().requests.filter((r) => r.sender_id === profile.id)
}

const REQUEST_STATUS: Record<string, ShipmentStatus> = {
  accepted: 'demande_acceptee',
}

export function acceptRequest(requestId: string): { ok: boolean; error?: string } {
  const db = read()
  const request = db.requests.find((r) => r.id === requestId)
  if (!request) return { ok: false, error: 'Demande introuvable.' }
  if (request.status !== 'pending') return { ok: false, error: 'Cette demande a déjà été traitée.' }

  const offer = db.offers.find((o) => o.id === request.offer_id)
  if (!offer) return { ok: false, error: 'Offre introuvable.' }
  if (offer.capacity < request.weight)
    return { ok: false, error: `Capacité insuffisante : il reste ${offer.capacity} kg sur cette offre.` }

  let shipmentId = ''
  commit((mut) => {
    const req = mut.requests.find((r) => r.id === requestId)!
    const off = mut.offers.find((o) => o.id === request.offer_id)!
    req.status = 'accepted'
    off.capacity = Math.round((off.capacity - req.weight) * 100) / 100
    if (off.capacity <= 0) off.status = 'inactive'

    const shipment: Shipment = {
      id: uid(),
      reference: req.reference,
      request_id: req.id,
      offer_id: off.id,
      owner_id: req.sender_id,
      provider_id: off.provider_id,
      from: off.from,
      to: off.to,
      weight: req.weight,
      total: req.total,
      status: REQUEST_STATUS.accepted,
      created_at: new Date().toISOString(),
    }
    mut.shipments.push(shipment)
    shipmentId = shipment.id
    mut.tracking.push(
      { id: uid(), shipment_id: shipment.id, key: 'demande_envoyee', label: STATUS_LABEL.demande_envoyee, date: new Date(req.created_at).toISOString() },
      { id: uid(), shipment_id: shipment.id, key: 'demande_acceptee', label: STATUS_LABEL.demande_acceptee, date: new Date().toISOString() }
    )
    mut.notifications.unshift({
      id: uid(),
      user_id: req.sender_id,
      title: 'Votre demande a été acceptée',
      body: `${req.sender_name}, votre demande ${req.reference} (${off.from} → ${off.to}) a été acceptée. Le colis peut être remis au transporteur.`,
      read: false,
      created_at: new Date().toISOString(),
    })
  })
  return { ok: true }
}

export function declineRequest(requestId: string): void {
  commit((mut) => {
    const req = mut.requests.find((r) => r.id === requestId)
    if (!req || req.status !== 'pending') return
    req.status = 'declined'
    mut.notifications.unshift({
      id: uid(),
      user_id: req.sender_id,
      title: 'Demande refusée',
      body: `Votre demande ${req.reference} a été refusée par le transporteur.`,
      read: false,
      created_at: new Date().toISOString(),
    })
  })
}

/* --------------------------- shipments --------------------------- */

export function getShipment(shipmentId: string): Shipment | null {
  return read().shipments.find((s) => s.id === shipmentId) ?? null
}

function normalizeReference(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '')
}

export function getShipmentByReference(reference: string): Shipment | null {
  const target = normalizeReference(reference)
  if (!target) return null
  return (
    read().shipments.find((s) => normalizeReference(s.reference) === target) ?? null
  )
}

export function shipmentsForOwner(profile: Profile): Shipment[] {
  return read().shipments.filter((s) => s.owner_id === profile.id)
}

export function shipmentsForProvider(profile: Profile): Shipment[] {
  return read().shipments.filter((s) => s.provider_id === profile.id)
}

export function trackingForShipment(shipmentId: string): TrackingEvent[] {
  return read()
    .tracking.filter((t) => t.shipment_id === shipmentId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export const TRACKING_STEPS: { key: ShipmentStatus; label: string }[] = [
  { key: 'demande_envoyee', label: STATUS_LABEL.demande_envoyee },
  { key: 'demande_acceptee', label: STATUS_LABEL.demande_acceptee },
  { key: 'remis', label: STATUS_LABEL.remis },
  { key: 'en_transit', label: STATUS_LABEL.en_transit },
  { key: 'arrive', label: STATUS_LABEL.arrive },
  { key: 'livre', label: STATUS_LABEL.livre },
]

export function advanceShipment(shipmentId: string): { ok: boolean; error?: string } {
  const db = read()
  const shipment = db.shipments.find((s) => s.id === shipmentId)
  if (!shipment) return { ok: false, error: 'Colis introuvable.' }
  if (shipment.status === 'livre' || shipment.status === 'annule')
    return { ok: false, error: 'Ce colis est déjà terminé.' }
  const idx = TRACKING_STEPS.findIndex((s) => s.key === shipment.status)
  const next = TRACKING_STEPS[idx + 1]
  if (!next) return { ok: false, error: 'Aucune étape suivante.' }
  commit((mut) => {
    const s = mut.shipments.find((x) => x.id === shipmentId)!
    s.status = next.key
    mut.tracking.push({
      id: uid(),
      shipment_id: s.id,
      key: next.key,
      label: next.label,
      date: new Date().toISOString(),
    })
    mut.notifications.unshift({
      id: uid(),
      user_id: s.owner_id,
      title: `Colis ${s.reference} : ${next.label}`,
      body: `Le statut de votre colis ${s.reference} (${s.from} → ${s.to}) a été mis à jour : ${next.label}.`,
      read: false,
      created_at: new Date().toISOString(),
    })
  })
  return { ok: true }
}

export function deliveryTarget(shipment: Shipment): boolean {
  return shipment.status === 'arrive'
}

/* --------------------------- admin --------------------------- */

export function approveVerification(requestId: string): void {
  commit((mut) => {
    const v = mut.verifications.find((x) => x.id === requestId)
    if (!v) return
    v.status = 'approved'
    const p = mut.profiles.find((x) => x.id === v.user_id)
    if (p) {
      p.role = v.requested_role
      p.verification_status = 'verified'
    }
    mut.notifications.unshift({
      id: uid(),
      user_id: v.user_id,
      title: 'Votre profil a été vérifié',
      body: `Félicitations, votre profil ${v.requested_role === 'gp' ? 'GP / Voyageur' : 'Transitaire'} a été validé par l'administration.`,
      read: false,
      created_at: new Date().toISOString(),
    })
  })
}

export function rejectVerification(requestId: string): void {
  commit((mut) => {
    const v = mut.verifications.find((x) => x.id === requestId)
    if (!v) return
    v.status = 'rejected'
    mut.notifications.unshift({
      id: uid(),
      user_id: v.user_id,
      title: 'Demande de vérification refusée',
      body: 'Votre demande de vérification a été refusée. Merci de reprendre contact avec le support.',
      read: false,
      created_at: new Date().toISOString(),
    })
  })
}

export function deactivateOffer(offerId: string): void {
  commit((mut) => {
    const o = mut.offers.find((x) => x.id === offerId)
    if (o) o.status = 'inactive'
  })
}

export function setShipmentStatus(shipmentId: string, status: ShipmentStatus): void {
  commit((mut) => {
    const s = mut.shipments.find((x) => x.id === shipmentId)
    if (!s) return
    s.status = status
    mut.tracking.push({
      id: uid(),
      shipment_id: s.id,
      key: status,
      label: STATUS_LABEL[status],
      date: new Date().toISOString(),
    })
  })
}

export function resolveReport(reportId: string, outcome: 'resolved' | 'dismissed'): void {
  commit((mut) => {
    const r = mut.reports.find((x) => x.id === reportId)
    if (r) r.status = outcome
  })
}

/* --------------------------- demo helpers --------------------------- */

export async function resetDemoData(): Promise<void> {
  await sleep(400)
  localStorage.removeItem(KEY)
  cache = null
  const fresh = buildSeed()
  persist(fresh)
  listeners.forEach((l) => l())
}

export function demoUsers(): { label: string; email: string; role: string }[] {
  const byEmail = new Map<string, Profile>()
  read()
    .profiles.filter((p) => p.role !== 'admin')
    .forEach((p) => byEmail.set(p.email, p))
  return Array.from(byEmail.values()).map((p) => ({
    label: `${p.first_name} ${p.last_name || ''}`.trim(),
    email: p.email,
    role: p.role,
  }))
}

export function demoSeedDay(): Date {
  return daysFromNow(1)
}