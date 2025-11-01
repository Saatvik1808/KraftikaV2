# Email Setup Guide

This guide will help you configure email notifications for the "Get in Touch" contact form.

## Required Environment Variables

The contact form requires the following environment variables to be set in your `.env.local` file (for local development) or in your deployment platform's environment settings:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_TO=studiokraftika@gmail.com
```

## Setting Up Gmail SMTP

### Step 1: Enable 2-Factor Authentication

1. Go to your Google Account settings
2. Navigate to **Security**
3. Enable **2-Step Verification**

### Step 2: Generate App Password

1. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
2. Select **Mail** and **Other (Custom name)**
3. Enter "Kraftika Contact Form" as the name
4. Click **Generate**
5. Copy the 16-character password (you'll use this as `SMTP_PASS`)

### Step 3: Configure Environment Variables

Create or update your `.env.local` file in the `KraftikaV2` directory:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
EMAIL_TO=studiokraftika@gmail.com
```

**Important:** Never commit `.env.local` to version control! It's already in `.gitignore`.

## Alternative Email Providers

### Outlook/Hotmail

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
EMAIL_TO=studiokraftika@gmail.com
```

### SendGrid

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
EMAIL_TO=studiokraftika@gmail.com
```

### Mailgun

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-smtp-username
SMTP_PASS=your-mailgun-smtp-password
EMAIL_TO=studiokraftika@gmail.com
```

## Port Configuration

- **Port 587**: Use with `secure: false` (STARTTLS) - Recommended for most providers
- **Port 465**: Use with `secure: true` (SSL/TLS) - Used by some providers
- **Port 25**: Generally not recommended due to spam filtering

The email service automatically detects port 465 and uses secure connections.

## Testing the Configuration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the contact page (`/contact`)

3. Fill out the form and submit

4. Check your server console for logs:
   - ✅ Success: "Email sent successfully"
   - ❌ Error: Detailed error messages will indicate what's wrong

## Troubleshooting

### Error: "Missing required environment variables"

**Solution:** Ensure all environment variables are set in `.env.local` and restart your development server.

### Error: "Cannot connect to SMTP server"

**Possible causes:**
- Incorrect `SMTP_HOST` or `SMTP_PORT`
- Firewall blocking the connection
- Network issues

**Solution:** Verify your SMTP settings and try a different port (587 or 465).

### Error: "Authentication failed"

**Possible causes:**
- Incorrect email or password
- Gmail App Password not generated (if using Gmail)
- 2FA not enabled (required for Gmail App Passwords)

**Solution:** 
- For Gmail: Ensure 2FA is enabled and use an App Password (not your regular password)
- For other providers: Verify your credentials

### Error: "Invalid email address"

**Solution:** Check that `EMAIL_TO` is a valid email address format.

## Deployment

For production deployment (Vercel, Netlify, etc.), add these environment variables in your platform's dashboard:

1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add each variable:
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `EMAIL_TO`
4. Redeploy your application

## Security Best Practices

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use App Passwords** - Don't use your main account password
3. **Rotate credentials regularly** - Especially if exposed
4. **Use environment-specific values** - Different credentials for dev/staging/prod
5. **Limit email permissions** - Only grant necessary permissions

## Support

If you continue to have issues:

1. Check the server console logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test SMTP connection using a tool like [mail-tester.com](https://www.mail-tester.com/)
4. Contact support with the error logs

