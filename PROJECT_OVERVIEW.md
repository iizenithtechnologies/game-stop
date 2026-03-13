# Project Overview

This repository is a small full-stack "Game Stop" app:

- Frontend: React 19 + TypeScript + Vite
- API: FastAPI running from `api/index.py`
- Database: MongoDB via Motor
- Deployment shape: Vercel-style frontend build with a Python API route in `api/`

The app currently supports:

- Listing games from MongoDB
- Adding a game with `name` and `price`

## High-Level Structure

```text
game-stop/
|- api/
|  `- index.py              # FastAPI app and MongoDB access
|- backend/
|  `- __pycache__/          # stale/generated artifact, no source code here
|- frontend/
|  |- src/
|  |  |- App.tsx            # main UI and API calls
|  |  |- main.tsx           # React entry point
|  |  |- index.css          # global styles
|  |  `- App.css            # leftover template styles, mostly unused by current UI
|  |- package.json
|  |- vite.config.ts
|  `- tsconfig*.json
|- .env
|- requirements.txt
`- vercel.json
```

## Runtime Flow

1. The React frontend loads and resolves the API base URL:
   - `VITE_API_BASE_URL` if provided
   - `http://127.0.0.1:8001` during local Vite dev
   - `/api` outside local dev
2. `frontend/src/App.tsx` fetches `GET /games` on mount.
3. Submitting the form sends `POST /games` with JSON `{ name, price }`.
4. `api/index.py` validates the payload with Pydantic.
5. The API reads/writes the `games` collection in MongoDB.

## Dependencies

### Python

Declared in `requirements.txt`:

- `fastapi`
- `uvicorn`
- `pymongo`
- `python-dotenv`
- `motor`
- `python-multipart`

How they are used:

- `fastapi`: API app and routing
- `uvicorn`: local ASGI server
- `motor`: async MongoDB client used by the app
- `python-dotenv`: loads `.env`
- `pymongo`: indirect Mongo dependency; Motor builds on it
- `python-multipart`: installed, but not currently used because the API only accepts JSON

### Frontend

Declared in `frontend/package.json`:

- Runtime:
  - `react`
  - `react-dom`
- Dev/build/tooling:
  - `vite`
  - `typescript`
  - `@vitejs/plugin-react`
  - `eslint`
  - `@eslint/js`
  - `typescript-eslint`
  - `eslint-plugin-react-hooks`
  - `eslint-plugin-react-refresh`
  - `globals`
  - `@types/node`
  - `@types/react`
  - `@types/react-dom`

## Libraries and Key Files

### API

File: `api/index.py`

- Creates `FastAPI(title="Game Stop API")`
- Enables CORS for:
  - `http://localhost:5173`
  - `http://127.0.0.1:5173`
- Loads environment variables with `load_dotenv()`
- Connects to MongoDB using:
  - `MONGO_URL`
  - `DB_NAME` defaulting to `gamestop`
- Defines `GamePayload`:
  - `name`: string, 1-120 chars
  - `price`: float, must be `> 0`
- Routes:
  - `GET /` returns health-style message
  - `GET /games` returns all games sorted by newest first
  - `POST /games` inserts a game and returns inserted id

### Frontend

File: `frontend/src/App.tsx`

- Holds local state for:
  - `games`
  - `name`
  - `price`
  - `error`
- Uses `fetch()` directly; no client library like Axios, React Query, or SWR
- Minimal UI:
  - form to add a game
  - list of available games
  - basic error text

File: `frontend/src/main.tsx`

- Mounts `<App />` inside `React.StrictMode`

File: `frontend/src/index.css`

- Contains broad global styling and some leftover theme/template styles

File: `frontend/src/App.css`

- Appears to come from a starter/template and is not meaningfully used by the current JSX

## Environment Variables

Currently present/expected:

- `MONGO_URL`: MongoDB connection string
- `DB_NAME`: database name
- `VITE_API_BASE_URL`: optional frontend API override

Notes:

- `.env` currently contains local Mongo settings.
- `VITE_API_BASE_URL` is referenced by the frontend but is not present in the root `.env` right now.

## Build and Run

### Frontend

From `frontend/`:

```bash
npm install
npm run dev
```

Other scripts:

- `npm run build`
- `npm run lint`
- `npm run preview`

### API

From repo root:

```bash
pip install -r requirements.txt
uvicorn api.index:app --reload --port 8001
```

### Deployment

`vercel.json` only defines the frontend build:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npm --prefix frontend ci && npm --prefix frontend run build",
  "outputDirectory": "frontend/dist"
}
```

Inference:

- The frontend is explicitly built from `frontend/`
- The `api/` directory is likely intended to be handled by Vercel's Python function routing conventions

## TypeScript and Linting

Frontend TypeScript config is strict:

- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`

Linting uses ESLint flat config with:

- base JS rules
- TypeScript ESLint recommended rules
- React Hooks rules
- React Refresh/Vite rules

## Current Limitations / Notes For Another Agent

- No tests are present for frontend or backend.
- No loading state is shown in the UI.
- Error handling is minimal and user-facing messages are generic.
- The frontend refetches the whole list after creating a game.
- There is no edit/delete functionality.
- Prices are displayed as `Rs.` in the UI, but currency handling is hardcoded.
- `backend/` does not contain active source code, only cached Python bytecode.
- Some CSS files appear to be inherited from a starter template and may be safe to simplify.

## Good Entry Points For Future Work

- Add backend tests for `GET /games` and `POST /games`
- Add frontend form validation and loading states
- Introduce a typed API helper module instead of inline `fetch()` calls
- Clean up unused template CSS/assets
- Add create/edit/delete flows and better empty-state UX

## Quick Summary

If another agent needs to work quickly:

- Main frontend logic lives in `frontend/src/App.tsx`
- Main backend logic lives in `api/index.py`
- MongoDB configuration comes from `.env`
- The app is small, direct, and easy to modify, but it currently has very little abstraction or test coverage
