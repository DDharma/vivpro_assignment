# Playlist FE

Next.js 15 frontend for the playlist dashboard. Fetches song data from the FastAPI backend and presents it as an interactive table with charts, search, and a detail view.

## Setup

```bash
pnpm install
```

## Run

```bash
pnpm dev
# http://localhost:3000
```

Requires the backend running at `http://127.0.0.1:8000`. Override with:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

## Key Pages

| Route | Description |
|-------|-------------|
| `/` | Main dashboard — table, search, charts |
| `/song/by-title/[title]` | Full detail view for a single song |

## Project Structure

```
app/                  Next.js pages (App Router)
components/songs/     Dashboard, table, search, rating, pagination
components/charts/    Recharts-based visualisations
components/ui/        Shared primitives (Button, Card, Input…)
lib/                  API client, types, sort/paginate/format utils
```
