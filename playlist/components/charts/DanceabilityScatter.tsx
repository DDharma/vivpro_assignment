"use client"

import * as React from "react"
import * as d3 from "d3"
import { ChartCard } from "@/components/charts/ChartCard"
import { CHART_DIMENSIONS, VIEW_BOX, innerSize } from "@/lib/d3/chart"
import { clearSvg, createTooltip } from "@/lib/d3/tooltip"
import { formatNumber, truncate } from "@/lib/format"
import type { Song } from "@/lib/types"

type Props = { songs: Song[]; loading?: boolean }

export function DanceabilityScatter({ songs, loading }: Props) {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const svgRef = React.useRef<SVGSVGElement | null>(null)

  React.useEffect(() => {
    if (!svgRef.current || !containerRef.current || songs.length === 0) return
    clearSvg(svgRef.current)
    const tooltip = createTooltip(containerRef.current)

    const { innerWidth, innerHeight } = innerSize()
    const { margin } = CHART_DIMENSIONS
    const svg = d3
      .select(svgRef.current)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    const x = d3
      .scaleLinear()
      .domain([0, songs.length - 1])
      .range([0, innerWidth])

    const y = d3.scaleLinear().domain([0, 1]).range([innerHeight, 0])

    svg
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(Math.min(10, songs.length)))
      .attr("color", "currentColor")

    svg.append("g").call(d3.axisLeft(y).ticks(5)).attr("color", "currentColor")

    svg
      .append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 40)
      .attr("text-anchor", "middle")
      .attr("class", "fill-muted-foreground text-xs")
      .text("Song index")

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -44)
      .attr("text-anchor", "middle")
      .attr("class", "fill-muted-foreground text-xs")
      .text("Danceability")

    svg
      .selectAll("circle")
      .data(songs)
      .enter()
      .append("circle")
      .attr("cx", (_, i) => x(i))
      .attr("cy", (d) => y(d.danceability))
      .attr("r", 5)
      .attr("class", "fill-primary/70 stroke-primary")
      .attr("stroke-width", 1)
      .on("mouseover", (event, d) =>
        tooltip.show(
          event,
          `<div class="font-medium">${d.title}</div><div>Danceability: ${formatNumber(d.danceability)}</div>`,
        ),
      )
      .on("mousemove", (event, d) =>
        tooltip.show(
          event,
          `<div class="font-medium">${d.title}</div><div>Danceability: ${formatNumber(d.danceability)}</div>`,
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
      title="Danceability"
      description="Per-song danceability across the current page."
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
          aria-label="Danceability scatter plot"
        />
      </div>
    </ChartCard>
  )
}

// reference truncate to avoid unused-import drift in shared file
void truncate
