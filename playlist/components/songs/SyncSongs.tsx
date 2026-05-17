"use client"

import { useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { songsApi } from "@/lib/api"
import { cn } from "@/lib/utils"

type Props = {
  onSynced?: () => void | Promise<void>
  disabled?: boolean
}

type Status = { kind: "idle" } | { kind: "ok"; message: string } | { kind: "error"; message: string }

export function SyncSongs({ onSynced, disabled }: Props) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<Status>({ kind: "idle" })

  useEffect(() => {
    if (status.kind === "idle") return
    const id = setTimeout(() => setStatus({ kind: "idle" }), 3000)
    return () => clearTimeout(id)
  }, [status])

  async function handle() {
    setLoading(true)
    setStatus({ kind: "idle" })
    try {
      const res = await songsApi.sync()
      setStatus({ kind: "ok", message: `${res.message} (${res.count})` })
      await onSynced?.()
    } catch (err) {
      const message = typeof err === "string" ? err : "Sync failed"
      setStatus({ kind: "error", message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {status.kind !== "idle" ? (
        <span
          className={cn(
            "text-xs",
            status.kind === "ok" ? "text-muted-foreground" : "text-destructive",
          )}
        >
          {status.message}
        </span>
      ) : null}
      <Button variant="outline" onClick={handle} disabled={loading || disabled}>
        <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
        {loading ? "Syncing…" : "Sync songs"}
      </Button>
    </div>
  )
}
