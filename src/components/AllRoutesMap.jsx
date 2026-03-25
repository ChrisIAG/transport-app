import React from 'react'
import L from 'leaflet'
import { useEffect, useState, useMemo } from 'react'
import { MapContainer, TileLayer, Polyline, Tooltip, Popup, Marker, useMap } from 'react-leaflet'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const userIcon = L.divIcon({
  className: '',
  html: `<div style="width:16px;height:16px;background:#2563eb;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,.5);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

function FitAllBounds({ routes }) {
  const map = useMap()
  const all = useMemo(
    () => routes.flatMap((r) => [
      ...r.directions.ida.waypoints,
      ...r.directions.vuelta.waypoints,
    ]),
    [routes]
  )
  useEffect(() => {
    if (all.length) map.fitBounds(all, { padding: [50, 50] })
  }, [map, all])
  return null
}

function FlyToUser({ pos }) {
  const map = useMap()
  useEffect(() => {
    if (pos) map.flyTo(pos, 16, { duration: 1.2 })
  }, [map, pos])
  return null
}

export default function AllRoutesMap({ routes, showLocate = true }) {
  const [userPos, setUserPos] = useState(null)
  const [locating, setLocating] = useState(false)
  const { t } = useTranslation()

  const locate = () => {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserPos([coords.latitude, coords.longitude])
        setLocating(false)
      },
      () => setLocating(false),
      { timeout: 10000 }
    )
  }

  if (!routes.length) return null

  const center = routes[0].directions.ida.waypoints[0] ?? [10.48, -66.9]

  return (
    <div className="relative w-full h-full">
      <MapContainer center={center} zoom={12} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {routes.map((route) => (
          <React.Fragment key={route.id}>
            {/* Vuelta — dashed */}
            <Polyline
              positions={route.directions.vuelta.waypoints}
              pathOptions={{ color: route.color, weight: 4, opacity: 0.55, dashArray: '8 6' }}
              eventHandlers={{
                mouseover: (e) => e.target.setStyle({ weight: 7, opacity: 0.8 }),
                mouseout: (e) => e.target.setStyle({ weight: 4, opacity: 0.55 }),
              }}
            >
              <Tooltip sticky direction="top" offset={[0, -6]}>
                <span className="font-semibold">{route.name}</span>{' '}
                <span className="text-gray-400 text-xs">· {route.directions.vuelta.label}</span>
              </Tooltip>
            </Polyline>

            {/* Ida — solid */}
            <Polyline
              positions={route.directions.ida.waypoints}
              pathOptions={{ color: route.color, weight: 5, opacity: 0.85 }}
              eventHandlers={{
                mouseover: (e) => e.target.setStyle({ weight: 9, opacity: 1 }),
                mouseout: (e) => e.target.setStyle({ weight: 5, opacity: 0.85 }),
              }}
            >
              <Tooltip sticky direction="top" offset={[0, -6]}>
                <span className="font-semibold">{route.name}</span>{' '}
                <span className="text-gray-400 text-xs">· {route.directions.ida.label}</span>
              </Tooltip>
              <Popup>
                <div className="text-center" style={{ minWidth: 160 }}>
                  <span
                    className="text-white text-xs font-bold px-2.5 py-0.5 rounded-full inline-block mb-2"
                    style={{ backgroundColor: route.color }}
                  >
                    {t('map.routeBadge', { id: route.id })}
                  </span>
                  <div className="font-bold text-sm mb-1">{route.name}</div>
                  <div className="text-xs text-gray-500 mb-1">
                    {route.directions.ida.stops.length} {t('map.stopsSuffix')} · {route.fare}
                  </div>
                  <div className="flex gap-1 justify-center text-xs mb-3">
                    <span className="flex items-center gap-1">
                      <span className="inline-block w-3 h-0.5 rounded" style={{ background: route.color }} />
                      {route.directions.ida.label}
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className="flex items-center gap-1">
                      <span className="inline-block w-3 h-0.5 rounded border-dashed border" style={{ borderColor: route.color }} />
                      {route.directions.vuelta.label}
                    </span>
                  </div>
                  <Link
                    to={`/rutas/${route.id}`}
                    className="bg-blue-600 text-white text-xs px-4 py-1.5 rounded-full hover:bg-blue-700 inline-block"
                  >
                    {t('map.viewRoute')}
                  </Link>
                </div>
              </Popup>
            </Polyline>
          </React.Fragment>
        ))}

        {userPos && <FlyToUser pos={userPos} />}

        {userPos && (
          <Marker position={userPos} icon={userIcon}>
            <Popup>
              <span className="font-semibold text-sm">{t('map.here')}</span>
            </Popup>
          </Marker>
        )}

        <FitAllBounds routes={routes} />
      </MapContainer>

      {showLocate && (
        <button
          onClick={locate}
          disabled={locating}
          title={t('map.locateTitle')}
          className="absolute top-14 right-2 z-[400] bg-white shadow border border-gray-300 rounded w-8 h-8 flex items-center justify-center text-sm hover:bg-gray-50 disabled:opacity-60"
        >
          {locating ? '⏳' : '📍'}
        </button>
      )}
    </div>
  )
}
