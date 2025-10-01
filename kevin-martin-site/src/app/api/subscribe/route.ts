import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    // Check if email already exists
    const { data: existing } = await supabase
      .from('subscribers')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (existing) {
      if (existing.status === 'active') {
        return NextResponse.json(
          { message: 'You are already subscribed!' },
          { status: 200 }
        );
      } else {
        // Reactivate subscription
        const { error } = await supabase
          .from('subscribers')
          .update({
            status: 'active',
            subscribed_at: new Date().toISOString(),
            unsubscribed_at: null,
            updated_at: new Date().toISOString(),
          })
          .eq('email', email.toLowerCase());

        if (error) throw error;

        return NextResponse.json({
          message: 'Successfully resubscribed to blog updates!',
        });
      }
    }

    // Create new subscriber
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    const { error } = await supabase.from('subscribers').insert({
      email: email.toLowerCase(),
      status: 'active',
      verification_token: verificationToken,
      verified: false, // Set to true if you don't want email verification
    });

    if (error) throw error;

    // TODO: Send welcome email (optional)
    // await sendWelcomeEmail(email);

    return NextResponse.json({
      message: 'Successfully subscribed to blog updates!',
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
