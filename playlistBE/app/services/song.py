from fastapi import HTTPException
from app.repositories.songs import song_repository

class Song:
    def get_songs(db, limit: int = 10, offset: int = 0):
        # Implement logic to fetch songs from the database
        return {"songs": []}
    
    def get_song(db, id: str):
        # Implement logic to fetch a specific song by ID from the database
        return {"song": {"id": id}} 
    
    def give_rating(db, song_id: str, rating: int):
        # Implement logic to update the song's rating in the database
        return {"song": {"id": song_id, "rating": rating}}      
    

song_service = Song()
