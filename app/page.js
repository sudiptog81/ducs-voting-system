"use client";

import StartPage from "@/components/StartPage";
import { SessionProvider } from "next-auth/react";

export default function Home() {
  return (
    <SessionProvider>
      <StartPage />
    </SessionProvider>
  );
}
