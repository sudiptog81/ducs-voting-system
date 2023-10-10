'use client'

import VotePage from '@/components/VotePage'
import { SessionProvider } from 'next-auth/react';

export default function Vote() {
  return (
    <SessionProvider>
      <VotePage />
    </SessionProvider>
  )
}
