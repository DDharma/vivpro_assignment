import type { SortOrder } from "@/lib/types"

export function compareValues(a: unknown, b: unknown, order: SortOrder): number {
  if (a === b) return 0
  if (a === null || a === undefined) return 1
  if (b === null || b === undefined) return -1
  const dir = order === "asc" ? 1 : -1
  if (typeof a === "number" && typeof b === "number") return (a - b) * dir
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" }) * dir
}

export function sortBy<T>(items: T[], key: keyof T, order: SortOrder): T[] {
  const copy = items.slice()
  copy.sort((x, y) => compareValues(x[key], y[key], order))
  return copy
}

export function nextOrder(current: SortOrder | undefined, sameKey: boolean): SortOrder | undefined {
  if (!sameKey) return "asc"
  if (current === "asc") return "desc"
  return undefined
}
