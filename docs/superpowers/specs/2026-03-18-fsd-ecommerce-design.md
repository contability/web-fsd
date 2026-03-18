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
│   ├── providers/                # MSW, Auth providers
│   └── styles/                   # global CSS (Next.js app/globals.css에서 import)
│
├── views/                        # FSD pages 레이어 (페이지 컴포지션, Next.js pages/ 충돌 회피)
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
├── widgets/                      # 독립적 UI 블록 (여러 entity/feature를 조합)
│   ├── header/                   # 네비게이션 + 장바구니 아이콘 + 인증 상태
│   │   ├── index.ts
│   │   └── ui/
│   │       └── header.tsx
│   ├── product-card/             # Product 정보 표시 + 장바구니 담기 버튼 조합
│   │   ├── index.ts
│   │   └── ui/
│   │       └── product-card.tsx
│   └── cart-item/                # CartItem + Product 정보 조합 + 수량 변경
│       ├── index.ts
│       └── ui/
│           └── cart-item-row.tsx
│
├── features/                     # 사용자 인터랙션 단위
│   ├── auth/                     # 로그인/회원가입 폼 + 인증 로직
│   │   ├── index.ts
│   │   ├── ui/
│   │   │   ├── login-form.tsx
│   │   │   └── signup-form.tsx
│   │   └── model/
│   │       └── use-auth.ts       # userApi 호출 → userStore.setUser()
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
├── entities/                     # 비즈니스 엔티티 (순수 도메인 모델 + 상태)
│   ├── product/
│   │   ├── index.ts              # Public API (barrel export)
│   │   ├── model/
│   │   │   ├── types.ts
│   │   │   └── store.ts          # setProducts, setLoading만 (fetch 로직 없음)
│   │   ├── api/
│   │   │   └── product-api.ts    # fetch 함수 (store 변경 없이 데이터만 반환)
│   │   └── ui/
│   │       └── product-info.tsx
│   ├── cart/
│   │   ├── index.ts
│   │   └── model/
│   │       ├── types.ts          # CartItem { productId: string; quantity: number }
│   │       └── store.ts          # localStorage persist
│   └── user/
│       ├── index.ts
│       ├── model/
│       │   ├── types.ts
│       │   └── store.ts          # setUser, clearUser만 (login/signup 로직 없음)
│       └── api/
│           └── user-api.ts
│
└── shared/                       # 공용 코드
    ├── ui/
    │   ├── button.tsx
    │   ├── input.tsx
    │   └── index.ts
    ├── api/
    │   └── base-api.ts           # fetch wrapper + 공통 에러 핸들링
    ├── lib/
    │   └── format-price.ts
    ├── mocks/                    # MSW 핸들러 + 브라우저 워커 (테스트에서도 재사용)
    │   ├── handlers.ts
    │   ├── browser.ts
    │   └── data.ts               # 목 데이터
    ├── config/
    │   └── index.ts              # API_BASE_URL 등
    └── types/
        └── index.ts              # ApiResponse<T>, PaginatedResponse<T> 등
```

## FSD Layer Dependency Rules

상위 레이어만 하위 레이어를 import할 수 있다:

```
app → views(pages) → widgets → features → entities → shared
```

### 핵심 규칙

1. **단방향 의존:** 같은 레이어이거나 상위 레이어는 import 불가
2. **Public API:** 각 모듈은 `index.ts`를 통해서만 외부에 노출
3. **cross-import 금지:** 같은 레이어 내 다른 슬라이스 직접 import 불가
4. **cross-import 해결:** 같은 레이어 간 데이터가 필요하면 상위 레이어(widgets/pages)에서 조합

### cross-import 해결 예시 (CartItem ↔ Product)

CartItem은 productId만 가지고, Product 정보가 필요한 곳에서는 상위 레이어에서 조합한다:

```typescript
// entities/cart/model/types.ts — Product를 참조하지 않음
interface CartItem {
  productId: string;
  quantity: number;
}

// widgets/cart-item/ui/cart-item-row.tsx — 상위 레이어에서 조합
import { type CartItem } from '@/entities/cart';
import { useProductStore, type Product } from '@/entities/product';

function CartItemRow({ item }: { item: CartItem }): ReactElement {
  const product = useProductStore((s) => s.getProductById(item.productId));
  // product + item.quantity를 조합하여 렌더링
}
```

### 레이어별 책임 분리 원칙

| 레이어 | 역할 | 포함하면 안 되는 것 |
|--------|------|---------------------|
| entities | 타입 정의, 순수 상태(set/clear), API 호출 함수 | 비즈니스 로직, 사용자 인터랙션 |
| features | 사용자 액션 로직 (entity API 호출 → entity store 업데이트) | 다른 feature 참조 |
| widgets | 여러 entity/feature를 조합하는 독립 UI 블록 | 비즈니스 로직 |

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
interface CartItem {
  productId: string;
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

### Shared Types

```typescript
interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
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

entities 레이어의 store는 순수 상태 컨테이너. fetch 로직은 포함하지 않는다.

```typescript
interface ProductStore {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  setProducts: (products: Product[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  getProductById: (id: string) => Product | undefined;
}
```

데이터 fetching은 pages 레이어나 features에서 수행:

```typescript
// pages/product-list/ui/product-list-page.tsx
const { setProducts, setLoading, setError } = useProductStore();

useEffect(() => {
  setLoading(true);
  fetchProducts()
    .then((res) => setProducts(res.data))
    .catch((err) => setError(err.message))
    .finally(() => setLoading(false));
}, []);
```

### CartStore (entities/cart, localStorage persist)

```typescript
interface CartStore {
  items: CartItem[];
  addItem: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}
```

`totalPrice`, `totalItems` 같은 파생 값은 Product 정보가 필요하므로 widgets/pages 레이어에서 계산한다.

### UserStore (entities/user)

```typescript
interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
}
```

`login`/`signup` 로직은 `features/auth/model/use-auth.ts`에서 처리:

```typescript
// features/auth/model/use-auth.ts
function useAuth() {
  const { setUser, clearUser } = useUserStore();

  const login = async (email: string, password: string): Promise<void> => {
    const res = await loginApi(email, password);
    setUser(res.data);
  };

  const signup = async (email: string, password: string, name: string): Promise<void> => {
    const res = await signupApi(email, password, name);
    setUser(res.data);
  };

  const logout = (): void => {
    clearUser();
  };

  return { login, signup, logout };
}
```

## Pages Overview

| Page | Route | 구성 | 데이터 소스 |
|------|-------|------|-------------|
| Home | `/` | Hero + 추천 상품 그리드 | fetchProducts → ProductStore |
| Product List | `/products` | 상품 그리드 (widgets/product-card) | fetchProducts → ProductStore |
| Product Detail | `/products/:id` | entities/product UI + features/add-to-cart | fetchProductById → ProductStore |
| Cart | `/cart` | widgets/cart-item + 총액 계산 + 결제 버튼 | CartStore + ProductStore 조합 |
| Login | `/login` | features/auth/login-form | features/auth/use-auth |
| Signup | `/signup` | features/auth/signup-form | features/auth/use-auth |
