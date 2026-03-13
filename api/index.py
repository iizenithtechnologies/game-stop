import os
from typing import Annotated

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pydantic import BaseModel, Field

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME", "gamestop")

app = FastAPI(title="Game Stop API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = AsyncIOMotorClient(MONGO_URL) if MONGO_URL else None
db: AsyncIOMotorDatabase | None = client[DB_NAME] if client else None


class GamePayload(BaseModel):
    name: Annotated[str, Field(min_length=1, max_length=120)]
    price: Annotated[float, Field(gt=0)]


def get_db() -> AsyncIOMotorDatabase:
    if db is None:
        raise HTTPException(
            status_code=500,
            detail="Database is not configured. Set MONGO_URL and DB_NAME in the environment.",
        )

    return db


@app.get("/")
async def root():
    return {"message": "Game Stop API running"}


@app.get("/games")
async def get_games():
    database = get_db()
    games = []

    async for game in database.games.find().sort("_id", -1):
        game["_id"] = str(game["_id"])
        games.append(game)

    return games


@app.post("/games", status_code=201)
async def add_game(game: GamePayload):
    database = get_db()
    result = await database.games.insert_one(game.model_dump())
    return {"id": str(result.inserted_id)}
