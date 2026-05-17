"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { songsApi } from "@/lib/api"
import { columnLabel, formatCell } from "@/lib/format"
import { StarRating } from "@/components/songs/StarRating"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { Song, SongColumn } from "@/lib/types"

const DETAIL_FIELDS: SongColumn[] = [
  "danceability",
  "energy",
  "acousticness",
  "instrumentalness",
  "liveness",
  "loudness",
  "valence",
  "tempo",
  "key",
  "mode",
  "class_",
  "duration_ms",
  "num_bars",
  "num_sections",
  "num_segments",
  "time_signature",
]

export default function SongDetailPage() {
  const { title } = useParams<{ title: string }>()
  const router = useRouter()
  const [song, setSong] = useState<Song | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rating, setRating] = useState<number | null>(null)

  useEffect(() => {
    setLoading(true)
    songsApi
      .getByTitle(decodeURIComponent(title))
      .then((s) => {
        setSong(s)
        setRating(s.star_rating)
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [title])

  async function handleRate(r: number) {
    if (!song) return
    setRating(r)
    try {
      const updated = await songsApi.rate(song.id, r)
      setRating(updated.star_rating)
    } catch {
      setRating(song.star_rating)
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <main className="w-full flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-6 -ml-2 gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-40" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
              {Array.from({ length: 16 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))}
            </div>
          </div>
        )}

        {error && <p className="text-destructive text-sm">{error}</p>}

        {song && !loading && (
          <>
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold">{song.title ?? "Untitled"}</h1>
                <p className="text-sm text-muted-foreground mt-1">ID: {song.id}</p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Rating</span>
                <StarRating value={rating} onChange={handleRate} size="md" />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {DETAIL_FIELDS.map((field) => (
                <Card key={field}>
                  <CardHeader className="pb-1 pt-4 px-4">
                    <CardTitle className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                      {columnLabel(field)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-0">
                    <span className="text-lg font-semibold">{formatCell(song[field])}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
