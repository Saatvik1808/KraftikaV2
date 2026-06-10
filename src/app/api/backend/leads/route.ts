import { NextRequest } from 'next/server';
import { json, withErrorHandling } from '@/lib/api-helpers';
import { sendLeadEmail } from '@/lib/mailer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /leads — accepts a single { name, email, phone } object OR an array of them
// (matches the old controller). Sends a thank-you email to the lead.
export const POST = withErrorHandling(async (req: NextRequest) => {
  const body = await req.json();
  const lead = Array.isArray(body) ? body[0] : body;
  if (!lead) {
    return json({ success: false, message: 'Request body cannot be empty' }, 400);
  }

  try {
    await sendLeadEmail(lead.name, lead.email, lead.phone);
  } catch (e) {
    console.error('[leads] email failed:', e);
  }
  return json({ success: true, message: "Thank you for your interest! We'll contact you soon." });
});
