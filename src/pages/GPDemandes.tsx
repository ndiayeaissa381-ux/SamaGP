import { useState } from 'react'
import { Inbox, MapPin, Scale, Package, Check, X } from 'lucide-react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/States'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import {
  requestsForProvider,
  acceptRequest,
  declineRequest,
  getOffer,
} from '../lib/db'
import { useToast } from '../context/ToastContext'
import { useDB } from '../hooks'
import { money, formatDateShort } from '../lib/utils'

type Filter = 'all' | 'pending' | 'accepted' | 'declined'

export default function GPDemandes() {
  const { user } = useAuth()
  const { toast } = useToast()
  useDB()
  const [filter, setFilter] = useState<Filter>('pending')
  const [accepting, setAccepting] = useState<string | null>(null)
  const [modal, setModal] = useState<{ kind: 'accept' | 'decline'; requestId: string; senderName: string } | null>(null)
  const [busy, setBusy] = useState(false)

  if (!user) return null
  const requests = requestsForProvider(user)
  const filtered =
    filter === 'all' ? requests : requests.filter((r) => r.status === filter)
  const pending = requests.filter((r) => r.status === 'pending').length

  const doAccept = (requestId: string) => {
    setBusy(true)
    const res = acceptRequest(requestId)
    setBusy(false)
    setModal(null)
    if (res.ok) {
      toast('Demande acceptée. La capacité a été mise à jour et l\'expéditeur notifié.')
    } else {
      toast(res.error ?? 'Impossible d\'accepter cette demande.', 'error')
    }
  }

  const doDecline = (requestId: string) => {
    setBusy(true)
    declineRequest(requestId)
    setBusy(false)
    setModal(null)
    toast('Demande refusée.', 'info')
  }

  return (
    <DashboardLayout>
      <div className="pt-6 sm:pt-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#0F2450] sm:text-3xl">Demandes reçues</h1>
            <p className="mt-1.5 text-[#64748B]">
              {pending} demande{pending > 1 ? 's' : ''} en attente de votre décision.
            </p>
          </div>
          <div className="inline-flex gap-1 rounded-xl border border-slate-200 bg-white p-1">
            {(
              [
                ['all', 'Toutes'],
                ['pending', 'En attente'],
                ['accepted', 'Acceptées'],
                ['declined', 'Refusées'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                  filter === key ? 'bg-[#1B3A70] text-white' : 'text-slate-600 hover:text-[#0F2450]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="Aucune demande"
              message={filter === 'pending' ? 'Vos demandes en attente apparaîtront ici.' : 'Aucune demande dans cette catégorie.'}
              icon={<Inbox size={28} />}
            />
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {filtered.map((r) => {
              const offer = getOffer(r.offer_id)
              return (
                <Card key={r.id} className="p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF2F8] font-display text-base font-bold text-[#1B3A70]">
                        {initials(r.sender_name)}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-display font-bold text-[#0F2450]">{r.sender_name}</p>
                          <BadgeB tone={r.status} />
                        </div>
                        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#64748B]">
                          <span className="flex items-center gap-1"><Scale size={13} /> {r.weight} kg</span>
                          <span className="flex items-center gap-1"><Package size={13} /> {r.parcel_type}</span>
                        </p>
                        {offer && (
                          <p className="mt-0.5 flex items-center gap-1 text-sm text-[#64748B]">
                            <MapPin size={13} className="text-[#059669]" /> {offer.from} → {offer.to}
                            <span className="text-slate-400">· {formatDateShort(r.created_at)}</span>
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 lg:justify-end">
                      {r.status === 'pending' ? (
                        <>
                          <Button variant="success" onClick={() => setModal({ kind: 'accept', requestId: r.id, senderName: r.sender_name })}>
                            <Check size={16} /> Accepter
                          </Button>
                          <Button variant="secondary" onClick={() => setModal({ kind: 'decline', requestId: r.id, senderName: r.sender_name })}>
                            <X size={16} /> Refuser
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="text-sm font-semibold text-slate-600">{money(r.total)}</span>
                          {r.status === 'accepted' && (
                            <Button variant="secondary" size="sm" className="pointer-events-none">
                              Traitée
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.kind === 'accept' ? 'Accepter la demande' : 'Refuser la demande'}
      >
        {modal && (
          <div>
            <p className="text-sm text-slate-600">
              {modal.kind === 'accept' ? (
                <>
                  Vous allez accepter la demande de <strong>{modal.senderName}</strong>. La
                  capacité disponible de cette offre sera mise à jour et l'expéditeur sera
                  notifié.
                </>
              ) : (
                <>
                  Vous allez refuser la demande de <strong>{modal.senderName}</strong>.
                  L'expéditeur sera notifié du refus.
                </>
              )}
            </p>
            <div className="mt-5 flex gap-3">
              {modal.kind === 'accept' ? (
                <Button variant="success" className="flex-1" loading={busy && accepting === modal.requestId} onClick={() => { setAccepting(modal.requestId); doAccept(modal.requestId) }}>
                  <Check size={16} /> Accepter
                </Button>
              ) : (
                <Button className="flex-1" loading={busy} onClick={() => doDecline(modal.requestId)}>
                  <X size={16} /> Confirmer le refus
                </Button>
              )}
              <Button variant="secondary" className="flex-1" onClick={() => setModal(null)}>
                Annuler
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  )
}

function BadgeB({ tone }: { tone: string }) {
  if (tone === 'pending') return <Badge tone="amber">En attente</Badge>
  if (tone === 'accepted') return <Badge tone="green">Acceptée</Badge>
  return <Badge tone="slate">Refusée</Badge>
}

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}