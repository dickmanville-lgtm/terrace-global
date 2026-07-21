'use server'

import { supabaseAdmin } from '../../../lib/supabase-admin'

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

export async function runLinkCheckerSweep() {
  const results = {
    fanGroupsChecked: 0,
    fanGroupsDeleted: 0,
    sportsBarsChecked: 0,
    sportsBarsDeleted: 0,
    errors: [] as string[],
  }

  const { data: fanGroups, error: fgError } = await supabaseAdmin
    .from('fan_groups')
    .select('id, name, url, instagram_url, facebook_url, tiktok_url')

  if (fgError) {
    results.errors.push(`Could not load fan_groups: ${fgError.message}`)
  } else {
    for (const group of (fanGroups || []) as FanGroupRow[]) {
      const fields = [
        { name: 'url', value: group.url },
        { name: 'instagram_url', value: group.instagram_url },
        { name: 'facebook_url', value: group.facebook_url },
        { name: 'tiktok_url', value: group.tiktok_url },
      ].filter(f => f.value && f.value.trim())

      if (fields.length === 0) {
        continue
      }

      const checks = await Promise.all(
        fields.map(async f => ({ ...f, result: await checkLink(f.value as string) }))
      )
      results.fanGroupsChecked++

      const anyAlive = checks.some(c => c.result === 'alive')
      const anyUnverifiable = checks.some(c => c.result === 'unverifiable')
      const allCheckableDead = checks
        .filter(c => c.result !== 'unverifiable')
        .every(c => c.result === 'dead')

      await supabaseAdmin
        .from('fan_groups')
        .update({
          link_status: anyAlive ? 'alive' : anyUnverifiable ? 'unverified' : 'dead',
          link_checked_at: new Date().toISOString(),
        })
        .eq('id', group.id)

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
            results.fanGroupsDeleted++
          } else {
            results.errors.push(`Could not log deletion for fan group ${group.id}, skipped deleting it.`)
          }
        }
      }
    }
  }

  const { data: bars, error: sbError } = await supabaseAdmin
    .from('sports_bars')
    .select('id, name, url')

  if (sbError) {
    results.errors.push(`Could not load sports_bars: ${sbError.message}`)
  } else {
    for (const bar of (bars || []) as SportsBarRow[]) {
      if (!bar.url || !bar.url.trim()) continue

      const result = await checkLink(bar.url)
      results.sportsBarsChecked++

      await supabaseAdmin
        .from('sports_bars')
        .update({
          link_status: result === 'alive' ? 'alive' : result === 'unverifiable' ? 'unverified' : 'dead',
          link_checked_at: new Date().toISOString(),
        })
        .eq('id', bar.id)

      if (result === 'dead') {
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
            results.sportsBarsDeleted++
          } else {
            results.errors.push(`Could not log deletion for bar ${bar.id}, skipped deleting it.`)
          }
        }
      }
    }
  }

  return results
}