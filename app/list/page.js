'use client'

import ListPage from '@/components/ListPage'
import { SessionProvider } from 'next-auth/react';

export default function Stats() {
  return (
    <SessionProvider>
      <ListPage />
    </SessionProvider>
  )
}
