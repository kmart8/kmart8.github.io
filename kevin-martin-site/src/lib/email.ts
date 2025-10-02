import { Resend } from 'resend';

// Use placeholder during build if env var is not set
const resendApiKey = process.env.RESEND_API_KEY || 'placeholder-key';

export const resend = new Resend(resendApiKey);

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from }: EmailOptions) {
  // Check if we're in a valid runtime environment
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured');
    return { success: false, error: new Error('Email service not configured') };
  }

  try {
    // Use environment variable for sender email, defaulting to onboarding@resend.dev for testing
    const defaultFrom = process.env.EMAIL_FROM_ADDRESS || 'Kevin Martin <onboarding@resend.dev>';
    
    const result = await resend.emails.send({
      from: from || defaultFrom,
      to,
      subject,
      html,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

export function generateUnsubscribeUrl(email: string, token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return `${baseUrl}/api/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
}

export async function sendWelcomeEmail(email: string, verificationToken: string) {
  const welcomeEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Kevin Martin's Blog</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f172a;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #0f172a;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #1e293b; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #f8fafc;">
                Welcome
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 0 40px 40px;">
              <h2 style="margin: 0 0 16px; font-size: 22px; font-weight: 600; color: #f1f5f9;">
                Thanks for subscribing
              </h2>
              
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #cbd5e1;">
                You'll receive notifications whenever I publish new posts.
              </p>
              
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td style="border-radius: 6px; background-color: #3b82f6;">
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blog" style="display: inline-block; padding: 12px 32px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none;">
                      Read Latest Posts
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; border-top: 1px solid #334155; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 14px; color: #94a3b8;">
                You can unsubscribe at any time using the link below.
              </p>
              <a href="${generateUnsubscribeUrl(email, verificationToken)}" style="font-size: 14px; color: #94a3b8; text-decoration: none;">
                Unsubscribe
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return await sendEmail({
    to: email,
    subject: "Welcome to Kevin Martin's Blog",
    html: welcomeEmailHtml,
  });
}
