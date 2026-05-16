import type { SongColumn } from "@/lib/types"

const COLUMN_LABELS: Record<SongColumn, string> = {
  id: "ID",
  title: "Title",
  danceability: "Danceability",
  energy: "Energy",
  mood: "Mood",
  acousticness: "Acousticness",
  tempo: "Tempo (BPM)",
  duration_ms: "Duration (ms)",
  num_sections: "Sections",
  num_segments: "Segments",
  star_rating: "Rating",
}

export function columnLabel(col: SongColumn): string {
  return COLUMN_LABELS[col] ?? col
}

export function formatNumber(n: number, fractionDigits = 3): string {
  if (Number.isInteger(n)) return n.toLocaleString()
  return n.toFixed(fractionDigits)
}

export function truncate(s: string, len = 14): string {
  if (s.length <= len) return s
  return `${s.slice(0, len - 1)}…`
}
