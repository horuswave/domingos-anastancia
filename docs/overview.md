# Project Overview: Invitation App

The Invitation App is a comprehensive event management platform designed specifically for weddings and large gatherings. It allows event organizers to manage guest lists, send digital invitations via Email/WhatsApp/SMS, track RSVPs in real-time, and organize table seating.

## Tech Stack

- **Framework**: [Next.js 16.2.0](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database ORM**: [Prisma](https://www.prisma.io/) (Postgres Provider)
- **Authentication**: [NextAuth.js v5 (Beta)](https://authjs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Messaging**: [Twilio](https://www.twilio.com/) (WhatsApp/SMS)
- **Document Generation**: [docx](https://docx.js.org/) (for guest lists/exporting)
- **Icons**: [Lucide React](https://lucide.dev/)

## Core Features

1.  **Multi-Event Support**: Super Admins can create and manage multiple events.
2.  **Granular Permissions**: 
    - **Super Admin**: Can manage all events and administrative users.
    - **Event Admin**: Can manage specific assigned events.
3.  **Guest Management**:
    - Import/Export guest lists.
    - Assign maximum companion counts.
    - VIP status tracking.
4.  **Digital Invitations**:
    - Generate unique access tokens for each guest.
    - Send invitations via Email, WhatsApp, or SMS.
    - Track delivery status.
5.  **RSVP System**:
    - Custom RSVP forms per event.
    - Companion details and dietary restrictions tracking.
    - Personal messages to the couple.
6.  **Seating Chart**:
    - Manage tables and assign guests to specific tables.
7.  **Dynamic Branding**:
    - Customize event colors, fonts, and imagery.
