import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import routes from '../data/routes.json'
import RouteCard from '../components/RouteCard'
import { useFavorites } from '../context/FavoritesContext'

const ALL_ZONES = '__all__'
const zones = [ALL_ZONES, ...new Set(routes.map((r) => r.zone))]

export default function Routes() {
  const [search, setSearch] = useState('')
  const [zone, setZone] = useState(ALL_ZONES)
  const [favFirst, setFavFirst] = useState(false)
  const { isFavorite } = useFavorites()
  const { t } = useTranslation()

  let filtered = routes.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.directions.ida.stops.some((s) => s.toLowerCase().includes(search.toLowerCase())) ||
      r.directions.vuelta.stops.some((s) => s.toLowerCase().includes(search.toLowerCase()))
    const matchZone = zone === ALL_ZONES || r.zone === zone
    return matchSearch && matchZone
  })

  if (favFirst) {
    filtered = [...filtered].sort((a, b) =>
      isFavorite(b.id) - isFavorite(a.id)
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-blue-700 text-white py-12 px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('routes.title')}</h1>
        <p className="text-blue-200 text-base">
          {t('routes.subtitle', { count: routes.length })}
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Search + sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('routes.searchPlaceholder')}
            className="flex-1 bg-white border border-gray-200 rounded-full px-5 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
          />
          <button
            onClick={() => setFavFirst((p) => !p)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
              favFirst
                ? 'bg-red-50 border-red-300 text-red-600'
                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            {t('routes.favFirst')}
          </button>
        </div>

        {/* Zone filter chips */}
        <div className="flex flex-wrap gap-2 mb-7">
          {zones.map((z) => (
            <button
              key={z}
              onClick={() => setZone(z)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                zone === z
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
              }`}
            >
              {z === ALL_ZONES ? t('routes.allZones') : z}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-lg">{t('routes.noResults')}</p>
            <button
              onClick={() => { setSearch(''); setZone(ALL_ZONES) }}
              className="mt-4 text-blue-600 text-sm hover:underline"
            >
              {t('routes.clearFilters')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
