"use client";

import { useState, useTransition } from "react";
import { updateMyEvent } from "@/actions/events";
import { useRouter } from "next/navigation";
import ProgramEditor, { type ProgramItem } from "./ProgramEditor";
import type { RsvpFields } from "../../../components/invitation/RsvpForm";

const FONT_DISPLAY_OPTIONS = [
  "Cormorant Garamond",
  "Playfair Display",
  "EB Garamond",
  "Libre Baskerville",
];
const FONT_BODY_OPTIONS = ["Jost", "Lato", "DM Sans", "Nunito"];

interface EventSnapshot {
  title: string;
  coupleNames: string;
  date: Date;
  time: string;
  venue: string;
  address: string;
  mapUrl: string | null;
  dressCode: string | null;
  message: string | null;
  rules: string | null;
  supportEmail: string | null;
  supportPhone: string | null;
  primaryColor: string;
  accentColor: string;
  backgroundStyle: "DARK" | "LIGHT" | "IMAGE";
  fontDisplay: string;
  fontBody: string;
  programItems?: unknown; // JSON from Prisma
  rsvpFields?: unknown; // JSON from Prisma
}

type Tab = "details" | "branding" | "program" | "rsvp";

export default function SettingsForm({ event }: { event: EventSnapshot }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("details");

  // ── Details ──────────────────────────────────────────────────────────────────
  const [title, setTitle] = useState(event.title);
  const [coupleNames, setCoupleNames] = useState(event.coupleNames);
  const [date, setDate] = useState(
    event.date ? new Date(event.date).toISOString().split("T")[0] : "",
  );
  const [time, setTime] = useState(event.time);
  const [venue, setVenue] = useState(event.venue);
  const [address, setAddress] = useState(event.address);
  const [mapUrl, setMapUrl] = useState(event.mapUrl ?? "");
  const [dressCode, setDressCode] = useState(event.dressCode ?? "");
  const [message, setMessage] = useState(event.message ?? "");
  const [rules, setRules] = useState(event.rules ?? "");
  const [supportEmail, setSupportEmail] = useState(event.supportEmail ?? "");
  const [supportPhone, setSupportPhone] = useState(event.supportPhone ?? "");

  // ── Branding ─────────────────────────────────────────────────────────────────
  const [primaryColor, setPrimaryColor] = useState(event.primaryColor);
  const [accentColor, setAccentColor] = useState(event.accentColor);
  const [bgStyle, setBgStyle] = useState<"DARK" | "LIGHT" | "IMAGE">(
    event.backgroundStyle,
  );
  const [fontDisplay, setFontDisplay] = useState(event.fontDisplay);
  const [fontBody, setFontBody] = useState(event.fontBody);

  // ── Program ──────────────────────────────────────────────────────────────────
  const [programItems, setProgramItems] = useState<ProgramItem[]>(
    Array.isArray(event.programItems)
      ? (event.programItems as ProgramItem[])
      : [],
  );

  // ── RSVP fields ──────────────────────────────────────────────────────────────
  const defaultRsvp: RsvpFields = {
    companions: true,
    dietary: true,
    transport: true,
    message: true,
  };
  const storedRsvp =
    event.rsvpFields &&
    typeof event.rsvpFields === "object" &&
    !Array.isArray(event.rsvpFields)
      ? (event.rsvpFields as Partial<RsvpFields>)
      : {};
  const [rsvpFields, setRsvpFields] = useState<RsvpFields>({
    ...defaultRsvp,
    ...storedRsvp,
  });

  function toggleRsvpField(key: keyof RsvpFields) {
    setRsvpFields((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  // ── Save ──────────────────────────────────────────────────────────────────────
  function handleSave() {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      try {
        await updateMyEvent({
          title,
          coupleNames,
          date,
          time,
          venue,
          address,
          mapUrl,
          dressCode,
          message,
          rules,
          supportEmail,
          supportPhone,
          primaryColor,
          accentColor,
          backgroundStyle: bgStyle,
          fontDisplay,
          fontBody,
          // Pass through as JSON — make sure updateMyEvent accepts these
          // (add them to the Partial<> type in events.ts)
          programItems: programItems as any,
          rsvpFields: rsvpFields as any,
        });
        setSaved(true);
        router.refresh();
        setTimeout(() => setSaved(false), 3000);
      } catch (err: any) {
        setError(err.message ?? "Failed to save.");
      }
    });
  }

  const inputCls =
    "w-full px-4 py-2.5 border border-stone-200 rounded text-sm focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-200 bg-white";

  const TABS: { id: Tab; label: string }[] = [
    { id: "details", label: "Details" },
    { id: "branding", label: "Branding" },
    { id: "program", label: "Program" },
    { id: "rsvp", label: "RSVP" },
  ];

  return (
    <div className="space-y-6">
      {/* Tab switcher */}
      <div className="flex gap-1 bg-stone-100 rounded p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-5 py-2 rounded text-sm transition-all"
            style={{
              fontFamily: fontBody,
              backgroundColor: tab === t.id ? "white" : "transparent",
              color: tab === t.id ? "#1a1a1a" : "#78716c",
              boxShadow: tab === t.id ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── DETAILS TAB ─────────────────────────────────────────────────────── */}
      {tab === "details" && (
        <div className="bg-white border border-stone-200 rounded p-6 space-y-5">
          <Row>
            <Field label="Event Title">
              <input
                className={inputCls}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Field>
            <Field label="Couple Names">
              <input
                className={inputCls}
                value={coupleNames}
                onChange={(e) => setCoupleNames(e.target.value)}
              />
            </Field>
          </Row>
          <Row>
            <Field label="Date">
              <input
                type="date"
                className={inputCls}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Field>
            <Field label="Time">
              <input
                className={inputCls}
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="6:00 PM"
              />
            </Field>
          </Row>
          <Field label="Venue">
            <input
              className={inputCls}
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
            />
          </Field>
          <Field label="Address">
            <input
              className={inputCls}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Field>
          <Field label="Google Maps URL">
            <input
              className={inputCls}
              value={mapUrl}
              onChange={(e) => setMapUrl(e.target.value)}
              placeholder="https://maps.google.com/…"
            />
          </Field>
          <Field label="Dress Code">
            <input
              className={inputCls}
              value={dressCode}
              onChange={(e) => setDressCode(e.target.value)}
            />
          </Field>
          <Field label="Invitation Message">
            <textarea
              rows={5}
              className={inputCls}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="The message guests see on their invitation…"
              style={{ resize: "vertical" }}
            />
          </Field>
          <Field label="Rules / Good to Know">
            <textarea
              rows={5}
              className={inputCls}
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              placeholder={"• One rule per line"}
              style={{ resize: "vertical" }}
            />
          </Field>
          <Row>
            <Field label="Support Email">
              <input
                type="email"
                className={inputCls}
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
              />
            </Field>
            <Field label="Support Phone">
              <input
                className={inputCls}
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
              />
            </Field>
          </Row>
        </div>
      )}

      {/* ── BRANDING TAB ────────────────────────────────────────────────────── */}
      {tab === "branding" && (
        <div className="space-y-5">
          <div className="bg-white border border-stone-200 rounded p-6 space-y-5">
            <Row>
              <Field label="Primary Colour">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded border border-stone-200 cursor-pointer flex-shrink-0"
                  />
                  <input
                    className={inputCls}
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                  />
                </div>
              </Field>
              <Field label="Accent / Background Colour">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-10 h-10 rounded border border-stone-200 cursor-pointer flex-shrink-0"
                  />
                  <input
                    className={inputCls}
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                  />
                </div>
              </Field>
            </Row>

            <Field label="Background Style">
              <div className="flex gap-3">
                {(["DARK", "LIGHT", "IMAGE"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setBgStyle(s)}
                    className="flex-1 py-2.5 rounded border text-sm transition-all"
                    style={{
                      borderColor: bgStyle === s ? primaryColor : "#e7e5e4",
                      backgroundColor:
                        bgStyle === s ? `${primaryColor}11` : "white",
                      color: bgStyle === s ? primaryColor : "#78716c",
                      fontFamily: fontBody,
                    }}
                  >
                    {s.charAt(0) + s.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </Field>

            <Row>
              <Field label="Display Font">
                <select
                  className={inputCls}
                  value={fontDisplay}
                  onChange={(e) => setFontDisplay(e.target.value)}
                >
                  {FONT_DISPLAY_OPTIONS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Body Font">
                <select
                  className={inputCls}
                  value={fontBody}
                  onChange={(e) => setFontBody(e.target.value)}
                >
                  {FONT_BODY_OPTIONS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </Field>
            </Row>
          </div>

          {/* Live preview */}
          <div className="rounded overflow-hidden border border-stone-200">
            <div
              className="px-8 py-12 text-center"
              style={{ backgroundColor: accentColor }}
            >
              <p
                style={{
                  fontFamily: fontBody,
                  color: primaryColor,
                  fontSize: "0.65rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  marginBottom: "0.75rem",
                }}
              >
                You are cordially invited
              </p>
              <p
                style={{
                  fontFamily: fontDisplay,
                  color: bgStyle !== "LIGHT" ? "#faf7ef" : "#1a1a1a",
                  fontSize: "2.5rem",
                  fontWeight: 400,
                  lineHeight: 1.1,
                }}
              >
                {coupleNames || "Names Here"}
              </p>
              <p
                style={{
                  fontFamily: fontDisplay,
                  color: primaryColor,
                  fontSize: "1.1rem",
                  fontStyle: "italic",
                  marginTop: "0.5rem",
                }}
              >
                Fifty Years Together
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                  marginTop: "1.25rem",
                }}
              >
                <div
                  style={{
                    height: "1px",
                    width: "3rem",
                    backgroundColor: primaryColor,
                    opacity: 0.5,
                  }}
                />
                <span
                  style={{
                    fontFamily: fontBody,
                    fontSize: "0.6rem",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: primaryColor,
                  }}
                >
                  Golden Anniversary
                </span>
                <div
                  style={{
                    height: "1px",
                    width: "3rem",
                    backgroundColor: primaryColor,
                    opacity: 0.5,
                  }}
                />
              </div>
            </div>
            <div className="px-8 py-4 bg-white text-center border-t border-stone-100">
              <p
                style={{
                  fontFamily: fontBody,
                  color: "#888",
                  fontSize: "0.75rem",
                }}
              >
                {venue || "Venue"} · {date || "Date"} · {time}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── PROGRAM TAB ─────────────────────────────────────────────────────── */}
      {tab === "program" && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-100 rounded px-4 py-3">
            <p
              className="text-amber-700 text-xs leading-relaxed"
              style={{ fontFamily: fontBody }}
            >
              Add the moments of your event in order. Each will appear as a
              timeline on the guest invitation with a matching icon.
            </p>
          </div>
          <div className="bg-white border border-stone-200 rounded p-6">
            <ProgramEditor
              items={programItems}
              onChange={setProgramItems}
              primaryColor={primaryColor}
              fontBody={fontBody}
            />
          </div>

          {/* Mini preview */}
          {programItems.length > 0 && (
            <div className="bg-white border border-stone-200 rounded p-6">
              <p
                className="text-stone-400 text-xs uppercase tracking-widest mb-4"
                style={{ fontFamily: fontBody }}
              >
                Preview
              </p>
              <div className="space-y-4 relative">
                <div
                  className="absolute left-[1.15rem] top-2 bottom-2 w-px"
                  style={{ backgroundColor: primaryColor, opacity: 0.15 }}
                />
                {programItems.map((item) => (
                  <div key={item.id} className="flex gap-4 items-start">
                    <div
                      className="relative z-10 flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs"
                      style={{
                        backgroundColor: `${primaryColor}18`,
                        border: `1.5px solid ${primaryColor}44`,
                        color: primaryColor,
                        fontFamily: fontBody,
                      }}
                    >
                      ✦
                    </div>
                    <div className="pt-1.5">
                      <span
                        className="text-xs font-semibold mr-2"
                        style={{ color: primaryColor, fontFamily: fontBody }}
                      >
                        {item.time}
                      </span>
                      <span
                        className="text-stone-700 text-sm"
                        style={{ fontFamily: fontBody }}
                      >
                        {item.label || "—"}
                      </span>
                      {item.notes && (
                        <p
                          className="text-stone-400 text-xs mt-0.5"
                          style={{ fontFamily: fontBody }}
                        >
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── RSVP TAB ────────────────────────────────────────────────────────── */}
      {tab === "rsvp" && (
        <div className="bg-white border border-stone-200 rounded p-6 space-y-6">
          <p
            className="text-stone-500 text-sm"
            style={{ fontFamily: fontBody }}
          >
            Choose which fields appear on the guest RSVP form. Hidden fields
            won't be shown to guests and their data won't be collected.
          </p>

          <div className="space-y-4">
            {(
              [
                {
                  key: "companions" as const,
                  label: "Companions / Plus-ones",
                  desc: "Allow guests to add extra attendees.",
                },
                {
                  key: "dietary" as const,
                  label: "Dietary restrictions",
                  desc: "Collect food allergy and preference info.",
                },
                {
                  key: "transport" as const,
                  label: "Transport / logistics notes",
                  desc: "Let guests flag parking, travel, or accessibility needs.",
                },
                {
                  key: "message" as const,
                  label: "Message to the couple",
                  desc: "Optional personal message from the guest.",
                },
              ] as const
            ).map(({ key, label, desc }) => (
              <label
                key={key}
                className="flex items-start gap-4 cursor-pointer group"
              >
                {/* Toggle */}
                <div className="relative flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={rsvpFields[key]}
                    onChange={() => toggleRsvpField(key)}
                  />
                  <div
                    className="w-10 h-6 rounded-full transition-colors"
                    style={{
                      backgroundColor: rsvpFields[key]
                        ? primaryColor
                        : "#d6d3d1",
                    }}
                  />
                  <div
                    className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm"
                    style={{
                      transform: rsvpFields[key]
                        ? "translateX(1rem)"
                        : "translateX(0)",
                    }}
                  />
                </div>
                {/* Label */}
                <div>
                  <p
                    className="text-stone-700 text-sm font-medium"
                    style={{ fontFamily: fontBody }}
                  >
                    {label}
                  </p>
                  <p
                    className="text-stone-400 text-xs mt-0.5"
                    style={{ fontFamily: fontBody }}
                  >
                    {desc}
                  </p>
                </div>
              </label>
            ))}
          </div>

          {/* Mini preview of the form */}
          <div className="border border-stone-100 rounded p-5 bg-stone-50 space-y-3 mt-2">
            <p
              className="text-stone-400 text-xs uppercase tracking-widest mb-2"
              style={{ fontFamily: fontBody }}
            >
              Form preview
            </p>
            <div
              className="text-xs text-stone-500 space-y-2"
              style={{ fontFamily: fontBody }}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${true ? "bg-emerald-400" : "bg-stone-200"}`}
                />
                Attending / Not attending toggle — always shown
              </div>
              {rsvpFields.companions && (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Companions field
                </div>
              )}
              {rsvpFields.dietary && (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Dietary restrictions
                </div>
              )}
              {rsvpFields.transport && (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Transport notes
                </div>
              )}
              {rsvpFields.message && (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Message to the couple
                </div>
              )}
              {!rsvpFields.companions &&
                !rsvpFields.dietary &&
                !rsvpFields.transport &&
                !rsvpFields.message && (
                  <div className="flex items-center gap-2 text-amber-600">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Only the attending toggle will be shown
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* ── Save bar ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 pt-2">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="px-8 py-3 rounded text-white text-sm tracking-widest uppercase transition-all disabled:opacity-50"
          style={{ backgroundColor: primaryColor, fontFamily: fontBody }}
        >
          {isPending ? "Saving…" : "Save Changes"}
        </button>
        {saved && (
          <span
            className="text-sm text-emerald-600"
            style={{ fontFamily: fontBody }}
          >
            ✓ Saved
          </span>
        )}
        {error && (
          <span
            className="text-sm text-red-500"
            style={{ fontFamily: fontBody }}
          >
            {error}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Layout helpers ───────────────────────────────────────────────────────────
function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-4">{children}</div>;
}
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-stone-500 text-xs font-medium mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}
