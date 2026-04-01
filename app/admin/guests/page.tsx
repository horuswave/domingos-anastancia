import { getGuests } from "@/actions/guests";
import { getMyEvent } from "@/actions/events";
import Link from "next/link";
import GuestList from "./GuestList";

export default async function GuestsPage() {
  const [guests, event] = await Promise.all([getGuests(), getMyEvent()]);
const pendingCount = guests.filter((g) => g.rsvpStatus === "PENDING").length;
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
            Guest List
          </h1>
          <p
            className="text-stone-400 text-xs mt-0.5"
            style={{ fontFamily: event?.fontBody ?? "system-ui" }}
          >
            {guests.length} households · {event?.title}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/guests/new"
            className="px-4 py-2 rounded text-sm text-white transition-colors"
            style={{ backgroundColor: event?.primaryColor ?? "#c8890e" }}
          >
            + Add Guest
          </Link>
        </div>
      </header>

      <main className="px-8 py-8 max-w-6xl mx-auto">
        <GuestList guests={guests} event={event} pendingCount={pendingCount} />
      </main>
    </div>
  );
}
