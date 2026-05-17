export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize
  return items.slice(start, start + pageSize)
}

export function totalPages(total: number, pageSize: number): number {
  if (total <= 0 || pageSize <= 0) return 1
  return Math.max(1, Math.ceil(total / pageSize))
}

export function clampPage(page: number, total: number, pageSize: number): number {
  const max = totalPages(total, pageSize)
  if (page < 1) return 1
  if (page > max) return max
  return page
}
