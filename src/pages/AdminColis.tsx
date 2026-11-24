import { Boxes, MapPin } from 'lucide-react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Select } from '../components/ui/Field'
import { EmptyState } from '../components/ui/States'
import { getDB, setShipmentStatus, TRACKING_STEPS } from '../lib/db'
import { useToast } from '../context/ToastContext'
import { useDB } from '../hooks'
import { money } from '../lib/utils'
import type { ShipmentStatus } from '../lib/types'

const toneFor: Record<string, 'blue' | 'green' | 'amber' | 'slate' | 'red'> = {
  demande_envoyee: 'slate',
  demande_acceptee: 'blue',
  remis: 'blue',
  en_transit: 'blue',
  arrive: 'amber',
  livre: 'green',
  annule: 'red',
}

export default function AdminColis() {
  const { toast } = useToast()
  useDB()
  const db = getDB()

  const shipments = [...db.shipments].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  const change = (id: string, status: string) => {
    setShipmentStatus(id, status as ShipmentStatus)
    toast('Statut du colis mis à jour.')
  }

  return (
    <DashboardLayout>
      <div className="pt-6 sm:pt-0">
        <h1 className="font-display text-2xl font-bold text-[#0F2450] sm:text-3xl">Colis</h1>
        <p className="mt-1.5 text-[#64748B]">
          Toutes les expéditions de la plateforme et leur suivi.
        </p>

        {shipments.length === 0 ? (
          <div className="mt-8">
            <EmptyState title="Aucun colis" message="Aucune expédition n'a encore été créée." icon={<Boxes size={28} />} />
          </div>
        ) : (
          <Card className="mt-6 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-[#F8FAFC] text-xs uppercase tracking-wide text-[#64748B]">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold">Référence</th>
                    <th className="px-5 py-3.5 font-semibold">Trajet</th>
                    <th className="px-5 py-3.5 font-semibold">Poids</th>
                    <th className="px-5 py-3.5 font-semibold">TOTAL</th>
                    <th className="px-5 py-3.5 font-semibold">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {shipments.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/60">
                      <td className="px-5 py-3.5 font-bold text-[#1B3A70]">{s.reference}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1 text-slate-700">
                          <MapPin size={13} className="text-[#059669]" /> {s.from} → {s.to}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-700">{s.weight} kg</td>
                      <td className="px-5 py-3.5 font-semibold text-slate-800">{money(s.total)}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <Badge tone={toneFor[s.status] ?? 'slate'}>
                            {TRACKING_STEPS.find((t) => t.key === s.status)?.label ?? s.status}
                          </Badge>
                          {s.status !== 'livre' && s.status !== 'annule' && (
                            <Select
                              aria-label={`Changer le statut de ${s.reference}`}
                              className="w-40 py-1.5 text-xs"
                              value={s.status}
                              onChange={(e) => change(s.id, e.target.value)}
                            >
                              {TRACKING_STEPS.filter((t) => t.key !== 'demande_envoyee').map((t) => (
                                <option key={t.key} value={t.key}>{t.label}</option>
                              ))}
                            </Select>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}