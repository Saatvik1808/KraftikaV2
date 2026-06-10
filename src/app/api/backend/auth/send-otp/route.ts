import { NextRequest } from 'next/server';
import { normalizePhone, generateAndStoreOtp } from '@/lib/auth-service';
import { ApiError, json, withErrorHandling } from '@/lib/api-helpers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /auth/send-otp — { phone } -> OtpResponse
export const POST = withErrorHandling(async (req: NextRequest) => {
  const { phone } = await req.json();
  if (!phone) throw new ApiError(400, 'Phone is required');
  await generateAndStoreOtp(normalizePhone(phone));
  return json({ message: 'OTP sent successfully', success: true, expiresInMinutes: 5 });
});
