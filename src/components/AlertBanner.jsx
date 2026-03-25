import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import alertsData from '../data/alerts.json'

const TYPE_STYLES = {
  info: {
    bg: 'bg-blue-50 border-blue-200',
    text: 'text-blue-800',
    icon: 'ℹ️',
  },
  warning: {
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-800',
    icon: '⚠️',
  },
  danger: {
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-800',
    icon: '🚨',
  },
  success: {
    bg: 'bg-green-50 border-green-200',
    text: 'text-green-800',
    icon: '✅',
  },
}

// Optional: filter to alerts relevant to a specific routeId
export default function AlertBanner({ routeId = null }) {
  const active = alertsData.filter(
    (a) =>
      a.active &&
      (routeId === null || !a.routes?.length || a.routes.includes(routeId))
  )

  const [dismissed, setDismissed] = useState([])
  const { t } = useTranslation()

  const visible = active.filter((a) => !dismissed.includes(a.id))
  if (!visible.length) return null

  return (
    <div className="flex flex-col gap-2 px-4 py-3 max-w-6xl mx-auto">
      {visible.map((alert) => {
        const style = TYPE_STYLES[alert.type] ?? TYPE_STYLES.info
        return (
          <div
            key={alert.id}
            className={`flex items-start gap-3 border rounded-xl px-4 py-3 text-sm ${style.bg} ${style.text}`}
            role="alert"
          >
            <span className="text-base shrink-0 mt-0.5">{style.icon}</span>
            <span className="flex-1 leading-relaxed">{alert.message}</span>
            <button
              onClick={() => setDismissed((d) => [...d, alert.id])}
              aria-label={t('common.closeAlert')}
              className="shrink-0 opacity-50 hover:opacity-100 transition-opacity text-lg leading-none mt-0.5"
            >
              ×
            </button>
          </div>
        )
      })}
    </div>
  )
}
