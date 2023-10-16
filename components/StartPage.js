"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import SpinnerLoading from "@/components/Loader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function StartPage() {
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [courses, setCourses] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();

    setBtnLoading(true);

    const result = await signIn("credentials", {
      course,
      email: email.toLowerCase(),
      redirect: false,
    });

    if (result.error == "CredentialsSignin") {
      alert("Invalid Credentials");
    }

    setBtnLoading(false);
  };

  const { data: session, status } = useSession();
  const [voted, setVoted] = useState(false);
  const [statusSim, setStatusSim] = useState(true);

  // when session status is authenticated, check if user has voted
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/voted", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: session?.user.email,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.voted) {
            setVoted(true);
          }
        })
        .catch((e) => alert(e));
    } else {
      fetch("/api/courses", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => setCourses(data))
        .catch((e) => alert(e));
    }

    setTimeout(() => {
      setStatusSim(false);
    }, 1000);
  }, [status]);

  return (
    <>
      <Navbar />
      {statusSim ? (
        <div className="w-96 pt-10 h-full m-auto text-center flex items-center justify-center">
          <SpinnerLoading />
        </div>
      ) : status === "unauthenticated" ? (
        <>
          <div className="w-96 pt-10 h-full m-auto text-center">
            <Image
              priority
              alt="logo of the university"
              src="/University_of_Delhi.png"
              width={200}
              height={200}
              className="m-auto"
            />
          </div>
          <div className="w-96 pt-10 h-full m-auto text-center">
            <div>
              <form onSubmit={handleSignIn} className="mb-5">
                <select
                  required
                  name="role"
                  className="bg-accented border border-gray-300 text-white rounded-lg w-full p-2.5"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                >
                  <option value="" disabled defaultValue={""}>
                    Select Course
                  </option>
                  {courses.map((course, index) => (
                    <option key={index} value={course.name}>
                      {course.name}
                    </option>
                  ))}
                </select>
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="bg-white border border-gray-300 rounded-lg w-full p-2.5 mt-5"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {!btnLoading ? (
                  <button
                    type="submit"
                    className="rounded bg-accented text-white p-3 mt-10"
                  >
                    Login
                  </button>
                ) : (
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      class="inline w-12 h-12 mr-2 animate-spin rounded text-accented p-3 mt-5 dark:text-gray-600 fill-[#652b7c]"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path20
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span class="sr-only">Loading...</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}

      {status === "authenticated" && (
        <>
          <div className="w-5/12 pt-10 h-full m-auto text-center">
            <p className="text-lg">Welcome {session?.user.name}!</p>
            <p className="text-left pt-10">
              <strong>Instructions:</strong>
            </p>
            <ul className="text-left list-disc ml-4">
              <li>Click on Proceed and select one candidate for each post.</li>
              <li>Tick the checkbox to confirm your choice.</li>
              <li>Click on Submit to cast your vote.</li>
              <li>Remember to Logout.</li>
              <li>You can vote only once.</li>
            </ul>
          </div>
          {voted && (
            <div className="w-96 pt-10 h-full m-auto text-center">
              <span className="text-lg">You have already voted.</span>
            </div>
          )}
          <div className="w-96 pt-10 h-full m-auto flex justify-center items-center align-center">
            {!voted && (
              <Link
                className="rounded bg-accented text-white p-3 mx-2"
                href="/vote"
              >
                Proceed
              </Link>
            )}
          </div>
        </>
      )}

      <Footer />
    </>
  );
}
