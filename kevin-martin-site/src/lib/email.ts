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
    const result = await resend.emails.send({
      from: from || 'Kevin Martin <kevin@k3vinmartin.com>', // Use resend.dev for testing, replace with your verified domain for production
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
