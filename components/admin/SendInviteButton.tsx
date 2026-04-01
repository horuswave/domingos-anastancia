"use client";

import { useState } from "react";
import { sendInvitation } from "@/actions/invitations";
import { useRouter } from "next/navigation";
import { Send, Check, X } from "lucide-react";

interface Props {
  guestId: string;
  preferredContact: string;
  hasPhone: boolean;
  messageType?: "INVITATION" | "REMINDER";
  primaryColor?: string;
  fontBody?: string;
  compact?: boolean; // true = icon only (for table rows)
}

export default function SendInviteButton({
  guestId,
  preferredContact,
  hasPhone,
  messageType = "INVITATION",
  primaryColor = "#c8890e",
  fontBody = "system-ui",
  compact = false,
}: Props) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">(
    "idle",
  );
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const canSend =
    preferredContact === "MANUAL" ||
    ((preferredContact === "SMS" || preferredContact === "WHATSAPP") &&
      hasPhone);

  async function handleSend() {
    if (!canSend) return;
    setState("sending");
    setErrMsg(null);
    const result = await sendInvitation(guestId, messageType);
    if (result.success) {
      setState("sent");
      router.refresh();
      setTimeout(() => setState("idle"), 3000);
    } else {
      setState("failed");
      setErrMsg(result.error ?? "Failed");
      setTimeout(() => setState("idle"), 4000);
    }
  }

  if (!canSend) {
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
        disabled={state === "sending"}
        title={messageType === "REMINDER" ? "Send reminder" : "Send invitation"}
        className="p-1.5 transition-colors disabled:opacity-40"
        style={{
          color:
            state === "sent"
              ? "#10b981"
              : state === "failed"
                ? "#ef4444"
                : "#a8a29e",
        }}
      >
        {state === "sent" ? (
          <Check className="w-4 h-4" />
        ) : state === "failed" ? (
          <X className="w-4 h-4" />
        ) : (
          <Send className="w-4 h-4" />
        )}
      </button>
    );
  }

  return (
    <div className="space-y-1">
      <button
        onClick={handleSend}
        disabled={state === "sending"}
        className="flex items-center gap-2 px-5 py-2.5 rounded text-white text-sm tracking-wide uppercase transition-all disabled:opacity-50"
        style={{ backgroundColor: primaryColor, fontFamily: fontBody }}
      >
        {state === "sending" ? (
          <>
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Sending…
          </>
        ) : state === "sent" ? (
          <>
            <Check className="w-4 h-4" /> Sent!
          </>
        ) : state === "failed" ? (
          <>
            <X className="w-4 h-4" /> Failed
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />{" "}
            {messageType === "REMINDER" ? "Send Reminder" : "Send Invitation"}
          </>
        )}
      </button>
      {errMsg && (
        <p className="text-red-500 text-xs" style={{ fontFamily: fontBody }}>
          {errMsg}
        </p>
      )}
    </div>
  );
}
