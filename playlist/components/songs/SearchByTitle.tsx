"use client"

import { FormEvent, useEffect, useState } from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type Props = {
  query: string
  onSearch: (value: string) => void
  disabled?: boolean
}

export function SearchByTitle({ query, onSearch, disabled }: Props) {
  const [value, setValue] = useState(query)

  useEffect(() => {
    setValue(query)
  }, [query])

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    onSearch(value.trim())
  }

  function clear() {
    setValue("")
    onSearch("")
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <div className="relative flex-1">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter song title…"
          aria-label="Song title"
          disabled={disabled}
          className="pr-9"
        />
        {value ? (
          <button
            type="button"
            onClick={clear}
            disabled={disabled}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
      <Button type="submit" disabled={disabled || !value.trim()}>
        Get Song
      </Button>
    </form>
  )
}
