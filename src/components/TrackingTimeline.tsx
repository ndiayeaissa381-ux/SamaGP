import { CheckCircle2, Circle } from 'lucide-react'
import type { ShipmentStatus } from '../lib/types'
import { TRACKING_STEPS } from '../lib/db'
import { formatDate } from '../lib/utils'

export function TrackingTimeline({
  status,
  events,
}: {
  status: ShipmentStatus
  events: { key: string; label: string; date: string }[]
}) {
  const currentIndex = TRACKING_STEPS.findIndex((s) => s.key === status)
  const eventDates = new Map(events.map((e) => [e.key as ShipmentStatus, e.date]))

  return (
    <ol className="relative space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {TRACKING_STEPS.map((step, i) => {
        const done = currentIndex >= i
        const active = currentIndex === i && step.key !== 'livre'
        const date = eventDates.get(step.key)
        return (
          <li key={step.key} className="relative flex gap-4">
            <span className="relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white">
              {done ? (
                <CheckCircle2
                  size={24}
                  className={active ? 'text-[#047857]' : 'text-[#059669]/70'}
                />
              ) : (
                <Circle size={20} className="text-slate-300" />
              )}
            </span>
            <div className="pt-0.5">
              <p
                className={
                  done
                    ? 'font-semibold text-slate-900'
                    : 'font-medium text-slate-400'
                }
              >
                {step.label}
              </p>
              {date && (
                <p className="mt-0.5 text-sm text-[#64748B]">{formatDate(date)}</p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}