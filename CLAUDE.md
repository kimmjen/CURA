# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

CURA is a YouTube video curation platform ("Spotify-style archiving + Threads-style feed"). The first target is an official archive page for the artist "공원 (Gongwon)". Core flow: admin adds a YouTube channel → backend pulls metadata via YouTube Data API v3 → videos are auto-classified (MV/LIVE/INTERVIEW/SHORTS/FANCAM/BEHIND/VLOG/ETC) → frontend renders a parallax, infinite-scroll feed.

## Repo layout — two parallel stacks

The repo contains **two frontends and two backends** that implement the same product. Before editing, confirm which stack the current task targets (check `docker-compose.yml` vs `docker-compose.new.yml` and the deploy script name).

| Stack | Frontend | Backend | Compose file | Deploy script |
|---|---|---|---|---|
| **Active / new** | `app/` (React + Vite + Storybook + Supabase JS) | `backend-spring/` (Spring Boot 3.2, Java 17, Gradle, JPA) | `docker-compose.new.yml` | `scripts/deploy_new.sh` |
| **Legacy** | `frontend/` (React + Vite) | `backend/` (FastAPI, SQLModel, asyncpg) | `docker-compose.yml` | `scripts/deploy_lightsail.sh` |

The frontend API client (`frontend/src/api/index.ts`) is deliberately backend-agnostic — it accepts both the Spring Boot envelope shape (`{ collections: [...] }`, `{ videos: [], total, skip, limit, has_more }`) and the FastAPI array/object shapes. Preserve that dual support when editing API calls unless the task explicitly drops one backend.

Both backends expose their routes under the `/api` prefix and both default to port 8000 (FastAPI local) / 8001 (containerized, Spring Boot). The frontend points at `VITE_API_BASE_URL` (e.g. `http://localhost:8001/api`).

## Commands

### FastAPI backend (`backend/`)
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload          # serves on :8000, docs at /docs
```
Must be run from inside `backend/` — `core/config.py` loads `.env` from `.`, `backend/`, or `../`, and imports use bare `core.*` / `api.*` paths (no package prefix). There is no test suite; schema changes are applied via the hand-written `migrate_*.py` scripts in `backend/` (run with `python migrate_<name>.py`). `init_db()` auto-runs `SQLModel.metadata.create_all` on startup, so new tables appear without a migration but column changes do not.

### Spring Boot backend (`backend-spring/`)
```bash
cd backend-spring
cp .env.example .env               # DATABASE_URL, YOUTUBE_API_KEY, etc.
./gradlew bootRun                  # serves on :8001, swagger at /swagger-ui.html
./gradlew build                    # jar → build/libs/*.jar
./gradlew test                     # run the test task
```
Requires JDK 17. Uses Lombok (annotation processor) + Spring Data JPA + `dotenv-java`; `application-production.yml` is activated via `SPRING_PROFILES_ACTIVE=production`.

### Frontend (both `app/` and `frontend/`)
Both use pnpm. Commands are identical; only `app/` has Storybook.
```bash
cd app        # or: cd frontend
pnpm install
pnpm dev       # Vite dev server on :5173
pnpm build     # tsc -b && vite build
pnpm lint      # eslint .
pnpm preview
# app/ only:
pnpm storybook          # :6006
pnpm build-storybook
```
There is no frontend test runner wired up.

### Docker / deployment
```bash
docker-compose -f docker-compose.new.yml up --build     # active stack
docker-compose up --build                                # legacy stack
./scripts/deploy_new.sh <docker_user> <public_ip> <ssh_key>
```

## Architecture notes

**Supabase transaction pooler quirk.** `backend/core/database.py` detects Supabase pooler ports (`:6543`, `:6432`) and forces `statement_cache_size=0` + appends `prepared_statement_cache_size=0` to the URL. asyncpg breaks on transaction poolers without this. Preserve this logic when touching DB setup.

**Config loading.** FastAPI config (`backend/core/config.py`) uses `pydantic-settings` with strict validators — missing `DATABASE_URL` / `YOUTUBE_API_KEY` or an unknown `ENV` value will fail startup with a clear error. `SUPABASE_KEY_FINAL` falls back from `SUPABASE_SERVICE_KEY` to `SUPABASE_KEY`. `ASYNC_DATABASE_URL` auto-rewrites `postgresql://` → `postgresql+asyncpg://`.

**FastAPI error model.** `backend/main.py` registers handlers for a custom exception tree in `core/exceptions.py` (`ResourceNotFoundError`, `ValidationError`, `ExternalAPIError`, `ConfigurationError`, `StorageError`, `CURAException`). Raise these from services/routers instead of `HTTPException` so the response envelope stays consistent and error details are masked outside `development`.

**Data model.** Two tables: `collections` (type = OFFICIAL | USER, holds `official_link` to a YouTube channel) and `videos` (FK to collections, `category` enum, `duration_seconds`, `published_at`). Category values must stay in sync across `backend/core/models.py::VideoCategory`, the Spring Boot entity, and the frontend filters.

**Frontend routing.** The app auto-redirects `/` → `/collection/1` (`frontend/src/App.tsx`), i.e. collection id 1 is assumed to exist (seeded via `backend/seed.py`). Admin routes (`/admin/*`) are self-contained and do not use `MainLayout`.

**Image uploads** go through the backend's `/api/upload` router, which writes to Supabase Storage — not the local `backend/uploads/` directory (that path exists as a Docker volume mount for legacy/fallback use only).

## What's tracked elsewhere

- README.md — full API reference (request/response shapes for every endpoint), deployment walkthrough, phase roadmap.
- CHANGELOG.md — release notes.
- backend-spring/README.md — Spring Boot setup, Kotlin-vs-Java notes.
- `PROMPT_*.md`, `check.md`, `r.md`, `t.md`, `w.md` — scratch/prompt files at the repo root; not load-bearing.
