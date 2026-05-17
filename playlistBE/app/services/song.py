import csv
import io
import json
from pathlib import Path

from fastapi import HTTPException
from app.repositories.songs import song_repository

PLAYLIST_JSON = Path(__file__).resolve().parents[3] / "playlist.json"


class Song:

    @staticmethod
    async def sync_songs(db):
        with open(PLAYLIST_JSON) as f:
            data = json.load(f)
        indices = list(data["id"].keys())          # ["0", "1", "2", ...]
        records = []
        for i in indices:
            row_dict = {}
            for col in data:
                row_dict[col] = data[col][i]
            records.append(row_dict)
        return await song_repository.sync_songs(db, records)
    
    @staticmethod
    async def get_songs(db, page: int = 1, limit: int = 10, search: str = ''):
        if page < 1:
            page = 1
        if limit < 1:
            limit = 1
        offset = (page - 1) * limit
        songs, total = await song_repository.get_all_songs(db, limit=limit, offset=offset, search=search)
        return {"songs": songs, "total": total, "page": page, "limit": limit}
    
    @staticmethod
    async def get_song(db, id: str):
        return await song_repository.get_song(db, id)

    @staticmethod
    async def get_song_by_title(db, title: str):
        song = await song_repository.get_song_by_title(db, title)
        if song is None:
            raise HTTPException(status_code=404, detail="Song not found")
        return song
    
    @staticmethod
    async def give_rating(db, song_id: str, rating: int):
        if rating < 1 or rating > 5:
            raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
        if song_id is None:
            raise HTTPException(status_code=400, detail="Song ID must be provided")
        return await song_repository.give_rating(db, song_id, rating)     
    
    @staticmethod
    async def download_csv(db, page: int = 0):
        songs, total = await song_repository.download_csv(db, page=page)
        print(songs, total)

        if not songs:
            raise HTTPException(status_code=404, detail="No songs found")

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow([
            "id", "title", "acousticness", "class", "danceability", "duration_ms",
            "energy", "instrumentalness", "key", "liveness", "loudness", "mode",
            "num_bars", "num_sections", "num_segments", "star_rating", "tempo",
            "time_signature", "valence",
        ])
        for s in songs:
            writer.writerow([
                s.id, s.title, s.acousticness, s.class_, s.danceability, s.duration_ms,
                s.energy, s.instrumentalness, s.key, s.liveness, s.loudness, s.mode,
                s.num_bars, s.num_sections, s.num_segments, s.star_rating, s.tempo,
                s.time_signature, s.valence,
            ])
        output.seek(0)
        return output
    

song_service = Song()
 