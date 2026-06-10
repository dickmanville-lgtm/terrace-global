'use client';

import dynamic from 'next/dynamic';

const ManCityMap = dynamic(() => import('../../components/ManCityMap'), { ssr: false });

export default function ManCityPage() {
  return (
    <main style={{ backgroundColor: '#0d0d0d', minHeight: '100vh', color: '#ffffff', fontFamily: 'sans-serif' }}>
      <div style={{ padding: '40px 24px 20px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#6CABDD', marginBottom: '6px' }}>
          Manchester City
        </h1>
        <p style={{ color: '#aaaaaa', fontSize: '1rem', marginBottom: '24px' }}>
          Fan groups supporting City from around the world
        </p>
      </div>
      <div style={{ height: '70vh', width: '100%' }}>
        <ManCityMap />
      </div>
    </main>
  );
}