import { notFound } from "next/navigation";
import { getGuestByToken } from "@/actions/guests";

export default async function ConfirmedPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const guest = await getGuestByToken(token);
  if (!guest || !guest.rsvp?.attending) notFound();

  const { event } = guest;
  const isDark = event.backgroundStyle !== "LIGHT";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=EB+Garamond:ital,wght@0,400;1,400&family=Jost:wght@300;400;500&family=Lato:wght@300;400&family=DM+Sans:wght@300;400&family=Nunito:wght@300;400&display=swap');
      `}</style>

      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 1.5rem",
          backgroundColor: event.accentColor,
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "32rem" }}>
          {/* Decorative rule */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                height: "1px",
                width: "4rem",
                backgroundColor: event.primaryColor,
                opacity: 0.5,
              }}
            />
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: event.primaryColor,
              }}
            />
            <div
              style={{
                height: "1px",
                width: "4rem",
                backgroundColor: event.primaryColor,
                opacity: 0.5,
              }}
            />
          </div>

          <h1
            style={{
              fontFamily: event.fontDisplay,
              fontSize: "3rem",
              color: isDark ? "#faf7ef" : "#1a1a1a",
              marginBottom: "0.75rem",
              fontWeight: 400,
            }}
          >
            Até Breve!
          </h1>

          <p
            style={{
              fontFamily: event.fontBody,
              fontSize: "0.7rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: event.primaryColor,
              marginBottom: "2rem",
            }}
          >
            Presença Confirmada
          </p>

          <p
            style={{
              fontFamily: event.fontBody,
              lineHeight: 1.7,
              color: isDark ? "#b0a898" : "#555",
              marginBottom: "2.5rem",
            }}
          >
            Obrigado/a,{" "}
            <strong style={{ color: event.primaryColor }}>
              {guest.primaryName}
            </strong>
            . A sua confirmação foi recebida. Estamos muito ansiosos por
            celebrar convosco este momento tão especial.
          </p>

          {/* Event summary card */}
          <div
            style={{
              background: isDark
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.03)",
              border: `1px solid ${event.primaryColor}33`,
              borderRadius: "4px",
              padding: "1.5rem 2rem",
              textAlign: "left",
              marginBottom: "2.5rem",
            }}
          >
            {[
              {
                icon: "📅",
                text: new Date(event.date).toLocaleDateString("pt-PT", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }),
              },
              { icon: "🕕", text: event.time },
              { icon: "📍", text: event.venue },
            ].map((row) => (
              <p
                key={row.icon}
                style={{
                  fontFamily: event.fontBody,
                  fontSize: "0.85rem",
                  color: isDark ? "#c8c0b0" : "#555",
                  marginBottom: "0.5rem",
                }}
              >
                {row.icon}&nbsp;&nbsp;{row.text}
              </p>
            ))}
            {event.mapUrl && (
              <a
                href={event.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: event.fontBody,
                  fontSize: "0.85rem",
                  color: event.primaryColor,
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                }}
              >
                Ver no mapa →
              </a>
            )}
          </div>

          {event.supportEmail && (
            <p
              style={{
                fontFamily: event.fontBody,
                fontSize: "0.75rem",
                color: isDark ? "#555" : "#999",
              }}
            >
              Alguma questão?{" "}
              <a
                href={`mailto:${event.supportEmail}`}
                style={{ color: event.primaryColor }}
              >
                {event.supportEmail}
              </a>
            </p>
          )}
        </div>
      </main>
    </>
  );
}
