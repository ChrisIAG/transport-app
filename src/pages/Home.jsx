import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Home() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 text-white py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="text-6xl mb-6">🚌</div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            {t('home.heroTitle')}
          </h1>
          <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-xl mx-auto">
            {t('home.heroSubtitle')}
          </p>
          <Link
            to="/rutas"
            className="inline-block bg-white text-blue-700 font-bold text-base px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-100 transition-all duration-200"
          >
            {t('home.heroCta')}
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-12">
            {t('home.featuresTitle')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                icon: '🗺️',
                title: t('home.feature1Title'),
                desc: t('home.feature1Desc'),
              },
              {
                icon: '🚏',
                title: t('home.feature2Title'),
                desc: t('home.feature2Desc'),
              },
              {
                icon: '🕒',
                title: t('home.feature3Title'),
                desc: t('home.feature3Desc'),
              },
            ].map((f) => (
              <article
                key={f.title}
                className="bg-white rounded-2xl p-7 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="text-5xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Stats banner */}
      <section className="bg-blue-700 text-white py-14 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 text-center">
          {[
            { value: t('home.stat1Value'), label: t('home.stat1Label') },
            { value: t('home.stat2Value'), label: t('home.stat2Label') },
            { value: t('home.stat3Value'), label: t('home.stat3Label') },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl md:text-4xl font-extrabold">{s.value}</div>
              <div className="text-blue-200 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA bottom */}
      <section className="py-20 px-6 bg-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            {t('home.ctaTitle')}
          </h2>
          <p className="text-gray-500 mb-8">
            {t('home.ctaSubtitle')}
          </p>
          <Link
            to="/rutas"
            className="inline-block bg-blue-600 text-white font-bold px-8 py-3.5 rounded-full hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-md"
          >
            {t('home.ctaButton')}
          </Link>
        </div>
      </section>

      {/* Donations */}
      <section className="py-16 px-6 bg-green-50 border-t border-green-100 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-5xl mb-4">💚</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            {t('home.donateTitle')}
          </h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            {t('home.donateDesc')}
          </p>
          <a
            href={`https://wa.me/528681971118?text=${encodeURIComponent('Me gustaría donar al proyecto Easy Travels MX')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold px-7 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.134.558 4.136 1.535 5.874L.057 23.396a.75.75 0 0 0 .916.916l5.632-1.476A11.953 11.953 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.896 0-3.67-.52-5.187-1.424l-.37-.22-3.838 1.006 1.022-3.735-.24-.382A9.951 9.951 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            {t('home.donateBtn')}
          </a>
          <p className="text-gray-400 text-xs mt-4">{t('home.donateNote')}</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-sm text-center py-6 px-4">
        <p>{t('home.footer', { year: new Date().getFullYear() })}</p>
      </footer>
    </div>
  )
}
