# Blog Subscription Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### 1. Set Up Supabase (2 min)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project"
3. Fill in project details and wait for setup to complete
4. Go to **Project Settings > API** and copy:
   - Project URL
   - `anon public` key
   - `service_role` key (keep this secret!)

5. Go to **SQL Editor** and run the SQL from `SUBSCRIPTION_SETUP.md` (Step 1.2)

### 2. Set Up Resend (2 min)

1. Go to [resend.com](https://resend.com) and create a free account
2. Go to **API Keys** and create a new key
3. Copy the API key (starts with `re_`)

**For testing:** The system now defaults to `onboarding@resend.dev` which only sends to your sign-up email

**For production:** Set `EMAIL_FROM_ADDRESS` environment variable to your verified domain email

### 3. Configure Environment Variables (1 min)

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Fill in your keys in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
RESEND_API_KEY=re_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NOTIFICATION_API_SECRET=generate-a-random-string-here
# Optional: Override default sender email (defaults to onboarding@resend.dev for testing)
EMAIL_FROM_ADDRESS=Kevin Martin <kevin@yourdomain.com>
```

### 4. Start the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000/blog` to see the subscription form!

## 📧 Testing the Subscription Flow

### Test Subscription

1. Go to your blog page: `http://localhost:3000/blog`
2. Enter your email in the subscription form
3. Check Supabase Dashboard > Table Editor > `subscribers` to see the new entry

### Test Email Notification

The system now defaults to using `onboarding@resend.dev` for testing (only sends to your sign-up email).

Send a test notification:

```bash
cd /Users/kevinmartin/Projects/kmart8.github.io/kevin-martin-site
./scripts/send-notification.sh what-gets-measured-gets-fixed
```

Check your email inbox!

### Test Unsubscribe

Click the unsubscribe link in the email you received.

## 🎯 Sending Notifications for New Posts

When you publish a new blog post:

**Option 1: Command Line**
```bash
./scripts/send-notification.sh your-post-slug
```

**Option 2: Manual API Call**
```bash
curl -X POST http://localhost:3000/api/send-notification \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-key" \
  -d '{"postSlug": "your-post-slug"}'
```

**Option 3: GitHub Actions** (for production)

Create `.github/workflows/notify-subscribers.yml`:

```yaml
name: Notify Subscribers

on:
  workflow_dispatch:
    inputs:
      post_slug:
        description: 'Blog post slug'
        required: true
        type: string

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Send Notification
        run: |
          curl -X POST ${{ secrets.SITE_URL }}/api/send-notification \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer ${{ secrets.NOTIFICATION_API_SECRET }}" \
            -d '{"postSlug": "${{ github.event.inputs.post_slug }}"}'
```

Add these secrets to your GitHub repo:
- `SITE_URL`
- `NOTIFICATION_API_SECRET`

## 📊 Monitoring

### Check Subscribers

Go to Supabase Dashboard > Table Editor > `subscribers`

### Check Sent Emails

Go to Supabase Dashboard > Table Editor > `sent_emails`

Or check Resend Dashboard for delivery status

## 🔧 Customization

### Update Email Template

Edit `src/app/api/send-notification/route.ts`, function `generateEmailHtml()`

### Update Subscription Form

Edit `src/components/SubscriptionForm.tsx`

### Add Welcome Email

Uncomment the welcome email line in `src/app/api/subscribe/route.ts` and create the function

### Add Double Opt-in

1. Set `verified: false` in subscribe route (already done)
2. Send verification email with a token
3. Create `/api/verify` endpoint to mark as verified
4. Only send notifications to verified subscribers

## 🚨 Production Checklist

Before going live:

- [ ] Set `EMAIL_FROM_ADDRESS` environment variable to your verified domain email
- [ ] Verify your domain in Resend
- [ ] Update `NEXT_PUBLIC_SITE_URL` in `.env.local`
- [ ] Generate a strong random string for `NOTIFICATION_API_SECRET`
- [ ] Add rate limiting to subscription endpoint
- [ ] Consider adding reCAPTCHA to prevent spam
- [ ] Consider implementing double opt-in
- [ ] Test all flows end-to-end
- [ ] Set up monitoring/alerts for failed sends

## 💡 Tips

1. **Free Tier Limits:**
   - Supabase: 500MB database, 2GB bandwidth/month
   - Resend: 3,000 emails/month, 100 emails/day

2. **Testing Emails:**
   - Use [Mailinator](https://www.mailinator.com) for throwaway test emails
   - Use your own email for the first test

3. **Email Best Practices:**
   - Include clear unsubscribe link
   - Add a plain text version
   - Keep subject lines concise
   - Test on multiple email clients

4. **Database Backups:**
   - Supabase automatically backs up daily on free tier
   - Export subscriber list periodically

## 🆘 Troubleshooting

### "Missing env.NEXT_PUBLIC_SUPABASE_URL"

Make sure `.env.local` exists and has all required variables

### Emails Not Sending

1. Check Resend dashboard for errors
2. Check `sent_emails` table for error messages
3. Verify API key is correct
4. Check sender email is verified/valid

### Subscription Form Not Working

1. Check browser console for errors
2. Check Next.js terminal for API route errors
3. Verify Supabase credentials
4. Check Supabase RLS policies

### "Subscriber already exists" error

This means the email is already in the database (possibly unsubscribed). The API will reactivate the subscription automatically.

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Resend Documentation](https://resend.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## 🎉 You're Done!

Your blog now has a fully functional subscription system. Test it out and start growing your audience!
