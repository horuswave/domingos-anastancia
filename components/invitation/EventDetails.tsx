import { EventData } from "@/types";
import { MapPin, Clock, Shirt, Info, Phone, Mail } from "lucide-react";

// Helper function to format time in 24-hour format
function formatTime24h(time: string): string {
  // If time is already in 24h format like "14:30", return as is
  if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
    return time;
  }

  // If time is in 12h format like "2:30 PM" or "02:30 PM"
  try {
    // Parse the time string
    const [timePart, period] = time.split(" ");
    let [hours, minutes] = timePart.split(":");
    let hour24 = parseInt(hours);

    if (period) {
      const isPM = period.toUpperCase() === "PM";
      const is12 = hour24 === 12;

      if (isPM && !is12) hour24 += 12;
      if (!isPM && is12) hour24 = 0;
    }

    return `${hour24.toString().padStart(2, "0")}:${minutes}`;
  } catch {
    // If parsing fails, return original
    return time;
  }
}

export default function EventDetails({ event }: { event: EventData }) {
  const rules = event.rules?.split("\n").filter(Boolean) ?? [];

  return (
    <section className="bg-[#fbf7f1] py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div
              className="h-px w-14"
              style={{ backgroundColor: event.primaryColor, opacity: 0.3 }}
            />
            <h2
              className="text-[11px] tracking-[0.34em] uppercase"
              style={{ color: event.primaryColor, fontFamily: event.fontBody }}
            >
              Detalhes do Evento
            </h2>
            <div
              className="h-px w-14"
              style={{ backgroundColor: event.primaryColor, opacity: 0.3 }}
            />
          </div>

          <p
            className="mt-4 text-stone-500 text-sm md:text-base max-w-2xl mx-auto leading-7"
            style={{ fontFamily: event.fontBody }}
          >
            Reunimos abaixo as informações essenciais para que a sua presença
            seja vivida com tranquilidade e elegância.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card
            icon={<MapPin className="w-5 h-5" />}
            title="Local"
            primaryColor={event.primaryColor}
            fontDisplay={event.fontDisplay}
            fontBody={event.fontBody}
          >
            <p className="text-stone-800 font-medium text-sm">{event.venue}</p>
            <p className="text-stone-500 text-sm mt-2 leading-6">
              {event.address}
            </p>

            {event.mapUrl && (
              <a
                href={event.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-5 text-sm underline underline-offset-4"
                style={{ color: event.primaryColor }}
              >
                Abrir no Google Maps
              </a>
            )}
          </Card>

          <Card
            icon={<Clock className="w-5 h-5" />}
            title="Data"
            primaryColor={event.primaryColor}
            fontDisplay={event.fontDisplay}
            fontBody={event.fontBody}
          >
            <p className="text-stone-800 font-medium text-sm capitalize">
              {new Date(event.date).toLocaleDateString("pt-PT", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            {/* <p className="text-stone-500 text-sm mt-2">
              Recepção a partir das {formatTime24h(event.time)}
            </p> */}
          </Card>

          {event.dressCode && (
            <Card
              icon={<Shirt className="w-5 h-5" />}
              title="Código de Vestuário"
              primaryColor={event.primaryColor}
              fontDisplay={event.fontDisplay}
              fontBody={event.fontBody}
            >
              <p className="text-stone-600 text-sm leading-6">
                {event.dressCode}
              </p>
            </Card>
          )}

          {rules.length > 0 && (
            <Card
              icon={<Info className="w-5 h-5" />}
              title="Informações Úteis"
              primaryColor={event.primaryColor}
              fontDisplay={event.fontDisplay}
              fontBody={event.fontBody}
            >
              <ul className="space-y-2">
                {rules.map((r, i) => (
                  <li
                    key={i}
                    className="text-stone-600 text-sm leading-6 flex gap-3"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: event.primaryColor }}
                    />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {(event.supportEmail || event.supportPhone) && (
          <div className="mt-14">
            <div className="rounded-[28px] border border-stone-200/80 bg-white/80 backdrop-blur-sm px-8 py-8 text-center shadow-[0_18px_50px_rgba(120,98,72,0.08)]">
              <p
                className="text-stone-500 text-sm mb-5"
                style={{ fontFamily: event.fontBody }}
              >
                Para qualquer questão adicional, teremos todo o gosto em ajudar.
              </p>

              <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                {event.supportEmail && (
                  <a
                    href={`mailto:${event.supportEmail}`}
                    className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-opacity hover:opacity-75"
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
                    className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-opacity hover:opacity-75"
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
        )}
      </div>
    </section>
  );
}

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
    <div className="relative overflow-hidden rounded-[28px] border border-stone-200/70 bg-white/80 p-7 shadow-[0_18px_45px_rgba(120,98,72,0.08)] backdrop-blur-sm">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)`,
          opacity: 0.4,
        }}
      />

      <div className="flex items-center gap-4 mb-5">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-full border"
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
            className="text-xl text-stone-800"
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
