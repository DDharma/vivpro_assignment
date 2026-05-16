"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { Skeleton } from "@/components/ui/skeleton"
import { StarRating } from "@/components/songs/StarRating"
import { formatNumber } from "@/lib/format"
import type { Song } from "@/lib/types"

type Props = {
  result: Song | null
  loading: boolean
  error: string | null
  notFound: string | null
  onSearch: (title: string) => void
  onClear: () => void
}

const PREVIEW_FIELDS: { key: keyof Song; label: string }[] = [
  { key: "danceability", label: "Danceability" },
  { key: "energy", label: "Energy" },
  { key: "acousticness", label: "Acousticness" },
  { key: "tempo", label: "Tempo" },
  { key: "duration_ms", label: "Duration (ms)" },
  { key: "mood", label: "Mood" },
]

export function SearchByTitle({
  result,
  loading,
  error,
  notFound,
  onSearch,
  onClear,
}: Props) {
  const [title, setTitle] = React.useState("")

  function submit(e: React.FormEvent) {
    e.preventDefault()
    onSearch(title)
  }

  function clear() {
    setTitle("")
    onClear()
  }

  return (
    <div className="flex flex-col gap-3">
      <form onSubmit={submit} className="flex items-center gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Search song by title…"
          aria-label="Song title"
        />
        <Button type="submit" disabled={loading || !title.trim()}>
          {loading ? "Searching…" : "Get Song"}
        </Button>
        {result || notFound || error ? (
          <Button type="button" variant="ghost" onClick={clear}>
            Clear
          </Button>
        ) : null}
      </form>

      {loading ? (
        <Card>
          <CardContent className="pt-6 space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-72" />
          </CardContent>
        </Card>
      ) : null}

      {error ? (
        <EmptyState title="Search failed" description={error} />
      ) : null}

      {notFound && !loading ? (
        <EmptyState
          title="No song found"
          description={`Nothing matched “${notFound}”.`}
        />
      ) : null}

      {result && !loading ? (
        <Card className="border-primary/30 ring-1 ring-primary/20">
          <CardContent className="pt-6 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">{result.title}</h3>
                <p className="text-xs text-muted-foreground font-mono">{result.id}</p>
              </div>
              <StarRating value={result.star_rating} readOnly />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              {PREVIEW_FIELDS.map((f) => (
                <div key={f.key} className="flex flex-col">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    {f.label}
                  </span>
                  <span className="font-medium">
                    {formatNumber(result[f.key] as number)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
