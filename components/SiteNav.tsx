import Link from 'next/link';

type Section = 'home' | 'supporter-groups' | 'club-map' | 'sports-bars';

type ClubInfo = {
  name: string;
  color: string;
  tagline?: string; // e.g. "The Gunners · Est. 1886"
};

const LINKS: { key: Section; label: string; href: string | null }[] = [
  { key: 'supporter-groups', label: 'Supporter Groups', href: '/supporter-groups' },
  { key: 'club-map', label: 'Clubs / Stadiums', href: '/club-map' },
  { key: 'sports-bars', label: 'Sports Bars', href: '/sports-bars' },
];

export default function SiteNav({ active, club }: { active?: Section; club?: ClubInfo }) {
  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '18px 32px',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      position: 'sticky',
      top: 0,
      background: 'rgba(10,10,10,0.95)',
      backdropFilter: 'blur(12px)',
      zIndex: 100,
      flexWrap: 'wrap',
      gap: '12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }} />
          <span style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            The Terrace
          </span>
        </Link>

        {club && (
          <>
            <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.15)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: club.color }} />
              <span style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {club.name}
              </span>
              {club.tagline && (
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic', marginLeft: '4px' }}>
                  · {club.tagline}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
        {LINKS.map(link => {
          const isActive = active === link.key;
          if (!link.href) {
            return (
              <span key={link.key} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.25)', cursor: 'default' }}>
                {link.label} <span style={{ fontSize: '10px', letterSpacing: '0.05em' }}>(soon)</span>
              </span>
            );
          }
          return (
            <Link key={link.key} href={link.href} style={{
              fontSize: '13px',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#EF4444' : 'rgba(255,255,255,0.55)',
              textDecoration: 'none',
            }}>
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}