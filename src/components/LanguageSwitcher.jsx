import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const current = i18n.resolvedLanguage?.startsWith('en') ? 'en' : 'es'

  return (
    <div className="flex items-center text-sm font-medium select-none" aria-label="Language / Idioma">
      <button
        onClick={() => i18n.changeLanguage('es')}
        className={`px-1 transition-opacity ${current === 'es' ? 'font-bold underline underline-offset-2' : 'opacity-50 hover:opacity-100'}`}
        aria-label="Español"
        lang="es"
        aria-pressed={current === 'es'}
      >
        ES
      </button>
      <span className="opacity-30 select-none" aria-hidden="true">|</span>
      <button
        onClick={() => i18n.changeLanguage('en')}
        className={`px-1 transition-opacity ${current === 'en' ? 'font-bold underline underline-offset-2' : 'opacity-50 hover:opacity-100'}`}
        aria-label="English"
        lang="en"
        aria-pressed={current === 'en'}
      >
        EN
      </button>
    </div>
  )
}
