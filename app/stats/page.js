"use client";

import StatsPage from "@/components/StatsPage";
import { SessionProvider } from "next-auth/react";

export default function Stats() {
  return (
    <SessionProvider>
      <StatsPage />
    </SessionProvider>
  );
}
