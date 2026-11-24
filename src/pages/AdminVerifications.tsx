import { useState } from 'react'
import { BadgeCheck, Check, X } from 'lucide-react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/States'
import { getDB, approveVerification, rejectVerification } from '../lib/db'
import { useToast } from '../context/ToastContext'
import { useDB } from '../hooks'
import { formatDateShort } from '../lib/utils'

export default function AdminVerifications() {
  const { toast } = useToast()
  useDB()
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [modal, setModal] = useState<{ kind: 'approve' | 'reject'; id: string; name: string } | null>(null)

  const db = getDB()
  const list = db.verifications.filter((v) => v.status === filter)
  const pendingCount = db.verifications.filter((v) => v.status === 'pending').length

  const doAction = () => {
    if (!modal) return
    if (modal.kind === 'approve') {
      approveVerification(modal.id)
      toast(`Vérification approuvée pour ${modal.name}. Le rôle a été activé.`)
    } else {
      rejectVerification(modal.id)
      toast(`Vérification refusée pour ${modal.name}.`, 'info')
    }
    setModal(null)
  }

  return (
    <DashboardLayout>
      <div className="pt-6 sm:pt-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#0F2450] sm:text-3xl">Vérifications</h1>
            <p className="mt-1.5 text-[#64748B]">
              {pendingCount} demande{pendingCount > 1 ? 's' : ''} en attente d'approbation.
            </p>
          </div>
          <div className="inline-flex gap-1 rounded-xl border border-slate-200 bg-white p-1">
            {(
              [
                ['pending', 'En attente'],
                ['approved', 'Approuvées'],
                ['rejected', 'Refusées'],
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

        {list.length === 0 ? (
          <div className="mt-8">
            <EmptyState title="Aucune demande" message="Aucune demande dans cette catégorie pour le moment." icon={<BadgeCheck size={28} />} />
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {list.map((v) => {
              const p = db.profiles.find((x) => x.id === v.user_id)
              const name = p ? `${p.first_name} ${p.last_name}`.trim() : 'Utilisateur'
              const isPending = v.status === 'pending'
              return (
                <Card key={v.id} className="p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-display font-bold text-[#0F2450]">{name}</p>
                        <Badge tone={v.requested_role === 'gp' ? 'blue' : 'violet'}>
                          {v.requested_role === 'gp' ? 'GP / Voyageur' : 'Transitaire'}
                        </Badge>
                        {isPending && <Badge tone="amber">En attente</Badge>}
                        {v.status === 'approved' && <Badge tone="green">Approuvée</Badge>}
                        {v.status === 'rejected' && <Badge tone="slate">Refusée</Badge>}
                      </div>
                      <p className="mt-1.5 text-sm text-[#64748B]">{v.documents_note}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        Demande du {formatDateShort(v.created_at)}
                        {p && ` · ${p.email}`}
                      </p>
                    </div>
                    {isPending && (
                      <div className="flex shrink-0 gap-2">
                        <Button variant="success" onClick={() => setModal({ kind: 'approve', id: v.id, name })}>
                          <Check size={16} /> Approuver
                        </Button>
                        <Button variant="secondary" onClick={() => setModal({ kind: 'reject', id: v.id, name })}>
                          <X size={16} /> Refuser
                        </Button>
                      </div>
                    )}
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
        title={modal?.kind === 'approve' ? 'Approuver la vérification' : 'Refuser la vérification'}
      >
        {modal && (
          <div>
            <p className="text-sm text-slate-600">
              {modal.kind === 'approve'
                ? `L'approbation activera le rôle demandé et marquera ${modal.name} comme profil vérifié.`
                : `Le refus informera ${modal.name} que sa demande n'a pas été retenue.`}
            </p>
            <div className="mt-5 flex gap-3">
              <Button
                variant={modal.kind === 'approve' ? 'success' : 'danger'}
                className="flex-1"
                onClick={doAction}
              >
                Confirmer
              </Button>
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