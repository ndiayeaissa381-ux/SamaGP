import { Bell } from 'lucide-react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/States'
import { useAuth } from '../context/AuthContext'
import { getDB, markNotificationsRead } from '../lib/db'
import { useToast } from '../context/ToastContext'
import { useDB } from '../hooks'
import { timeAgo } from '../lib/utils'

export default function Notifications() {
  const { user } = useAuth()
  const { toast } = useToast()
  useDB()
  if (!user) return null

  const notifications = getDB()
    .notifications.filter((n) => n.user_id === user.id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const markAll = () => {
    markNotificationsRead(user.id)
    toast('Toutes les notifications ont été marquées comme lues.', 'info')
  }

  return (
    <DashboardLayout>
      <div className="pt-6 sm:pt-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#0F2450] sm:text-3xl">Notifications</h1>
            <p className="mt-1.5 text-[#64748B]">Toutes vos alertes en un seul endroit.</p>
          </div>
          {notifications.some((n) => !n.read) && (
            <Button variant="secondary" onClick={markAll}>
              Tout marquer comme lu
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="Aucune notification"
              message="Vous serez notifié à chaque étape importante de vos expéditions."
              icon={<Bell size={28} />}
            />
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {notifications.map((n) => (
              <Card
                key={n.id}
                className={`flex items-start gap-4 p-5 ${n.read ? '' : 'border-[#2A50A0]/30 bg-[#F5F8FD]'}`}
              >
                <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EEF2F8] text-[#1B3A70]">
                  <Bell size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{n.title}</span>
                    {!n.read && <span className="h-2 w-2 rounded-full bg-[#059669]" />}
                  </p>
                  <p className="mt-1 text-sm text-[#64748B]">{n.body}</p>
                  <p className="mt-1.5 text-xs text-slate-400">{timeAgo(n.created_at)}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}