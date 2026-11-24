const KEY = 'samagp_registration_dossiers_v1'

export interface RegistrationDossier {
  email: string
  role: 'gp' | 'transitaire'
  data: Record<string, unknown>
  created_at: string
}

export function saveDossier(
  email: string,
  role: 'gp' | 'transitaire',
  data: Record<string, unknown>
): void {
  try {
    const store = JSON.parse(localStorage.getItem(KEY) || '{}') as Record<string, RegistrationDossier>
    store[email] = { email, role, data, created_at: new Date().toISOString() }
    localStorage.setItem(KEY, JSON.stringify(store))
  } catch {
    /* storage indisponible : l'inscription reste valide */
  }
}

export function getDossier(email: string): RegistrationDossier | null {
  try {
    const store = JSON.parse(localStorage.getItem(KEY) || '{}') as Record<string, RegistrationDossier>
    return store[email] ?? null
  } catch {
    return null
  }
}