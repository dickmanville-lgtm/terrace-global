import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase-admin'
import { runLinkCheckerBatch } from '../../../lib/link-checker'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const FAN_GROUPS_BATCH_SIZE = 10
const SPORTS_BARS_BATCH_SIZE = 20

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  if (!secret || secret !== process.env.LINK_CHECKER_CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const summary: Record<string, unknown> = {}

  // Sports bars temporarily excluded from the automated sweep while Phase 1/2
// bulk-seeding is in progress — re-add 'sports_bars' here once enrichment
// is far enough along that dead-link checks are worth running again.
const TABLES_TO_CHECK = ['fan_groups'] as const

for (const table of TABLES_TO_CHECK) {
    const batchSize = table === 'fan_groups' ? FAN_GROUPS_BATCH_SIZE : SPORTS_BARS_BATCH_SIZE

    const { data: state } = await supabaseAdmin
      .from('link_checker_state')
      .select('last_id')
      .eq('table_name', table)
      .single()

    const afterId = state?.last_id ?? 0

    const result = await runLinkCheckerBatch(table, afterId, batchSize)

    await supabaseAdmin
      .from('link_checker_state')
      .update({ last_id: result.lastId, updated_at: new Date().toISOString() })
      .eq('table_name', table)

    summary[table] = {
      checked: result.checked,
      deleted: result.deleted,
      errors: result.errors,
      wrappedAround: result.wrapped,
    }
  }

  return NextResponse.json({ success: true, ranAt: new Date().toISOString(), summary })
}