import { Link } from 'react-router-dom'
import { Package, CheckCircle2, Clock, ArrowRight, Sparkles, PackagePlus } from 'lucide-react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { Card } from '../components/ui/Card'
import { Stat } from '../components/ui/Stat'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/States'
import { SearchBar } from '../components/SearchBar'
import { useAuth } from '../context/AuthContext'
import { shipmentsForOwner, requestsForSender, getOffer, getProfile } from '../lib/db'
import { useDB } from '../hooks'
import { money, formatDateShort, timeAgo } from '../lib/utils'

const ACTIVE = ['demande_envoyee', 'demande_acceptee', 'remis', 'en_transit', 'arrive']

export default function ParticulierDashboard() {
  const { user } = useAuth()
  useDB()
  if (!user) return null

  const shipments = shipmentsForOwner(user)
  const requests = requestsForSender(user)
  const enCours = shipments.filter((s) => ACTIVE.includes(s.status))
  const livres = shipments.filter((s) => s.status === 'livre')
  const pending = requests.filter((r) => r.status === 'pending')

  return (
    <DashboardLayout>
      <div className="pt-6 sm:pt-0">
        <div className="rounded-3xl bg-[#0F2450] p-6 text-white sm:p-8">
          <h1 className="font-display text-2xl font-bold sm:text-3xl">
            Bonjour {user.first_name} <span aria-hidden>👋</span>
          </h1>
          <p className="mt-1.5 text-slate-300">Où souhaitez-vous envoyer votre colis ?</p>
          <div className="mt-5">
            <SearchBar compact />
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Stat label="Colis en cours" value={String(enCours.length)} icon={<Package size={20} />} tone="blue" />
          <Stat label="Colis livrés" value={String(livres.length)} icon={<CheckCircle2 size={20} />} tone="green" />
          <Stat label="Demandes en attente" value={String(pending.length)} icon={<Clock size={20} />} tone="amber" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#0F2450]">Mes colis en cours</h2>
              <Link to="/colis" className="text-sm font-semibold text-[#1B3A70] hover:text-[#0F2450]">
                Tout voir <ArrowRight size={14} className="inline" />
              </Link>
            </div>
            {enCours.length === 0 ? (
              <EmptyState
                title="Aucun colis en cours"
                message="Recherchez une offre en haut de page pour lancer votre première expédition."
                icon={<Package size={28} />}
                action={{ label: 'Rechercher', to: '/rechercher' }}
              />
            ) : (
              <div className="space-y-3">
                {enCours.slice(0, 3).map((s) => {
                  const offer = getOffer(s.offer_id)
                  const provider = offer ? getProfile(offer.provider_id) : null
                  return (
                    <Card key={s.id} className="flex items-center justify-between gap-3 p-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-display font-bold text-[#0F2450]">{s.reference}</p>
                          <Badge tone="blue">En cours</Badge>
                        </div>
                        <p className="mt-0.5 truncate text-sm text-[#64748B]">
                          {s.from} → {s.to} · {s.weight} kg · {money(s.total)}
                        </p>
                        {provider && (
                          <p className="mt-0.5 text-xs text-slate-400">
                            {provider.company || `${provider.first_name} ${provider.last_name}`.trim()}
                          </p>
                        )}
                      </div>
                      <Link
                        to={`/colis/${s.id}`}
                        className="shrink-0 rounded-xl bg-[#1B3A70] px-3.5 py-2 text-sm font-semibold text-white hover:bg-[#0F2450]"
                      >
                        Suivi
                      </Link>
                    </Card>
                  )
                })}
              </div>
            )}
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#0F2450]">Activité récente</h2>
            </div>
            <Card className="p-4">
              {requests.length === 0 && shipments.length === 0 ? (
                <p className="py-8 text-center text-sm text-[#64748B]">
                  Aucune activité pour le moment.
                </p>
              ) : (
<ul className="space-y-4">
                  {[...requests, ...shipments]
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .slice(0, 5)
                    .map((item) => {
                      const isShipment = 'from' in item
                      return (
                        <li key={item.id} className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EEF2F8] text-[#1B3A70]">
                            {isShipment ? <Package size={15} /> : <Sparkles size={15} />}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800">
                              {isShipment ? `Colis ${item.reference}` : `Demande ${item.reference}`}
                            </p>
                            <p className="text-xs text-[#64748B]">
                              {isShipment
                                ? `${item.from} → ${item.to} · ${formatDateShort(item.created_at)}`
                                : `Envoyée le ${formatDateShort(item.created_at)}`}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-400">{timeAgo(item.created_at)}</p>
                          </div>
                        </li>
                      )
                    })}
                </ul>
              )}
            </Card>
            <Link
              to="/expedition/nouvelle?offer="
              className="mt-4 flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-white p-4 text-sm font-semibold text-[#1B3A70] transition-colors hover:border-[#059669] hover:text-[#047857]"
            >
              <PackagePlus size={17} /> Envoyer un nouveau colis
            </Link>
          </section>
        </div>
      </div>
    </DashboardLayout>
  )
}