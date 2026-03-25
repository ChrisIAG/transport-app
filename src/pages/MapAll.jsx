import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import routes from '../data/routes.json'

const AllRoutesMap = lazy(() => import('../components/AllRoutesMap'))

export default function MapAll() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 4rem)' }}>
      {/* Header bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="font-bold text-gray-800 text-lg">{t('mapAll.title')}</h1>
          <p className="text-xs text-gray-400">
            {t('mapAll.subtitle')}
          </p>
        </div>
        {/* Legend */}
        <div className="hidden md:flex flex-wrap gap-3">
          {routes.map((r) => (
            <div key={r.id} className="flex items-center gap-1.5 text-xs text-gray-600">
              <span className="w-4 h-1.5 rounded-full inline-block" style={{ backgroundColor: r.color }} />
              {r.name.split('–')[0].trim()}
            </div>
          ))}
        </div>
      </div>

      {/* Map fills remaining height */}
      <div className="flex-1 min-h-0">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-3 animate-pulse">🗺️</div>
                <p className="text-sm">{t('mapAll.loading')}</p>
              </div>
            </div>
          }
        >
          <AllRoutesMap routes={routes} showLocate={true} />
        </Suspense>
      </div>
    </div>
  )
}
