from fastapi import APIRouter

router = APIRouter(prefix="/songs", tags=["songs"])


@router.get("/")
async def get_songs():
    return {"songs": []}

@router.get("/{id}")
async def get_song(id: str):
    return {"songs": {"id": id}}

@router.post("/give-rating")
async def give_rating():
    return {"songs": {}}
