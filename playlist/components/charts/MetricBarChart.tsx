"use client"

import * as React from "react"
import * as d3 from "d3"
import { ChartCard } from "@/components/charts/ChartCard"
import { CHART_DIMENSIONS, VIEW_BOX, innerSize } from "@/lib/d3/chart"
import { clearSvg, createTooltip } from "@/lib/d3/tooltip"
import { formatNumber, truncate } from "@/lib/format"
import type { Song } from "@/lib/types"

type Props = {
  songs: Song[]
  loading?: boolean
  title: string
  description?: string
  metric: keyof Pick<Song, "acousticness" | "tempo" | "energy" | "danceability">
  yLabel: string
  barClassName?: string
}

export function MetricBarChart({
  songs,
  loading,
  title,
  description,
  metric,
  yLabel,
  barClassName = "fill-chart-3",
}: Props) {
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
      .scaleBand<string>()
      .domain(songs.map((s) => s.id))
      .range([0, innerWidth])
      .padding(0.2)

    const maxVal = d3.max(songs, (s) => s[metric] as number) ?? 1
    const y = d3.scaleLinear().domain([0, maxVal]).nice().range([innerHeight, 0])

    svg
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(x)
          .tickFormat((id) => {
            const s = songs.find((song) => song.id === id)
            return s ? truncate(s.title, 12) : ""
          }),
      )
      .selectAll("text")
      .attr("transform", "rotate(-35)")
      .attr("text-anchor", "end")
      .attr("class", "fill-muted-foreground text-[10px]")

    svg.select<SVGGElement>("g").attr("color", "currentColor")
    svg.append("g").call(d3.axisLeft(y).ticks(5)).attr("color", "currentColor")

    svg
      .append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 48)
      .attr("text-anchor", "middle")
      .attr("class", "fill-muted-foreground text-xs")
      .text("Song")

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -44)
      .attr("text-anchor", "middle")
      .attr("class", "fill-muted-foreground text-xs")
      .text(yLabel)

    svg
      .selectAll("rect")
      .data(songs)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.id) ?? 0)
      .attr("y", (d) => y(d[metric] as number))
      .attr("width", x.bandwidth())
      .attr("height", (d) => innerHeight - y(d[metric] as number))
      .attr("class", barClassName)
      .on("mouseover", (event, d) =>
        tooltip.show(
          event,
          `<div class="font-medium">${d.title}</div><div>${yLabel}: ${formatNumber(d[metric] as number)}</div>`,
        ),
      )
      .on("mousemove", (event, d) =>
        tooltip.show(
          event,
          `<div class="font-medium">${d.title}</div><div>${yLabel}: ${formatNumber(d[metric] as number)}</div>`,
        ),
      )
      .on("mouseout", () => tooltip.hide())

    return () => {
      tooltip.destroy()
      clearSvg(svgRef.current)
    }
  }, [songs, metric, yLabel, barClassName])

  return (
    <ChartCard
      title={title}
      description={description}
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
          aria-label={`${title} bar chart`}
        />
      </div>
    </ChartCard>
  )
}
