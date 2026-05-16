"use client"

import * as React from "react"
import { MetricBarChart } from "@/components/charts/MetricBarChart"
import type { Song } from "@/lib/types"

export function TempoBar({ songs, loading }: { songs: Song[]; loading?: boolean }) {
  return (
    <MetricBarChart
      songs={songs}
      loading={loading}
      title="Tempo"
      description="Per-song tempo (BPM) on the current page."
      metric="tempo"
      yLabel="Tempo (BPM)"
      barClassName="fill-chart-4"
    />
  )
}
