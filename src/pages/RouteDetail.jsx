import { useParams, Link } from 'react-router-dom'
import { lazy, Suspense, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import routes from '../data/routes.json'
import FavoriteButton from '../components/FavoriteButton'
import ShareButton from '../components/ShareButton'
import AlertBanner from '../components/AlertBanner'
import { useHistory } from '../context/HistoryContext'

const MapView = lazy(() => import('../components/MapView'))

export default function RouteDetail() {
  const { id } = useParams()
  const route = routes.find((r) => r.id === id)
  const [direction, setDirection] = useState('ida')
  const { addEntry } = useHistory()
  const { t } = useTranslation()

  useEffect(() => {
    if (route) addEntry(route.id, direction)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route?.id, direction])

  if (!route) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <div className="text-6xl mb-4">🚫</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('routeDetail.notFound')}</h2>
        <p className="text-gray-500 mb-6">{t('routeDetail.notFoundMsg')} <strong>{id}</strong>.</p>
        <Link to="/rutas" className="bg-blue-600 text-white px-6 py-2.5 rounded-full hover:bg-blue-700 transition-colors">
          {t('routeDetail.backToRoutes')}
        </Link>
      </div>
    )
  }

  const dir = route.directions[direction]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back + header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 max-w-6xl mx-auto flex items-center gap-3">
        <Link to="/rutas" className="text-gray-500 hover:text-blue-600 transition-colors text-sm flex items-center gap-1">
          {t('routeDetail.back')}
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-700 font-semibold text-sm">{route.name}</span>
      </div>

      {/* Route-specific alerts */}
      <AlertBanner routeId={route.id} />

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* ── LEFT: details panel ───────────────────── */}
        <aside className="lg:col-span-2 flex flex-col gap-5">
          {/* Title + favorite */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <span className="text-white text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: route.color }}>
                  {t('routeDetail.routeBadge', { id: route.id })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShareButton route={route} className="text-2xl" />
                <FavoriteButton routeId={route.id} className="text-2xl" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-gray-800 mb-2">{route.name}</h1>
            <p className="text-gray-500 text-sm leading-relaxed">{route.description}</p>
          </div>

          {/* Ida / Vuelta tabs */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-2">
              {['ida', 'vuelta'].map((d) => {
                const active = direction === d
                const dDir = route.directions[d]
                return (
                  <button
                    key={d}
                    onClick={() => setDirection(d)}
                    className={`py-3 text-sm font-semibold transition-colors border-b-2 flex items-center justify-center gap-2 ${
                      active
                        ? 'border-current text-white'
                        : 'border-transparent text-gray-500 hover:bg-gray-50'
                    }`}
                    style={active ? { backgroundColor: route.color, borderColor: route.color } : {}}
                  >
                    {d === 'ida' ? '→' : '←'} {dDir.label}
                  </button>
                )
              })}
            </div>

            {/* Direction legend */}
            <div className="px-5 py-3 flex items-center gap-2 text-xs text-gray-500">
              <span className="inline-block w-6 h-1 rounded-full" style={{ backgroundColor: route.color }} />
              <span>{t('routeDetail.activeDirection')}</span>
              <span className="mx-2 text-gray-200">|</span>
              <span
                className="inline-block w-6 rounded-full border-t-2 border-dashed"
                style={{ borderColor: route.color }}
              />
              <span>{t('routeDetail.otherDirection')}</span>
            </div>
          </div>

          {/* Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 grid grid-cols-2 gap-4">
            {[
              { icon: '🕒', label: t('routeDetail.schedule'), value: route.schedule },
              { icon: '🔄', label: t('routeDetail.frequency'), value: route.frequency },
              { icon: '💰', label: t('routeDetail.fare'), value: route.fare },
              { icon: '🚏', label: t('routeDetail.stops'), value: t('routeDetail.stopCount', { count: dir.stops.length }) },
            ].map((item) => (
              <div key={item.label} className="col-span-2 sm:col-span-1 lg:col-span-2">
                <div className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">
                  {item.icon} {item.label}
                </div>
                <div className="text-gray-700 text-sm font-semibold">{item.value}</div>
              </div>
            ))}
          </div>

          {/* Stops list */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wide mb-4">
              {t('routeDetail.stopsSection')} {dir.label}
            </h2>
            <ol className="relative border-l-2 pl-5 space-y-4" style={{ borderColor: route.color }}>
              {dir.stops.map((stop, i) => (
                <li key={i} className="relative">
                  <span
                    className="absolute -left-[1.45rem] top-1 w-3 h-3 rounded-full border-2 border-white"
                    style={{ backgroundColor: route.color }}
                  />
                  <span className={`text-sm ${i === 0 || i === dir.stops.length - 1 ? 'font-bold text-gray-800' : 'text-gray-600'}`}>
                    {stop}
                  </span>
                  {i === 0 && <span className="ml-2 text-xs text-green-600 font-medium">{t('routeDetail.startBadge')}</span>}
                  {i === dir.stops.length - 1 && i !== 0 && (
                    <span className="ml-2 text-xs text-red-500 font-medium">{t('routeDetail.endBadge')}</span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </aside>

        {/* ── RIGHT: map ────────────────────────────── */}
        <main className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" style={{ height: '560px' }}>
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="text-4xl mb-3 animate-pulse">🗺️</div>
                    <p className="text-sm">{t('routeDetail.loadingMap')}</p>
                  </div>
                </div>
              }
            >
              <MapView route={route} direction={direction} />
            </Suspense>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-right">
            {t('routeDetail.mapCredit')} <a href="https://www.openstreetmap.org" className="hover:underline" target="_blank" rel="noreferrer">{t('routeDetail.openStreetMap')}</a>
          </p>
        </main>
      </div>
    </div>
  )
}
