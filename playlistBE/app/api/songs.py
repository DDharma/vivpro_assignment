from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from app.dependencies.db import get_db
from app.services.song import song_service
from sqlalchemy.ext.asyncio import AsyncSession
from app.schema.song import Rating, SongListResponse, SyncSongResponse, SongResponse

router = APIRouter(prefix="/song", tags=["songs"])


@router.get("/", response_model=SongListResponse, status_code=200)
async def get_songs(
    page: int = 1,
    limit: int = 10,
    search_term: str = '',
    db: AsyncSession = Depends(get_db),
):
    return await song_service.get_songs(db, page=page, limit=limit, search=search_term)

@router.get("/sync-songs", response_model=SyncSongResponse, status_code=201)
async def sync_songs(db: AsyncSession = Depends(get_db)):
    return await song_service.sync_songs(db)

@router.get('/download-csv')
async def download_csv(page: int = 0, db: AsyncSession = Depends(get_db)):
    output = await song_service.download_csv(db, page=page)
    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=songs.csv"},
    )

@router.get("/by-title", response_model=SongResponse, status_code=200)
async def get_song_by_title(title: str, db: AsyncSession = Depends(get_db)):
    return await song_service.get_song_by_title(db, title)

@router.get("/{id}", response_model=SongResponse, status_code=200)
async def get_song(id: str, db: AsyncSession = Depends(get_db)):
    return await song_service.get_song(db, id)

@router.post("/give-rating", response_model=SongResponse, status_code=200)
async def give_rating(data: Rating, db: AsyncSession = Depends(get_db)):
    return await song_service.give_rating(db, data.song_id, data.rating)


