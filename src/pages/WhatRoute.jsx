import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import routes from '../data/routes.json'

// All unique stops across all routes, sorted A-Z
const allStops = [...new Set(routes.flatMap((r) => [
  ...r.directions.ida.stops,
  ...r.directions.vuelta.stops,
]))].sort()

// Returns all stops served by a route (both directions, deduplicated)
function routeStops(route) {
  return new Set([
    ...route.directions.ida.stops,
    ...route.directions.vuelta.stops,
  ])
}

// Find 2-route transfer combinations for origin → destination
function findTransfers(origin, destination) {
  const transfers = []
  const seen = new Set()

  for (const routeA of routes) {
    const stopsA = routeStops(routeA)
    if (!stopsA.has(origin)) continue

    for (const routeB of routes) {
      if (routeB.id === routeA.id) continue
      const stopsB = routeStops(routeB)
      if (!stopsB.has(destination)) continue

      // Avoid showing same pair twice (A+B and B+A) when roles match
      const pairKey = [routeA.id, routeB.id].sort().join('-')
      if (seen.has(pairKey)) continue

      // Find shared stops (transfer points)
      const shared = [...stopsA].filter((s) => stopsB.has(s) && s !== origin && s !== destination)
      if (shared.length === 0) continue

      seen.add(pairKey)
      transfers.push({ routeA, routeB, transferStop: shared[0] })
    }
  }

  return transfers
}

export default function WhatRoute() {
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [searched, setSearched] = useState(false)
  const { t } = useTranslation()

  const results = searched
    ? routes.filter(
        (r) =>
          (r.directions.ida.stops.includes(origin) && r.directions.ida.stops.includes(destination)) ||
          (r.directions.vuelta.stops.includes(origin) && r.directions.vuelta.stops.includes(destination))
      )
    : []

  const handleSearch = (e) => {
    e.preventDefault()
    if (origin && destination && origin !== destination) setSearched(true)
  }

  const reset = () => {
    setOrigin('')
    setDestination('')
    setSearched(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-500 text-white py-14 px-6 text-center">
        <div className="text-4xl mb-4">🧭</div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('whatRoute.title')}</h1>
        <p className="text-blue-100 text-base max-w-md mx-auto">
          {t('whatRoute.subtitle')}
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Form */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8"
        >
          <div className="space-y-5">
            {/* Origin */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                {t('whatRoute.fromLabel')}
              </label>
              <select
                value={origin}
                onChange={(e) => { setOrigin(e.target.value); setSearched(false) }}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">{t('whatRoute.fromPlaceholder')}</option>
                {allStops.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Arrow divider */}
            <div className="flex items-center gap-3 text-gray-300">
              <div className="flex-1 border-t border-dashed border-gray-200" />
              <span className="text-2xl">↓</span>
              <div className="flex-1 border-t border-dashed border-gray-200" />
            </div>

            {/* Destination */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                {t('whatRoute.toLabel')}
              </label>
              <select
                value={destination}
                onChange={(e) => { setDestination(e.target.value); setSearched(false) }}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">{t('whatRoute.toPlaceholder')}</option>
                {allStops
                  .filter((s) => s !== origin)
                  .map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={!origin || !destination || origin === destination}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('whatRoute.search')}
            </button>
          </div>
        </form>

        {/* Results */}
        {searched && (
          <div>
            {results.length > 0 ? (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  {t('whatRoute.results', { count: results.length, origin, destination })}
                </p>
                <div className="space-y-3">
                  {results.map((r) => (
                    <Link
                      key={r.id}
                      to={`/rutas/${r.id}`}
                      className="flex items-center gap-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all group"
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-extrabold text-lg flex-shrink-0"
                        style={{ backgroundColor: r.color }}
                      >
                        {r.id}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800">{r.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {r.frequency} · {r.fare}
                        </div>
                      </div>
                      <span className="text-blue-500 text-sm font-medium group-hover:underline">
                        {t('whatRoute.viewRoute')}
                      </span>
                    </Link>
                  ))}
                </div>
                <button onClick={reset} className="mt-6 text-sm text-blue-500 hover:underline block">
                  {t('whatRoute.newSearch')}
                </button>
              </>
            ) : (
              <div>
                <div className="text-center py-8 text-gray-400">
                  <div className="text-5xl mb-3">😔</div>
                  <p className="font-semibold text-gray-600 mb-1">{t('whatRoute.noDirectRoutes')}</p>
                  <p className="text-sm text-gray-400">
                    {t('whatRoute.noDirectMsg')}
                  </p>
                </div>

                {/* Transfer suggestions */}
                {(() => {
                  const transfers = findTransfers(origin, destination)
                  return transfers.length > 0 ? (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg">🔄</span>
                        <h2 className="font-semibold text-gray-700 text-sm">
                          {t('whatRoute.transfersTitle')}
                        </h2>
                        <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full">
                          {t('whatRoute.transfers', { count: transfers.length })}
                        </span>
                      </div>
                      <div className="space-y-4">
                        {transfers.map(({ routeA, routeB, transferStop }, i) => (
                          <div
                            key={i}
                            className="bg-white rounded-2xl border border-amber-200 shadow-sm p-5"
                          >
                            {/* Step 1 */}
                            <div className="flex items-center gap-3 mb-3">
                              <div
                                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0"
                                style={{ backgroundColor: routeA.color }}
                              >
                                {routeA.id}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-gray-800 truncate">{routeA.name}</div>
                                <div className="text-xs text-gray-400">{t('whatRoute.from')} <strong>{origin}</strong></div>
                              </div>
                              <Link
                                to={`/rutas/${routeA.id}`}
                                className="shrink-0 text-xs border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full hover:bg-gray-50 transition-colors"
                              >
                                {t('whatRoute.viewRouteShort')}
                              </Link>
                            </div>

                            {/* Transfer stop */}
                            <div className="flex items-center gap-2 mb-3 ml-1">
                              <div className="w-7 flex justify-center">
                                <div className="w-0.5 h-5 bg-amber-300" />
                              </div>
                              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5 text-xs text-amber-800 font-medium">
                                <span>🔄</span>
                                <span>{t('whatRoute.transferAt')} <strong>{transferStop}</strong></span>
                              </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex items-center gap-3">
                              <div
                                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0"
                                style={{ backgroundColor: routeB.color }}
                              >
                                {routeB.id}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-gray-800 truncate">{routeB.name}</div>
                                <div className="text-xs text-gray-400">{t('whatRoute.to')} <strong>{destination}</strong></div>
                              </div>
                              <Link
                                to={`/rutas/${routeB.id}`}
                                className="shrink-0 text-xs border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full hover:bg-gray-50 transition-colors"
                              >
                                {t('whatRoute.viewRouteShort')}
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button onClick={reset} className="mt-6 text-sm text-blue-500 hover:underline block">
                        {t('whatRoute.newSearch')}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center mt-2">
                      <button
                        onClick={reset}
                        className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors"
                      >
                        {t('whatRoute.tryAgain')}
                      </button>
                    </div>
                  )
                })()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
