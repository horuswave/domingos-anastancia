"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface RsvpInput {
  token: string;
  attending: boolean;
  totalAttending: number;
  companions: { name: string; dietaryRestrictions?: string }[];
  dietaryRestrictions?: string;
  transportNotes?: string;
  coupleMessage?: string;
  ipAddress?: string;
}

export async function submitRsvp(input: RsvpInput) {
  const guest = await prisma.guest.findUnique({
    where: { token: input.token },
  });
  if (!guest) return { error: "Invalid invitation link." };

  if (input.attending && input.totalAttending > guest.maxAllowed) {
    return {
      error: `Maximum ${guest.maxAllowed} guests allowed for this invitation.`,
    };
  }

  await prisma.rsvp.upsert({
    where: { guestId: guest.id },
    create: {
      guestId: guest.id,
      attending: input.attending,
      totalAttending: input.attending ? input.totalAttending : 0,
      dietaryRestrictions: input.dietaryRestrictions,
      transportNotes: input.transportNotes,
      coupleMessage: input.coupleMessage,
      ipAddress: input.ipAddress,
    },
    update: {
      attending: input.attending,
      totalAttending: input.attending ? input.totalAttending : 0,
      dietaryRestrictions: input.dietaryRestrictions,
      transportNotes: input.transportNotes,
      coupleMessage: input.coupleMessage,
      updatedAt: new Date(),
    },
  });

  // Remove old companions
  await prisma.guestCompanion.deleteMany({ where: { guestId: guest.id } });

  if (input.attending && input.totalAttending > 1) {
    const needed = input.totalAttending - 1;
    const provided = input.companions ?? [];

    const companionsToCreate = [];

    for (let i = 0; i < needed; i++) {
      const companion = provided[i];
      let companionName: string;

      if (companion && companion.name && companion.name.trim() !== "") {
        // Use provided name if available
        companionName = companion.name;
      } else {
        // No name given – use the main guest's name
        companionName = guest.primaryName;
      }

      companionsToCreate.push({
        guestId: guest.id,
        name: companionName,
        dietaryRestrictions: companion?.dietaryRestrictions ?? null,
      });
    }

    await prisma.guestCompanion.createMany({
      data: companionsToCreate,
    });
  }

  await prisma.guest.update({
    where: { id: guest.id },
    data: {
      rsvpStatus: input.attending ? "ATTENDING" : "DECLINED",
      rsvpSubmittedAt: new Date(),
    },
  });

  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/guests");
  return { success: true };
}
