"use client"

import { useCallback, useEffect, useState } from "react"
import { api, ApiClientError } from "@/lib/api"
import type { PaginatedSongs, Song, SongColumn, SortOrder } from "@/lib/types"

type State = {
  data: PaginatedSongs | null
  loading: boolean
  error: string | null
}

type Options = {
  page: number
  limit: number
  sort_by?: SongColumn
  order?: SortOrder
}

export function useSongs({ page, limit, sort_by, order }: Options) {
  const [state, setState] = useState<State>({
    data: null,
    loading: true,
    error: null,
  })

  const fetchSongs = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const data = await api.listSongs({ page, limit, sort_by, order })
      setState({ data, loading: false, error: null })
    } catch (err) {
      const message =
        err instanceof ApiClientError ? err.message : "Failed to load songs"
      setState({ data: null, loading: false, error: message })
    }
  }, [page, limit, sort_by, order])

  useEffect(() => {
    fetchSongs()
  }, [fetchSongs])

  const updateRating = useCallback(
    async (id: string, rating: number) => {
      setState((prev) => {
        if (!prev.data) return prev
        return {
          ...prev,
          data: {
            ...prev.data,
            data: prev.data.data.map((song) =>
              song.id === id ? { ...song, star_rating: rating } : song,
            ),
          },
        }
      })
      try {
        return await api.rateSong(id, rating)
      } catch (err) {
        await fetchSongs()
        throw err
      }
    },
    [fetchSongs],
  )

  return {
    songs: state.data?.data ?? [],
    pagination: state.data?.pagination ?? null,
    loading: state.loading,
    error: state.error,
    refetch: fetchSongs,
    updateRating,
  }
}

export function useSongSearch() {
  const [result, setResult] = useState<Song | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState<string | null>(null)

  const search = useCallback(async (title: string) => {
    const trimmed = title.trim()
    if (!trimmed) {
      setResult(null)
      setError(null)
      setNotFound(null)
      return
    }
    setLoading(true)
    setError(null)
    setNotFound(null)
    try {
      const song = await api.searchSong(trimmed)
      setResult(song)
    } catch (err) {
      setResult(null)
      if (err instanceof ApiClientError && err.status === 404) {
        setNotFound(trimmed)
      } else {
        setError(
          err instanceof ApiClientError ? err.message : "Search failed",
        )
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
    setNotFound(null)
  }, [])

  return { result, loading, error, notFound, search, reset }
}
