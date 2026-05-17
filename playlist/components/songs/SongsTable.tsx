"use client"

import { useRouter } from "next/navigation"
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
import { columnLabel, formatCell } from "@/lib/format"
import type { Song, SongColumn, SortOrder } from "@/lib/types"

export const TABLE_COLUMNS: SongColumn[] = [
  "title",
  "danceability",
  "energy",
  "mode",
  "acousticness",
  "tempo",
  "duration_ms",
  "num_sections",
  "num_segments",
  "star_rating",
]

type Props = {
  rows: Song[]
  loading: boolean
  error: string | null
  sortKey?: SongColumn
  order?: SortOrder
  onSort: (column: SongColumn) => void
  onRate: (id: string, rating: number) => void | Promise<void>
}

export function SongsTable({ rows, loading, error, sortKey, order, onSort, onRate }: Props) {
  const router = useRouter()
  if (error) return <EmptyState title="Couldn't load songs" description={error} />

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            {TABLE_COLUMNS.map((col) => (
              <TableHead key={col}>
                <SortableHeader
                  column={col}
                  label={columnLabel(col)}
                  sortKey={sortKey}
                  order={order}
                  onSort={onSort}
                />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && rows.length === 0
            ? Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={`sk-${i}`}>
                  {TABLE_COLUMNS.map((col) => (
                    <TableCell key={col}>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : rows.map((song) => (
                <TableRow
                  key={song.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/song/${encodeURIComponent(song.id)}`)}
                >
                  {TABLE_COLUMNS.map((col) => (
                    <TableCell key={col} className={col === "title" ? "font-medium" : undefined}>
                      {col === "star_rating" ? (
                        <span onClick={(e) => e.stopPropagation()}>
                          <StarRating
                            value={song.star_rating}
                            onChange={(r) => onRate(song.id, r)}
                            size="sm"
                          />
                        </span>
                      ) : (
                        formatCell(song[col])
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          {!loading && rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={TABLE_COLUMNS.length} className="text-center py-8">
                <span className="text-sm text-muted-foreground">No songs to show</span>
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </div>
  )
}
