'use client'

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

function lngToX(lng: number, width: number) {
  return ((lng + 180) / 360) * width
}

function latToY(lat: number, height: number) {
  const rad = (lat * Math.PI) / 180
  const mercN = Math.log(Math.tan(Math.PI / 4 + rad / 2))
  return (height / 2) - (height * mercN) / (2 * Math.PI)
}

export default function FanMap() {
  const W = 1200
  const H = 500

  return (
    <div className="relative w-full overflow-hidden" style={{ background: '#0d1117', height: '500px' }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ display: 'block' }}>
        <rect width={W} height={H} fill="#0d1117" />

        {/* Grid */}
        {[-60,-30,0,30,60].map(lat => (
          <line key={lat} x1={0} y1={latToY(lat,H)} x2={W} y2={latToY(lat,H)} stroke="#161b22" strokeWidth="1"/>
        ))}
        {[-120,-60,0,60,120].map(lng => (
          <line key={lng} x1={lngToX(lng,W)} y1={0} x2={lngToX(lng,W)} y2={H} stroke="#161b22" strokeWidth="1"/>
        ))}

        {/* North America */}
        <path d="M 100,80 L 180,70 L 260,85 L 290,110 L 310,150 L 295,200 L 270,240 L 240,265 L 210,275 L 185,260 L 160,240 L 140,210 L 115,185 L 95,155 L 88,125 Z" fill="#1c2433" stroke="#253044" strokeWidth="0.8"/>
        {/* Greenland */}
        <path d="M 220,30 L 270,25 L 295,45 L 285,70 L 255,80 L 225,70 L 210,50 Z" fill="#1c2433" stroke="#253044" strokeWidth="0.8"/>
        {/* South America */}
        <path d="M 210,275 L 270,265 L 305,285 L 320,330 L 315,390 L 295,435 L 265,455 L 235,445 L 215,415 L 200,370 L 195,325 Z" fill="#1c2433" stroke="#253044" strokeWidth="0.8"/>
        {/* Europe */}
        <path d="M 510,75 L 560,65 L 605,72 L 635,85 L 650,110 L 640,140 L 615,158 L 575,165 L 540,158 L 515,140 L 505,115 Z" fill="#1c2433" stroke="#253044" strokeWidth="0.8"/>
        {/* Africa */}
        <path d="M 525,165 L 580,158 L 630,168 L 660,195 L 672,245 L 665,310 L 645,370 L 615,410 L 578,428 L 545,415 L 518,378 L 505,320 L 505,260 L 515,210 Z" fill="#1c2433" stroke="#253044" strokeWidth="0.8"/>
        {/* UK */}
        <path d="M 495,88 L 510,82 L 518,92 L 512,105 L 498,108 L 490,98 Z" fill="#1c2433" stroke="#253044" strokeWidth="0.8"/>
        {/* Russia/Asia north */}
        <path d="M 650,55 L 780,45 L 920,50 L 1020,65 L 1060,90 L 1040,125 L 980,140 L 880,145 L 780,150 L 700,145 L 655,125 L 640,95 Z" fill="#1c2433" stroke="#253044" strokeWidth="0.8"/>
        {/* Asia south */}
        <path d="M 655,125 L 700,145 L 750,160 L 820,170 L 880,165 L 940,175 L 980,200 L 960,230 L 900,245 L 840,240 L 780,255 L 720,248 L 680,225 L 655,195 Z" fill="#1c2433" stroke="#253044" strokeWidth="0.8"/>
        {/* Indian subcontinent */}
        <path d="M 720,175 L 760,170 L 790,185 L 800,215 L 785,250 L 755,268 L 725,255 L 708,225 L 710,195 Z" fill="#1c2433" stroke="#253044" strokeWidth="0.8"/>
        {/* SE Asia */}
        <path d="M 880,165 L 930,160 L 980,170 L 1010,195 L 990,220 L 950,230 L 910,218 L 885,195 Z" fill="#1c2433" stroke="#253044" strokeWidth="0.8"/>
        {/* Japan */}
        <path d="M 1010,110 L 1030,105 L 1045,120 L 1035,140 L 1015,145 L 1000,130 Z" fill="#1c2433" stroke="#253044" strokeWidth="0.8"/>
        {/* Australia */}
        <path d="M 965,320 L 1055,305 L 1120,315 L 1145,355 L 1135,400 L 1095,430 L 1040,440 L 990,425 L 962,390 L 955,355 Z" fill="#1c2433" stroke="#253044" strokeWidth="0.8"/>
        {/* New Zealand */}
        <path d="M 1140,390 L 1155,385 L 1162,400 L 1150,415 L 1135,410 Z" fill="#1c2433" stroke="#253044" strokeWidth="0.8"/>

        {/* Equator */}
        <line x1={0} y1={latToY(0,H)} x2={W} y2={latToY(0,H)} stroke="#1e3a2e" strokeWidth="1" strokeDasharray="6 4"/>

        {/* Fan dots */}
        {fans.map((fan, i) => {
          const x = lngToX(fan.lng, W)
          const y = latToY(fan.lat, H)
          const color = fan.type === 'club' ? '#ffffff' : fan.type === 'bar' ? '#f97316' : '#ef4444'
          const r = fan.type === 'club' ? 7 : 5
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={r+5} fill={color} opacity={0.08}/>
              <circle cx={x} cy={y} r={r+2} fill={color} opacity={0.15}/>
              <circle cx={x} cy={y} r={r} fill={color} opacity={1}/>
              <title>{fan.name} — {fan.count.toLocaleString()} fans</title>
            </g>
          )
        })}
      </svg>

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
