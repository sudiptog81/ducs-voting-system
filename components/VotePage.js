'use client'

import Link from 'next/link';
import { useSession, signIn, signOut, SessionProvider } from "next-auth/react"
import { useRouter } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import Navbar from '@/components/Navbar'
import SpinnerLoading from '@/components/Loader'
import LoginBtn from '@/components/LoginBtn'
import { useEffect, useState } from 'react';

export default function StartPage() {
  const { push } = useRouter();
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    fetch('/api/posts').then(res => res.json()).then(res => setPosts(res))
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget)
    const response = await fetch('/api/vote', {
      method: 'POST',
      body: formData,
    })
 
    const {success} = await response.json()
    if (success) {
      push('/thanks')
    } else {
      push('/error')
    }
  }

  return (
    <>
      <Navbar />
      {(loading || !session) && (
        <div className='w-96 pt-10 h-full m-auto text-center flex items-center justify-center'>
          <SpinnerLoading />
        </div>
      )}
      {session && (
        <>
          <form id='voting-form' onSubmit={handleSubmit}>
            <input type='hidden' name='email' value={session.user.email} />
            <div className='w-96 pt-10 h-full m-auto grid grid-cols-2 justify-between'>
              {posts.length == 0  && (
                <div className='w-96 pt-10 h-full m-auto text-center flex items-center justify-center'>
                  <SpinnerLoading />
                </div>
              )}
              {posts && posts.map((e, i) => (
                <div key={i} id='post-div p-4 m-4 row-gap-4'>
                  <h2 className='font-semibold mt-4 mb-2'>{e.label}</h2>
                  <div className='flex flex-col'>
                    {e.candidates.map((_e, i) => (
                      <div key={i} id='candidate-div flex flex-row'>
                        <input type='radio' required name={e.post} value={_e} id={_e.replaceAll(/\s+/g, '-') + '-' + e.post} />
                        <label className='ml-4' htmlFor={_e + '-' + e.post}>{_e}</label>
                      </div>
                    ))} 
                  </div>
                </div>
              ))}
            </div>
            <div className='w-100 pt-10 h-full m-auto flex justify-center items-center align-center'>
              <input type='checkbox' required name='agree' id='agree' />
              <label htmlFor='agree' className='ml-2'>I agree that I am voting for the selected candidates</label>
            </div>
            <div className='w-96 pt-10 h-full m-auto flex justify-center items-center align-center'>
              <input className='rounded bg-accented text-white p-3 mx-2 cursor-pointer' type='submit' />
            </div>
          </form>
        </>
      )}
      <div className='w-96 pt-10 h-full m-auto text-center'>
        Developed with ♥ at DUCS
      </div>
    </>
  )
}
