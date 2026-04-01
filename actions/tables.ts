"use server";

import { prisma } from "@/lib/prisma";
import { requireEventAccess } from "@/lib/guards";
import { revalidatePath } from "next/cache";

export async function getTables() {
  const { eventId } = await requireEventAccess();
  return prisma.table.findMany({
    where: { eventId },
    include: {
      guests: {
        include: { rsvp: true },
        orderBy: { primaryName: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function createTable(data: {
  name: string;
  capacity: number;
  notes?: string;
}) {
  const { eventId } = await requireEventAccess();
  const table = await prisma.table.create({
    data: { ...data, eventId },
  });
  revalidatePath("/admin/tables");
  return table;
}

export async function updateTable(
  id: string,
  data: Partial<{ name: string; capacity: number; notes: string }>,
) {
  const { eventId } = await requireEventAccess();
  const table = await prisma.table.findFirst({ where: { id, eventId } });
  if (!table) throw new Error("Table not found");

  const updated = await prisma.table.update({ where: { id }, data });
  revalidatePath("/admin/tables");
  return updated;
}

export async function deleteTable(id: string) {
  const { eventId } = await requireEventAccess();
  const table = await prisma.table.findFirst({ where: { id, eventId } });
  if (!table) throw new Error("Table not found");

  // Unassign all guests first
  await prisma.guest.updateMany({
    where: { tableId: id },
    data: { tableId: null },
  });

  await prisma.table.delete({ where: { id } });
  revalidatePath("/admin/tables");
}

export async function getUnassignedAttendingGuests() {
  const { eventId } = await requireEventAccess();
  return prisma.guest.findMany({
    where: {
      eventId,
      rsvpStatus: "ATTENDING",
      tableId: null,
    },
    include: { rsvp: true },
    orderBy: { primaryName: "asc" },
  });
}
