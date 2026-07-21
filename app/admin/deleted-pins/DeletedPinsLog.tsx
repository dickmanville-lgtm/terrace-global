"use client"

import { useState } from "react"

type LogRow = {
  id: number
  source_table: string
  record_id: string
  record_data: Record<string, unknown>
  reason: string
  note: string | null
  deleted_at: string
}

function getName(record: Record<string, unknown>): string {
  return typeof record.name === "string" ? record.name : `#${record.id}`
}

function formatReason(reason: string): string {
  if (reason === "manual_admin_removal") return "Manually removed by admin"
  if (reason === "no_live_links") return "No live links found (automated sweep)"
  return reason
}

export default function DeletedPinsLog({ logs }: { logs: LogRow[] }) {
  const [filter, setFilter] = useState<"all" | "fan_groups" | "sports_bars">("all")
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const filtered = logs.filter(function (l) {
    return filter === "all" || l.source_table === filter
  })

  return (
    <div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {(["all", "fan_groups", "sports_bars"] as const).map(function (f) {
          return (
            <button
              key={f}
              onClick={function () { setFilter(f) }}
              style={{
                padding: "8px 14px", borderRadius: "8px", fontSize: "13px", cursor: "pointer",
                border: filter === f ? "1px solid #EF4444" : "1px solid rgba(255,255,255,0.15)",
                background: filter === f ? "rgba(239,68,68,0.12)" : "transparent",
                color: filter === f ? "#EF4444" : "rgba(255,255,255,0.7)",
              }}
            >
              {f === "all" ? "All" : f === "fan_groups" ? "Fan Groups" : "Sports Bars"}
            </button>
          )
        })}
      </div>

      <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "16px" }}>
        {filtered.length} deleted row{filtered.length === 1 ? "" : "s"}
      </p>

      {filtered.length === 0 && (
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>Nothing here yet.</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {filtered.map(function (log) {
          const isExpanded = expandedId === log.id
          return (
            <div key={log.id} style={{
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px",
              background: "rgba(255,255,255,0.03)", overflow: "hidden",
            }}>
              <button
                onClick={function () { setExpandedId(isExpanded ? null : log.id) }}
                style={{
                  width: "100%", textAlign: "left", padding: "14px 18px", background: "transparent",
                  border: "none", color: "#fff", cursor: "pointer", display: "flex",
                  justifyContent: "space-between", alignItems: "center", gap: "12px",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: "14px" }}>
                    {getName(log.record_data)}
                    <span style={{ marginLeft: "10px", fontSize: "11px", color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>
                      {log.source_table === "fan_groups" ? "Fan Group" : "Sports Bar"}
                    </span>
                  </div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>
                    {formatReason(log.reason)} · {new Date(log.deleted_at).toLocaleString()}
                    {log.note ? " · \"" + log.note + "\"" : null}
                  </div>
                </div>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
                  {isExpanded ? "▲" : "▼"}
                </span>
              </button>
              {isExpanded && (
                <pre style={{
                  margin: 0, padding: "14px 18px", fontSize: "12px", color: "rgba(255,255,255,0.6)",
                  background: "rgba(0,0,0,0.3)", overflowX: "auto", borderTop: "1px solid rgba(255,255,255,0.08)",
                }}>
                  {JSON.stringify(log.record_data, null, 2)}
                </pre>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}