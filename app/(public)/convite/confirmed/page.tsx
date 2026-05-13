import InvitationHero from "@/components/invitation/InvitationHero";
import EventDetails from "@/components/invitation/EventDetails";
import ProgramSection, { ProgramItem } from "@/components/invitation/ProgramSection";
import GiftListSection from "@/components/invitation/Giftlistsection";
import type { GiftItem, GiftItemType } from "@/app/admin/settings/GiftListEditor";

/**
 * /convite/confirmed – demo page showing a confirmed RSVP state.
 * Uses the same layout as the invitation page but replaces the RSVP form with a
 * friendly confirmation message.
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

export default function ConviteConfirmedPage() {
  const event = placeholderEvent;

  return (
    <main className="flex flex-col items-center gap-8 p-6">
      <InvitationHero event={event} guestName="Thank you!" />
      <EventDetails event={event} />
      <ProgramSection event={event} />
      <GiftListSection event={event} />
      {/* Confirmation banner */}
      <section className="w-full max-w-2xl rounded-xl bg-white/90 p-6 text-center shadow-lg backdrop-blur-md">
        <h2 className="text-2xl font-semibold text-green-700">🎉 Your RSVP is CONFIRMED!</h2>
        <p className="mt-2 text-gray-600">We look forward to celebrating with you.</p>
      </section>
    </main>
  );
}
