import { notFound } from "next/navigation";
import { getGuestByToken } from "@/actions/guests";
import InvitationHero from "@/components/invitation/InvitationHero";
import EventDetails from "@/components/invitation/EventDetails";
import RsvpForm, { RsvpFields } from "@/components/invitation/RsvpForm";
import ProgramSection, {
  ProgramItem,
} from "@/components/invitation/ProgramSection";

function parseRsvpFields(value: unknown): RsvpFields | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }

  const obj = value as Record<string, unknown>;

  return {
    companions: typeof obj.companions === "boolean" ? obj.companions : true,
    dietary: typeof obj.dietary === "boolean" ? obj.dietary : true,
    transport: typeof obj.transport === "boolean" ? obj.transport : true,
    message: typeof obj.message === "boolean" ? obj.message : true,
  };
}

function parseProgramItems(value: unknown): ProgramItem[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  return value
    .filter(
      (item): item is Record<string, unknown> =>
        typeof item === "object" && item !== null,
    )
    .map((item) => ({
      id: typeof item.id === "string" ? item.id : crypto.randomUUID(),
      type:
        typeof item.type === "string"
          ? (item.type as ProgramItem["type"])
          : "CUSTOM",
      label: typeof item.label === "string" ? item.label : "",
      time: typeof item.time === "string" ? item.time : "",
      notes: typeof item.notes === "string" ? item.notes : undefined,
    }))
    .filter((item) => item.label && item.time);
}

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const guest = await getGuestByToken(token);

  if (!guest || !guest.event) notFound();

  const event = {
    ...guest.event,
    rsvpFields: parseRsvpFields(guest.event.rsvpFields),
    programItems: parseProgramItems(guest.event.programItems),
  };

  return (
    <main>
      <InvitationHero event={event} guestName={guest.primaryName} />
      <EventDetails event={event} />
      <ProgramSection event={event} />
      <RsvpForm
        token={token}
        maxAllowed={guest.maxAllowed}
        event={event}
        existingRsvp={guest.rsvp}
        existingCompanions={guest.companions}
      />
    </main>
  );
}
