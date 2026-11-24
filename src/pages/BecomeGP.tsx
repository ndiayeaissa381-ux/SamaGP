import { Link } from 'react-router-dom'
import {
  Plane,
  BadgeCheck,
  Star,
  Wallet,
  ArrowRight,
  ShieldCheck,
  CalendarCheck,
} from 'lucide-react'

const BENEFITS = [
  {
    icon: <Wallet size={20} />,
    title: 'Gagnez à chaque voyage',
    text: 'Votre capacité de bagages inutilisée devient une source de revenus sur vos trajets réguliers.',
  },
  {
    icon: <Star size={20} />,
    title: 'Construisez votre réputation',
    text: 'Chaque colis livré renforce votre profil et vos évaluations visibles des expéditeurs.',
  },
  {
    icon: <ShieldCheck size={20} />,
    title: 'Transportez en toute confiance',
    text: 'Toutes les demandes décrivent le contenu du colis. Vous décidez avant d\'accepter.',
  },
]

const STEPS = [
  { n: '01', title: 'Créez votre compte', text: 'Inscrivez-vous et choisissez le rôle GP / Voyageur.' },
  { n: '02', title: 'Faites vérifier votre profil', text: 'L\'administration valide votre identité avant publication.' },
  { n: '03', title: 'Publiez vos voyages', text: 'Indiquez votre trajet, votre date et votre capacité disponible.' },
  { n: '04', title: 'Acceptez les demandes', text: 'Choisissez les colis que vous souhaitez transporter.' },
]

export default function BecomeGP() {
  return (
    <main>
      <section className="bg-[#0F2450] py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#D1FAE5] text-[#047857]">
              <Plane size={22} />
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
              Devenir GP / Voyageur
            </h1>
            <p className="mt-3 text-slate-300">
              Vous voyagez régulièrement entre le Sénégal et une autre ville ? Transportez
              des colis lors de vos trajets et gagnez un revenu complémentaire.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-white">
                <BadgeCheck size={15} className="text-[#6EE7B7]" /> Profil vérifié
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-white">
                <Star size={15} className="text-[#6EE7B7]" /> Rémunération par kg
              </span>
            </div>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/5 p-6">
            <p className="text-sm font-semibold text-[#D1FAE5]">Exemple de gains</p>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p className="flex justify-between border-b border-white/10 pb-3">
                <span>Capacité transportée</span><span className="font-bold text-white">15 kg</span>
              </p>
              <p className="flex justify-between border-b border-white/10 pb-3">
                <span>Tarif pratiqué</span><span className="font-bold text-white">3 000 FCFA / kg</span>
              </p>
              <p className="flex justify-between text-[#6EE7B7] font-display font-bold">
                <span>Revenu par voyage</span><span>45 000 FCFA</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center font-display text-2xl font-bold text-[#0F2450] sm:text-3xl">
          Comment devenir GP
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-2xl border border-slate-200 bg-white p-5">
              <span className="font-display text-3xl font-extrabold text-[#E8EEF9]">{s.n}</span>
              <h3 className="mt-3 font-display font-bold text-[#0F2450]">{s.title}</h3>
              <p className="mt-1.5 text-sm text-[#64748B]">{s.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {BENEFITS.map((b) => (
            <div key={b.title} className="rounded-2xl border border-slate-200 bg-white p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF2F8] text-[#1B3A70]">
                {b.icon}
              </span>
              <h3 className="mt-4 font-display font-bold text-[#0F2450]">{b.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#64748B]">{b.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-between gap-4 rounded-3xl bg-[#059669] px-6 py-8 text-white sm:px-10">
          <div>
            <h3 className="font-display text-xl font-bold">Prêt à publier votre premier voyage ?</h3>
            <p className="mt-1 text-[#D1FAE5]">Création de profil en quelques minutes.</p>
          </div>
          <Link to="/register/gp">
            <button className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-[#047857] hover:bg-slate-100">
              Devenir GP <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </section>
    </main>
  )
}