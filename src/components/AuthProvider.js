"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const AuthContext = createContext({ data: null, status: "loading", signOut: async () => {} });

function toSession(user) {
  if (!user) return null;
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0],
      image: user.user_metadata?.avatar_url || null,
      role: user.app_metadata?.role || "USER",
    },
  };
}

export default function AuthProvider({ children }) {
  const [data, setData] = useState(null);
  // Start safely as signed out. The async Supabase check below promotes the
  // session to authenticated when it is available, without a synchronous
  // state update during the effect setup.
  const [status, setStatus] = useState("unauthenticated");

  useEffect(() => {
    let active = true;
    let supabase;
    try {
      supabase = createClient();
    } catch {
      return () => {
        active = false;
      };
    }

    supabase.auth.getUser().then(({ data: result }) => {
      if (!active) return;
      setData(toSession(result.user));
      setStatus(result.user ? "authenticated" : "unauthenticated");
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setData(toSession(session?.user));
      setStatus(session?.user ? "authenticated" : "unauthenticated");
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      data,
      status,
      async signOut(options = {}) {
        await createClient().auth.signOut();
        window.location.assign(options.callbackUrl || "/");
      },
    }),
    [data, status],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useSession() {
  return useContext(AuthContext);
}

export async function signOut(options) {
  await createClient().auth.signOut();
  window.location.assign(options?.callbackUrl || "/");
}
