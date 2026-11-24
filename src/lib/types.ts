export type Role = 'particulier' | 'gp' | 'transitaire' | 'admin'

export type VerificationStatus = 'verified' | 'pending' | 'none'

export type OfferKind = 'gp' | 'transitaire'

export type TransportMode = 'aerien' | 'maritime' | 'terrestre'

export type RequestStatus = 'pending' | 'accepted' | 'declined' | 'cancelled'

export type ShipmentStatus =
  | 'demande_envoyee'
  | 'demande_acceptee'
  | 'remis'
  | 'en_transit'
  | 'arrive'
  | 'livre'
  | 'annule'

export interface Profile {
  id: string
  first_name: string
  last_name: string
  company?: string
  email: string
  phone: string
  role: Role
  city: string
  country: string
  avatar_url: string | null
  verification_status: VerificationStatus
  rating: number
  review_count: number
  bio: string
  created_at: string
}

export interface Offer {
  id: string
  provider_id: string
  provider_kind: OfferKind
  from: string
  to: string
  date: string | null
  capacity: number
  price_per_kg: number
  transport: TransportMode | null
  delivery_days: string | null
  description: string
  status: 'active' | 'inactive'
  created_at: string
}

export interface ShipmentRequest {
  id: string
  reference: string
  offer_id: string
  sender_id: string
  sender_name: string
  sender_phone: string
  destination: string
  parcel_type: string
  weight: number
  description: string
  total: number
  status: RequestStatus
  created_at: string
}

export interface Shipment {
  id: string
  reference: string
  request_id: string
  offer_id: string
  owner_id: string
  provider_id: string
  from: string
  to: string
  weight: number
  total: number
  status: ShipmentStatus
  created_at: string
}

export interface TrackingEvent {
  id: string
  shipment_id: string
  key: ShipmentStatus
  label: string
  date: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  body: string
  read: boolean
  created_at: string
}

export interface VerificationRequest {
  id: string
  user_id: string
  requested_role: Exclude<Role, 'admin'> | 'gp'
  status: 'pending' | 'approved' | 'rejected'
  documents_note: string
  created_at: string
}

export interface Report {
  id: string
  reported_user_id: string
  reporter_id: string
  reason: string
  status: 'open' | 'resolved' | 'dismissed'
  created_at: string
}