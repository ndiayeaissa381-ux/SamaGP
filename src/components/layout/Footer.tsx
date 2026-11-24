import { Link } from 'react-router-dom'
import { Package, MapPin, Mail, Phone } from 'lucide-react'

const columns: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: 'Plateforme',
    links: [
      { label: 'Rechercher', to: '/rechercher' },
      { label: 'Suivre un colis', to: '/suivi' },
      { label: 'Comment ça marche', to: '/comment-ca-marche' },
      { label: 'Devenir GP', to: '/devenir-gp' },
      { label: 'Devenir transitaire', to: '/devenir-transitaire' },
    ],
  },
  {
    title: 'Entreprise',
    links: [
      { label: 'À propos', to: '/a-propos' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Compte',
    links: [
      { label: 'Connexion', to: '/login' },
      { label: 'Créer un compte', to: '/register' },
      { label: 'Tableau de bord', to: '/dashboard' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#0F2450] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                <Package size={18} className="text-[#D1FAE5]" />
              </span>
              <span className="font-display text-xl font-extrabold tracking-tight">
                SAMA<span className="text-[#34D399]"> GP</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-slate-300">
              Ton colis, notre voyage. Trouvez, comparez et suivez des solutions de
              transport de colis entre le Sénégal et l'international.
            </p>
            <div className="mt-5 space-y-2 text-sm text-slate-300">
              <p className="flex items-center gap-2">
                <MapPin size={15} className="text-[#34D399]" />
                Dakar, Sénégal
              </p>
              <p className="flex items-center gap-2">
                <Mail size={15} className="text-[#34D399]" />
                contact@samagp.sn
              </p>
              <p className="flex items-center gap-2">
                <Phone size={15} className="text-[#34D399]" />
                +221 77 000 00 00
              </p>
            </div>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={`${col.title}`}>
              <h3 className="font-display text-sm font-bold uppercase tracking-wide text-[#D1FAE5]">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.to + l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-slate-300 transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} SAMA GP. Tous droits réservés.</p>
          <p>
            Rechercher → Comparer → Réserver → Suivre
          </p>
        </div>
      </div>
    </footer>
  )
}