import { Link } from 'react-router-dom'
import { Package, ShieldCheck, Search, MapPin, Building2 } from 'lucide-react'

export default function About() {
  const values = [
    { icon: <ShieldCheck size={20} />, title: 'La confiance', text: 'Chaque profil est vérifié avant toute activité sur la plateforme. Le contenu des colis est déclaré par l\'expéditeur.' },
    { icon: <Search size={20} />, title: 'La transparence', text: 'Tarifs affichés en FCFA par kilogramme, capacités disponibles et délais annoncés clairement.' },
    { icon: <MapPin size={20} />, title: 'Le lien', text: 'SAMA GP relie ceux qui ont besoin d\'envoyer et ceux qui voyagent, entre le Sénégal et l\'international.' },
  ]

  return (
    <main>
      <section className="bg-[#0F2450] py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
            <Package size={26} className="text-[#D1FAE5]" />
          </span>
          <h1 className="mt-5 font-display text-3xl font-bold text-white sm:text-4xl">
            À propos de SAMA GP
          </h1>
          <p className="mt-4 text-lg text-slate-300">Ton colis, notre voyage.</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-2xl font-bold text-[#0F2450]">
          Une marketplace logistique pensée pour le Sénégal
        </h2>
        <div className="mt-4 space-y-4 leading-relaxed text-slate-600">
          <p>
            Aujourd'hui, pour envoyer un colis vers la France, l'Italie ou une autre ville,
            beaucoup passent par WhatsApp, des groupes de réseaux sociaux, leurs contacts ou
            encore le bouche-à-oreille. Ces solutions fonctionnent, mais elles sont
            fragmentées et difficiles à suivre.
          </p>
          <p>
            <strong>SAMA GP</strong> centralise les offres de transport de colis dans une
            seule plateforme. Les <strong>voyageurs (GP)</strong> publient leur disponibilité
            de bagages, les <strong>transitaires</strong> proposent leurs services, et les{' '}
            <strong>particuliers</strong> trouvent, comparent, réservent et suivent leur colis
            de bout en bout.
          </p>
          <p>
            Chaque parcours suit le même principe simple :
            <strong> rechercher → comparer → réserver → suivre.</strong>
          </p>
        </div>

        <h2 className="mt-12 font-display text-2xl font-bold text-[#0F2450]">Nos valeurs</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl border border-slate-200 bg-white p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF2F8] text-[#1B3A70]">{v.icon}</span>
              <h3 className="mt-3 font-display font-bold text-[#0F2450]">{v.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#64748B]">{v.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-3xl bg-[#059669] p-6 text-center text-white sm:p-8">
          <Building2 size={22} className="mx-auto text-[#D1FAE5]" />
          <h2 className="mt-3 font-display text-xl font-bold">Basé à Dakar, pour l'international</h2>
          <p className="mx-auto mt-2 max-w-lg text-[#D1FAE5]">
            SAMA GP connecte le Sénégal aux destinations internationales grâce à son réseau
            de voyageurs et de transitaires.
          </p>
          <Link to="/rechercher" className="mt-5 inline-block">
            <span className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-[#047857] hover:bg-slate-100">
              Rechercher une offre
            </span>
          </Link>
        </div>
      </section>
    </main>
  )
}