function escapeCell(value: unknown): string {
  if (value === null || value === undefined) return ""
  const str = String(value)
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function toCSV<T extends Record<string, unknown>>(
  rows: T[],
  columns: (keyof T)[],
): string {
  const header = columns.map(escapeCell).join(",")
  const body = rows
    .map((row) => columns.map((col) => escapeCell(row[col])).join(","))
    .join("\n")
  return `${header}\n${body}`
}

export function downloadCSV(filename: string, csv: string) {
  if (typeof window === "undefined") return
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
