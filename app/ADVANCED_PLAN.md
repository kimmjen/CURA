# CURA Frontend - Advanced Components & Layouts Plan

## 🎯 Phase A: Missing Base Components

### 1. Toggle/Switch
```typescript
- On/Off 상태
- Disabled state
- Label 지원
- Size: sm/md
```

### 2. Checkbox
```typescript
- Checked/Unchecked/Indeterminate
- Label
- Disabled
```

### 3. Tabs
```typescript
- Horizontal tabs
- Active state
- Icon support
```

---

## 🎬 Phase B: Video Section Components

### 4. VideoSection
```
[제목] ────────────── [더보기 >]
[VideoCard] [VideoCard] [VideoCard] → → →
```
- 가로 스크롤
- 섹션 제목
- "더보기" 링크

### 5. VideoCarousel
- 화살표 네비게이션 (← →)
- 자동 스크롤
- 페이지네이션 dots

---

## 🧭 Phase C: Complete Navigation

### 6. Header (완성)
```
[Logo] [Search──────] [Notifications] [Profile ▼]
```
- 로고
- 검색바 (중앙)
- 알림 아이콘
- 프로필 드롭다운

### 7. Sidebar (완성)
```
[Logo]
─────────
🏠 홈
🔥 인기
📚 컬렉션
⏰ 최근 시청
─────────
내 컬렉션
• Collection 1
• Collection 2
─────────
⚙️ 설정
```

---

## 📐 Phase D: Layout Patterns

### 8. MainLayout (홈페이지)
```
┌─────────────────────────────────┐
│  Header                         │
├────┬────────────────────────────┤
│ S  │ VideoSection (추천)        │
│ i  │ VideoSection (인기)        │
│ d  │ VideoSection (최근)        │
│ e  │ VideoSection (새 영상)     │
│    │                            │
└────┴────────────────────────────┘
```

### 9. CollectionLayout (컬렉션 상세)
```
┌─────────────────────────────────┐
│  Header                         │
├────┬────────────────────────────┤
│ S  │ CollectionHeader           │
│ i  │ ─────────────────────     │
│ d  │ [Filter] [Sort] [Grid/List]│
│ e  │                            │
│    │ VideoGrid                  │
└────┴────────────────────────────┘
```

### 10. PlayerLayout (재생 중)
```
┌─────────────────────────────────┐
│  [< Back]  Video Title          │
├──────────────────────┬──────────┤
│                      │ Playlist │
│   YouTube Player     │ ────────│
│   (Theater mode)     │ • Vid 1  │
│                      │ ▶ Vid 2  │
│                      │ • Vid 3  │
├──────────────────────┤          │
│ Title, Info, Desc    │          │
└──────────────────────┴──────────┘
```

### 11. SearchLayout (검색 결과)
```
┌─────────────────────────────────┐
│  Header (Search focused)        │
├────┬────────────────────────────┤
│ S  │ "검색어" 검색 결과 (24)    │
│ i  │ ─────────────────────     │
│ d  │ [Filters: Category, Date]  │
│ e  │                            │
│    │ VideoGrid (Results)        │
└────┴────────────────────────────┘
```

---

## 🎨 Phase E: Page Examples

### 12. HomePage
- 여러 VideoSection 조합
- 개인화된 추천

### 13. CollectionDetailPage
- CollectionHeader
- Filterable VideoGrid

### 14. PlayerPage  
- Theater mode player
- PlaylistSidebar
- Related videos

---

## 📊 Component Count Target

**Current:** 25+ components  
**After Phase A-E:** 40+ components

- Base UI: 13 (+ Toggle, Checkbox, Tabs)
- Video: 5 (+ VideoSection, Carousel)
- Layout: 7 (+ Header완성, Sidebar완성)
- Pages: 4 (+ HomePage, CollectionPage, PlayerPage, SearchPage)

---

**Start: Phase A (Toggle, Checkbox, Tabs)** 🚀
