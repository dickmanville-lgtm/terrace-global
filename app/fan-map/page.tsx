'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const FanMap = dynamic(() => import('../../components/FanMap'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%',
      height: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'rgba(255,255,255,0.3)',
      fontSize: '14px',
      letterSpacing: '0.1em',
    }}>
      LOADING MAP
    </div>
  ),
});

export default function FanMapPage() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0a0a', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', bottom: '16px', left: '16px', zIndex: 20 }}>
        <Link href="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '8px 14px',
          fontSize: '13px',
          fontWeight: 500,
          color: 'rgba(255,255,255,0.7)',
          textDecoration: 'none',
        }}>
          ← Home
        </Link>
      </div>
      <FanMap />
    </div>
  );
}