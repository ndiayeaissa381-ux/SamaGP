import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { SITE_NAME, titleForPath } from '../../lib/seo'

export function AppLayout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0 })
    document.title = `${titleForPath(pathname)} · ${SITE_NAME}`
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[#1B3A70] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Aller au contenu
      </a>
      <Navbar />
      <div id="contenu" tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
