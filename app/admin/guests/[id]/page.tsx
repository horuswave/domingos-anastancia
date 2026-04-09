import { getGuestById } from "@/actions/guests";
import { getMyEvent } from "@/actions/events";
import { notFound } from "next/navigation";
import GuestForm from "../GuestForm";
import Link from "next/link";
import SendInviteButton from "@/components/admin/SendInviteButton";
import { getGuestMessageLogs } from "@/actions/invitations";

export default async function EditGuestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
const [guest, event, logs] = await Promise.all([
  getGuestById(id),
  getMyEvent(),
  getGuestMessageLogs(id).catch(() => []),
]);
  if (!guest) notFound();

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 px-8 py-5">
        <Link
          href="/admin/guests"
          className="text-xs text-stone-400 hover:text-stone-600 mb-1 block"
        >
          ← Guest List
        </Link>
        <h1
          className="text-2xl text-stone-800"
          style={{
            fontFamily: event?.fontDisplay ?? "Georgia",
            fontWeight: 400,
          }}
        >
          {guest.primaryName}
        </h1>
        {guest.rsvpSubmittedAt && (
          <p className="text-xs text-stone-400 mt-0.5">
            RSVP received{" "}
            {new Date(guest.rsvpSubmittedAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}
      </header>
      <div className="flex gap-3 mb-6">
        <SendInviteButton
          guestName={guest.primaryName}
          guestPhone={guest.phone ?? ""}
          messageType="INVITATION"
          primaryColor={event?.primaryColor}
          fontBody={event?.fontBody}
        />
        <SendInviteButton
          guestName={guest.primaryName}
          guestPhone={guest.phone ?? ""}
          messageType="REMINDER"
          primaryColor={event?.primaryColor}
          fontBody={event?.fontBody}
        />
      </div>

      <main className="px-8 py-10 max-w-xl mx-auto">
        <GuestForm event={event} guest={guest} />

        {/* RSVP details if submitted */}
        {guest.rsvp && (
          <div className="mt-8 bg-white border border-stone-200 rounded p-6 space-y-3">
            <h2 className="text-sm font-medium text-stone-600 uppercase tracking-widest">
              RSVP Response
            </h2>
            <div className="space-y-2 text-sm">
              <Row label="Attending">{guest.rsvp.attending ? "Yes" : "No"}</Row>
              <Row label="Total guests">{guest.rsvp.totalAttending}</Row>
              {guest.companions.length > 0 && (
                <Row label="Companions">
                  {guest.companions.map((c) => (
                    <span key={c.id} className="block">
                      {c.name}
                      {c.dietaryRestrictions
                        ? ` (${c.dietaryRestrictions})`
                        : ""}
                    </span>
                  ))}
                </Row>
              )}
              {guest.rsvp.dietaryRestrictions && (
                <Row label="Dietary">{guest.rsvp.dietaryRestrictions}</Row>
              )}
              {guest.rsvp.transportNotes && (
                <Row label="Transport">{guest.rsvp.transportNotes}</Row>
              )}
              {guest.rsvp.coupleMessage && (
                <Row label="Message">{guest.rsvp.coupleMessage}</Row>
              )}
            </div>
          </div>
        )}
      </main>
      {logs.length > 0 && (
        <div className="mt-6 bg-white border border-stone-200 rounded p-6">
          <h2 className="text-xs text-stone-400 uppercase tracking-widest mb-4">
            Message History
          </h2>
          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between text-sm py-2 border-b border-stone-50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      log.status === "SENT"
                        ? "bg-emerald-400"
                        : log.status === "FAILED"
                          ? "bg-red-400"
                          : "bg-amber-400"
                    }`}
                  />
                  <span className="text-stone-600">{log.messageType}</span>
                  <span className="text-stone-400">via {log.channel}</span>
                </div>
                <div className="text-right">
                  <p className="text-stone-400 text-xs">
                    {new Date(log.sentAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {log.errorDetail && (
                    <p className="text-red-400 text-xs">{log.errorDetail}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <span className="text-stone-400 w-28 flex-shrink-0">{label}</span>
      <span className="text-stone-700">{children}</span>
    </div>
  );
}
