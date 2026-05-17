# Playlist BE

FastAPI backend that serves song data from a SQLite database. Songs are loaded from `playlist.json` via a sync endpoint and stored locally — no external database needed.

## Setup

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run

```bash
python main.py
# http://127.0.0.1:8000
```

On first run the database is created automatically. Hit the sync endpoint (or use the UI button) to populate it.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/song/` | List songs — supports `page`, `limit`, `search_term` |
| GET | `/api/v1/song/by-title?title=` | Get a single song by exact title |
| GET | `/api/v1/song/sync-songs` | Import songs from `playlist.json` into DB |
| GET | `/api/v1/song/download-csv?page=` | Export CSV — `page=0` exports all songs |
| POST | `/api/v1/song/give-rating` | Set star rating (1–5) for a song |

## Project Structure

```
app/
  api/          Route handlers
  models/       SQLAlchemy ORM models
  repositories/ Raw DB queries
  services/     Business logic
  schema/       Pydantic request/response models
  core/         DB engine and config
main.py         App entry point
```
