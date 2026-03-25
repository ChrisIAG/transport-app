import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccessibility } from '../context/AccessibilityContext'

export default function AccessibilityToggle() {
  const [open, setOpen] = useState(false)
  const { highContrast, setHighContrast, largeFont, setLargeFont } = useAccessibility()
  const { t } = useTranslation()

  const anyActive = highContrast || largeFont

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t('a11y.label')}
        aria-expanded={open}
        aria-haspopup="dialog"
        title={t('a11y.label')}
        className={`p-2 rounded transition-colors ${anyActive ? 'bg-blue-500' : 'hover:bg-blue-600'}`}
      >
        ♿
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[1000]"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <div
            role="dialog"
            aria-label={t('a11y.label')}
            className="absolute right-0 mt-2 w-60 bg-white text-gray-800 rounded-xl shadow-xl border border-gray-100 p-3 z-[1002] flex flex-col gap-1"
          >
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-1 mb-1">
              {t('a11y.heading')}
            </p>

            {/* High contrast toggle */}
            <label className="flex items-center justify-between gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer select-none">
              <span className="text-sm font-medium flex items-center gap-2">
                <span aria-hidden="true">🔲</span> {t('a11y.highContrast')}
              </span>
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                className="w-4 h-4 accent-blue-600"
                aria-label={t('a11y.highContrastAria')}
              />
            </label>

            {/* Large font toggle */}
            <label className="flex items-center justify-between gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer select-none">
              <span className="text-sm font-medium flex items-center gap-2">
                <span aria-hidden="true">🔤</span> {t('a11y.largeFont')}
              </span>
              <input
                type="checkbox"
                checked={largeFont}
                onChange={(e) => setLargeFont(e.target.checked)}
                className="w-4 h-4 accent-blue-600"
                aria-label={t('a11y.largeFontAria')}
              />
            </label>

            {anyActive && (
              <button
                onClick={() => { setHighContrast(false); setLargeFont(false) }}
                className="mt-1 text-xs text-red-500 hover:text-red-600 text-center py-1"
              >
                {t('a11y.reset')}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
