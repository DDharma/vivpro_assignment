from fastapi import APIRouter, Depends
from app.dependencies.db import get_db
from app.services.song import song_service
from sqlalchemy.ext.asyncio import AsyncSession
from app.schema.song import Rating, SongListResponse, SyncSongResponse, SongResponse

router = APIRouter(prefix="/song", tags=["songs"])


@router.get("/", response_model=SongListResponse, status_code=200)
async def get_songs(
    page: int = 1,
    limit: int = 10,
    db: AsyncSession = Depends(get_db),
):
    return await song_service.get_songs(db, page=page, limit=limit)

@router.get("/sync-songs", response_model=SyncSongResponse, status_code=201)
async def sync_songs(db: AsyncSession = Depends(get_db)):
    return await song_service.sync_songs(db)

@router.get("/{id}", response_model=SongResponse, status_code=200)
async def get_song(id: str, db: AsyncSession = Depends(get_db)):
    return await song_service.get_song(db, id)

@router.post("/give-rating", response_model=SyncSongResponse, status_code=201)
async def give_rating(data: Rating, db: AsyncSession = Depends(get_db)):
    return await song_service.give_rating(db, data.song_id, data.rating)
