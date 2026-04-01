import { getAllMessageLogs } from "@/actions/invitations";
import { getMyEvent } from "@/actions/events";
import Link from "next/link";

const STATUS_STYLE: Record<string, string> = {
  SENT: "bg-emerald-100 text-emerald-700",
  DELIVERED: "bg-blue-100 text-blue-700",
  FAILED: "bg-red-100 text-red-600",
  PENDING: "bg-amber-100 text-amber-700",
};

const CHANNEL_ICON: Record<string, string> = {
  SMS: "📱",
  WHATSAPP: "💬",
  EMAIL: "✉️",
  MANUAL: "👤",
};

export default async function CommunicationsPage() {
  const [logs, event] = await Promise.all([getAllMessageLogs(), getMyEvent()]);
  const font = event?.fontBody ?? "system-ui";

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 px-8 py-5">
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
          Communications
        </h1>
        <p
          className="text-stone-400 text-xs mt-0.5"
          style={{ fontFamily: font }}
        >
          {logs.length} messages sent
        </p>
      </header>

      <main className="px-8 py-8 max-w-5xl mx-auto">
        {logs.length === 0 ? (
          <div className="text-center py-20 text-stone-400">
            <p className="text-sm" style={{ fontFamily: font }}>
              No messages sent yet.
            </p>
            <Link
              href="/admin/guests"
              className="text-sm underline underline-offset-2 mt-2 block"
              style={{ color: event?.primaryColor ?? "#c8890e" }}
            >
              Go to guest list to send invitations →
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-stone-200 rounded overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50">
                  {["Guest", "Type", "Channel", "Status", "Sent"].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs text-stone-400 uppercase tracking-widest px-5 py-3"
                      style={{ fontFamily: font }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-stone-50 hover:bg-stone-50 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/guests/${log.guestId}`}
                        className="text-sm text-stone-700 hover:underline"
                        style={{ fontFamily: font }}
                      >
                        {log.guest.primaryName}
                      </Link>
                    </td>
                    <td
                      className="px-5 py-3 text-stone-500 text-sm"
                      style={{ fontFamily: font }}
                    >
                      {log.messageType}
                    </td>
                    <td
                      className="px-5 py-3 text-sm"
                      style={{ fontFamily: font }}
                    >
                      <span className="flex items-center gap-1.5 text-stone-500">
                        {CHANNEL_ICON[log.channel]} {log.channel}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs ${STATUS_STYLE[log.status]}`}
                        style={{ fontFamily: font }}
                      >
                        {log.status}
                      </span>
                      {log.errorDetail && (
                        <p
                          className="text-red-400 text-xs mt-0.5 max-w-xs truncate"
                          title={log.errorDetail}
                        >
                          {log.errorDetail}
                        </p>
                      )}
                    </td>
                    <td
                      className="px-5 py-3 text-stone-400 text-xs"
                      style={{ fontFamily: font }}
                    >
                      {new Date(log.sentAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
