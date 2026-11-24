import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  Package,
  Star,
  Plane,
  Clock,
  MapPin,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { getOffer, getProfile, getDB } from '../lib/db'
import { useAuth } from '../context/AuthContext'
import { money, formatDate, TRANSPORT_LABEL, timeAgo } from '../lib/utils'
import { Avatar } from '../components/ui/Avatar'
import { Badge, KindBadge, VerificationBadge } from '../components/ui/Badge'
import { ErrorState, LoadingState } from '../components/ui/States'
import { Button } from '../components/ui/Button'
import { useDB } from '../hooks'

export default function OfferDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  useDB()
  if (!id) return <ErrorState />

  const offer = getOffer(id)
  if (!offer) return <ErrorState message="Cette offre n'existe pas ou n'est plus disponible." />
  const provider = getProfile(offer.provider_id)
  const name = provider ? `${provider.first_name} ${provider.last_name || ''}`.trim() : 'SAMA GP'
  const displayName = provider?.company || name
  const hasRating = provider ? provider.review_count > 0 : false

  const startBooking = () => {
    if (!user) {
      navigate('/login', { state: { from: `/expedition/nouvelle?offer=${offer.id}` } })
      return
    }
    navigate(`/expedition/nouvelle?offer=${offer.id}`)
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Link
        to="/rechercher"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B3A70] hover:text-[#0F2450]"
      >
        <ArrowLeft size={16} /> Retour aux résultats
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <Avatar
                  src={provider?.avatar_url}
                  name={displayName}
                  className="h-16 w-16 text-xl"
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-display text-2xl font-bold text-[#0F2450]">{displayName}</h1>
                    <VerificationBadge verified={provider?.verification_status === 'verified'} />
                  </div>
                  <p className="mt-1 flex items-center gap-2 text-sm text-[#64748B]">
                    {provider ? `${provider.city}, ${provider.country}` : 'Sénégal'}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <KindBadge kind={offer.provider_kind} />
                    {offer.transport && <Badge tone="slate">{TRANSPORT_LABEL[offer.transport]}</Badge>}
                    <Badge tone="slate">Membre depuis 4 mois</Badge>
                  </div>
                </div>
              </div>
              {hasRating && (
                <div className="rounded-2xl bg-amber-50 px-4 py-3 text-center">
                  <p className="font-display text-2xl font-bold text-amber-700">
                    {provider!.rating.toFixed(1)}
                  </p>
                  <p className="flex items-center justify-center gap-1 text-xs text-amber-600">
                    <Star size={13} className="fill-amber-500 text-amber-500" />
                    {provider!.review_count} avis
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8">
              <div className="flex items-center gap-3 rounded-2xl bg-[#F8FAFC] px-5 py-4">
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-wide text-[#64748B]">Départ</p>
                  <p className="mt-1 flex items-center gap-1.5 font-display text-lg font-bold text-[#0F2450]">
                    <MapPin size={16} className="text-[#059669]" /> {offer.from}
                  </p>
                </div>
                <div className="flex flex-col items-center text-slate-400">
                  <span className="h-px w-8 bg-slate-300" />
                  <Plane size={18} className="my-1 text-[#2A50A0]" />
                  <span className="h-px w-8 bg-slate-300" />
                </div>
                <div className="flex-1 text-right">
                  <p className="text-xs uppercase tracking-wide text-[#64748B]">Destination</p>
                  <p className="mt-1 flex items-center justify-end gap-1.5 font-display text-lg font-bold text-[#0F2450]">
                    {offer.to} <MapPin size={16} className="text-[#059669]" />
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <InfoCell
                  icon={<Calendar size={16} className="text-[#2A50A0]" />}
                  label={offer.delivery_days ? 'Délai de livraison' : 'Date de départ'}
                  value={offer.delivery_days ?? formatDate(offer.date!)}
                />
                <InfoCell
                  icon={<Package size={16} className="text-[#2A50A0]" />}
                  label="Capacité disponible"
                  value={`${new Intl.NumberFormat('fr-FR').format(offer.capacity)} kg`}
                />
                <InfoCell
                  icon={<Clock size={16} className="text-[#2A50A0]" />}
                  label="Tarif"
                  value={`${money(offer.price_per_kg)} / kg`}
                />
                <InfoCell
                  icon={<ShieldCheck size={16} className="text-[#2A50A0]" />}
                  label="Confirmation"
                  value="Demande envoyée au transporteur"
                />
              </div>

              {offer.transport && (
                <div className="mt-5 flex items-center gap-2 rounded-xl bg-[#D1FAE5]/60 px-4 py-3 text-sm text-[#047857]">
                  <Plane size={16} />
                  Transport de type <strong>{TRANSPORT_LABEL[offer.transport]}</strong> · délai estimé{' '}
                  {offer.delivery_days}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-[#0F2450]">
              {offer.provider_kind === 'gp' ? 'À propos du voyage' : 'À propos de cette offre'}
            </h2>
            <p className="mt-3 leading-relaxed text-slate-600">{offer.description}</p>
            {provider?.bio && <p className="mt-3 text-sm leading-relaxed text-[#64748B]">{provider.bio}</p>}
            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#EEF2F8] p-4">
              <Users size={18} className="mt-0.5 shrink-0 text-[#2A50A0]" />
              <p className="text-sm text-slate-600">
                Depuis {timeAgo(offer.created_at)}, cette offre est visible dans la marketplace.
                Le transporteur répond généralement sous 24 h.
              </p>
            </div>
          </div>
        </div>

        <aside>
          <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-[#64748B]">Tarif estimé</p>
            <div className="mt-2 flex items-end gap-1">
              <p className="font-display text-3xl font-extrabold text-[#0F2450]">{money(offer.price_per_kg)}</p>
              <p className="pb-1 text-sm text-[#64748B]">/ kg</p>
            </div>

            <div className="mt-5 space-y-2 border-t border-slate-100 pt-5 text-sm text-slate-600">
              <p className="flex items-center justify-between">
                <span>Poids du colis</span>
                <span className="font-semibold text-slate-800">À préciser</span>
              </p>
              <p className="flex items-center justify-between">
                <span>Capacité restante</span>
                <span className="font-semibold text-slate-800">{new Intl.NumberFormat('fr-FR').format(offer.capacity)} kg</span>
              </p>
              <p className="flex items-center justify-between">
                <span>Trajet</span>
                <span className="font-semibold text-slate-800">{offer.from} → {offer.to}</span>
              </p>
            </div>

            <p className="mt-4 rounded-xl bg-[#D1FAE5]/60 px-3.5 py-2.5 text-xs text-[#047857]">
              Les objets interdits au transport ne sont pas acceptés.
            </p>

            <Button className="mt-5 w-full" size="lg" onClick={startBooking}>
              {offer.provider_kind === 'gp' ? 'Réserver cette offre' : 'Demander cette solution'}
            </Button>
            {!user && (
              <p className="mt-3 text-center text-xs text-[#64748B]">
                Vous devrez vous connecter pour envoyer votre demande.
              </p>
            )}
          </div>
        </aside>
      </div>
    </main>
  )
}

function InfoCell({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3">
      {icon}
      <div>
        <p className="text-xs text-[#64748B]">{label}</p>
        <p className="text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  )
}