import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateToken } from '@/lib/server-auth';
import { normalizePhone, ensureCart } from '@/lib/auth-service';
import { ApiError, json, withErrorHandling } from '@/lib/api-helpers';
import { authResponse } from '@/lib/serializers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface PhoneEmailUserData {
  phone?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}

// POST /auth/phone-email — { userJsonUrl } : fetch user JSON from phone.email, login/register.
export const POST = withErrorHandling(async (req: NextRequest) => {
  const { userJsonUrl } = await req.json();
  if (!userJsonUrl) throw new ApiError(400, 'user_json_url is required');

  let data: PhoneEmailUserData;
  try {
    const res = await fetch(userJsonUrl, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new ApiError(400, `Failed to fetch user data from phone.email. Response code: ${res.status}`);
    data = await res.json();
  } catch (e) {
    if (e instanceof ApiError) throw e;
    throw new ApiError(400, 'Failed to fetch user data from phone.email');
  }

  const phone = data.phone ? normalizePhone(data.phone) : null;

  let user =
    (phone ? await prisma.user.findUnique({ where: { phone } }) : null) ??
    (data.email ? await prisma.user.findUnique({ where: { email: data.email } }) : null);

  if (!user) {
    const firstName =
      data.firstName && data.firstName.length
        ? data.firstName
        : data.email
          ? data.email.split('@')[0]
          : 'User';
    if (!phone && !data.email) throw new ApiError(400, 'Phone or email is required');

    user = await prisma.user.create({
      data: {
        phone: phone ?? undefined,
        email: data.email ?? undefined,
        firstName,
        lastName: data.lastName ?? undefined,
        profileImageUrl: data.profileImageUrl ?? undefined,
        phoneVerified: Boolean(phone),
        authProvider: 'PHONE',
        lastLogin: new Date(),
      },
    });
    await ensureCart(user.id);
  } else {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        phone: user.phone ?? phone ?? undefined,
        email: user.email ?? data.email ?? undefined,
        firstName: user.firstName && user.firstName.length ? user.firstName : data.firstName ?? undefined,
        lastName: user.lastName && user.lastName.length ? user.lastName : data.lastName ?? undefined,
        profileImageUrl: data.profileImageUrl ?? user.profileImageUrl ?? undefined,
        phoneVerified: phone ? true : user.phoneVerified ?? undefined,
        lastLogin: new Date(),
      },
    });
  }

  const subject = user.email ?? user.phone ?? user.id;
  const token = generateToken(user.id, subject, user.role);
  return json(authResponse(token, user));
});
