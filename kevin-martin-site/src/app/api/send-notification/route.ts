import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { sendEmail, generateUnsubscribeUrl } from '@/lib/email';
import { getPostBySlug } from '@/data/blog';

// This endpoint should be protected with authentication
// For now, using a simple API key approach
const API_SECRET = process.env.NOTIFICATION_API_SECRET || 'your-secret-key-here';

export async function POST(request: Request) {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || authHeader !== `Bearer ${API_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { postSlug } = await request.json();

    if (!postSlug) {
      return NextResponse.json(
        { error: 'postSlug is required' },
        { status: 400 }
      );
    }

    // Get blog post
    const post = getPostBySlug(postSlug);
    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    const supabase = getServiceSupabase();

    // Get all active subscribers
    const { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('*')
      .eq('status', 'active');

    if (error) throw error;

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({
        message: 'No active subscribers to notify',
        sent: 0,
      });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const postUrl = `${siteUrl}/blog/${post.slug}`;

    // Send emails to all subscribers
    const results = await Promise.allSettled(
      subscribers.map(async (subscriber) => {
        const unsubscribeUrl = generateUnsubscribeUrl(
          subscriber.email,
          subscriber.verification_token
        );

        const emailHtml = generateEmailHtml({
          title: post.title,
          excerpt: post.excerpt,
          postUrl,
          unsubscribeUrl,
          date: post.date,
          readTime: post.readTime,
        });

        const result = await sendEmail({
          to: subscriber.email,
          subject: `New Blog Post: ${post.title}`,
          html: emailHtml,
        });

        // Log the send attempt
        await supabase.from('sent_emails').insert({
          subscriber_id: subscriber.id,
          blog_post_id: post.id,
          email_address: subscriber.email,
          status: result.success ? 'sent' : 'failed',
          error_message: result.success ? null : JSON.stringify(result.error),
        });

        return { email: subscriber.email, success: result.success };
      })
    );

    const successful = results.filter(
      (r) => r.status === 'fulfilled' && r.value.success
    ).length;
    const failed = results.length - successful;

    return NextResponse.json({
      message: 'Notifications sent',
      sent: successful,
      failed,
      total: subscribers.length,
    });
  } catch (error) {
    console.error('Send notification error:', error);
    return NextResponse.json(
      { error: 'Failed to send notifications' },
      { status: 500 }
    );
  }
}

interface EmailTemplateData {
  title: string;
  excerpt: string;
  postUrl: string;
  unsubscribeUrl: string;
  date: string;
  readTime: string;
}

function generateEmailHtml(data: EmailTemplateData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.title}</title>
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
                New Blog Post
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 0 40px 40px;">
              <h2 style="margin: 0 0 16px; font-size: 22px; font-weight: 600; color: #f1f5f9;">
                ${data.title}
              </h2>
              
              <p style="margin: 0 0 8px; font-size: 14px; color: #94a3b8;">
                ${data.date} • ${data.readTime}
              </p>
              
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #cbd5e1;">
                ${data.excerpt}
              </p>
              
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td style="border-radius: 6px; background-color: #2563eb;">
                    <a href="${data.postUrl}" style="display: inline-block; padding: 12px 32px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none;">
                      Read More
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
                You're receiving this because you subscribed to blog updates.
              </p>
              <a href="${data.unsubscribeUrl}" style="font-size: 14px; color: #94a3b8; text-decoration: none;">
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
}
