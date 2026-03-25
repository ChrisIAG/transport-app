import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import GlobalSearch from './GlobalSearch'
import { useFavorites } from '../context/FavoritesContext'
import { useHistory } from '../context/HistoryContext'
import AccessibilityToggle from './AccessibilityToggle'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { favorites } = useFavorites()
  const { uniqueCount } = useHistory()
  const { t } = useTranslation()

  const navLinks = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/mapa', label: t('nav.map') },
    { to: '/rutas', label: t('nav.routes') },
    { to: '/que-ruta-tomo', label: t('nav.whatRoute') },
    { to: '/comparar', label: t('nav.compare') },
    { to: '/historial', label: t('nav.history'), badge: uniqueCount || null },
    { to: '/favoritos', label: t('nav.favorites'), badge: favorites.length || null },
  ]

  const linkClass = (isActive) =>
    `hover:text-blue-200 transition-colors pb-0.5 border-b-2 flex items-center gap-1 ${isActive ? 'border-white' : 'border-transparent'}`

  return (
    <>
      <nav className="bg-blue-700 text-white shadow-lg sticky top-0 z-[1001]">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight hover:opacity-90 transition-opacity shrink-0">
            <span className="text-2xl">🚌</span>
            <span>Easy Travels MX</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-5 text-sm font-medium">
            {navLinks.map(({ to, label, end, badge }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => linkClass(isActive)}
              >
                {label}
                {badge ? (
                  <span className="bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {badge}
                  </span>
                ) : null}
              </NavLink>
            ))}
          </div>

          {/* Search + hamburger */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <AccessibilityToggle />
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded hover:bg-blue-600 transition-colors"
              title={t('nav.searchTooltip')}
              aria-label={t('nav.openSearch')}
            >
              🔍
            </button>
            <button
              className="lg:hidden flex flex-col gap-1.5 p-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={t('nav.openMenu')}
            >
              <span className={`block w-6 h-0.5 bg-white transition-transform duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-0.5 bg-white transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-white transition-transform duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-blue-800 px-4 pb-4 flex flex-col gap-1 text-sm font-medium">
            {navLinks.map(({ to, label, end, badge }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `py-2.5 border-b border-blue-700 last:border-0 flex items-center justify-between ${isActive ? 'text-blue-200' : 'hover:text-blue-200'}`
                }
              >
                <span>{label}</span>
                {badge ? (
                  <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {badge}
                  </span>
                ) : null}
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      {searchOpen && <GlobalSearch onClose={() => setSearchOpen(false)} />}
    </>
  )
}
