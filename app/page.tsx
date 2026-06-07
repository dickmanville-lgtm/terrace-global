'use client';

import dynamic from 'next/dynamic';

const FanMap = dynamic(() => import('../components/FanMap'), {
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

export default function Home() {
  return (
    <main style={{ width: '100vw', height: '100vh', background: '#0a0a0a', overflow: 'hidden' }}>
      <FanMap />
    </main>
  );
}
