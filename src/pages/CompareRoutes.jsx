import { useState, lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import routes from '../data/routes.json'

const AllRoutesMap = lazy(() => import('../components/AllRoutesMap'))

function InfoPanel({ route, label }) {
  const { t } = useTranslation()
  if (!route) {
    return (
      <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center h-48 text-gray-400 text-sm">
        {t('compare.selectPrefix')} {label}
      </div>
    )
  }
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center gap-3 mb-3">
        <span
          className="text-white text-xs font-bold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: route.color }}
        >
          {t('compare.routeBadge', { id: route.id })}
        </span>
        <h3 className="font-bold text-gray-800">{route.name}</h3>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
        {[
          { icon: '🕒', label: t('compare.schedule'), value: route.schedule },
          { icon: '🔄', label: t('compare.frequency'), value: route.frequency },
          { icon: '💰', label: t('compare.fare'), value: route.fare },
          { icon: '🚏', label: t('compare.stopsIda'), value: route.directions.ida.stops.length },
        ].map((item) => (
          <div key={item.label}>
            <div className="text-xs text-gray-400 uppercase tracking-wide">{item.icon} {item.label}</div>
            <div className="font-semibold text-gray-700">{item.value}</div>
          </div>
        ))}
      </div>
      <div>
        <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">🚏 {t('compare.stops')}</div>
        <ol className="space-y-1">
          {route.directions.ida.stops.map((stop, i) => (
            <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: route.color }}
              />
              {stop}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export default function CompareRoutes() {
  const [idA, setIdA] = useState('')
  const [idB, setIdB] = useState('')
  const { t } = useTranslation()

  const routeA = routes.find((r) => r.id === idA) ?? null
  const routeB = routes.find((r) => r.id === idB) ?? null
  const mapRoutes = [routeA, routeB].filter(Boolean)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-700 text-white py-10 px-6 text-center">
        <h1 className="text-3xl font-bold mb-1">{t('compare.title')}</h1>
        <p className="text-blue-200 text-sm">{t('compare.subtitle')}</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Selectors */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: t('compare.routeA'), value: idA, set: setIdA, other: idB, selectLabel: t('compare.routeA') },
            { label: t('compare.routeB'), value: idB, set: setIdB, other: idA, selectLabel: t('compare.routeB') },
          ].map(({ label, value, set, other }) => (
            <div key={label}>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                {label}
              </label>
              <select
                value={value}
                onChange={(e) => set(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">{t('compare.selectRoute')}</option>
                {routes.map((r) => (
                  <option key={r.id} value={r.id} disabled={r.id === other}>
                    {r.id} – {r.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Map */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" style={{ height: 420 }}>
          {mapRoutes.length > 0 ? (
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400 text-sm animate-pulse">{t('compare.loadingMap')}</span>
                </div>
              }
            >
              <AllRoutesMap routes={mapRoutes} showLocate={false} />
            </Suspense>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <div className="text-4xl mb-2">🗺️</div>
              <p className="text-sm">{t('compare.mapEmpty')}</p>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InfoPanel route={routeA} label={t('compare.routeA')} />
          <InfoPanel route={routeB} label={t('compare.routeB')} />
        </div>
      </div>
    </div>
  )
}
