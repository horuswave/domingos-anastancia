import { EventData } from "@/types";
import { Info, Phone, Mail } from "lucide-react";

export default function EventDetails({ event }: { event: EventData }) {
  const rules = event.rules?.split("\n").filter(Boolean) ?? [];

  return (
    <section className="bg-[#fbf7f1] py-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div
              className="h-px w-12"
              style={{ backgroundColor: event.primaryColor, opacity: 0.3 }}
            />
            <h2
              className="text-[11px] tracking-[0.34em] uppercase"
              style={{ color: event.primaryColor, fontFamily: event.fontBody }}
            >
              Detalhes do Evento
            </h2>
            <div
              className="h-px w-12"
              style={{ backgroundColor: event.primaryColor, opacity: 0.3 }}
            />
          </div>

          <p
            className="text-stone-500 text-[15px] max-w-lg mx-auto leading-relaxed"
            style={{ fontFamily: event.fontBody }}
          >
            Reunimos abaixo as informações essenciais para que a sua presença
            seja vivida com tranquilidade e elegância.
          </p>
        </div>

        {/* Information Cards - Centered */}
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            {rules.length > 0 && (
              <Card
                icon={<Info className="w-5 h-5" />}
                title="Informações Úteis"
                primaryColor={event.primaryColor}
                fontDisplay={event.fontDisplay}
                fontBody={event.fontBody}
              >
                <ul className="space-y-3">
                  {rules.map((rule, i) => (
                    <li
                      key={i}
                      className="text-stone-600 text-[15px] leading-relaxed flex gap-3"
                    >
                      <span
                        className="mt-2.5 h-1.5 w-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: event.primaryColor }}
                      />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        </div>

        {/* Contact Section */}
        {(event.supportEmail || event.supportPhone) && (
          <div className="mt-16 flex justify-center">
            <div className="w-full max-w-2xl">
              <div className="rounded-[28px] border border-stone-200/80 bg-white/80 backdrop-blur-sm px-8 py-10 text-center shadow-[0_18px_50px_rgba(120,98,72,0.08)]">
                <p
                  className="text-stone-500 text-[15px] mb-7 leading-relaxed"
                  style={{ fontFamily: event.fontBody }}
                >
                  Para qualquer questão adicional, teremos todo o gosto em
                  ajudar.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  {event.supportEmail && (
                    <a
                      href={`mailto:${event.supportEmail}`}
                      className="inline-flex items-center gap-2.5 rounded-full border px-6 py-3 text-sm transition-all hover:opacity-80 active:scale-[0.985]"
                      style={{
                        color: event.primaryColor,
                        fontFamily: event.fontBody,
                        borderColor: `${event.primaryColor}33`,
                        backgroundColor: `${event.primaryColor}08`,
                      }}
                    >
                      <Mail className="w-4 h-4" />
                      {event.supportEmail}
                    </a>
                  )}

                  {event.supportPhone && (
                    <a
                      href={`tel:${event.supportPhone}`}
                      className="inline-flex items-center gap-2.5 rounded-full border px-6 py-3 text-sm transition-all hover:opacity-80 active:scale-[0.985]"
                      style={{
                        color: event.primaryColor,
                        fontFamily: event.fontBody,
                        borderColor: `${event.primaryColor}33`,
                        backgroundColor: `${event.primaryColor}08`,
                      }}
                    >
                      <Phone className="w-4 h-4" />
                      {event.supportPhone}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ====================== Card Component ====================== */

function Card({
  icon,
  title,
  primaryColor,
  fontDisplay,
  fontBody,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  primaryColor: string;
  fontDisplay: string;
  fontBody: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-stone-200/70 bg-white/80 p-8 shadow-[0_18px_45px_rgba(120,98,72,0.08)] backdrop-blur-sm">
      {/* Top accent line */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)`,
          opacity: 0.45,
        }}
      />

      <div className="flex items-center gap-4 mb-6">
        <span
          className="flex h-12 w-12 items-center justify-center rounded-full border"
          style={{
            color: primaryColor,
            borderColor: `${primaryColor}33`,
            backgroundColor: `${primaryColor}10`,
          }}
        >
          {icon}
        </span>

        <div>
          <p
            className="text-[11px] uppercase tracking-[0.24em] text-stone-400 mb-1"
            style={{ fontFamily: fontBody }}
          >
            Informação
          </p>
          <h3
            className="text-2xl text-stone-800 tracking-tight"
            style={{ fontFamily: fontDisplay }}
          >
            {title}
          </h3>
        </div>
      </div>

      {children}
    </div>
  );
}
