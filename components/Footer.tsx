import Link from 'next/link';

// Extra footer nav links (About, Contact, etc.) — empty for now.
// Once those pages exist, just add them here, e.g.:
// export const FOOTER_LINKS: FooterLink[] = [
//   { label: 'About', href: '/about' },
//   { label: 'Contact', href: '/contact' },
// ];
type FooterLink = { label: string; href: string };
const FOOTER_LINKS: FooterLink[] = [];

// Site social accounts. href: null renders a disabled "soon" state,
// same convention as SiteNav's LINKS array.
type SocialLink = { key: string; label: string; href: string | null };
const SOCIALS: SocialLink[] = [
  { key: 'instagram', label: 'Instagram', href: 'https://instagram.com/theterrace.football' },
  { key: 'x', label: 'X', href: null },
  { key: 'tiktok', label: 'TikTok', href: null },
];

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4l16 16M20 4L4 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16 3c.5 2.2 2 3.7 4 4v3c-1.5 0-2.9-.4-4-1.2V15a6 6 0 1 1-6-6c.3 0 .7 0 1 .1v3.1a3 3 0 1 0 2 2.8V3h3z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const SOCIAL_ICONS: Record<string, () => React.JSX.Element> = {
  instagram: InstagramIcon,
  x: XIcon,
  tiktok: TikTokIcon,
};

export default function Footer({
  showBackLink = true,
  stat,
}: {
  /** Homepage passes false — every other page shows a "back to Terrace" link. */
  showBackLink?: boolean;
  /** e.g. "Supporter Groups · 733+ fan groups", "Arsenal · The Gunners", "Club Map · 60+ grounds" */
  stat?: string;
}) {
  return (
    <footer
      style={{
        padding: '32px 32px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {showBackLink ? (
          <Link
            href="/"
            style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}
          >
            &larr; Back to Terrace.
          </Link>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} />
            <span style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)' }}>
              The Terrace
            </span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {SOCIALS.map((social) => {
            const Icon = SOCIAL_ICONS[social.key];
            if (!social.href) {
              return (
                <span
                  key={social.key}
                  title={`${social.label} (coming soon)`}
                  style={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.25)', cursor: 'default' }}
                >
                  <Icon />
                </span>
              );
            }
            return (
              <a
                key={social.key}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                title={social.label}
                style={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.8)' }}
              >
                <Icon />
              </a>
            );
          })}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
          Terrace.{stat ? ` · ${stat}` : ''}
        </span>

        {FOOTER_LINKS.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}
