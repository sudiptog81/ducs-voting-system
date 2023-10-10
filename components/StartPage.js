'use client'

import Link from 'next/link';
import { useSession, signIn, signOut, SessionProvider } from "next-auth/react"
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import Navbar from '@/components/Navbar'
import LoginBtn from '@/components/LoginBtn'
import { useEffect, useState } from 'react';
import Image from 'next/image';


export default function StartPage() {
  const { data: session, status } = useSession();
  const [voted, setVoted] = useState(false);

  // when session status is authenticated, check if user has voted
  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/voted', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: session?.user.email
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.voted) { setVoted(true) }
      })
      .catch(e => alert(e))
    }
  }, [status])


  return (
    <>
      <Navbar />
      {
        status === 'loading' ? (
          <div className='w-96 pt-10 h-full m-auto text-center'>
            <span>Loading...</span>
          </div>
        ) : status === 'unauthenticated' ? (
          <>
            <div className='w-96 pt-10 h-full m-auto text-center'>
              <Image src='/University_of_Delhi.png' width={200} height={200} className='m-auto'/>
            </div>
            <div className='w-96 pt-10 h-full m-auto text-center'>
              <button className='rounded bg-accented text-white p-3' onClick={() => signIn()}>Login with DU Google Account</button>
            </div>
          </>
        ) : <></>
      }
      
      {
        status === 'authenticated' && (
          <>
            <div className='w-96 pt-10 h-full m-auto text-center'>
              <span className='text-lg'>Welcome, {session?.user.name}!</span>
            </div>
            {voted && <div className='w-96 pt-10 h-full m-auto text-center'>
              <span className='text-lg'>You have already voted.</span>
              </div>}
            <div className='w-96 pt-10 h-full m-auto flex justify-center items-center align-center'>
              {!voted && <Link className='rounded bg-accented text-white p-3 mx-2' href='/vote'>Proceed</Link>}
              <button className='rounded bg-accented text-white p-3 mx-2' onClick={() => signOut()}>Logout</button>
            </div>
          </>
        )
      }
        
      <div className='w-96 pt-10 h-full m-auto text-center'>
        Developed with ♥ at DUCS
      </div>
    </>
  )
}
