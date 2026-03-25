import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useEffect, useRef, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function stopIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="width:14px;height:14px;background:${color};border:2px solid white;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.4);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10],
  })
}

function busIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="background:${color};border:2px solid white;border-radius:6px;width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-size:15px;box-shadow:0 2px 8px rgba(0,0,0,.4);">🚌</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  })
}

const userIcon = L.divIcon({
  className: '',
  html: `<div style="width:16px;height:16px;background:#2563eb;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,.5);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

const SPEEDS = { slow: 1200, normal: 600, fast: 250 }

function FitBounds({ waypoints }) {
  const map = useMap()
  useEffect(() => {
    if (waypoints && waypoints.length > 0) {
      map.fitBounds(waypoints, { padding: [40, 40] })
    }
  }, [map, waypoints])
  return null
}

// Interpolate a point between two lat/lon pairs (t in [0,1])
function lerp(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
}

// Animated bus marker that travels along `waypoints`
function AnimatedBus({ waypoints, color, speed }) {
  const [pos, setPos] = useState(waypoints[0])
  const segRef = useRef(0)
  const tRef = useRef(0)
  const rafRef = useRef(null)
  const lastRef = useRef(null)

  useEffect(() => {
    segRef.current = 0
    tRef.current = 0
    setPos(waypoints[0])

    const step = (ts) => {
      if (lastRef.current == null) lastRef.current = ts
      const dt = ts - lastRef.current
      lastRef.current = ts

      const totalSegs = waypoints.length - 1
      if (totalSegs < 1) return

      tRef.current += dt / speed
      if (tRef.current >= 1) {
        tRef.current = 0
        segRef.current = (segRef.current + 1) % totalSegs
      }

      const seg = segRef.current
      setPos(lerp(waypoints[seg], waypoints[seg + 1], tRef.current))
      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(rafRef.current)
      lastRef.current = null
    }
  }, [waypoints, speed])

  return (
    <Marker position={pos} icon={busIcon(color)} zIndexOffset={1000} />
  )
}

function FlyToUser({ pos }) {
  const map = useMap()
  useEffect(() => {
    if (pos) map.flyTo(pos, 16, { duration: 1.2 })
  }, [map, pos])
  return null
}

export default function MapView({ route, direction = 'ida' }) {
  const [userPos, setUserPos] = useState(null)
  const [locating, setLocating] = useState(false)
  const [animating, setAnimating] = useState(false)
  const { t } = useTranslation()

  const dir = route.directions[direction]
  const otherDir = direction === 'ida' ? route.directions.vuelta : route.directions.ida
  const allWaypoints = useMemo(
    () => [...dir.waypoints, ...otherDir.waypoints],
    [dir.waypoints, otherDir.waypoints]
  )
  const total = dir.stops.length

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

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={dir.waypoints[0] ?? [10.48, -66.9]}
        zoom={13}
        className="w-full h-full rounded-xl z-0"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Other direction — dashed */}
        <Polyline
          positions={otherDir.waypoints}
          pathOptions={{ color: route.color, weight: 4, opacity: 0.5, dashArray: '8 6' }}
        />

        {/* Active direction — solid */}
        <Polyline
          positions={dir.waypoints}
          pathOptions={{ color: route.color, weight: 5, opacity: 0.9 }}
        />

        {/* Stop markers for active direction */}
        {dir.waypoints.map((pos, i) => {
          const stopName = dir.stops[i] ?? `Parada ${i + 1}`
          const isFirst = i === 0
          const isLast = i === total - 1
          return (
            <Marker key={i} position={pos} icon={stopIcon(route.color)}>
              <Popup>
                <div style={{ minWidth: 160 }}>
                  <div className="font-bold text-sm mb-1">{stopName}</div>
                  <div className="text-xs text-gray-500 mb-1.5">
                    {t('mapView.stopCounter', { n: i + 1, total })} · {dir.label}
                  </div>
                  {isFirst && (
                    <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full mr-1">
                      {t('mapView.startBadge')}
                    </span>
                  )}
                  {isLast && !isFirst && (
                    <span className="inline-block bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                      {t('mapView.endBadge')}
                    </span>
                  )}
                  <div className="mt-2 text-xs text-gray-400">{route.name}</div>
                </div>
              </Popup>
            </Marker>
          )
        })}

        {/* Animated bus */}
        {animating && (
          <AnimatedBus
            waypoints={dir.waypoints}
            color={route.color}
            speed={SPEEDS.slow}
          />
        )}

        {userPos && <FlyToUser pos={userPos} />}

        {userPos && (
          <Marker position={userPos} icon={userIcon}>
            <Popup><span className="font-semibold text-sm">{t('map.here')}</span></Popup>
          </Marker>
        )}

        <FitBounds waypoints={allWaypoints} />
      </MapContainer>

      {/* Controls */}
      <div className="absolute top-2 right-2 z-[400] flex flex-col gap-1">
        {/* Geolocate */}
        <button
          onClick={locate}
          disabled={locating}
          title={t('map.locateTitle')}
          className="bg-white shadow border border-gray-300 rounded w-8 h-8 flex items-center justify-center text-sm hover:bg-gray-50 disabled:opacity-60"
        >
          {locating ? '⏳' : '📍'}
        </button>

        {/* Animate toggle */}
        <button
          onClick={() => setAnimating((a) => !a)}
          title={animating ? t('mapView.hideBus') : t('mapView.showBus')}
          className={`shadow border rounded w-8 h-8 flex items-center justify-content text-base transition-colors ${
            animating
              ? 'bg-blue-600 border-blue-600'
              : 'bg-white border-gray-300 hover:bg-gray-50'
          }`}
        >
          🚌
        </button>
      </div>
    </div>
  )
}
