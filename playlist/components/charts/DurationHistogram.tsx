"use client"

import * as React from "react"
import * as d3 from "d3"
import { ChartCard } from "@/components/charts/ChartCard"
import { CHART_DIMENSIONS, VIEW_BOX, innerSize } from "@/lib/d3/chart"
import { clearSvg, createTooltip } from "@/lib/d3/tooltip"
import type { Song } from "@/lib/types"

type Props = { songs: Song[]; loading?: boolean }

export function DurationHistogram({ songs, loading }: Props) {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const svgRef = React.useRef<SVGSVGElement | null>(null)

  React.useEffect(() => {
    if (!svgRef.current || !containerRef.current || songs.length === 0) return
    clearSvg(svgRef.current)
    const tooltip = createTooltip(containerRef.current)

    const durations = songs.map((s) => s.duration_ms / 1000)
    const { innerWidth, innerHeight } = innerSize()
    const { margin } = CHART_DIMENSIONS

    const svg = d3
      .select(svgRef.current)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    const [min = 0, max = 1] = d3.extent(durations) as [number, number]
    const x = d3.scaleLinear().domain([min, max]).nice().range([0, innerWidth])

    const bins = d3.bin<number, number>().domain(x.domain() as [number, number]).thresholds(10)(
      durations,
    )

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(bins, (b) => b.length) ?? 1])
      .nice()
      .range([innerHeight, 0])

    svg
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(8))
      .attr("color", "currentColor")

    svg.append("g").call(d3.axisLeft(y).ticks(5)).attr("color", "currentColor")

    svg
      .append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 40)
      .attr("text-anchor", "middle")
      .attr("class", "fill-muted-foreground text-xs")
      .text("Duration (seconds)")

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -44)
      .attr("text-anchor", "middle")
      .attr("class", "fill-muted-foreground text-xs")
      .text("Song count")

    svg
      .selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.x0 ?? 0) + 1)
      .attr("y", (d) => y(d.length))
      .attr("width", (d) => Math.max(0, x(d.x1 ?? 0) - x(d.x0 ?? 0) - 1))
      .attr("height", (d) => innerHeight - y(d.length))
      .attr("class", "fill-chart-2")
      .on("mouseover", (event, d) =>
        tooltip.show(
          event,
          `<div>${(d.x0 ?? 0).toFixed(1)}–${(d.x1 ?? 0).toFixed(1)}s</div><div>${d.length} song${d.length === 1 ? "" : "s"}</div>`,
        ),
      )
      .on("mousemove", (event, d) =>
        tooltip.show(
          event,
          `<div>${(d.x0 ?? 0).toFixed(1)}–${(d.x1 ?? 0).toFixed(1)}s</div><div>${d.length} song${d.length === 1 ? "" : "s"}</div>`,
        ),
      )
      .on("mouseout", () => tooltip.hide())

    return () => {
      tooltip.destroy()
      clearSvg(svgRef.current)
    }
  }, [songs])

  return (
    <ChartCard
      title="Duration distribution"
      description="Histogram of song duration (seconds), 10 bins."
      loading={loading}
      empty={!loading && songs.length === 0}
    >
      <div ref={containerRef} className="relative w-full">
        <svg
          ref={svgRef}
          viewBox={VIEW_BOX}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-auto"
          role="img"
          aria-label="Duration histogram"
        />
      </div>
    </ChartCard>
  )
}
