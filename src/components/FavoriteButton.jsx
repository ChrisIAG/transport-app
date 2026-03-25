import { useTranslation } from 'react-i18next'
import { useFavorites } from '../context/FavoritesContext'

export default function FavoriteButton({ routeId, className = '' }) {
  const { isFavorite, toggle } = useFavorites()
  const fav = isFavorite(routeId)
  const { t } = useTranslation()

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(routeId)
      }}
      title={fav ? t('favoriteBtn.remove') : t('favoriteBtn.add')}
      aria-label={fav ? t('favoriteBtn.remove') : t('favoriteBtn.add')}
      className={`text-xl leading-none transition-transform hover:scale-125 active:scale-95 ${className}`}
    >
      {fav ? '❤️' : '🤍'}
    </button>
  )
}
