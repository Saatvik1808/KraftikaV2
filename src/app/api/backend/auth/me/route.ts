import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/server-auth';
import { json, errorJson, withErrorHandling } from '@/lib/api-helpers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /auth/me — current user from the Bearer token.
export const GET = withErrorHandling(async (req: NextRequest) => {
  const userId = getUserId(req);
  if (!userId) return errorJson('Unauthorized', 401);

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return errorJson('User not found', 404);

  return json({
    userId: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    profileImageUrl: user.profileImageUrl,
    role: user.role,
    authProvider: user.authProvider,
  });
});
