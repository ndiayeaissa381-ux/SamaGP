import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { AppLayout } from './components/layout/AppLayout'
import { CommandPalette } from './components/CommandPalette'
import { Protected } from './components/ProtectedRoute'

import Home from './pages/Home'
import SearchPage from './pages/SearchPage'
import OfferDetail from './pages/OfferDetail'
import PublicTracking from './pages/PublicTracking'
import HowItWorks from './pages/HowItWorks'
import BecomeGP from './pages/BecomeGP'
import BecomeTransitaire from './pages/BecomeTransitaire'
import About from './pages/About'
import Faq from './pages/Faq'
import Contact from './pages/Contact'

import Login from './pages/Login'
import RegisterChoice from './pages/RegisterChoice'
import RegisterParticulier from './pages/RegisterParticulier'
import RegisterGP from './pages/RegisterGP'
import RegisterTransitaire from './pages/RegisterTransitaire'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

import ParticulierDashboard from './pages/ParticulierDashboard'
import ExpeditionNouvelle from './pages/ExpeditionNouvelle'
import ExpeditionRecap from './pages/ExpeditionRecap'
import ExpeditionConfirmation from './pages/ExpeditionConfirmation'
import MesColis from './pages/MesColis'
import ColisDetail from './pages/ColisDetail'

import GPDashboard from './pages/GPDashboard'
import GPMesVoyages from './pages/GPMesVoyages'
import GPVoyageNouveau from './pages/GPVoyageNouveau'
import GPDemandes from './pages/GPDemandes'

import TransitaireDashboard from './pages/TransitaireDashboard'
import TransitaireOffres from './pages/TransitaireOffres'
import TransitaireOffreNouveau from './pages/TransitaireOffreNouveau'
import TransitaireDemandes from './pages/TransitaireDemandes'
import TransitaireExpeditions from './pages/TransitaireExpeditions'

import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Notifications from './pages/Notifications'

import AdminDashboard from './pages/AdminDashboard'
import AdminUtilisateurs from './pages/AdminUtilisateurs'
import AdminVerifications from './pages/AdminVerifications'
import AdminOffres from './pages/AdminOffres'
import AdminColis from './pages/AdminColis'
import AdminSignalements from './pages/AdminSignalements'
import AdminStatistiques from './pages/AdminStatistiques'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <CommandPalette />
          <Routes>
            {/* Public */}
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/rechercher" element={<SearchPage />} />
              <Route path="/offres/:id" element={<OfferDetail />} />
              <Route path="/suivi" element={<PublicTracking />} />
              <Route path="/comment-ca-marche" element={<HowItWorks />} />
              <Route path="/devenir-gp" element={<BecomeGP />} />
              <Route path="/devenir-transitaire" element={<BecomeTransitaire />} />
              <Route path="/a-propos" element={<About />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<RegisterChoice />} />
              <Route path="/register/particulier" element={<RegisterParticulier />} />
              <Route path="/register/gp" element={<RegisterGP />} />
              <Route path="/register/transitaire" element={<RegisterTransitaire />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Particulier */}
            <Route
              path="/dashboard"
              element={
                <Protected roles={['particulier']}>
                  <ParticulierDashboard />
                </Protected>
              }
            />
            <Route
              path="/expedition/nouvelle"
              element={
                <Protected roles={['particulier']}>
                  <ExpeditionNouvelle />
                </Protected>
              }
            />
            <Route
              path="/expedition/recap"
              element={
                <Protected roles={['particulier']}>
                  <ExpeditionRecap />
                </Protected>
              }
            />
            <Route
              path="/expedition/confirmation"
              element={
                <Protected roles={['particulier']}>
                  <ExpeditionConfirmation />
                </Protected>
              }
            />
            <Route
              path="/colis"
              element={
                <Protected>
                  <MesColis />
                </Protected>
              }
            />
            <Route
              path="/colis/:id"
              element={
                <Protected>
                  <ColisDetail />
                </Protected>
              }
            />

            {/* GP */}
            <Route
              path="/gp"
              element={
                <Protected roles={['gp']}>
                  <GPDashboard />
                </Protected>
              }
            />
            <Route
              path="/gp/voyages"
              element={
                <Protected roles={['gp']}>
                  <GPMesVoyages />
                </Protected>
              }
            />
            <Route
              path="/gp/voyages/nouveau"
              element={
                <Protected roles={['gp']}>
                  <GPVoyageNouveau />
                </Protected>
              }
            />
            <Route
              path="/gp/demandes"
              element={
                <Protected roles={['gp']}>
                  <GPDemandes />
                </Protected>
              }
            />

            {/* Transitaire */}
            <Route
              path="/transitaire"
              element={
                <Protected roles={['transitaire']}>
                  <TransitaireDashboard />
                </Protected>
              }
            />
            <Route
              path="/transitaire/offres"
              element={
                <Protected roles={['transitaire']}>
                  <TransitaireOffres />
                </Protected>
              }
            />
            <Route
              path="/transitaire/offres/nouveau"
              element={
                <Protected roles={['transitaire']}>
                  <TransitaireOffreNouveau />
                </Protected>
              }
            />
            <Route
              path="/transitaire/demandes"
              element={
                <Protected roles={['transitaire']}>
                  <TransitaireDemandes />
                </Protected>
              }
            />
            <Route
              path="/transitaire/expeditions"
              element={
                <Protected roles={['transitaire']}>
                  <TransitaireExpeditions />
                </Protected>
              }
            />

            {/* Compte partagé */}
            <Route
              path="/profile"
              element={
                <Protected>
                  <Profile />
                </Protected>
              }
            />
            <Route
              path="/settings"
              element={
                <Protected>
                  <Settings />
                </Protected>
              }
            />
            <Route
              path="/notifications"
              element={
                <Protected>
                  <Notifications />
                </Protected>
              }
            />

            {/* Admin */}
            <Route
              path="/admin"
              element={
                <Protected roles={['admin']}>
                  <AdminDashboard />
                </Protected>
              }
            />
            <Route
              path="/admin/utilisateurs"
              element={
                <Protected roles={['admin']}>
                  <AdminUtilisateurs />
                </Protected>
              }
            />
            <Route
              path="/admin/verifications"
              element={
                <Protected roles={['admin']}>
                  <AdminVerifications />
                </Protected>
              }
            />
            <Route
              path="/admin/offres"
              element={
                <Protected roles={['admin']}>
                  <AdminOffres />
                </Protected>
              }
            />
            <Route
              path="/admin/colis"
              element={
                <Protected roles={['admin']}>
                  <AdminColis />
                </Protected>
              }
            />
            <Route
              path="/admin/signalements"
              element={
                <Protected roles={['admin']}>
                  <AdminSignalements />
                </Protected>
              }
            />
            <Route
              path="/admin/statistiques"
              element={
                <Protected roles={['admin']}>
                  <AdminStatistiques />
                </Protected>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}

function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <p className="font-display text-6xl font-extrabold text-[#E8EEF9]">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-[#0F2450]">
        Page introuvable
      </h1>
      <p className="mt-2 text-sm text-[#64748B]">
        La page que vous cherchez n'existe pas ou a été déplacée.
      </p>
      <Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1B3A70] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0F2450]">
        Retour à l'accueil
      </Link>
    </div>
  )
}