import { Link } from 'react-router-dom'
import { Search, Scale, CalendarCheck, MapPin, ArrowRight } from 'lucide-react'

const STEPS = [
  {
    n: '01',
    icon: <Search size={22} />,
    title: 'Rechercher',
    text: 'Indiquez votre départ, votre destination et le poids du colis dans le moteur de recherche.',
    detail: 'Vous obtenez immédiatement la liste des offres de voyageurs (GP) et de transitaires qui correspondent à votre besoin.',
  },
  {
    n: '02',
    icon: <Scale size={22} />,
    title: 'Comparer',
    text: 'Comparez les offres disponibles : tarif au kg, date de départ, délai de livraison, capacité et évaluations.',
    detail: 'Les filtres vous aident à affiner votre recherche par type de transporteur, budget, destination ou note.',
  },
  {
    n: '03',
    icon: <CalendarCheck size={22} />,
    title: 'Réserver',
    text: 'Choisissez la solution qui vous convient et envoyez votre demande avec les informations de votre colis.',
    detail: 'Le transporteur reçoit votre demande et doit l\'accepter. Vous êtes notifié dès qu\'il répond.',
  },
  {
    n: '04',
    icon: <MapPin size={22} />,
    title: 'Suivre',
    text: 'Suivez l\'évolution de votre colis à chaque étape du voyage, de la remise au transporteur à la livraison.',
    detail: 'Le suivi fonctionne par statut : demande envoyée, acceptée, colis remis, en transit, arrivé, livré.',
  },
]

export default function HowItWorks() {
  return (
    <main>
      <section className="bg-[#0F2450] py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Comment ça marche
          </h1>
          <p className="mt-3 text-slate-300">
            Envoyez un colis entre le Sénégal et l'international en quatre étapes simples.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="space-y-8">
          {STEPS.map((s, i) => (
            <div
              key={s.n}
              className={`grid items-center gap-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 lg:grid-cols-[120px_1fr] ${
                i % 2 === 1 ? 'lg:[direction:rtl]' : ''
              }`}
            >
              <div className="lg:[direction:ltr]">
                <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#1B3A70] text-white">
                  {s.icon}
                </span>
              </div>
              <div className="lg:[direction:ltr]">
                <p className="font-display text-sm font-extrabold tracking-widest text-[#059669]">
                  ÉTAPE {s.n}
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold text-[#0F2450]">{s.title}</h2>
                <p className="mt-2 text-[#64748B]">{s.text}</p>
                <p className="mt-2 rounded-xl bg-[#F8FAFC] p-3 text-sm text-slate-600">{s.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-2xl font-bold text-[#0F2450] sm:text-3xl">
            Prêt à envoyer un colis ?
          </h2>
          <p className="mt-2 text-[#64748B]">
            Recherchez une offre dès maintenant.
          </p>
          <Link to="/rechercher">
            <button className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1B3A70] px-6 py-3.5 font-semibold text-white hover:bg-[#0F2450]">
              Rechercher une offre <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </section>
    </main>
  )
}