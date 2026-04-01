import { auth } from "../auth";

/** Returns the session or throws. */
export async function requireSession() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthenticated");
  return session;
}

/** Super-admin only. */
export async function requireSuperAdmin() {
  const session = await requireSession();
  if (!session.user.isSuperAdmin) throw new Error("Forbidden");
  return session;
}

/**
 * Event admin guard.
 * Returns the eventId from the session — or, for super-admins,
 * accepts an explicit eventId override so they can act on any event.
 */
export async function requireEventAccess(overrideEventId?: string) {
  const session = await requireSession();

  if (session.user.isSuperAdmin) {
    const eventId = overrideEventId ?? session.user.eventId;
    if (!eventId) throw new Error("No eventId provided for super-admin action");
    return { session, eventId };
  }

  if (!session.user.eventId) throw new Error("No event assigned to this user");
  return { session, eventId: session.user.eventId };
}
