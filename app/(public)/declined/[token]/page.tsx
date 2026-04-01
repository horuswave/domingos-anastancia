import { notFound } from "next/navigation";
import { getGuestByToken } from "@/actions/guests";

export default async function DeclinedPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const guest = await getGuestByToken(token);
  if (!guest) notFound();

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
                backgroundColor: isDark ? "#555" : "#ccc",
              }}
            />
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: isDark ? "#666" : "#bbb",
              }}
            />
            <div
              style={{
                height: "1px",
                width: "4rem",
                backgroundColor: isDark ? "#555" : "#ccc",
              }}
            />
          </div>

          <h1
            style={{
              fontFamily: event.fontDisplay,
              fontSize: "3rem",
              color: isDark ? "#e8e0d0" : "#333",
              marginBottom: "0.75rem",
              fontWeight: 400,
            }}
          >
            Vai Fazer Falta
          </h1>

          <p
            style={{
              fontFamily: event.fontBody,
              fontSize: "0.7rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: isDark ? "#777" : "#999",
              marginBottom: "2rem",
            }}
          >
            Resposta Recebida
          </p>

          <p
            style={{
              fontFamily: event.fontBody,
              lineHeight: 1.7,
              color: isDark ? "#907060" : "#888",
              marginBottom: "2.5rem",
            }}
          >
            Obrigado/a por nos ter informado,{" "}
            <strong style={{ color: isDark ? "#b0a090" : "#666" }}>
              {guest.primaryName}
            </strong>
            . Lamentamos não poder contar com a sua presença, mas agradecemos
            imenso a sua resposta. Estará no nosso coração neste dia tão
            especial.
          </p>

          <a
            href={`/invite/${token}`}
            style={{
              fontFamily: event.fontBody,
              fontSize: "0.85rem",
              color: event.primaryColor,
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
          >
            Mudou de ideias? Atualize a sua resposta
          </a>
        </div>
      </main>
    </>
  );
}
