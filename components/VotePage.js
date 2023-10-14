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
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);

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
      .catch(e => alert(e));
      
      fetch('/api/posts').then(res => res.json()).then(res => {
        setPosts(res);
        setLoading(false);
      });
    }
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    formData.append('secret', process.env.NEXT_PUBLIC_SECRET);

    const object = {};
    formData.forEach((value, key) => {
      object[key] = value;
    });

    object['votes'] = {};
    for (const [key, value] of formData.entries()) {
      if (key != 'email' && key != 'agree' && key != 'secret') {
        object['votes'][key] = value;
      }
    }

    const response = await fetch('/api/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(object),
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
      {voted && (
        <>
          <div className='w-96 pt-10 h-full m-auto flex justify-center items-center align-center font-semibold text-red'>
            You have already voted - you cannot vote again!
          </div>
          <div className='w-96 pt-10 h-full m-auto flex justify-center items-center align-center'>
            <Link className='rounded bg-accented text-white p-3 mx-2 cursor-pointer' href='/'>Go to Dashboard</Link>
          </div>
        </>
      )}
      {session && !voted && (
        <>
          <form id='voting-form' onSubmit={handleSubmit}>
            <input type='hidden' name='email' value={session.user.email} />
            <div className='w-6/12 pt-10 h-full m-auto grid grid-cols-2 justify-between'>
              {posts.length == 0  && (
                <div className='w-full pt-10 h-full m-auto text-center flex items-center justify-center'>
                  <SpinnerLoading />
                </div>
              )}
              {posts && posts.map((e, i) => (
                <div key={i} id='post-div p-4 row-gap-4'>
                  <h2 className='font-semibold mt-4 mb-2'>{e.post}</h2>
                  <div className='flex flex-col'>
                    <fieldset className="space-y-4">
                    {e.candidates.map((_e, i) => (
                      <div key={i} id='candidate-div' className='flex mb-2'>
                        <input
                          type="radio"
                          required name={e.post} value={_e.name} id={_e.name.replaceAll(/\s+/g, '-') + '-' + e.post}
                          className="peer hidden [&:checked_+_label_svg]:block"
                        />

                        <label
                          htmlFor={_e.name.replaceAll(/\s+/g, '-') + '-' + e.post}
                          className="block w-full mr-4 cursor-pointer rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 peer-checked:border-[#652b7c] peer-checked:ring-1 peer-checked:ring-[#652b7c]"
                        >
                          <div className="flex items-center justify-between">
                            <p className="">{_e.name}</p>
                            <svg
                              className="hidden h-5 w-5 text-[#652b7c]"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd"
                              />
                            </svg>
                          </div>
                          {_e.course != 'NOTA' && (
                            <p className="mt-1 text-accented italics">{_e.course}</p>
                          )}
                        </label>
                      </div>
                    ))} 
                    </fieldset>
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
