import { NextResponse } from 'next/server';
import type { Prisma } from '@/generated/prisma';

/** Throwable carrying an HTTP status — caught by withErrorHandling(). */
export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function json(data: unknown, status = 200, headers?: Record<string, string>): NextResponse {
  return NextResponse.json(data as object, { status, headers });
}

/** CDN cache headers for public catalog data (products/categories).
    Vercel's edge caches for 60s and serves stale for 5 min while revalidating —
    cuts DB hits dramatically without admin changes feeling slow. */
export const CATALOG_CACHE = {
  'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
} as const;

/** Error body shaped like the old Spring `{ "error": "..." }` responses. */
export function errorJson(message: string, status = 400): NextResponse {
  return NextResponse.json({ error: message, message }, { status });
}

/** Wrap a route handler so thrown ApiErrors / errors become clean JSON responses. */
export function withErrorHandling<A extends unknown[]>(
  fn: (...args: A) => Promise<NextResponse>,
): (...args: A) => Promise<NextResponse> {
  return async (...args: A) => {
    try {
      return await fn(...args);
    } catch (e) {
      if (e instanceof ApiError) return errorJson(e.message, e.status);
      const msg = e instanceof Error ? e.message : 'Internal server error';
      console.error('[api] unhandled error:', e);
      return errorJson(msg, 500);
    }
  };
}

// ── serialization to match the old Jackson JSON shapes ──────────────────────

type Decimalish = Prisma.Decimal | number | string | null | undefined;

/** Prisma Decimal/BigDecimal -> plain number (Jackson serialized BigDecimal as a number). */
export function dec(v: Decimalish): number | null {
  if (v === null || v === undefined) return null;
  return typeof v === 'number' ? v : Number(v.toString());
}

/** LocalDateTime -> ISO-8601 string (Spring Boot default). */
export function isoDateTime(d: Date | null | undefined): string | null {
  return d ? d.toISOString() : null;
}

/** LocalDate -> "YYYY-MM-DD". */
export function isoDate(d: Date | null | undefined): string | null {
  return d ? d.toISOString().slice(0, 10) : null;
}
