# Core Logic & Application Flow

This document explains how the critical features of the Invitation App work internally.

## 1. The Invitation Lifecycle

The system is designed to move a guest from "Added" to "Attending/Declined".

1.  **Creation**: A guest is added to the system (manually or via import) with a `maxAllowed` count and a `preferredContact` method.
2.  **Token Generation**: Every guest has a unique `token` (UUID) which serves as their identifier for the public RSVP site.
3.  **Sending**:
    - **SMS/WhatsApp**: Uses **Twilio**. The system generates a personalized message with a link like `${BASE_URL}/invite/${token}`.
    - **Manual**: For physical cards or word-of-mouth. The admin can copy the guest's unique link.
4.  **Logging**: Every attempt to send a message is recorded in the `MessageLog` table with its status (`SENT`, `FAILED`).

## 2. RSVP Submission Flow

When a guest visits their unique link:

1.  **Authentication**: The app looks up the guest by the `token` in the URL. No login is required for guests.
2.  **Dynamic Form**: The form displays fields based on the `Event` configuration (e.g., if `dietary` is enabled in the event settings).
3.  **Validation**: The system checks that the `totalAttending` does not exceed the guest's `maxAllowed` limit.
4.  **Data Processing**:
    - The `Rsvp` record is created or updated (`upsert`).
    - `GuestCompanion` records are refreshed (deleted and re-created) based on the input.
    - The `Guest` status is updated to `ATTENDING` or `DECLINED`.
5.  **Cache Invalidation**: `revalidatePath` is called to ensure the admin dashboards show the new data immediately.

## 3. Communication Logic (Twilio)

The logic for sending messages is centralized in `actions/invitations.ts`.

- **WhatsApp**: Uses Twilio Content API templates. Variables are injected as a JSON object matching the template's placeholder indices (`1`, `2`, `3`, etc.).
- **SMS**: Uses the standard Twilio SMS API with a dynamically generated string.
- **Bulk Sending**: Processes guests sequentially with a small delay (`150ms`) to avoid hitting Twilio rate limits or triggering spam filters.

## 4. Table Management

- **Event-Specific**: Tables belong to a single event.
- **Assignment**: Guests are assigned to a `Table` via a simple `tableId` foreign key on the `Guest` model.
- **Seating Statistics**: The dashboard calculates capacity vs. actual assigned guests to help organizers balance the room.

## 5. Security Model

- **Admin Access**: Protected by NextAuth. `requireEventAccess` (in `lib/guards.ts`) ensures that an admin can only modify guests or tables belonging to their assigned event.
- **Public RSVP**: Accessible only via the unique 36-character token. While technically public, the tokens are unguessable.
