# SalesLens API

FastAPI backend for SalesLens: ingest Excel DSR files, persist sales data in PostgreSQL, and expose dashboard endpoints for the mobile app.

## Prerequisites

- Python 3.11+ (recommended)
- PostgreSQL running locally (default database name: `saleslens`)

## Setup

```bash
cd saleslens-api
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in `saleslens-api/` (optional — defaults exist in `app/config.py`):

```env
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/saleslens
JWT_SECRET=change-this-in-production
GEMINI_API_KEY=
DEBUG=true
UPLOAD_DIR=uploads
```

Environment variable names follow Pydantic Settings (uppercase versions of the fields in `app/config.py`).

## Run

From `saleslens-api/`:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- Health check: [http://localhost:8000/health](http://localhost:8000/health)
- OpenAPI docs: [http://localhost:8000/docs](http://localhost:8000/docs)

Uploaded files are stored under `uploads/` (created on startup). Sample `.xlsx` files in that folder are gitignored.

## Tests

```bash
pytest
```

## Main endpoints

| Area | Prefix |
|------|--------|
| Excel upload | `/upload/` |
| Dashboard (summary, trends, MTD, etc.) | `/dashboard/` |

See `app/routers/` for route definitions.
