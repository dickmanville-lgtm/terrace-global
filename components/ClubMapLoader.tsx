'use client';

import dynamic from 'next/dynamic';

const ClubMap = dynamic(() => import('./ClubMap'), {
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

type FanGroup = {
  name: string;
  city: string | null;
  country: string | null;
  lat: number;
  lng: number;
  website?: string | null;
  description: string | null;
  facebook?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
};

export default function ClubMapLoader({ groups, color }: { groups: FanGroup[]; color?: string }) {
  return <ClubMap groups={groups} color={color} />;
}
