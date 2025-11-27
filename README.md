# CURA (큐라)

**"Spotify의 아카이빙 + Threads의 피드"**
CURA는 유튜브의 산만한 알고리즘에서 벗어나, 엄선된(Curated) 영상 콘텐츠를 몰입해서 즐길 수 있는 하이브리드 비디오 플랫폼입니다.

## 🌟 Project Concept
- **Hybrid UI**:
  - **Header (Spotify Style)**: 아티스트/주제의 정체성을 보여주는 웅장한 배너와 공식 인증 배지.
  - **Feed (Threads Style)**: 군더더기 없이 콘텐츠에만 집중할 수 있는 중앙 정렬 타임라인.
- **Smart Archiving**: YouTube URL만 입력하면 메타데이터를 자동으로 수집하여 나만의 컬렉션을 구축.
- **First Target**: 가수 **'공원(Gongwon)'**의 공식 영상 아카이브 페이지 구축.

## 🛠 Tech Stack

### Frontend
- **Core**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS v4 (CSS-first configuration), clsx, tailwind-merge
- **State Management**: TanStack Query (React Query) v5
- **Motion**: Framer Motion (Parallax & Micro-interactions)
- **Icons**: Lucide-React

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **Database**: PostgreSQL (Supabase)
- **ORM**: SQLModel (SQLAlchemy + Pydantic)
- **API**: YouTube Data API v3 (Video Metadata Fetching)

### Infrastructure
- **Database**: Supabase (PostgreSQL Connection Pooling)
- **Storage**: Supabase Storage (Images)

## 🚀 Current Status (Phase 1.5: Admin & Deployment)

### ✅ Completed Features
- [x] **Project Setup**: React+Vite Frontend & FastAPI Backend.
- [x] **Database**: Supabase PostgreSQL + Async SQLAlchemy.
- [x] **Backend Logic**:
  - YouTube Data API Integration (Video & Channel Metadata).
  - Bulk Import from YouTube Channels.
  - REST API for Collections and Videos.
- [x] **Frontend UI/UX**:
  - **MainLayout**: Responsive Sidebar/TabBar.
  - **CollectionPage**: Parallax Header, Infinite Scroll Feed.
  - **Admin Dashboard**: Collection Management, Bulk Video Import, Channel Scanning.
  - **Design System**: Dark mode, Glassmorphism, Micro-interactions.
- [x] **Deployment**:
  - Docker Containerization (Frontend & Backend).
  - AWS Lightsail Deployment Scripts.

## 🗺 Roadmap

### Phase 2: User Interaction (Next)
- [ ] **Authentication**: Supabase Auth (Login/Signup).
- [ ] **Social Features**: Likes, Comments.
- [ ] **Search**: Tag & Keyword search.

### Phase 3: Platform Expansion
- [ ] **User Collections**: User-generated playlists.
- [ ] **Analytics**: View counts, engagement metrics.

## 🏃‍♂️ Getting Started

### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
pnpm install
pnpm dev
```

### Environment Variables
Create `.env` files in `backend/` and `frontend/` based on the examples.

**Backend (`backend/.env`):**
```env
DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/db
YOUTUBE_API_KEY=your_key
CORS_ORIGINS=http://localhost:5173
```

**Frontend (`frontend/.env`):**
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## 🚢 Deployment (Docker & Lightsail)

We use Docker to containerize both the frontend (Nginx) and backend (FastAPI).

### 1. Setup
Ensure you have `docker-compose.yml` and the `scripts/` directory.
Create production env files:
- `backend/.env.production`
- `frontend/.env.production`

### 2. Deploy Script
Use the provided script to build, push, and deploy to AWS Lightsail.

```bash
# Copy the example script
cp scripts/deploy_lightsail.example.sh scripts/deploy_lightsail.sh

# Edit the script with your Server IP and SSH Key path
vi scripts/deploy_lightsail.sh

# Run deployment
./scripts/deploy_lightsail.sh <DOCKER_USERNAME>
```