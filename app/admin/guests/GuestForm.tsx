"use client";

import { useState, useTransition } from "react";
import { createGuest, updateGuest } from "@/actions/guests";
import { useRouter } from "next/navigation";

interface GuestSnapshot {
  id: string;
  primaryName: string;
  email: string | null;
  phone: string | null;
  preferredContact: "EMAIL" | "WHATSAPP" | "SMS" | "MANUAL";
  maxAllowed: number;
  notes: string | null;
  isVip: boolean;
}

interface EventSnapshot {
  primaryColor: string;
  fontBody: string;
  fontDisplay: string;
}

export default function GuestForm({
  event,
  guest,
}: {
  event: EventSnapshot | null;
  guest?: GuestSnapshot;
}) {
  const router = useRouter();
  const isEdit = !!guest;
  const primary = event?.primaryColor ?? "#c8890e";
  const font = event?.fontBody ?? "system-ui";
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [primaryName, setPrimaryName] = useState(guest?.primaryName ?? "");
  const [email, setEmail] = useState(guest?.email ?? "");
  const [phone, setPhone] = useState(guest?.phone ?? "");
  const [preferredContact, setPreferredContact] = useState<
    "EMAIL" | "WHATSAPP" | "SMS" | "MANUAL"
  >(guest?.preferredContact ?? "EMAIL");
  const [maxAllowed, setMaxAllowed] = useState(guest?.maxAllowed ?? 2);
  const [notes, setNotes] = useState(guest?.notes ?? "");
  const [isVip, setIsVip] = useState(guest?.isVip ?? false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        if (isEdit) {
          await updateGuest(guest!.id, {
            primaryName,
            email: email || undefined,
            phone: phone || undefined,
            preferredContact,
            maxAllowed,
            notes: notes || undefined,
            isVip,
          });
        } else {
          await createGuest({
            primaryName,
            email: email || undefined,
            phone: phone || undefined,
            preferredContact,
            maxAllowed,
            notes: notes || undefined,
            isVip,
          });
        }
        router.push("/admin/guests");
        router.refresh();
      } catch (err: any) {
        setError(err.message ?? "Something went wrong.");
      }
    });
  }

  const inputCls =
    "w-full px-4 py-2.5 border border-stone-200 rounded text-sm focus:outline-none focus:border-stone-400 bg-white";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-stone-200 rounded p-6 space-y-5"
    >
      <div>
        <label
          className="block text-xs text-stone-400 uppercase tracking-wide mb-1.5"
          style={{ fontFamily: font }}
        >
          Full name / Household name *
        </label>
        <input
          required
          className={inputCls}
          value={primaryName}
          onChange={(e) => setPrimaryName(e.target.value)}
          placeholder="António & Sofia Silva"
          style={{ fontFamily: font }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            className="block text-xs text-stone-400 uppercase tracking-wide mb-1.5"
            style={{ fontFamily: font }}
          >
            Email
          </label>
          <input
            type="email"
            className={inputCls}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="guest@email.com"
            style={{ fontFamily: font }}
          />
        </div>
        <div>
          <label
            className="block text-xs text-stone-400 uppercase tracking-wide mb-1.5"
            style={{ fontFamily: font }}
          >
            Phone
          </label>
          <input
            className={inputCls}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+351 912 345 678"
            style={{ fontFamily: font }}
          />
        </div>
      </div>

      <div>
        <label
          className="block text-xs text-stone-400 uppercase tracking-wide mb-1.5"
          style={{ fontFamily: font }}
        >
          Preferred contact
        </label>
        <div className="grid grid-cols-4 gap-2">
          {(["EMAIL", "WHATSAPP", "SMS", "MANUAL"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setPreferredContact(m)}
              className="py-2.5 rounded border text-xs transition-all"
              style={{
                fontFamily: font,
                borderColor: preferredContact === m ? primary : "#e7e5e4",
                backgroundColor:
                  preferredContact === m ? `${primary}11` : "white",
                color: preferredContact === m ? primary : "#78716c",
              }}
            >
              {m === "EMAIL"
                ? "✉️ Email"
                : m === "WHATSAPP"
                  ? "💬 WhatsApp"
                  : m === "SMS"
                    ? "📱 SMS"
                    : "👤 Manual"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          className="block text-xs text-stone-400 uppercase tracking-wide mb-1.5"
          style={{ fontFamily: font }}
        >
          Max guests allowed (including primary)
        </label>
        <input
          type="number"
          min={1}
          max={20}
          className={inputCls}
          value={maxAllowed}
          onChange={(e) => setMaxAllowed(Number(e.target.value))}
          style={{ fontFamily: font }}
        />
      </div>

      <div>
        <label
          className="block text-xs text-stone-400 uppercase tracking-wide mb-1.5"
          style={{ fontFamily: font }}
        >
          Internal notes
        </label>
        <textarea
          rows={3}
          className={inputCls}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes only visible to admins…"
          style={{ fontFamily: font, resize: "vertical" }}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsVip(!isVip)}
          className="w-10 h-6 rounded-full transition-colors relative"
          style={{ backgroundColor: isVip ? primary : "#d6d3d1" }}
        >
          <span
            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all"
            style={{ left: isVip ? "1.25rem" : "0.25rem" }}
          />
        </button>
        <span className="text-sm text-stone-600" style={{ fontFamily: font }}>
          Mark as VIP
        </span>
      </div>

      {error && (
        <p
          className="text-red-500 text-sm bg-red-50 border border-red-100 rounded px-4 py-3"
          style={{ fontFamily: font }}
        >
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 rounded text-white text-sm tracking-widest uppercase transition-all disabled:opacity-50"
          style={{ backgroundColor: primary, fontFamily: font }}
        >
          {isPending ? "Saving…" : isEdit ? "Save Changes" : "Add Guest"}
        </button>
        <a
          href="/admin/guests"
          className="px-6 py-2.5 rounded border border-stone-200 text-stone-500 text-sm transition-colors hover:border-stone-300"
          style={{ fontFamily: font }}
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
