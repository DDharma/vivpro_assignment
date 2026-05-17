"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"
import type { Song } from "@/lib/types"

const W = 700
const H = 300
const M = { top: 16, right: 20, bottom: 40, left: 48 }

type Props = { songs: Song[] }

export function DurationHistogram({ songs }: Props) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = d3.select(ref.current)
    svg.selectAll("*").remove()
    if (!songs.length) return

    const iw = W - M.left - M.right
    const ih = H - M.top - M.bottom
    const g = svg.append("g").attr("transform", `translate(${M.left},${M.top})`)

    const durations = songs.map((s) => s.duration_ms / 1000)
    const x = d3.scaleLinear().domain(d3.extent(durations) as [number, number]).range([0, iw]).nice()

    const bins = d3.bin().domain(x.domain() as [number, number]).thresholds(15)(durations)

    const y = d3.scaleLinear().domain([0, d3.max(bins, (b) => b.length) ?? 1]).range([ih, 0]).nice()

    g.append("g").attr("transform", `translate(0,${ih})`).call(
      d3.axisBottom(x).ticks(8).tickFormat((d) => `${+d}s`)
    )
    g.append("g").call(d3.axisLeft(y).ticks(5))

    g.append("text")
      .attr("x", iw / 2).attr("y", ih + 36)
      .attr("text-anchor", "middle").attr("font-size", 11).attr("fill", "currentColor")
      .text("Duration (seconds)")

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -ih / 2).attr("y", -36)
      .attr("text-anchor", "middle").attr("font-size", 11).attr("fill", "currentColor")
      .text("Count")

    g.selectAll("rect")
      .data(bins)
      .join("rect")
      .attr("x", (d) => x(d.x0!) + 1)
      .attr("width", (d) => Math.max(0, x(d.x1!) - x(d.x0!) - 1))
      .attr("y", (d) => y(d.length))
      .attr("height", (d) => ih - y(d.length))
      .attr("fill", "hsl(var(--primary))")
      .attr("fill-opacity", 0.8)
  }, [songs])

  return <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full" />
}
