"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { songsApi } from "@/lib/api"

type Props = {
  currentPage: number
  disabled?: boolean
}

export function DownloadCSV({ currentPage, disabled }: Props) {
  const [open, setOpen] = useState(false)
  const [downloading, setDownloading] = useState(false)

  async function download(page: number) {
    setDownloading(true)
    try {
      const blob = await songsApi.downloadCsv(page)
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = page === 0 ? "songs-all.csv" : `songs-page-${page}.csv`
      a.click()
      URL.revokeObjectURL(url)
      setOpen(false)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          <Download className="h-4 w-4" />
          Download CSV
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Download CSV</DialogTitle>
          <DialogDescription>
            Choose whether to download the current page or all songs.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => download(currentPage)} disabled={downloading}>
            Current page (page {currentPage})
          </Button>
          <Button onClick={() => download(0)} disabled={downloading}>
            {downloading ? "Downloading…" : "All data"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
