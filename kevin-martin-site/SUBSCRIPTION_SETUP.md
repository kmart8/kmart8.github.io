# Blog Subscription Setup Guide

## Overview
This guide will help you set up email subscriptions for your blog using Supabase (database) and Resend (email service).

## Prerequisites
1. Supabase account (free tier)
2. Resend account (free tier: 3,000 emails/month)

## Step 1: Set Up Supabase

### 1.1 Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Save your project URL and anon key

### 1.2 Create Database Table
Run this SQL in the Supabase SQL Editor:

```sql
-- Create subscribers table
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'unsubscribed'
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  verification_token TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_subscribers_status ON subscribers(status);

-- Create sent_emails tracking table (optional but recommended)
CREATE TABLE sent_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID REFERENCES subscribers(id) ON DELETE CASCADE,
  blog_post_id TEXT NOT NULL,
  email_address TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'sent', -- 'sent', 'failed', 'bounced'
  error_message TEXT
);

CREATE INDEX idx_sent_emails_blog_post ON sent_emails(blog_post_id);
CREATE INDEX idx_sent_emails_subscriber ON sent_emails(subscriber_id);

-- Enable Row Level Security (RLS)
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sent_emails ENABLE ROW LEVEL SECURITY;

-- Create policy for anonymous inserts (for subscription form)
CREATE POLICY "Allow anonymous inserts" ON subscribers
  FOR INSERT TO anon
  WITH CHECK (true);

-- Create policy for reading own subscription
CREATE POLICY "Users can read their own subscription" ON subscribers
  FOR SELECT TO anon
  USING (true);

-- Service role will handle updates/deletes via API routes
```

## Step 2: Set Up Resend

### 2.1 Create Resend Account
1. Go to [resend.com](https://resend.com)
2. Create an account
3. Verify your domain (or use onboarding@resend.dev for testing)

### 2.2 Get API Key
1. Go to API Keys section
2. Create a new API key
3. Save it for environment variables

## Step 3: Install Dependencies

```bash
npm install @supabase/supabase-js resend
npm install --save-dev @types/node
```

## Step 4: Configure Environment Variables

Create/update `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Resend
RESEND_API_KEY=your_resend_api_key

# Your site URL
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Step 5: Implementation Files

The following files will be created:

1. **lib/supabase.ts** - Supabase client
2. **lib/email.ts** - Email service wrapper
3. **app/api/subscribe/route.ts** - Subscribe API endpoint
4. **app/api/unsubscribe/route.ts** - Unsubscribe API endpoint
5. **app/api/send-notification/route.ts** - Send notifications to all subscribers
6. **components/SubscriptionForm.tsx** - Subscription form component
7. **emails/new-post-notification.tsx** - Email template

## Step 6: Sending Notifications

When you publish a new blog post, you have two options:

### Option A: Manual Trigger
Call the API endpoint manually or via a script:
```bash
curl -X POST https://yourdomain.com/api/send-notification \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SECRET_KEY" \
  -d '{"postSlug": "your-post-slug"}'
```

### Option B: Automatic (GitHub Actions)
If you're deploying via Git, set up a GitHub Action to trigger on pushes to main.

## Security Considerations

1. **Rate Limiting**: Add rate limiting to subscription endpoint
2. **Email Verification**: Consider adding double opt-in
3. **Unsubscribe Token**: Generate secure tokens for unsubscribe links
4. **API Authentication**: Protect the send-notification endpoint with a secret key
5. **CAPTCHA**: Consider adding reCAPTCHA to prevent spam subscriptions

## Testing

1. Test subscription form locally
2. Test unsubscribe flow
3. Send test email notification
4. Verify database entries in Supabase dashboard

## Monitoring

1. Monitor sent_emails table for delivery issues
2. Check Resend dashboard for bounce/complaint rates
3. Set up alerts for failed sends

## Cost Estimates (Free Tiers)

- **Supabase**: 500MB database, 2GB bandwidth/month
- **Resend**: 3,000 emails/month, 100 emails/day
- **Total cost**: $0 for small-medium blogs

## Scaling Considerations

When you outgrow free tiers:
- Supabase Pro: $25/month
- Resend: Pay-as-you-go ($0.10/1000 emails)

For high-volume needs (>10k subscribers), consider:
- Using a dedicated email service like AWS SES
- Implementing batch processing
- Adding background job processing (e.g., with Inngest or Trigger.dev)
