# 🎮 Fun Games Zone

A colorful, accessible game hub for **kids**, **elders**, and **everyone**!
Built with **React + Vite + Tailwind CSS** (frontend) and **Python FastAPI** (backend).

---

## 🎯 Games

| Game | Who It's For | Description |
|------|-------------|-------------|
| 🎴 Memory Match | All Ages | Flip cards to find matching pairs |
| ⭕ Tic-Tac-Toe | All Ages | Classic X vs O — vs AI or 2 players |
| 🔢 Number Guessing | All Ages | Guess the secret number with hot/cold hints |
| 📝 Word Scramble | All Ages | Unscramble words — 5 categories, build streaks |
| 🐍 Snake | Kids / All | Classic snake — eat food, don't crash! |
| 🦔 Whack-a-Mole | Kids / Elders | Hit the moles, avoid bombs, build combos |
| 🌈 Simon Says | Kids / Elders | Watch & repeat the color sequence pattern |
| ➕ Math Quiz | All Ages | 10-question math quiz — 3 difficulty levels |

---

## 🚀 Getting Started

### Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
Opens at **http://localhost:3000**

### Backend (Python FastAPI) — Optional
```bash
cd backend
python3 -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```
API runs at **http://localhost:8001**
Docs at **http://localhost:8001/docs**

---

## 🏗️ Project Structure

```
fun-games-zone/
├── frontend/              # React + Vite + Tailwind
│   ├── src/
│   │   ├── App.jsx        # Home screen & navigation
│   │   ├── components/
│   │   │   ├── GameCard.jsx
│   │   │   └── GameHeader.jsx
│   │   └── games/
│   │       ├── MemoryMatch.jsx
│   │       ├── TicTacToe.jsx
│   │       ├── NumberGuessing.jsx
│   │       ├── WordScramble.jsx
│   │       ├── Snake.jsx
│   │       ├── WhackAMole.jsx
│   │       ├── SimonSays.jsx
│   │       └── MathQuiz.jsx
│   └── package.json
└── backend/               # Python FastAPI
    ├── main.py            # API: scores & leaderboards
    └── requirements.txt
```

---

## ✨ Features

- **Accessible for all ages** — large text, high contrast, simple controls
- **Category filter** — browse All Games, Kids, or Elders
- **Difficulty levels** — Easy / Medium / Hard in most games
- **Score tracking** — local high scores in every game
- **Mobile-friendly** — responsive design + touch controls for Snake
- **Python API** — leaderboard backend (optional)
