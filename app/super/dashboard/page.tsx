import { getAllEvents } from "@/actions/events";
import { auth, signOut } from "@/auth";
import Link from "next/link";

export default async function SuperDashboardPage() {
  const [session, events] = await Promise.all([auth(), getAllEvents()]);

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 px-8 py-5 flex items-center justify-between">
        <div>
          <h1
            className="text-2xl text-stone-800"
            style={{ fontFamily: "Georgia, serif", fontWeight: 400 }}
          >
            Super Admin
          </h1>
          <p
            className="text-stone-400 text-xs mt-0.5"
            style={{ fontFamily: "system-ui" }}
          >
            {session?.user?.email}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/super/events/new"
            className="text-sm text-white px-4 py-2 rounded transition-colors"
            style={{ backgroundColor: "#c8890e", fontFamily: "system-ui" }}
          >
            + New Event
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button
              type="submit"
              className="text-sm text-stone-400 hover:text-red-500 transition-colors"
              style={{ fontFamily: "system-ui" }}
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="px-8 py-10 max-w-5xl mx-auto">
        {/* Summary bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Events", value: events.length },
            {
              label: "Total Guests",
              value: events.reduce((s, e) => s + e._count.guests, 0),
            },
            {
              label: "Total Attending",
              value: events.reduce(
                (s, e) =>
                  s +
                  e.guests
                    .filter((g) => g.rsvpStatus === "ATTENDING")
                    .reduce((gs, g) => gs + (g.rsvp?.totalAttending ?? 1), 0),
                0,
              ),
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white border border-stone-200 rounded p-5"
            >
              <p
                className="text-3xl text-stone-800"
                style={{ fontFamily: "Georgia, serif", fontWeight: 400 }}
              >
                {stat.value}
              </p>
              <p
                className="text-xs text-stone-400 mt-1"
                style={{ fontFamily: "system-ui" }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <h2
          className="text-xs text-stone-400 uppercase tracking-widest mb-4"
          style={{ fontFamily: "system-ui" }}
        >
          All Events ({events.length})
        </h2>

        {events.length === 0 ? (
          <div className="text-center py-24 text-stone-400">
            <p className="text-sm mb-3" style={{ fontFamily: "system-ui" }}>
              No events yet.
            </p>
            <Link
              href="/super/events/new"
              className="text-sm underline underline-offset-2"
              style={{ color: "#c8890e", fontFamily: "system-ui" }}
            >
              Create your first event →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => {
              const attending = event.guests.filter(
                (g) => g.rsvpStatus === "ATTENDING",
              ).length;
              const declined = event.guests.filter(
                (g) => g.rsvpStatus === "DECLINED",
              ).length;
              const pending = event.guests.filter(
                (g) => g.rsvpStatus === "PENDING",
              ).length;
              const headcount = event.guests
                .filter((g) => g.rsvpStatus === "ATTENDING")
                .reduce((s, g) => s + (g.rsvp?.totalAttending ?? 1), 0);
              const responded = attending + declined;
              const total = event._count.guests;
              const responsePct =
                total > 0 ? Math.round((responded / total) * 100) : 0;
              const admins = event.eventAdmins
                .map((ea) => ea.adminUser.email)
                .join(", ");

              return (
                <div
                  key={event.id}
                  className="bg-white border border-stone-200 rounded overflow-hidden"
                >
                  {/* Card header */}
                  <div className="p-6 flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      {/* Colour swatch */}
                      <div
                        className="w-12 h-12 rounded flex-shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: event.accentColor }}
                      >
                        <div
                          className="w-5 h-5 rounded-full"
                          style={{ backgroundColor: event.primaryColor }}
                        />
                      </div>
                      <div>
                        <p
                          className="text-stone-800 font-medium"
                          style={{ fontFamily: "system-ui" }}
                        >
                          {event.title}
                        </p>
                        <p
                          className="text-stone-500 text-sm mt-0.5"
                          style={{ fontFamily: "system-ui" }}
                        >
                          {event.coupleNames} ·{" "}
                          {new Date(event.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                        <p
                          className="text-stone-400 text-xs mt-1"
                          style={{ fontFamily: "system-ui" }}
                        >
                          {event.venue} · Admins: {admins || "none"}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/super/events/${event.id}`}
                      className="text-sm px-4 py-2 rounded border border-stone-200 text-stone-600 hover:border-stone-400 transition-colors flex-shrink-0"
                      style={{ fontFamily: "system-ui" }}
                    >
                      Manage →
                    </Link>
                  </div>

                  {/* Stats row */}
                  <div className="border-t border-stone-100 px-6 py-3 bg-stone-50 flex items-center gap-8">
                    {[
                      { label: "Total", value: total, color: "#78716c" },
                      {
                        label: "Attending",
                        value: attending,
                        color: "#10b981",
                      },
                      { label: "Declined", value: declined, color: "#ef4444" },
                      { label: "Pending", value: pending, color: "#f59e0b" },
                      {
                        label: "Headcount",
                        value: headcount,
                        color: "#c8890e",
                      },
                      {
                        label: "Tables",
                        value: event._count.tables,
                        color: "#78716c",
                      },
                    ].map((s) => (
                      <div key={s.label}>
                        <p
                          className="text-sm font-medium"
                          style={{ color: s.color, fontFamily: "system-ui" }}
                        >
                          {s.value}
                        </p>
                        <p
                          className="text-xs text-stone-400"
                          style={{ fontFamily: "system-ui" }}
                        >
                          {s.label}
                        </p>
                      </div>
                    ))}

                    {/* Response rate bar */}
                    <div className="flex-1 ml-4">
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className="text-xs text-stone-400"
                          style={{ fontFamily: "system-ui" }}
                        >
                          Response rate
                        </span>
                        <span
                          className="text-xs text-stone-600 font-medium"
                          style={{ fontFamily: "system-ui" }}
                        >
                          {responsePct}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${responsePct}%`,
                            backgroundColor: event.primaryColor,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
