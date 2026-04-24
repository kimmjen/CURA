# CURA Frontend (New)

> Modern YouTube video curation platform with streaming aesthetics

## 🛠️ Tech Stack

- **React 19** - Latest React features
- **Vite 7** - Lightning-fast dev server
- **TypeScript 5.9** - Type safety
- **Tailwind CSS 4** - Modern utility-first CSS
- **PWA** - Progressive Web App support
- **Path Aliases** - `@/` imports

## 📐 Design Specs

### Resolutions
- Desktop: 1920x1080
- Mobile: Responsive (375px+)

### Theme
- Dark: #0a0a0a background
- Accent: #1db954 (Spotify green)
- Fonts: Inter + Outfit

## 🚀 Quick Start

```bash
pnpm install
pnpm dev
```

## ⚙️ Configuration

### Path Aliases ✅
```typescript
import Button from '@/components/ui/Button'
```

### PWA ✅
- Auto-updates enabled
- YouTube thumbnail caching (30 days)
- Installable

### Environment
```bash
VITE_API_BASE_URL=http://localhost:8001
```

## 📁 Structure

```
src/
├── components/ui/      # Base components
├── components/layout/  # Layout
├── components/video/   # Video components
├── components/player/  # Player
└── lib/               # Utils
```

## 📝 Progress - COMPLETE ✅

- [x] Project setup
- [x] Path aliases (@/*)
- [x] PWA (YouTube caching)
- [x] Responsive meta tags
- [x] Storybook 10.1.4 setup
- [x] Design tokens (30+ CSS variables)
- [x] Base UI components (14)
- [x] Video components (3)
- [x] Collection components (2)
- [x] Player components (1)
- [x] Layout components (9)
- [x] Common components (3)
- [x] Page examples (3)
- [x] 80+ Storybook stories
- [x] Dark/Light theme toggle
- [ ] API integration
- [ ] Production deployment

**Component Library: ✅ COMPLETE (35+ components)**

**Storybook:** `pnpm storybook` → http://localhost:6006

---

## 🎨 Components Overview

### Base UI (14)
Button, Input, Textarea, Card, Badge, Avatar, Skeleton, Modal, Dropdown, Tooltip, Toggle, Checkbox, Tabs, VideoSection

### Video (3)
VideoCard (16:9), ShortsCard (9:16), VideoGrid

### Collection (2)
CollectionCard, CollectionHeader

### Player (1)
YouTubePlayer

### Layout (9)
Sidebar, SidebarNav, SearchBar, TopNav, Header, AppLayout, MainLayout, PlayerLayout

### Common (3)
EmptyState, ErrorState, LoadingSpinner

### Pages (3)
HomePage, CollectionDetailPage, PlayerPage

## 🎨 Categories

🔴 LIVE • 🎵 MV • 📹 FANCAM • 📺 BROADCAST  
🎬 BEHIND • ⚡ SHORTS • 🎤 INTERVIEW

---

Built for personal YouTube curation
