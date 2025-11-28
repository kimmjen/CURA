# CURA UI Components

프로젝트 전체에서 사용할 수 있는 재사용 가능한 UI 컴포넌트 라이브러리입니다.

## 설치 및 사용

```typescript
import { Button, Input, Select, Textarea, Badge, Card } from '@/components/ui';
```

## 컴포넌트

### Button

다양한 variants와 sizes를 지원하는 버튼 컴포넌트입니다.

**Variants:**
- `primary` - 흰색 배경 (기본)
- `accent` - 파란색 배경
- `secondary` - 회색 배경
- `danger` - 빨간색 테두리
- `ghost` - 투명 배경

**Sizes:**
- `sm` - 작은 크기
- `md` - 중간 크기 (기본)
- `lg` - 큰 크기
- `icon` - 아이콘 전용 (둥근 버튼)

**Props:**
- `variant?: ButtonVariant` - 버튼 스타일
- `size?: ButtonSize` - 버튼 크기
- `loading?: boolean` - 로딩 상태 표시
- `disabled?: boolean` - 비활성화 상태
- 기타 모든 HTML button 속성

**예시:**
```tsx
<Button variant="primary">클릭하세요</Button>
<Button variant="accent" size="lg">큰 버튼</Button>
<Button loading>로딩 중...</Button>
<Button size="icon"><Settings /></Button>
```

---

### Input

라벨과 에러 메시지를 지원하는 입력 필드입니다.

**Props:**
- `label?: string` - 입력 필드 라벨
- `error?: string` - 에러 메시지
- 기타 모든 HTML input 속성

**예시:**
```tsx
<Input 
  label="Username" 
  placeholder="Enter username..." 
/>

<Input 
  label="Email" 
  type="email"
  error="Invalid email format"
/>
```

---

### Select

스타일이 적용된 선택 드롭다운입니다.

**Props:**
- `label?: string` - 선택 필드 라벨
- `error?: string` - 에러 메시지
- 기타 모든 HTML select 속성

**예시:**
```tsx
<Select label="Category">
  <option value="mv">MV</option>
  <option value="live">LIVE</option>
  <option value="fancam">FANCAM</option>
</Select>
```

---

### Textarea

여러 줄 텍스트 입력을 위한 컴포넌트입니다.

**Props:**
- `label?: string` - 텍스트 영역 라벨
- `error?: string` - 에러 메시지
- 기타 모든 HTML textarea 속성

**예시:**
```tsx
<Textarea 
  label="Description" 
  rows={4}
  placeholder="Enter description..."
/>
```

---

### Badge

카테고리 태그나 상태 표시를 위한 배지 컴포넌트입니다.

**Variants:**
- `default` - 기본 스타일 (회색 테두리)
- `outline` - 테두리 스타일
- `active` - 활성 상태 (흰색 배경)
- `inactive` - 비활성 상태 (회색 배경)

**Props:**
- `variant?: BadgeVariant` - 배지 스타일
- `children: React.ReactNode` - 배지 내용
- `className?: string` - 추가 클래스

**예시:**
```tsx
<Badge>MV</Badge>
<Badge>LIVE</Badge>
<Badge variant="active">활성 탭</Badge>
<Badge variant="inactive">비활성 탭</Badge>
```

---

### Card

일관된 카드 컨테이너 스타일을 제공합니다.

**Props:**
- `children: React.ReactNode` - 카드 내용
- `className?: string` - 추가 클래스
- `hover?: boolean` - 호버 효과 활성화

**예시:**
```tsx
<Card>
  <h3>제목</h3>
  <p>내용...</p>
</Card>

<Card hover>
  <p>호버 효과가 있는 카드</p>
</Card>
```

---

## StyleGuidePage에서 확인

모든 컴포넌트의 실제 동작은 `/admin/style-guide` 페이지에서 확인할 수 있습니다.

## 일관성 유지

- 새로운 기능을 추가할 때는 이 컴포넌트들을 사용하세요
- 직접 Tailwind 클래스를 하드코딩하지 마세요
- 새로운 variant나 prop이 필요하면 컴포넌트를 확장하세요
