'use client'

import Link from 'next/link';
import { useSession, signIn, signOut, SessionProvider } from "next-auth/react"
import { useRouter, useSearchParams } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import Navbar from '@/components/Navbar'
import LoginBtn from '@/components/LoginBtn'
import { useEffect, useState } from 'react';
import BarChart from '@/components/BarChart';
import SpinnerLoading from './Loader';

export default function StatsPage() {
  const { push } = useRouter();
  const { data: session } = useSession();
  const [stats, setStats] = useState({});

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get('secret') != process.env.NEXT_PUBLIC_SECRET) {
      router.push('/');
    }

    fetch('/api/stats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({secret: process.env.NEXT_PUBLIC_SECRET})
    }).then(res => res.json()).then(res => setStats(res.stats));
  }, []);
  

  return (
    <>
      <Navbar />
      <>
        {
          !stats?.votes && (
            <div className='w-full pt-10 h-full m-auto text-center flex items-center justify-center'>
                  <SpinnerLoading />
                </div>
          )
        }
        <div className='w-100 mx-auto h-full text-center grid grid-cols-2 lg:grid-cols-3 mt-10'>
          {
            stats?.votes && (
              <div className='font-semibold text-accented'>
                Total Vote Count
                <div className='text-center text-6xl my-2 align-center w-96 mx-auto h-full text-center mt-14'>
                  {stats.total}
                </div>
              </div>
            )
          }
          {
            stats?.votes && Object.keys(stats.votes).map((key, index) => {
              return (
                <div className='font-semibold text-accented' key={index}>
                  {key} Vote Count
                  <div className='text-center text-6xl my-2 align-center w-full mx-auto h-full text-center'>
                    <BarChart data={stats.votes[key]} post={key} />
                  </div>
                </div>
              )
            })
          }
        </div>
      </>
      <div className='w-96 pt-10 h-full m-auto text-center'>
        Developed with ♥ at DUCS
      </div>
    </>
  )
}
