import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/server-auth';
import { json, errorJson, withErrorHandling } from '@/lib/api-helpers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function profileJson(user: {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  profileImageUrl: string | null;
  role: string;
  authProvider: string | null;
  createdAt: Date;
}) {
  return {
    userId: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    profileImageUrl: user.profileImageUrl,
    role: user.role,
    authProvider: user.authProvider,
    memberSince: user.createdAt.toISOString(),
  };
}

// GET /auth/me — current user from the Bearer token.
export const GET = withErrorHandling(async (req: NextRequest) => {
  const userId = getUserId(req);
  if (!userId) return errorJson('Unauthorized', 401);

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return errorJson('User not found', 404);

  return json(profileJson(user));
});

// PUT /auth/me — update own profile (name/phone/photo; email & role are immutable here).
export const PUT = withErrorHandling(async (req: NextRequest) => {
  const userId = getUserId(req);
  if (!userId) return errorJson('Unauthorized', 401);

  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (body.firstName !== undefined) data.firstName = body.firstName;
  if (body.lastName !== undefined) data.lastName = body.lastName;
  if (body.profileImageUrl !== undefined) data.profileImageUrl = body.profileImageUrl;
  if (body.phone !== undefined) data.phone = body.phone || null;

  const user = await prisma.user.update({ where: { id: userId }, data });
  return json(profileJson(user));
});
