import uvicorn
from fastapi import FastAPI
from app.core.database import engine, Base
from app.models.song import Song
from app.api import health, songs

app = FastAPI()

# Register it with a prefix
app.include_router(health.router, prefix="/api/v1")
app.include_router(songs.router, prefix="/api/v1")



@app.on_event("startup")
async def startup_event():
    # Initialize database connections, load models, etc.
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    pass


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
