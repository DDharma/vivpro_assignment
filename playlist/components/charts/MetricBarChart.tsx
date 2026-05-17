"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"
import type { Song, SongColumn } from "@/lib/types"

const W = 700
const H = 300
const M = { top: 16, right: 20, bottom: 40, left: 52 }

type Props = {
  songs: Song[]
  metric: SongColumn
  label: string
  unit?: string
}

export function MetricBarChart({ songs, metric, label, unit = "" }: Props) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = d3.select(ref.current)
    svg.selectAll("*").remove()
    if (!songs.length) return

    const iw = W - M.left - M.right
    const ih = H - M.top - M.bottom
    const g = svg.append("g").attr("transform", `translate(${M.left},${M.top})`)

    const values = songs.map((s) => (s[metric] as number) ?? 0)
    const x = d3.scaleBand().domain(songs.map((_, i) => String(i))).range([0, iw]).padding(0.15)
    const y = d3.scaleLinear().domain([0, d3.max(values) ?? 1]).range([ih, 0]).nice()

    g.append("g")
      .attr("transform", `translate(0,${ih})`)
      .call(d3.axisBottom(x).tickValues([]).tickSizeOuter(0))

    g.append("g").call(d3.axisLeft(y).ticks(5).tickFormat((d) => `${d}${unit}`))

    g.append("text")
      .attr("x", iw / 2).attr("y", ih + 36)
      .attr("text-anchor", "middle").attr("font-size", 11).attr("fill", "currentColor")
      .text("Songs")

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -ih / 2).attr("y", -42)
      .attr("text-anchor", "middle").attr("font-size", 11).attr("fill", "currentColor")
      .text(label)

    g.selectAll("rect")
      .data(values)
      .join("rect")
      .attr("x", (_, i) => x(String(i))!)
      .attr("width", x.bandwidth())
      .attr("y", (d) => y(d))
      .attr("height", (d) => ih - y(d))
      .attr("fill", "hsl(var(--primary))")
      .attr("fill-opacity", 0.8)
  }, [songs, metric, label, unit])

  return <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full" />
}
