import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { NextRequest } from 'next/server';

// Mirrors the old Spring JwtUtil exactly so tokens issued by either side validate:
//   HS256, secret bytes = JWT_SECRET (UTF-8), claims { userId, role }, sub = email/phone.
const JWT_SECRET = process.env.JWT_SECRET || 'kraftika-super-secret-key-change-in-production';
const JWT_EXPIRATION_MS = Number(process.env.JWT_EXPIRATION_MS || '86400000');

export interface JwtPayload {
  userId: string;
  role: string;
  sub?: string;
  iat?: number;
  exp?: number;
}

export function generateToken(userId: string, subject: string | null, role: string): string {
  return jwt.sign({ userId, role }, JWT_SECRET, {
    algorithm: 'HS256',
    subject: subject ?? undefined,
    expiresIn: Math.floor(JWT_EXPIRATION_MS / 1000),
  });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }) as JwtPayload;
  } catch {
    return null;
  }
}

/** bcrypt — verifies hashes created by the old jBCrypt backend (same $2a$ format). */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plain, hash);
  } catch {
    return false;
  }
}

function bearer(req: NextRequest): string | null {
  const h = req.headers.get('authorization');
  if (!h) return null;
  return h.startsWith('Bearer ') ? h.slice(7) : h;
}

/** Decoded payload from the request's Authorization header, or null. */
export function getAuth(req: NextRequest): JwtPayload | null {
  const token = bearer(req);
  if (!token) return null;
  return verifyToken(token);
}

/** User id from the request, or null if missing/invalid token. */
export function getUserId(req: NextRequest): string | null {
  return getAuth(req)?.userId ?? null;
}

export function isAdmin(req: NextRequest): boolean {
  return getAuth(req)?.role === 'ADMIN';
}
