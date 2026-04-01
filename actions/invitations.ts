"use server";

import { prisma } from "@/lib/prisma";
import { twilioClient } from "@/lib/twilio";
import { requireEventAccess } from "@/lib/guards";
import { revalidatePath } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

type MessageType = "INVITATION" | "REMINDER";

async function sendToGuest(
  guestId: string,
  eventId: string,
  messageType: MessageType,
): Promise<{ success: boolean; error?: string }> {
  const guest = await prisma.guest.findFirst({
    where: { id: guestId, eventId },
    include: { event: true },
  });
  if (!guest) return { success: false, error: "Guest not found" };

  const inviteUrl = `${BASE_URL}/invite/${guest.token}`;
  const eventDate = new Date(guest.event.date).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const body = `Hi ${guest.primaryName}! You're invited to celebrate ${guest.event.coupleNames}'s anniversary on ${eventDate}. RSVP here: ${inviteUrl}`;

  let externalId: string | undefined;
  let status: "SENT" | "FAILED" = "SENT";
  let errorDetail: string | undefined;

  try {
    if (guest.preferredContact === "SMS" && guest.phone) {
      const msg = await twilioClient.messages.create({
        body,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: guest.phone,
      });
      externalId = msg.sid;
    } else if (guest.preferredContact === "WHATSAPP" && guest.phone) {
      const eventDate = new Date(guest.event.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const msg = await twilioClient.messages.create({
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER!}`,
        to: `whatsapp:${guest.phone}`,
        contentSid: process.env.TWILIO_WHATSAPP_TEMPLATE_SID!,
        contentVariables: JSON.stringify({
          "1": guest.primaryName, // e.g. "António & Sofia"
          "2": guest.event.coupleNames, // e.g. "João & Maria"
          "3": eventDate, // e.g. "20 September 2025"
          "4": `${BASE_URL}/invite/${guest.token}`, // the invite link
        }),
      });
      externalId = msg.sid;
    } else {
      // MANUAL — just log, no API call
      externalId = undefined;
    }
  } catch (err: any) {
    status = "FAILED";
    errorDetail = err?.message ?? "Unknown error";
  }

  await prisma.messageLog.create({
    data: {
      guestId,
      channel: guest.preferredContact,
      messageType,
      status,
      externalId,
      errorDetail,
    },
  });

  revalidatePath("/admin/guests");
  revalidatePath(`/admin/guests/${guestId}`);
  revalidatePath("/admin/communications");

  return { success: status === "SENT", error: errorDetail };
}

/** Send to a single guest. */
export async function sendInvitation(
  guestId: string,
  messageType: MessageType = "INVITATION",
) {
  const { eventId } = await requireEventAccess();
  return sendToGuest(guestId, eventId, messageType);
}

/** Bulk send to all PENDING guests in this event. */
export async function bulkSendInvitations(
  messageType: MessageType = "INVITATION",
) {
  const { eventId } = await requireEventAccess();

  const guests = await prisma.guest.findMany({
    where: { eventId, rsvpStatus: "PENDING" },
  });

  const results = { sent: 0, failed: 0, total: guests.length };

  for (const guest of guests) {
    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 150));
    const result = await sendToGuest(guest.id, eventId, messageType);
    if (result.success) results.sent++;
    else results.failed++;
  }

  revalidatePath("/admin/guests");
  revalidatePath("/admin/communications");
  return results;
}

/** Get message logs for a guest. */
export async function getGuestMessageLogs(guestId: string) {
  const { eventId } = await requireEventAccess();
  const guest = await prisma.guest.findFirst({
    where: { id: guestId, eventId },
  });
  if (!guest) throw new Error("Guest not found");

  return prisma.messageLog.findMany({
    where: { guestId },
    orderBy: { sentAt: "desc" },
  });
}

/** Get all message logs for this event. */
export async function getAllMessageLogs() {
  const { eventId } = await requireEventAccess();
  return prisma.messageLog.findMany({
    where: { guest: { eventId } },
    include: { guest: { select: { primaryName: true } } },
    orderBy: { sentAt: "desc" },
    take: 200,
  });
}
