import { createContext, useContext, useState, useEffect } from 'react'

const HistoryContext = createContext()

const MAX_ENTRIES = 50
const STORAGE_KEY = 'tc_history'

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  }, [history])

  const addEntry = (routeId, direction) => {
    setHistory((prev) => {
      const entry = { routeId, direction, timestamp: Date.now() }
      const updated = [entry, ...prev]
      return updated.slice(0, MAX_ENTRIES)
    })
  }

  const clearHistory = () => setHistory([])

  // Number of unique routes visited
  const uniqueCount = new Set(history.map((e) => e.routeId)).size

  return (
    <HistoryContext.Provider value={{ history, addEntry, clearHistory, uniqueCount }}>
      {children}
    </HistoryContext.Provider>
  )
}

export const useHistory = () => useContext(HistoryContext)
