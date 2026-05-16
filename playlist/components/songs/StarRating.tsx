"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type Props = {
  value: number | null
  onChange?: (rating: number) => void | Promise<void>
  size?: "sm" | "md"
  readOnly?: boolean
}

const STAR_VALUES = [1, 2, 3, 4, 5] as const

export function StarRating({ value, onChange, size = "md", readOnly = false }: Props) {
  const [hover, setHover] = React.useState<number | null>(null)
  const display = hover ?? value ?? 0
  const px = size === "sm" ? "text-sm" : "text-base"

  return (
    <div
      role="radiogroup"
      aria-label="Star rating"
      className={cn("inline-flex items-center gap-0.5", px)}
    >
      {STAR_VALUES.map((star) => {
        const filled = star <= display
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={star === value}
            aria-label={`${star} star${star === 1 ? "" : "s"}`}
            disabled={readOnly}
            onMouseEnter={() => !readOnly && setHover(star)}
            onMouseLeave={() => !readOnly && setHover(null)}
            onClick={() => !readOnly && onChange?.(star)}
            className={cn(
              "leading-none transition-colors",
              filled ? "text-yellow-400" : "text-muted-foreground/30",
              !readOnly && "hover:text-yellow-300 cursor-pointer",
              readOnly && "cursor-default",
            )}
          >
            {filled ? "★" : "☆"}
          </button>
        )
      })}
    </div>
  )
}
