"use client";

import { useState, useTransition } from "react";
import { superUpdateEvent } from "@/actions/events";
import { useRouter } from "next/navigation";

const FONT_DISPLAY_OPTIONS = [
  "Cormorant Garamond",
  "Playfair Display",
  "EB Garamond",
  "Libre Baskerville",
];
const FONT_BODY_OPTIONS = ["Jost", "Lato", "DM Sans", "Nunito"];

interface EventSnapshot {
  id: string;
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
}

export default function SuperEventTabs({ event }: { event: EventSnapshot }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState<"details" | "branding">("details");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(event.title);
  const [coupleNames, setCoupleNames] = useState(event.coupleNames);
  const [date, setDate] = useState(
    new Date(event.date).toISOString().split("T")[0],
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
  const [primaryColor, setPrimaryColor] = useState(event.primaryColor);
  const [accentColor, setAccentColor] = useState(event.accentColor);
  const [bgStyle, setBgStyle] = useState<"DARK" | "LIGHT" | "IMAGE">(
    event.backgroundStyle,
  );
  const [fontDisplay, setFontDisplay] = useState(event.fontDisplay);
  const [fontBody, setFontBody] = useState(event.fontBody);

  function handleSave() {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      try {
        await superUpdateEvent(event.id, {
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
        });
        setSaved(true);
        router.refresh();
        setTimeout(() => setSaved(false), 3000);
      } catch (err: any) {
        setError(err.message ?? "Failed to save");
      }
    });
  }

  const inputCls =
    "w-full px-4 py-2.5 border border-stone-200 rounded text-sm focus:outline-none focus:border-stone-400 bg-white";
  const font = event.fontBody;

  return (
    <div className="space-y-5">
      {/* Tab bar */}
      <div className="flex gap-1 bg-stone-100 rounded p-1 w-fit">
        {(["details", "branding"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-5 py-2 rounded text-sm transition-all capitalize"
            style={{
              fontFamily: font,
              backgroundColor: tab === t ? "white" : "transparent",
              color: tab === t ? "#1a1a1a" : "#78716c",
              boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Details tab */}
      {tab === "details" && (
        <div className="bg-white border border-stone-200 rounded p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="block text-xs text-stone-400 uppercase tracking-wide mb-1.5"
                style={{ fontFamily: font }}
              >
                Event Title
              </label>
              <input
                className={inputCls}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ fontFamily: font }}
              />
            </div>
            <div>
              <label
                className="block text-xs text-stone-400 uppercase tracking-wide mb-1.5"
                style={{ fontFamily: font }}
              >
                Couple Names
              </label>
              <input
                className={inputCls}
                value={coupleNames}
                onChange={(e) => setCoupleNames(e.target.value)}
                style={{ fontFamily: font }}
              />
            </div>
            <div>
              <label
                className="block text-xs text-stone-400 uppercase tracking-wide mb-1.5"
                style={{ fontFamily: font }}
              >
                Date
              </label>
              <input
                type="date"
                className={inputCls}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ fontFamily: font }}
              />
            </div>
            <div>
              <label
                className="block text-xs text-stone-400 uppercase tracking-wide mb-1.5"
                style={{ fontFamily: font }}
              >
                Time
              </label>
              <input
                className={inputCls}
                value={time}
                onChange={(e) => setTime(e.target.value)}
                style={{ fontFamily: font }}
              />
            </div>
            <div>
              <label
                className="block text-xs text-stone-400 uppercase tracking-wide mb-1.5"
                style={{ fontFamily: font }}
              >
                Venue
              </label>
              <input
                className={inputCls}
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                style={{ fontFamily: font }}
              />
            </div>
            <div>
              <label
                className="block text-xs text-stone-400 uppercase tracking-wide mb-1.5"
                style={{ fontFamily: font }}
              >
                Address
              </label>
              <input
                className={inputCls}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{ fontFamily: font }}
              />
            </div>
            <div className="col-span-2">
              <label
                className="block text-xs text-stone-400 uppercase tracking-wide mb-1.5"
                style={{ fontFamily: font }}
              >
                Google Maps URL
              </label>
              <input
                className={inputCls}
                value={mapUrl}
                onChange={(e) => setMapUrl(e.target.value)}
                style={{ fontFamily: font }}
              />
            </div>
            <div className="col-span-2">
              <label
                className="block text-xs text-stone-400 uppercase tracking-wide mb-1.5"
                style={{ fontFamily: font }}
              >
                Dress Code
              </label>
              <input
                className={inputCls}
                value={dressCode}
                onChange={(e) => setDressCode(e.target.value)}
                style={{ fontFamily: font }}
              />
            </div>
            <div className="col-span-2">
              <label
                className="block text-xs text-stone-400 uppercase tracking-wide mb-1.5"
                style={{ fontFamily: font }}
              >
                Invitation Message
              </label>
              <textarea
                rows={4}
                className={inputCls}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ fontFamily: font, resize: "vertical" }}
              />
            </div>
            <div className="col-span-2">
              <label
                className="block text-xs text-stone-400 uppercase tracking-wide mb-1.5"
                style={{ fontFamily: font }}
              >
                Rules / Good to Know
              </label>
              <textarea
                rows={4}
                className={inputCls}
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                style={{ fontFamily: font, resize: "vertical" }}
              />
            </div>
            <div>
              <label
                className="block text-xs text-stone-400 uppercase tracking-wide mb-1.5"
                style={{ fontFamily: font }}
              >
                Support Email
              </label>
              <input
                type="email"
                className={inputCls}
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                style={{ fontFamily: font }}
              />
            </div>
            <div>
              <label
                className="block text-xs text-stone-400 uppercase tracking-wide mb-1.5"
                style={{ fontFamily: font }}
              >
                Support Phone
              </label>
              <input
                className={inputCls}
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                style={{ fontFamily: font }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Branding tab */}
      {tab === "branding" && (
        <div className="space-y-4">
          <div className="bg-white border border-stone-200 rounded p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-xs text-stone-400 uppercase tracking-wide mb-1.5"
                  style={{ fontFamily: font }}
                >
                  Primary Colour
                </label>
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
                    style={{ fontFamily: font }}
                  />
                </div>
              </div>
              <div>
                <label
                  className="block text-xs text-stone-400 uppercase tracking-wide mb-1.5"
                  style={{ fontFamily: font }}
                >
                  Accent Colour
                </label>
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
                    style={{ fontFamily: font }}
                  />
                </div>
              </div>
              <div>
                <label
                  className="block text-xs text-stone-400 uppercase tracking-wide mb-1.5"
                  style={{ fontFamily: font }}
                >
                  Background Style
                </label>
                <div className="flex gap-2">
                  {(["DARK", "LIGHT", "IMAGE"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setBgStyle(s)}
                      className="flex-1 py-2 rounded border text-xs transition-all"
                      style={{
                        borderColor: bgStyle === s ? primaryColor : "#e7e5e4",
                        backgroundColor:
                          bgStyle === s ? `${primaryColor}11` : "white",
                        color: bgStyle === s ? primaryColor : "#78716c",
                        fontFamily: font,
                      }}
                    >
                      {s.charAt(0) + s.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label
                  className="block text-xs text-stone-400 uppercase tracking-wide mb-1.5"
                  style={{ fontFamily: font }}
                >
                  Display Font
                </label>
                <select
                  className={inputCls}
                  value={fontDisplay}
                  onChange={(e) => setFontDisplay(e.target.value)}
                  style={{ fontFamily: font }}
                >
                  {FONT_DISPLAY_OPTIONS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  className="block text-xs text-stone-400 uppercase tracking-wide mb-1.5"
                  style={{ fontFamily: font }}
                >
                  Body Font
                </label>
                <select
                  className={inputCls}
                  value={fontBody}
                  onChange={(e) => setFontBody(e.target.value)}
                  style={{ fontFamily: font }}
                >
                  {FONT_BODY_OPTIONS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Live preview */}
          <div className="rounded overflow-hidden border border-stone-200">
            <div
              className="px-8 py-10 text-center"
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
                  fontSize: "2.25rem",
                  fontWeight: 400,
                }}
              >
                {coupleNames || "Names Here"}
              </p>
              <p
                style={{
                  fontFamily: fontDisplay,
                  color: primaryColor,
                  fontStyle: "italic",
                  fontSize: "1rem",
                  marginTop: "0.5rem",
                }}
              >
                Fifty Years Together
              </p>
            </div>
            <div className="px-8 py-3 bg-white text-center">
              <p
                style={{
                  fontFamily: fontBody,
                  color: "#888",
                  fontSize: "0.75rem",
                }}
              >
                {venue || "Venue"} · {date} · {time}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Save bar */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="px-8 py-3 rounded text-white text-sm tracking-widest uppercase transition-all disabled:opacity-50"
          style={{ backgroundColor: primaryColor, fontFamily: font }}
        >
          {isPending ? "Saving…" : "Save Changes"}
        </button>
        {saved && (
          <span
            className="text-sm text-emerald-600"
            style={{ fontFamily: font }}
          >
            ✓ Saved
          </span>
        )}
        {error && (
          <span className="text-sm text-red-500" style={{ fontFamily: font }}>
            {error}
          </span>
        )}
      </div>
    </div>
  );
}
