# Playlist Dashboard

A full-stack web app to browse, search, sort, rate, and export a music playlist catalog.

**Stack:** FastAPI + SQLite (backend) · Next.js 15 + Tailwind (frontend)

## Structure

```
playlistBE/   REST API — serves song data, handles ratings, exports CSV
playlist/     Dashboard UI — table, charts, search, detail page
playlist.json Source data loaded via the sync endpoint
```

## Quick Start

**1. Backend**
```bash
cd playlistBE
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python main.py
# API running at http://127.0.0.1:8000
```

**2. Frontend**
```bash
cd playlist
pnpm install
pnpm dev
# App running at http://localhost:3000
```

**3. Load data** — open the app and click **Sync Songs** to import `playlist.json` into the database.

## Features

- Browse all songs in a paginated, sortable table
- Search by song title
- Click any row to view full song details
- Rate songs with 1–5 stars
- Download current page or all songs as CSV
- Charts: danceability scatter, duration histogram, acousticness & tempo bar charts
