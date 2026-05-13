# Deployment Guide

This guide walks through deploying the Invitation App to production environments (Vercel, Docker, or self‑hosted Node server).

## 1. Vercel (Recommended)

1. **Create a Vercel Project**: Import the Git repository (GitHub, GitLab, or Bitbucket) into Vercel.
2. **Environment Variables**: Add the variables from `.env` (see **Environment Configuration** section) to Vercel's dashboard.
3. **Framework Detection**: Vercel automatically detects a Next.js app. Ensure the `build` command is set to `npm run build` and the `output directory` to `.next`.
4. **Deploy**: Click **Deploy** – Vercel will install dependencies, run `npm run build`, and serve the app on a generated URL.
5. **Custom Domain**: Add your domain and configure DNS to point to Vercel's CNAME.

## 2. Docker Container

Create a lightweight Docker image for environments where Vercel is not an option.

```dockerfile
# Use the official Node.js 20 image (slim)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build

# Runtime stage – only need the built app and node_modules
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/package.json ./
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "run", "start"]
```

Build and run:
```bash
docker build -t invitation-app .
docker run -p 3000:3000 -e DATABASE_URL=$DATABASE_URL -e AUTH_SECRET=$AUTH_SECRET invitation-app
```

## 3. Self‑Hosted Node Server

1. **Clone the repo** and install dependencies.
2. **Set environment variables** (see below).
3. Build and start:
   ```bash
   npm run build
   npm start
   ```
4. Use a process manager like **PM2** or **systemd** to keep the service alive.

---
## Environment Configuration

All variables are defined in `.env.example`. Copy it to `.env` and fill in production values:
- `DATABASE_URL` – PostgreSQL connection string (use Supabase, Railway, or self‑hosted).
- `AUTH_SECRET` – 32‑byte base64 string (`openssl rand -base64 32`).
- `NEXTAUTH_URL` – Base URL of the deployed app (e.g., `https://my-wedding.com`).
- Twilio variables (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`, `TWILIO_WHATSAPP_NUMBER`).
- `RESEND_API_KEY` if you use Resend for email.

**Never commit** `.env` to source control.

---
## Post‑Deployment Checklist

- Verify that the database migrations have been applied (`npx prisma db push`).
- Confirm that the admin user exists (run `npm run db:seed` if needed).
- Test sending a test invitation (Twilio sandbox or mock).
- Check the health endpoint (if implemented) at `/api/health`.
- Enable monitoring/alerts for the database and Twilio usage.
