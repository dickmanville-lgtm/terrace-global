import { supabase } from '../../../../lib/supabase'
import Link from 'next/link'
import SubmissionsReview from './SubmissionsReview'

export const revalidate = 0

export type Submission = {
  id: number
  created_at: string
  status: string
  club_id: number | null
  club_slug: string | null
  name: string
  type: string | null
  city: string | null
  country: string | null
  url: string | null
  instagram_url: string | null
  facebook_url: string | null
  tiktok_url: string | null
  description: string | null
  submitter_email: string | null
  region: string | null
  latitude: number | null
  longitude: number | null
  reviewed_at: string | null
  review_note: string | null
}

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const params = await searchParams
  const status = params.status || 'pending'

  const { data: clubs } = await supabase
    .from('clubs')
    .select('id, name, slug')
    .order('name')

  const { data: submissionsData } = await supabase
    .from('fan_group_submissions')
    .select(
      'id, created_at, status, club_id, club_slug, name, type, city, country, url, instagram_url, facebook_url, tiktok_url, description, submitter_email, region, latitude, longitude, reviewed_at, review_note'
    )
    .eq('status', status)
    .order('created_at', { ascending: true })

  const submissions: Submission[] = submissionsData || []

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'Inter', sans-serif", padding: '48px 24px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <Link href="/admin" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', textDecoration: 'none' }}>
          ← Back to admin
        </Link>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '16px 0 8px' }}>Fan group submissions</h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }}>
          Public &quot;Add my group&quot; submissions land here for review before going live.
        </p>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {(['pending', 'approved', 'rejected'] as const).map((s) => (
            <Link
              key={s}
              href={`/admin/fan-groups/submissions?status=${s}`}
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '13px',
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.15)',
                background: status === s ? '#EF4444' : 'transparent',
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
          <SubmissionsReview clubs={clubs || []} submissions={submissions} status={status} />
        )}
      </div>
    </main>
  )
}
