import { supabaseAdmin } from './supabase-admin'

type LinkCheckResult = 'alive' | 'dead' | 'unverifiable'

const UNVERIFIABLE_DOMAINS = ['facebook.com', 'fb.com', 'x.com', 'twitter.com']

function isUnverifiableDomain(url: string): boolean {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    return UNVERIFIABLE_DOMAINS.some(d => host === d || host.endsWith('.' + d))
  } catch {
    return false
  }
}

async function checkLink(url: string): Promise<LinkCheckResult> {
  if (!url || !url.trim()) return 'dead'
  if (isUnverifiableDomain(url)) return 'unverifiable'

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TerraceLinkChecker/1.0)' },
    })
    clearTimeout(timeout)

    return res.ok ? 'alive' : 'dead'
  } catch {
    return 'dead'
  }
}

type FanGroupRow = {
  id: number
  name: string
  url: string | null
  instagram_url: string | null
  facebook_url: string | null
  tiktok_url: string | null
}

type SportsBarRow = {
  id: number
  name: string
  url: string | null
}

export type BatchResult = {
  checked: number
  deleted: number
  errors: string[]
  lastId: number
  hasMore: boolean
  wrapped: boolean
}

export async function runLinkCheckerBatch(
  table: 'fan_groups' | 'sports_bars',
  afterId: number,
  batchSize: number
): Promise<BatchResult> {
  const result: BatchResult = { checked: 0, deleted: 0, errors: [], lastId: afterId, hasMore: false, wrapped: false }

  if (table === 'fan_groups') {
    const { data, error } = await supabaseAdmin
      .from('fan_groups')
      .select('id, name, url, instagram_url, facebook_url, tiktok_url')
      .gt('id', afterId)
      .order('id', { ascending: true })
      .limit(batchSize + 1)

    if (error) {
      result.errors.push(`Could not load fan_groups: ${error.message}`)
      return result
    }

    const rows = (data || []) as FanGroupRow[]
    const hasMore = rows.length > batchSize
    const toProcess = hasMore ? rows.slice(0, batchSize) : rows

    for (const group of toProcess) {
      const fields = [
        { name: 'url', value: group.url },
        { name: 'instagram_url', value: group.instagram_url },
        { name: 'facebook_url', value: group.facebook_url },
        { name: 'tiktok_url', value: group.tiktok_url },
      ].filter(f => f.value && f.value.trim())

      result.lastId = group.id

      let anyAlive = false
      let anyUnverifiable = false
      let allCheckableDead = true

      if (fields.length === 0) {
        // No link fields at all — nothing to click through to, so treat it the
        // same as "every link is dead" rather than silently skipping the row.
        result.checked++
        await supabaseAdmin
          .from('fan_groups')
          .update({ link_status: 'dead', link_checked_at: new Date().toISOString() })
          .eq('id', group.id)
      } else {
        const checks = await Promise.all(
          fields.map(async f => ({ ...f, result: await checkLink(f.value as string) }))
        )
        result.checked++

        anyAlive = checks.some(c => c.result === 'alive')
        anyUnverifiable = checks.some(c => c.result === 'unverifiable')
        allCheckableDead = checks
          .filter(c => c.result !== 'unverifiable')
          .every(c => c.result === 'dead')

        await supabaseAdmin
          .from('fan_groups')
          .update({
            link_status: anyAlive ? 'alive' : anyUnverifiable ? 'unverified' : 'dead',
            link_checked_at: new Date().toISOString(),
          })
          .eq('id', group.id)
      }

      if (!anyAlive && allCheckableDead && !anyUnverifiable) {
        const { data: fullRow } = await supabaseAdmin
          .from('fan_groups')
          .select('*')
          .eq('id', group.id)
          .single()

        if (fullRow) {
          const { error: logError } = await supabaseAdmin.from('deleted_pins_log').insert({
            source_table: 'fan_groups',
            record_id: String(group.id),
            record_data: fullRow,
            reason: 'no_live_links',
            note: null,
          })

          if (!logError) {
            await supabaseAdmin.from('fan_groups').delete().eq('id', group.id)
            result.deleted++
          } else {
            result.errors.push(`Could not log deletion for fan group ${group.id}, skipped deleting it.`)
          }
        }
      }
    }

    if (!hasMore) {
      result.wrapped = true
      result.lastId = 0
    }
    result.hasMore = hasMore
    return result
  }

  // sports_bars
  const { data, error } = await supabaseAdmin
    .from('sports_bars')
    .select('id,name, url')
    .gt('id', afterId)
    .order('id', { ascending: true })
    .limit(batchSize + 1)

  if (error) {
    result.errors.push(`Could not load sports_bars: ${error.message}`)
    return result
  }

  const rows = (data || []) as SportsBarRow[]
  const hasMore = rows.length > batchSize
  const toProcess = hasMore ? rows.slice(0, batchSize) : rows

  for (const bar of toProcess) {
    result.lastId = bar.id

    if (!bar.url || !bar.url.trim()) continue

    const linkResult = await checkLink(bar.url)
    result.checked++

    await supabaseAdmin
      .from('sports_bars')
      .update({
        link_status: linkResult === 'alive' ? 'alive' : linkResult === 'unverifiable' ? 'unverified' : 'dead',
        link_checked_at: new Date().toISOString(),
      })
      .eq('id', bar.id)

    if (linkResult === 'dead') {
      const { data: fullRow } = await supabaseAdmin
        .from('sports_bars')
        .select('*')
        .eq('id', bar.id)
        .single()

      if (fullRow) {
        const { error: logError } = await supabaseAdmin.from('deleted_pins_log').insert({
          source_table: 'sports_bars',
          record_id: String(bar.id),
          record_data: fullRow,
          reason: 'no_live_links',
          note: null,
        })

        if (!logError) {
          await supabaseAdmin.from('sports_bars').delete().eq('id', bar.id)
          result.deleted++
        } else {
          result.errors.push(`Could not log deletion for bar ${bar.id}, skipped deleting it.`)
        }
      }
    }
  }

  if (!hasMore) {
    result.wrapped = true
    result.lastId = 0
  }
  result.hasMore = hasMore
  return result
}