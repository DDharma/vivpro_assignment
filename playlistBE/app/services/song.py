from fastapi import HTTPException
from app.repositories.songs import song_repository
import json
from pathlib import Path

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
    async def get_songs(db, page: int = 1, limit: int = 10):
        if page < 1:
            page = 1
        if limit < 1:
            limit = 1
        offset = (page - 1) * limit
        songs, total = await song_repository.get_all_songs(db, limit=limit, offset=offset)
        return {"songs": songs, "total": total, "page": page, "limit": limit}
    
    @staticmethod
    async def get_song(db, id: str):
        return await song_repository.get_song(db, id)
    
    @staticmethod
    async def give_rating(db, song_id: str, rating: int):
        if rating < 1 or rating > 5:
            raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
        if song_id is None:
            raise HTTPException(status_code=400, detail="Song ID must be provided")
        return await song_repository.give_rating(db, song_id, rating)     
    

song_service = Song()
