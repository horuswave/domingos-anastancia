"use client";
import SendInviteButton from "@/components/admin/SendInviteButton";
import BulkSendButton from "@/components/admin/BulkSendButton";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { deleteGuest } from "@/actions/guests";
import Link from "next/link";
import { Copy, Trash2, Pencil, Check } from "lucide-react";

type RsvpStatus = "PENDING" | "ATTENDING" | "DECLINED" | "MAYBE";

interface Guest {
  id: string;
  primaryName: string;
  email: string | null;
  phone: string | null;
  preferredContact: string;
  maxAllowed: number;
  rsvpStatus: RsvpStatus;
  rsvpSubmittedAt: Date | null;
  isVip: boolean;
  token: string;
  notes: string | null;
  rsvp: {
    attending: boolean;
    totalAttending: number;
  } | null;
  table: { name: string } | null;
}

interface Event {
  primaryColor: string;
  fontBody: string;
  fontDisplay: string;
}

const STATUS_LABEL: Record<RsvpStatus, string> = {
  PENDING: "Pending",
  ATTENDING: "Attending",
  DECLINED: "Declined",
  MAYBE: "Maybe",
};

const STATUS_STYLE: Record<RsvpStatus, string> = {
  ATTENDING: "bg-emerald-100 text-emerald-700",
  DECLINED: "bg-red-100 text-red-600",
  PENDING: "bg-amber-100 text-amber-700",
  MAYBE: "bg-blue-100 text-blue-700",
};

const CONTACT_ICON: Record<string, string> = {
  EMAIL: "✉️",
  WHATSAPP: "💬",
  SMS: "📱",
  MANUAL: "👤",
};

export default function GuestList({
  guests,
  event, pendingCount
}: {
  guests: Guest[];
  event: Event | null;
  pendingCount: number;
}) {
  const router = useRouter();
  const primary = event?.primaryColor ?? "#c8890e";
  const font = event?.fontBody ?? "system-ui";

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | RsvpStatus>("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return guests.filter((g) => {
      const matchSearch =
        g.primaryName.toLowerCase().includes(search.toLowerCase()) ||
        g.email?.toLowerCase().includes(search.toLowerCase()) ||
        g.phone?.includes(search);
      const matchFilter = filter === "ALL" || g.rsvpStatus === filter;
      return matchSearch && matchFilter;
    });
  }, [guests, search, filter]);

  const counts = useMemo(
    () => ({
      ALL: guests.length,
      ATTENDING: guests.filter((g) => g.rsvpStatus === "ATTENDING").length,
      PENDING: guests.filter((g) => g.rsvpStatus === "PENDING").length,
      DECLINED: guests.filter((g) => g.rsvpStatus === "DECLINED").length,
      MAYBE: guests.filter((g) => g.rsvpStatus === "MAYBE").length,
    }),
    [guests],
  );

  async function handleCopy(token: string, id: string) {
    const url = `${window.location.origin}/invite/${token}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await deleteGuest(id);
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-stone-500" style={{ fontFamily: font }}>
          {filtered.length} guest{filtered.length !== 1 ? "s" : ""}
        </p>
        <BulkSendButton
          pendingCount={pendingCount}
          primaryColor={primary}
          fontBody={font}
        />
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name, email or phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 bg-white border border-stone-200 rounded text-sm focus:outline-none focus:border-stone-400"
          style={{ fontFamily: font }}
        />
        <div className="flex gap-1 bg-white border border-stone-200 rounded p-1">
          {(["ALL", "ATTENDING", "PENDING", "DECLINED", "MAYBE"] as const).map(
            (s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className="px-3 py-1.5 rounded text-xs transition-all"
                style={{
                  fontFamily: font,
                  backgroundColor: filter === s ? primary : "transparent",
                  color: filter === s ? "white" : "#78716c",
                }}
              >
                {s === "ALL" ? "All" : STATUS_LABEL[s]} ({counts[s]})
              </button>
            ),
          )}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <p className="text-sm" style={{ fontFamily: font }}>
            {search || filter !== "ALL"
              ? "No guests match your filters."
              : "No guests yet."}
          </p>
          {!search && filter === "ALL" && (
            <Link
              href="/admin/guests/new"
              className="text-sm underline underline-offset-2 mt-2 block"
              style={{ color: primary }}
            >
              Add your first guest →
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50">
                {["Guest", "Contact", "Status", "Guests", "Table", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left text-xs text-stone-400 uppercase tracking-widest px-5 py-3"
                      style={{ fontFamily: font }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((g) => (
                <tr
                  key={g.id}
                  className="border-b border-stone-50 hover:bg-stone-50 transition-colors"
                >
                  {/* Name */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {g.isVip && (
                        <span
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{
                            backgroundColor: `${primary}22`,
                            color: primary,
                            fontFamily: font,
                          }}
                        >
                          VIP
                        </span>
                      )}
                      <div>
                        <p
                          className="text-stone-800 text-sm font-medium"
                          style={{ fontFamily: font }}
                        >
                          {g.primaryName}
                        </p>
                        {g.notes && (
                          <p
                            className="text-stone-400 text-xs mt-0.5 max-w-xs truncate"
                            style={{ fontFamily: font }}
                          >
                            {g.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <span>{CONTACT_ICON[g.preferredContact]}</span>
                      <div>
                        <p
                          className="text-stone-600 text-xs"
                          style={{ fontFamily: font }}
                        >
                          {g.email ?? g.phone ?? "—"}
                        </p>
                        {g.email && g.phone && (
                          <p
                            className="text-stone-400 text-xs"
                            style={{ fontFamily: font }}
                          >
                            {g.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs ${STATUS_STYLE[g.rsvpStatus]}`}
                      style={{ fontFamily: font }}
                    >
                      {STATUS_LABEL[g.rsvpStatus]}
                    </span>
                    {g.rsvpSubmittedAt && (
                      <p
                        className="text-stone-400 text-xs mt-0.5"
                        style={{ fontFamily: font }}
                      >
                        {new Date(g.rsvpSubmittedAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                          },
                        )}
                      </p>
                    )}
                  </td>

                  {/* Guest count */}
                  <td
                    className="px-5 py-4 text-stone-500 text-sm"
                    style={{ fontFamily: font }}
                  >
                    {g.rsvp?.attending
                      ? `${g.rsvp.totalAttending} / ${g.maxAllowed}`
                      : `— / ${g.maxAllowed}`}
                  </td>

                  {/* Table */}
                  <td
                    className="px-5 py-4 text-stone-400 text-sm"
                    style={{ fontFamily: font }}
                  >
                    {g.table?.name ?? "—"}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
  <div className="flex items-center gap-1 justify-end">
    <SendInviteButton
      guestId={g.id}
      preferredContact={g.preferredContact}
      hasPhone={!!g.phone}
      primaryColor={primary}
      fontBody={font}
      compact
    />
    <button
      onClick={() => handleCopy(g.token, g.id)}
      title="Copy invite link"
      className="p-1.5 text-stone-400 hover:text-stone-700 transition-colors"
    >
      {copiedId === g.id
        ? <Check className="w-4 h-4 text-emerald-500" />
        : <Copy  className="w-4 h-4" />}
    </button>
    <Link href={`/admin/guests/${g.id}`}
      title="Edit guest"
      className="p-1.5 text-stone-400 hover:text-stone-700 transition-colors">
      <Pencil className="w-4 h-4" />
    </Link>
    <button
      onClick={() => handleDelete(g.id, g.primaryName)}
      disabled={deletingId === g.id}
      title="Delete guest"
      className="p-1.5 text-stone-400 hover:text-red-500 transition-colors disabled:opacity-40"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  </div>
</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="px-5 py-3 border-t border-stone-100 bg-stone-50">
            <p className="text-xs text-stone-400" style={{ fontFamily: font }}>
              Showing {filtered.length} of {guests.length} guests
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
