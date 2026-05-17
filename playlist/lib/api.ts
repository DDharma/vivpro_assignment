import defaultAxios from "@/lib/default.axios";
import type { Song, SongListResponse, SyncResponse } from "@/lib/types";

export { API_BASE } from "@/lib/default.axios";

const list = (page = 1, limit = 1000, search_term?: string) =>
  defaultAxios
    .get<SongListResponse>(`/song/`, { params: { page, limit, search_term: search_term ?? "" } })
    .then((r) => r.data);

const get = (id: string) =>
  defaultAxios.get<Song>(`/song/${encodeURIComponent(id)}`).then((r) => r.data);

const getByTitle = (title: string) =>
  defaultAxios.get<Song>(`/song/by-title`, { params: { title } }).then((r) => r.data);

const rate = (song_id: string, rating: number) =>
  defaultAxios.post<Song>(`/song/give-rating`, { song_id, rating }).then((r) => r.data);

const sync = () =>
  defaultAxios.get<SyncResponse>(`/song/sync-songs`).then((r) => r.data);

const downloadCsv = (page: number) =>
  defaultAxios
    .get<Blob>(`/song/download-csv`, { params: { page }, responseType: "blob" })
    .then((r) => r.data);

export const songsApi = { list, get, getByTitle, rate, sync, downloadCsv };
