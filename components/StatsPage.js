"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import BarChart from "@/components/BarChart";
import SpinnerLoading from "@/components/Loader";
import Footer from "@/components/Footer";

export default function StatsPage() {
  const [stats, setStats] = useState({});

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("secret") != process.env.NEXT_PUBLIC_SECRET) {
      router.push("/");
    }

    setInterval(() => {
      fetch("/api/stats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ secret: process.env.NEXT_PUBLIC_SECRET }),
      })
        .then((res) => res.json())
        .then((res) => setStats(res.stats));
    }, 5000);
  }, []);

  return (
    <>
      <Navbar />
      <>
        {!stats?.votes && (
          <div className="w-full pt-10 h-full m-auto text-center flex items-center justify-center">
            <SpinnerLoading />
          </div>
        )}
        <div className="w-100 mx-auto h-full text-center grid grid-cols-2 gap-y-10 gap-x-4 lg:grid-cols-3 mt-10">
          {stats?.votes && (
            <div className="font-semibold text-accented">
              Total Vote Count
              <div className="text-center text-6xl my-2 align-center w-96 mx-auto h-full text-center mt-14">
                {stats.total}
              </div>
            </div>
          )}
          {stats?.votes &&
            Object.keys(stats.votes).map((key, index) => {
              return (
                <div className="font-semibold text-accented" key={index}>
                  {key} Vote Count
                  <div className="text-center text-6xl my-2 align-center w-full h-full mx-auto text-center">
                    <BarChart data={stats.votes[key]} post={key} />
                  </div>
                </div>
              );
            })}
        </div>
      </>
      <Footer />
    </>
  );
}
