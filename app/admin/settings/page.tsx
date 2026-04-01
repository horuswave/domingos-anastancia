import { getMyEvent } from "@/actions/events";
import { redirect } from "next/navigation";
import SettingsForm from "./SettingsForm";
import Link from "next/link";
import { auth } from "@/auth";

export default async function SettingsPage() {
  const event = await getMyEvent();
  if (!event) redirect("/admin/dashboard");

  const session = await auth();

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 px-8 py-5 flex items-center justify-between">
        <div>
          <Link
            href="/admin/dashboard"
            className="text-xs text-stone-400 hover:text-stone-600 mb-1 block"
            style={{ fontFamily: "system-ui" }}
          >
            ← Dashboard
          </Link>
          <h1
            className="text-2xl text-stone-800"
            style={{ fontFamily: event.fontDisplay, fontWeight: 400 }}
          >
            Event Settings
          </h1>
          <p
            className="text-stone-400 text-xs mt-0.5"
            style={{ fontFamily: event.fontBody }}
          >
            {event.title} · {session?.user?.name}
          </p>
        </div>

        {/* Live colour swatch */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded border border-stone-200"
            style={{ backgroundColor: event.primaryColor }}
            title="Primary"
          />
          <div
            className="w-8 h-8 rounded border border-stone-200"
            style={{ backgroundColor: event.accentColor }}
            title="Accent"
          />
        </div>
      </header>

      <main className="px-8 py-10 max-w-3xl mx-auto">
        <SettingsForm event={event} />
      </main>
    </div>
  );
}
