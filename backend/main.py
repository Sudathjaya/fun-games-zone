"""
Fun Games Zone — Python FastAPI Backend
Tracks high scores and leaderboards for all games.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import json
import os

app = FastAPI(
    title="Fun Games Zone API",
    description="Backend for the Fun Games Zone — tracks high scores for all games!",
    version="1.0.0",
)

# Allow frontend to connect (add your Vercel URL to ALLOWED_ORIGINS env var)
allowed = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in allowed.split(",")],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- In-memory store (replace with SQLite for persistence) ---
SCORES_FILE = "scores.json"

def load_scores() -> dict:
    if os.path.exists(SCORES_FILE):
        with open(SCORES_FILE, "r") as f:
            return json.load(f)
    return {}

def save_scores(data: dict):
    with open(SCORES_FILE, "w") as f:
        json.dump(data, f, indent=2)

scores_db: dict = load_scores()

VALID_GAMES = {
    "memory", "tictactoe", "number", "word", "snake",
    "whackamole", "simon", "math",
}


# --- Models ---
class ScoreSubmit(BaseModel):
    game: str
    player: str = Field(default="Anonymous", max_length=20)
    score: int = Field(ge=0)
    extra: Optional[dict] = None  # e.g. {"moves": 12, "time": 45}


class ScoreEntry(BaseModel):
    player: str
    score: int
    extra: Optional[dict]
    timestamp: str


# --- Routes ---
@app.get("/")
def root():
    return {
        "message": "🎮 Fun Games Zone API is running!",
        "games": list(VALID_GAMES),
        "endpoints": ["/scores/{game}", "/scores/{game}/top"],
    }


@app.get("/scores/{game}", response_model=list[ScoreEntry])
def get_scores(game: str, limit: int = 10):
    """Get top scores for a specific game."""
    if game not in VALID_GAMES:
        raise HTTPException(status_code=404, detail=f"Game '{game}' not found.")
    entries = scores_db.get(game, [])
    sorted_entries = sorted(entries, key=lambda x: x["score"], reverse=True)
    return sorted_entries[:limit]


@app.post("/scores/{game}", response_model=ScoreEntry)
def submit_score(game: str, body: ScoreSubmit):
    """Submit a new score for a game."""
    if game not in VALID_GAMES:
        raise HTTPException(status_code=404, detail=f"Game '{game}' not found.")

    entry = {
        "player": body.player.strip() or "Anonymous",
        "score": body.score,
        "extra": body.extra or {},
        "timestamp": datetime.utcnow().isoformat(),
    }

    if game not in scores_db:
        scores_db[game] = []
    scores_db[game].append(entry)

    # Keep only top 100 per game
    scores_db[game] = sorted(scores_db[game], key=lambda x: x["score"], reverse=True)[:100]
    save_scores(scores_db)

    return entry


@app.get("/scores/{game}/top")
def get_top_score(game: str):
    """Get the all-time top score for a game."""
    if game not in VALID_GAMES:
        raise HTTPException(status_code=404, detail=f"Game '{game}' not found.")
    entries = scores_db.get(game, [])
    if not entries:
        return {"game": game, "top_score": 0, "player": None}
    top = max(entries, key=lambda x: x["score"])
    return {"game": game, "top_score": top["score"], "player": top["player"]}


@app.delete("/scores/{game}")
def clear_scores(game: str):
    """Clear all scores for a game (admin use)."""
    if game not in VALID_GAMES:
        raise HTTPException(status_code=404, detail=f"Game '{game}' not found.")
    scores_db[game] = []
    save_scores(scores_db)
    return {"message": f"Scores cleared for '{game}'"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
