import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateToken } from '@/lib/server-auth';
import { ensureCart } from '@/lib/auth-service';
import { verifyGoogleToken } from '@/lib/google-auth';
import { json, withErrorHandling } from '@/lib/api-helpers';
import { authResponse } from '@/lib/serializers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /auth/google — { idToken } : verify server-side, then login/register/link.
// Mirrors the old AuthService.authenticateWithGoogle upsert logic.
export const POST = withErrorHandling(async (req: NextRequest) => {
  const { idToken } = await req.json();
  const g = await verifyGoogleToken(idToken);

  let user = await prisma.user.findUnique({ where: { googleId: g.googleId } });

  if (!user) {
    // Link to an existing account with the same email, if any.
    if (g.email) {
      const byEmail = await prisma.user.findUnique({ where: { email: g.email } });
      if (byEmail) {
        user = await prisma.user.update({
          where: { id: byEmail.id },
          data: { googleId: g.googleId, profileImageUrl: g.profileImageUrl ?? byEmail.profileImageUrl },
        });
      }
    }
    // Otherwise create a fresh Google user.
    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId: g.googleId,
          email: g.email ?? undefined,
          firstName: g.firstName ?? undefined,
          lastName: g.lastName ?? undefined,
          profileImageUrl: g.profileImageUrl ?? undefined,
          authProvider: 'GOOGLE',
          lastLogin: new Date(),
        },
      });
      await ensureCart(user.id);
    }
  } else {
    // Existing Google user — refresh profile fields.
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.email ?? g.email ?? undefined,
        profileImageUrl: g.profileImageUrl ?? user.profileImageUrl ?? undefined,
      },
    });
  }

  await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });

  const subject = user.email ?? user.googleId ?? user.id;
  const token = generateToken(user.id, subject, user.role);
  return json(authResponse(token, user));
});
