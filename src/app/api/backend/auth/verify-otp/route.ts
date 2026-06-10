import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateToken } from '@/lib/server-auth';
import { normalizePhone, verifyOtp, ensureCart } from '@/lib/auth-service';
import { ApiError, json, withErrorHandling } from '@/lib/api-helpers';
import { authResponse } from '@/lib/serializers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /auth/verify-otp — { phone, otp, firstName? } -> AuthResponse (registers if new)
export const POST = withErrorHandling(async (req: NextRequest) => {
  const body = await req.json();
  const phone = normalizePhone(body.phone);

  if (!(await verifyOtp(phone, body.otp))) throw new ApiError(401, 'Invalid or expired OTP');

  let user = await prisma.user.findUnique({ where: { phone } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        phone,
        firstName: body.firstName && body.firstName.length ? body.firstName : 'User',
        phoneVerified: true,
        authProvider: 'PHONE',
        lastLogin: new Date(),
      },
    });
    await ensureCart(user.id);
  } else {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { phoneVerified: true, lastLogin: new Date() },
    });
  }

  const subject = user.email ?? phone;
  const token = generateToken(user.id, subject, user.role);
  return json(authResponse(token, user));
});
