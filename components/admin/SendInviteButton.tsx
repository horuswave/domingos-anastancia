"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Check } from "lucide-react";

interface Props {
  guestName: string;
  guestPhone: string;
  inviteToken?: string;
  messageType?: "INVITATION" | "REMINDER";
  primaryColor?: string;
  fontBody?: string;
  compact?: boolean;
}

const TEMPLATE = (name: string, inviteUrl?: string) =>
  `Estimado(a) ${name}
É com muita alegria que partilhamos o convite para a celebração das nossas Bodas de Ouro.
É um momento muito especial para nós e será uma honra contar com a vossa presença.
Segue abaixo o convite com todos os detalhes.
Com carinho,
Anastacia e Domingos Congolo${inviteUrl ? `\n\n${inviteUrl}` : ""}`;

function buildWhatsAppUrl(phone: string, message: string) {
  const cleaned = phone.replace(/[^\d+]/g, "");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleaned}?text=${encoded}`;
}

export default function SendInviteButton({
  guestName,
  guestPhone,
  inviteToken,
  messageType = "INVITATION",
  primaryColor = "#c8890e",
  fontBody = "system-ui",
  compact = false,
}: Props) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "opened">("idle");

  const hasPhone = !!guestPhone?.trim();

  function handleSend() {
    if (!hasPhone) return;
    const inviteUrl = inviteToken
      ? `${window.location.origin}/invite/${inviteToken}`
      : undefined;
    const message = TEMPLATE(guestName, inviteUrl);
    const url = buildWhatsAppUrl(guestPhone, message);
    window.open(url, "_blank");
    setState("opened");
    router.refresh();
    setTimeout(() => setState("idle"), 4000);
  }

  if (!hasPhone) {
    return compact ? null : (
      <span className="text-xs text-stone-400" style={{ fontFamily: fontBody }}>
        No phone number
      </span>
    );
  }

  if (compact) {
    return (
      <button
        onClick={handleSend}
        title={messageType === "REMINDER" ? "Send reminder" : "Send invitation"}
        className="p-1.5 transition-colors"
        style={{ color: state === "opened" ? "#10b981" : "#a8a29e" }}
      >
        {state === "opened" ? (
          <Check className="w-4 h-4" />
        ) : (
          <Send className="w-4 h-4" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleSend}
      className="flex items-center gap-2 px-5 py-2.5 rounded text-white text-sm tracking-wide uppercase transition-all"
      style={{ backgroundColor: primaryColor, fontFamily: fontBody }}
    >
      {state === "opened" ? (
        <>
          <Check className="w-4 h-4" /> Opened!
        </>
      ) : (
        <>
          <Send className="w-4 h-4" />
          {messageType === "REMINDER" ? "Send Reminder" : "Send Invitation"}
        </>
      )}
    </button>
  );
}
