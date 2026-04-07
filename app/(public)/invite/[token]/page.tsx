import { notFound } from "next/navigation";
import { getGuestByToken } from "@/actions/guests";
import InvitationHero from "@/components/invitation/InvitationHero";
import EventDetails from "@/components/invitation/EventDetails";
import RsvpForm, { RsvpFields } from "@/components/invitation/RsvpForm";
import ProgramSection, {
  ProgramItem,
} from "@/components/invitation/ProgramSection";
import GiftListSection from "@/components/invitation/Giftlistsection";
import type {
  GiftItem,
  GiftItemType,
} from "@/app/admin/settings/GiftListEditor";

// ─── Parsers ────────────────────────────────────────────────────────────────

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
  if (!Array.isArray(value)) return undefined;

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
      // ✅ Location fields
      locationLabel:
        typeof item.locationLabel === "string" && item.locationLabel.trim()
          ? item.locationLabel.trim()
          : undefined,
      locationUrl:
        typeof item.locationUrl === "string" && item.locationUrl.trim()
          ? item.locationUrl.trim()
          : undefined,
    }))
    .filter((item) => item.label && item.time);
}

function parseGiftList(value: unknown): GiftItem[] | undefined {
  if (!Array.isArray(value)) return undefined;

  return value
    .filter(
      (item): item is Record<string, unknown> =>
        typeof item === "object" && item !== null,
    )
    .map((item) => {
      const type: GiftItemType = item.type === "MONETARY" ? "MONETARY" : "ITEM";

      return {
        id: typeof item.id === "string" ? item.id : crypto.randomUUID(),

        // name / title fallback
        name:
          typeof item.name === "string"
            ? item.name
            : typeof item.title === "string"
              ? item.title
              : "",

        type,

        // Physical
        store: typeof item.store === "string" ? item.store : undefined,
        storeUrl: typeof item.storeUrl === "string" ? item.storeUrl : undefined,
        note: typeof item.note === "string" ? item.note : undefined,

        // Monetary
        suggestedAmount:
          typeof item.suggestedAmount === "number"
            ? item.suggestedAmount
            : undefined,
        currency: typeof item.currency === "string" ? item.currency : undefined,

        // Bank
        bankName: typeof item.bankName === "string" ? item.bankName : undefined,
        bankAccountHolder:
          typeof item.bankAccountHolder === "string"
            ? item.bankAccountHolder
            : undefined,
        bankIban: typeof item.bankIban === "string" ? item.bankIban : undefined,
        bankReference:
          typeof item.bankReference === "string"
            ? item.bankReference
            : undefined,

        // Mobile wallet
        mobileWalletProvider:
          typeof item.mobileWalletProvider === "string"
            ? item.mobileWalletProvider
            : undefined,
        mobileWalletNumber:
          typeof item.mobileWalletNumber === "string"
            ? item.mobileWalletNumber
            : undefined,
        // ✅ Added mobile wallet holder name
        mobileWalletHolderName:
          typeof item.mobileWalletHolderName === "string"
            ? item.mobileWalletHolderName
            : undefined,
      };
    })
    .filter((item) => item.name || item.suggestedAmount);
}
// ─── Page ───────────────────────────────────────────────────────────────────

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
    giftList: parseGiftList(guest.event.giftList),
  };

  return (
    <main>
      <InvitationHero event={event} guestName={guest.primaryName} />

      <EventDetails event={event} />

      <ProgramSection event={event} />

      {/* ✅ Gift List Section */}
      <GiftListSection event={event} />

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
