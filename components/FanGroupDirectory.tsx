export type FanGroupRow = {
  name: string;
  city: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  url: string;
  description: string | null;
  region: string | null;
  type: string | null;
};

function typeLabel(type: string | null) {
  if (type === 'community') return 'Fan community';
  if (type === 'fan_bar') return 'Fan bar';
  return 'Supporter club';
}

export default function FanGroupDirectory({
  groups,
  clubColor,
}: {
  groups: FanGroupRow[];
  clubColor: string;
}) {
  const regionMap = new Map<string, FanGroupRow[]>();
  for (const g of groups) {
    const region = g.region || 'More worldwide';
    if (!regionMap.has(region)) regionMap.set(region, []);
    regionMap.get(region)!.push(g);
  }
  const regionOrder = Array.from(regionMap.keys()).sort((a, b) => {
    if (a === 'United Kingdom') return -1;
    if (b === 'United Kingdom') return 1;
    if (a === 'More worldwide') return 1;
    if (b === 'More worldwide') return -1;
    return a.localeCompare(b);
  });

  return (
    <>
      {regionOrder.map(region => (
        <div key={region} style={{ marginBottom: '48px' }}>
          <h3 style={{
            fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: clubColor, marginBottom: '16px', paddingBottom: '8px',
            borderBottom: '1px solid rgba(108,171,221,0.2)',
          }}>
            {region}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {regionMap.get(region)!.map(group => (
<a                key={group.name}
                href={group.url}
                target="_blank"
                rel="noopener noreferrer"
                className="tg-fan-card"
                style={{
                  display: 'block', textDecoration: 'none', background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '16px 20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: clubColor, flexShrink: 0 }} />
                      <span style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>{group.name}</span>
                      <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: clubColor, opacity: 0.8 }}>
                        {typeLabel(group.type)}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
                      {group.city ? `${group.city} · ${group.country}` : group.country}
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', flexShrink: 0, paddingTop: '2px' }}>
                    Visit →
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}

      <style>{`
        .tg-fan-card { transition: border-color 0.15s, background 0.15s; }
        .tg-fan-card:hover { border-color: ${clubColor}55; background: rgba(255,255,255,0.05); }
      `}</style>
    </>
  );
}