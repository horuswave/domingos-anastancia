# Getting Started

Follow these steps to set up the Invitation App for local development or production deployment.

## Prerequisites

- **Node.js**: v20 or higher (v22 recommended)
- **Database**: PostgreSQL (Local or hosted like Supabase)
- **Package Manager**: npm (or yarn/pnpm)

## Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd invitation-app
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env` file in the root directory and configure the following:

    ```env
    # Database (Postgres)
    DATABASE_URL="your-postgresql-url"
    DIRECT_URL="your-direct-postgresql-url" # Required for migrations

    # NextAuth (Auth.js)
    # Generate a secret: openssl rand -base64 32
    AUTH_SECRET="your-auth-secret"
    NEXTAUTH_URL="http://localhost:3000"

    # Twilio (For WhatsApp/SMS)
    TWILIO_ACCOUNT_SID="your-sid"
    TWILIO_AUTH_TOKEN="your-token"
    TWILIO_PHONE_NUMBER="your-phone"
    TWILIO_WHATSAPP_NUMBER="your-whatsapp-phone"

    # Public URLs
    NEXT_PUBLIC_BASE_URL="http://localhost:3000"
    ```

## Database Setup

This project uses **Prisma**. Run the following commands to initialize your database:

1.  **Generate Prisma Client**:
    ```bash
    npx prisma generate
    ```

2.  **Push Schema to Database**:
    ```bash
    npx prisma db push
    ```

3.  **(Optional) Seed the Database**:
    Create an initial super admin or sample data.
    ```bash
    npm run db:seed
    ```

## Running the App

### Development Mode
```bash
npm run dev
```
The app will be available at [http://localhost:3000](http://localhost:3000).

### Production Build
```bash
npm run build
npm run start
```

## Initial Login

Access the admin dashboard at `/admin`.
Access the super admin dashboard at `/super`.
*(Note: Ensure you have created a user in the `AdminUser` table via seed or manual insertion to login).*
