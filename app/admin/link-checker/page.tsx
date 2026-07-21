import Link from 'next/link'
import LinkCheckerRunner from './LinkCheckerRunner'

export default function LinkCheckerPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'Inter', sans-serif", padding: '48px 24px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <Link href="/admin" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', textDecoration: 'none' }}>
          ← Back to admin
        </Link>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '16px 0 12px' }}>Link checker</h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '24px', lineHeight: 1.6 }}>
          Checks every link across fan groups and sports bars. Facebook and X links can&apos;t be
          verified and are never treated as dead. A pin is only removed once every checkable
          link on it has failed. This can take a few minutes to run.
        </p>
        <LinkCheckerRunner />
      </div>
    </main>
  )
}