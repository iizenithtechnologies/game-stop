from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient

app = FastAPI()

# MongoDB connection
client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client.gamestop


@app.get("/")
async def home():
    return {"message": "Game Stop Backend Running"}


@app.post("/games")
async def add_game(game: dict):
    result = await db.games.insert_one(game)
    return {"id": str(result.inserted_id)}


@app.get("/games")
async def get_games():
    games = []
    async for game in db.games.find():
        game["_id"] = str(game["_id"])
        games.append(game)
    return games