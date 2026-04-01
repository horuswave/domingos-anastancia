"use client";

import { useState } from "react";
import { createEventAdmin } from "@/actions/events";
import { useRouter } from "next/navigation";

export default function AddAdminForm({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputCls =
    "w-full px-4 py-2.5 border border-stone-200 rounded-sm font-body text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await createEventAdmin({ eventId, name, email, password: pass });
      setName("");
      setEmail("");
      setPass("");
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message ?? "Failed to add admin");
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="font-body text-sm text-gold-600 hover:text-gold-700"
      >
        + Add another admin
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-stone-200 rounded-sm p-5 space-y-4"
    >
      <p className="font-body text-stone-600 text-sm font-medium">
        New Event Admin
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-body text-xs text-stone-400 mb-1">
            Name
          </label>
          <input
            required
            className={inputCls}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-body text-xs text-stone-400 mb-1">
            Email
          </label>
          <input
            required
            type="email"
            className={inputCls}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="col-span-2">
          <label className="block font-body text-xs text-stone-400 mb-1">
            Temporary Password
          </label>
          <input
            required
            type="password"
            className={inputCls}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
        </div>
      </div>
      {error && <p className="font-body text-red-500 text-xs">{error}</p>}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 bg-gold-600 hover:bg-gold-700 text-white font-body text-xs tracking-widest uppercase rounded-sm disabled:bg-stone-200 disabled:text-stone-400"
        >
          {saving ? "Adding…" : "Add Admin"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-5 py-2 border border-stone-200 text-stone-500 font-body text-xs rounded-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
