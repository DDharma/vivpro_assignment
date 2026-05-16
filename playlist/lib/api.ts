import type {
  PaginatedSongs,
  Song,
  SongsQuery,
  ApiError,
} from "@/lib/types"

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000"

export class ApiClientError extends Error {
  status: number
  payload: ApiError | null

  constructor(message: string, status: number, payload: ApiError | null = null) {
    super(message)
    this.name = "ApiClientError"
    this.status = status
    this.payload = payload
  }
}

async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const url = `${API_URL}${path.startsWith("/") ? path : `/${path}`}`
  let res: Response
  try {
    res = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
      },
    })
  } catch (cause) {
    throw new ApiClientError(
      "Network error — is the backend running?",
      0,
      null,
    )
  }

  const text = await res.text()
  const body = text ? (JSON.parse(text) as unknown) : null

  if (!res.ok) {
    const payload = (body ?? null) as ApiError | null
    throw new ApiClientError(
      payload?.error ?? `Request failed (${res.status})`,
      res.status,
      payload,
    )
  }

  return body as T
}

function buildQuery(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue
    search.set(k, String(v))
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ""
}

export const api = {
  listSongs(query: SongsQuery = {}) {
    const qs = buildQuery({
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      sort_by: query.sort_by,
      order: query.order,
    })
    return request<PaginatedSongs>(`/songs${qs}`)
  },
  searchSong(title: string) {
    const qs = buildQuery({ title })
    return request<Song>(`/songs/search${qs}`)
  },
  rateSong(id: string, star_rating: number) {
    return request<Song>(`/songs/${encodeURIComponent(id)}/rating`, {
      method: "PATCH",
      body: JSON.stringify({ star_rating }),
    })
  },
}
