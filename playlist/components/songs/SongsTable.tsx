"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { SortableHeader } from "@/components/songs/SortableHeader"
import { StarRating } from "@/components/songs/StarRating"
import { columnLabel, formatNumber } from "@/lib/format"
import type { Song, SongColumn, SortOrder } from "@/lib/types"

const COLUMNS: SongColumn[] = [
  "title",
  "danceability",
  "energy",
  "mood",
  "acousticness",
  "tempo",
  "duration_ms",
  "num_sections",
  "num_segments",
  "star_rating",
]

type Props = {
  songs: Song[]
  loading: boolean
  error: string | null
  sortBy?: SongColumn
  order?: SortOrder
  onSort: (column: SongColumn) => void
  onRate: (id: string, rating: number) => void | Promise<void>
}

function CellValue({ song, column }: { song: Song; column: SongColumn }) {
  const value = song[column]
  if (column === "star_rating") return null
  if (value === null || value === undefined) return <span className="text-muted-foreground">—</span>
  if (typeof value === "number") return <>{formatNumber(value)}</>
  return <>{value}</>
}

export function SongsTable({
  songs,
  loading,
  error,
  sortBy,
  order,
  onSort,
  onRate,
}: Props) {
  if (error) {
    return (
      <EmptyState
        title="Couldn't load songs"
        description={error}
      />
    )
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            {COLUMNS.map((col) => (
              <TableHead key={col}>
                <SortableHeader
                  column={col}
                  label={columnLabel(col)}
                  sortBy={sortBy}
                  order={order}
                  onSort={onSort}
                />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && songs.length === 0
            ? Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={`sk-${i}`}>
                  {COLUMNS.map((col) => (
                    <TableCell key={col}>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : songs.map((song) => (
                <TableRow key={song.id}>
                  {COLUMNS.map((col) => (
                    <TableCell
                      key={col}
                      className={col === "title" ? "font-medium" : undefined}
                    >
                      {col === "star_rating" ? (
                        <StarRating
                          value={song.star_rating}
                          onChange={(r) => onRate(song.id, r)}
                          size="sm"
                        />
                      ) : (
                        <CellValue song={song} column={col} />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          {!loading && songs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={COLUMNS.length} className="text-center py-8">
                <span className="text-sm text-muted-foreground">No songs to show</span>
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </div>
  )
}

export { COLUMNS as SONG_COLUMNS }
