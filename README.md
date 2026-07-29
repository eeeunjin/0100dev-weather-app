# 날씨 좋다 — 0100DEV 프론트엔드 채용 과제

Open-Meteo API를 활용해 여러 도시의 날씨를 조회하고 관심 도시를 저장하는 앱입니다.

## 선택한 플랫폼 및 실행 방법

**Next.js (App Router) / TypeScript** 를 선택했습니다.

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 접속.

- `npx tsc --noEmit` : 타입 체크
- `npx eslint src` : 린트

## 폴더 구조 및 설계 의도

```
src/
├─ app/
│  ├─ layout.tsx          # 루트 레이아웃, 폰트/헤더/즐겨찾기 하이드레이션 조립
│  ├─ page.tsx             # 도시 목록 화면 (전체/관심 도시 탭)
│  └─ city/[id]/page.tsx   # 도시 상세(주간 예보) 화면
├─ components/
│  ├─ ui/                  # shadcn/ui 기반 프리미티브 (Button, Card, Badge, Tabs)
│  ├─ Header.tsx            # 상단 헤더
│  ├─ CityCard.tsx          # 도시 카드(목록 화면에서 재사용)
│  └─ FavoritesHydrator.tsx # zustand persist 스토어를 클라이언트에서 수동 하이드레이션
├─ lib/
│  ├─ constants.ts          # CITIES 좌표, weather_code → 한글/아이콘 매핑
│  └─ openMeteo.ts          # Open-Meteo fetch 함수 (현재 날씨 / 주간 예보)
├─ store/
│  └─ favoritesStore.ts     # 관심 도시 id 배열을 관리하는 zustand persist 스토어
├─ types/
│  └─ weather.ts            # City, CurrentWeather, DailyForecastDay 등 공용 타입
└─ assets/fonts/            # 11번가 고딕 (자체 호스팅, 상업적 사용 무료)
```

**설계 의도**

- **데이터 레이어(`lib/openMeteo.ts`)와 화면(`app/`)을 분리**해 API 응답 형태가 바뀌어도 화면 컴포넌트는 영향받지 않도록 했습니다. API 원본 필드(`temperature_2m` 등)는 `lib` 레이어에서만 다루고, 그 외에는 정제된 도메인 타입(`CurrentWeather`, `DailyForecastDay`)만 사용합니다.
- **상태 관리는 zustand**로 "관심 도시 id 목록"만 최소한으로 관리합니다. 서버 데이터(날씨)는 전역 상태로 두지 않고 각 화면에서 `useEffect`로 직접 fetch하는 로컬 상태로 처리했습니다. 데이터 종류(클라이언트 지속 상태 vs. 서버 응답)에 따라 상태 관리 방식을 분리한 것입니다.
- **관심 도시는 `localStorage`에 영속화**(zustand `persist`)합니다. SSR 환경에서 `localStorage`를 바로 읽으면 서버/클라이언트 렌더링 결과가 달라져 하이드레이션 에러가 나기 때문에, `skipHydration`을 켜고 `FavoritesHydrator`가 마운트 후 수동으로 스토어를 복원하도록 분리했습니다.
- **컴포넌트는 shadcn/ui(Radix 기반) + Tailwind CSS v4**로 구성하고, 아이콘은 `@radix-ui/react-icons`를 사용했습니다.

## 추가한 기능

- **관심 도시 탭**: 목록 화면에 "전체 도시 / 관심 도시" 탭을 두어, 필수 요구사항인 "관심 도시 저장"이 실제로 필터링되어 보이도록 구현했습니다.
- **상세 화면 습도 표시**: 과제의 API 가이드는 주간 예보에 습도 필드를 포함하지 않지만, 요구사항에는 상세 화면에 습도가 명시되어 있어 Open-Meteo의 `relative_humidity_2m_mean`(daily) 파라미터를 추가로 조회해 표시했습니다.
- **다크모드 대응**: shadcn 테마 변수(oklch)를 라이트/다크 모두 정의해 시스템 다크모드에서도 자연스럽게 보이도록 했습니다.
- **커스텀 폰트**: 11번가 디자인 시스템에서 배포하는 상업적 사용 무료 폰트 "11번가 고딕"을 `next/font/local`로 자체 호스팅하여 적용했습니다.
- **모바일 뷰포트 프레임**: 화면 폭을 iPhone 15 Pro 뷰포트(393px)에 맞춰, 데스크톱 브라우저에서도 실제 모바일 화면 비율로 확인할 수 있도록 `layout.tsx`에서 중앙 정렬된 고정폭 컨테이너로 감쌌습니다.

## AI 도구 사용 여부

**Claude Code**를 사용해 개발했습니다.

- **기능 개발**: 타입/상수/API 레이어, zustand 스토어, 목록·상세 화면 컴포넌트, shadcn/ui 세팅, 폰트 적용까지 전 과정을 Claude Code로 작성했습니다.
- **검증**: `tsc --noEmit`, `eslint`로 정적 검증을 했고, 실제 개발 서버를 띄운 뒤 브라우저 자동화 도구로 목록 화면 → 즐겨찾기 토글 → 탭 필터링 → 상세 화면 진입까지 직접 클릭해 동작을 확인했습니다. 그 과정에서 zustand persist로 인한 하이드레이션 불일치 콘솔 에러를 발견해 `skipHydration` + 수동 rehydrate 방식으로 수정했습니다.
- **검토 필요 부분**: 디자인/톤(폰트, 색상 등)은 사람이 직접 방향을 지시했고, Claude Code는 그 지시에 맞춰 구현했습니다.
