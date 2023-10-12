'use client'

import Link from 'next/link';
import { useSession, signIn, signOut, SessionProvider } from "next-auth/react"
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import SpinnerLoading from '@/components/Loader'
import Navbar from '@/components/Navbar'
import LoginBtn from '@/components/LoginBtn'
import { useEffect, useState } from 'react';
import Image from 'next/image';


export default function StartPage() {
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('M.Sc. First Year');

  const handleSignIn = async (e) => {
    e.preventDefault();

    const result = await signIn('credentials', {
      course,
      email: email.toLowerCase(),
      redirect: false,
    });

    if (result.error == 'CredentialsSignin') {
      alert('Invalid Credentials');
    }
  };

  const { data: session, status } = useSession();
  const [voted, setVoted] = useState(false);
  const [statusSim, setStatusSim] = useState(true);

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
      .catch(e => alert(e));
    }
    
    setTimeout(() => {
      setStatusSim(false);
    }, 1000);
  }, [status])


  return (
    <>
      <Navbar />
      {
        statusSim ? (
          <div className='w-96 pt-10 h-full m-auto text-center flex items-center justify-center'>
            <SpinnerLoading />
          </div>
        ) : status === 'unauthenticated' ? (
          <>
            <div className='w-96 pt-10 h-full m-auto text-center'>
              <Image priority alt='logo of the university' src='/University_of_Delhi.png' width={200} height={200} className='m-auto'/>
            </div>
            <div className='w-96 pt-10 h-full m-auto text-center'>
              <div>
                <form onSubmit={handleSignIn} className='mb-5'>
                  <select required name="role" className='bg-accented border border-gray-300 text-white rounded-lg w-full p-2.5' value={course} onChange={(e) => setCourse(e.target.value)}>
                    <option value="M.Sc. First Year">M.Sc. First Year</option>
                    <option value="M.Sc. Second Year">M.Sc. Second Year</option>
                    <option value="M.C.A. First Year">M.C.A. First Year</option>
                    <option value="M.C.A. Second Year">M.C.A. Second Year</option>
                    <option value="M.C.A. Third Year">M.C.A. Third Year</option>
                  </select>
                  <input required type="email" name="email" placeholder="Email" className='bg-white border border-gray-300 rounded-lg w-full p-2.5 mt-5' value={email} onChange={(e) => setEmail(e.target.value)} />
                  <button type='submit' className='rounded bg-accented text-white p-3 mt-10'>Login</button>
                </form>
              </div>
            </div>
          </>
        ) : <></>
      }
      
      {
        status === 'authenticated' && (
          <>
            <div className='w-5/12 pt-10 h-full m-auto text-center'>
              <p className='text-lg'>Welcome {(session?.user.name)}!</p>
              <p className='text-left pt-10'>
                <strong>Instructions:</strong>
              </p>
              <ul className='text-left list-disc ml-4'>
                <li>Click on Proceed and select one candidate for each post.</li>
                <li>Tick the checkbox to confirm your choice.</li>
                <li>Click on Submit to cast your vote.</li>
                <li>Remember to Logout.</li>
                <li>You can vote only once.</li>
              </ul>
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
