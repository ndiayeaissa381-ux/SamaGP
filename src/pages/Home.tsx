import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Scale,
  CalendarCheck,
  MapPin,
  ArrowRight,
  PackageCheck,
  ShieldCheck,
  BadgeCheck,
  Star,
  Plane,
  Truck,
  Clock,
  ChevronDown,
  Sparkles,
} from 'lucide-react'
import { useDB } from '../hooks'
import { getPublicOffers } from '../lib/db'
import { OfferCard } from '../components/OfferCard'
import { SearchBar } from '../components/SearchBar'

function StepCard({ n, title, text, icon }: { n: string; title: string; text: string; icon: React.ReactNode }) {
  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <span className="absolute right-5 top-4 font-display text-4xl font-extrabold text-[#E8EEF9]">{n}</span>
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1B3A70] text-white">{icon}</div>
      <h3 className="mt-4 font-display text-lg font-bold text-[#0F2450]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#64748B]">{text}</p>
    </div>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
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

export default function Home() {
  useDB()
  const offers = getPublicOffers().slice(0, 3)

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0F2450]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(900px 420px at 15% -10%, rgba(42,80,160,0.55), transparent 60%), radial-gradient(700px 380px at 90% 110%, rgba(5,150,105,0.28), transparent 60%)',
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="animate-fade-up">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-[#D1FAE5]">
                <Sparkles size={14} />
                Plateforme de transport de colis Sénégal → international
              </p>
              <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                SAMA GP
              </h1>
              <p className="mt-3 font-display text-2xl font-bold text-[#6EE7B7] sm:text-3xl">
                Ton colis, notre voyage.
              </p>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
                Trouvez facilement une solution pour envoyer vos colis grâce à notre
                réseau de voyageurs et de transporteurs.
              </p>
            </div>

            <div className="hidden lg:block" aria-hidden>
              <HeroVisual />
            </div>
          </div>

          <div className="mt-12">
            <SearchBar />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <Link
              to="/suivi"
              className="inline-flex items-center gap-2 font-semibold text-[#6EE7B7] transition-colors hover:text-white"
            >
              <MapPin size={16} />
              Vous attendez un colis ? Suivre un envoi
            </Link>
            <span className="hidden h-4 w-px bg-white/15 sm:block" aria-hidden />
            <Link
              to="/comment-ca-marche"
              className="inline-flex items-center gap-1.5 font-medium text-slate-300 transition-colors hover:text-white"
            >
              Comment ça marche <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4 py-6 sm:justify-between sm:px-6">
          {[
            { icon: <ShieldCheck size={18} className="text-[#047857]" />, label: 'Profilés vérifiés' },
            { icon: <Scale size={18} className="text-[#1B3A70]" />, label: 'Prix transparents au kg' },
            { icon: <CalendarCheck size={18} className="text-[#1B3A70]" />, label: 'Suivi par statut' },
            { icon: <BadgeCheck size={18} className="text-[#1B3A70]" />, label: 'Réserve en quelques clics' },
          ].map((t) => (
            <span key={t.label} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              {t.icon}
              {t.label}
            </span>
          ))}
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-[#059669]">Comment ça marche</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0F2450] sm:text-4xl">
            Votre colis en quatre étapes
          </h2>
          <p className="mt-3 text-[#64748B]">
            Recherchez, comparez, réservez puis suivez votre colis du départ à la livraison.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StepCard
            n="01"
            title="Rechercher"
            text="Indiquez votre départ, votre destination et le poids du colis."
            icon={<Search size={20} />}
          />
          <StepCard
            n="02"
            title="Comparer"
            text="Comparez les offres disponibles des voyageurs et transporteurs."
            icon={<Scale size={20} />}
          />
          <StepCard
            n="03"
            title="Réserver"
            text="Choisissez la solution qui vous convient et envoyez votre demande."
            icon={<CalendarCheck size={20} />}
          />
          <StepCard
            n="04"
            title="Suivre"
            text="Suivez l'évolution de votre colis à chaque étape du voyage."
            icon={<MapPin size={20} />}
          />
        </div>
      </section>

      {/* OFFRES DISPONIBLES */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#059669]">Marketplace</p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0F2450] sm:text-4xl">
                Offres disponibles
              </h2>
              <p className="mt-3 text-[#64748B]">
                Des voyageurs et des transitaires publient leurs disponibilités chaque semaine.
              </p>
            </div>
            <Link
              to="/rechercher"
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[#1B3A70] hover:text-[#0F2450]"
            >
              Voir toutes les offres <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {offers.map((o) => (
              <OfferCard key={o.id} offer={o} />
            ))}
          </div>
        </div>
      </section>

      {/* POURQUOI SAMA GP */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-[#059669]">Pourquoi SAMA GP ?</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0F2450] sm:text-4xl">
            Envoyez avec confiance
          </h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <BadgeCheck size={22} className="text-[#047857]" />,
              title: 'Confiance',
              text: 'Profilés vérifiés par l\'administration avant toute activité sur la plateforme.',
              bg: 'bg-[#D1FAE5]',
            },
            {
              icon: <Scale size={22} className="text-[#1B3A70]" />,
              title: 'Comparaison',
              text: 'Comparez les tarifs, les délais et les avis pour choisir la meilleure option.',
              bg: 'bg-[#E8EEF9]',
            },
            {
              icon: <Clock size={22} className="text-[#1B3A70]" />,
              title: 'Suivi',
              text: 'Le statut de votre colis évolue et vous êtes prévenu à chaque étape.',
              bg: 'bg-[#E8EEF9]',
            },
            {
              icon: <Sparkles size={22} className="text-[#1B3A70]" />,
              title: 'Simplicité',
              text: 'Fini WhatsApp : tout est centralisé, clair et organisé sur une seule plateforme.',
              bg: 'bg-[#E8EEF9]',
            },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${f.bg}`}>{f.icon}</div>
              <h3 className="mt-4 font-display text-lg font-bold text-[#0F2450]">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#64748B]">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DEVENIR GP */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-[#1B3A70] px-6 py-12 sm:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background: 'radial-gradient(600px 300px at 90% 10%, rgba(42,80,160,0.6), transparent 60%), radial-gradient(500px 260px at 5% 100%, rgba(5,150,105,0.35), transparent 60%)',
            }}
          />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#D1FAE5] text-[#047857]">
                <Plane size={22} />
              </div>
              <h2 className="mt-5 font-display text-2xl font-bold text-white sm:text-3xl">Vous voyagez ?</h2>
              <p className="mt-3 max-w-lg text-slate-300">
                Devenez GP et transformez la capacité disponible de vos bagages en revenus
                en transportant des colis lors de vos trajets réguliers.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-slate-200">
                <li className="flex items-center gap-2"><PackageCheck size={16} className="text-[#6EE7B7]" /> Publiez votre voyage en quelques minutes</li>
                <li className="flex items-center gap-2"><BadgeCheck size={16} className="text-[#6EE7B7]" /> Profil vérifié qui inspire confiance</li>
                <li className="flex items-center gap-2"><Star size={16} className="text-[#6EE7B7]" /> Gagnez en réputation à chaque colis livré</li>
              </ul>
              <div className="mt-7">
                <Link
                  to="/devenir-gp"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-[#1B3A70] transition-colors hover:bg-slate-100"
                >
                  Devenir GP <ArrowRight size={16} />
                </Link>
              </div>
            </div>
            <div className="hidden lg:block" aria-hidden>
              <MiniTripCard />
            </div>
          </div>
        </div>
      </section>

      {/* DEVENIR TRANSITAIRE */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-12 sm:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#EEF2F8]/70 to-transparent"
          />
          <div className="relative grid items-center gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="hidden lg:block" aria-hidden>
              <MiniCompanyCard />
            </div>
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#1B3A70] text-white">
                <Truck size={22} />
              </div>
              <h2 className="mt-5 font-display text-2xl font-bold text-[#0F2450] sm:text-3xl">
                Vous êtes transitaire ?
              </h2>
              <p className="mt-3 max-w-lg text-[#64748B]">
                Publiez vos offres de transport aérien, maritime ou terrestre et touchez une
                clientèle plus large qui cherche une solution fiable.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-slate-700">
                <li className="flex items-center gap-2"><BadgeCheck size={16} className="text-[#047857]" /> Statut transitaire officiel et vérifié</li>
                <li className="flex items-center gap-2"><Clock size={16} className="text-[#047857]" /> Gérez vos demandes et expéditions au même endroit</li>
              </ul>
              <div className="mt-7">
                <Link
                  to="/devenir-transitaire"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1B3A70] px-6 py-3.5 font-semibold text-white transition-colors hover:bg-[#0F2450]"
                >
                  Devenir transitaire <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-[#059669]">FAQ</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0F2450]">
            Questions fréquentes
          </h2>
        </div>
        <div className="mt-10 space-y-3">
          <FaqItem
            q="Comment envoyer un colis avec SAMA GP ?"
            a="Recherchez votre trajet et le poids de votre colis, comparez les offres des voyageurs (GP) et des transitaires, choisissez la solution qui vous convient puis envoyez votre demande. Vous suivez ensuite l'évolution de votre colis par statut."
          />
          <FaqItem
            q="Comment est calculé le prix ?"
            a="Le tarif est transparent : il est affiché en FCFA par kilogramme. Le prix total de votre expédition est égal au poids de votre colis multiplié par le prix au kg de l'offre choisie."
          />
          <FaqItem
            q="Qu'est-ce qu'un GP ?"
            a="Un GP (voyageur) est une personne qui voyage et dispose de capacité disponible dans ses bagages pour transporter des colis. Son profil est vérifié par l'administration avant de pouvoir proposer des voyages."
          />
          <FaqItem
            q="Quels colis sont autorisés ?"
            a="Les objets interdits au transport (stupéfiants, armes, contrefaçons, produits dangereux, etc.) ne sont pas acceptés. Décrivez honnêtement le contenu de votre colis lors de votre demande."
          />
          <FaqItem
            q="Comment est suivi mon colis ?"
            a="Chaque colis dispose d'un suivi par statut : demande envoyée, demande acceptée, colis remis au transporteur, en transit, arrivé à destination, livré. Vous êtes notifié à chaque étape."
          />
        </div>
        <p className="mt-8 text-center text-sm text-[#64748B]">
          Une autre question ?
          <Link to="/faq" className="font-semibold text-[#1B3A70] hover:underline">
            Consultez la FAQ complète
          </Link>
        </p>
      </section>

      {/* CTA FINAL */}
      <section className="bg-[#059669] py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Prêt à envoyer votre colis ?
          </h2>
          <p className="mt-3 text-[#D1FAE5]">
            Recherchez une offre dès maintenant et retrouvez une solution en quelques secondes.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/rechercher"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F2450] px-7 py-3.5 font-semibold text-white transition-opacity hover:opacity-90 sm:w-auto"
            >
              <Search size={16} />
              Rechercher une offre
            </Link>
            <Link
              to="/register"
              className="inline-flex w-full items-center justify-center rounded-xl border border-white/40 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

function HeroVisual() {
  return (
    <div className="relative">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <div className="rounded-2xl bg-[#0F2450]/80 p-4">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <MapPin size={13} className="text-[#6EE7B7]" /> Dakar
            </span>
            <Plane size={16} className="text-[#6EE7B7]" />
            <span className="flex items-center gap-1.5">
              <MapPin size={13} className="text-[#6EE7B7]" /> Paris
            </span>
          </div>
          <div className="mt-3 relative h-10">
            <div className="absolute left-0 right-0 top-1/2 h-px bg-white/10" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#059669] p-2 shadow-lg">
              <PackageCheck size={18} className="text-white" />
            </span>
          </div>
          <div className="mt-2 flex items-center justify-center gap-2 text-sm font-semibold text-white">
            5 kg <span className="text-slate-400">·</span> 15 000 FCFA
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white/10 p-3">
            <p className="text-[11px] text-slate-300">Statut</p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-[#6EE7B7]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#6EE7B7]" /> En transit
            </p>
          </div>
          <div className="rounded-xl bg-white/10 p-3">
            <p className="text-[11px] text-slate-300">Transporteur</p>
            <p className="mt-1 text-sm font-semibold text-white">Mamadou D.</p>
          </div>
        </div>
      </div>
      <div
        className="absolute -right-4 -top-4 rounded-2xl border border-white/10 bg-[#0F2450] px-4 py-3 shadow-xl"
        aria-hidden
      >
        <p className="text-[11px] text-slate-400">Profil vérifié</p>
        <p className="inline-flex items-center gap-1 text-sm font-bold text-white">
          <BadgeCheck size={15} className="text-[#6EE7B7]" /> GP · Fatou S.
        </p>
      </div>
    </div>
  )
}

function MiniTripCard() {
  return (
    <div className="rounded-2xl border border-white/15 bg-[#0F2450]/60 p-5">
      <p className="text-xs uppercase tracking-widest text-slate-400">Exemple de voyage</p>
      <p className="mt-2 font-display text-xl font-bold text-white">Dakar → Paris</p>
      <div className="mt-3 space-y-1.5 text-sm text-slate-300">
        <p>18 septembre 2026 · 5 kg disponibles</p>
        <p className="font-semibold text-[#6EE7B7]">3 000 FCFA / kg</p>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
        <BadgeCheck size={14} className="text-[#6EE7B7]" /> 4.8 sur 5 · 14 avis
      </div>
    </div>
  )
}

function MiniCompanyCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs uppercase tracking-widest text-[#64748B]">Offre transitaire</p>
      <p className="mt-2 font-display text-xl font-bold text-[#0F2450]">SenTrans Express</p>
      <div className="mt-3 space-y-1.5 text-sm text-[#64748B]">
        <p className="flex items-center gap-2"><Plane size={14} className="text-[#1B3A70]" /> Aérien · 5–7 jours</p>
        <p className="flex items-center gap-2"><MapPin size={14} className="text-[#1B3A70]" /> Dakar → Paris</p>
        <p className="font-semibold text-[#0F2450]">4 000 FCFA / kg</p>
      </div>
    </div>
  )
}