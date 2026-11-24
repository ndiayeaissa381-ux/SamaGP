import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, MapPin } from 'lucide-react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { Card } from '../components/ui/Card'
import { Field, Input, Textarea } from '../components/ui/Field'
import { Button } from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { updateProfile } from '../lib/db'
import { useToast } from '../context/ToastContext'
import { useDB } from '../hooks'

export default function Settings() {
  const { user, refresh, logout } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  useDB()

  const [first_name, setFirstname] = useState(user?.first_name ?? '')
  const [last_name, setLastname] = useState(user?.last_name ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [city, setCity] = useState(user?.city ?? '')
  const [country, setCountry] = useState(user?.country ?? '')
  const [bio, setBio] = useState(user?.bio ?? '')
  const [saving, setSaving] = useState(false)

  if (!user) return null

  const save = () => {
    setSaving(true)
    setTimeout(() => {
      updateProfile(user.id, {
        first_name: first_name.trim() || user.first_name,
        last_name: last_name.trim() || user.last_name,
        phone: phone.trim() || user.phone,
        city: city.trim() || user.city,
        country: country.trim() || user.country,
        bio: bio.trim(),
      })
      refresh()
      setSaving(false)
      toast('Votre profil a été mis à jour.')
    }, 500)
  }

  const handleLogout = () => {
    logout()
    toast('Vous avez été déconnecté.', 'info')
    navigate('/')
  }

  return (
    <DashboardLayout>
      <div className="pt-6 sm:pt-0">
        <h1 className="font-display text-2xl font-bold text-[#0F2450] sm:text-3xl">Paramètres</h1>
        <p className="mt-1.5 text-[#64748B]">Modifiez vos informations personnelles.</p>

        <div className="mt-6 max-w-3xl space-y-6">
          <Card className="p-6 sm:p-8">
            <h2 className="font-display font-bold text-[#0F2450]">Informations personnelles</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="Prénom">
                <Input value={first_name} onChange={(e) => setFirstname(e.target.value)} />
              </Field>
              <Field label="Nom">
                <Input value={last_name} onChange={(e) => setLastname(e.target.value)} />
              </Field>
              <Field label="Téléphone">
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Ville">
                  <div className="relative">
                    <MapPin size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#2A50A0]" />
                    <Input className="pl-8" value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>
                </Field>
                <Field label="Pays">
                  <Input value={country} onChange={(e) => setCountry(e.target.value)} />
                </Field>
              </div>
            </div>
            <div className="mt-5">
              <Field label="Bio" hint="Visible sur votre profil public.">
                <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Présentez-vous en quelques mots…" />
              </Field>
            </div>
            <Button className="mt-6" loading={saving} onClick={save}>
              Enregistrer les modifications
            </Button>
          </Card>

          <Card className="p-6 sm:p-8">
            <h2 className="font-display font-bold text-[#0F2450]">Compte</h2>
            <p className="mt-2 text-sm text-[#64748B]">
              Votre email et votre type de compte ({roleLabel(user.role)}) ne peuvent pas être
              modifiés depuis les paramètres pour des raisons de sécurité.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[#64748B]">Déconnexion de votre session actuelle.</p>
              <Button variant="secondary" onClick={handleLogout}>
                <LogOut size={16} /> Se déconnecter
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

function roleLabel(role: string): string {
  return role === 'gp' ? 'GP / Voyageur' : role === 'transitaire' ? 'Transitaire' : role === 'admin' ? 'Admin' : 'Particulier'
}