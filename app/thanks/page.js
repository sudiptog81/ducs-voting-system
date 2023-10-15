"use client";

import ThanksPage from "@/components/ThanksPage";
import { SessionProvider } from "next-auth/react";

export default function Thanks() {
  return (
    <SessionProvider>
      <ThanksPage />
    </SessionProvider>
  );
}
