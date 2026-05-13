import InvitationHero from "@/components/invitation/InvitationHero";
import EventDetails from "@/components/invitation/EventDetails";
import ProgramSection, { ProgramItem } from "@/components/invitation/ProgramSection";
import GiftListSection from "@/components/invitation/Giftlistsection";
import type { GiftItem, GiftItemType } from "@/app/admin/settings/GiftListEditor";

/**
 * /convite/declined – demo page showing a declined RSVP state.
 * Uses the same layout as the invitation page but replaces the RSVP form with a
 * friendly regret message.
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

export default function DeclinedDemoPage() {
  const event = placeholderEvent;

  return (
    <main className="flex flex-col items-center gap-8 p-6">
      <InvitationHero event={event} guestName="Sorry you can’t attend 😢" />
      {/* Regret banner */}
      <section className="w-full max-w-2xl rounded-xl bg-white/90 p-6 text-center shadow-lg backdrop-blur-md">
        <h2 className="text-2xl font-semibold text-red-600">Your RSVP was declined</h2>
        <p className="mt-2 text-gray-600">We understand and hope to see you at another occasion.</p>
      </section>
      <EventDetails event={event} />
      <ProgramSection event={event} />
      <GiftListSection event={event} />
    </main>
  );
}
