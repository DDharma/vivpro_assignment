import type { SongColumn } from "@/lib/types"

const COLUMN_LABELS: Record<SongColumn, string> = {
  id: "ID",
  title: "Title",
  danceability: "Danceability",
  energy: "Energy",
  acousticness: "Acousticness",
  instrumentalness: "Instrumentalness",
  liveness: "Liveness",
  loudness: "Loudness",
  valence: "Valence",
  tempo: "Tempo (BPM)",
  key: "Key",
  mode: "Mode",
  class_: "Class",
  duration_ms: "Duration (ms)",
  num_bars: "Bars",
  num_sections: "Sections",
  num_segments: "Segments",
  time_signature: "Time signature",
  star_rating: "Rating",
}

export function columnLabel(col: SongColumn): string {
  return COLUMN_LABELS[col] ?? col
}

export function formatCell(value: unknown): string {
  if (value === null || value === undefined) return "—"
  if (typeof value === "number") {
    if (Number.isInteger(value)) return value.toLocaleString()
    return value.toFixed(3)
  }
  return String(value)
}
