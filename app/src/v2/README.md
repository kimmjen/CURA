# CURA V2 Premium UI Components

## 📌 Overview

V2는 CURA의 프리미엄 UI/UX 개선 버전입니다. 기존 코드에 영향을 주지 않고 독립적으로 개발되어, 선택적으로 통합할 수 있습니다.

## 🎨 Design Philosophy

- **Glassmorphism**: 투명도와 블러 효과로 깊이감 생성
- **Gradient Accents**: 생동감 있는 그라디언트
- **Smooth Animations**: 부드러운 전환과 인터랙션
- **Premium Feel**: 고급스러운 시각적 경험

## 📁 Structure

```
src/v2/
├── components/
│   ├── ui/
│   │   ├── ButtonV2.tsx         # 프리미엄 버튼
│   │   ├── GlassCard.tsx        # 글래스모픽 카드
│   │   ├── AnimatedNumber.tsx   # 숫자 카운팅 애니메이션
│   │   └── Skeleton.tsx         # 시머 로딩
│   ├── video/
│   │   └── VideoCardV2.tsx      # 향상된 비디오 카드
│   └── layout/
│       └── (future components)
├── pages/
│   └── V2ShowcasePage.tsx       # 전체 데모
└── styles/
    └── index.css                # V2 디자인 시스템
```

## 🚀 Features

### 1. Enhanced Design System (`styles/index.css`)

**New Variables:**
- Gradient system (`--gradient-primary`, `--gradient-accent`, etc.)
- Glassmorphism tokens (`--color-glass-bg`, `--color-glass-border`)
- Advanced shadows (`--shadow-glow`, `--shadow-2xl`)
- Custom easing (`--ease-spring`, `--ease-bounce`)

**Utility Classes:**
- `.glass` - Glassmorphic effect
- `.gradient-primary` - Primary gradient background
- `.gradient-text` - Gradient text
- `.glow`, `.glow-sm`, `.glow-lg` - Glow effects
- `.shimmer` - Shimmer animation

### 2. ButtonV2 Component

**Features:**
- 5 variants: `primary`, `gradient`, `secondary`, `ghost`, `danger`
- Lift effect on hover
- Ripple animation on click
- Optional glow effect
- Gradient shine animation

**Usage:**
```tsx
import ButtonV2 from '@/v2/components/ui/ButtonV2';

<ButtonV2 variant="gradient" glow>
  Click Me
</ButtonV2>
```

### 3. GlassCard Component

**Features:**
- Backdrop blur effect
- 3 border styles: `default`, `gradient`, `glow`
- Hover scale and shadow
- Configurable padding

**Usage:**
```tsx
import GlassCard from '@/v2/components/ui/GlassCard';

<GlassCard border="gradient" padding="lg">
  Content here
</GlassCard>
```

### 4. VideoCardV2 Component

**Enhancements:**
- Glassmorphic overlay on hover
- Enhanced play button with pulse
- Smooth scale and brightness transitions
- Progress bar with glow
- "NEW" badge for recent videos
- Gradient text on hover

**Usage:**
```tsx
import VideoCardV2 from '@/v2/components/video/VideoCardV2';

<VideoCardV2 
  video={videoData} 
  showProgress 
  onClick={handleClick}
/>
```

### 5. AnimatedNumber Component

**Features:**
- Smooth counting animation
- Customizable duration
- Ease-out cubic easing

**Usage:**
```tsx
import AnimatedNumber from '@/v2/components/ui/AnimatedNumber';

<AnimatedNumber value={15420} duration={2000} />
```

### 6. Skeleton Component

**Features:**
- Shimmer animation
- Preset variants: `text`, `circular`, `rectangular`
- Pre-built components: `<SkeletonVideoCard />`, `<SkeletonText />`

**Usage:**
```tsx
import Skeleton, { SkeletonVideoCard } from '@/v2/components/ui/Skeleton';

<Skeleton variant="rectangular" height={200} shimmer />
<SkeletonVideoCard />
```

## 🎯 Accessing the Showcase

Add this route to `App.tsx`:

```tsx
import V2ShowcasePage from '@/v2/pages/V2ShowcasePage';

<Route path="/v2-showcase" element={<V2ShowcasePage />} />
```

Then visit: `http://localhost:5174/v2-showcase`

## 🔄 Migration Strategy

### Option 1: Gradual Migration
1. Import V2 components alongside existing ones
2. Test in specific pages
3. Gradually replace old components

```tsx
// Mix and match
import Button from '@/components/ui/Button';      // V1
import ButtonV2 from '@/v2/components/ui/ButtonV2';  // V2

// Use both in the same page
<Button>Old Button</Button>
<ButtonV2 variant="gradient">New Button</ButtonV2>
```

### Option 2: Full Replacement
1. Copy V2 styles to main `index.css`
2. Replace component imports
3. Update all instances

### Option 3: Selective Features
1. Copy only specific utilities (e.g., gradients, glow)
2. Enhance existing components with V2 features
3. Keep original structure

## 📊 Performance

- **Bundle Size**: ~15KB additional (gzipped)
- **Animation Performance**: 60fps on modern browsers
- **Loading States**: Shimmer animations
- **Accessibility**: Full keyboard navigation, reduced motion support

## 🎨 Customization

All design tokens are CSS variables. Customize in `v2/styles/index.css`:

```css
/* Example: Change accent color */
--color-accent-primary: #your-color;
--gradient-primary: linear-gradient(135deg, #your-start, #your-end);
```

## 🔍 Next Steps

1. **Review Showcase**: Visit `/v2-showcase` to see all components
2. **Test Integration**: Try V2 components in existing pages
3. **Collect Feedback**: Gather user reactions
4. **Plan Migration**: Decide on migration strategy
5. **Iterate**: Refine based on usage

## 💡 Tips

- V2 components work with existing utilities (`cn` helper, etc.)
- Import V2 styles in specific pages if you want isolation
- Use `prefers-reduced-motion` for accessibility
- Glassmorphism works best on dark backgrounds

## 🚧 Future Enhancements

- [ ] Page transition animations
- [ ] Scroll reveal effects
- [ ] Custom cursor effects
- [ ] Particle system
- [ ] Sound effects (optional)
- [ ] More layout components
- [ ] Form components with enhanced states

---

**Note**: V2 is completely independent. The original app continues to work unchanged.
