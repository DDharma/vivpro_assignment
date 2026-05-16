export const CHART_DIMENSIONS = {
  width: 800,
  height: 400,
  margin: { top: 24, right: 24, bottom: 56, left: 64 },
} as const

export function innerSize(
  dims: typeof CHART_DIMENSIONS = CHART_DIMENSIONS,
): { innerWidth: number; innerHeight: number } {
  return {
    innerWidth: dims.width - dims.margin.left - dims.margin.right,
    innerHeight: dims.height - dims.margin.top - dims.margin.bottom,
  }
}

export const VIEW_BOX = `0 0 ${CHART_DIMENSIONS.width} ${CHART_DIMENSIONS.height}`
