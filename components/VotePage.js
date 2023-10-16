"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import SpinnerLoading from "@/components/Loader";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";

export default function StartPage() {
  const { push } = useRouter();
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [voted, setVoted] = useState(false);

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

      fetch("/api/posts")
        .then((res) => res.json())
        .then((res) => {
          setPosts(res);
          setLoading(false);
        });
    }
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setBtnLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("secret", process.env.NEXT_PUBLIC_SECRET);

    const object = {};
    formData.forEach((value, key) => {
      object[key] = value;
    });

    if (!object?.agree) {
      alert("Please agree to the terms and conditions!");
      return;
    }

    for (let p of posts) {
      if (!object[p.post]) {
        alert(
          `Please vote for at least one candidate for the post of ${p.post}!`,
        );

        setBtnLoading(false);
        return;
      }
    }

    object["votes"] = {};
    for (const [key, value] of formData.entries()) {
      if (key != "email" && key != "agree" && key != "secret") {
        object["votes"][key] = value;
      }
    }

    const response = await fetch("/api/vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(object),
    });

    const { success } = await response.json();

    setBtnLoading(false);

    if (success) {
      push("/thanks");
    } else {
      push("/error");
    }
  };

  return (
    <>
      <Navbar />
      {voted && (
        <>
          <div className="w-96 pt-10 h-full m-auto flex justify-center items-center align-center font-semibold text-red">
            You have already voted - you cannot vote again!
          </div>
          <div className="w-96 pt-10 h-full m-auto flex justify-center items-center align-center">
            <Link
              className="rounded bg-accented text-white p-3 mx-2 cursor-pointer"
              href="/"
            >
              Go to Dashboard
            </Link>
          </div>
        </>
      )}
      {session && !voted && (
        <>
          {posts.length == 0 && (
            <div className="w-full pt-10 h-full m-auto text-center flex items-center justify-center">
              <SpinnerLoading />
            </div>
          )}
          <form id="voting-form" onSubmit={handleSubmit}>
            <input type="hidden" name="email" value={session.user.email} />
            <div className="w-6/12 pt-10 h-full m-auto grid grid-cols-2 gap-x-4 justify-between">
              {posts &&
                posts.map((e, i) => (
                  <div key={i} id="post-div p-4 row-gap-4">
                    <h2 className="font-semibold mt-4 mb-2">{e.post}</h2>
                    <div className="flex flex-col">
                      <fieldset className="space-y-4">
                        {e.candidates.map((_e, i) => (
                          <div key={i} id="candidate-div" className="flex mb-2">
                            <input
                              type="radio"
                              name={e.post}
                              value={_e.name}
                              id={
                                _e.name.replaceAll(/\s+/g, "-") + "-" + e.post
                              }
                              className="peer hidden [&:checked_+_label_svg]:block"
                            />

                            <label
                              htmlFor={
                                _e.name.replaceAll(/\s+/g, "-") + "-" + e.post
                              }
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
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                              {_e.course != "NOTA" && (
                                <p className="mt-1 text-accented">
                                  {_e.course}
                                </p>
                              )}
                            </label>
                          </div>
                        ))}
                      </fieldset>
                    </div>
                  </div>
                ))}
            </div>
            <div className="w-100 pt-10 h-full m-auto flex justify-center items-center align-center">
              <input type="checkbox" required name="agree" id="agree" />
              <label htmlFor="agree" className="ml-2">
                I confirm that I am voting for the selected candidates and will
                not be able to change my choice or vote again.
              </label>
            </div>
            <div className="w-96 pt-10 h-full m-auto flex justify-center items-center align-center">
              {!btnLoading ? (
                <input
                  className="rounded bg-accented text-white p-3 mx-2 cursor-pointer"
                  type="submit"
                />
              ) : (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    class="inline w-12 h-12 mr-2 animate-spin rounded text-accented p-3 dark:text-gray-600 fill-[#652b7c]"
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
            </div>
          </form>
        </>
      )}
      <Footer />
    </>
  );
}
