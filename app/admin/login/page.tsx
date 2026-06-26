import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

async function login(formData: FormData) {
  'use server'
  const password = formData.get('password') as string

  if (password !== process.env.ADMIN_PASSWORD) {
    redirect('/admin/login?error=1')
  }

  const cookieStore = await cookies()
  cookieStore.set('admin_session', process.env.ADMIN_PASSWORD!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })

  redirect('/admin')
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const hasError = params.error === '1'

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
      <form action={login} style={{ width: '320px', padding: '32px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Terrace Admin</h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '24px' }}>Enter the admin password to continue.</p>
        <input
          type="password"
          name="password"
          placeholder="Password"
          autoFocus
          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '14px', marginBottom: '12px' }}
        />
        {hasError && (
          <p style={{ color: '#EF4444', fontSize: '13px', marginBottom: '12px' }}>Wrong password — try again.</p>
        )}
        <button type="submit" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: '#EF4444', color: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
          Log in
        </button>
      </form>
    </main>
  )
}