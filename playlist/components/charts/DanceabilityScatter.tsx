"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"
import type { Song } from "@/lib/types"

const W = 700
const H = 300
const M = { top: 16, right: 20, bottom: 40, left: 48 }

type Props = { songs: Song[] }

export function DanceabilityScatter({ songs }: Props) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = d3.select(ref.current)
    svg.selectAll("*").remove()
    if (!songs.length) return

    const iw = W - M.left - M.right
    const ih = H - M.top - M.bottom
    const g = svg.append("g").attr("transform", `translate(${M.left},${M.top})`)

    const x = d3.scaleLinear().domain([0, songs.length - 1]).range([0, iw])
    const y = d3.scaleLinear().domain([0, 1]).range([ih, 0])

    g.append("g").attr("transform", `translate(0,${ih})`).call(
      d3.axisBottom(x).ticks(6).tickFormat((d) => `#${+d + 1}`)
    )
    g.append("g").call(d3.axisLeft(y).ticks(5))

    g.append("text")
      .attr("x", iw / 2).attr("y", ih + 36)
      .attr("text-anchor", "middle").attr("font-size", 11).attr("fill", "currentColor")
      .text("Song index")

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -ih / 2).attr("y", -36)
      .attr("text-anchor", "middle").attr("font-size", 11).attr("fill", "currentColor")
      .text("Danceability")

    g.selectAll("circle")
      .data(songs)
      .join("circle")
      .attr("cx", (_, i) => x(i))
      .attr("cy", (d) => y(d.danceability))
      .attr("r", 4)
      .attr("fill", "hsl(var(--primary))")
      .attr("fill-opacity", 0.7)
  }, [songs])

  return <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full" />
}
