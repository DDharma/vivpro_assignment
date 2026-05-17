from fastapi import APIRouter
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends
from app.dependencies.db import get_db

router = APIRouter(prefix="/health", tags=["health"])


@router.get("/")
async def health_check():
    return {"status": "ok"}

@router.get("/db")
async def health_check(db: AsyncSession = Depends(get_db)):
    return {"status": "ok"}
