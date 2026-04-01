import { notFound } from "next/navigation";
import { getGuestByToken } from "@/actions/guests";
import InvitationHero from "@/components/invitation/InvitationHero";
import EventDetails from "@/components/invitation/EventDetails";
import RsvpForm from "@/components/invitation/RsvpForm";
import ProgramSection from "@/components/invitation/ProgramSection";
export default async function InvitationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const guest = await getGuestByToken(token);
  if (!guest) notFound();

  return (
    <main>
      <InvitationHero event={guest.event} guestName={guest.primaryName} />
      <EventDetails event={guest.event} />
      <ProgramSection event={event} />
      <RsvpForm
        token={token}
        maxAllowed={guest.maxAllowed}
        event={guest.event}
        existingRsvp={guest.rsvp}
        existingCompanions={guest.companions}
      />
    </main>
  );
}
