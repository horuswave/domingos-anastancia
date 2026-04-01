import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

async function main() {
  console.log("🌱 Seeding...");

  // Super-admin
  const superHash = await bcrypt.hash("super123!", 12);
  const superAdmin = await prisma.adminUser.upsert({
    where: { email: "super@rsvp.app" },
    update: {},
    create: {
      email: "super@rsvp.app",
      passwordHash: superHash,
      name: "Super Admin",
      isSuperAdmin: true,
    },
  });
  console.log(`✅ Super-admin: ${superAdmin.email}  password: super123!`);

  // Event 1 — dark gold theme
  const event1 = await prisma.event.upsert({
    where: { id: "event-joao-maria" },
    update: {},
    create: {
      id: "event-joao-maria",
      title: "Golden Anniversary Celebration",
      coupleNames: "João & Maria",
      date: new Date("2025-09-20T18:00:00"),
      time: "6:00 PM",
      venue: "Quinta das Flores",
      address: "Rua das Rosas 123, 1000-001 Lisboa, Portugal",
      mapUrl: "https://maps.google.com/?q=Quinta+das+Flores+Lisboa",
      dressCode: "Black tie optional — elegant formal attire",
      message:
        "Fifty years of love, laughter, and a life beautifully built together. We would be honoured to have you join us.",
      rules:
        "• RSVP by 1st September 2025\n• Dietary requirements welcome\n• Children warmly welcome\n• Parking on-site\n• Ceremony begins promptly at 6:00 PM",
      supportEmail: "anniversary@family.com",
      supportPhone: "+351 912 345 678",
      primaryColor: "#c8890e",
      accentColor: "#0e0b07",
      backgroundStyle: "DARK",
      fontDisplay: "Cormorant Garamond",
      fontBody: "Jost",
    },
  });

  // Event 1 admin
  const e1AdminHash = await bcrypt.hash("joao123!", 12);
  const e1Admin = await prisma.adminUser.upsert({
    where: { email: "organizer@joaomaria.com" },
    update: {},
    create: {
      email: "organizer@joaomaria.com",
      passwordHash: e1AdminHash,
      name: "Filipa Santos",
      isSuperAdmin: false,
    },
  });
  await prisma.eventAdmin.upsert({
    where: {
      adminUserId_eventId: { adminUserId: e1Admin.id, eventId: event1.id },
    },
    update: {},
    create: { adminUserId: e1Admin.id, eventId: event1.id },
  });
  console.log(
    `✅ Event 1: ${event1.title}  admin: ${e1Admin.email}  password: joao123!`,
  );

  // Event 2 — light rose theme
  const event2 = await prisma.event.upsert({
    where: { id: "event-peter-anne" },
    update: {},
    create: {
      id: "event-peter-anne",
      title: "Silver Anniversary Dinner",
      coupleNames: "Peter & Anne",
      date: new Date("2025-11-08T19:30:00"),
      time: "7:30 PM",
      venue: "The Grand Manor",
      address: "12 Oak Lane, Edinburgh, EH1 2AB",
      mapUrl: "https://maps.google.com/?q=The+Grand+Manor+Edinburgh",
      dressCode: "Smart casual",
      message:
        "Twenty-five wonderful years. Please join us for an intimate dinner celebration with our closest family and friends.",
      rules:
        "• RSVP by 20th October 2025\n• Adults only evening\n• Complimentary valet parking",
      supportEmail: "hello@peterandanne.co.uk",
      supportPhone: "+44 7700 900123",
      primaryColor: "#b76e79",
      accentColor: "#1a0a0e",
      backgroundStyle: "LIGHT",
      fontDisplay: "Playfair Display",
      fontBody: "Lato",
    },
  });

  // Event 2 admin
  const e2AdminHash = await bcrypt.hash("peter123!", 12);
  const e2Admin = await prisma.adminUser.upsert({
    where: { email: "organizer@peterandanne.co.uk" },
    update: {},
    create: {
      email: "organizer@peterandanne.co.uk",
      passwordHash: e2AdminHash,
      name: "James Clarke",
      isSuperAdmin: false,
    },
  });
  await prisma.eventAdmin.upsert({
    where: {
      adminUserId_eventId: { adminUserId: e2Admin.id, eventId: event2.id },
    },
    update: {},
    create: { adminUserId: e2Admin.id, eventId: event2.id },
  });
  console.log(
    `✅ Event 2: ${event2.title}  admin: ${e2Admin.email}  password: peter123!`,
  );

  // Sample tables for event 1
  for (const t of [
    { id: "t1-1", name: "Table 1 — Family", capacity: 8 },
    { id: "t1-2", name: "Table 2 — Close Friends", capacity: 8 },
    { id: "t1-3", name: "Table 3 — Colleagues", capacity: 10 },
  ]) {
    await prisma.table.upsert({
      where: { id: t.id },
      update: {},
      create: { ...t, eventId: event1.id },
    });
  }

  // Sample guests for event 1
  for (const g of [
    {
      primaryName: "António & Sofia Silva",
      email: "antonio@email.com",
      phone: "+351911111111",
      preferredContact: "EMAIL" as const,
      maxAllowed: 4,
    },
    {
      primaryName: "Carlos Ferreira",
      email: "carlos@email.com",
      phone: "+351922222222",
      preferredContact: "SMS" as const,
      maxAllowed: 2,
    },
    {
      primaryName: "Isabel & Ricardo Costa",
      email: "isabel@email.com",
      phone: "+351933333333",
      preferredContact: "WHATSAPP" as const,
      maxAllowed: 3,
    },
  ]) {
    const exists = await prisma.guest.findFirst({
      where: { primaryName: g.primaryName, eventId: event1.id },
    });
    if (!exists)
      await prisma.guest.create({ data: { ...g, eventId: event1.id } });
  }

  console.log("\n🎉 Seed complete!\n");
  console.log("Super-admin →  http://localhost:3000/super/dashboard");
  console.log("  email:    super@rsvp.app");
  console.log("  password: super123!\n");
  console.log("Event admin 1 →  http://localhost:3000/admin/login");
  console.log("  email:    organizer@joaomaria.com");
  console.log("  password: joao123!\n");
  console.log("Event admin 2 →  http://localhost:3000/admin/login");
  console.log("  email:    organizer@peterandanne.co.uk");
  console.log("  password: peter123!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
