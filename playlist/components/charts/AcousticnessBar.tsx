"use client"

import * as React from "react"
import { MetricBarChart } from "@/components/charts/MetricBarChart"
import type { Song } from "@/lib/types"

export function AcousticnessBar({ songs, loading }: { songs: Song[]; loading?: boolean }) {
  return (
    <MetricBarChart
      songs={songs}
      loading={loading}
      title="Acousticness"
      description="Per-song acousticness on the current page."
      metric="acousticness"
      yLabel="Acousticness"
      barClassName="fill-chart-3"
    />
  )
}
