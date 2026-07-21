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

  for (const table of ['fan_groups', 'sports_bars'] as const) {
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