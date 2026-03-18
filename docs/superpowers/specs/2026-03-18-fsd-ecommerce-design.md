# FSD E-Commerce Sample Project Design Spec

## Overview

FSD(Feature-Sliced Design) 아키텍처의 완벽한 참고용 샘플 프로젝트.
이커머스 도메인(상품 목록/상세, 장바구니, 인증)을 통해 FSD의 모든 레이어와 규칙을 시연한다.

## Tech Stack

- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **API Mocking:** MSW (Mock Service Worker)
- **Package Manager:** bun

## Naming Convention

- **파일/폴더명:** `kebab-case` (예: `product-api.ts`, `add-to-cart-button.tsx`)
- **컴포넌트/인터페이스:** `PascalCase` (예: `ProductInfo`, `CartItem`)
- **함수/변수:** `camelCase` (예: `useCartStore`, `formatPrice`)

## Directory Structure

```
app/                              # Next.js App Router (라우팅만)
├── layout.tsx                    # src/app의 providers를 감싸는 루트 레이아웃
├── page.tsx                      # → src/pages/home
├── products/
│   ├── page.tsx                  # → src/pages/product-list
│   └── [id]/
│       └── page.tsx              # → src/pages/product-detail
├── cart/
│   └── page.tsx                  # → src/pages/cart
├── login/
│   └── page.tsx                  # → src/pages/login
└── signup/
    └── page.tsx                  # → src/pages/signup

src/
├── app/                          # FSD app 레이어
│   ├── providers/                # QueryClient, MSW, Auth providers
│   ├── styles/                   # global CSS
│   └── msw/                      # MSW 핸들러, 브라우저 워커
│
├── pages/                        # FSD pages 레이어 (페이지 컴포지션)
│   ├── home/
│   │   ├── index.ts
│   │   └── ui/
│   │       └── home-page.tsx
│   ├── product-list/
│   │   ├── index.ts
│   │   └── ui/
│   │       └── product-list-page.tsx
│   ├── product-detail/
│   │   ├── index.ts
│   │   └── ui/
│   │       └── product-detail-page.tsx
│   ├── cart/
│   │   ├── index.ts
│   │   └── ui/
│   │       └── cart-page.tsx
│   ├── login/
│   │   ├── index.ts
│   │   └── ui/
│   │       └── login-page.tsx
│   └── signup/
│       ├── index.ts
│       └── ui/
│           └── signup-page.tsx
│
├── widgets/                      # 독립적 UI 블록
│   ├── header/
│   │   ├── index.ts
│   │   └── ui/
│   │       └── header.tsx
│   ├── product-card/
│   │   ├── index.ts
│   │   └── ui/
│   │       └── product-card.tsx
│   └── cart-item/
│       ├── index.ts
│       └── ui/
│           └── cart-item-row.tsx
│
├── features/                     # 사용자 인터랙션 단위
│   ├── auth/
│   │   ├── index.ts
│   │   ├── ui/
│   │   │   ├── login-form.tsx
│   │   │   └── signup-form.tsx
│   │   └── model/
│   │       └── use-auth.ts
│   ├── add-to-cart/
│   │   ├── index.ts
│   │   └── ui/
│   │       └── add-to-cart-button.tsx
│   └── update-cart-item/
│       ├── index.ts
│       └── ui/
│           ├── quantity-control.tsx
│           └── remove-item-button.tsx
│
├── entities/                     # 비즈니스 엔티티
│   ├── product/
│   │   ├── index.ts              # Public API (barrel export)
│   │   ├── model/
│   │   │   ├── types.ts
│   │   │   └── store.ts
│   │   ├── api/
│   │   │   └── product-api.ts
│   │   └── ui/
│   │       └── product-info.tsx
│   ├── cart/
│   │   ├── index.ts
│   │   └── model/
│   │       ├── types.ts
│   │       └── store.ts
│   └── user/
│       ├── index.ts
│       ├── model/
│       │   ├── types.ts
│       │   └── store.ts
│       └── api/
│           └── user-api.ts
│
└── shared/                       # 공용 코드
    ├── ui/
    │   ├── button.tsx
    │   ├── input.tsx
    │   └── index.ts
    ├── api/
    │   └── base-api.ts           # fetch wrapper
    ├── lib/
    │   └── format-price.ts
    └── types/
        └── index.ts
```

## FSD Layer Dependency Rules

상위 레이어만 하위 레이어를 import할 수 있다:

```
app → pages → widgets → features → entities → shared
```

### 핵심 규칙

1. **단방향 의존:** 같은 레이어이거나 상위 레이어는 import 불가
2. **Public API:** 각 모듈은 `index.ts`를 통해서만 외부에 노출
3. **cross-import 금지:** 같은 레이어 내 다른 슬라이스 직접 import 불가
4. **cross-import 해결:** 같은 레이어 간 데이터가 필요하면 상위 레이어에서 조합

### cross-import 해결 예시 (CartItem ↔ Product)

```typescript
// entities/cart/model/types.ts — Product를 직접 참조하지 않음
interface CartItem<T = unknown> {
  product: T;
  quantity: number;
}

// widgets/cart-item/ui/cart-item-row.tsx — 상위 레이어에서 조합
import { type CartItem } from '@/entities/cart';
import { type Product } from '@/entities/product';

interface CartItemRowProps {
  item: CartItem<Product>;
}
```

## Data Models

### Product

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  stock: number;
}
```

### CartItem

```typescript
interface CartItem<T = unknown> {
  product: T;
  quantity: number;
}
```

### User

```typescript
interface User {
  id: string;
  email: string;
  name: string;
}
```

## MSW API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/products` | 상품 목록 |
| GET | `/api/products/:id` | 상품 상세 |
| POST | `/api/auth/login` | 로그인 |
| POST | `/api/auth/signup` | 회원가입 |
| GET | `/api/auth/me` | 현재 사용자 |

장바구니는 Zustand store + localStorage persist로 클라이언트에서만 관리.

## Zustand Store Design

### ProductStore (entities/product)

```typescript
interface ProductStore {
  products: Product[];
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
  getProductById: (id: string) => Product | undefined;
}
```

### CartStore (entities/cart, localStorage persist)

```typescript
interface CartStore {
  items: CartItem<Product>[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
  totalItems: () => number;
}
```

### UserStore (entities/user)

```typescript
interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}
```

## Pages Overview

| Page | Route | 구성 |
|------|-------|------|
| Home | `/` | Hero + 추천 상품 (widgets/product-card) |
| Product List | `/products` | 상품 그리드 (widgets/product-card) |
| Product Detail | `/products/:id` | entities/product UI + features/add-to-cart |
| Cart | `/cart` | widgets/cart-item + 총액 + 결제 버튼 |
| Login | `/login` | features/auth/login-form |
| Signup | `/signup` | features/auth/signup-form |
