import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ChevronDown } from 'lucide-react'

const FAQS: { q: string; a: string }[] = [
  {
    q: 'Comment envoyer un colis avec SAMA GP ?',
    a: 'Rendez-vous sur la page Rechercher, indiquez votre départ, votre destination et le poids de votre colis. Comparez ensuite les offres disponibles, choisissez celle qui vous convient et envoyez votre demande. Le transporteur doit l\'accepter avant la remise du colis.',
  },
  {
    q: 'Comment est calculé le prix d\'une expédition ?',
    a: 'Le tarif est transparent : il est affiché en FCFA par kilogramme. Le prix total est égal au poids de votre colis multiplié par le prix au kg annoncé par le transporteur. Exemple : 5 kg × 3 000 FCFA/kg = 15 000 FCFA.',
  },
  {
    q: 'Qui peut transporter mes colis ?',
    a: 'Deux types de transporteurs : les GP (voyageurs) qui utilisent la capacité disponible de leurs bagages lors de leurs trajets, et les transitaires professionnels qui assurent des lignes régulières par voie aérienne, maritime ou terrestre.',
  },
  {
    q: 'Qu\'est-ce qu\'un profil vérifié ?',
    a: 'Avant de publier un voyage ou une offre, un GP ou un transitaire doit faire vérifier son identité par l\'administration de SAMA GP. La mention « Vérifié » apparaît sur les profils validés.',
  },
  {
    q: 'Quels colis sont autorisés ?',
    a: 'Sont refusés les stupéfiants, les armes, la contrefaçon, les produits dangereux et tout objet interdit par la loi ou la réglementation du transport. Vous devez décrire honnêtement le contenu de votre colis lors de la demande.',
  },
  {
    q: 'Comment suivre mon colis ?',
    a: 'Chaque colis dispose d\'un suivi par statut : demande envoyée, demande acceptée, colis remis au transporteur, en transit, arrivé à destination, livré. Vous êtes notifié à chaque mise à jour depuis la page Mes colis.',
  },
  {
    q: 'Que se passe-t-il si un transporteur refuse ma demande ?',
    a: 'Vous êtes notifié immédiatement. Votre colis n\'a pas encore été remis, vous pouvez donc librement choisir une autre offre et envoyer une nouvelle demande.',
  },
  {
    q: 'Puis-je devenir GP si je voyage souvent ?',
    a: 'Oui. Créez un compte avec le rôle GP / Voyageur, faites vérifier votre profil, puis publiez vos voyages avec votre capacité disponible et votre tarif par kg. Vous recevez vos demandes directement dans votre espace.',
  },
  {
    q: 'Comment devenir transitaire ?',
    a: 'Créez un compte avec le rôle Transitaire. L\'administration vérifie votre statut professionnel (registre de commerce, identité) avant d\'activer votre possibilité de publier des offres.',
  },
  {
    q: 'Le paiement se fait-il sur la plateforme ?',
    a: 'En version 1, la réservation est envoyée et confirmée directement entre l\'expéditeur et le transporteur ; le paiement s\'effectue selon l\'accord convenu entre les deux parties.',
  },
]

export default function Faq() {
  const [query, setQuery] = useState('')
  const filtered = FAQS.filter(
    (f) =>
      f.q.toLowerCase().includes(query.toLowerCase()) ||
      f.a.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <main>
      <section className="bg-[#0F2450] py-16">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Foire aux questions
          </h1>
          <p className="mt-3 text-slate-300">
            Les réponses aux questions les plus fréquentes sur SAMA GP.
          </p>
          <div className="relative mx-auto mt-6 max-w-lg">
            <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une question…"
              aria-label="Rechercher dans la FAQ"
              className="w-full rounded-xl border border-white/15 bg-white/10 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6EE7B7]/40"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center">
            <p className="text-sm text-[#64748B]">Aucune question ne correspond à votre recherche.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((f) => (
              <FaqAccordion key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        )}
        <div className="mt-10 rounded-3xl bg-[#059669] p-6 text-center text-white sm:p-8">
          <h2 className="font-display text-lg font-bold">Une autre question ?</h2>
          <p className="mt-1 text-[#D1FAE5]">Notre équipe vous répond dans les plus brefs délais.</p>
          <Link to="/contact" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-[#047857] hover:bg-slate-100">
            Nous contacter
          </Link>
        </div>
      </section>
    </main>
  )
}

function FaqAccordion({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-slate-800 sm:text-base">{q}</span>
        <ChevronDown size={18} className={`shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="px-5 pb-5 text-sm leading-relaxed text-[#64748B]">{a}</p>}
    </div>
  )
}