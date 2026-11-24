import { useState } from 'react'
import { cx, initialsForName } from '../../lib/utils'

export function Avatar({
  src,
  name,
  className,
  alt,
}: {
  src?: string | null
  name?: string
  alt?: string
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  const showFallback = !src || failed
  return (
    <span
      className={cx(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E8EEF9] font-bold text-[#1B3A70]',
        className ?? 'h-10 w-10 text-sm'
      )}
    >
      {showFallback ? (
        <span aria-hidden>{name ? initialsForName(name) : 'SGP'}</span>
      ) : (
        <img
          src={src}
          alt={alt ?? name ?? 'Avatar'}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  )
}