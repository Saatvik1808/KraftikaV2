import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, generateToken } from '@/lib/server-auth';
import { ApiError, json, withErrorHandling } from '@/lib/api-helpers';
import { authResponse } from '@/lib/serializers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /auth/login/email — { email, password } -> AuthResponse
export const POST = withErrorHandling(async (req: NextRequest) => {
  const { email, password } = await req.json();
  if (!email || !password) throw new ApiError(400, 'Email and password are required');

  const user = await prisma.user.findFirst({ where: { email, isActive: true } });
  if (!user || !user.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });
  const token = generateToken(user.id, user.email, user.role);
  return json(authResponse(token, user));
});
