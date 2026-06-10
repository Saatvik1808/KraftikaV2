import { NextRequest } from 'next/server';
import { json, withErrorHandling } from '@/lib/api-helpers';
import { sendContactEmail } from '@/lib/mailer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /contact — { name, email, message }. Email is awaited (serverless can't run
// fire-and-forget work after the response), but failures never block the user.
export const POST = withErrorHandling(async (req: NextRequest) => {
  const { name, email, message } = await req.json();
  try {
    await sendContactEmail(name, email, message);
  } catch (e) {
    console.error('[contact] email failed:', e);
  }
  return json({ success: true, message: "Thank you for your message! We'll get back to you soon." });
});
