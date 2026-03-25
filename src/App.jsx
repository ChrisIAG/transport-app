import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { FavoritesProvider } from './context/FavoritesContext'
import { HistoryProvider } from './context/HistoryContext'
import { AccessibilityProvider } from './context/AccessibilityContext'
import Navbar from './components/Navbar'
import AlertBanner from './components/AlertBanner'
import Home from './pages/Home'
import Routes_ from './pages/Routes'
import RouteDetail from './pages/RouteDetail'
import MapAll from './pages/MapAll'
import Favorites from './pages/Favorites'
import CompareRoutes from './pages/CompareRoutes'
import WhatRoute from './pages/WhatRoute'
import History from './pages/History'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <AccessibilityProvider>
    <HistoryProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <Navbar />
          <AlertBanner />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mapa" element={<MapAll />} />
            <Route path="/rutas" element={<Routes_ />} />
            <Route path="/rutas/:id" element={<RouteDetail />} />
            <Route path="/favoritos" element={<Favorites />} />
            <Route path="/comparar" element={<CompareRoutes />} />
            <Route path="/que-ruta-tomo" element={<WhatRoute />} />
            <Route path="/historial" element={<History />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </FavoritesProvider>
    </HistoryProvider>
    </AccessibilityProvider>
  )
}
