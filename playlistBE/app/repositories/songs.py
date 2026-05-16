import uuid
from app.models.song import Song


class SongRepository:

    def add_song(title: str, artist: str):
        song_id = str(uuid.uuid4())
        song_repository.songs[song_id] = {"id": song_id, "title": title, "artist": artist}
        return song_repository.songs[song_id]

    def get_song( song_id: str):
        return song_repository.songs.get(song_id)

    def get_all_songs():
        return list(song_repository.songs.values())


song_repository = SongRepository()
