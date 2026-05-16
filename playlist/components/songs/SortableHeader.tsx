"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import type { SongColumn, SortOrder } from "@/lib/types"

type Props = {
  column: SongColumn
  label: string
  sortBy?: SongColumn
  order?: SortOrder
  onSort: (column: SongColumn) => void
  className?: string
  align?: "left" | "right"
}

export function SortableHeader({
  column,
  label,
  sortBy,
  order,
  onSort,
  className,
  align = "left",
}: Props) {
  const active = sortBy === column
  const indicator = active ? (order === "desc" ? "▼" : "▲") : ""
  return (
    <button
      type="button"
      onClick={() => onSort(column)}
      aria-sort={
        active ? (order === "desc" ? "descending" : "ascending") : "none"
      }
      className={cn(
        "inline-flex w-full items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors",
        align === "right" && "justify-end",
        className,
      )}
    >
      <span>{label}</span>
      <span
        aria-hidden
        className={cn(
          "text-[10px]",
          active ? "text-foreground" : "text-muted-foreground/40",
        )}
      >
        {indicator || "↕"}
      </span>
    </button>
  )
}
