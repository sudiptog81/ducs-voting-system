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
import SpinnerLoading from './Loader';

export default function ThanksPage() {
  const { data: session } = useSession();

  useEffect(() => {
    const audio = new Audio('/beep.mp3');
    audio.play();
  }, []);

  return (
    <>
      <Navbar />
      {session ? (
        <div className='w-96 pt-10 h-full m-auto flex justify-center items-center align-center font-semibold text-red'>
          Vote has been recorded - thank you!
        </div>
      ) : (
        <>
          <div className='w-96 pt-10 h-full m-auto text-center flex items-center justify-center'>
            <SpinnerLoading />
          </div>
        </>
      )}
      <div className='w-96 pt-10 h-full m-auto flex justify-center items-center align-center'>
        <Link className='rounded bg-accented text-white p-3 mx-2 cursor-pointer' href='/'>Go to Dashboard</Link>
      </div>
      <div className='w-96 pt-10 h-full m-auto text-center'>
        Developed with ♥ at DUCS
      </div>
    </>
    )
}
