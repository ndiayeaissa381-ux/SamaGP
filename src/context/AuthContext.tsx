import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Profile } from '../lib/types'
import { clearSession, findProfileByLogin, getProfile, readSession } from '../lib/db'

interface AuthState {
  user: Profile | null
  loading: boolean
  login: (
    identifier: string,
    password: string
  ) => Promise<{ ok: boolean; error?: string; profile?: Profile }>
  logout: () => void
  refresh: () => void
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(() => readSession())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350)
    return () => clearTimeout(t)
  }, [])

  const user = useMemo(() => (userId ? getProfile(userId) : null), [userId])

  const login = async (identifier: string, password: string) => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    const profile = findProfileByLogin(identifier, password)
    if (!profile) {
      setLoading(false)
      return {
        ok: false,
        error: 'Identifiants incorrects. Vérifiez votre email et votre mot de passe.',
      }
    }
    localStorage.setItem('samagp_session_v1', profile.id)
    setUserId(profile.id)
    setLoading(false)
    return { ok: true, profile }
  }

  const logout = () => {
    clearSession()
    setUserId(null)
  }

  const refresh = () => setUserId((id) => id)

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}