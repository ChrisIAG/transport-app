import { createContext, useContext, useState, useEffect } from 'react'

const AccessibilityContext = createContext()
const STORAGE_KEY = 'tc_a11y'

function loadPrefs() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') }
  catch { return {} }
}

export function AccessibilityProvider({ children }) {
  const saved = loadPrefs()
  const [highContrast, setHighContrast] = useState(saved.highContrast ?? false)
  const [largeFont, setLargeFont] = useState(saved.largeFont ?? false)

  useEffect(() => {
    document.documentElement.classList.toggle('a11y-hc', highContrast)
    document.documentElement.classList.toggle('a11y-lg', largeFont)
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ highContrast, largeFont }))
  }, [highContrast, largeFont])

  return (
    <AccessibilityContext.Provider value={{ highContrast, setHighContrast, largeFont, setLargeFont }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export const useAccessibility = () => useContext(AccessibilityContext)
