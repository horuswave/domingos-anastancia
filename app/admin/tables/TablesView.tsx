"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createTable, updateTable, deleteTable } from "@/actions/tables";
import { assignTable } from "@/actions/guests";
import { Plus, Trash2, Pencil, Check, X, Users, Download } from "lucide-react";

interface Guest {
  id: string;
  primaryName: string;
  isVip: boolean;
  rsvp: { totalAttending: number } | null;
}

interface Table {
  id: string;
  name: string;
  capacity: number;
  notes: string | null;
  guests: Guest[];
}

interface Event {
  primaryColor: string;
  fontBody: string;
  fontDisplay: string;
}

// ─── Export helper ────────────────────────────────────────────────────────────

function getOccupancy(table: Table) {
  return table.guests.reduce((s, g) => s + (g.rsvp?.totalAttending ?? 1), 0);
}

async function exportTablesToDOCX(tables: Table[]) {
  // Dynamically import docx so it's only bundled client-side
  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    AlignmentType,
    BorderStyle,
    HeadingLevel,
  } = await import("docx");

  const divider = new Paragraph({
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC", space: 1 },
    },
    spacing: { after: 0 },
    children: [],
  });

  const children: InstanceType<typeof Paragraph>[] = [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: "Distribuição de Mesas",
          bold: true,
          size: 36,
          font: "Arial",
        }),
      ],
    }),
  ];

  tables.forEach((table, idx) => {
    const occ = getOccupancy(table);
    const empty = table.capacity - occ;

    // Table name + occupancy
    children.push(
      new Paragraph({
        spacing: { before: idx === 0 ? 0 : 440, after: 80 },
        children: [
          new TextRun({
            text: table.name,
            bold: true,
            size: 28,
            font: "Arial",
          }),
          new TextRun({
            text: `  —  ${occ} / ${table.capacity} lugares`,
            size: 22,
            font: "Arial",
            color: "666666",
          }),
        ],
      }),
    );

    // Optional table notes
    if (table.notes) {
      children.push(
        new Paragraph({
          spacing: { before: 0, after: 80 },
          indent: { left: 360 },
          children: [
            new TextRun({
              text: table.notes,
              italics: true,
              size: 20,
              font: "Arial",
              color: "888888",
            }),
          ],
        }),
      );
    }

    // Guest list
    if (table.guests.length === 0) {
      children.push(
        new Paragraph({
          spacing: { before: 60, after: 60 },
          indent: { left: 360 },
          children: [
            new TextRun({
              text: "Sem convidados atribuídos",
              italics: true,
              size: 20,
              font: "Arial",
              color: "AAAAAA",
            }),
          ],
        }),
      );
    } else {
      table.guests.forEach((g) => {
        const seats = g.rsvp?.totalAttending ?? 1;
        children.push(
          new Paragraph({
            spacing: { before: 60, after: 60 },
            indent: { left: 360 },
            children: [
              new TextRun({
                text: "• ",
                size: 22,
                font: "Arial",
                color: "999999",
              }),
              new TextRun({ text: g.primaryName, size: 22, font: "Arial" }),
              ...(seats > 1
                ? [
                    new TextRun({
                      text: `  (${seats} pessoas)`,
                      size: 20,
                      font: "Arial",
                      color: "999999",
                    }),
                  ]
                : []),
            ],
          }),
        );
      });
    }

    // "Falta X nesta mesa" note
    if (empty > 0) {
      children.push(
        new Paragraph({
          spacing: { before: 140, after: 60 },
          indent: { left: 360 },
          children: [
            new TextRun({
              text: `Falta ${empty} ${empty === 1 ? "lugar" : "lugares"} nesta mesa`,
              italics: true,
              size: 20,
              font: "Arial",
              color: "B45309",
            }),
          ],
        }),
      );
    } else {
      children.push(
        new Paragraph({
          spacing: { before: 140, after: 60 },
          indent: { left: 360 },
          children: [
            new TextRun({
              text: "Mesa completa",
              italics: true,
              size: 20,
              font: "Arial",
              color: "059669",
            }),
          ],
        }),
      );
    }

    // Divider between tables
    if (idx < tables.length - 1) {
      children.push(divider);
    }
  });

  const doc = new Document({
    styles: {
      default: { document: { run: { font: "Arial", size: 22 } } },
      paragraphStyles: [
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { size: 36, bold: true, font: "Arial", color: "1C1917" },
          paragraph: {
            spacing: { before: 240, after: 240 },
            outlineLevel: 0,
          },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 }, // A4
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const blob = new Blob([new Uint8Array(buffer)], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mesas.docx";
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function TablesView({
  tables,
  unassigned,
  event,
}: {
  tables: Table[];
  unassigned: Guest[];
  event: Event | null;
}) {
  const router = useRouter();
  const primary = event?.primaryColor ?? "#c8890e";
  const font = event?.fontBody ?? "system-ui";

  const [isPending, startTransition] = useTransition();
  const [showNewTable, setShowNewTable] = useState(false);
  const [editingTable, setEditingTable] = useState<string | null>(null);
  const [assigningGuest, setAssigningGuest] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // New table form
  const [newName, setNewName] = useState("");
  const [newCapacity, setNewCapacity] = useState(8);
  const [newNotes, setNewNotes] = useState("");

  // Edit table form
  const [editName, setEditName] = useState("");
  const [editCapacity, setEditCapacity] = useState(8);
  const [editNotes, setEditNotes] = useState("");

  function occupancyColor(table: Table) {
    const occ = getOccupancy(table);
    const pct = occ / table.capacity;
    if (pct >= 1) return "#ef4444";
    if (pct >= 0.8) return "#f59e0b";
    return "#10b981";
  }

  function handleCreateTable() {
    if (!newName.trim()) return;
    startTransition(async () => {
      await createTable({
        name: newName.trim(),
        capacity: newCapacity,
        notes: newNotes || undefined,
      });
      setNewName("");
      setNewCapacity(8);
      setNewNotes("");
      setShowNewTable(false);
      router.refresh();
    });
  }

  function startEdit(table: Table) {
    setEditingTable(table.id);
    setEditName(table.name);
    setEditCapacity(table.capacity);
    setEditNotes(table.notes ?? "");
  }

  function handleUpdateTable(id: string) {
    startTransition(async () => {
      await updateTable(id, {
        name: editName,
        capacity: editCapacity,
        notes: editNotes || undefined,
      });
      setEditingTable(null);
      router.refresh();
    });
  }

  function handleDeleteTable(id: string, name: string) {
    if (!confirm(`Delete "${name}"? Guests will be unassigned.`)) return;
    startTransition(async () => {
      await deleteTable(id);
      router.refresh();
    });
  }

  function handleAssign(guestId: string, tableId: string | null) {
    setAssigningGuest(guestId);
    startTransition(async () => {
      await assignTable(guestId, tableId);
      setAssigningGuest(null);
      router.refresh();
    });
  }

  async function handleExport() {
    setIsExporting(true);
    try {
      await exportTablesToDOCX(tables);
    } finally {
      setIsExporting(false);
    }
  }

  const inputCls =
    "w-full px-3 py-2 border border-stone-200 rounded text-sm focus:outline-none focus:border-stone-400 bg-white";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ── Left: Unassigned guests ─────────────────────── */}
      <div className="lg:col-span-1">
        <div className="bg-white border border-stone-200 rounded overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
            <div>
              <h2
                className="text-sm font-medium text-stone-700"
                style={{ fontFamily: font }}
              >
                Unassigned
              </h2>
              <p
                className="text-xs text-stone-400 mt-0.5"
                style={{ fontFamily: font }}
              >
                {unassigned.length} household
                {unassigned.length !== 1 ? "s" : ""} attending · no table yet
              </p>
            </div>
            <Users className="w-4 h-4 text-stone-300" />
          </div>

          {unassigned.length === 0 ? (
            <p
              className="px-5 py-8 text-center text-stone-400 text-sm"
              style={{ fontFamily: font }}
            >
              All attending guests are seated 🎉
            </p>
          ) : (
            <div className="divide-y divide-stone-50">
              {unassigned.map((g) => (
                <div
                  key={g.id}
                  className="px-5 py-3 flex items-center justify-between hover:bg-stone-50 transition-colors"
                >
                  <div>
                    <p
                      className="text-sm text-stone-700"
                      style={{ fontFamily: font }}
                    >
                      {g.isVip && (
                        <span
                          className="text-xs px-1.5 py-0.5 rounded mr-1.5"
                          style={{
                            backgroundColor: `${primary}22`,
                            color: primary,
                          }}
                        >
                          VIP
                        </span>
                      )}
                      {g.primaryName}
                    </p>
                    <p
                      className="text-xs text-stone-400 mt-0.5"
                      style={{ fontFamily: font }}
                    >
                      {g.rsvp?.totalAttending ?? 1} seat
                      {(g.rsvp?.totalAttending ?? 1) !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* Assign to table dropdown */}
                  <select
                    disabled={assigningGuest === g.id || isPending}
                    onChange={(e) => handleAssign(g.id, e.target.value || null)}
                    defaultValue=""
                    className="text-xs border border-stone-200 rounded px-2 py-1.5 focus:outline-none focus:border-stone-400 disabled:opacity-40 bg-white"
                    style={{ fontFamily: font, color: primary }}
                  >
                    <option value="" disabled>
                      Assign…
                    </option>
                    {tables.map((t) => {
                      const occ = getOccupancy(t);
                      const seats = g.rsvp?.totalAttending ?? 1;
                      const fits = occ + seats <= t.capacity;
                      return (
                        <option key={t.id} value={t.id} disabled={!fits}>
                          {t.name} ({occ}/{t.capacity})
                        </option>
                      );
                    })}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Right: Tables ───────────────────────────────── */}
      <div className="lg:col-span-2 space-y-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowNewTable(true)}
            disabled={showNewTable}
            className="flex items-center gap-2 px-4 py-2 rounded text-white text-sm disabled:opacity-40 transition-colors"
            style={{ backgroundColor: primary, fontFamily: font }}
          >
            <Plus className="w-4 h-4" />
            Add Table
          </button>

          {/* ── Export button ── */}
          <button
            onClick={handleExport}
            disabled={isExporting || tables.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded border border-stone-200 text-stone-600 text-sm hover:bg-stone-50 disabled:opacity-40 transition-colors"
            style={{ fontFamily: font }}
          >
            <Download className="w-4 h-4" />
            {isExporting ? "A exportar…" : "Exportar Mesas"}
          </button>
        </div>

        {/* New table form */}
        {showNewTable && (
          <div className="bg-white border border-stone-200 rounded p-5 space-y-3">
            <h3
              className="text-sm font-medium text-stone-700"
              style={{ fontFamily: font }}
            >
              New Table
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <input
                  className={inputCls}
                  placeholder="Table name…"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  style={{ fontFamily: font }}
                />
              </div>
              <input
                type="number"
                min={1}
                max={50}
                className={inputCls}
                value={newCapacity}
                onChange={(e) => setNewCapacity(Number(e.target.value))}
                style={{ fontFamily: font }}
              />
            </div>
            <input
              className={inputCls}
              placeholder="Notes (optional)…"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              style={{ fontFamily: font }}
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateTable}
                disabled={!newName.trim() || isPending}
                className="px-5 py-2 rounded text-white text-sm disabled:opacity-40 transition-colors"
                style={{ backgroundColor: primary, fontFamily: font }}
              >
                Create Table
              </button>
              <button
                onClick={() => setShowNewTable(false)}
                className="px-5 py-2 rounded border border-stone-200 text-stone-500 text-sm"
                style={{ fontFamily: font }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Table cards */}
        {tables.length === 0 ? (
          <div className="text-center py-20 text-stone-400 bg-white border border-stone-200 rounded">
            <p className="text-sm" style={{ fontFamily: font }}>
              No tables yet.
            </p>
            <p className="text-xs mt-1" style={{ fontFamily: font }}>
              Click "Add Table" to get started.
            </p>
          </div>
        ) : (
          tables.map((table) => {
            const occ = getOccupancy(table);
            const pct = Math.min(occ / table.capacity, 1);
            const barColor = occupancyColor(table);
            const isEditing = editingTable === table.id;

            return (
              <div
                key={table.id}
                className="bg-white border border-stone-200 rounded overflow-hidden"
              >
                {/* Table header */}
                <div className="px-5 py-4 border-b border-stone-100">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2">
                          <input
                            className={inputCls}
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            style={{ fontFamily: font }}
                          />
                        </div>
                        <input
                          type="number"
                          min={1}
                          max={50}
                          className={inputCls}
                          value={editCapacity}
                          onChange={(e) =>
                            setEditCapacity(Number(e.target.value))
                          }
                          style={{ fontFamily: font }}
                        />
                      </div>
                      <input
                        className={inputCls}
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="Notes…"
                        style={{ fontFamily: font }}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateTable(table.id)}
                          disabled={isPending}
                          className="flex items-center gap-1.5 px-4 py-1.5 rounded text-white text-xs disabled:opacity-40"
                          style={{ backgroundColor: primary }}
                        >
                          <Check className="w-3.5 h-3.5" /> Save
                        </button>
                        <button
                          onClick={() => setEditingTable(null)}
                          className="flex items-center gap-1.5 px-4 py-1.5 rounded border border-stone-200 text-stone-500 text-xs"
                        >
                          <X className="w-3.5 h-3.5" /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3
                            className="text-base font-medium text-stone-800"
                            style={{ fontFamily: font }}
                          >
                            {table.name}
                          </h3>
                          <span
                            className="text-xs text-stone-400"
                            style={{ fontFamily: font }}
                          >
                            {occ} / {table.capacity} seats
                          </span>
                        </div>
                        {/* Capacity bar */}
                        <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden w-48">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${pct * 100}%`,
                              backgroundColor: barColor,
                            }}
                          />
                        </div>
                        {table.notes && (
                          <p
                            className="text-xs text-stone-400 mt-2"
                            style={{ fontFamily: font }}
                          >
                            {table.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 ml-4">
                        <button
                          onClick={() => startEdit(table)}
                          className="p-1.5 text-stone-400 hover:text-stone-700 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteTable(table.id, table.name)
                          }
                          className="p-1.5 text-stone-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Guests at this table */}
                {table.guests.length === 0 ? (
                  <p
                    className="px-5 py-4 text-xs text-stone-400 italic"
                    style={{ fontFamily: font }}
                  >
                    No guests assigned yet
                  </p>
                ) : (
                  <div className="divide-y divide-stone-50">
                    {table.guests.map((g) => (
                      <div
                        key={g.id}
                        className="px-5 py-3 flex items-center justify-between hover:bg-stone-50 transition-colors"
                      >
                        <div>
                          <p
                            className="text-sm text-stone-700"
                            style={{ fontFamily: font }}
                          >
                            {g.isVip && (
                              <span
                                className="text-xs px-1.5 py-0.5 rounded mr-1.5"
                                style={{
                                  backgroundColor: `${primary}22`,
                                  color: primary,
                                }}
                              >
                                VIP
                              </span>
                            )}
                            {g.primaryName}
                          </p>
                          <p
                            className="text-xs text-stone-400 mt-0.5"
                            style={{ fontFamily: font }}
                          >
                            {g.rsvp?.totalAttending ?? 1} seat
                            {(g.rsvp?.totalAttending ?? 1) !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <button
                          disabled={assigningGuest === g.id || isPending}
                          onClick={() => handleAssign(g.id, null)}
                          className="text-xs text-stone-400 hover:text-red-500 transition-colors disabled:opacity-40 px-2 py-1 rounded border border-transparent hover:border-red-200"
                          style={{ fontFamily: font }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
