from sqlalchemy import Column, Float, Integer, String

from app.core.database import Base


class Song(Base):
    __tablename__ = "songs"

    id = Column(String(512), primary_key=True, index=True)
    acousticness = Column(Float, nullable=False)
    class_ = Column("class", Integer, nullable=False)
    danceability = Column(Float, nullable=False)
    duration_ms = Column(Integer, nullable=False)
    energy = Column(Float, nullable=False)
    instrumentalness = Column(Float, nullable=False)
    key = Column(Integer, nullable=False)
    liveness = Column(Float, nullable=False)
    loudness = Column(Float, nullable=False)
    mode = Column(Integer, nullable=False)
    num_bars = Column(Integer, nullable=False)
    num_sections = Column(Integer, nullable=False)
    num_segments = Column(Integer, nullable=False)
    tempo = Column(Float, nullable=False)
    time_signature = Column(Integer, nullable=False)
    title = Column(String(512), nullable=False)
    valence = Column(Float, nullable=False)
    star_rating = Column(Integer, nullable=True)
