import { Link } from 'react-router-dom'
import {
  Truck,
  BadgeCheck,
  BarChart3,
  Users,
  ArrowRight,
  Plane,
  Ship,
  Car,
  ShieldCheck,
} from 'lucide-react'

const FEATURES = [
  {
    icon: <BarChart3 size={20} />,
    title: 'Manager vos offres',
    text: 'Publiez et gérez vos offres de transport, avec des tarifs clairs par kilogramme.',
  },
  {
    icon: <Users size={20} />,
    title: 'Une clientèle élargie',
    text: 'SAMA GP centralise des demandeurs qui cherchent aujourd\'hui des solutions sur les réseaux sociaux.',
  },
  {
    icon: <ShieldCheck size={20} />,
    title: 'Statut professionnel',
    text: 'Votre profil transitaire vérifié inspire confiance auprès de vos futurs clients.',
  },
]

const MODES = [
  { icon: <Plane size={18} />, label: 'Aérien', text: '5 à 8 jours' },
  { icon: <Ship size={18} />, label: 'Maritime', text: '15 à 25 jours' },
  { icon: <Car size={18} />, label: 'Terrestre', text: 'Selon itinéraire' },
]

export default function BecomeTransitaire() {
  return (
    <main>
      <section className="bg-[#0F2450] py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#1B3A70]">
              <Truck size={22} />
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
              Devenir transitaire
            </h1>
            <p className="mt-3 text-slate-300">
              Vous êtes un professionnel du transport et de l'expédition ? Publiez vos
              services sur SAMA GP et touchez une clientèle plus large qui cherche une
              solution fiable.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-white">
                <BadgeCheck size={15} className="text-[#6EE7B7]" /> Profil vérifié
              </span>
            </div>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/5 p-6">
            <p className="text-sm font-semibold text-[#D1FAE5]">Modes de transport supportés</p>
            <div className="mt-4 grid gap-3">
              {MODES.map((m) => (
                <div key={m.label} className="flex items-center gap-3 rounded-xl bg-white/10 p-3.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1B3A70] text-white">{m.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-white">{m.label}</p>
                    <p className="text-xs text-slate-400">{m.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-slate-200 bg-white p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF2F8] text-[#1B3A70]">
                {f.icon}
              </span>
              <h3 className="mt-4 font-display font-bold text-[#0F2450]">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#64748B]">{f.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-center font-display text-2xl font-bold text-[#0F2450] sm:text-3xl">
            Comment devenir transitaire
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { n: '01', t: 'Créez votre compte', d: 'Inscrivez-vous et choisissez le rôle Transitaire.' },
              { n: '02', t: 'Vérification par l\'administration', d: 'Vos informations sont vérifiées pour valider votre statut professionnel.' },
              { n: '03', t: 'Publiez vos offres', d: 'Décrivez vos lignes, tarifs, délais et capacités disponibles.' },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border border-slate-200 bg-white p-5">
                <span className="font-display text-3xl font-extrabold text-[#E8EEF9]">{s.n}</span>
                <h3 className="mt-3 font-display font-bold text-[#0F2450]">{s.t}</h3>
                <p className="mt-1.5 text-sm text-[#64748B]">{s.d}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-3xl bg-white px-6 py-8 text-center sm:flex-row sm:text-left sm:px-10">
          <div>
            <h3 className="font-display text-xl font-bold text-[#0F2450]">
              Prêt à publier votre première offre ?
            </h3>
            <p className="mt-1 text-[#64748B]">Rejoignez SAMA GP en quelques minutes.</p>
          </div>
          <Link to="/register/transitaire">
            <button className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#1B3A70] px-5 py-3 font-semibold text-white hover:bg-[#0F2450]">
              Devenir transitaire <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </section>
    </main>
  )
}