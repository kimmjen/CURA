# CURA (큐라)

YouTube 비디오 큐레이션 플랫폼

> [!NOTE]
> **현재 컨셉**: "Spotify의 아카이빙 + Threads의 피드"  
> 이 컨셉은 잠정적이며 프로젝트 진행에 따라 변경될 수 있습니다.

## 🎯 프로젝트 개요

**CURA**는 엄선된(Curated) YouTube 영상 콘텐츠를 컬렉션으로 관리하고 세련된 피드로 감상할 수 있는 플랫폼입니다.

### 핵심 기능
- **Smart Archiving**: YouTube URL만 입력하면 메타데이터 자동 수집
- **컬렉션 관리**: 주제/아티스트별로 영상 체계적으로 정리
- **세련된 UI/UX**: Parallax 헤더, 무한 스크롤 피드
- **카테고리 자동 분류**: MV, LIVE, INTERVIEW, SHORTS, FANCAM 등
- **관리자 대시보드**: 채널 스캔, 일괄 추가, 통계

### 첫 번째 타겟
가수 **'공원(Gongwon)'**의 공식 영상 아카이브 페이지 구축

---

## 🛠 Tech Stack

### Frontend
| 기술 | 버전 | 용도 |
|------|------|------|
| React | 19.2.0 | UI 라이브러리 |
| Vite | 7.2.4 | 빌드 도구 |
| TypeScript | 5.9.3 | 타입 안정성 |
| Tailwind CSS | v4 | 스타일링 (CSS-first) |
| TanStack Query | v5 | 서버 상태 관리 |
| Framer Motion | - | 애니메이션 & Parallax |
| React Router | v7 | 라우팅 |

### Backend
| 기술 | 버전 | 용도 |
|------|------|------|
| FastAPI | 0.122.0 | 웹 프레임워크 |
| Python | 3.10+ | 런타임 |
| SQLModel | - | ORM (SQLAlchemy + Pydantic) |
| PostgreSQL | - | 데이터베이스 |
| asyncpg | - | 비동기 DB 드라이버 |

### External Services
- **YouTube Data API v3**: 비디오 메타데이터 자동 수집
- **Supabase**: PostgreSQL 호스팅 + 이미지 스토리지

### Infrastructure
- **Docker**: 컨테이너화
- **AWS Lightsail**: 배포 환경
- **Nginx**: 프론트엔드 리버스 프록시

---

## 📁 프로젝트 구조

```
CURA/
├── backend/                 # FastAPI 백엔드
│   ├── api/routers/        # API 엔드포인트
│   │   ├── collections.py  # 컬렉션 CRUD, 채널 스캔
│   │   ├── videos.py       # 비디오 CRUD
│   │   ├── upload.py       # 이미지 업로드
│   │   ├── search.py       # 검색 기능
│   │   └── stats.py        # 통계 API
│   ├── core/               # 핵심 모듈
│   │   ├── models.py       # SQLModel 데이터베이스 모델
│   │   ├── database.py     # DB 연결 관리
│   │   ├── config.py       # 환경 설정
│   │   └── ...
│   ├── services/           # 비즈니스 로직
│   └── main.py            # FastAPI 엔트리포인트
│
├── frontend/               # React + Vite 프론트엔드
│   ├── src/
│   │   ├── components/    # 재사용 컴포넌트
│   │   ├── features/      # 피처별 컴포넌트
│   │   ├── pages/         # 페이지 컴포넌트
│   │   └── api/           # API 클라이언트
│   └── nginx.conf         # Nginx 설정
│
├── scripts/               # 배포 스크립트
└── docker-compose.yml     # Docker 오케스트레이션
```

---

## 🗄️ 데이터베이스 스키마

### Collection
```sql
- id (PK)
- type (OFFICIAL | USER)
- title
- description
- cover_image_url
- profile_image_url
- official_link          -- YouTube 채널 링크
- created_at
```

### Video
```sql
- id (PK)
- collection_id (FK)
- youtube_video_id
- title
- channel_name
- thumbnail_url
- description
- comment                -- 사용자 코멘트
- category (enum)        -- MV, LIVE, INTERVIEW, SHORTS, FANCAM, BEHIND, VLOG, ETC
- duration_seconds
- published_at
```

---

## 🔌 API 엔드포인트

> API 문서: `http://localhost:8000/docs` (Swagger UI)

### Collections API (`/api/collections`)

#### `GET /api/collections`
전체 컬렉션 목록 조회 (비디오 카운트 포함)

**응답**: 컬렉션 배열, 각 컬렉션의 비디오 개수 포함

---

#### `POST /api/collections`
새 컬렉션 생성

**요청 Body**:
```json
{
  "title": "컬렉션 제목",
  "description": "설명",
  "type": "OFFICIAL" | "USER",
  "cover_image_url": "https://...",
  "profile_image_url": "https://...",
  "official_link": "https://youtube.com/@channel"
}
```

---

#### `GET /api/collections/{id}`
특정 컬렉션 조회

**응답**: 컬렉션 정보 + 비디오 개수

---

#### `PUT /api/collections/{id}`
컬렉션 정보 수정

**요청 Body**: 수정할 필드만 포함 (`exclude_unset=True`)

---

#### `DELETE /api/collections/{id}`
컬렉션 삭제 (연결된 모든 비디오도 함께 삭제 - CASCADE)

---

#### `GET /api/collections/{id}/videos`
컬렉션의 비디오 목록 조회 (페이지네이션 + 필터링)

**쿼리 파라미터**:
- `skip` (기본값: 0): 건너뛸 비디오 수
- `limit` (기본값: 20): 한 페이지당 비디오 수
- `category` (선택): 카테고리 필터 (MV, LIVE, INTERVIEW 등)

**응답**:
```json
{
  "videos": [...],
  "total": 100
}
```

---

#### `POST /api/collections/{id}/videos`
컬렉션에 비디오 추가

**요청 Body**:
```json
{
  "youtube_video_id": "dQw4w9WgXcQ",
  "title": "비디오 제목",
  "channel_name": "채널명",
  "thumbnail_url": "https://...",
  "description": "비디오 설명",
  "comment": "사용자 코멘트",
  "category": "MV",
  "duration_seconds": 240,
  "published_at": "2024-01-01T00:00:00Z"
}
```

---

#### `DELETE /api/collections/{id}/videos/all`
컬렉션의 모든 비디오 삭제 (컬렉션은 유지)

---

#### `GET /api/collections/{id}/channel-info`
컬렉션의 `official_link`에서 YouTube 채널 정보 조회

**응답**: YouTube API에서 가져온 채널 정보 (제목, 설명, 구독자 수 등)

---

#### `POST /api/collections/{id}/import`
YouTube 채널에서 비디오 일괄 가져오기

**요청 Body**:
```json
{
  "limit": 5000,                              // 기본값: 5000
  "custom_channel_url": "https://...",        // (선택) official_link 대신 사용할 URL
  "default_category": "MV"                    // (선택) 자동 분류 실패 시 기본 카테고리
}
```

**응답**:
```json
{
  "message": "Successfully imported 10 videos.",
  "imported_count": 10
}
```

---

### Videos API (`/api/videos`)

#### `POST /api/videos/parse?url=<youtube-url>`
YouTube URL에서 메타데이터 파싱 (DB 저장 없음)

**응답**: YouTube API에서 추출한 비디오 메타데이터

---

#### `PUT /api/videos/{id}`
비디오 정보 수정 (제목, 코멘트, 카테고리 등)

**요청 Body**: 수정할 필드만 포함 (`exclude_unset=True`)

---

#### `DELETE /api/videos/{id}`
비디오 삭제

---

### Search API (`/api/search`)

#### `GET /api/search/videos`
비디오 검색 (제목, 설명 기준)

**쿼리 파라미터**:
- `q` (필수): 검색어
- `skip` (기본값: 0): 페이지네이션 오프셋
- `limit` (기본값: 20): 페이지 크기

**응답**:
```json
{
  "videos": [...],
  "total": 15
}
```

**검색 동작**: PostgreSQL ILIKE 쿼리 (대소문자 무시)

---

#### `GET /api/search/collections`
컬렉션 검색 (제목, 설명 기준)

**쿼리 파라미터**: 비디오 검색과 동일

---

### Upload API (`/api/upload`)

#### `POST /api/upload/image`
이미지 파일을 Supabase Storage에 업로드

**요청**: `multipart/form-data`
- `file`: 이미지 파일

**응답**:
```json
{
  "url": "https://supabase.co/storage/v1/object/public/..."
}
```

---

### Stats API (`/api/stats`)

#### `GET /api/stats`
전체 통계 조회

**응답**:
```json
{
  "total_collections": 5,
  "total_videos": 120,
  "category_distribution": [
    {"category": "MV", "count": 30},
    {"category": "LIVE", "count": 25},
    ...
  ],
  "recent_videos": [...]  // 최근 10개
}
```

---

## ✨ 주요 기능

### 1. YouTube 자동 메타데이터 수집
- YouTube Data API v3 통합
- 비디오 제목, 설명, 썸네일, 재생시간 자동 추출
- 채널 전체 스캔 기능 (최대 50개)

### 2. 카테고리 자동 분류
제목 키워드 기반 자동 카테고리 할당:
- **MV**: 뮤직비디오
- **LIVE**: 라이브 공연
- **INTERVIEW**: 인터뷰
- **SHORTS**: 숏츠
- **FANCAM**: 팬캠
- **BEHIND**: 비하인드
- **VLOG**: 브이로그
- **ETC**: 기타

### 3. Parallax 헤더 & 무한 스크롤
- Framer Motion 기반 Parallax 효과
- React Query + Intersection Observer 무한 스크롤

### 4. 관리자 대시보드
- 📊 통계 대시보드 (카테고리별 분포, 최근 비디오)
- ➕ 컬렉션 생성/관리
- 🔍 YouTube 채널 스캔
- 📦 비디오 일괄 추가/삭제
- 🏷️ 카테고리 필터링

### 5. 검색 기능
- 실시간 비디오/컬렉션 검색
- PostgreSQL ILIKE 쿼리 (대소문자 무시)

---

## 🚀 Getting Started

### 환경 변수 설정

#### Backend (`.env` 또는 `.env.production`)
```env
DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/db
YOUTUBE_API_KEY=your_youtube_api_key
CORS_ORIGINS=http://localhost:5173,https://yourdomain.com
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
ENV=development  # or production
```

#### Frontend (`.env` 또는 `.env.production`)
```env
VITE_API_BASE_URL=http://localhost:8000/api  # or production URL
VITE_SENTRY_DSN=your_sentry_dsn  # Optional
```

### 로컬 개발

#### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```
→ `http://localhost:8000`

#### Frontend
```bash
cd frontend
pnpm install
pnpm dev
```
→ `http://localhost:5173`

### Docker 실행
```bash
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8001`

---

## 🚢 Deployment

### Docker 이미지 빌드 & Push
```bash
# Build
docker build -t {DOCKER_USERNAME}/cura-frontend:latest ./frontend
docker build -t {DOCKER_USERNAME}/cura-backend:latest ./backend

# Push
docker push {DOCKER_USERNAME}/cura-frontend:latest
docker push {DOCKER_USERNAME}/cura-backend:latest
```

### AWS Lightsail 배포
```bash
# 배포 스크립트 설정
cp scripts/deploy_lightsail.example.sh scripts/deploy_lightsail.sh
vi scripts/deploy_lightsail.sh  # 서버 IP, SSH 키 경로 수정

# 배포 실행
./scripts/deploy_lightsail.sh {DOCKER_USERNAME}
```

---

## 📊 개발 현황

### ✅ Phase 1.5 완료 (Current)
- [x] 프로젝트 초기 설정
- [x] YouTube Data API 통합
- [x] 컬렉션 & 비디오 CRUD
- [x] 관리자 대시보드
- [x] Parallax 헤더 & 무한 스크롤
- [x] 검색 기능
- [x] Toast 알림 시스템
- [x] Skeleton 로딩
- [x] Docker 컨테이너화
- [x] AWS Lightsail 배포

### 🔜 Phase 2: User Interaction (Next)
- [ ] Supabase Auth (로그인/회원가입)
- [ ] 소셜 기능 (좋아요, 댓글)
- [ ] 검색 고도화 (태그, 자동완성)

### 🔮 Phase 3: Platform Expansion
- [ ] 사용자 컬렉션 (플레이리스트)
- [ ] 분석 기능 (조회수, 인게이지먼트)
- [ ] 추천 시스템

---

## 🎨 디자인 시스템

- **테마**: Dark Mode 중심
- **스타일**: Glassmorphism, 반투명 카드
- **애니메이션**: Framer Motion (Parallax, Micro-interactions)
- **레이아웃**: 
  - Spotify 스타일 헤더 (현재 컨셉, 변경 가능)
  - Threads 스타일 중앙 정렬 피드 (현재 컨셉, 변경 가능)

---

## 📝 최근 변경사항

자세한 내용은 [CHANGELOG.md](CHANGELOG.md)를 참조하세요.

### Highlights
- ✅ Toast 알림 시스템 (react-hot-toast)
- ✅ Skeleton 로딩 컴포넌트
- ✅ 검색 기능 (비디오/컬렉션)
- ✅ 관리자 일괄 작업 (다중 선택 삭제)
- ✅ 통계 대시보드 (카테고리 분포, 최근 비디오)
- ✅ Sentry 에러 추적 설치 (설정 대기)

---

## 📚 기술 문서

### API 문서
FastAPI 자동 생성 문서:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### 프로젝트 상세 분석
더 자세한 기술 분석은 내부 문서를 참조하세요.

---

## 🤝 Contributing

현재는 개인 프로젝트로 진행 중입니다. 

---

## 📄 License

MIT License (예정)

---

## 🔗 Links

- **GitHub**: [kimmjen/CURA](https://github.com/kimmjen/CURA)
- **Demo**: (배포 후 추가 예정)

---

Made with ❤️ by kimmjen