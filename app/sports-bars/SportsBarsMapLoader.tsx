'use client';

import dynamic from 'next/dynamic';
import type { SportsBar } from '../../components/SportsBarsMap';

const SportsBarsMap = dynamic(() => import('../../components/SportsBarsMap'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%', height: '100%', background: '#0a0a0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'rgba(255,255,255,0.3)', fontSize: '13px', letterSpacing: '0.1em',
    }}>
      LOADING MAP
    </div>
  ),
});

export default function SportsBarsMapLoader({ bars }: { bars: SportsBar[] }) {
  return <SportsBarsMap bars={bars} />;
}
