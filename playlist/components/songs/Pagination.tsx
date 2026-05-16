"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import type { Pagination as PaginationType } from "@/lib/types"

type Props = {
  pagination: PaginationType | null
  loading?: boolean
  onChange: (page: number) => void
}

export function Pagination({ pagination, loading, onChange }: Props) {
  if (!pagination) {
    return (
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>—</span>
      </div>
    )
  }

  const { page, total_pages, total } = pagination
  const canPrev = page > 1
  const canNext = page < total_pages

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-muted-foreground">
        Page <span className="text-foreground font-medium">{page}</span> of {total_pages}
        <span className="ml-2 text-xs">({total} total)</span>
      </span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(page - 1)}
          disabled={!canPrev || loading}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(page + 1)}
          disabled={!canNext || loading}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
