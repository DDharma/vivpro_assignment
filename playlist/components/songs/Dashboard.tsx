"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SongsTable } from "@/components/songs/SongsTable"
import { Pagination } from "@/components/songs/Pagination"
import { SearchByTitle } from "@/components/songs/SearchByTitle"
import { DownloadCSV } from "@/components/songs/DownloadCSV"
import { SyncSongs } from "@/components/songs/SyncSongs"
import { ChartCard } from "@/components/charts/ChartCard"
import { DanceabilityScatter } from "@/components/charts/DanceabilityScatter"
import { DurationHistogram } from "@/components/charts/DurationHistogram"
import { MetricBarChart } from "@/components/charts/MetricBarChart"
import { songsApi } from "@/lib/api"
import { nextOrder, sortBy } from "@/lib/sort"
import type { Song, SongColumn, SortOrder } from "@/lib/types"

const LIMIT = 10

export function Dashboard() {
  const [songs, setSongs] = useState<Song[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState<SongColumn | undefined>(undefined)
  const [order, setOrder] = useState<SortOrder | undefined>(undefined)
  const [query, setQuery] = useState("")
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let active = true
    songsApi
      .list(page, LIMIT, query.trim() || undefined)
      .then((res) => {
        if (!active) return
        setSongs(res.songs ?? [])
        setTotal(res.total ?? 0)
        setError(null)
        setLoading(false)
      })
      .catch((err: unknown) => {
        if (!active) return
        setSongs([])
        setError(typeof err === "string" ? err : "Failed to load songs")
        setLoading(false)
      })
    return () => { active = false }
  }, [page, query, tick])

  const rows = sortKey && order ? sortBy(songs, sortKey, order) : songs
  const totalPages = Math.ceil(total / LIMIT)

  function handleSort(column: SongColumn) {
    const sameKey = sortKey === column
    const next = nextOrder(order, sameKey)
    setSortKey(next ? column : undefined)
    setOrder(next)
  }

  function handleSearch(value: string) {
    setLoading(true)
    setQuery(value)
    setPage(1)
  }

  function handlePageChange(p: number) {
    setLoading(true)
    setPage(p)
  }

  async function handleRate(id: string, rating: number) {
    const prev = songs
    setSongs(songs.map((s) => (s.id === id ? { ...s, star_rating: rating } : s)))
    try {
      await songsApi.rate(id, rating)
    } catch {
      setSongs(prev)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-end">
        <SyncSongs onSynced={() => { setPage(1); setTick((t) => t + 1) }} disabled={loading} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Find a song</CardTitle>
          <CardDescription>Filter the playlist by title.</CardDescription>
        </CardHeader>
        <CardContent>
          <SearchByTitle query={query} onSearch={handleSearch} disabled={loading} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle>Playlist</CardTitle>
            <CardDescription>
              {loading
                ? "Loading playlist…"
                : `Showing ${rows.length} of ${total} song${total === 1 ? "" : "s"}`}
            </CardDescription>
          </div>
          <DownloadCSV currentPage={page} disabled={loading} />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <SongsTable
            rows={rows}
            loading={loading}
            error={error}
            sortKey={sortKey}
            order={order}
            onSort={handleSort}
            onRate={handleRate}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            loading={loading}
            onChange={handlePageChange}
          />
        </CardContent>
      </Card>

      {songs.length > 0 && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCard title="Danceability — Scatter">
            <DanceabilityScatter songs={songs} />
          </ChartCard>

          <ChartCard title="Duration — Histogram">
            <DurationHistogram songs={songs} />
          </ChartCard>

          <ChartCard title="Acousticness — Bar Chart">
            <MetricBarChart songs={songs} metric="acousticness" label="Acousticness (0–1)" />
          </ChartCard>

          <ChartCard title="Tempo — Bar Chart">
            <MetricBarChart songs={songs} metric="tempo" label="Tempo (BPM)" unit=" BPM" />
          </ChartCard>
        </div>
      )}
    </div>
  )
}
