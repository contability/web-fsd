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
