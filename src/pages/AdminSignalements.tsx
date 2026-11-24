import { useState } from 'react'
import { Flag, Check } from 'lucide-react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/States'
import { getDB, resolveReport, getProfile } from '../lib/db'
import { useToast } from '../context/ToastContext'
import { useDB } from '../hooks'
import { formatDateShort } from '../lib/utils'

type Filter = 'open' | 'resolved' | 'dismissed'

export default function AdminSignalements() {
  const { toast } = useToast()
  useDB()
  const [filter, setFilter] = useState<Filter>('open')

  const db = getDB()
  const list = db.reports.filter((r) => r.status === filter)
  const openCount = db.reports.filter((r) => r.status === 'open').length

  return (
    <DashboardLayout>
      <div className="pt-6 sm:pt-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#0F2450] sm:text-3xl">Signalements</h1>
            <p className="mt-1.5 text-[#64748B]">
              {openCount} signalement{openCount > 1 ? 's' : ''} ouvert{openCount > 1 ? 's' : ''} à examiner.
            </p>
          </div>
          <div className="inline-flex gap-1 rounded-xl border border-slate-200 bg-white p-1">
            {(
              [
                ['open', 'Ouverts'],
                ['resolved', 'Résolus'],
                ['dismissed', 'Classés'],
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
            <EmptyState title="Aucun signalement" message="Aucun signalement dans cette catégorie pour le moment." icon={<Flag size={28} />} />
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {list.map((r) => {
              const reported = getProfile(r.reported_user_id)
              const reporter = getProfile(r.reporter_id)
              return (
                <Card key={r.id} className="p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-display font-bold text-[#0F2450]">{r.reason}</p>
                        <Badge tone={r.status === 'open' ? 'red' : r.status === 'resolved' ? 'green' : 'slate'}>
                          {r.status === 'open' ? 'Ouvert' : r.status === 'resolved' ? 'Résolu' : 'Classé'}
                        </Badge>
                      </div>
                      <p className="mt-1.5 text-sm text-[#64748B]">
                        Signalement du {formatDateShort(r.created_at)}
                        {reported && (
                          <span className="ml-1">
                            concernant{' '}
                            <strong>{reported.company || `${reported.first_name} ${reported.last_name}`.trim()}</strong>
                          </span>
                        )}
                        {reporter && (
                          <span className="ml-1 text-slate-400">
                            (signalé par {reporter.first_name} {reporter.last_name})
                          </span>
                        )}
                      </p>
                    </div>
                    {r.status === 'open' && (
                      <div className="flex shrink-0 gap-2">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => {
                            resolveReport(r.id, 'resolved')
                            toast('Signalement résolu.')
                          }}
                        >
                          <Check size={15} /> Résoudre
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            resolveReport(r.id, 'dismissed')
                            toast('Signalement classé sans suite.', 'info')
                          }}
                        >
                          Classer
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
    </DashboardLayout>
  )
}