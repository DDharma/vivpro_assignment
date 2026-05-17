"use client"

import { cn } from "@/lib/utils"
import type { SongColumn, SortOrder } from "@/lib/types"

type Props = {
  column: SongColumn
  label: string
  sortKey?: SongColumn
  order?: SortOrder
  onSort: (column: SongColumn) => void
  align?: "left" | "right"
}

export function SortableHeader({ column, label, sortKey, order, onSort, align = "left" }: Props) {
  const active = sortKey === column
  const indicator = active ? (order === "desc" ? "▼" : "▲") : "↕"
  return (
    <button
      type="button"
      onClick={() => onSort(column)}
      className={cn(
        "inline-flex w-full items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors",
        align === "right" && "justify-end",
      )}
    >
      <span>{label}</span>
      <span
        aria-hidden
        className={cn("text-[10px]", active ? "text-foreground" : "text-muted-foreground/40")}
      >
        {indicator}
      </span>
    </button>
  )
}
