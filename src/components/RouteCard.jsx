import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import FavoriteButton from './FavoriteButton'

export default function RouteCard({ route }) {
  const { t } = useTranslation()
  return (
    <Link
      to={`/rutas/${route.id}`}
      className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden border border-gray-100 hover:-translate-y-1 relative"
    >
      {/* Favorite button */}
      <div className="absolute top-3 right-3 z-10">
        <FavoriteButton routeId={route.id} />
      </div>

      {/* Color band */}
      <div className="h-2 w-full" style={{ backgroundColor: route.color }} />

      <div className="p-5">
        {/* Badge + title */}
        <div className="flex items-center gap-3 mb-3 pr-6">
          <span
            className="text-white text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
            style={{ backgroundColor: route.color }}
          >
            {t('routeCard.routeBadge', { id: route.id })}
          </span>
          <h3 className="text-gray-800 font-semibold text-base leading-tight group-hover:text-blue-700 transition-colors">
            {route.name}
          </h3>
        </div>

        <p className="text-gray-500 text-sm line-clamp-2 mb-4">{route.description}</p>

        {/* Meta row */}
        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span>🕒</span> {route.frequency}
          </span>
          <span className="flex items-center gap-1">
            <span>🚏</span> {route.directions.ida.stops.length} {t('routeCard.stopsIda')}
          </span>
          <span className="flex items-center gap-1">
            <span>💰</span> {route.fare}
          </span>
        </div>
      </div>

      <div className="px-5 pb-4">
        <span className="text-blue-600 text-sm font-medium group-hover:underline">
          {t('routeCard.viewDetails')}
        </span>
      </div>
    </Link>
  )
}
