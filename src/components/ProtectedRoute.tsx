import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { Role } from '../lib/types'
import { LoadingState, UnauthorizedState } from './ui/States'

export function Protected({
  children,
  roles,
}: {
  children: ReactNode
  roles?: Role[]
}) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingState label="Vérification de votre session…" />
      </div>
    )
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  if (roles && !roles.includes(user.role)) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <UnauthorizedState />
      </div>
    )
  }
  return <>{children}</>
}