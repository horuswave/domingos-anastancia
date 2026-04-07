"use client";

import { Plus, Trash2 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type GiftItemType = "ITEM" | "MONETARY";

export interface GiftItem {
  id: string;
  type: GiftItemType;
  name: string;
  store?: string;
  storeUrl?: string;
  note?: string;
  // Monetary-only
  currency?: string;
  suggestedAmount?: number;
  bankName?: string;
  bankAccountHolder?: string;
  bankIban?: string;
  bankReference?: string;
  mobileWalletProvider?: string;
  mobileWalletNumber?: string;
  mobileWalletHolderName?: string;
}

export type { GiftItem as GiftListItem };

// ─── Helpers ─────────────────────────────────────────────────────────────────

function newItem(): GiftItem {
  return {
    id: Math.random().toString(36).slice(2),
    type: "ITEM",
    name: "",
    store: "",
    storeUrl: "",
    note: "",
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  items: GiftItem[];
  onChange: (items: GiftItem[]) => void;
  primaryColor: string;
  fontBody: string;
}

export default function GiftListEditor({
  items,
  onChange,
  primaryColor,
  fontBody,
}: Props) {
  const inputCls =
    "w-full px-3 py-2 border border-stone-200 rounded text-sm focus:outline-none focus:border-stone-400 bg-white";

  function addItem() {
    onChange([...items, newItem()]);
  }

  function removeItem(id: string) {
    onChange(items.filter((i) => i.id !== id));
  }

  function update<K extends keyof GiftItem>(
    id: string,
    field: K,
    value: GiftItem[K],
  ) {
    onChange(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  }

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
          No gifts yet. Add your first item or payment option below.
        </p>
      )}

      {items.map((item, idx) => (
        <div
          key={item.id}
          className="border border-stone-200 rounded-lg p-4 bg-white space-y-3"
        >
          {/* ── Row 1: type toggle + reorder + delete ── */}
          <div className="flex gap-3 items-start">
            {/* Reorder */}
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

            {/* Type toggle */}
            <div className="flex gap-1 bg-stone-100 rounded p-0.5 flex-shrink-0">
              {(["ITEM", "MONETARY"] as GiftItemType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => update(item.id, "type", t)}
                  className="px-3 py-1.5 rounded text-xs transition-all"
                  style={{
                    fontFamily: fontBody,
                    backgroundColor: item.type === t ? "white" : "transparent",
                    color: item.type === t ? "#1a1a1a" : "#78716c",
                    boxShadow:
                      item.type === t ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                  }}
                >
                  {t === "ITEM" ? "🎁 Gift Item" : "💳 Money / Transfer"}
                </button>
              ))}
            </div>

            <div className="flex-1" />

            {/* Delete */}
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="text-stone-300 hover:text-red-400 transition-colors pt-1 flex-shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* ── Gift Item fields ── */}
          {item.type === "ITEM" && (
            <>
              <input
                type="text"
                placeholder="Gift name (e.g. Portuguese linen tablecloth set)"
                value={item.name}
                onChange={(e) => update(item.id, "name", e.target.value)}
                className={inputCls}
                style={{ fontFamily: fontBody }}
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Store / brand (optional)"
                  value={item.store ?? ""}
                  onChange={(e) => update(item.id, "store", e.target.value)}
                  className={inputCls}
                  style={{ fontFamily: fontBody }}
                />
                <input
                  type="url"
                  placeholder="Store URL (optional)"
                  value={item.storeUrl ?? ""}
                  onChange={(e) => update(item.id, "storeUrl", e.target.value)}
                  className={inputCls}
                  style={{ fontFamily: fontBody }}
                />
              </div>

              <input
                type="text"
                placeholder="Note for guests (optional, e.g. size M or colour ivory)"
                value={item.note ?? ""}
                onChange={(e) => update(item.id, "note", e.target.value)}
                className={inputCls}
                style={{ fontFamily: fontBody, color: "#78716c" }}
              />
            </>
          )}

          {/* ── Monetary / Transfer fields ── */}
          {item.type === "MONETARY" && (
            <>
              <input
                type="text"
                placeholder="Label (e.g. Honeymoon fund, Home renovation contribution…)"
                value={item.name}
                onChange={(e) => update(item.id, "name", e.target.value)}
                className={inputCls}
                style={{ fontFamily: fontBody }}
              />

              <input
                type="text"
                placeholder="Note for guests (optional, e.g. any amount is welcome)"
                value={item.note ?? ""}
                onChange={(e) => update(item.id, "note", e.target.value)}
                className={inputCls}
                style={{ fontFamily: fontBody, color: "#78716c" }}
              />

              {/* Suggested amount */}
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Currency (e.g. EUR)"
                  value={item.currency ?? ""}
                  onChange={(e) => update(item.id, "currency", e.target.value)}
                  className={inputCls}
                  style={{ fontFamily: fontBody }}
                />
                <input
                  type="number"
                  min={0}
                  placeholder="Suggested amount"
                  value={item.suggestedAmount ?? ""}
                  onChange={(e) =>
                    update(
                      item.id,
                      "suggestedAmount",
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                  className={`${inputCls} col-span-2`}
                  style={{ fontFamily: fontBody }}
                />
              </div>

              {/* Bank transfer */}
              <div className="rounded border border-stone-100 bg-stone-50 p-3 space-y-2">
                <p
                  className="text-[11px] uppercase tracking-widest text-stone-400"
                  style={{ fontFamily: fontBody }}
                >
                  Bank transfer (optional)
                </p>
                <input
                  type="text"
                  placeholder="Account holder name"
                  value={item.bankAccountHolder ?? ""}
                  onChange={(e) =>
                    update(item.id, "bankAccountHolder", e.target.value)
                  }
                  className={inputCls}
                  style={{ fontFamily: fontBody }}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Bank name"
                    value={item.bankName ?? ""}
                    onChange={(e) =>
                      update(item.id, "bankName", e.target.value)
                    }
                    className={inputCls}
                    style={{ fontFamily: fontBody }}
                  />
                  <input
                    type="text"
                    placeholder="IBAN / Account number"
                    value={item.bankIban ?? ""}
                    onChange={(e) =>
                      update(item.id, "bankIban", e.target.value)
                    }
                    className={inputCls}
                    style={{ fontFamily: fontBody }}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Payment reference (optional)"
                  value={item.bankReference ?? ""}
                  onChange={(e) =>
                    update(item.id, "bankReference", e.target.value)
                  }
                  className={inputCls}
                  style={{ fontFamily: fontBody }}
                />
              </div>

              {/* Mobile wallet */}
              <div className="rounded border border-stone-100 bg-stone-50 p-3 space-y-2">
                <p
                  className="text-[11px] uppercase tracking-widest text-stone-400"
                  style={{ fontFamily: fontBody }}
                >
                  Mobile wallet / M-Pesa / PayPal (optional)
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Provider (e.g. M-Pesa, PayPal)"
                    value={item.mobileWalletProvider ?? ""}
                    onChange={(e) =>
                      update(item.id, "mobileWalletProvider", e.target.value)
                    }
                    className={inputCls}
                    style={{ fontFamily: fontBody }}
                  />
                  <input
                    type="text"
                    placeholder="Number / username / email"
                    value={item.mobileWalletNumber ?? ""}
                    onChange={(e) =>
                      update(item.id, "mobileWalletNumber", e.target.value)
                    }
                    className={inputCls}
                    style={{ fontFamily: fontBody }}
                  />
                  <input
                    type="text"
                    placeholder="Account holder name (optional)"
                    value={item.mobileWalletHolderName ?? ""}
                    onChange={(e) =>
                      update(item.id, "mobileWalletHolderName", e.target.value)
                    }
                    className={inputCls}
                    style={{ fontFamily: fontBody }}
                  />

                </div>
              </div>
            </>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-2 text-sm mt-2"
        style={{ color: primaryColor, fontFamily: fontBody }}
      >
        <Plus className="w-4 h-4" /> Add gift or payment option
      </button>
    </div>
  );
}
