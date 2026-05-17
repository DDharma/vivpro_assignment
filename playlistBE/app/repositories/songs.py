from sqlalchemy import func, select
from fastapi import HTTPException

from app.models.song import Song


class SongRepository:

    @staticmethod
    async def sync_songs(db, records):
        try:
            if not records:
                return {"message": "No songs to sync", "count": 0}

            incoming_ids = [r["id"] for r in records]
            existing_result = await db.execute(
                select(Song.id).where(Song.id.in_(incoming_ids))
            )
            existing_ids = {row[0] for row in existing_result.all()}

            new_records = [r for r in records if r["id"] not in existing_ids]
            if not new_records:
                return {"message": "All songs already exist", "count": 0}

            songs = [
                Song(
                    id=data["id"],
                    acousticness=data["acousticness"],
                    class_=data["class"],
                    danceability=data["danceability"],
                    duration_ms=data["duration_ms"],
                    energy=data["energy"],
                    instrumentalness=data["instrumentalness"],
                    key=data["key"],
                    liveness=data["liveness"],
                    loudness=data["loudness"],
                    mode=data["mode"],
                    num_bars=data["num_bars"],
                    num_sections=data["num_sections"],
                    num_segments=data["num_segments"],
                    tempo=data["tempo"],
                    time_signature=data["time_signature"],
                    title=data["title"],
                    valence=data["valence"],
                    star_rating=None,
                )
                for data in new_records
            ]
            db.add_all(songs)
            await db.commit()

            return {
                "message": "Songs synced successfully",
                "count": len(songs),
            }
        except Exception as e:
            await db.rollback()
            raise e
        
    @staticmethod
    async def get_song(db, song_id: str):
        result = await db.execute(select(Song).where(Song.id == song_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_all_songs(db, limit: int, offset: int):
        result = await db.execute(select(Song).limit(limit).offset(offset))
        songs = result.scalars().all()
        total = await db.scalar(select(func.count()).select_from(Song))
        return songs, total
    
    @staticmethod
    async def give_rating(db, song_id: str, rating: int):
        try:
            song = await SongRepository.get_song(db, song_id)
            if song is None:
                raise HTTPException(status_code=404, detail="Song not found")
            song.star_rating = rating
            db.add(song)
            await db.commit()
            return song
        except Exception as e:
            await db.rollback()
            raise e
        


song_repository = SongRepository()
