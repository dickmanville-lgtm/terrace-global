import { supabaseAdmin } from '../../../../lib/supabase-admin'
import Link from 'next/link'
import SubmissionsReview from './SubmissionsReview'

export const revalidate = 0

export type BarSubmission = {
  id: number
  created_at: string
  status: string
  name: string
  location: string | null
  country: string | null
  url: string | null
  latitude: number | null
  longitude: number | null
  submitter_email: string | null
  reviewed_at: string | null
  review_note: string | null
}

export default async function SportsBarSubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const params = await searchParams
  const status = params.status || 'pending'

  const { data: submissionsData } = await supabaseAdmin
    .from('sports_bar_submissions')
    .select(
      'id, created_at, status, name, location, country, url, latitude, longitude, submitter_email, reviewed_at, review_note'
    )
    .eq('status', status)
    .order('created_at', { ascending: true })

  const submissions: BarSubmission[] = submissionsData || []

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'Inter', sans-serif", padding: '48px 24px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <Link href="/admin" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', textDecoration: 'none' }}>
          ← Back to admin
        </Link>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '16px 0 8px' }}>Sports bar submissions</h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }}>
          Public &quot;Add your bar&quot; submissions land here for review before going live.
        </p>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {(['pending', 'approved', 'rejected'] as const).map((s) => (
            <Link
              key={s}
              href={`/admin/sports-bars/submissions?status=${s}`}
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '13px',
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.15)',
                background: status === s ? '#F97316' : 'transparent',
                color: status === s ? '#fff' : 'rgba(255,255,255,0.6)',
                textTransform: 'capitalize',
              }}
            >
              {s}
            </Link>
          ))}
        </div>

        {submissions.length === 0 ? (
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>
            No {status} submissions right now.
          </p>
        ) : (
          <SubmissionsReview submissions={submissions} status={status} />
        )}
      </div>
    </main>
  )
}
