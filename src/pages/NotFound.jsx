import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-6">
      <div className="text-7xl mb-6">🚧</div>
      <h1 className="text-5xl font-extrabold text-blue-700 mb-2">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 mb-3">{t('notFound.heading')}</h2>
      <p className="text-gray-500 mb-8 max-w-sm">
        {t('notFound.message')}
      </p>
      <div className="flex gap-4">
        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-blue-700 transition-colors"
        >
          {t('notFound.goHome')}
        </Link>
        <Link
          to="/rutas"
          className="bg-white text-blue-600 border border-blue-300 px-6 py-2.5 rounded-full font-semibold hover:bg-blue-50 transition-colors"
        >
          {t('notFound.viewRoutes')}
        </Link>
      </div>
    </div>
  )
}
