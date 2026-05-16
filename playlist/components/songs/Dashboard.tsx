"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { SongsTable } from "@/components/songs/SongsTable"
import { Pagination } from "@/components/songs/Pagination"
import { SearchByTitle } from "@/components/songs/SearchByTitle"
import { DownloadCSV } from "@/components/songs/DownloadCSV"
import { DanceabilityScatter } from "@/components/charts/DanceabilityScatter"
import { DurationHistogram } from "@/components/charts/DurationHistogram"
import { AcousticnessBar } from "@/components/charts/AcousticnessBar"
import { TempoBar } from "@/components/charts/TempoBar"
import { useSongs, useSongSearch } from "@/hooks/useSongs"
import type { SongColumn, SortOrder } from "@/lib/types"

const PAGE_SIZE = 10

export function Dashboard() {
  const [page, setPage] = React.useState(1)
  const [sortBy, setSortBy] = React.useState<SongColumn | undefined>(undefined)
  const [order, setOrder] = React.useState<SortOrder | undefined>(undefined)

  const { songs, pagination, loading, error, updateRating } = useSongs({
    page,
    limit: PAGE_SIZE,
    sort_by: sortBy,
    order,
  })
  const search = useSongSearch()

  function toggleSort(column: SongColumn) {
    if (sortBy !== column) {
      setSortBy(column)
      setOrder("asc")
      setPage(1)
      return
    }
    if (order === "asc") {
      setOrder("desc")
    } else {
      setSortBy(undefined)
      setOrder(undefined)
    }
    setPage(1)
  }

  async function handleRate(id: string, rating: number) {
    try {
      await updateRating(id, rating)
    } catch {
      /* error surfaced via refetch in the hook */
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Find a song</CardTitle>
          <CardDescription>Look up a specific track by title.</CardDescription>
        </CardHeader>
        <CardContent>
          <SearchByTitle
            result={search.result}
            loading={search.loading}
            error={search.error}
            notFound={search.notFound}
            onSearch={search.search}
            onClear={search.reset}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <CardTitle>Playlist</CardTitle>
            <CardDescription>
              {pagination
                ? `Showing ${songs.length} of ${pagination.total} songs`
                : "Loading playlist…"}
            </CardDescription>
          </div>
          <DownloadCSV songs={songs} disabled={loading} />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <SongsTable
            songs={songs}
            loading={loading}
            error={error}
            sortBy={sortBy}
            order={order}
            onSort={toggleSort}
            onRate={handleRate}
          />
          <Pagination pagination={pagination} loading={loading} onChange={setPage} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <DanceabilityScatter songs={songs} loading={loading} />
        <DurationHistogram songs={songs} loading={loading} />
        <AcousticnessBar songs={songs} loading={loading} />
        <TempoBar songs={songs} loading={loading} />
      </div>
    </div>
  )
}
