import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, Check, Package, Plus, Star } from 'lucide-react'
import type { Offer } from '../lib/types'
import { cx, formatDateShort, money, TRANSPORT_LABEL } from '../lib/utils'
import { getProfile } from '../lib/db'
import { Avatar } from './ui/Avatar'
import { Badge, KindBadge, VerificationBadge } from './ui/Badge'
import { useDB } from '../hooks'

export function OfferCard({
  offer,
  selectable = false,
  selected = false,
  onToggleCompare,
}: {
  offer: Offer
  selectable?: boolean
  selected?: boolean
  onToggleCompare?: () => void
}) {
  useDB()
  const provider = getProfile(offer.provider_id)
  const name = provider ? `${provider.first_name} ${provider.last_name || ''}`.trim() : 'Transporteur'
  const displayName = provider?.company || name

  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/[0.03] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#2A50A0]/40 hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar
            src={provider?.avatar_url}
            name={displayName}
            className="h-11 w-11 text-sm"
          />
          <div>
            <p className="flex items-center gap-1.5 font-bold text-slate-900">
              {displayName}
              <VerificationBadge verified={provider?.verification_status === 'verified'} />
            </p>
            <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
              <KindBadge kind={offer.provider_kind} />
              {offer.transport && (
                <Badge tone="slate">{TRANSPORT_LABEL[offer.transport]}</Badge>
              )}
            </div>
          </div>
        </div>
        {provider && provider.review_count > 0 && (
          <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-sm font-bold text-amber-700">
            <Star size={14} className="fill-amber-500 text-amber-500" />
            {provider.rating.toFixed(1)}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#F8FAFC] px-4 py-3 text-slate-900">
        <span className="font-display font-bold text-[#0F2450]">{offer.from}</span>
        <span className="flex flex-1 items-center gap-1 text-slate-400">
          <span className="h-px flex-1 bg-slate-300" />
          <ArrowRight size={16} />
          <span className="h-px flex-1 bg-slate-300" />
        </span>
        <span className="font-display font-bold text-[#0F2450]">{offer.to}</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 text-[#64748B]">
          <Calendar size={16} className="shrink-0 text-[#2A50A0]" />
          <span className="truncate">
            {offer.delivery_days ? `Délai ${offer.delivery_days}` : offer.date ? formatDateShort(offer.date) : 'Flexible'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[#64748B]">
          <Package size={16} className="shrink-0 text-[#2A50A0]" />
          <span className="truncate">
            {new Intl.NumberFormat('fr-FR').format(offer.capacity)} kg disponibles
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <div>
          <p className="font-display text-lg font-bold text-[#0F2450]">{money(offer.price_per_kg)}</p>
          <p className="text-xs text-[#64748B]">par kg</p>
        </div>
        <div className="flex items-center gap-2">
          {selectable && (
            <button
              type="button"
              onClick={onToggleCompare}
              aria-pressed={selected}
              aria-label={selected ? 'Retirer de la comparaison' : 'Ajouter à la comparaison'}
              className={cx(
                'inline-flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors',
                selected
                  ? 'border-[#059669] bg-[#D1FAE5] text-[#047857]'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              )}
            >
              {selected ? <Check size={15} /> : <Plus size={15} />}
              {selected ? 'Ajoutée' : 'Comparer'}
            </button>
          )}
          <Link
            to={`/offres/${offer.id}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#1B3A70] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0F2450]"
          >
            Voir l'offre
          </Link>
        </div>
      </div>
    </article>
  )
}