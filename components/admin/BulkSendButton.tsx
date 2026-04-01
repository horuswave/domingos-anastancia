"use client";

import { useState } from "react";
import { bulkSendInvitations } from "@/actions/invitations";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

interface Props {
  pendingCount: number;
  primaryColor?: string;
  fontBody?: string;
}

export default function BulkSendButton({
  pendingCount,
  primaryColor = "#c8890e",
  fontBody = "system-ui",
}: Props) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [result, setResult] = useState<{
    sent: number;
    failed: number;
    total: number;
  } | null>(null);

  async function handleBulkSend() {
    if (pendingCount === 0) return;
    const confirmed = confirm(
      `Send invitations to all ${pendingCount} pending guests? This will send real SMS/WhatsApp messages.`,
    );
    if (!confirmed) return;

    setState("sending");
    setResult(null);

    const res = await bulkSendInvitations("INVITATION");
    setResult(res);
    setState("done");
    router.refresh();
    setTimeout(() => {
      setState("idle");
      setResult(null);
    }, 6000);
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleBulkSend}
        disabled={state === "sending" || pendingCount === 0}
        className="flex items-center gap-2 px-4 py-2 rounded border text-sm transition-all disabled:opacity-40"
        style={{
          fontFamily: fontBody,
          borderColor: primaryColor,
          color: state === "done" ? "white" : primaryColor,
          backgroundColor: state === "done" ? primaryColor : "transparent",
        }}
      >
        {state === "sending" ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-current/40 border-t-current rounded-full animate-spin" />
            Sending {pendingCount}…
          </>
        ) : (
          <>
            <Send className="w-3.5 h-3.5" />
            {state === "done" ? "Done!" : `Send to ${pendingCount} pending`}
          </>
        )}
      </button>

      {result && (
        <p className="text-xs text-stone-500" style={{ fontFamily: fontBody }}>
          {result.sent} sent
          {result.failed > 0 && (
            <span className="text-red-400"> · {result.failed} failed</span>
          )}
        </p>
      )}
    </div>
  );
}
