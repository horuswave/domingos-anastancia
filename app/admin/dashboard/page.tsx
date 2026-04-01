import { getDashboardStats, getGuests } from "@/actions/guests";
import { getMyEvent } from "@/actions/events";
import DashboardStats from "@/components/admin/DashboardStats";
import { auth, signOut } from "@/auth";
import Link from "next/link";

export default async function DashboardPage() {
  const [session, stats, guests, event] = await Promise.all([
    auth(),
    getDashboardStats(), // uses session.user.eventId internally
    getGuests(), // uses session.user.eventId internally
    getMyEvent(), // fetches this admin's event for display
  ]);

  const recentRsvps = guests
    .filter((g) => g.rsvpSubmittedAt)
    .sort(
      (a, b) =>
        new Date(b.rsvpSubmittedAt!).getTime() -
        new Date(a.rsvpSubmittedAt!).getTime(),
    )
    .slice(0, 8);

  const statusColor: Record<string, string> = {
    ATTENDING: "bg-emerald-100 text-emerald-700",
    DECLINED: "bg-red-100 text-red-600",
    PENDING: "bg-amber-100 text-amber-700",
    MAYBE: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 px-8 py-5 flex items-center justify-between">
        <div>
          <h1
            className="font-display text-2xl text-stone-800"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            {event?.title ?? "Dashboard"}
          </h1>
          <p className="font-body text-stone-400 text-xs mt-0.5">
            {event?.coupleNames} · Welcome, {session?.user?.name}
          </p>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/admin/guests"
            className="font-body text-sm text-stone-500 hover:text-stone-800"
          >
            Guests
          </Link>
          <Link
            href="/admin/tables"
            className="font-body text-sm text-stone-500 hover:text-stone-800"
          >
            Tables
          </Link>
          <Link
            href="/admin/communications"
            className="font-body text-sm text-stone-500 hover:text-stone-800"
          >
            Communications
          </Link>
          <Link
            href="/admin/settings"
            className="font-body text-sm text-stone-500 hover:text-stone-800"
          >
            Settings
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button
              type="submit"
              className="font-body text-sm text-stone-400 hover:text-red-500"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="px-8 py-10 max-w-6xl mx-auto space-y-10">
        <section>
          <h2 className="font-body text-xs text-stone-400 uppercase tracking-widest mb-4">
            Overview
          </h2>
          <DashboardStats stats={stats} />
        </section>

        {stats.total > 0 && (
          <section>
            <h2 className="font-body text-xs text-stone-400 uppercase tracking-widest mb-3">
              Response Rate
            </h2>
            <div className="bg-white border border-stone-200 rounded-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="font-body text-stone-600 text-sm">
                  {stats.total - stats.pending} of {stats.total} households
                  responded
                </span>
                <span className="font-body text-stone-800 text-sm font-medium">
                  {Math.round(
                    ((stats.total - stats.pending) / stats.total) * 100,
                  )}
                  %
                </span>
              </div>
              <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${((stats.total - stats.pending) / stats.total) * 100}%`,
                    backgroundColor: event?.primaryColor ?? "#c8890e",
                  }}
                />
              </div>
            </div>
          </section>
        )}

        {recentRsvps.length > 0 && (
          <section>
            <h2 className="font-body text-xs text-stone-400 uppercase tracking-widest mb-4">
              Recent RSVPs
            </h2>
            <div className="bg-white border border-stone-200 rounded-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-100">
                    {["Guest", "Status", "Guests", "Responded"].map((h) => (
                      <th
                        key={h}
                        className="text-left font-body text-xs text-stone-400 uppercase tracking-widest px-6 py-4"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentRsvps.map((g) => (
                    <tr
                      key={g.id}
                      className="border-b border-stone-50 hover:bg-stone-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-body text-stone-800 text-sm">
                        {g.primaryName}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full font-body text-xs ${statusColor[g.rsvpStatus]}`}
                        >
                          {g.rsvpStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-body text-stone-500 text-sm">
                        {g.rsvp?.totalAttending ?? "—"}
                      </td>
                      <td className="px-6 py-4 font-body text-stone-400 text-xs">
                        {g.rsvpSubmittedAt
                          ? new Date(g.rsvpSubmittedAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
