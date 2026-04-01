"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { EventData } from "@/types";

export interface RsvpFields {
  companions: boolean;
  dietary: boolean;
  transport: boolean;
  message: boolean;
}

interface Props {
  token: string;
  maxAllowed: number;
  event: EventData & { rsvpFields?: RsvpFields };
  existingRsvp: {
    attending: boolean;
    totalAttending: number;
    dietaryRestrictions: string | null;
    transportNotes: string | null;
    coupleMessage: string | null;
  } | null;
  existingCompanions: {
    id: string;
    name: string;
    dietaryRestrictions: string | null;
  }[];
}

export default function RsvpForm({
  token,
  maxAllowed,
  event,
  existingRsvp,
  existingCompanions,
}: Props) {
  const router = useRouter();
  const isUpdate = !!existingRsvp;

  const fields: RsvpFields = {
    companions: event.rsvpFields?.companions ?? true,
    dietary: event.rsvpFields?.dietary ?? true,
    transport: event.rsvpFields?.transport ?? true,
    message: event.rsvpFields?.message ?? true,
  };

  const [attending, setAttending] = useState<boolean | null>(
    existingRsvp?.attending ?? null,
  );
  const [companions, setCompanions] = useState(
    existingCompanions.map((c) => ({
      name: c.name,
      dietaryRestrictions: c.dietaryRestrictions ?? "",
    })),
  );
  const [dietary, setDietary] = useState(
    existingRsvp?.dietaryRestrictions ?? "",
  );
  const [transport, setTransport] = useState(
    existingRsvp?.transportNotes ?? "",
  );
  const [message, setMessage] = useState(existingRsvp?.coupleMessage ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addCompanion() {
    if (companions.length < maxAllowed - 1) {
      setCompanions([...companions, { name: "", dietaryRestrictions: "" }]);
    }
  }

  function removeCompanion(i: number) {
    setCompanions(companions.filter((_, idx) => idx !== i));
  }

  function updateCompanion(
    i: number,
    field: "name" | "dietaryRestrictions",
    value: string,
  ) {
    const updated = [...companions];
    updated[i][field] = value;
    setCompanions(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (attending === null) {
      setError("Por favor indique se vai estar presente.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        attending,
        totalAttending: attending ? 1 + companions.length : 0,
        companions: fields.companions ? companions : [],
        dietaryRestrictions: fields.dietary ? dietary : undefined,
        transportNotes: fields.transport ? transport : undefined,
        coupleMessage: fields.message ? message : undefined,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Ocorreu um erro. Por favor tente novamente.");
      setSubmitting(false);
      return;
    }

    router.push(attending ? `/confirmed/${token}` : `/declined/${token}`);
  }

  const inputCls =
    "w-full rounded-2xl border bg-white/85 px-4 py-3 text-sm text-stone-700 shadow-sm outline-none transition-all placeholder:text-stone-400 focus:bg-white";

  return (
    <section className="bg-[#fbf7f1] py-24 px-6 border-t border-stone-200/60">
      <div className="max-w-2xl mx-auto">
        <div className="rounded-[32px] border border-stone-200/80 bg-white/80 p-8 md:p-10 shadow-[0_24px_60px_rgba(120,98,72,0.08)] backdrop-blur-sm">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-5">
              <div
                className="h-px w-14"
                style={{ backgroundColor: event.primaryColor, opacity: 0.28 }}
              />
              <span
                className="text-[11px] tracking-[0.34em] uppercase"
                style={{
                  color: event.primaryColor,
                  fontFamily: event.fontBody,
                }}
              >
                {isUpdate ? "Atualizar Confirmação" : "Confirmação de Presença"}
              </span>
              <div
                className="h-px w-14"
                style={{ backgroundColor: event.primaryColor, opacity: 0.28 }}
              />
            </div>

            <h2
              className="text-4xl md:text-5xl text-stone-800"
              style={{ fontFamily: event.fontDisplay }}
            >
              Vai Estar Presente?
            </h2>

            <p
              className="text-stone-500 text-sm mt-4 max-w-lg mx-auto leading-7"
              style={{ fontFamily: event.fontBody }}
            >
              Pedimos a gentileza da sua resposta para prepararmos cada detalhe
              com o cuidado que a ocasião merece.
            </p>

            {isUpdate && (
              <p
                className="text-stone-400 text-sm mt-3"
                style={{ fontFamily: event.fontBody }}
              >
                Já respondeu anteriormente. Pode atualizar a sua resposta
                abaixo.
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label
                className="block text-stone-700 text-sm font-medium mb-3"
                style={{ fontFamily: event.fontBody }}
              >
                Confirma a sua presença? <span className="text-red-400">*</span>
              </label>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { value: true, label: "Sim, estarei presente" },
                  {
                    value: false,
                    label: "Infelizmente não poderei comparecer",
                  },
                ].map((opt) => (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => setAttending(opt.value)}
                    className="rounded-[22px] border px-5 py-4 text-sm transition-all text-left"
                    style={{
                      fontFamily: event.fontBody,
                      borderColor:
                        attending === opt.value
                          ? event.primaryColor
                          : "#e7e5e4",
                      backgroundColor:
                        attending === opt.value
                          ? `${event.primaryColor}10`
                          : "rgba(255,255,255,0.75)",
                      color:
                        attending === opt.value
                          ? event.primaryColor
                          : "#6b635c",
                      boxShadow:
                        attending === opt.value
                          ? `0 12px 28px ${event.primaryColor}18`
                          : "none",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {attending === true && (
              <>
                {fields.companions && maxAllowed > 1 && (
                  <div>
                    <label
                      className="block text-stone-700 text-sm font-medium mb-3"
                      style={{ fontFamily: event.fontBody }}
                    >
                      Acompanhantes
                      <span className="text-stone-400 font-normal ml-1">
                        (até {maxAllowed - 1} acompanhante
                        {maxAllowed - 1 !== 1 ? "s" : ""})
                      </span>
                    </label>

                    <div className="space-y-4">
                      {companions.map((c, i) => (
                        <div
                          key={i}
                          className="rounded-[24px] border border-stone-200/80 bg-[#fcfaf7] p-4"
                        >
                          <div className="flex gap-3">
                            <div className="flex-1 space-y-3">
                              <input
                                type="text"
                                placeholder={`Nome completo do acompanhante ${i + 1}`}
                                value={c.name}
                                onChange={(e) =>
                                  updateCompanion(i, "name", e.target.value)
                                }
                                required
                                className={inputCls}
                                style={{
                                  fontFamily: event.fontBody,
                                  borderColor: "#e7e0d7",
                                }}
                              />

                              {fields.dietary && (
                                <input
                                  type="text"
                                  placeholder="Restrições alimentares (opcional)"
                                  value={c.dietaryRestrictions}
                                  onChange={(e) =>
                                    updateCompanion(
                                      i,
                                      "dietaryRestrictions",
                                      e.target.value,
                                    )
                                  }
                                  className={inputCls}
                                  style={{
                                    fontFamily: event.fontBody,
                                    borderColor: "#e7e0d7",
                                  }}
                                />
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => removeCompanion(i)}
                              className="self-start rounded-full p-3 text-stone-400 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {companions.length < maxAllowed - 1 && (
                      <button
                        type="button"
                        onClick={addCompanion}
                        className="mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm"
                        style={{
                          color: event.primaryColor,
                          fontFamily: event.fontBody,
                          borderColor: `${event.primaryColor}30`,
                          backgroundColor: `${event.primaryColor}08`,
                        }}
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar acompanhante
                      </button>
                    )}
                  </div>
                )}

                {fields.dietary && (
                  <Field
                    label="Restrições alimentares"
                    fontBody={event.fontBody}
                  >
                    <input
                      type="text"
                      placeholder="ex.: vegetariano, sem glúten, alergia a frutos secos…"
                      value={dietary}
                      onChange={(e) => setDietary(e.target.value)}
                      className={inputCls}
                      style={{
                        fontFamily: event.fontBody,
                        borderColor: "#e7e0d7",
                      }}
                    />
                  </Field>
                )}

                {fields.transport && (
                  <Field
                    label="Notas de transporte ou logística"
                    fontBody={event.fontBody}
                  >
                    <input
                      type="text"
                      placeholder="ex.: necessito de estacionamento, chego de comboio…"
                      value={transport}
                      onChange={(e) => setTransport(e.target.value)}
                      className={inputCls}
                      style={{
                        fontFamily: event.fontBody,
                        borderColor: "#e7e0d7",
                      }}
                    />
                  </Field>
                )}
              </>
            )}

            {fields.message && (
              <Field
                label="Uma mensagem para os noivos"
                optional
                fontBody={event.fontBody}
              >
                <textarea
                  rows={5}
                  placeholder="Partilhe um desejo ou uma memória especial…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`${inputCls} resize-none`}
                  style={{
                    fontFamily: event.fontBody,
                    borderColor: "#e7e0d7",
                  }}
                />
              </Field>
            )}

            {error && (
              <p
                className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-2xl px-4 py-3"
                style={{ fontFamily: event.fontBody }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || attending === null}
              className="w-full rounded-full px-6 py-4 text-sm uppercase tracking-[0.26em] transition-all disabled:opacity-40"
              style={{
                background: `linear-gradient(180deg, ${event.primaryColor}, ${event.primaryColor}DD)`,
                color: "#fffdf9",
                fontFamily: event.fontBody,
                boxShadow: `0 18px 38px ${event.primaryColor}30`,
              }}
            >
              {submitting
                ? "A enviar…"
                : isUpdate
                  ? "Atualizar Confirmação"
                  : "Confirmar Presença"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  children,
  optional = false,
  fontBody,
}: {
  label: string;
  children: React.ReactNode;
  optional?: boolean;
  fontBody: string;
}) {
  return (
    <div>
      <label
        className="block text-stone-700 text-sm font-medium mb-2"
        style={{ fontFamily: fontBody }}
      >
        {label}
        {optional && (
          <span className="text-stone-400 font-normal ml-1">(opcional)</span>
        )}
      </label>
      {children}
    </div>
  );
}
