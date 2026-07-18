import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

async function logout() {
  'use server'
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  redirect('/admin/login')
}

const tools = [
  { href: '/admin/fan-groups/submissions', label: 'Review submissions', desc: 'Approve or reject public "Add my group" submissions' },
  { href: '/admin/fan-groups', label: 'Browse & edit fan groups', desc: 'View, edit, and delete existing entries' },
  { href: '/admin/fan-groups/new', label: 'Add fan group', desc: 'Add a single group manually' },
  { href: '/admin/fan-groups/bulk', label: 'Bulk upload fan groups', desc: 'Paste a CSV of many groups at once' },
  { href: '/admin/sports-bars/bulk', label: 'Bulk upload sports bars', desc: 'Paste a CSV of many sports bars at once' },
  { href: '/admin/sports-bars/submissions', label: 'Review sports bar submissions', desc: 'Approve or reject public "Add your bar" submissions' },
]

export default function AdminHome() {
  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'Inter', sans-serif", padding: '48px 32px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Terrace Admin</h1>
          <form action={logout}>
            <button type="submit" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)', borderRadius: '8px', padding: '6px 14px', fontSize: '13px', cursor: 'pointer' }}>
              Log out
            </button>
          </form>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tools.map(t => (
            <Link key={t.href} href={t.href} style={{
              display: 'block', padding: '16px 20px', borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)',
              textDecoration: 'none', color: '#fff',
            }}>
              <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '4px' }}>{t.label}</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{t.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}