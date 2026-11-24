# SAMA GP

> **Ton colis, notre voyage.**
> Marketplace de transport de colis entre le Sénégal et l'international, qui met en relation des particuliers expéditeurs, des voyageurs (GP) et des transitaires professionnels.

SAMA GP est une application web monopage (SPA) en React + TypeScript. Elle fonctionne sans serveur : toutes les données sont persistées dans le `localStorage` du navigateur via une couche de base de données simulée. Le projet est donc immédiatement exécutable et démontrable, tout en gardant une architecture prête à être branchée sur une API réelle.

---

## Sommaire

- [Présentation](#présentation)
- [Fonctionnalités par rôle](#fonctionnalités-par-rôle)
- [Nouveautés de cette version](#nouveautés-de-cette-version)
- [Stack technique](#stack-technique)
- [Démarrage rapide](#démarrage-rapide)
- [Comptes de démonstration](#comptes-de-démonstration)
- [Persistance des données](#persistance-des-données)
- [Architecture du projet](#architecture-du-projet)
- [Routage](#routage)
- [Modèle de données](#modèle-de-données)
- [Cycle de vie d'une expédition](#cycle-de-vie-dune-expédition)
- [Design system](#design-system)
- [Accessibilité](#accessibilité)
- [SEO et performance](#seo-et-performance)
- [Conventions et scripts](#conventions-et-scripts)
- [Limites connues et pistes d'évolution](#limites-connues-et-pistes-dévolution)
- [Licence](#licence)

---

## Présentation

Le problème résolu : envoyer un colis entre Dakar et l'étranger se fait souvent via des groupes WhatsApp, sans prix clair, sans comparaison et sans suivi. SAMA GP centralise le parcours en quatre étapes :

1. **Rechercher** un trajet et un poids.
2. **Comparer** les offres des GP (voyageurs) et des transitaires.
3. **Réserver** en envoyant une demande au transporteur.
4. **Suivre** l'expédition par statut, de la remise à la livraison.

La plateforme couvre trois populations d'utilisateurs (particuliers, GP, transitaires) plus une administration de modération et de vérification.

---

## Fonctionnalités par rôle

### Visiteur (non connecté)

- Page d'accueil : hero, moteur de recherche, étapes, offres du moment, FAQ, CTA.
- Recherche d'offres publiques avec filtres (type, budget, mode de transport, destination, note minimale).
- Fiche détaillée d'une offre avec informations transporteur et calcul du prix.
- **Suivi public d'un colis par référence** (`/suivi`) sans création de compte.
- Comparaison de 2 à 3 offres côte à côte.
- Pages éditoriales : comment ça marche, devenir GP, devenir transitaire, à propos, FAQ, contact.
- Inscription et connexion.
- **Palette de commandes** (`Ctrl`/`Cmd` + `K`) pour naviguer et chercher instantanément.

### Particulier (expéditeur)

- Tableau de bord personnel (colis en cours, historique, raccourcis).
- Parcours d'expédition en trois écrans : saisie, récapitulatif, confirmation.
- Liste et détail de ses colis avec timeline de suivi.
- Notifications, profil, paramètres.

### GP / Voyageur

- Tableau de bord GP.
- Publication et gestion de voyages (capacité, prix au kg, date, itinéraire).
- Réception, acceptation ou refus des demandes d'expédition.
- Mise à jour du statut des colis à chaque étape.

### Transitaire

- Tableau de bord professionnel.
- Publication et gestion d'offres (aérien, maritime, terrestre) avec délais.
- Gestion des demandes et des expéditions.
- Profil entreprise (raison sociale, NINEA, etc.).

### Administrateur

- Tableau de bord global.
- Gestion des utilisateurs.
- Validation ou refus des demandes de vérification de rôle.
- Supervision des offres, des colis et des signalements.
- Statistiques de la plateforme.

---

## Nouveautés de cette version

- **Suivi public de colis** (`/suivi`) : recherche par référence `SGP-XXXXX`, timeline complète, transporteur, montant, lien vers l'espace personnel si le visiteur est le propriétaire. Les références sont normalisées (`sgp 2481`, `SGP-02481` et `SGP02481` sont équivalents).
- **Palette de commandes globale** (`Ctrl`/`Cmd` + `K`) : navigation rapide vers toutes les pages clés et recherche d'offres en direct, entièrement au clavier et accessible (rôles ARIA, piège de focus, `Échap`).
- **Comparateur d'offres** : sélection de 2 à 3 offres sur la page de recherche, barre de sélection persistante et tableau comparatif (trajet, délai, capacité, prix au kg, estimation, note, action).
- **Améliorations d'accessibilité** : lien d'évitement « Aller au contenu », respect de `prefers-reduced-motion`, focus visible, `aria-live` sur le nombre de résultats, remplacement des liens internes `<a>` par `<Link>` et suppression des boutons imbriqués dans des liens.
- **SEO** : titres de page dynamiques par route, métadonnées Open Graph, `canonical` et données structurées JSON-LD (`Organization` + `WebSite`).
- **Correctif métier** : une offre dont la capacité tombe à zéro passe désormais en statut `inactive` (au lieu de rester active).

---

## Stack technique

| Domaine | Technologie |
| --- | --- |
| UI | React 18.3, React DOM 18.3 |
| Routage | React Router DOM 7.1 |
| Langage | TypeScript 5.6 (mode strict) |
| Build | Vite 6.0 |
| Styles | Tailwind CSS 4.0 via `@tailwindcss/vite` |
| Icônes | lucide-react 0.469 |
| Persistance | `localStorage` (couche DB maison) |
| Typographie | Inter (texte) + Outfit (titres), via Google Fonts |

Aucune dépendance de state management externe : l'état global de la base est géré par un store maison avec abonnement (`subscribe`) et hook React (`useDB`).

---

## Démarrage rapide

Prérequis : Node.js 18+ et npm.

```bash
npm install
npm run dev
```

L'application est disponible sur `http://localhost:5173`.

### Scripts

| Commande | Description |
| --- | --- |
| `npm run dev` | Serveur de développement Vite avec HMR. |
| `npm run build` | Vérification TypeScript puis build de production dans `dist/`. |
| `npm run preview` | Prévisualisation du build de production. |
| `npm run typecheck` | Vérification des types sans émission. |

---

## Comptes de démonstration

Le mot de passe commun à tous les comptes de démonstration est **`samagp2026`**. La connexion accepte l'e-mail ou le téléphone.

| Rôle | Nom | E-mail | Téléphone |
| --- | --- | --- | --- |
| Particulier | Awa Ndiaye | `awa@samagp.sn` | `77 123 45 67` |
| GP / Voyageur | Mamadou Diop | `mamadou@samagp.sn` | `76 555 12 34` |
| GP / Voyageur | Fatou Sow | `fatou@samagp.sn` | `78 220 98 76` |
| GP / Voyageur | Ibrahima Ba | `ibrahima@samagp.sn` | `77 345 56 78` |
| Transitaire | SenTrans Express | `contact@sentrans.sn` | `33 824 45 67` |
| Transitaire (en attente) | Dakar Logistics | `contact@dakarlogistics.sn` | `33 869 22 33` |
| Admin | Mariama Fall | `mariama@samagp.sn` | `77 900 11 22` |

Références de colis de démonstration utilisables sur `/suivi` :

- `SGP-02481` — en transit (Dakar → Paris)
- `SGP-02310` — livré (Dakar → Paris)
- `SGP-01942` — livré (Dakar → Paris)
- `SGP-01720` — livré (Dakar → Milan)

Pour réinitialiser les données de démonstration, utilisez le bouton prévu dans les paramètres (`resetDemoData()`) ou videz les clés `localStorage` listées ci-dessous.

---

## Persistance des données

La couche `src/lib/db.ts` encapsule un objet `DB` sérialisé en JSON.

| Clé | Contenu |
| --- | --- |
| `samagp_db_v1` | Base complète (profils, offres, demandes, expéditions, suivi, notifications, vérifications, signalements). |
| `samagp_session_v1` | Identifiant de l'utilisateur connecté. |
| `samagp_credentials_v1` | Identifiants des comptes créés localement (`id` → mot de passe). |
| `samagp_registration_dossiers_v1` | Dossiers d'inscription GP / transitaire (wizard multi-étapes). |
| `samagp_draft` (sessionStorage) | Brouillon d'expédition en cours. |
| `samagp_confirmation` (sessionStorage) | Référence de la dernière expédition confirmée. |

Le store expose :

- `getDB()` — lecture (avec seed automatique au premier lancement).
- `subscribe(listener)` — abonnement aux mutations.
- `commit(mutator)` — mutation immuable suivie de la persistance et de la notification des abonnés.
- `resetDemoData()` — réinitialisation complète.
- `demoUsers()` — liste des comptes non-admin pour l'écran de connexion.

---

## Architecture du projet

```text
Sama_GP/
├─ index.html                 # Shell HTML, métadonnées SEO, JSON-LD, polices
├─ vite.config.ts             # Plugins React + Tailwind, port 5173
├─ tsconfig*.json             # Configuration TypeScript (strict)
├─ public/
│  └─ favicon.svg             # Marque SAMA GP
└─ src/
   ├─ main.tsx                # Point d'entrée React
   ├─ App.tsx                 # Providers, palette de commandes, table de routage
   ├─ index.css               # Thème Tailwind, tokens, base, reduced-motion
   ├─ hooks.ts                # Hook useDB (abonnement au store)
   ├─ components/
   │  ├─ CommandPalette.tsx   # Palette Ctrl/Cmd+K (navigation + offres)
   │  ├─ OfferCard.tsx        # Carte d'offre (avec sélection comparateur)
   │  ├─ SearchBar.tsx        # Moteur de recherche (départ, arrivée, date, poids)
   │  ├─ TrackingTimeline.tsx # Timeline de suivi par statut
   │  ├─ ProtectedRoute.tsx   # Garde d'accès par rôle
   │  ├─ layout/              # Navbar, Footer, AppLayout, DashboardLayout, Sidebar
   │  ├─ ui/                  # Avatar, Badge, Button, Card, Field, Modal, PageHeader, Skeleton, Stat, States
   │  └─ registration/        # Wizard GP/transitaire (progression, upload, options)
   ├─ context/
   │  ├─ AuthContext.tsx      # Session, connexion, déconnexion
   │  └─ ToastContext.tsx     # Notifications toast
   ├─ lib/
   │  ├─ db.ts                # Couche de persistance et opérations métier
   │  ├─ seed.ts              # Données de démonstration
   │  ├─ types.ts             # Types du domaine
   │  ├─ utils.ts             # Formatage, libellés, validateurs, helpers
   │  ├─ seo.ts               # Titres de page par route
   │  └─ registrationDossier.ts
   └─ pages/                  # 42 pages (public, auth, particulier, GP, transitaire, admin)
```

---

## Routage

Toutes les routes protégées sont enveloppées par `Protected` (`src/components/ProtectedRoute.tsx`), qui redirige les visiteurs non connectés vers `/login` et affiche un état non autorisé si le rôle ne correspond pas.

### Public

| Route | Page |
| --- | --- |
| `/` | Accueil |
| `/rechercher` | Recherche d'offres |
| `/offres/:id` | Détail d'une offre |
| `/suivi` | Suivi public d'un colis |
| `/comment-ca-marche` | Fonctionnement |
| `/devenir-gp` | Devenir GP / Voyageur |
| `/devenir-transitaire` | Devenir transitaire |
| `/a-propos` | À propos |
| `/faq` | FAQ |
| `/contact` | Contact |
| `/login`, `/register`, `/register/particulier`, `/register/gp`, `/register/transitaire` | Authentification et inscription |
| `/forgot-password`, `/reset-password` | Récupération de mot de passe |
| `*` | Page 404 |

### Particulier

| Route | Page |
| --- | --- |
| `/dashboard` | Tableau de bord |
| `/expedition/nouvelle` | Nouvelle expédition |
| `/expedition/recap` | Récapitulatif |
| `/expedition/confirmation` | Confirmation |
| `/colis` | Mes colis |
| `/colis/:id` | Détail d'un colis |

### GP

| Route | Page |
| --- | --- |
| `/gp` | Tableau de bord GP |
| `/gp/voyages` | Mes voyages |
| `/gp/voyages/nouveau` | Publier un voyage |
| `/gp/demandes` | Demandes reçues |

### Transitaire

| Route | Page |
| --- | --- |
| `/transitaire` | Tableau de bord transitaire |
| `/transitaire/offres` | Mes offres |
| `/transitaire/offres/nouveau` | Publier une offre |
| `/transitaire/demandes` | Demandes reçues |
| `/transitaire/expeditions` | Expéditions |

### Compte partagé

| Route | Page |
| --- | --- |
| `/profile` | Profil |
| `/settings` | Paramètres |
| `/notifications` | Notifications |

### Administration

| Route | Page |
| --- | --- |
| `/admin` | Tableau de bord |
| `/admin/utilisateurs` | Utilisateurs |
| `/admin/verifications` | Vérifications |
| `/admin/offres` | Offres |
| `/admin/colis` | Colis |
| `/admin/signalements` | Signalements |
| `/admin/statistiques` | Statistiques |

---

## Modèle de données

Les types sont définis dans `src/lib/types.ts`. La base `DB` (dans `src/lib/seed.ts`) contient huit collections.

### `Profile`

Utilisateur de la plateforme.

```ts
type Role = 'particulier' | 'gp' | 'transitaire' | 'admin'
type VerificationStatus = 'verified' | 'pending' | 'none'

interface Profile {
  id: string
  first_name: string
  last_name: string
  company?: string
  email: string
  phone: string
  role: Role
  city: string
  country: string
  avatar_url: string | null
  verification_status: VerificationStatus
  rating: number
  review_count: number
  bio: string
  created_at: string
}
```

### `Offer`

Offre de transport publiée par un GP ou un transitaire.

```ts
type OfferKind = 'gp' | 'transitaire'
type TransportMode = 'aerien' | 'maritime' | 'terrestre'

interface Offer {
  id: string
  provider_id: string
  provider_kind: OfferKind
  from: string
  to: string
  date: string | null
  capacity: number
  price_per_kg: number
  transport: TransportMode | null
  delivery_days: string | null
  description: string
  status: 'active' | 'inactive'
  created_at: string
}
```

### `ShipmentRequest`

Demande d'expédition envoyée par un particulier à un transporteur.

```ts
type RequestStatus = 'pending' | 'accepted' | 'declined' | 'cancelled'

interface ShipmentRequest {
  id: string
  reference: string          // ex. SGP-02481
  offer_id: string
  sender_id: string
  sender_name: string
  sender_phone: string
  destination: string
  parcel_type: string
  weight: number
  description: string
  total: number
  status: RequestStatus
  created_at: string
}
```

### `Shipment`

Expédition effective, créée à l'acceptation d'une demande.

```ts
type ShipmentStatus =
  | 'demande_envoyee'
  | 'demande_acceptee'
  | 'remis'
  | 'en_transit'
  | 'arrive'
  | 'livre'
  | 'annule'

interface Shipment {
  id: string
  reference: string
  request_id: string
  offer_id: string
  owner_id: string
  provider_id: string
  from: string
  to: string
  weight: number
  total: number
  status: ShipmentStatus
  created_at: string
}
```

### `TrackingEvent`

Événement de suivi rattaché à une expédition.

```ts
interface TrackingEvent {
  id: string
  shipment_id: string
  key: ShipmentStatus
  label: string
  date: string
}
```

### Autres collections

- `Notification` — `user_id`, `title`, `body`, `read`, `created_at`.
- `VerificationRequest` — demande de rôle (`requested_role`), `status` (`pending` | `approved` | `rejected`), note sur les documents.
- `Report` — signalement (`reported_user_id`, `reporter_id`, `reason`, `status`).

### Relations

```text
Profile (provider) 1 ── n Offer
Profile (sender)   1 ── n ShipmentRequest ── 1 Offer
ShipmentRequest    1 ── 1 Shipment
Shipment           1 ── n TrackingEvent
Profile            1 ── n Notification
Profile            1 ── n VerificationRequest
Profile            1 ── n Report
```

---

## Cycle de vie d'une expédition

```text
Demande (pending)
   │  acceptée par le transporteur
   ▼
Demande acceptée (demande_acceptee)
   ▼
Colis remis au transporteur (remis)
   ▼
En transit (en_transit)
   ▼
Arrivé à destination (arrive)
   ▼
Livré (livre)
```

- Une demande peut être **refusée** (`declined`) ou **annulée** (`cancelled`).
- À l'acceptation, une `Shipment` est créée et les deux premiers événements de suivi sont enregistrés.
- Le transporteur (ou l'admin) fait avancer le statut ; chaque étape ajoute un `TrackingEvent` et notifie le propriétaire du colis.
- Le suivi public (`/suivi`) lit ces mêmes événements en lecture seule.

---

## Design system

Les tokens sont déclarés dans `src/index.css` via `@theme` (Tailwind CSS 4).

### Couleurs

| Token | Valeur | Usage |
| --- | --- | --- |
| `--color-primary` | `#1B3A70` | Couleur de marque principale |
| `--color-primary-dark` | `#0F2450` | Fonds sombres, titres |
| `--color-primary-mid` | `#2A50A0` | Accents, focus |
| `--color-success` | `#059669` | Succès, CTA secondaires |
| `--color-success-dark` | `#047857` | Texte sur fond vert clair |
| `--color-success-light` | `#D1FAE5` | Fonds de badges |
| `--color-surface` | `#F8FAFC` | Fond de page |
| `--color-line` | `#E2E8F0` | Bordures |
| `--color-muted` | `#64748B` | Texte secondaire |

### Typographie

- **Inter** pour le texte courant (`--font-sans`).
- **Outfit** pour les titres et les chiffres forts (`--font-display`).

### Animations

- `toast-in`, `modal-in`, `fade-up`, définies dans `@theme` et désactivées automatiquement si l'utilisateur préfère réduire les animations.

### Composants UI réutilisables

`Avatar`, `Badge` (et `VerificationBadge`, `KindBadge`), `Button` (6 variantes, 3 tailles), `Card`, `Field` (`Input`, `Select`, `Textarea`, `FieldWrapper`), `Modal`, `PageHeader`, `Skeleton`, `Stat`, `States` (`EmptyState`, `LoadingState`, `ErrorState`, `UnauthorizedState`).

---

## Accessibilité

- Lien d'évitement « Aller au contenu » en début de page.
- `main` sémantique sur les pages publiques, `aria-label` sur les navigations.
- Focus visible global (`:focus-visible`) avec couleur contrastée.
- Respect de `prefers-reduced-motion` (animations et transitions neutralisées).
- Palette de commandes : `role="dialog"`, `aria-modal`, `role="combobox"`/`listbox`/`option`, navigation clavier complète, piège de focus, restauration du focus à la fermeture.
- Comparateur : boutons `aria-pressed`, libellés explicites, tableau avec en-têtes `scope`.
- Suivi public : formulaire `role="search"`, champs étiquetés, messages d'état explicites.
- Toasts et résultats de recherche annoncés via `aria-live`.

---

## SEO et performance

- Titres de page dynamiques par route (`src/lib/seo.ts`) appliqués par `AppLayout`.
- Métadonnées `description`, Open Graph, `og:site_name`, `og:locale`, `canonical` et `theme-color`.
- Données structurées JSON-LD `Organization` + `WebSite` dans `index.html`.
- Chargement différé des avatars (`loading="lazy"`) et repli par initiales en cas d'échec.
- Code découpé naturellement par le bundler Vite ; build de production minifié.
- Aucune requête réseau métier : l'application reste utilisable hors ligne après chargement (hors polices).

---

## Conventions et scripts

- Composants fonctionnels et hooks React.
- TypeScript strict (`strict: true`), alias de chemins relatifs.
- Noms de fichiers en PascalCase pour les composants et pages, camelCase pour les utilitaires.
- Textes d'interface en français, formats `fr-FR`, montants en FCFA via `money()`.
- Aucune dépendance de state management : préférer `useDB()` + fonctions de `src/lib/db.ts`.
- Avant toute livraison : `npm run typecheck` puis `npm run build`.

---

## Limites connues et pistes d'évolution

- **Pas de backend** : l'authentification et les données sont locales au navigateur. Les mots de passe des comptes créés sont stockés en clair dans `localStorage` à des fins de démonstration uniquement. Une mise en production nécessiterait une API, un hachage des mots de passe et une gestion de session côté serveur.
- **Suivi simulé** : les statuts sont mis à jour manuellement par le transporteur ; pas d'intégration transporteur réelle.
- **Paiement absent** : le montant est calculé et affiché, mais aucune transaction n'est effectuée.
- **Notifications locales** : pas de push ni d'e-mail.
- **Upload de documents** : les fichiers du wizard ne sont pas envoyés à un serveur.
- Pistes : paiement mobile (Wave, Orange Money), messagerie intégrée, avis clients vérifiés, géolocalisation, application mobile, tableau de bord transporteur temps réel.

---

## Licence

Projet privé — tous droits réservés à SAMA GP.
