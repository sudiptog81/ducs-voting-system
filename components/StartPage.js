'use client'

import Link from 'next/link';
import { useSession, signIn, signOut, SessionProvider } from "next-auth/react"
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import Navbar from '@/components/Navbar'
import LoginBtn from '@/components/LoginBtn'
import { useEffect, useState } from 'react';


export default function StartPage() {
  const { data: session } = useSession();
  const [voted, setVoted] = useState(false);

  useEffect(() => {
     fetch('/api/voted', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: session?.user.email
        })
      })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.voted) { setVoted(true) }
      })
      .catch(e => alert(e))
  }, [voted])

  if (session) {
    return (
      <>
        <Navbar />
        {voted && (
          <div className='w-96 pt-10 h-full m-auto flex justify-center items-center align-center'>
            <div className='font-semibold'>Already Voted</div>
          </div>
        )}
        <div className='w-96 pt-10 h-full m-auto flex justify-center items-center align-center'>
          {!voted && <Link className='rounded bg-accented text-white p-3 mx-2' href='/vote'>Proceed</Link>}
          <button className='rounded bg-accented text-white p-3 mx-2' onClick={() => signOut()}>Logout</button>
        </div>
        <div className='w-96 pt-10 h-full m-auto text-center'>
          Developed with ♥ at DUCS
        </div>
      </>
    )
   } else 
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
