import nodemailer from "nodemailer";

export interface Message {
  name: string;
  email: string;
  message: string;
}

// Validate that all required environment variables are present
function validateEmailConfig(): { valid: boolean; missing: string[] } {
  const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'EMAIL_TO'];
  const missing: string[] = [];

  // Debug: Log which variables are present (without showing values)
  console.log("📧 Checking email configuration:");
  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (!value || value.trim() === '') {
      missing.push(varName);
      console.log(`   ❌ ${varName}: NOT SET`);
    } else {
      console.log(`   ✅ ${varName}: SET (${value.length} chars)`);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

export type EmailResult = {
  success: boolean;
  error?: string;
  errorType?: 'config' | 'connection' | 'auth' | 'send' | 'unknown';
};

export async function sendEmail({ name, email, message }: Message): Promise<EmailResult> {
  // Validate environment variables first
  const configCheck = validateEmailConfig();
  if (!configCheck.valid) {
    const missingVars = configCheck.missing.join(', ');
    console.error("❌ Email configuration error: Missing required environment variables:", missingVars);
    console.error("Please set the following environment variables:");
    configCheck.missing.forEach(varName => {
      console.error(`  - ${varName}`);
    });
    return {
      success: false,
      error: `Missing required environment variables: ${missingVars}`,
      errorType: 'config'
    };
  }

  try {
    const smtpPort = Number(process.env.SMTP_PORT);
    if (isNaN(smtpPort) || smtpPort <= 0) {
      console.error("❌ Email configuration error: SMTP_PORT must be a valid number");
      return {
        success: false,
        error: 'SMTP_PORT must be a valid number',
        errorType: 'config'
      };
    }

    // Determine if secure connection should be used (typically port 465 uses secure)
    const secure = smtpPort === 465;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: smtpPort,
      secure: secure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Add connection timeout and error handling
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    // Verify transporter configuration
    await transporter.verify();
    console.log("✅ SMTP connection verified");

    const mailOptions = {
      from: `"${name}" <${process.env.SMTP_USER}>`,
      to: process.env.EMAIL_TO,
      replyTo: email, // Allow replying directly to the sender
      subject: `New message from ${name}`,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Message</h2>
          <p><strong>Sender Name:</strong> ${name}</p>
          <p><strong>Sender Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; background: #f5f5f5; padding: 15px; border-radius: 5px;">${message}</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);
    console.log("📧 Email sent to:", process.env.EMAIL_TO);
    return { success: true };
  } catch (error) {
    console.error("❌ Error sending email:");
    let errorType: EmailResult['errorType'] = 'unknown';
    let errorMessage = 'Failed to send email';
    
    if (error instanceof Error) {
      console.error("   Error message:", error.message);
      console.error("   Error stack:", error.stack);
      
      // Provide more specific error messages
      if (error.message.includes('ECONNECTION') || error.message.includes('ETIMEDOUT')) {
        errorType = 'connection';
        errorMessage = 'Cannot connect to SMTP server. Check SMTP_HOST and SMTP_PORT.';
        console.error("   Issue: Cannot connect to SMTP server. Check SMTP_HOST and SMTP_PORT.");
      } else if (error.message.includes('EAUTH') || error.message.includes('authentication')) {
        errorType = 'auth';
        errorMessage = 'Authentication failed. Check SMTP_USER and SMTP_PASS.';
        console.error("   Issue: Authentication failed. Check SMTP_USER and SMTP_PASS.");
      } else if (error.message.includes('EENVELOPE')) {
        errorType = 'send';
        errorMessage = 'Invalid email address. Check EMAIL_TO.';
        console.error("   Issue: Invalid email address. Check EMAIL_TO.");
      } else {
        errorMessage = error.message;
      }
    } else {
      console.error("   Unknown error:", error);
      errorMessage = 'Unknown error occurred';
    }
    
    return {
      success: false,
      error: errorMessage,
      errorType
    };
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
