"use server";

import { prisma } from "@/lib/prisma";
import { requireSuperAdmin, requireEventAccess } from "@/lib/guards";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import type { RsvpFields } from "@/components/invitation/RsvpForm";
import type { ProgramItem } from "@/components/invitation/ProgramSection";
import type { GiftItem } from "@/app/admin/settings/GiftListEditor"; // adjust path to match your project

export async function getAllEvents() {
  await requireSuperAdmin();
  return prisma.event.findMany({
    include: {
      _count: { select: { guests: true, tables: true } },
      eventAdmins: { include: { adminUser: true } },
      guests: {
        select: {
          rsvpStatus: true,
          rsvp: { select: { totalAttending: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getEventById(id: string) {
  await requireSuperAdmin();
  return prisma.event.findUnique({
    where: { id },
    include: {
      eventAdmins: { include: { adminUser: true } },
      _count: {
        select: {
          guests: true,
          tables: true,
        },
      },
      guests: {
        include: { rsvp: true },
        orderBy: { createdAt: "asc" },
      },
      tables: {
        include: {
          guests: { include: { rsvp: true } },
        },
      },
    },
  });
}

export async function createEvent(data: {
  title: string;
  coupleNames: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  mapUrl?: string;
  dressCode?: string;
  message?: string;
  rules?: string;
  supportEmail?: string;
  supportPhone?: string;
  primaryColor?: string;
  accentColor?: string;
  backgroundStyle?: "DARK" | "LIGHT" | "IMAGE";
  fontDisplay?: string;
  fontBody?: string;
}) {
  await requireSuperAdmin();
  const event = await prisma.event.create({
    data: {
      ...data,
      date: new Date(data.date),
      primaryColor: data.primaryColor ?? "#c8890e",
      accentColor: data.accentColor ?? "#0e0b07",
      backgroundStyle: data.backgroundStyle ?? "DARK",
      fontDisplay: data.fontDisplay ?? "Cormorant Garamond",
      fontBody: data.fontBody ?? "Jost",
    },
  });
  revalidatePath("/super/dashboard");
  return event;
}

export async function updateEvent(
  id: string,
  data: Partial<{
    title: string;
    coupleNames: string;
    date: string;
    time: string;
    venue: string;
    address: string;
    mapUrl: string;
    dressCode: string;
    message: string;
    rules: string;
    supportEmail: string;
    supportPhone: string;
    primaryColor: string;
    accentColor: string;
    backgroundStyle: "DARK" | "LIGHT" | "IMAGE";
    fontDisplay: string;
    fontBody: string;
    heroImageUrl: string;
    logoUrl: string;
  }>,
) {
  await requireSuperAdmin();
  const event = await prisma.event.update({
    where: { id },
    data: { ...data, ...(data.date ? { date: new Date(data.date) } : {}) },
  });
  revalidatePath("/super/dashboard");
  revalidatePath(`/super/events/${id}`);
  return event;
}

export async function deleteEvent(id: string) {
  await requireSuperAdmin();
  await prisma.event.delete({ where: { id } });
  revalidatePath("/super/dashboard");
}

/** Create a new event-admin user and assign them to an event. */
export async function createEventAdmin(data: {
  eventId: string;
  name: string;
  email: string;
  password: string;
}) {
  await requireSuperAdmin();

  const passwordHash = await bcrypt.hash(data.password, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email: data.email },
    update: { name: data.name, passwordHash },
    create: {
      email: data.email,
      name: data.name,
      passwordHash,
      isSuperAdmin: false,
    },
  });

  await prisma.eventAdmin.upsert({
    where: {
      adminUserId_eventId: { adminUserId: admin.id, eventId: data.eventId },
    },
    update: {},
    create: { adminUserId: admin.id, eventId: data.eventId },
  });

  revalidatePath(`/super/events/${data.eventId}`);
  return admin;
}

export async function removeEventAdmin(adminUserId: string, eventId: string) {
  await requireSuperAdmin();
  await prisma.eventAdmin.delete({
    where: { adminUserId_eventId: { adminUserId, eventId } },
  });
  revalidatePath(`/super/events/${eventId}`);
}

/** Get the event for the currently logged-in event admin. */
export async function getMyEvent() {
  const { eventId } = await requireEventAccess();
  return prisma.event.findUnique({ where: { id: eventId } });
}

/** Update branding for the event the current admin manages. */
export async function updateMyEventBranding(
  data: Partial<{
    primaryColor: string;
    accentColor: string;
    backgroundStyle: "DARK" | "LIGHT" | "IMAGE";
    fontDisplay: string;
    fontBody: string;
    heroImageUrl: string;
    logoUrl: string;
  }>,
) {
  const { eventId } = await requireEventAccess();
  const event = await prisma.event.update({ where: { id: eventId }, data });
  revalidatePath("/admin/dashboard");
  return event;
}

/** Update full event details for the event the current admin manages. */
export async function updateMyEvent(
  data: Partial<{
    title: string;
    coupleNames: string;
    date: string;
    time: string;
    venue: string;
    address: string;
    mapUrl: string;
    dressCode: string;
    message: string;
    rules: string;
    supportEmail: string;
    supportPhone: string;
    primaryColor: string;
    accentColor: string;
    backgroundStyle: "DARK" | "LIGHT" | "IMAGE";
    fontDisplay: string;
    fontBody: string;
    programItems: ProgramItem[];
    rsvpFields: RsvpFields;
    giftList: GiftItem[]; // ← NEW
  }>,
) {
  const { eventId } = await requireEventAccess();

  // Extract and serialize Json fields separately to avoid Prisma's conflicting
  // generated types between node_modules/.prisma and generated/prisma paths.
  const { programItems, rsvpFields, giftList, date, ...rest } = data;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const event = await (prisma.event.update as any)({
    where: { id: eventId },
    data: {
      ...rest,
      ...(date ? { date: new Date(date) } : {}),
      ...(programItems !== undefined
        ? { programItems: JSON.parse(JSON.stringify(programItems)) }
        : {}),
      ...(rsvpFields !== undefined
        ? { rsvpFields: JSON.parse(JSON.stringify(rsvpFields)) }
        : {}),
      ...(giftList !== undefined
        ? { giftList: JSON.parse(JSON.stringify(giftList)) }
        : {}),
    },
  });

  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/settings");
  return event;
}

export async function superUpdateEvent(
  id: string,
  data: Partial<{
    title: string;
    coupleNames: string;
    date: string;
    time: string;
    venue: string;
    address: string;
    mapUrl: string;
    dressCode: string;
    message: string;
    rules: string;
    supportEmail: string;
    supportPhone: string;
    primaryColor: string;
    accentColor: string;
    backgroundStyle: "DARK" | "LIGHT" | "IMAGE";
    fontDisplay: string;
    fontBody: string;
  }>,
) {
  await requireSuperAdmin();
  const event = await prisma.event.update({
    where: { id },
    data: { ...data, ...(data.date ? { date: new Date(data.date) } : {}) },
  });
  revalidatePath("/super/dashboard");
  revalidatePath(`/super/events/${id}`);
  return event;
}
