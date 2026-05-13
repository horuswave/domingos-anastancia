# Authentication & Authorization

The project uses **NextAuth.js v5 (Auth.js)** for managing access to the administrative dashboards.

## Configuration

The main configuration is located in `auth.ts`. It uses the **Credentials Provider** for email/password authentication against the `AdminUser` table.

- **Password Hashing**: [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- **Session Strategy**: JSON Web Tokens (JWT)
- **Session Duration**: 8 Hours

## User Roles

### 1. Super Admin
- **Attribute**: `isSuperAdmin: true`
- **Access**: Can access the `/super` dashboard and all event dashboards.
- **Capabilities**: Manage all events, create other AdminUsers, and view global settings.

### 2. Event Admin
- **Attribute**: `isSuperAdmin: false`
- **Access**: Restricted to the `/admin` dashboard.
- **Scope**: Automatically scoped to their assigned `eventId`.
- **Logic**: Upon login, the first assigned event in the `EventAdmin` table is attached to the user's session.

## Session Data

The session object is extended to include:
- `id`: The user's database ID.
- `isSuperAdmin`: Boolean flag.
- `eventId`: The ID of the event the admin is currently managing (null for super admins).

## Protected Routes

Route protection is typically handled via Next.js Middleware or within specific Page components using the `auth()` function:

```typescript
import { auth } from "@/auth";

export default async function AdminPage() {
  const session = await auth();
  if (!session) {
    // Redirect or show error
  }
}
```

- **Admin Login Page**: `/admin/login`
- **Dashboard Root**: `/admin` or `/super`
