"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent, createEventAdmin } from "@/actions/events";

const FONT_DISPLAY_OPTIONS = [
  "Cormorant Garamond",
  "Playfair Display",
  "EB Garamond",
  "Libre Baskerville",
];
const FONT_BODY_OPTIONS = ["Jost", "Lato", "DM Sans", "Nunito"];

export default function NewEventPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Event fields
  const [title, setTitle] = useState("");
  const [coupleNames, setCoupleNames] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("6:00 PM");
  const [venue, setVenue] = useState("");
  const [address, setAddress] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [dressCode, setDressCode] = useState("");
  const [message, setMessage] = useState("");
  const [rules, setRules] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportPhone, setSupportPhone] = useState("");

  // Branding
  const [primaryColor, setPrimaryColor] = useState("#c8890e");
  const [accentColor, setAccentColor] = useState("#0e0b07");
  const [bgStyle, setBgStyle] = useState<"DARK" | "LIGHT" | "IMAGE">("DARK");
  const [fontDisplay, setFontDisplay] = useState("Cormorant Garamond");
  const [fontBody, setFontBody] = useState("Jost");

  // First admin
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const event = await createEvent({
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
      if (adminEmail && adminName && adminPassword) {
        await createEventAdmin({
          eventId: event.id,
          name: adminName,
          email: adminEmail,
          password: adminPassword,
        });
      }
      router.push("/super/dashboard");
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
      setSaving(false);
    }
  }

  const inputCls =
    "w-full px-4 py-2.5 border border-stone-200 rounded-sm font-body text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200";
  const labelCls = "block font-body text-stone-600 text-sm font-medium mb-1.5";

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 px-8 py-5">
        <h1
          className="font-display text-2xl text-stone-800"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Create New Event
        </h1>
      </header>

      <main className="px-8 py-10 max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Event details */}
          <Section title="Event Details">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Event Title *" className="col-span-2">
                <input
                  required
                  className={inputCls}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Golden Anniversary Celebration"
                />
              </Field>
              <Field label="Couple Names *">
                <input
                  required
                  className={inputCls}
                  value={coupleNames}
                  onChange={(e) => setCoupleNames(e.target.value)}
                  placeholder="João & Maria"
                />
              </Field>
              <Field label="Date *">
                <input
                  required
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
              <Field label="Venue *">
                <input
                  required
                  className={inputCls}
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="Quinta das Flores"
                />
              </Field>
              <Field label="Address *" className="col-span-2">
                <input
                  required
                  className={inputCls}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rua das Rosas 123, Lisboa"
                />
              </Field>
              <Field label="Google Maps URL" className="col-span-2">
                <input
                  className={inputCls}
                  value={mapUrl}
                  onChange={(e) => setMapUrl(e.target.value)}
                  placeholder="https://maps.google.com/..."
                />
              </Field>
              <Field label="Dress Code" className="col-span-2">
                <input
                  className={inputCls}
                  value={dressCode}
                  onChange={(e) => setDressCode(e.target.value)}
                  placeholder="Black tie optional"
                />
              </Field>
              <Field label="Invitation Message" className="col-span-2">
                <textarea
                  rows={4}
                  className={inputCls}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="The message guests will read on their invitation…"
                />
              </Field>
              <Field label="Rules / Good to Know" className="col-span-2">
                <textarea
                  rows={4}
                  className={inputCls}
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
                  placeholder="• One rule per line"
                />
              </Field>
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
            </div>
          </Section>

          {/* Branding */}
          <Section title="Branding">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Primary Colour">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded border border-stone-200 cursor-pointer"
                  />
                  <input
                    className={inputCls}
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    placeholder="#c8890e"
                  />
                </div>
              </Field>
              <Field label="Accent / Background Colour">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-10 h-10 rounded border border-stone-200 cursor-pointer"
                  />
                  <input
                    className={inputCls}
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    placeholder="#0e0b07"
                  />
                </div>
              </Field>
              <Field label="Hero Background Style">
                <select
                  className={inputCls}
                  value={bgStyle}
                  onChange={(e) => setBgStyle(e.target.value as any)}
                >
                  <option value="DARK">Dark (coloured background)</option>
                  <option value="LIGHT">Light (white / cream)</option>
                  <option value="IMAGE">Image (hero photo)</option>
                </select>
              </Field>
              <Field label="Display Font (headings)">
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
            </div>

            {/* Live mini-preview */}
            <div className="mt-6 rounded-sm overflow-hidden border border-stone-200">
              <div
                className="px-6 py-8 text-center"
                style={{ backgroundColor: accentColor }}
              >
                <p
                  style={{
                    fontFamily: fontDisplay,
                    color: primaryColor,
                    fontSize: "1.5rem",
                  }}
                >
                  {coupleNames || "Names Here"}
                </p>
                <p
                  style={{
                    fontFamily: fontBody,
                    color: "#ccc",
                    fontSize: "0.75rem",
                    marginTop: "0.5rem",
                    letterSpacing: "0.2em",
                  }}
                >
                  GOLDEN ANNIVERSARY
                </p>
              </div>
              <div className="px-6 py-4 bg-white text-center">
                <p
                  style={{
                    fontFamily: fontBody,
                    color: "#555",
                    fontSize: "0.8rem",
                  }}
                >
                  {venue || "Venue"} · {date || "Date"}
                </p>
              </div>
            </div>
          </Section>

          {/* First admin */}
          <Section
            title="Event Organizer (Admin Account)"
            subtitle="Creates a login for the people managing this event. You can add more later."
          >
            <div className="grid grid-cols-2 gap-4">
              <Field label="Full Name">
                <input
                  className={inputCls}
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="Filipa Santos"
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  className={inputCls}
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="organizer@event.com"
                />
              </Field>
              <Field label="Temporary Password" className="col-span-2">
                <input
                  type="password"
                  className={inputCls}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="They should change this after first login"
                />
              </Field>
            </div>
          </Section>

          {error && (
            <p className="font-body text-red-500 text-sm bg-red-50 border border-red-200 rounded-sm px-4 py-3">
              {error}
            </p>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-gold-600 hover:bg-gold-700 disabled:bg-stone-200 disabled:text-stone-400 text-white font-body text-sm tracking-widest uppercase rounded-sm transition-colors"
            >
              {saving ? "Creating…" : "Create Event"}
            </button>
            <a
              href="/super/dashboard"
              className="px-8 py-3 border border-stone-200 text-stone-500 font-body text-sm rounded-sm hover:border-stone-300 transition-colors"
            >
              Cancel
            </a>
          </div>
        </form>
      </main>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-6">
        <h2
          className="font-display text-xl text-stone-800"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="font-body text-stone-400 text-sm mt-1">{subtitle}</p>
        )}
      </div>
      <div className="bg-white border border-stone-200 rounded-sm p-6">
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block font-body text-stone-600 text-sm font-medium mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
