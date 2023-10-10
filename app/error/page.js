'use client'

import ErrorPage from '@/components/ErrorPage'
import { SessionProvider } from 'next-auth/react';

export default function Home() {
  return (
    <SessionProvider>
      <ErrorPage />
    </SessionProvider>
  )
}
