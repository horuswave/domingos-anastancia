import { EventData } from "@/types";

export default function InvitationHero({
  event,
  guestName,
}: {
  event: EventData;
  guestName: string;
}) {
  const isDark = event.backgroundStyle !== "LIGHT";
  const textPrimary = isDark ? "#f7f1e8" : "#201a17";
  const textSecondary = isDark ? "#d8cfc3" : "#6c6259";
  const textMuted = isDark ? "#e6dccd" : "#8a7d72";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=EB+Garamond:wght@400;500&family=Inter:wght@300;400;500&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .hero-fade-up { opacity: 0; animation: fadeUp 0.9s ease forwards; }
        .hero-fade-in { opacity: 0; animation: fadeIn 1.2s ease forwards; }
      `}</style>

      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          padding: "7rem 1.5rem 6rem",
          boxSizing: "border-box",
          background: isDark
            ? `linear-gradient(180deg, ${event.accentColor} 0%, #161210 100%)`
            : `linear-gradient(180deg, #fbf6ef 0%, ${event.accentColor} 100%)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: isDark ? 0.22 : 0.16,
            background: `
              radial-gradient(circle at 20% 20%, ${event.primaryColor}55 0%, transparent 32%),
              radial-gradient(circle at 80% 15%, ${event.primaryColor}30 0%, transparent 28%),
              radial-gradient(circle at 50% 100%, ${event.primaryColor}22 0%, transparent 34%)
            `,
          }}
        />

        <div
          className="hero-fade-in"
          style={{
            position: "absolute",
            inset: "1.5rem",
            border: `1px solid ${event.primaryColor}33`,
            borderRadius: "28px",
            pointerEvents: "none",
          }}
        />

        <div
          className="hero-fade-in"
          style={{
            position: "absolute",
            top: "2.2rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            whiteSpace: "nowrap",
            animationDelay: "0.15s",
          }}
        >
          <div
            style={{
              height: "1px",
              width: "5.5rem",
              background: `linear-gradient(to right, transparent, ${event.primaryColor})`,
            }}
          />
          <div
            style={{
              width: "0.6rem",
              height: "0.6rem",
              borderRadius: "999px",
              border: `1px solid ${event.primaryColor}`,
              backgroundColor: `${event.primaryColor}22`,
            }}
          />
          <div
            style={{
              height: "1px",
              width: "5.5rem",
              background: `linear-gradient(to left, transparent, ${event.primaryColor})`,
            }}
          />
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            maxWidth: "46rem",
            margin: "0 auto",
            textAlign: "center",
            padding: "2.5rem 1.75rem",
          }}
        >
          <p
            className="hero-fade-up"
            style={{
              fontFamily: event.fontBody,
              fontSize: "0.72rem",
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              color: event.primaryColor,
              marginBottom: "1.5rem",
              animationDelay: "0.2s",
            }}
          >
            Com muita honra e alegria
          </p>

          <p
            className="hero-fade-up"
            style={{
              fontFamily: event.fontBody,
              color: textMuted,
              fontSize: "0.95rem",
              marginBottom: "1rem",
              animationDelay: "0.3s",
            }}
          >
            Celebramos cinco décadas de amor, cumplicidade e elegância
          </p>

          <h1
            className="hero-fade-up"
            style={{
              fontFamily: event.fontDisplay,
              fontSize: "clamp(3.4rem, 9vw, 6.2rem)",
              lineHeight: 0.95,
              color: textPrimary,
              fontWeight: 400,
              marginBottom: "1rem",
              animationDelay: "0.4s",
              overflowWrap: "break-word",
              wordBreak: "break-word",
              textShadow: isDark ? "0 8px 30px rgba(0,0,0,0.24)" : "none",
            }}
          >
            {event.coupleNames}
          </h1>

          <p
            className="hero-fade-up"
            style={{
              fontFamily: event.fontDisplay,
              fontStyle: "italic",
              fontSize: "clamp(1.2rem, 2.8vw, 1.7rem)",
              color: event.primaryColor,
              marginBottom: "2rem",
              animationDelay: "0.55s",
            }}
          >
            Jornada de Amor — 50 Anos
          </p>

          <div
            className="hero-fade-up"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.9rem",
              marginBottom: "2.2rem",
              animationDelay: "0.65s",
            }}
          >
            <div
              style={{
                height: "1px",
                width: "3.5rem",
                backgroundColor: event.primaryColor,
                opacity: 0.4,
              }}
            />
            <span
              style={{
                fontFamily: event.fontBody,
                fontSize: "0.68rem",
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                color: event.primaryColor,
              }}
            >
              Bodas de Ouro
            </span>
            <div
              style={{
                height: "1px",
                width: "3.5rem",
                backgroundColor: event.primaryColor,
                opacity: 0.4,
              }}
            />
          </div>

          {event.message && (
            <div
              className="hero-fade-up"
              style={{
                maxWidth: "34rem",
                margin: "0 auto 2rem",
                padding: "1.2rem 1.8rem",
                borderRadius: "20px",
                border: `1px solid ${event.primaryColor}28`,
                background: isDark
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(255,255,255,0.6)",
                backdropFilter: "blur(6px)",
                animationDelay: "0.78s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                  paddingBottom: "0.5rem",
                  borderBottom: `1px solid ${event.primaryColor}20`,
                }}
              >
                <p
                  style={{
                    fontFamily: event.fontBody,
                    fontSize: "0.68rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: event.primaryColor,
                    margin: 0,
                  }}
                >
                  Querido(a) Convidado(a)
                </p>

                <p
                  style={{
                    fontFamily: event.fontDisplay,
                    color: textPrimary,
                    fontSize: "1.1rem",
                    fontWeight: 500,
                    margin: 0,
                  }}
                >
                  {guestName}
                </p>
              </div>

              <p
                style={{
                  fontFamily: event.fontBody,
                  fontSize: "0.88rem",
                  lineHeight: 1.65,
                  color: textSecondary,
                  margin: 0,
                  overflowWrap: "break-word",
                }}
              >
                {event.message}
              </p>
            </div>
          )}

          <div
            className="hero-fade-up"
            style={{
              animationDelay: "0.9s",
              display: "inline-flex",
              flexDirection: "column",
              gap: "0.4rem",
              padding: "1rem 1.4rem",
              borderRadius: "999px",
              background: isDark
                ? "rgba(255,255,255,0.04)"
                : "rgba(255,255,255,0.75)",
              border: `1px solid ${event.primaryColor}26`,
              boxShadow: isDark
                ? "0 10px 30px rgba(0,0,0,0.18)"
                : "0 10px 26px rgba(88,70,50,0.07)",
            }}
          >
            <p
              style={{
                fontFamily: event.fontDisplay,
                fontSize: "clamp(0.98rem, 2vw, 1.08rem)",
                color: textMuted,
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {new Date(event.date).toLocaleDateString("pt-PT", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              {" · "}
              {event.time}
            </p>

            <p
              style={{
                fontFamily: event.fontBody,
                fontSize: "0.78rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: event.primaryColor,
                margin: 0,
              }}
            >
              {event.venue}
            </p>
          </div>
        </div>

        <div
          className="hero-fade-in"
          style={{
            position: "absolute",
            bottom: "1.7rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.45rem",
            animationDelay: "1.2s",
          }}
        >
          <span
            style={{
              fontFamily: event.fontBody,
              fontSize: "0.62rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: isDark ? "#7f756d" : "#b2a59a",
            }}
          >
            Descubra Mais
          </span>
          <div
            style={{
              width: "1px",
              height: "1.9rem",
              background: `linear-gradient(to bottom, ${event.primaryColor}99, transparent)`,
            }}
          />
        </div>
      </section>
    </>
  );
}
