import { EventData } from "@/types";
import type { GiftItem } from "@/app/admin/settings/GiftListEditor";

function GiftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 12v10H4V12" />
      <path d="M22 7H2v5h20V7z" />
      <path d="M12 22V7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  );
}

function MoneyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="6" width="20" height="14" rx="3" />
      <circle cx="12" cy="13" r="3" />
      <path d="M6 10h.01M18 10h.01" />
    </svg>
  );
}

function BankIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 21h18" />
      <path d="M3 10h18" />
      <path d="M5 6l7-3 7 3" />
      <path d="M4 10v11M8 10v11M12 10v11M16 10v11M20 10v11" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M12 18h.01" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      className="w-3.5 h-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function GiftCard({
  item,
  primaryColor,
  fontDisplay,
  fontBody,
}: {
  item: GiftItem;
  primaryColor: string;
  fontDisplay: string;
  fontBody: string;
}) {
  const isMonetary = item.type === "MONETARY";

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-stone-200/70 bg-white/90 p-8 shadow-[0_16px_38px_rgba(120,98,72,0.07)] backdrop-blur-sm">
      {/* Linha decorativa superior */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)`,
          opacity: 0.35,
        }}
      />

      <div className="flex items-start gap-5 mb-6">
        {/* <span
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border"
          style={{
            color: primaryColor,
            borderColor: `${primaryColor}33`,
            backgroundColor: `${primaryColor}10`,
          }}
        >
          <span className="w-6 h-6">
            {isMonetary ? <MoneyIcon /> : <GiftIcon />}
          </span>
        </span> */}

        <div className="flex-1 min-w-0 pt-1">
          <h3
            className="text-stone-800 text-xl leading-tight"
            style={{ fontFamily: fontDisplay }}
          >
            {item.name}
          </h3>

          {!isMonetary && item.store && (
            <p
              className="text-stone-400 text-sm mt-1"
              style={{ fontFamily: fontBody }}
            >
              {item.store}
            </p>
          )}

          {isMonetary && item.suggestedAmount && item.currency && (
            <p
              className="text-sm mt-1"
              style={{ color: primaryColor, fontFamily: fontBody }}
            >
              Sugerido: {item.currency} {item.suggestedAmount.toLocaleString()}
            </p>
          )}
        </div>

        {!isMonetary && item.storeUrl && (
          <a
            href={item.storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-opacity hover:opacity-70 mt-1"
            style={{
              color: primaryColor,
              borderColor: `${primaryColor}33`,
              fontFamily: fontBody,
            }}
          >
            Ver <ExternalLinkIcon />
          </a>
        )}
      </div>

      {item.note && (
        <p
          className="text-stone-500 text-[15px] leading-relaxed mb-6"
          style={{ fontFamily: fontBody }}
        >
          {item.note}
        </p>
      )}

      {isMonetary && (
        <div className="space-y-4">
          {(item.bankIban || item.bankAccountHolder) && (
            <div
              className="rounded-2xl border p-5 space-y-3"
              style={{
                borderColor: `${primaryColor}20`,
                backgroundColor: `${primaryColor}06`,
              }}
            >
              <div className="flex items-center gap-3">
                <span className="w-5 h-5" style={{ color: primaryColor }}>
                  <BankIcon />
                </span>
                <span
                  className="text-xs uppercase tracking-widest font-medium"
                  style={{ color: primaryColor, fontFamily: fontBody }}
                >
                  {item.bankName ?? "Transferência Bancária"}
                </span>
              </div>
              {item.bankIban && (
                <DetailRow
                  label="NIB"
                  value={item.bankIban}
                  fontBody={fontBody}
                  primaryColor={primaryColor}
                  copyable
                />
              )}
              {item.bankAccountHolder && (
                <DetailRow
                  label="Titular da conta"
                  value={item.bankAccountHolder}
                  fontBody={fontBody}
                  primaryColor={primaryColor}
                />
              )}

              {item.bankReference && (
                <DetailRow
                  label="Referência"
                  value={item.bankReference}
                  fontBody={fontBody}
                  primaryColor={primaryColor}
                  copyable
                />
              )}
            </div>
          )}

          {(item.mobileWalletProvider || item.mobileWalletNumber) && (
            <div
              className="rounded-2xl border p-5 space-y-3"
              style={{
                borderColor: `${primaryColor}20`,
                backgroundColor: `${primaryColor}06`,
              }}
            >
              <div className="flex items-center gap-3">
                <span className="w-5 h-5" style={{ color: primaryColor }}>
                  <PhoneIcon />
                </span>
                <span
                  className="text-xs uppercase tracking-widest font-medium"
                  style={{ color: primaryColor, fontFamily: fontBody }}
                >
                  {item.mobileWalletProvider ?? "Carteira Móvel"}
                </span>
              </div>

              {item.mobileWalletNumber && (
                <DetailRow
                  label="Número"
                  value={item.mobileWalletNumber}
                  fontBody={fontBody}
                  primaryColor={primaryColor}
                  copyable
                />
              )}
              {item.mobileWalletHolderName && (
                <DetailRow
                  label="Titular da conta"
                  value={item.mobileWalletHolderName}
                  fontBody={fontBody}
                  primaryColor={primaryColor}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DetailRow({
  label,
  value,
  fontBody,
  primaryColor,
  copyable = false,
}: {
  label: string;
  value: string;
  fontBody: string;
  primaryColor: string;
  copyable?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div>
        <p
          className="text-stone-400 text-[11px] uppercase tracking-wide"
          style={{ fontFamily: fontBody }}
        >
          {label}
        </p>
        <p className="text-stone-700 text-sm font-mono mt-0.5 break-all">
          {value}
        </p>
      </div>
      {copyable && (
        <button
          type="button"
          data-copy={value}
          className="copy-btn inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs border transition-opacity hover:opacity-70"
          style={{
            color: primaryColor,
            borderColor: `${primaryColor}33`,
            fontFamily: fontBody,
          }}
        >
          Copiar
        </button>
      )}
    </div>
  );
}

export default function GiftListSection({
  event,
}: {
  event: EventData & { giftList?: GiftItem[] };
}) {
  const items: GiftItem[] = (event.giftList as GiftItem[] | undefined) ?? [];
  if (items.length === 0) return null;

  const physicalGifts = items.filter((i) => i.type === "ITEM");
  const monetaryOptions = items.filter((i) => i.type === "MONETARY");

  const totalItems = physicalGifts.length + monetaryOptions.length;

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('click', function(e) {
              var btn = e.target.closest('.copy-btn');
              if (!btn) return;
              var text = btn.dataset.copy;
              if (!text) return;
              navigator.clipboard.writeText(text).then(function() {
                var orig = btn.textContent;
                btn.textContent = 'Copiado!';
                setTimeout(function() { btn.textContent = orig; }, 1800);
              });
            });
          `,
        }}
      />

      <section className="bg-[#fbf7f1] py-28 px-6 border-t border-stone-200/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <p
              className="text-stone-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
              style={{ fontFamily: event.fontBody }}
            >
              A vossa presença honra-nos profundamente. Caso deseje oferecer um
              presente, pedimos gentilmente que seja em numerário.
            </p>
          </div>

          {/* Presentes Físicos */}
          {physicalGifts.length > 0 && (
            <div className="mb-16">
              {physicalGifts.length > 0 && monetaryOptions.length > 0 && (
                <h3
                  className="text-xs uppercase tracking-[0.125em] text-stone-400 mb-6 text-center"
                  style={{ fontFamily: event.fontBody }}
                >
                  Ideias de presentes
                </h3>
              )}
              <div
                className={`grid gap-6 ${totalItems === 1 ? "grid-cols-1 max-w-md mx-auto" : "md:grid-cols-2"}`}
              >
                {physicalGifts.map((item) => (
                  <GiftCard
                    key={item.id}
                    item={item}
                    primaryColor={event.primaryColor}
                    fontDisplay={event.fontDisplay}
                    fontBody={event.fontBody}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Contribuições Monetárias */}
          {monetaryOptions.length > 0 && (
            <div>
              {physicalGifts.length > 0 && monetaryOptions.length > 0 && (
                <h3
                  className="text-xs uppercase tracking-[0.125em] text-stone-400 mb-6 text-center"
                  style={{ fontFamily: event.fontBody }}
                >
                  Contribuições monetárias
                </h3>
              )}
              <div
                className={`grid gap-6 ${totalItems === 1 ? "grid-cols-1 max-w-md mx-auto" : "md:grid-cols-2"}`}
              >
                {monetaryOptions.map((item) => (
                  <GiftCard
                    key={item.id}
                    item={item}
                    primaryColor={event.primaryColor}
                    fontDisplay={event.fontDisplay}
                    fontBody={event.fontBody}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
