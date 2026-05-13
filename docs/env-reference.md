# Environment Variables Reference

This file enumerates every variable used by the Invitation App, their purpose, example values, and which environment they are required in.

| Variable | Description | Example | Required in |
|----------|-------------|---------|--------------|
| `DATABASE_URL` | PostgreSQL connection string (used by Prisma). | `postgresql://user:password@localhost:5432/wedding?schema=public` | All |
| `DIRECT_URL` | Direct DB connection for migrations (bypasses connection pooling). | `postgresql://user:password@localhost:5432/wedding` | All (for migrations) |
| `AUTH_SECRET` | 32‑byte base64 secret for signing NextAuth JWTs. Generate with `openssl rand -base64 32`. | `4d603ca4926147a8ab712cf224dc7389a13183dc6fd3199a68725aff6b4d6178` | All |
| `NEXTAUTH_URL` | Base URL of the deployed app (used by NextAuth callbacks). | `https://my-wedding.com` | Production |
| `NEXT_PUBLIC_BASE_URL` | Public facing base URL – used in email/WhatsApp links. | `https://my-wedding.com` | Production |
| `TWILIO_ACCOUNT_SID` | Twilio account identifier. | `ACxxxxxxxxxxxxxxxxxxxxxx` | Production |
| `TWILIO_AUTH_TOKEN` | Twilio auth token. | `your_auth_token` | Production |
| `TWILIO_PHONE_NUMBER` | Phone number used for SMS. | `+14155551234` | Production |
| `TWILIO_WHATSAPP_NUMBER` | WhatsApp-enabled number. | `+14155551234` | Production |
| `TWILIO_WHATSAPP_TEMPLATE_SID` | Twilio template SID for WhatsApp messages. | `HX20cd293051e80d649b82d3abc81fa22b` | Production |
| `RESEND_API_KEY` | API key for Resend email service (optional, if you use email). | `re_XXXXXXXXXXXXXXXX` | Optional |
| `PORT` | Port the app listens on (defaults to `3000`). | `3000` | Optional |

**Never commit `.env`** to source control. Add `.env.example` with placeholder values (already present) and copy it to `.env` before running the app.
