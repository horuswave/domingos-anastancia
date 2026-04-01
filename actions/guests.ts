"use server";

import { prisma } from "@/lib/prisma";
import { requireEventAccess, requireSession } from "@/lib/guards";
import { revalidatePath } from "next/cache";

export async function getGuests(overrideEventId?: string) {
  const { eventId } = await requireEventAccess(overrideEventId);
  return prisma.guest.findMany({
    where: { eventId },
    include: { rsvp: true, companions: true, table: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function getGuestByToken(token: string) {
  // Public — no auth required, token IS the credential
  return prisma.guest.findUnique({
    where: { token },
    include: { event: true, rsvp: true, companions: true },
  });
}

export async function createGuest(data: {
  primaryName: string;
  email?: string;
  phone?: string;
  preferredContact: "EMAIL" | "WHATSAPP" | "SMS" | "MANUAL";
  maxAllowed: number;
  notes?: string;
  isVip?: boolean;
  overrideEventId?: string;
}) {
  const { eventId } = await requireEventAccess(data.overrideEventId);
  const guest = await prisma.guest.create({
    data: {
      primaryName: data.primaryName,
      email: data.email,
      phone: data.phone,
      preferredContact: data.preferredContact,
      maxAllowed: data.maxAllowed,
      notes: data.notes,
      isVip: data.isVip ?? false,
      eventId,
    },
  });
  revalidatePath("/admin/guests");
  return guest;
}

export async function updateGuest(
  id: string,
  data: Partial<{
    primaryName: string;
    email: string;
    phone: string;
    preferredContact: "EMAIL" | "WHATSAPP" | "SMS" | "MANUAL";
    maxAllowed: number;
    notes: string;
    isVip: boolean;
    tableId: string;
  }>,
) {
  const { eventId } = await requireEventAccess();

  // Ensure guest belongs to this event before updating
  const guest = await prisma.guest.findFirst({ where: { id, eventId } });
  if (!guest) throw new Error("Guest not found or access denied");

  const updated = await prisma.guest.update({ where: { id }, data });
  revalidatePath("/admin/guests");
  return updated;
}

export async function deleteGuest(id: string) {
  const { eventId } = await requireEventAccess();
  const guest = await prisma.guest.findFirst({ where: { id, eventId } });
  if (!guest) throw new Error("Guest not found or access denied");
  await prisma.guest.delete({ where: { id } });
  revalidatePath("/admin/guests");
}

export async function getDashboardStats(overrideEventId?: string) {
  const { eventId } = await requireEventAccess(overrideEventId);

  const [total, attending, declined, pending] = await Promise.all([
    prisma.guest.count({ where: { eventId } }),
    prisma.guest.count({ where: { eventId, rsvpStatus: "ATTENDING" } }),
    prisma.guest.count({ where: { eventId, rsvpStatus: "DECLINED" } }),
    prisma.guest.count({ where: { eventId, rsvpStatus: "PENDING" } }),
  ]);

  const agg = await prisma.rsvp.aggregate({
    where: { guest: { eventId }, attending: true },
    _sum: { totalAttending: true },
  });

  return {
    total,
    attending,
    declined,
    pending,
    totalHeadcount: agg._sum.totalAttending ?? 0,
  };
}

export async function getGuestById(id: string) {
  const { eventId } = await requireEventAccess();
  return prisma.guest.findFirst({
    where: { id, eventId },
    include: { rsvp: true, companions: true, table: true },
  });
}

export async function assignTable(guestId: string, tableId: string | null) {
  const { eventId } = await requireEventAccess();
  const guest = await prisma.guest.findFirst({
    where: { id: guestId, eventId },
  });
  if (!guest) throw new Error("Guest not found");

  await prisma.guest.update({
    where: { id: guestId },
    data: { tableId },
  });

  revalidatePath("/admin/tables");
  revalidatePath("/admin/guests");
}