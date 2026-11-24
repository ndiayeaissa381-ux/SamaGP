import { useMemo, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowRight,
  Calculator,
  LogIn,
  MapPin,
  Package,
  Scale,
  Search,
  ShieldCheck,
} from 'lucide-react'
import { getProfile, getShipmentByReference, trackingForShipment } from '../lib/db'
import { useDB } from '../hooks'
import { useAuth } from '../context/AuthContext'
import { TrackingTimeline } from '../components/TrackingTimeline'
import { Badge } from '../components/ui/Badge'
import { Avatar } from '../components/ui/Avatar'
import { Input } from '../components/ui/Field'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/States'
import { formatDate, money } from '../lib/utils'

const statusMeta: Record<
  string,
  { label: string; tone: 'blue' | 'green' | 'amber' | 'slate' | 'red' }
> = {
  demande_envoyee: { label: 'Demande envoyée', tone: 'slate' },
  demande_acceptee: { label: 'Demande acceptée', tone: 'blue' },
  remis: { label: 'Colis remis au transporteur', tone: 'blue' },
  en_transit: { label: 'En transit', tone: 'blue' },
  arrive: { label: 'Arrivé à destination', tone: 'amber' },
  livre: { label: 'Livré', tone: 'green' },
  annule: { label: 'Annulé', tone: 'red' },
}

export default function PublicTracking() {
  const [params, setParams] = useSearchParams()
  const { user } = useAuth()
  const version = useDB()

  const reference = params.get('ref')?.trim() ?? ''
  const [term, setTerm] = useState(reference)

  const shipment = useMemo(
    () => (reference ? getShipmentByReference(reference) : null),
    [reference, version]
  )

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const value = term.trim()
    if (value) setParams({ ref: value })
    else setParams({})
  }

  const events = shipment ? trackingForShipment(shipment.id) : []
  const provider = shipment ? getProfile(shipment.provider_id) : null
  const providerName = provider
    ? provider.company || `${provider.first_name} ${provider.last_name}`.trim()
    : 'Transporteur'
  const badge = shipment
    ? statusMeta[shipment.status] ?? { label: shipment.status, tone: 'slate' as const }
    : null
  const lastUpdate = events.length ? events[events.length - 1].date : null
  const isOwner = Boolean(user && shipment && user.id === shipment.owner_id)

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#D1FAE5] bg-[#D1FAE5] px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-[#047857]">
          <ShieldCheck size={14} />
          Suivi d'expédition
        </span>
        <h1 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-[#0F2450] sm:text-4xl">
          Où est mon colis ?
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-[#64748B]">
          Saisissez la référence reçue lors de votre demande (par exemple
          <span className="font-semibold text-slate-700"> SGP-02481</span>) pour
          consulter l'avancement de votre envoi, sans créer de compte.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="mx-auto mt-8 flex max-w-xl flex-col gap-2.5 sm:flex-row"
        role="search"
        aria-label="Suivre un colis par référence"
      >
        <div className="relative flex-1">
          <Package
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2A50A0]"
          />
          <Input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="SGP-02481"
            aria-label="Référence du colis"
            autoComplete="off"
            spellCheck={false}
            className="h-[46px] pl-11 uppercase"
          />
        </div>
        <Button type="submit" size="lg" className="h-[46px] shrink-0">
          <Search size={17} />
          Suivre mon colis
        </Button>
      </form>
      <p className="mx-auto mt-3 max-w-xl text-center text-xs text-slate-400">
        La référence figure dans la confirmation de demande et dans vos notifications.
      </p>

      {reference && !shipment && (
        <div className="mt-10">
          <EmptyState
            title="Aucun colis trouvé"
            message={`Aucune expédition ne correspond à la référence « ${reference} ». Vérifiez la saisie ou contactez votre transporteur.`}
            icon={<Package size={28} />}
            action={{ label: 'Contacter le support', to: '/contact' }}
          />
        </div>
      )}

      {shipment && badge && (
        <section className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 bg-[#F8FAFC] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Référence
              </p>
              <h2 className="font-display text-xl font-extrabold text-[#0F2450]">
                {shipment.reference}
              </h2>
            </div>
            <Badge tone={badge.tone} className="w-fit px-3 py-1.5 text-sm">
              {badge.label}
            </Badge>
          </div>

          <div className="grid gap-6 px-5 py-6 sm:px-6 lg:grid-cols-[1fr_260px]">
            <div>
              <div className="flex items-center gap-2 rounded-xl bg-[#F8FAFC] px-4 py-3 text-slate-900">
                <span className="font-display font-bold text-[#0F2450]">{shipment.from}</span>
                <span className="flex flex-1 items-center gap-1 text-slate-400">
                  <span className="h-px flex-1 bg-slate-300" />
                  <ArrowRight size={16} />
                  <span className="h-px flex-1 bg-slate-300" />
                </span>
                <span className="font-display font-bold text-[#0F2450]">{shipment.to}</span>
              </div>

              <h3 className="mt-6 font-display text-lg font-bold text-[#0F2450]">
                Étapes de l'expédition
              </h3>
              <div className="mt-4">
                <TrackingTimeline status={shipment.status} events={events} />
              </div>
              {lastUpdate && (
                <p className="mt-5 text-xs text-slate-400">
                  Dernière mise à jour le {formatDate(lastUpdate)}.
                </p>
              )}
            </div>

            <div className="space-y-5">
              <dl className="space-y-3 rounded-xl border border-slate-200 p-4 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1.5 text-[#64748B]">
                    <Scale size={14} /> Poids
                  </dt>
                  <dd className="font-semibold text-slate-800">{shipment.weight} kg</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1.5 text-[#64748B]">
                    <Calculator size={14} /> Montant
                  </dt>
                  <dd className="font-semibold text-slate-800">{money(shipment.total)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1.5 text-[#64748B]">
                    <MapPin size={14} /> Créé le
                  </dt>
                  <dd className="font-semibold text-slate-800">
                    {formatDate(shipment.created_at)}
                  </dd>
                </div>
              </dl>

              {provider && (
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Transporteur
                  </p>
                  <div className="mt-2.5 flex items-center gap-3">
                    <Avatar
                      src={provider.avatar_url}
                      name={providerName}
                      className="h-10 w-10 text-sm"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">{providerName}</p>
                      <p className="text-xs text-[#64748B]">
                        {provider.role === 'gp' ? 'GP / Voyageur' : 'Transitaire'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {isOwner ? (
                <Link
                  to={`/colis/${shipment.id}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1B3A70] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0F2450]"
                >
                  Gérer mon colis <ArrowRight size={15} />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#1B3A70] transition-colors hover:border-[#2A50A0] hover:bg-slate-50"
                >
                  <LogIn size={15} /> Se connecter
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="font-display font-bold text-[#0F2450]">
          Vous n'avez pas encore de référence ?
        </h2>
        <p className="mt-1.5 text-sm text-[#64748B]">
          Comparez les offres disponibles, réservez votre transport puis suivez votre
          colis à chaque étape, de la remise à la livraison.
        </p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          <Link
            to="/rechercher"
            className="inline-flex items-center gap-2 rounded-xl bg-[#1B3A70] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0F2450]"
          >
            Rechercher une offre <ArrowRight size={15} />
          </Link>
          <Link
            to="/comment-ca-marche"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#1B3A70] transition-colors hover:border-[#2A50A0] hover:bg-slate-50"
          >
            Comment ça marche
          </Link>
        </div>
      </div>
    </main>
  )
}
