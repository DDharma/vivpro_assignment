export type Song = {
  id: string
  title: string | null
  danceability: number
  energy: number
  acousticness: number
  instrumentalness: number
  liveness: number
  loudness: number
  valence: number | null
  tempo: number | null
  key: number
  mode: number
  class_: number
  duration_ms: number
  num_bars: number
  num_sections: number
  num_segments: number
  time_signature: number | null
  star_rating: number | null
}

export type SongColumn = keyof Song

export type SortOrder = "asc" | "desc"

export type SongListResponse = {
  songs: Song[]
  total: number
  page: number
  limit: number
}

export type RatingPayload = {
  song_id: string
  rating: number
}

export type SyncResponse = {
  message: string
  count: number
}

export type ApiErrorBody = {
  detail?: string | Array<{ msg: string }>
  error?: string
}
