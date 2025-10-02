# Kevin Martin - Personal Website

my personal website built with Next.js, TypeScript, and Tailwind CSS.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Email Notifications

To notify the test user of a new blog post, run the following in the terminal:
```bash
./scripts/send-notification.sh blog-slug-name
```

To actually send notifications to subscribers, run the following in the terminal:
```bash
./scripts/send-notification.sh blog-slug-name EMAIL_FROM_ADDRESS=Kevin Martin <kevin@k3vinmartin.com>
```