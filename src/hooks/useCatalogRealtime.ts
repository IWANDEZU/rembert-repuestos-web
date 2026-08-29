"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type RealtimeStatus = "disabled" | "connecting" | "connected" | "error";

export function useCatalogRealtime() {
  const router = useRouter();
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const realtimeEnabled =
    process.env.NEXT_PUBLIC_CATALOG_REALTIME === "true" && isSupabaseConfigured();
  const [status, setStatus] = useState<RealtimeStatus>(
    realtimeEnabled ? "connecting" : "disabled",
  );

  useEffect(() => {
    if (!realtimeEnabled) return;

    const supabase = createClient();
    const channel = supabase
      .channel("rembert-catalog-events-v1")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "CatalogEvent" },
        (change: { new: Record<string, unknown> }) => {
          window.dispatchEvent(
            new CustomEvent("rembert:catalog-event", { detail: change.new }),
          );
          if (refreshTimer.current) clearTimeout(refreshTimer.current);
          refreshTimer.current = setTimeout(() => router.refresh(), 300);
        },
      )
      .subscribe((subscriptionStatus: string) => {
        if (subscriptionStatus === "SUBSCRIBED") setStatus("connected");
        if (
          subscriptionStatus === "CHANNEL_ERROR" ||
          subscriptionStatus === "TIMED_OUT"
        ) {
          setStatus("error");
        }
      });

    return () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
      void supabase.removeChannel(channel);
    };
  }, [realtimeEnabled, router]);

  return status;
}
