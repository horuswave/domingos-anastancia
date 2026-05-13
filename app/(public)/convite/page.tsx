import InvitationHero from "@/components/invitation/InvitationHero";
import EventDetails from "@/components/invitation/EventDetails";
import RsvpForm, { RsvpFields } from "@/components/invitation/RsvpForm";
import ProgramSection, { ProgramItem } from "@/components/invitation/ProgramSection";
import GiftListSection from "@/components/invitation/Giftlistsection";
import type { GiftItem, GiftItemType } from "@/app/admin/settings/GiftListEditor";

/**
 * /convite – demo page that showcases the full invitation layout with
 * placeholder data. It mirrors the look‑and‑feel of the confirmed /
 * declined demo pages while keeping the RSVP form active (using a static
 * token). Perfect for UI reviews, design hand‑offs, or stakeholder demos.
 */

const placeholderEvent = {
  title: "Demo Wedding",
  coupleNames: "Demo Couple",
  date: "2025-01-01",
  venue: "Demo Venue",
  address: "123 Demo St",
  primaryColor: "#c8890e",
  accentColor: "#0e0b07",
  heroImageUrl: "/placeholder-hero.jpg",
  rsvpFields: {
    companions: true,
    dietary: true,
    transport: true,
    message: true,
  } as RsvpFields,
  programItems: [
    {
      id: "ceremony",
      type: "CEREMONY",
      label: "Ceremony",
      time: "17:30",
      notes: "Starts promptly",
    },
    {
      id: "reception",
      type: "RECEPTION",
      label: "Reception",
      time: "19:00",
      notes: "Dinner & dancing",
    },
  ] as ProgramItem[],
  giftList: [
    {
      id: "gift1",
      name: "Honeymoon Fund",
      type: "MONETARY" as GiftItemType,
      suggestedAmount: 500,
      currency: "USD",
    },
    {
      id: "gift2",
      name: "Kitchen Mixer",
      type: "ITEM" as GiftItemType,
    },
  ] as GiftItem[],
};

export default function ConviteDemoPage() {
  const event = placeholderEvent;
  const guestName = "Guest";
  const maxAllowed = 2;

  return (
    <main className="flex flex-col items-center gap-8 p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <InvitationHero event={event} guestName={guestName} />
      <section className="w-full max-w-3xl rounded-xl bg-white/90 p-6 shadow-lg backdrop-blur-md">
        <EventDetails event={event} />
      </section>
      <section className="w-full max-w-3xl rounded-xl bg-white/90 p-6 shadow-lg backdrop-blur-md">
        <ProgramSection event={event} />
      </section>
      <section className="w-full max-w-3xl rounded-xl bg-white/90 p-6 shadow-lg backdrop-blur-md">
        <GiftListSection event={event} />
      </section>
      <section className="w-full max-w-3xl rounded-xl bg-white/90 p-6 shadow-lg backdrop-blur-md">
        <RsvpForm
          token="demo-token"
          maxAllowed={maxAllowed}
          event={event}
          existingRsvp={undefined}
          existingCompanions={[]}
        />
      </section>
    </main>
  );
}

import EventDetails from "@/components/invitation/EventDetails";
import ProgramSection, { ProgramItem } from "@/components/invitation/ProgramSection";
import GiftListSection from "@/components/invitation/Giftlistsection";
import type { GiftItem, GiftItemType } from "@/app/admin/settings/GiftListEditor";

/**
 * /convite – full demo page.
 * Shows all sections (hero, details, program, gift list) with placeholder data.
 * The RSVP form is replaced by a styled placeholder box to illustrate where it
 * would appear in a real implementation.
 */

const placeholderEvent = {
  title: "Demo Wedding",
  coupleNames: "Demo Couple",
  date: "2025-01-01",
  venue: "Demo Venue",
  address: "123 Demo St",
  primaryColor: "#c8890e",
  accentColor: "#0e0b07",
  heroImageUrl: "/placeholder-hero.jpg",
  rsvpFields: {
    companions: true,
    dietary: true,
    transport: true,
    message: true,
  },
  programItems: [] as ProgramItem[],
  giftList: [] as GiftItem[],
};

export default function ConviteDemoPage() {
  const event = placeholderEvent;
  const guestName = "Guest";

  return (
    <main className="flex flex-col items-center gap-12 p-6">
      {/* Hero */}
      <InvitationHero event={event} guestName={guestName} />

      {/* Event details */}
      <section className="w-full max-w-2xl rounded-xl bg-white/90 p-6 shadow-lg backdrop-blur-md">
        <EventDetails event={event} />
      </section>

      {/* Program */}
      <section className="w-full max-w-2xl rounded-xl bg-white/90 p-6 shadow-lg backdrop-blur-md">
        <ProgramSection event={event} />
      </section>

      {/* Gift list */}
      <section className="w-full max-w-2xl rounded-xl bg-white/90 p-6 shadow-lg backdrop-blur-md">
        <GiftListSection event={event} />
      </section>

      {/* RSVP placeholder */}
      <section className="w-full max-w-2xl rounded-xl bg-white/90 p-8 text-center shadow-lg backdrop-blur-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">RSVP Form (Demo)</h2>
        <p className="text-gray-600">
          This area would contain the interactive RSVP form. In this demo it is replaced with a
          placeholder.
        </p>
        <div className="mt-4 rounded border border-dashed border-gray-300 p-6"></div>
      </section>
    </main>
  );
}
