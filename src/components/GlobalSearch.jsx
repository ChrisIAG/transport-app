import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import routes from '../data/routes.json'

export default function GlobalSearch({ onClose }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const inputRef = useRef()
  const { t } = useTranslation()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const results =
    query.trim().length > 1
      ? routes.filter(
          (r) =>
            r.name.toLowerCase().includes(query.toLowerCase()) ||
            r.directions.ida.stops.some((s) => s.toLowerCase().includes(query.toLowerCase())) ||
            r.directions.vuelta.stops.some((s) => s.toLowerCase().includes(query.toLowerCase()))
        )
      : []

  const go = (id) => {
    navigate(`/rutas/${id}`)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-24 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <span className="text-gray-400 text-lg">🔍</span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            className="flex-1 text-base outline-none placeholder-gray-400"
          />
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm">
            ESC
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <ul className="max-h-72 overflow-y-auto divide-y divide-gray-50">
            {results.map((r) => (
              <li key={r.id}>
                <button
                  onClick={() => go(r.id)}
                  className="w-full text-left px-5 py-3 hover:bg-blue-50 flex items-center gap-3 transition-colors"
                >
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: r.color }}
                  />
                  <div>
                    <div className="font-semibold text-sm text-gray-800">{r.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {t('search.outbound')}: {r.directions.ida.stops.length} · {t('search.inbound')}: {r.directions.vuelta.stops.length} {t('search.stops')} · {r.fare}
                    </div>
                  </div>
                  <span className="ml-auto text-xs text-gray-300">→</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {query.trim().length > 1 && results.length === 0 && (
          <p className="px-5 py-6 text-gray-400 text-sm text-center">
            {t('search.noResults', { query })}
          </p>
        )}

        {query.trim().length <= 1 && (
          <p className="px-5 py-4 text-gray-400 text-xs text-center">
            {t('search.hint')}
          </p>
        )}
      </div>
    </div>
  )
}
