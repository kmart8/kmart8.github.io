# Blog Subscription - Quick Reference Card

## 🚀 Quick Commands

```bash
# Install dependencies (already done)
npm install

# Start dev server
npm run dev

# Send notification for a blog post
./scripts/send-notification.sh your-post-slug

# Example: Send notification for existing post
./scripts/send-notification.sh what-gets-measured-gets-fixed
```

## 📋 Setup Checklist

```bash
# 1. Copy environment template
cp .env.local.example .env.local

# 2. Get Supabase credentials (supabase.com)
#    - Project URL
#    - Anon key
#    - Service role key

# 3. Get Resend API key (resend.com)
#    - Create account
#    - Create API key

# 4. Run SQL in Supabase SQL Editor
#    (See SUBSCRIPTION_SETUP.md Step 1.2)

# 5. Fill in .env.local with your keys

# 6. Start and test!
npm run dev
```

## 🗂️ File Structure

```
kevin-martin-site/
├── src/
│   ├── lib/
│   │   ├── supabase.ts          # Database client
│   │   └── email.ts             # Email service
│   ├── app/
│   │   ├── api/
│   │   │   ├── subscribe/       # POST /api/subscribe
│   │   │   ├── unsubscribe/     # GET /api/unsubscribe
│   │   │   └── send-notification/ # POST /api/send-notification
│   │   └── blog/
│   │       └── page.tsx         # Blog page with form
│   └── components/
│       └── SubscriptionForm.tsx # Subscription UI
├── scripts/
│   └── send-notification.sh     # Helper script
├── .env.local                   # Your secrets (gitignored)
├── .env.local.example           # Template
├── SUBSCRIPTION_SETUP.md        # Detailed guide
├── QUICKSTART.md                # 5-min guide
└── SUBSCRIPTION_SUMMARY.md      # Overview
```

## 🔌 API Endpoints

### Subscribe
```bash
POST /api/subscribe
Body: { "email": "user@example.com" }
Response: { "message": "Successfully subscribed!" }
```

### Unsubscribe
```bash
GET /api/unsubscribe?email=user@example.com&token=abc123
Response: HTML confirmation page
```

### Send Notification (Protected)
```bash
POST /api/send-notification
Headers: Authorization: Bearer YOUR_SECRET
Body: { "postSlug": "your-post-slug" }
Response: { "sent": 10, "failed": 0, "total": 10 }
```

## 🗄️ Database Schema

### subscribers table
```sql
id                UUID PRIMARY KEY
email             TEXT UNIQUE NOT NULL
status            TEXT ('active', 'unsubscribed')
subscribed_at     TIMESTAMP
unsubscribed_at   TIMESTAMP
verification_token TEXT
verified          BOOLEAN
created_at        TIMESTAMP
updated_at        TIMESTAMP
```

### sent_emails table
```sql
id              UUID PRIMARY KEY
subscriber_id   UUID (FK)
blog_post_id    TEXT
email_address   TEXT
sent_at         TIMESTAMP
status          TEXT ('sent', 'failed', 'bounced')
error_message   TEXT
```

## 🔑 Environment Variables

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
RESEND_API_KEY=re_...

# Optional
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NOTIFICATION_API_SECRET=your-secret-key
```

## 📧 Email Template Variables

When customizing the email in `send-notification/route.ts`:

```typescript
{
  title: string;        // Blog post title
  excerpt: string;      // Post excerpt
  postUrl: string;      // Full URL to post
  unsubscribeUrl: string; // Unsubscribe link
  date: string;         // Publication date
  readTime: string;     // Read time estimate
}
```

## 🧪 Testing Flow

1. **Test Subscription:**
   - Go to http://localhost:3000/blog
   - Enter email
   - Check Supabase > subscribers table

2. **Test Email:**
   ```bash
   ./scripts/send-notification.sh what-gets-measured-gets-fixed
   ```
   - Check your email inbox
   - Verify formatting looks good

3. **Test Unsubscribe:**
   - Click unsubscribe link in email
   - Verify confirmation page shows
   - Check Supabase > subscribers > status = 'unsubscribed'

## 💰 Free Tier Limits

| Service  | Free Tier               | Suitable For       |
|----------|-------------------------|--------------------|
| Supabase | 500MB, 2GB bandwidth    | 10,000+ subscribers|
| Resend   | 3,000 emails/month      | 750 subscribers*   |

*Assuming 4 blog posts per month

## ⚡ Common Tasks

### Add New Subscriber Manually
```sql
INSERT INTO subscribers (email, status) 
VALUES ('user@example.com', 'active');
```

### View All Subscribers
```sql
SELECT email, status, subscribed_at 
FROM subscribers 
WHERE status = 'active'
ORDER BY subscribed_at DESC;
```

### Check Last 10 Sent Emails
```sql
SELECT blog_post_id, email_address, sent_at, status 
FROM sent_emails 
ORDER BY sent_at DESC 
LIMIT 10;
```

### Count Active Subscribers
```sql
SELECT COUNT(*) FROM subscribers WHERE status = 'active';
```

## 🔧 Customization Points

| What to Customize | Where | Why |
|-------------------|-------|-----|
| Sender email | `src/lib/email.ts:14` | Brand consistency |
| Email design | `src/app/api/send-notification/route.ts` | Match your style |
| Form styling | `src/components/SubscriptionForm.tsx` | Match your design |
| Validation rules | `src/app/api/subscribe/route.ts` | Add custom rules |

## 🚨 Production Checklist

- [ ] Verify domain in Resend
- [ ] Update sender email
- [ ] Set production `NEXT_PUBLIC_SITE_URL`
- [ ] Generate strong `NOTIFICATION_API_SECRET`
- [ ] Test all flows end-to-end
- [ ] Set up error monitoring
- [ ] Add rate limiting (optional)
- [ ] Add reCAPTCHA (optional)

## 📚 Documentation Files

- **QUICKSTART.md** - Start here! 5-minute setup
- **SUBSCRIPTION_SETUP.md** - Detailed instructions
- **SUBSCRIPTION_SUMMARY.md** - Architecture overview
- **QUICK_REFERENCE.md** - This file (commands & tips)

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Missing env vars | Copy `.env.local.example` to `.env.local` |
| Emails not sending | Check Resend API key & sender email |
| Can't subscribe | Check Supabase credentials & RLS policies |
| 401 on notification | Check `NOTIFICATION_API_SECRET` matches |

---

**Need help?** Check `QUICKSTART.md` Troubleshooting section or review the full `SUBSCRIPTION_SETUP.md` guide.
