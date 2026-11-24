import { Link } from 'react-router-dom'
import {
  UserRound,
  Plane,
  Building2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Briefcase,
  UserRoundCheck,
} from 'lucide-react'
import { Card } from '../components/ui/Card'

const FLOWS = [
  {
    to: '/register/particulier',
    key: 'particulier',
    icon: <UserRound size={22} />,
    iconClass: 'bg-[#EEF2F8] text-[#1B3A70]',
    chip: 'bg-[#EEF2F8] text-[#1B3A70]',
    title: 'Particulier',
    claim: 'Je souhaite envoyer un colis',
    points: ['Compte simple et rapide', 'Envoyez votre premier colis en quelques minutes', 'Suivez vos envois en temps réel'],
    cta: 'Créer un compte particulier',
    ctaClass:
      'bg-[#1B3A70] text-white hover:bg-[#0F2450] shadow-sm',
    badge: 'Parcours simple',
    badgeIcon: <Sparkles size={13} />,
    delay: '0ms',
  },
  {
    to: '/register/gp',
    key: 'gp',
    icon: <Plane size={22} />,
    iconClass: 'bg-[#D1FAE5] text-[#047857]',
    chip: 'bg-[#D1FAE5] text-[#047857]',
    title: 'GP / Voyageur',
    claim: 'Je voyage et je souhaite transporter des colis',
    points: ['Profil vérifié par l’administration', 'Gagnez un revenu à chaque déplacement', 'Parrainage en 5 étapes guidées'],
    cta: 'Devenir GP',
    ctaClass:
      'bg-white text-[#1B3A70] border border-slate-200 hover:border-[#059669] hover:bg-[#F0FDF9]',
    badge: 'Profil vérifié requis',
    badgeIcon: <ShieldCheck size={13} />,
    delay: '80ms',
  },
  {
    to: '/register/transitaire',
    key: 'transitaire',
    icon: <Building2 size={22} />,
    iconClass: 'bg-violet-50 text-violet-700',
    chip: 'bg-violet-50 text-violet-700',
    title: 'Transitaire',
    claim: 'Je suis un professionnel du transport',
    points: ['Présentez votre entreprise', 'Vérification des documents professionnels', 'Publiez vos offres après validation'],
    cta: 'Devenir transitaire',
    ctaClass:
      'bg-white text-[#1B3A70] border border-slate-200 hover:border-violet-500 hover:bg-violet-50/50',
    badge: 'Parcours entreprise',
    badgeIcon: <Briefcase size={13} />,
    delay: '160ms',
  },
]

export default function Register() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#E8EEF9] px-3.5 py-1 text-xs font-bold uppercase tracking-wide text-[#1B3A70]">
          <UserRoundCheck size={14} />
          SAMA GP — Inscription
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold text-[#0F2450] sm:text-4xl">
          Créer votre compte
        </h1>
        <p className="mt-2.5 text-[#64748B]">
          Comment souhaitez-vous utiliser SAMA GP ? Chaque parcours d’inscription est
          adapté à votre activité.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {FLOWS.map((f) => (
          <Card
            key={f.key}
            className="group animate-fade-up p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/[0.07]"
          >
            <div
              className="animate-fade-up"
              style={{ animationDelay: f.delay }}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${f.iconClass}`}
                >
                  {f.icon}
                </span>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${f.chip}`}>
                  {f.badgeIcon}
                  {f.badge}
                </span>
              </div>
              <h2 className="mt-5 font-display text-xl font-bold text-[#0F2450]">{f.title}</h2>
              <p className="mt-1 text-sm font-medium text-slate-700">{f.claim}</p>
              <ul className="mt-4 space-y-2">
                {f.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-[#64748B]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#059669]" />
                    {p}
                  </li>
                ))}
              </ul>
              <Link
                to={f.to}
                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${f.ctaClass}`}
              >
                {f.cta} <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Card>
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-[#64748B]">
        Déjà inscrit ?{' '}
        <Link to="/login" className="font-semibold text-[#1B3A70] hover:underline">
          Se connecter
        </Link>
      </p>
    </main>
  )
}