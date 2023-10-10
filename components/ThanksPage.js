'use client'

import Link from 'next/link';
import { useSession, signIn, signOut, SessionProvider } from "next-auth/react"
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import Navbar from '@/components/Navbar'
import LoginBtn from '@/components/LoginBtn'
import { useEffect } from 'react';
import { useRouter } from 'next/router';


export default function ThanksPage() {
  const { data: session } = useSession();

  if (session)
    return (
      <>
        <Navbar />
        <div className='w-96 pt-10 h-full m-auto flex justify-center items-center align-center font-semibold text-red'>
          Vote has been recorded - thank you!
        </div>
        <div className='w-96 pt-10 h-full m-auto flex justify-center items-center align-center'>
          <button className='rounded bg-accented text-white p-3 mx-2' onClick={() => signOut()}>Logout</button>
        </div>
      </>
    )
  else 
    return (
      <>
        <Navbar />
        <div className='w-96 pt-10 h-full m-auto text-center'>
          <button className='rounded bg-accented text-white p-3' onClick={() => signIn()}>Login with DU Google Account</button>
        </div>
        <div className='w-96 pt-10 h-full m-auto text-center'>
          Developed with ♥ at DUCS
        </div>
      </>
    )
}
