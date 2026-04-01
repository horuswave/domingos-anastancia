import { EventData } from "@/types";

export type ProgramItemType =
  | "COCKTAIL"
  | "CEREMONY"
  | "RECEPTION"
  | "DINNER"
  | "SPEECHES"
  | "FIRST_DANCE"
  | "CAKE"
  | "MUSIC"
  | "PHOTO"
  | "FIREWORKS"
  | "BLESSING"
  | "BRUNCH"
  | "GAMES"
  | "TRANSPORT"
  | "CUSTOM";

export interface ProgramItem {
  id: string;
  type: ProgramItemType;
  label: string;
  time: string;
  notes?: string;
}

const ICONS: Record<ProgramItemType, React.ReactNode> = {
  COCKTAIL: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2l8 0M5 2l7 9 7-9" />
      <path d="M12 11v9" />
      <path d="M8 20h8" />
    </svg>
  ),
  CEREMONY: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a5 5 0 0 1 5 5c0 3-5 8-5 8S7 10 7 7a5 5 0 0 1 5-5z" />
      <path d="M12 22V15" />
      <path d="M9 19h6" />
    </svg>
  ),
  RECEPTION: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 11l19-9-9 19-2-8-8-2z" />
    </svg>
  ),
  DINNER: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2a5 5 0 0 0-5 5v6h3.5" />
      <path d="M19.5 13V22" />
    </svg>
  ),
  SPEECHES: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  FIRST_DANCE: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="5" r="2" />
      <path d="M8 22v-8l4-4 4 4v8" />
      <path d="M5 12c1-2 3-3 4-4" />
      <path d="M19 12c-1-2-3-3-4-4" />
    </svg>
  ),
  CAKE: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
      <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2 1 2 1" />
      <path d="M2 21h20" />
      <path d="M7 8v3" />
      <path d="M12 8v3" />
      <path d="M17 8v3" />
      <path d="M7 4h.01" />
      <path d="M12 4h.01" />
      <path d="M17 4h.01" />
    </svg>
  ),
  MUSIC: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
  PHOTO: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  FIREWORKS: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  BLESSING: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 3a3 3 0 0 0-3 3l3 5 3-5a3 3 0 0 0-3-3z" />
      <path d="M6 3a3 3 0 0 0-3 3l3 5 3-5a3 3 0 0 0-3-3z" />
      <path d="M6 11c0 8 6 10 6 10s6-2 6-10" />
    </svg>
  ),
  BRUNCH: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <path d="M6 1v3M10 1v3M14 1v3" />
    </svg>
  ),
  GAMES: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="6" y1="12" x2="10" y2="12" />
      <line x1="8" y1="10" x2="8" y2="14" />
      <circle cx="15" cy="13" r="1" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="11" r="1" fill="currentColor" stroke="none" />
      <path d="M1.5 9.5A5 5 0 0 1 6 7h12a5 5 0 0 1 5 5 5 5 0 0 1-5 5H6a5 5 0 0 1-5-5 5.02 5.02 0 0 1 .5-2.5z" />
    </svg>
  ),
  TRANSPORT: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="1" y="3" width="15" height="13" rx="2" />
      <path d="M16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  CUSTOM: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4l3 3" />
    </svg>
  ),
};

export default function ProgramSection({
  event,
}: {
  event: EventData & { programItems?: ProgramItem[] };
}) {
  const items: ProgramItem[] =
    (event.programItems as ProgramItem[] | undefined) ?? [];

  if (items.length === 0) return null;

  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div
              className="h-px w-14"
              style={{ backgroundColor: event.primaryColor, opacity: 0.28 }}
            />
            <span
              className="text-[11px] tracking-[0.34em] uppercase"
              style={{ color: event.primaryColor, fontFamily: event.fontBody }}
            >
              Programa
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
            O Nosso Dia
          </h2>

          <p
            className="mt-4 text-stone-500 text-sm md:text-base max-w-xl mx-auto leading-7"
            style={{ fontFamily: event.fontBody }}
          >
            Um percurso desenhado com momentos especiais, do primeiro brinde ao
            último abraço.
          </p>
        </div>

        <div className="relative pl-2 md:pl-4">
          <div
            className="absolute left-[2.25rem] top-6 bottom-6 w-px"
            style={{
              background: `linear-gradient(to bottom, transparent, ${event.primaryColor}35, transparent)`,
            }}
          />

          <div className="space-y-8">
            {items.map((item) => (
              <div key={item.id} className="relative flex gap-5 items-start">
                <div
                  className="relative z-10 flex h-[4.5rem] w-[4.5rem] flex-shrink-0 items-center justify-center rounded-full border shadow-[0_10px_26px_rgba(120,98,72,0.08)]"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(249,243,236,1) 100%)",
                    borderColor: `${event.primaryColor}30`,
                    color: event.primaryColor,
                  }}
                >
                  <span className="w-6 h-6">{ICONS[item.type]}</span>
                </div>

                <div className="flex-1 pt-2">
                  <div className="rounded-[24px] border border-stone-200/70 bg-[#fcfaf7] px-5 py-5 shadow-[0_16px_38px_rgba(120,98,72,0.06)]">
                    <div className="flex items-baseline gap-3 flex-wrap mb-1">
                      <span
                        className="inline-flex rounded-full px-3 py-1 text-xs font-semibold tabular-nums"
                        style={{
                          color: event.primaryColor,
                          fontFamily: event.fontBody,
                          backgroundColor: `${event.primaryColor}12`,
                          border: `1px solid ${event.primaryColor}22`,
                        }}
                      >
                        {item.time}
                      </span>

                      <h3
                        className="text-stone-800 text-xl"
                        style={{ fontFamily: event.fontDisplay }}
                      >
                        {item.label}
                      </h3>
                    </div>

                    {item.notes && (
                      <p
                        className="text-stone-500 text-sm mt-2 leading-7"
                        style={{ fontFamily: event.fontBody }}
                      >
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
