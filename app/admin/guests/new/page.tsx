import { getMyEvent } from "@/actions/events";
import { redirect } from "next/navigation";
import GuestForm from "../GuestForm";
import Link from "next/link";

export default async function NewGuestPage() {
  const event = await getMyEvent();
  if (!event) redirect("/admin/dashboard");

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
          style={{ fontFamily: event.fontDisplay, fontWeight: 400 }}
        >
          Add Guest
        </h1>
      </header>
      <main className="px-8 py-10 max-w-xl mx-auto">
        <GuestForm event={event} />
      </main>
    </div>
  );
}
