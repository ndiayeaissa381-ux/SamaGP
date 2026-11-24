import { useState } from 'react'
import { Users, Search } from 'lucide-react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Avatar } from '../components/ui/Avatar'
import { EmptyState } from '../components/ui/States'
import { getDB } from '../lib/db'
import { useDB } from '../hooks'

function roleBadge(role: string) {
  if (role === 'admin') return <Badge tone="dark">Admin</Badge>
  if (role === 'gp') return <Badge tone="blue">GP</Badge>
  if (role === 'transitaire') return <Badge tone="violet">Transitaire</Badge>
  return <Badge tone="green">Particulier</Badge>
}

export default function AdminUtilisateurs() {
  useDB()
  const [query, setQuery] = useState('')
  const db = getDB()

  const filtered = db.profiles.filter((p) => {
    const name = `${p.first_name} ${p.last_name} ${p.company ?? ''} ${p.email} ${p.city}`.toLowerCase()
    return name.includes(query.toLowerCase())
  })

  return (
    <DashboardLayout>
      <div className="pt-6 sm:pt-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#0F2450] sm:text-3xl">Utilisateurs</h1>
            <p className="mt-1.5 text-[#64748B]">{db.profiles.length} comptes sur la plateforme.</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un utilisateur…"
              aria-label="Rechercher un utilisateur"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-[#2A50A0] focus:outline-none focus:ring-2 focus:ring-[#2A50A0]/15"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-8">
            <EmptyState title="Aucun utilisateur" message="Aucun compte ne correspond à votre recherche." icon={<Users size={28} />} />
          </div>
        ) : (
          <Card className="mt-6 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-[#F8FAFC] text-xs uppercase tracking-wide text-[#64748B]">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold">Utilisateur</th>
                    <th className="px-5 py-3.5 font-semibold">Contact</th>
                    <th className="px-5 py-3.5 font-semibold">Rôle</th>
                    <th className="px-5 py-3.5 font-semibold">Ville</th>
                    <th className="px-5 py-3.5 font-semibold">Vérification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/60">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={p.avatar_url}
                            name={`${p.first_name} ${p.last_name}`.trim()}
                            className="h-9 w-9 text-xs"
                          />
                          <div>
                            <p className="font-semibold text-slate-900">
                              {p.company || `${p.first_name} ${p.last_name}`.trim()}
                            </p>
                            <p className="text-xs text-[#64748B]">@{p.id.slice(0, 7)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-slate-800">{p.email}</p>
                        <p className="text-xs text-[#64748B]">{p.phone}</p>
                      </td>
                      <td className="px-5 py-3.5">{roleBadge(p.role)}</td>
                      <td className="px-5 py-3.5 text-slate-700">{p.city}, {p.country}</td>
                      <td className="px-5 py-3.5">
                        {p.verification_status === 'verified' ? (
                          <Badge tone="green">Vérifié</Badge>
                        ) : p.verification_status === 'pending' ? (
                          <Badge tone="amber">En attente</Badge>
                        ) : (
                          <Badge tone="slate">Non vérifié</Badge>
                        )}
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