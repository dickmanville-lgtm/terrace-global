import { supabaseAdmin } from '../../../lib/supabase-admin'
import Link from 'next/link'
import DeletedPinsLog from './DeletedPinsLog'

export const revalidate = 0

export default async function DeletedPinsPage() {
  const { data: logs } = await supabaseAdmin
    .from('deleted_pins_log')
    .select('*')
    .order('deleted_at', { ascending: false })

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'Inter', sans-serif", padding: '48px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Link href="/admin" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', textDecoration: 'none' }}>
          ← Back to admin
        </Link>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '16px 0 24px' }}>Deleted pins log</h1>
        <DeletedPinsLog logs={logs || []} />
      </div>
    </main>
  )
}