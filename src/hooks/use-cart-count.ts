"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Lightweight cart item count for the navbar badge.
 * - Guests: reads the localStorage cart.
 * - Logged in: fetches /cart/summary (cheap endpoint).
 * Refreshes on route change, on tab focus, and on a custom
 * "cart-updated" event (dispatch it after add/remove for instant updates).
 */
export function useCartCount(): number {
  const [count, setCount] = React.useState(0);
  const pathname = usePathname();
  const { isAuthenticated, token } = useAuth();

  const refresh = React.useCallback(async () => {
    try {
      if (isAuthenticated && token) {
        const res = await fetch("/api/backend/cart/summary", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setCount(Number(data.totalItems) || 0);
          return;
        }
      }
      const raw = typeof window !== "undefined" ? localStorage.getItem("kraftikaCart") : null;
      const items = raw ? JSON.parse(raw) : [];
      setCount(Array.isArray(items) ? items.reduce((s: number, i: { quantity?: number }) => s + (Number(i.quantity) || 1), 0) : 0);
    } catch {
      // badge is decorative — never throw
    }
  }, [isAuthenticated, token]);

  React.useEffect(() => {
    refresh();
  }, [refresh, pathname]);

  React.useEffect(() => {
    const onUpdate = () => refresh();
    window.addEventListener("cart-updated", onUpdate);
    window.addEventListener("cartUpdated", onUpdate);
    window.addEventListener("storage", onUpdate);
    window.addEventListener("focus", onUpdate);
    return () => {
      window.removeEventListener("cart-updated", onUpdate);
      window.removeEventListener("cartUpdated", onUpdate);
      window.removeEventListener("storage", onUpdate);
      window.removeEventListener("focus", onUpdate);
    };
  }, [refresh]);

  return count;
}
