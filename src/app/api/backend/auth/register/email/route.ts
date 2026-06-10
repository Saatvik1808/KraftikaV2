import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/server-auth';
import { ensureCart } from '@/lib/auth-service';
import { ApiError, json, withErrorHandling } from '@/lib/api-helpers';
import { authResponse } from '@/lib/serializers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /auth/register/email — { email, password } -> 201 AuthResponse
export const POST = withErrorHandling(async (req: NextRequest) => {
  const { email, password } = await req.json();
  if (!email || !password) throw new ApiError(400, 'Email and password are required');

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new ApiError(409, 'Email already registered');

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: await hashPassword(password),
      firstName: String(email).split('@')[0],
      authProvider: 'EMAIL',
      lastLogin: new Date(),
    },
  });
  await ensureCart(user.id);

  const token = generateToken(user.id, user.email, user.role);
  return json(authResponse(token, user), 201);
});
