import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useHistory } from '../context/HistoryContext'
import routes from '../data/routes.json'

function timeAgo(t, timestamp) {
  const diff = Date.now() - timestamp
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return t('history.timeNow')
  if (mins < 60) return t('history.timeMin', { count: mins })
  if (hours < 24) return t('history.timeHour', { count: hours })
  if (days === 1) return t('history.timeYesterday')
  return t('history.timeDay', { count: days })
}

export default function History() {
  const { history, clearHistory } = useHistory()
  const { t } = useTranslation()

  const routeMap = Object.fromEntries(routes.map((r) => [r.id, r]))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 max-w-3xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="font-bold text-gray-800 text-lg">{t('history.title')}</h1>
          <p className="text-xs text-gray-400 mt-0.5">{t('history.subtitle')}</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm(t('history.confirmClear'))) clearHistory()
            }}
            className="text-xs text-red-500 hover:text-red-600 border border-red-200 hover:border-red-400 rounded-full px-3 py-1.5 transition-colors"
          >
            {t('history.clear')}
          </button>
        )}
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {history.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🕐</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">{t('history.emptyTitle')}</h2>
            <p className="text-gray-400 text-sm mb-6">
              {t('history.emptyMsg')}
            </p>
            <Link
              to="/rutas"
              className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm hover:bg-blue-700 transition-colors"
            >
              {t('history.explore')}
            </Link>
          </div>
        ) : (
          <ol className="flex flex-col gap-3">
            {history.map((entry, i) => {
              const route = routeMap[entry.routeId]
              if (!route) return null
              return (
                <li
                  key={i}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-4"
                >
                  {/* Color dot */}
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: route.color }}
                  />

                  {/* Route info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-white text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
                        style={{ backgroundColor: route.color }}
                      >
                      {t('history.routeBadge', { id: route.id })}
                      </span>
                      <span className="text-gray-800 text-sm font-medium truncate">
                        {route.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
                      <span>
                        {entry.direction === 'ida'
                          ? route.directions.ida.label
                          : route.directions.vuelta.label}
                      </span>
                      <span>·</span>
                      <span>{timeAgo(t, entry.timestamp)}</span>
                    </div>
                  </div>

                  {/* Link */}
                  <Link
                    to={`/rutas/${route.id}`}
                    className="shrink-0 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    {t('history.view')}
                  </Link>
                </li>
              )
            })}
          </ol>
        )}
      </div>
    </div>
  )
}
