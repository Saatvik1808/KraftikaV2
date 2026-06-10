import nodemailer from 'nodemailer';

// Gmail SMTP, mirroring the old Spring ContactService / LeadService config.
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASSWORD = process.env.SMTP_PASSWORD || '';
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = Number(process.env.SMTP_PORT || '587');
const MAIL_TO = process.env.MAIL_TO || 'studiokraftika@gmail.com';
const MAIL_CC = process.env.MAIL_CC || '';

export function mailConfigured(): boolean {
  return Boolean(SMTP_USER && SMTP_PASSWORD);
}

function transport() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });
}

/** Contact-form email — sent to the studio inbox, reply-to the sender. */
export async function sendContactEmail(name: string, email: string, message: string): Promise<void> {
  if (!mailConfigured()) {
    console.warn('[mailer] SMTP not configured, skipping contact email for', email);
    return;
  }
  const html = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #333;">New Contact Form Message</h2>
    <p><strong>Sender Name:</strong> ${name}</p>
    <p><strong>Sender Email:</strong> <a href="mailto:${email}">${email}</a></p>
    <hr style="border: 1px solid #eee; margin: 20px 0;">
    <p><strong>Message:</strong></p>
    <p style="white-space: pre-wrap; background: #f5f5f5; padding: 15px; border-radius: 5px;">${message}</p>
  </div>`;
  await transport().sendMail({
    from: SMTP_USER,
    to: MAIL_TO,
    cc: MAIL_CC || undefined,
    replyTo: email,
    subject: `New message from ${name}`,
    html,
  });
}

/** Lead "thank you" email — sent to the lead's own address. */
export async function sendLeadEmail(name?: string, email?: string, phone?: string): Promise<void> {
  if (!mailConfigured() || !email) {
    console.warn('[mailer] SMTP not configured or no lead email, skipping');
    return;
  }
  const display = name && name.length ? name : 'Valued Customer';
  const html = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #333; text-align: center;">Thank You for Your Interest!</h2>
    <p>Dear ${display},</p>
    <p>Thank you for reaching out to Kraftika! We've received your inquiry and our team will get back to you soon.</p>
    <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <p><strong>Your Details:</strong></p>
      <p><strong>Name:</strong> ${name && name.length ? name : 'Not provided'}</p>
      ${email ? `<p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>` : ''}
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
    </div>
    <p>We appreciate your interest in our products and look forward to connecting with you.</p>
    <p>Best regards,<br>The Kraftika Team</p>
  </div>`;
  await transport().sendMail({
    from: SMTP_USER,
    to: email,
    cc: MAIL_CC || undefined,
    subject: 'Thank You for Your Interest in Kraftika!',
    html,
  });
}
