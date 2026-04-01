"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import type { ProgramItem, ProgramItemType } from "../../../components/invitation/ProgramSection";

// Re-export so SettingsForm only needs one import
export type { ProgramItem, ProgramItemType };

// ─── Catalogue of available event types ───────────────────────────────────────
export const PROGRAM_TYPE_OPTIONS: {
  value: ProgramItemType;
  label: string;
  category: "General" | "Wedding" | "Anniversary" | "Party";
}[] = [
  // General
  { value: "RECEPTION", label: "Reception / Welcome", category: "General" },
  { value: "COCKTAIL", label: "Cocktail Hour", category: "General" },
  { value: "DINNER", label: "Dinner / Banquet", category: "General" },
  { value: "SPEECHES", label: "Speeches / Toasts", category: "General" },
  { value: "CAKE", label: "Cake Cutting", category: "General" },
  { value: "MUSIC", label: "Live Music / DJ", category: "General" },
  { value: "PHOTO", label: "Photo Session", category: "General" },
  { value: "FIREWORKS", label: "Fireworks", category: "General" },
  { value: "TRANSPORT", label: "Transport / Shuttle", category: "General" },
  { value: "GAMES", label: "Games / Activities", category: "General" },
  { value: "CUSTOM", label: "Custom moment…", category: "General" },
  // Wedding specific
  { value: "CEREMONY", label: "Wedding Ceremony", category: "Wedding" },
  {
    value: "BLESSING",
    label: "Blessing / Religious rite",
    category: "Wedding",
  },
  { value: "FIRST_DANCE", label: "First Dance", category: "Wedding" },
  // Anniversary
  { value: "BRUNCH", label: "Brunch / Morning after", category: "Anniversary" },
];

function newItem(): ProgramItem {
  return {
    id: Math.random().toString(36).slice(2),
    type: "RECEPTION",
    label: "",
    time: "",
    notes: "",
  };
}

interface Props {
  items: ProgramItem[];
  onChange: (items: ProgramItem[]) => void;
  primaryColor: string;
  fontBody: string;
}

export default function ProgramEditor({
  items,
  onChange,
  primaryColor,
  fontBody,
}: Props) {
  const inputCls =
    "w-full px-3 py-2 border border-stone-200 rounded text-sm focus:outline-none focus:border-stone-400 bg-white";

  // Group options by category for the <select>
  const grouped = PROGRAM_TYPE_OPTIONS.reduce<
    Record<string, typeof PROGRAM_TYPE_OPTIONS>
  >((acc, o) => {
    (acc[o.category] = acc[o.category] ?? []).push(o);
    return acc;
  }, {});

  function addItem() {
    onChange([...items, newItem()]);
  }

  function removeItem(id: string) {
    onChange(items.filter((i) => i.id !== id));
  }

  function update<K extends keyof ProgramItem>(
    id: string,
    field: K,
    value: ProgramItem[K],
  ) {
    onChange(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  }

  // Simple move up/down (drag-and-drop can be added later)
  function move(id: string, dir: -1 | 1) {
    const idx = items.findIndex((i) => i.id === id);
    if (idx < 0) return;
    const next = idx + dir;
    if (next < 0 || next >= items.length) return;
    const copy = [...items];
    [copy[idx], copy[next]] = [copy[next], copy[idx]];
    onChange(copy);
  }

  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <p
          className="text-stone-400 text-sm text-center py-8 border border-dashed border-stone-200 rounded"
          style={{ fontFamily: fontBody }}
        >
          No program items yet. Add your first moment below.
        </p>
      )}

      {items.map((item, idx) => (
        <div
          key={item.id}
          className="border border-stone-200 rounded p-4 bg-white space-y-3"
        >
          {/* Row 1: type + time + reorder + delete */}
          <div className="flex gap-3 items-start">
            {/* Reorder buttons */}
            <div className="flex flex-col gap-1 pt-1 flex-shrink-0">
              <button
                type="button"
                onClick={() => move(item.id, -1)}
                disabled={idx === 0}
                className="text-stone-300 hover:text-stone-500 disabled:opacity-20 transition-colors"
                title="Move up"
              >
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                >
                  <path d="M18 15l-6-6-6 6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => move(item.id, 1)}
                disabled={idx === items.length - 1}
                className="text-stone-300 hover:text-stone-500 disabled:opacity-20 transition-colors"
                title="Move down"
              >
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            </div>

            {/* Type select */}
            <select
              value={item.type}
              onChange={(e) =>
                update(item.id, "type", e.target.value as ProgramItemType)
              }
              className={`${inputCls} flex-1`}
              style={{ fontFamily: fontBody }}
            >
              {Object.entries(grouped).map(([cat, opts]) => (
                <optgroup key={cat} label={cat}>
                  {opts.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            {/* Time */}
            <input
              type="text"
              placeholder="e.g. 7:00 PM"
              value={item.time}
              onChange={(e) => update(item.id, "time", e.target.value)}
              className={`${inputCls} w-28 flex-shrink-0`}
              style={{ fontFamily: fontBody }}
            />

            {/* Delete */}
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="text-stone-300 hover:text-red-400 transition-colors pt-2 flex-shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Row 2: custom label */}
          <input
            type="text"
            placeholder="Label shown on the invitation (e.g. Welcome Drinks)"
            value={item.label}
            onChange={(e) => update(item.id, "label", e.target.value)}
            className={inputCls}
            style={{ fontFamily: fontBody }}
          />

          {/* Row 3: optional notes */}
          <input
            type="text"
            placeholder="Short note for guests (optional)"
            value={item.notes ?? ""}
            onChange={(e) => update(item.id, "notes", e.target.value)}
            className={inputCls}
            style={{ fontFamily: fontBody, color: "#78716c" }}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-2 text-sm mt-2"
        style={{ color: primaryColor, fontFamily: fontBody }}
      >
        <Plus className="w-4 h-4" /> Add program moment
      </button>
    </div>
  );
}
