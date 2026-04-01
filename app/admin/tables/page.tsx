import { getTables, getUnassignedAttendingGuests } from "@/actions/tables";
import { getMyEvent } from "@/actions/events";
import Link from "next/link";
import TablesView from "./TablesView";

export default async function TablesPage() {
  const [tables, unassigned, event] = await Promise.all([
    getTables(),
    getUnassignedAttendingGuests(),
    getMyEvent(),
  ]);

  const totalCapacity = tables.reduce((s, t) => s + t.capacity, 0);
  const totalSeated = tables.reduce(
    (s, t) =>
      s + t.guests.reduce((gs, g) => gs + (g.rsvp?.totalAttending ?? 1), 0),
    0,
  );
  const totalAttending =
    totalSeated +
    unassigned.reduce((s, g) => s + (g.rsvp?.totalAttending ?? 1), 0);

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 px-8 py-5 flex items-center justify-between">
        <div>
          <Link
            href="/admin/dashboard"
            className="text-xs text-stone-400 hover:text-stone-600 mb-1 block"
          >
            ← Dashboard
          </Link>
          <h1
            className="text-2xl text-stone-800"
            style={{
              fontFamily: event?.fontDisplay ?? "Georgia",
              fontWeight: 400,
            }}
          >
            Table Management
          </h1>
          <p
            className="text-stone-400 text-xs mt-0.5"
            style={{ fontFamily: event?.fontBody ?? "system-ui" }}
          >
            {totalSeated} of {totalAttending} attending guests seated ·{" "}
            {totalCapacity} total seats across {tables.length} tables
          </p>
        </div>
      </header>

      <main className="px-8 py-8 max-w-7xl mx-auto">
        <TablesView tables={tables} unassigned={unassigned} event={event} />
      </main>
    </div>
  );
}
