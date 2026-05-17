from typing import Optional

from pydantic import BaseModel, Field


class SongSchema(BaseModel):
    id: str = Field(..., description="The unique identifier of the song")
    acousticness: float = Field(..., description="The acousticness of the song")
    class_: int = Field(..., alias="class", description="The class of the song")
    danceability: float = Field(..., description="The danceability of the song")
    duration_ms: int = Field(..., description="The duration of the song in milliseconds")
    energy: float = Field(..., description="The energy of the song")
    instrumentalness: float = Field(..., description="The instrumentalness of the song")
    key: int = Field(..., description="The key of the song")
    liveness: float = Field(..., description="The liveness of the song")
    loudness: float = Field(..., description="The loudness of the song")
    mode: int = Field(..., description="The mode of the song")
    num_bars: int = Field(..., description="The number of bars in the song")
    num_sections: int = Field(..., description="The number of sections in the song")
    num_segments: int = Field(..., description="The number of segments in the song")
    tempo: Optional[float] = Field(None, description="The tempo of the song")
    time_signature: Optional[int] = Field(None, description="The time signature of the song")
    title: Optional[str] = Field(None, description="The title of the song")
    valence: Optional[float] = Field(None, description="The valence of the song")

    class Config:
        from_attributes = True
        populate_by_name = True

class SongResponse(BaseModel):
    id: str
    acousticness: float
    class_: int
    danceability: float
    duration_ms: int
    energy: float
    instrumentalness: float
    key: int
    liveness: float
    loudness: float
    mode: int
    num_bars: int
    num_sections: int
    num_segments: int
    tempo: Optional[float]
    time_signature: Optional[int]
    title: Optional[str]
    valence: Optional[float]
    star_rating: Optional[int]

    class Config:
        from_attributes = True
        populate_by_name = True

class SyncSongResponse(BaseModel):
    message: str
    count: int

class SongListResponse(BaseModel):
    songs: list[SongResponse]
    total: int
    page: int
    limit: int

class Rating(BaseModel):
    song_id: str = Field(..., description="The unique identifier of the song")
    rating: int = Field(..., description="The rating for the song")
