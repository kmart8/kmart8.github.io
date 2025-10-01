import { getServiceSupabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    if (!email || !token) {
      return new Response(
        `
        <!DOCTYPE html>
        <html>
          <head><title>Invalid Unsubscribe Link</title></head>
          <body style="font-family: system-ui; max-width: 600px; margin: 50px auto; padding: 20px;">
            <h1>Invalid Link</h1>
            <p>This unsubscribe link is invalid or has expired.</p>
          </body>
        </html>
        `,
        {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
          status: 400,
        }
      );
    }

    const supabase = getServiceSupabase();

    // Verify token and unsubscribe
    const { data: subscriber, error: fetchError } = await supabase
      .from('subscribers')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (fetchError || !subscriber) {
      return new Response(
        `
        <!DOCTYPE html>
        <html>
          <head><title>Subscriber Not Found</title></head>
          <body style="font-family: system-ui; max-width: 600px; margin: 50px auto; padding: 20px;">
            <h1>Subscriber Not Found</h1>
            <p>We couldn't find a subscription with this email address.</p>
          </body>
        </html>
        `,
        {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
          status: 404,
        }
      );
    }

    // Verify token matches (simple verification)
    if (subscriber.verification_token !== token) {
      return new Response(
        `
        <!DOCTYPE html>
        <html>
          <head><title>Invalid Token</title></head>
          <body style="font-family: system-ui; max-width: 600px; margin: 50px auto; padding: 20px;">
            <h1>Invalid Token</h1>
            <p>The verification token is invalid.</p>
          </body>
        </html>
        `,
        {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
          status: 403,
        }
      );
    }

    // Update subscriber status
    const { error: updateError } = await supabase
      .from('subscribers')
      .update({
        status: 'unsubscribed',
        unsubscribed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('email', email.toLowerCase());

    if (updateError) throw updateError;

    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Successfully Unsubscribed</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              max-width: 600px;
              margin: 50px auto;
              padding: 20px;
              background: #f9fafb;
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 8px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            h1 { color: #111827; margin-bottom: 16px; }
            p { color: #6b7280; line-height: 1.6; }
            a { color: #2563eb; text-decoration: none; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✓ Successfully Unsubscribed</h1>
            <p>You have been unsubscribed from blog post notifications.</p>
            <p>We're sorry to see you go! You can resubscribe at any time by visiting our <a href="${process.env.NEXT_PUBLIC_SITE_URL || ''}/blog">blog page</a>.</p>
          </div>
        </body>
      </html>
      `,
      {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      }
    );
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head><title>Error</title></head>
        <body style="font-family: system-ui; max-width: 600px; margin: 50px auto; padding: 20px;">
          <h1>Error</h1>
          <p>An error occurred while processing your request. Please try again later.</p>
        </body>
      </html>
      `,
        {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
          status: 500,
        }
    );
  }
}
