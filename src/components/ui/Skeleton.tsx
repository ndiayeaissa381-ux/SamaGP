import { cx } from '../../lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cx('animate-pulse rounded-lg bg-slate-200/70', className)}
      aria-hidden
    />
  )
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        'rounded-2xl border border-slate-200 bg-white p-5 space-y-3',
        className
      )}
      aria-hidden
    >
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}