# FSD E-Commerce Sample Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** FSD 아키텍처의 완벽한 참고용 이커머스 샘플 프로젝트를 구현한다.

**Architecture:** Next.js App Router의 `app/` 디렉토리는 라우팅 전용으로 최소화하고, 실제 로직은 `src/` 아래 FSD 6개 레이어(app, pages, widgets, features, entities, shared)에 배치한다. 레이어 간 단방향 의존성을 엄격히 준수한다.

**Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Zustand, MSW, bun

**Spec:** `docs/superpowers/specs/2026-03-18-fsd-ecommerce-design.md`

**Naming:** 파일/폴더 `kebab-case`, 컴포넌트/인터페이스 `PascalCase`, 함수/변수 `camelCase`

---

## Chunk 1: Project Setup + Shared Layer

### Task 1: Next.js 프로젝트 초기화

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `tailwind.config.ts`
- Create: `postcss.config.mjs`

- [ ] **Step 1: Next.js 프로젝트 생성**

```bash
cd /Users/macky/Desktop/repositories/web-fsd
bunx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-bun --yes
```

주의: `--src-dir=false`로 생성 후, `app/` 디렉토리는 루트에 유지하고 `src/`는 FSD 레이어 전용으로 수동 생성한다.

- [ ] **Step 2: 추가 의존성 설치**

```bash
bun add zustand
bun add -d msw
```

- [ ] **Step 3: tsconfig.json paths 설정 확인**

`tsconfig.json`에 `@/*` 별칭이 `src/*`를 가리키도록 설정:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

- [ ] **Step 4: FSD 디렉토리 구조 생성**

```bash
mkdir -p src/{app/{providers,config,styles},pages/{home,product-list,product-detail,cart,login,signup},widgets/{header,product-card,cart-item},features/{auth/{ui,model},add-to-cart/ui,update-cart-item/ui},entities/{product/{model,api,ui},cart/model,user/{model,api}},shared/{ui,api,lib,mocks,config,types}}
```

- [ ] **Step 5: 앱 실행 확인**

```bash
bun dev
```

브라우저에서 `http://localhost:3000` 확인 후 종료.

- [ ] **Step 6: 커밋**

```bash
git add -A
git commit -m "chore: initialize Next.js project with FSD directory structure"
```

---

### Task 2: Shared Layer — 타입, 설정, API 클라이언트, 유틸

**Files:**
- Create: `src/shared/types/index.ts`
- Create: `src/shared/config/index.ts`
- Create: `src/shared/api/base-api.ts`
- Create: `src/shared/lib/format-price.ts`

- [ ] **Step 1: 공용 타입 정의**

`src/shared/types/index.ts`:

```typescript
export type { ApiResult } from "@/shared/api/base-api";
```

- [ ] **Step 2: 설정 파일 작성**

`src/shared/config/index.ts`:

```typescript
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
```

- [ ] **Step 3: API 클라이언트 작성**

`src/shared/api/base-api.ts`:

```typescript
import { API_BASE_URL } from "@/shared/config";

type ApiSuccess<T> = { data: T; success: true };
type ApiError = { error: string; success: false };
export type ApiResult<T> = ApiSuccess<T> | ApiError;

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<ApiResult<T>> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    return {
      success: false,
      error: `Request failed with status ${response.status}`,
    };
  }

  const data: T = await response.json();
  return { data, success: true };
}
```

- [ ] **Step 4: 가격 포맷 유틸 작성**

`src/shared/lib/format-price.ts`:

```typescript
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(price);
}
```

- [ ] **Step 5: 커밋**

```bash
git add src/shared/
git commit -m "feat: add shared layer (types, config, api client, utils)"
```

---

### Task 3: Shared Layer — UI 컴포넌트

**Files:**
- Create: `src/shared/ui/button.tsx`
- Create: `src/shared/ui/input.tsx`
- Create: `src/shared/ui/index.ts`

- [ ] **Step 1: Button 컴포넌트 작성**

`src/shared/ui/button.tsx`:

```tsx
import { type ButtonHTMLAttributes, type ReactElement } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps): ReactElement {
  const baseStyles = "rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary: "bg-black text-white hover:bg-gray-800",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

- [ ] **Step 2: Input 컴포넌트 작성**

`src/shared/ui/input.tsx`:

```tsx
import { type InputHTMLAttributes, type ReactElement, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, error, className = "", ...props }, ref): ReactElement {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-sm font-medium text-gray-700">{label}</label>
        )}
        <input
          ref={ref}
          className={`rounded-lg border border-gray-300 px-4 py-2 text-base transition-colors focus:border-black focus:outline-none ${
            error ? "border-red-500" : ""
          } ${className}`}
          {...props}
        />
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    );
  },
);
```

- [ ] **Step 3: barrel export**

`src/shared/ui/index.ts`:

```typescript
export { Button } from "./button";
export { Input } from "./input";
```

- [ ] **Step 4: 커밋**

```bash
git add src/shared/ui/
git commit -m "feat: add shared UI components (Button, Input)"
```

---

### Task 4: Shared Layer — MSW 목 데이터 & 핸들러

**Files:**
- Create: `src/shared/mocks/data.ts`
- Create: `src/shared/mocks/handlers.ts`
- Create: `src/shared/mocks/browser.ts`

- [ ] **Step 1: 목 데이터 작성**

`src/shared/mocks/data.ts`:

주의: shared 레이어에서 entities를 import하면 FSD 의존성 위반이므로, mock 전용 타입을 인라인으로 정의한다.

```typescript
interface MockProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  stock: number;
}

interface MockUser {
  id: string;
  email: string;
  name: string;
}

export const mockProducts: MockProduct[] = [
  {
    id: "1",
    name: "미니멀 백팩",
    price: 89000,
    description: "깔끔한 디자인의 미니멀 백팩. 노트북 수납 가능.",
    imageUrl: "https://picsum.photos/seed/backpack/400/400",
    category: "가방",
    stock: 15,
  },
  {
    id: "2",
    name: "무선 블루투스 이어폰",
    price: 45000,
    description: "고음질 무선 이어폰. 노이즈 캔슬링 지원.",
    imageUrl: "https://picsum.photos/seed/earbuds/400/400",
    category: "전자기기",
    stock: 30,
  },
  {
    id: "3",
    name: "스테인리스 텀블러",
    price: 32000,
    description: "보온보냉 가능한 500ml 텀블러.",
    imageUrl: "https://picsum.photos/seed/tumbler/400/400",
    category: "주방",
    stock: 50,
  },
  {
    id: "4",
    name: "코튼 오버핏 티셔츠",
    price: 28000,
    description: "편안한 오버핏 면 티셔츠. 다양한 색상 보유.",
    imageUrl: "https://picsum.photos/seed/tshirt/400/400",
    category: "의류",
    stock: 100,
  },
  {
    id: "5",
    name: "가죽 카드지갑",
    price: 55000,
    description: "천연 가죽 카드지갑. 카드 6장 수납.",
    imageUrl: "https://picsum.photos/seed/wallet/400/400",
    category: "악세서리",
    stock: 25,
  },
  {
    id: "6",
    name: "LED 데스크 램프",
    price: 67000,
    description: "밝기 조절 가능한 LED 데스크 램프.",
    imageUrl: "https://picsum.photos/seed/lamp/400/400",
    category: "인테리어",
    stock: 20,
  },
];

export const mockUsers: MockUser[] = [
  {
    id: "user-1",
    email: "test@example.com",
    name: "테스트 사용자",
  },
];
```

참고: entities의 타입을 import하므로 Task 5(entities) 완료 후에 이 파일이 컴파일 가능하다. 파일은 먼저 생성하되, 타입 확인은 Task 5 이후에 수행한다.

- [ ] **Step 2: MSW 핸들러 작성**

`src/shared/mocks/handlers.ts`:

```typescript
import { http, HttpResponse } from "msw";
import { mockProducts, mockUsers } from "./data";

export const handlers = [
  // 상품 목록
  http.get("/api/products", () => {
    return HttpResponse.json({
      data: mockProducts,
      success: true,
    });
  }),

  // 상품 상세
  http.get("/api/products/:id", ({ params }) => {
    const product = mockProducts.find((p) => p.id === params.id);
    if (!product) {
      return HttpResponse.json(
        { data: null, success: false, error: "Product not found" },
        { status: 404 },
      );
    }
    return HttpResponse.json({ data: product, success: true });
  }),

  // 로그인
  http.post("/api/auth/login", async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    const user = mockUsers.find((u) => u.email === body.email);
    if (!user) {
      return HttpResponse.json(
        { data: null, success: false, error: "Invalid credentials" },
        { status: 401 },
      );
    }
    return HttpResponse.json({ data: user, success: true });
  }),

  // 회원가입
  http.post("/api/auth/signup", async ({ request }) => {
    const body = (await request.json()) as {
      email: string;
      password: string;
      name: string;
    };
    const newUser = {
      id: `user-${Date.now()}`,
      email: body.email,
      name: body.name,
    };
    return HttpResponse.json({ data: newUser, success: true }, { status: 201 });
  }),

  // 현재 사용자
  http.get("/api/auth/me", () => {
    return HttpResponse.json({ data: null, success: false, error: "Not authenticated" }, { status: 401 });
  }),
];
```

- [ ] **Step 3: MSW 브라우저 워커 작성**

`src/shared/mocks/browser.ts`:

```typescript
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);
```

- [ ] **Step 4: MSW public 서비스워커 생성**

```bash
cd /Users/macky/Desktop/repositories/web-fsd && bunx msw init public/ --save
```

- [ ] **Step 5: 커밋**

```bash
git add src/shared/mocks/ public/mockServiceWorker.js
git commit -m "feat: add MSW mock data, handlers, and browser worker"
```

---

## Chunk 2: Entities Layer

### Task 5: Entity — Product

**Files:**
- Create: `src/entities/product/model/types.ts`
- Create: `src/entities/product/model/store.ts`
- Create: `src/entities/product/api/product-api.ts`
- Create: `src/entities/product/ui/product-info.tsx`
- Create: `src/entities/product/index.ts`

- [ ] **Step 1: Product 타입 정의**

`src/entities/product/model/types.ts`:

```typescript
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  stock: number;
}
```

- [ ] **Step 2: ProductStore 작성**

`src/entities/product/model/store.ts`:

```typescript
import { create } from "zustand";
import { type Product } from "./types";

interface ProductStore {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  setProducts: (products: Product[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  getProductById: (id: string) => Product | undefined;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  setProducts: (products) => set({ products }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  getProductById: (id) => get().products.find((p) => p.id === id),
}));
```

- [ ] **Step 3: Product API 작성**

`src/entities/product/api/product-api.ts`:

```typescript
import { apiClient } from "@/shared/api/base-api";
import { type Product } from "../model/types";

export async function fetchProducts(): Promise<Product[]> {
  const result = await apiClient<Product[]>("/api/products");
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
}

export async function fetchProductById(id: string): Promise<Product> {
  const result = await apiClient<Product>(`/api/products/${id}`);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
}
```

- [ ] **Step 4: ProductInfo UI 작성**

`src/entities/product/ui/product-info.tsx`:

```tsx
import { type ReactElement } from "react";
import { formatPrice } from "@/shared/lib/format-price";
import { type Product } from "../model/types";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps): ReactElement {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p className="text-xl font-semibold">{formatPrice(product.price)}</p>
      <p className="text-gray-600">{product.description}</p>
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
          {product.category}
        </span>
        <span className="text-sm text-gray-500">
          재고 {product.stock}개
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Public API (barrel export)**

`src/entities/product/index.ts`:

```typescript
export { type Product } from "./model/types";
export { useProductStore } from "./model/store";
export { fetchProducts, fetchProductById } from "./api/product-api";
export { ProductInfo } from "./ui/product-info";
```

- [ ] **Step 6: 커밋**

```bash
git add src/entities/product/
git commit -m "feat: add product entity (types, store, api, ui)"
```

---

### Task 6: Entity — Cart

**Files:**
- Create: `src/entities/cart/model/types.ts`
- Create: `src/entities/cart/model/store.ts`
- Create: `src/entities/cart/index.ts`

- [ ] **Step 1: CartItem 타입 정의**

`src/entities/cart/model/types.ts`:

```typescript
export interface CartItem {
  productId: string;
  quantity: number;
}
```

- [ ] **Step 2: CartStore 작성 (localStorage persist)**

`src/entities/cart/model/store.ts`:

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type CartItem } from "./types";

interface CartStore {
  items: CartItem[];
  addItem: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (productId, quantity) =>
        set((state) => {
          const existing = state.items.find(
            (item) => item.productId === productId,
          );
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.productId === productId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              ),
            };
          }
          return { items: [...state.items, { productId, quantity }] };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item,
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    { name: "cart-storage" },
  ),
);
```

- [ ] **Step 3: Public API**

`src/entities/cart/index.ts`:

```typescript
export { type CartItem } from "./model/types";
export { useCartStore } from "./model/store";
```

- [ ] **Step 4: 커밋**

```bash
git add src/entities/cart/
git commit -m "feat: add cart entity (types, store with localStorage persist)"
```

---

### Task 7: Entity — User

**Files:**
- Create: `src/entities/user/model/types.ts`
- Create: `src/entities/user/model/store.ts`
- Create: `src/entities/user/api/user-api.ts`
- Create: `src/entities/user/index.ts`

- [ ] **Step 1: User 타입 정의**

`src/entities/user/model/types.ts`:

```typescript
export interface User {
  id: string;
  email: string;
  name: string;
}
```

- [ ] **Step 2: UserStore 작성**

`src/entities/user/model/store.ts`:

```typescript
import { create } from "zustand";
import { type User } from "./types";

interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
}));
```

- [ ] **Step 3: User API 작성**

`src/entities/user/api/user-api.ts`:

```typescript
import { apiClient } from "@/shared/api/base-api";
import { type User } from "../model/types";

export async function loginApi(
  email: string,
  password: string,
): Promise<User> {
  const result = await apiClient<User>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
}

export async function signupApi(
  email: string,
  password: string,
  name: string,
): Promise<User> {
  const result = await apiClient<User>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  });
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
}

export async function fetchCurrentUser(): Promise<User> {
  const result = await apiClient<User>("/api/auth/me");
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
}
```

- [ ] **Step 4: Public API**

`src/entities/user/index.ts`:

```typescript
export { type User } from "./model/types";
export { useUserStore } from "./model/store";
export { loginApi, signupApi, fetchCurrentUser } from "./api/user-api";
```

- [ ] **Step 5: 커밋**

```bash
git add src/entities/user/
git commit -m "feat: add user entity (types, store, api)"
```

---

## Chunk 3: Features Layer

### Task 8: Feature — Auth

**Files:**
- Create: `src/features/auth/model/use-auth.ts`
- Create: `src/features/auth/ui/login-form.tsx`
- Create: `src/features/auth/ui/signup-form.tsx`
- Create: `src/features/auth/index.ts`

- [ ] **Step 1: useAuth 훅 작성**

`src/features/auth/model/use-auth.ts`:

```typescript
import { useUserStore } from "@/entities/user";
import { loginApi, signupApi } from "@/entities/user";
import { useState } from "react";

interface UseAuthReturn {
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

export function useAuth(): UseAuthReturn {
  const { setUser, clearUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await loginApi(email, password);
      setUser(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await signupApi(email, password, name);
      setUser(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    clearUser();
  };

  return { isLoading, error, login, signup, logout };
}
```

- [ ] **Step 2: LoginForm 작성**

`src/features/auth/ui/login-form.tsx`:

```tsx
"use client";

import { type FormEvent, type ReactElement, useState } from "react";
import { Button, Input } from "@/shared/ui";
import { useAuth } from "../model/use-auth";

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps): ReactElement {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      await login(email, password);
      onSuccess?.();
    } catch {
      // error is handled by useAuth
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">로그인</h2>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Input
        label="이메일"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        label="비밀번호"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "로그인 중..." : "로그인"}
      </Button>
    </form>
  );
}
```

- [ ] **Step 3: SignupForm 작성**

`src/features/auth/ui/signup-form.tsx`:

```tsx
"use client";

import { type FormEvent, type ReactElement, useState } from "react";
import { Button, Input } from "@/shared/ui";
import { useAuth } from "../model/use-auth";

interface SignupFormProps {
  onSuccess?: () => void;
}

export function SignupForm({ onSuccess }: SignupFormProps): ReactElement {
  const { signup, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      await signup(email, password, name);
      onSuccess?.();
    } catch {
      // error is handled by useAuth
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">회원가입</h2>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Input
        label="이름"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        label="이메일"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        label="비밀번호"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "가입 중..." : "회원가입"}
      </Button>
    </form>
  );
}
```

- [ ] **Step 4: Public API**

`src/features/auth/index.ts`:

```typescript
export { useAuth } from "./model/use-auth";
export { LoginForm } from "./ui/login-form";
export { SignupForm } from "./ui/signup-form";
```

- [ ] **Step 5: 커밋**

```bash
git add src/features/auth/
git commit -m "feat: add auth feature (useAuth hook, LoginForm, SignupForm)"
```

---

### Task 9: Feature — Add to Cart

**Files:**
- Create: `src/features/add-to-cart/ui/add-to-cart-button.tsx`
- Create: `src/features/add-to-cart/index.ts`

- [ ] **Step 1: AddToCartButton 작성**

`src/features/add-to-cart/ui/add-to-cart-button.tsx`:

```tsx
"use client";

import { type ReactElement, useState } from "react";
import { Button } from "@/shared/ui";
import { useCartStore } from "@/entities/cart";

interface AddToCartButtonProps {
  productId: string;
  stock: number;
}

export function AddToCartButton({
  productId,
  stock,
}: AddToCartButtonProps): ReactElement {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleClick = (): void => {
    addItem(productId, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Button onClick={handleClick} disabled={stock === 0}>
      {stock === 0
        ? "품절"
        : added
          ? "담았습니다!"
          : "장바구니에 담기"}
    </Button>
  );
}
```

- [ ] **Step 2: Public API**

`src/features/add-to-cart/index.ts`:

```typescript
export { AddToCartButton } from "./ui/add-to-cart-button";
```

- [ ] **Step 3: 커밋**

```bash
git add src/features/add-to-cart/
git commit -m "feat: add add-to-cart feature"
```

---

### Task 10: Feature — Update Cart Item

**Files:**
- Create: `src/features/update-cart-item/ui/quantity-control.tsx`
- Create: `src/features/update-cart-item/ui/remove-item-button.tsx`
- Create: `src/features/update-cart-item/index.ts`

- [ ] **Step 1: QuantityControl 작성**

`src/features/update-cart-item/ui/quantity-control.tsx`:

```tsx
"use client";

import { type ReactElement } from "react";
import { Button } from "@/shared/ui";
import { useCartStore } from "@/entities/cart";

interface QuantityControlProps {
  productId: string;
  quantity: number;
}

export function QuantityControl({
  productId,
  quantity,
}: QuantityControlProps): ReactElement {
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => updateQuantity(productId, Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
      >
        -
      </Button>
      <span className="w-8 text-center">{quantity}</span>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => updateQuantity(productId, quantity + 1)}
      >
        +
      </Button>
    </div>
  );
}
```

- [ ] **Step 2: RemoveItemButton 작성**

`src/features/update-cart-item/ui/remove-item-button.tsx`:

```tsx
"use client";

import { type ReactElement } from "react";
import { Button } from "@/shared/ui";
import { useCartStore } from "@/entities/cart";

interface RemoveItemButtonProps {
  productId: string;
}

export function RemoveItemButton({
  productId,
}: RemoveItemButtonProps): ReactElement {
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <Button variant="danger" size="sm" onClick={() => removeItem(productId)}>
      삭제
    </Button>
  );
}
```

- [ ] **Step 3: Public API**

`src/features/update-cart-item/index.ts`:

```typescript
export { QuantityControl } from "./ui/quantity-control";
export { RemoveItemButton } from "./ui/remove-item-button";
```

- [ ] **Step 4: 커밋**

```bash
git add src/features/update-cart-item/
git commit -m "feat: add update-cart-item feature (QuantityControl, RemoveItemButton)"
```

---

## Chunk 4: Widgets Layer

### Task 11: Widget — Header

**Files:**
- Create: `src/widgets/header/ui/header.tsx`
- Create: `src/widgets/header/index.ts`

- [ ] **Step 1: Header 작성**

`src/widgets/header/ui/header.tsx`:

```tsx
"use client";

import Link from "next/link";
import { type ReactElement } from "react";
import { useCartStore } from "@/entities/cart";
import { useUserStore } from "@/entities/user";
import { useAuth } from "@/features/auth";

export function Header(): ReactElement {
  const items = useCartStore((s) => s.items);
  const { user, isAuthenticated } = useUserStore();
  const { logout } = useAuth();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          FSD Shop
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/products" className="text-gray-600 hover:text-black">
            상품
          </Link>
          <Link href="/cart" className="relative text-gray-600 hover:text-black">
            장바구니
            {totalItems > 0 && (
              <span className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white">
                {totalItems}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{user?.name}</span>
              <button
                onClick={logout}
                className="text-sm text-gray-500 hover:text-black"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <Link href="/login" className="text-gray-600 hover:text-black">
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Public API**

`src/widgets/header/index.ts`:

```typescript
export { Header } from "./ui/header";
```

- [ ] **Step 3: 커밋**

```bash
git add src/widgets/header/
git commit -m "feat: add header widget (nav, cart badge, auth state)"
```

---

### Task 12: Widget — ProductCard

**Files:**
- Create: `src/widgets/product-card/ui/product-card.tsx`
- Create: `src/widgets/product-card/index.ts`

- [ ] **Step 1: ProductCard 작성**

`src/widgets/product-card/ui/product-card.tsx`:

```tsx
import Image from "next/image";
import Link from "next/link";
import { type ReactElement } from "react";
import { type Product } from "@/entities/product";
import { formatPrice } from "@/shared/lib/format-price";
import { AddToCartButton } from "@/features/add-to-cart";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps): ReactElement {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg">
      <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium hover:underline">{product.name}</h3>
        </Link>
        <p className="text-sm text-gray-500">{product.category}</p>
        <p className="mt-auto text-lg font-bold">{formatPrice(product.price)}</p>
        <AddToCartButton productId={product.id} stock={product.stock} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Public API**

`src/widgets/product-card/index.ts`:

```typescript
export { ProductCard } from "./ui/product-card";
```

- [ ] **Step 3: 커밋**

```bash
git add src/widgets/product-card/
git commit -m "feat: add product-card widget"
```

---

### Task 13: Widget — CartItemRow

**Files:**
- Create: `src/widgets/cart-item/ui/cart-item-row.tsx`
- Create: `src/widgets/cart-item/index.ts`

- [ ] **Step 1: CartItemRow 작성 (cross-import 조합 예시)**

`src/widgets/cart-item/ui/cart-item-row.tsx`:

```tsx
"use client";

import Image from "next/image";
import { type ReactElement } from "react";
import { type CartItem } from "@/entities/cart";
import { useProductStore } from "@/entities/product";
import { formatPrice } from "@/shared/lib/format-price";
import { QuantityControl, RemoveItemButton } from "@/features/update-cart-item";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps): ReactElement {
  const product = useProductStore((s) => s.getProductById(item.productId));

  if (!product) {
    return (
      <div className="flex items-center gap-4 rounded-lg border border-gray-200 p-4">
        <p className="text-gray-500">상품 정보를 불러올 수 없습니다.</p>
        <RemoveItemButton productId={item.productId} />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 rounded-lg border border-gray-200 p-4">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <h3 className="font-medium">{product.name}</h3>
        <p className="text-sm text-gray-500">
          {formatPrice(product.price)}
        </p>
      </div>
      <QuantityControl productId={item.productId} quantity={item.quantity} />
      <p className="w-24 text-right font-bold">
        {formatPrice(product.price * item.quantity)}
      </p>
      <RemoveItemButton productId={item.productId} />
    </div>
  );
}
```

- [ ] **Step 2: Public API**

`src/widgets/cart-item/index.ts`:

```typescript
export { CartItemRow } from "./ui/cart-item-row";
```

- [ ] **Step 3: 커밋**

```bash
git add src/widgets/cart-item/
git commit -m "feat: add cart-item widget (cross-import composition example)"
```

---

## Chunk 5: Pages Layer + App Layer + Next.js Routing

### Task 14: FSD Pages Layer

**Files:**
- Create: `src/pages/home/ui/home-page.tsx`
- Create: `src/pages/home/index.ts`
- Create: `src/pages/product-list/ui/product-list-page.tsx`
- Create: `src/pages/product-list/index.ts`
- Create: `src/pages/product-detail/ui/product-detail-page.tsx`
- Create: `src/pages/product-detail/index.ts`
- Create: `src/pages/cart/ui/cart-page.tsx`
- Create: `src/pages/cart/index.ts`
- Create: `src/pages/login/ui/login-page.tsx`
- Create: `src/pages/login/index.ts`
- Create: `src/pages/signup/ui/signup-page.tsx`
- Create: `src/pages/signup/index.ts`

- [ ] **Step 1: HomePage 작성**

`src/pages/home/ui/home-page.tsx`:

```tsx
"use client";

import { type ReactElement, useEffect } from "react";
import { useProductStore, fetchProducts } from "@/entities/product";
import { ProductCard } from "@/widgets/product-card";

export function HomePage(): ReactElement {
  const { products, isLoading, error, setProducts, setLoading, setError } =
    useProductStore();

  useEffect(() => {
    if (products.length > 0) return;
    setLoading(true);
    fetchProducts()
      .then(setProducts)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [products.length, setProducts, setLoading, setError]);

  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col items-center gap-4 py-16 text-center">
        <h1 className="text-4xl font-bold">FSD Shop</h1>
        <p className="text-lg text-gray-600">
          Feature-Sliced Design 아키텍처 샘플 프로젝트
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold">추천 상품</h2>
        {isLoading && <p className="text-gray-500">로딩 중...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
```

`src/pages/home/index.ts`:

```typescript
export { HomePage } from "./ui/home-page";
```

- [ ] **Step 2: ProductListPage 작성**

`src/pages/product-list/ui/product-list-page.tsx`:

```tsx
"use client";

import { type ReactElement, useEffect } from "react";
import { useProductStore, fetchProducts } from "@/entities/product";
import { ProductCard } from "@/widgets/product-card";

export function ProductListPage(): ReactElement {
  const { products, isLoading, error, setProducts, setLoading, setError } =
    useProductStore();

  useEffect(() => {
    if (products.length > 0) return;
    setLoading(true);
    fetchProducts()
      .then(setProducts)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [products.length, setProducts, setLoading, setError]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">전체 상품</h1>
      {isLoading && <p className="text-gray-500">로딩 중...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

`src/pages/product-list/index.ts`:

```typescript
export { ProductListPage } from "./ui/product-list-page";
```

- [ ] **Step 3: ProductDetailPage 작성**

`src/pages/product-detail/ui/product-detail-page.tsx`:

```tsx
"use client";

import Image from "next/image";
import { type ReactElement, useEffect } from "react";
import {
  useProductStore,
  fetchProductById,
  ProductInfo,
} from "@/entities/product";
import { AddToCartButton } from "@/features/add-to-cart";

interface ProductDetailPageProps {
  productId: string;
}

export function ProductDetailPage({
  productId,
}: ProductDetailPageProps): ReactElement {
  const product = useProductStore((s) => s.getProductById(productId));
  const isLoading = useProductStore((s) => s.isLoading);
  const error = useProductStore((s) => s.error);
  const setProducts = useProductStore((s) => s.setProducts);
  const setLoading = useProductStore((s) => s.setLoading);
  const setError = useProductStore((s) => s.setError);

  useEffect(() => {
    if (product) return;
    setLoading(true);
    fetchProductById(productId)
      .then((fetched) => {
        const current = useProductStore.getState().products;
        setProducts([...current, fetched]);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [product, productId, setProducts, setLoading, setError]);

  if (isLoading) {
    return <p className="text-gray-500">로딩 중...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!product) {
    return <p className="text-gray-500">상품을 찾을 수 없습니다.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-xl">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
      <div className="flex flex-col gap-6">
        <ProductInfo product={product} />
        <AddToCartButton productId={product.id} stock={product.stock} />
      </div>
    </div>
  );
}
```

`src/pages/product-detail/index.ts`:

```typescript
export { ProductDetailPage } from "./ui/product-detail-page";
```

- [ ] **Step 4: CartPage 작성**

`src/pages/cart/ui/cart-page.tsx`:

```tsx
"use client";

import Link from "next/link";
import { type ReactElement, useEffect } from "react";
import { useCartStore } from "@/entities/cart";
import { useProductStore, fetchProducts } from "@/entities/product";
import { formatPrice } from "@/shared/lib/format-price";
import { Button } from "@/shared/ui";
import { CartItemRow } from "@/widgets/cart-item";

export function CartPage(): ReactElement {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const { products, setProducts, setLoading } = useProductStore();

  useEffect(() => {
    if (products.length > 0) return;
    setLoading(true);
    fetchProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [products.length, setProducts, setLoading]);

  const totalPrice = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <p className="text-lg text-gray-500">장바구니가 비어있습니다.</p>
        <Link href="/products">
          <Button variant="secondary">쇼핑 계속하기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">장바구니</h1>
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <CartItemRow key={item.productId} item={item} />
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-gray-200 pt-6">
        <Button variant="secondary" onClick={clearCart}>
          장바구니 비우기
        </Button>
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold">
            총 {formatPrice(totalPrice)}
          </span>
          <Button>주문하기</Button>
        </div>
      </div>
    </div>
  );
}
```

`src/pages/cart/index.ts`:

```typescript
export { CartPage } from "./ui/cart-page";
```

- [ ] **Step 5: LoginPage 작성**

`src/pages/login/ui/login-page.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactElement } from "react";
import { LoginForm } from "@/features/auth";

export function LoginPage(): ReactElement {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-md py-16">
      <LoginForm onSuccess={() => router.push("/")} />
      <p className="mt-4 text-center text-sm text-gray-500">
        계정이 없으신가요?{" "}
        <Link href="/signup" className="text-black underline">
          회원가입
        </Link>
      </p>
    </div>
  );
}
```

`src/pages/login/index.ts`:

```typescript
export { LoginPage } from "./ui/login-page";
```

- [ ] **Step 6: SignupPage 작성**

`src/pages/signup/ui/signup-page.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactElement } from "react";
import { SignupForm } from "@/features/auth";

export function SignupPage(): ReactElement {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-md py-16">
      <SignupForm onSuccess={() => router.push("/")} />
      <p className="mt-4 text-center text-sm text-gray-500">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="text-black underline">
          로그인
        </Link>
      </p>
    </div>
  );
}
```

`src/pages/signup/index.ts`:

```typescript
export { SignupPage } from "./ui/signup-page";
```

- [ ] **Step 7: 커밋**

```bash
git add src/pages/
git commit -m "feat: add all FSD page compositions"
```

---

### Task 15: App Layer — Providers & MSW 초기화

**Files:**
- Create: `src/app/providers/msw-provider.tsx`
- Create: `src/app/providers/index.tsx`

- [ ] **Step 1: MSW Provider 작성**

`src/app/providers/msw-provider.tsx`:

```tsx
"use client";

import { type ReactElement, type ReactNode, useEffect, useState } from "react";

interface MswProviderProps {
  children: ReactNode;
}

export function MswProvider({ children }: MswProviderProps): ReactElement {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsReady(true);
      return;
    }

    import("@/shared/mocks/browser").then(({ worker }) =>
      worker.start({ onUnhandledRequest: "bypass" }).then(() => setIsReady(true)),
    );
  }, []);

  if (!isReady) {
    return <></>;
  }

  return <>{children}</>;
}
```

- [ ] **Step 2: AppProvider 조합**

`src/app/providers/index.tsx`:

```tsx
"use client";

import { type ReactElement, type ReactNode } from "react";
import { MswProvider } from "./msw-provider";

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps): ReactElement {
  return (
    <MswProvider>
      {children}
    </MswProvider>
  );
}
```

- [ ] **Step 3: 커밋**

```bash
git add src/app/providers/
git commit -m "feat: add app providers (MSW initialization)"
```

---

### Task 16: Next.js App Router — 라우팅 연결

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Create: `app/products/page.tsx`
- Create: `app/products/[id]/page.tsx`
- Create: `app/cart/page.tsx`
- Create: `app/login/page.tsx`
- Create: `app/signup/page.tsx`

- [ ] **Step 1: 루트 레이아웃 수정**

`app/layout.tsx`:

```tsx
import { type ReactElement, type ReactNode } from "react";
import { AppProvider } from "@/app/providers";
import { Header } from "@/widgets/header";
import "./globals.css";

export const metadata = {
  title: "FSD Shop",
  description: "Feature-Sliced Design 아키텍처 샘플 프로젝트",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return (
    <html lang="ko">
      <body>
        <AppProvider>
          <Header />
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: 각 라우트 페이지 연결**

`app/page.tsx`:

```tsx
import { type ReactElement } from "react";
import { HomePage } from "@/pages/home";

export default function Page(): ReactElement {
  return <HomePage />;
}
```

`app/products/page.tsx`:

```tsx
import { type ReactElement } from "react";
import { ProductListPage } from "@/pages/product-list";

export default function Page(): ReactElement {
  return <ProductListPage />;
}
```

`app/products/[id]/page.tsx`:

```tsx
import { type ReactElement } from "react";
import { ProductDetailPage } from "@/pages/product-detail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps): Promise<ReactElement> {
  const { id } = await params;
  return <ProductDetailPage productId={id} />;
}
```

`app/cart/page.tsx`:

```tsx
import { type ReactElement } from "react";
import { CartPage } from "@/pages/cart";

export default function Page(): ReactElement {
  return <CartPage />;
}
```

`app/login/page.tsx`:

```tsx
import { type ReactElement } from "react";
import { LoginPage } from "@/pages/login";

export default function Page(): ReactElement {
  return <LoginPage />;
}
```

`app/signup/page.tsx`:

```tsx
import { type ReactElement } from "react";
import { SignupPage } from "@/pages/signup";

export default function Page(): ReactElement {
  return <SignupPage />;
}
```

- [ ] **Step 3: 커밋**

```bash
git add app/
git commit -m "feat: connect Next.js App Router to FSD page compositions"
```

---

### Task 17: 최종 확인 & 정리

- [ ] **Step 1: 빌드 확인**

```bash
bun run build
```

빌드 에러가 있으면 수정한다.

- [ ] **Step 2: 개발 서버 실행 & 동작 확인**

```bash
bun dev
```

확인 항목:
- `http://localhost:3000` — 홈 페이지, 추천 상품 표시
- `http://localhost:3000/products` — 전체 상품 목록
- `http://localhost:3000/products/1` — 상품 상세
- `http://localhost:3000/cart` — 장바구니
- `http://localhost:3000/login` — 로그인
- `http://localhost:3000/signup` — 회원가입
- 장바구니 담기 → 장바구니 페이지 확인
- 새로고침 후 장바구니 유지 (localStorage)

- [ ] **Step 3: 불필요한 기본 생성 파일 정리**

`create-next-app`이 생성한 불필요한 기본 파일/스타일 정리.

- [ ] **Step 4: 최종 커밋**

```bash
git add -A
git commit -m "chore: clean up and finalize FSD e-commerce sample"
```
