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

export default function StatsPage() {
  const { push } = useRouter();
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    president: [],
    vice_president: [],
    treasurer: [],
    secretary: [],
    joint_secretary: [],
    total: 0
  });

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
        <div className='w-100 mx-auto h-full text-center grid grid-cols-2 lg:grid-cols-3 mt-10'>
          <div className='font-semibold text-accented'>
            Total Vote Count
            <div className='text-center text-6xl my-2 align-center w-96 mx-auto h-full text-center mt-16'>
              {stats.total}
            </div>
          </div>

          <div className='font-semibold text-accented'>
            President Vote Count
            <div className='text-left my-2'>
              <BarChart data={stats.president} post={'president'} />
            </div>
          </div>

          <div className='font-semibold text-accented'>
            Vice President Vote Count
            <div className='text-left my-2'>
              <BarChart data={stats.vice_president} post={'vice_president'} />
            </div>
          </div>

          <div className='font-semibold text-accented'>
            Treasurer Vote Count
            <div className='text-left my-2'>
              <BarChart data={stats.treasurer} post={'treasurer'} />
            </div>
          </div>

          <div className='font-semibold text-accented'>
            Secretary Vote Count
            <div className='text-left my-2'>
              <BarChart data={stats.secretary} post={'secretary'} />
            </div>
          </div>

          <div className='font-semibold text-accented'>
            Joint Secretary Vote Count
            <div className='text-left my-2'>
              <BarChart data={stats.joint_secretary} post={'joint_secretary'} />
            </div>
          </div>
        </div>
      </>
      <div className='w-96 pt-10 h-full m-auto text-center'>
        Developed with ♥ at DUCS
      </div>
    </>
  )
}
