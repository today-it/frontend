# 공용 UI/구조 컨벤션 문서

## 1. 목적

- Next.js App Router 기반 프로젝트의 공용 UI와 코드 배치 기준을 정의한다.
- 재사용 가능한 컴포넌트와 인터페이스를 일관되게 유지한다.
- 현재 확인된 재사용을 기준으로 코드를 추출하고, 추측에 의한 사전 추상화를 지양한다.
- 레이어 간 의존 방향을 고정하여 유지보수성과 탐색성을 높인다.

---

## 2. 아키텍처/레이어 컨벤션

### 2.1 적용 기준

- 이 프로젝트는 [Feature-Sliced Design v2.1](https://www.skills.sh/feature-sliced/skills/feature-sliced-design)의 레이어와 의존성 원칙을 참고한다.
- Next.js App Router는 프로젝트 구조에 맞게 `src/app`에 배치한다.
- 공식 FSD의 `app`, `_app`, `_pages` 분리 구조는 사용하지 않는다.
- 프로젝트에 실제로 필요한 레이어만 생성한다.
- `features`, `entities` 폴더는 **실제 재사용 사례가 생기기 전에는 생성하지 않는다.**
- `widgets` 레이어는 사용하지 않는다.

### 2.2 App Router 책임

- `src/app/**/page.tsx`는 Server Component를 우선한다.
- `page.tsx`는 다음과 같은 라우트 책임에 집중한다.
    - metadata
    - server data fetching
    - redirect
    - route composition
- 특정 라우트에서만 사용하는 코드는 해당 라우트의 private 폴더에 배치한다.
    - `_components`: 페이지 전용 UI
    - `_model`: 페이지 전용 상태, 검증, 비즈니스 규칙
    - `_api`: 페이지 전용 데이터 요청
- 클라이언트 인터랙션이 필요한 컴포넌트는 `.client.tsx`로 구분한다.
- **라우트 private 폴더의 코드는 다른 라우트에서 직접 import하지 않는다.**
- 전역 Provider는 `src/app/providers`에 배치한다.

### 2.3 레이어 경계

- `app/*`: Next.js 라우팅, 전역 Provider, 전역 스타일 및 화면 조립
- `shared/*`: 비즈니스 규칙이 없는 공용 기반
    - `ui`: 공용 UI 컴포넌트
    - `lib`: 범용 함수와 재사용 가능한 기술 코드
    - `api`: 공통 API 클라이언트와 범용 요청 기반
    - `config`: 환경 설정과 공통 설정
- `features/*`: 여러 화면에서 실제 재사용되는 사용자 행동
- `entities/*`: 여러 화면이나 feature에서 재사용되는 안정적인 도메인 모델
- `features`와 `entities`는 필요한 경우에만 생성한다.

### 2.4 의존 방향

- `app -> features/entities/shared`
- `features -> entities/shared`
- `entities -> shared`
- `shared`는 상위 레이어를 참조하지 않는다.
- 같은 레이어의 서로 다른 slice를 직접 참조하지 않는다.

### 2.5 추출 기준

- 한 라우트에서만 사용하는 코드는 해당 라우트에 유지한다.
- 여러 화면에서 재사용되는 사용자 행동은 `features`로 추출한다.
- 여러 화면에서 재사용되는 안정적인 도메인 모델은 `entities`로 추출한다.
- 도메인과 무관한 UI와 기술 코드만 `shared`로 이동한다.
- 향후 재사용 가능성만으로 feature나 entity를 미리 만들지 않는다.

---

## 3. 네이밍/배치 컨벤션

- 공유 기술 코드는 `shared/lib`에 배치한다.
- `utils.ts`, `helpers.ts`, `types.ts`처럼 범위가 모호한 파일명을 지양한다.
- 파일명은 담당 도메인이나 목적이 드러나게 작성한다.
    - `cn.ts`
    - `format-date.ts`
    - `query-provider.tsx`
    - `login-form.client.tsx`
- `.client.tsx`는 Client Component 경계를 표시할 때 사용한다.
- `.constants.ts`는 상수의 소유 대상이 명확할 때만 사용한다.
- 기술적 역할만 나타내는 접미사는 남용하지 않는다.

---

## 4. Export 컨벤션

### 4.1 기본 원칙

- 외부에서 사용하는 모듈은 공개 API인 `index.ts`를 통해 export한다.
- `index.ts`에는 외부에 공개할 항목만 명시적으로 export한다.
- slice 내부에서는 상대경로 import를 사용한다.
- 외부에서는 slice 내부의 `ui`, `model`, `api` 파일을 직접 import하지 않는다.
- 서버 전용 공개 API가 필요하면 `index.server.ts`로 분리한다.

### 4.2 적용 대상

- `shared/ui/index.ts`
- `shared/lib/index.ts`
- `shared/api/index.ts`
- `features/<slice>/index.ts`
- `entities/<slice>/index.ts`

### 4.3 예시

```tsx
export { Icon } from "./icon";
export type { IconName, IconProps, IconTone } from "./icon";
```

---

## 5. 공용 UI 컴포넌트 컨벤션

### 5.1 배치 기준

- 비즈니스 문맥이 없는 재사용 가능한 UI만 `shared/ui`에 배치한다.
- 특정 도메인이나 사용자 행동에 종속된 컴포넌트는 `shared/ui`에 배치하지 않는다.
- 한 라우트에서만 사용하는 컴포넌트는 해당 라우트의 `_components`에 유지한다.

### 5.2 API 설계

- Props는 재사용 중심으로 설계한다.
- variant/tone/size 패턴을 일관되게 사용한다.
- 내부 레이아웃 값, 특히 폭을 하드코딩하지 않는다.
- 폭 제약은 호출부의 `className` 또는 상위 레이아웃에서 제어한다.

### 5.3 상태 지원

- hover/focus/disabled/error 상태를 확인할 수 있게 만든다.
- 상태 표현은 스타일 또는 variant 시스템 안에서 일관되게 처리한다.

### 5.4 접근성

- 라벨, 키보드 포커스, ARIA 기본 동작을 보장한다.
- 네이티브 시맨틱 요소인 `button`, `input` 등을 우선 사용한다.

---

## 6. 스타일/아이콘/공통 코드 컨벤션

### 6.1 스타일

- 클래스 조합은 `shared/lib`의 `cn`으로 통일한다.
- 전역 스타일과 디자인 토큰은 `src/app/globals.css`에서 관리한다.
- 반복되는 스타일 규칙은 공용 UI 또는 명확한 스타일 추상화로 분리한다.

### 6.2 SVG 아이콘

- 색상은 `currentColor` 기반으로 통일한다.
- 아이콘 내부에 색상을 하드코딩하지 않는다.
- 색상은 부모 또는 상태 스타일에서 제어한다.
- 의미가 있는 아이콘에는 접근성 이름을 제공한다.
- 장식용 아이콘은 보조 기술에서 제외한다.

### 6.3 공통 기술 코드

- 공통 기술 함수는 `shared/lib`에 배치한다.
- 비즈니스 규칙과 도메인 계산은 `shared`에 배치하지 않는다.
- 공통 API 클라이언트와 범용 요청 기반은 `shared/api`에 배치한다.

---

## 7. 훅(Hooks) 컨벤션

### 7.1 배치 기준

- 특정 페이지에서만 사용하는 훅은 해당 라우트에 배치한다.
- 특정 feature에서만 사용하는 훅은 해당 feature에 배치한다.
- 도메인과 무관하고 여러 곳에서 사용하는 훅만 `shared/lib`에 배치한다.
- 훅이라는 이유만으로 `shared/hooks`에 모으지 않는다.

### 7.2 책임 분리

- 복잡한 입력 제어, 인터랙션, 상태 관리는 훅으로 분리할 수 있다.
- 컴포넌트는 렌더링과 조합 책임에 집중한다.
- 드래그와 클릭 충돌처럼 인터랙션에 결합된 UX 처리는 해당 훅에서 함께 관리한다.

---

## 8. 문서화/검증 컨벤션

### 8.1 Storybook

- 신규 또는 변경 공용 UI에는 스토리를 반드시 추가한다.
- 사용 가이드 문서인 overview/guide도 함께 최신화한다.

### 8.2 PR 검증 기준

- 코드가 실제 사용 범위에 맞는 레이어에 배치됐는지 확인한다.
- 불필요한 feature/entity가 미리 생성되지 않았는지 확인한다.
- 상위 레이어를 역방향으로 참조하지 않는지 확인한다.
- 공개 API를 우회하여 내부 파일을 직접 import하지 않는지 확인한다.
- 컴포넌트 역할 중복이나 충돌이 없는지 확인한다.
- hover/focus/disabled/error 상태를 확인할 수 있는지 검증한다.
- 키보드 및 접근성 기본 동작을 검증한다.
- 신규 또는 변경 공용 UI의 Storybook 스토리를 확인한다.
- 후속 페이지 기능에서 즉시 사용할 수 있는지 확인한다.
