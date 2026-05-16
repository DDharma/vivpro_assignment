export type Song = {
  id: string
  title: string
  danceability: number
  energy: number
  mood: number
  acousticness: number
  tempo: number
  duration_ms: number
  num_sections: number
  num_segments: number
  star_rating: number | null
}

export type SongColumn = keyof Song

export type SortOrder = "asc" | "desc"

export type Pagination = {
  page: number
  limit: number
  total: number
  total_pages: number
}

export type PaginatedSongs = {
  data: Song[]
  pagination: Pagination
}

export type SongsQuery = {
  page?: number
  limit?: number
  sort_by?: SongColumn
  order?: SortOrder
}

export type ApiError = {
  error: string
  [key: string]: unknown
}
