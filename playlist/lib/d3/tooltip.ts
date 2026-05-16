import * as d3 from "d3"

export type Tooltip = {
  show: (event: MouseEvent, html: string) => void
  hide: () => void
  destroy: () => void
}

export function createTooltip(container: HTMLElement): Tooltip {
  const node = document.createElement("div")
  node.className =
    "pointer-events-none absolute z-50 hidden rounded-md border bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md"
  container.appendChild(node)

  function show(event: MouseEvent, html: string) {
    const rect = container.getBoundingClientRect()
    node.innerHTML = html
    node.style.left = `${event.clientX - rect.left + 12}px`
    node.style.top = `${event.clientY - rect.top + 12}px`
    node.classList.remove("hidden")
  }

  function hide() {
    node.classList.add("hidden")
  }

  function destroy() {
    node.remove()
  }

  return { show, hide, destroy }
}

export function clearSvg(ref: SVGSVGElement | null) {
  if (!ref) return
  d3.select(ref).selectAll("*").remove()
}
