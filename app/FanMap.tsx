'use client'

import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const fans = [
  { lat: 51.5, lng: -0.1, name: "London", type: "fans", count: 3241 },
  { lat: 40.7, lng: -74.0, name: "New York", type: "club", count: 847 },
  { lat: -23.5, lng: -46.6, name: "São Paulo", type: "fans", count: 1205 },
  { lat: 1.3, lng: 103.8, name: "Singapore", type: "bar", count: 234 },
  { lat: 6.5, lng: 3.4, name: "Lagos", type: "fans", count: 892 },
  { lat: 35.7, lng: 139.7, name: "Tokyo", type: "club", count: 445 },
  { lat: -33.9, lng: 151.2, name: "Sydney", type: "bar", count: 312 },
  { lat: 19.1, lng: 72.9, name: "Mumbai", type: "fans", count: 678 },
  { lat: 25.2, lng: 55.3, name: "Dubai", type: "club", count: 567 },
  { lat: 48.9, lng: 2.4, name: "Paris", type: "bar", count: 189 },
  { lat: 43.7, lng: -79.4, name: "Toronto", type: "club", count: 623 },
  { lat: -1.3, lng: 36.8, name: "Nairobi", type: "fans", count: 334 },
  { lat: 55.8, lng: 37.6, name: "Moscow", type: "fans", count: 234 },
  { lat: 37.6, lng: 127.0, name: "Seoul", type: "fans", count: 445 },
  { lat: 52.4, lng: 4.9, name: "Amsterdam", type: "bar", count: 156 },
  { lat: -26.2, lng: 28.0, name: "Johannesburg", type: "fans", count: 445 },
  { lat: 30.0, lng: 31.2, name: "Cairo", type: "fans", count: 334 },
  { lat: 34.1, lng: -118.2, name: "Los Angeles", type: "club", count: 289 },
  { lat: 41.9, lng: 12.5, name: "Rome", type: "bar", count: 178 },
  { lat: 59.9, lng: 10.7, name: "Oslo", type: "fans", count: 123 },
]

export default function FanMap() {
  return (
    <div className="relative w-full" style={{ background: '#0d1117', height: '500px' }}>
      <ComposableMap
        projectionConfig={{ scale: 147 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#1a2332"
                stroke="#243044"
                strokeWidth={0.5}
              />
            ))
          }
        </Geographies>

        {fans.map((fan, i) => {
          const color = fan.type === 'club' ? '#ffffff' : fan.type === 'bar' ? '#f97316' : '#ef4444'
          const r = fan.type === 'club' ? 6 : 4
          return (
            <Marker key={i} coordinates={[fan.lng, fan.lat]}>
              <circle r={r + 4} fill={color} opacity={0.15} />
              <circle r={r} fill={color} opacity={0.9} />
              <title>{fan.name} — {fan.count.toLocaleString()} fans</title>
            </Marker>
          )
        })}
      </ComposableMap>

      <div className="absolute top-4 left-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 bg-black/80 px-3 py-1.5 rounded-full text-xs text-white">
          <div className="w-2 h-2 rounded-full bg-red-500"></div> Fan communities
        </div>
        <div className="flex items-center gap-2 bg-black/80 px-3 py-1.5 rounded-full text-xs text-white">
          <div className="w-2 h-2 rounded-full bg-white"></div> Supporter clubs
        </div>
        <div className="flex items-center gap-2 bg-black/80 px-3 py-1.5 rounded-full text-xs text-white">
          <div className="w-2 h-2 rounded-full bg-orange-500"></div> Fan bars
        </div>
      </div>

      <div className="absolute bottom-4 right-4 bg-black/80 px-4 py-2 rounded-full text-xs text-white flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
        47,291 fans mapped worldwide
      </div>
    </div>
  )
}