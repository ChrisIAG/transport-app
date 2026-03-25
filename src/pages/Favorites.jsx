import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useFavorites } from '../context/FavoritesContext'
import routes from '../data/routes.json'
import RouteCard from '../components/RouteCard'

export default function Favorites() {
  const { favorites } = useFavorites()
  const favRoutes = routes.filter((r) => favorites.includes(r.id))
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-700 text-white py-12 px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('favorites.title')}</h1>
        <p className="text-blue-200 text-base">
          {favRoutes.length === 0
            ? t('favorites.noRoutes')
            : t('favorites.savedCount', { count: favRoutes.length })}
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {favRoutes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favRoutes.map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <div className="text-6xl mb-4">🤍</div>
            <p className="text-lg font-semibold text-gray-600 mb-2">{t('favorites.emptyTitle')}</p>
            <p className="text-sm mb-8">
              {t('favorites.emptyHint')}
            </p>
            <Link
              to="/rutas"
              className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
            >
              {t('favorites.viewAll')}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
