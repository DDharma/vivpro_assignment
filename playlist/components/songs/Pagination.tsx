"use client"

import { Button } from "@/components/ui/button"

type Props = {
  page: number
  totalPages: number
  total: number
  loading?: boolean
  onChange: (page: number) => void
}

export function Pagination({ page, totalPages, total, loading, onChange }: Props) {
  const canPrev = page > 1
  const canNext = page < totalPages
  return (
    <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center sm:gap-3">
      <span className="text-xs text-muted-foreground sm:text-sm">
        Page <span className="text-foreground font-medium">{page}</span> of {totalPages}
        <span className="ml-2 text-xs">({total} total)</span>
      </span>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onChange(page - 1)} disabled={!canPrev || loading}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => onChange(page + 1)} disabled={!canNext || loading}>
          Next
        </Button>
      </div>
    </div>
  )
}
