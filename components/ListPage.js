"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import SpinnerLoading from "@/components/Loader";
import Footer from "@/components/Footer";

export default function ThanksPage() {
  const [users, setUsers] = useState([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("secret") != process.env.NEXT_PUBLIC_SECRET) {
      router.push("/");
    }

    setInterval(() => {
      fetch("/api/voted-list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ secret: process.env.NEXT_PUBLIC_SECRET }),
      })
        .then((res) => res.json())
        .then((data) => {
          setUsers(data.voted);
        })
        .catch((e) => alert(e));
    }, 5000);
  }, []);

  return (
    <>
      <Navbar />
      <div className="w-100 mx-auto h-full text-center flex flex-col lg:grid-cols-3 mt-10">
        {users.length == 0 && (
          <div className="w-96 pt-10 h-full m-auto text-center flex items-center justify-center">
            <SpinnerLoading />
          </div>
        )}
        {users.length > 0 &&
          users.map((e, i) => (
            <div
              key={i}
              className={
                "items-center p-1 mb-4 rounded text-center text-xl " +
                (!i && "text-accented")
              }
              role="alert"
            >
              <span className="font-bold">
                {e.name} ({e.course})
              </span>{" "}
              has voted
            </div>
          ))}
      </div>
      <Footer />
    </>
  );
}
