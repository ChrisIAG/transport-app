import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ShareButton({ route, className = '' }) {
  const [copied, setCopied] = useState(false)
  const { t } = useTranslation()

  const url = `${window.location.origin}/rutas/${route.id}`
  const text = `🚌 ${route.name} — Easy Travel`

  const share = async () => {
    // Try native Web Share API first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({ title: text, url })
        return
      } catch {
        // User cancelled or not supported — fall through to clipboard
      }
    }
    // Fallback: copy link to clipboard
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Last resort: prompt
      window.prompt(t('shareBtn.fallback'), url)
    }
  }

  return (
    <button
      onClick={share}
      title={copied ? t('shareBtn.copied') : t('shareBtn.share')}
      className={`transition-colors ${className}`}
    >
      {copied ? '✅' : '🔗'}
    </button>
  )
}
