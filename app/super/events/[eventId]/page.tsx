import { getEventById, removeEventAdmin, deleteEvent } from "@/actions/events";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import AddAdminForm from "./AddAdminForm";
import SuperEventTabs from "./SuperEventTabs";

export default async function ManageEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const event = await getEventById(eventId);
  if (!event) notFound();

  const totalAttending = event.guests
    .filter((g) => g.rsvpStatus === "ATTENDING")
    .reduce((s, g) => s + (g.rsvp?.totalAttending ?? 1), 0);

  const stats = {
    total: event.guests.length,
    attending: event.guests.filter((g) => g.rsvpStatus === "ATTENDING").length,
    declined: event.guests.filter((g) => g.rsvpStatus === "DECLINED").length,
    pending: event.guests.filter((g) => g.rsvpStatus === "PENDING").length,
    headcount: totalAttending,
    tables: event.tables.length,
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 px-8 py-5 flex items-center justify-between">
        <div>
          <Link
            href="/super/dashboard"
            className="text-xs text-stone-400 hover:text-stone-600 mb-1 block"
          >
            ← All events
          </Link>
          <h1
            className="text-2xl text-stone-800"
            style={{ fontFamily: event.fontDisplay, fontWeight: 400 }}
          >
            {event.title}
          </h1>
          <p className="text-stone-400 text-xs mt-0.5">
            {event.coupleNames} ·{" "}
            {new Date(event.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded border border-stone-200"
            style={{ backgroundColor: event.primaryColor }}
          />
          <div
            className="w-8 h-8 rounded border border-stone-200"
            style={{ backgroundColor: event.accentColor }}
          />
        </div>
      </header>

      {/* Stats bar */}
      <div className="bg-white border-b border-stone-100 px-8 py-3 flex gap-8">
        {[
          { label: "Guests", value: stats.total },
          { label: "Attending", value: stats.attending },
          { label: "Declined", value: stats.declined },
          { label: "Pending", value: stats.pending },
          { label: "Headcount", value: stats.headcount },
          { label: "Tables", value: stats.tables },
        ].map((s) => (
          <div key={s.label}>
            <p
              className="text-lg font-medium text-stone-800"
              style={{ fontFamily: event.fontDisplay }}
            >
              {s.value}
            </p>
            <p
              className="text-xs text-stone-400"
              style={{ fontFamily: event.fontBody }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <main className="px-8 py-8 max-w-5xl mx-auto space-y-8">
        {/* Tabbed content: Settings / Admins / Danger */}
        <SuperEventTabs event={event} />

        {/* Admins section */}
        <section>
          <h2
            className="text-lg text-stone-800 mb-4"
            style={{ fontFamily: event.fontDisplay, fontWeight: 400 }}
          >
            Event Admins
          </h2>
          <div className="bg-white border border-stone-200 rounded overflow-hidden mb-4">
            {event.eventAdmins.length === 0 ? (
              <p
                className="text-stone-400 text-sm px-6 py-5"
                style={{ fontFamily: event.fontBody }}
              >
                No admins assigned yet.
              </p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50">
                    {["Name", "Email", ""].map((h) => (
                      <th
                        key={h}
                        className="text-left text-xs text-stone-400 uppercase tracking-widest px-6 py-3"
                        style={{ fontFamily: event.fontBody }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {event.eventAdmins.map((ea) => (
                    <tr key={ea.id} className="border-b border-stone-50">
                      <td
                        className="px-6 py-4 text-stone-700 text-sm"
                        style={{ fontFamily: event.fontBody }}
                      >
                        {ea.adminUser.name}
                      </td>
                      <td
                        className="px-6 py-4 text-stone-500 text-sm"
                        style={{ fontFamily: event.fontBody }}
                      >
                        {ea.adminUser.email}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <form
                          action={async () => {
                            "use server";
                            await removeEventAdmin(ea.adminUser.id, event.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="text-xs text-red-400 hover:text-red-600"
                            style={{ fontFamily: event.fontBody }}
                          >
                            Remove
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <AddAdminForm eventId={event.id} />
        </section>

        {/* Danger zone */}
        <section className="border border-red-200 rounded p-6">
          <h2
            className="text-sm font-medium text-red-600 mb-2"
            style={{ fontFamily: event.fontBody }}
          >
            Danger Zone
          </h2>
          <p
            className="text-stone-500 text-sm mb-4"
            style={{ fontFamily: event.fontBody }}
          >
            Permanently deletes this event and all guests, RSVPs, tables, and
            message logs. Cannot be undone.
          </p>
          <form
            action={async () => {
              "use server";
              await deleteEvent(event.id);
              redirect("/super/dashboard");
            }}
          >
            <button
              type="submit"
              className="text-sm px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded transition-colors"
              style={{ fontFamily: event.fontBody }}
            >
              Delete this event
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
