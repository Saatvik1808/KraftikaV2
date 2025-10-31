import nodemailer from "nodemailer";

export interface Message {
  name: string;
  email: string;
  message: string;
}

export interface Lead {
  email?: string;
  phone?: string;
  name?: string;
}

export async function sendEmail({ name, email, message }: Message): Promise<boolean> {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"${name}" <${process.env.SMTP_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `New message from ${name}`,
      text: message,
      html: `
        <p><strong>Sender Name:</strong> ${name}</p>
        <p><strong>Sender Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return false;
  }
}

export async function sendLeadNotification(lead: Lead): Promise<boolean> {
  try {
    // Check if SMTP is configured
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.EMAIL_TO) {
      console.warn("⚠️ SMTP configuration missing. Logging lead to console instead.");
      console.log("📧 NEW LEAD SUBMITTED:", {
        name: lead.name || "Not provided",
        email: lead.email || "Not provided",
        phone: lead.phone || "Not provided",
        timestamp: new Date().toISOString(),
      });
      // Return true even if email fails, so the lead is still captured
      return true;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const leadInfo = [
      lead.name && `<p><strong>Name:</strong> ${lead.name}</p>`,
      lead.email && `<p><strong>Email:</strong> ${lead.email}</p>`,
      lead.phone && `<p><strong>Phone:</strong> ${lead.phone}</p>`,
    ].filter(Boolean).join('');

    const mailOptions = {
      from: `"Kraftika Website" <${process.env.SMTP_USER}>`,
      to: process.env.EMAIL_TO,
      cc: "saatvik.shrivastava08@gmail.com",
      subject: `New Lead: ${lead.email || lead.phone || 'Interested Customer'}`,
      text: `New lead submitted:\n${lead.name ? `Name: ${lead.name}\n` : ''}${lead.email ? `Email: ${lead.email}\n` : ''}${lead.phone ? `Phone: ${lead.phone}\n` : ''}`,
      html: `
        <h2>New Lead Submitted</h2>
        <p>A potential customer has expressed interest in Kraftika products.</p>
        ${leadInfo}
        <p><em>Please follow up with this lead as soon as possible.</em></p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Lead notification sent:", info.messageId);
    
    // Also log to console as backup
    console.log("📧 NEW LEAD SUBMITTED:", {
      name: lead.name || "Not provided",
      email: lead.email || "Not provided",
      phone: lead.phone || "Not provided",
      timestamp: new Date().toISOString(),
    });
    
    return true;
  } catch (error: any) {
    console.error("❌ Error sending lead notification:", error);
    // Log the lead anyway so it's not lost
    console.log("📧 NEW LEAD SUBMITTED (Email failed, but lead captured):", {
      name: lead.name || "Not provided",
      email: lead.email || "Not provided",
      phone: lead.phone || "Not provided",
      timestamp: new Date().toISOString(),
      error: error.message || "Unknown error",
    });
    // Still return true so the form submission succeeds
    // The lead is logged to console, which is better than losing it
    return true;
  }
}
