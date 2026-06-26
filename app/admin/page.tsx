import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

async function logout() {
  'use server'
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  redirect('/admin/login')
}

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
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
          You're logged in. The fan-group tools will appear here next.
        </p>
      </div>
    </main>
  )
}