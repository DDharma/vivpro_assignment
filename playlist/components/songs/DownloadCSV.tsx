"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { downloadCSV, toCSV } from "@/lib/csv"
import { SONG_COLUMNS } from "@/components/songs/SongsTable"
import type { Song } from "@/lib/types"

type Props = {
  songs: Song[]
  filename?: string
  disabled?: boolean
}

export function DownloadCSV({ songs, filename = "songs.csv", disabled }: Props) {
  function handle() {
    if (!songs.length) return
    const csv = toCSV(songs as unknown as Record<string, unknown>[], [
      "id",
      ...SONG_COLUMNS,
    ] as (keyof Song)[])
    downloadCSV(filename, csv)
  }
  return (
    <Button
      variant="outline"
      onClick={handle}
      disabled={disabled || !songs.length}
    >
      Download CSV
    </Button>
  )
}
