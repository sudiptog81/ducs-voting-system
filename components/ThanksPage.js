import Link from "next/link";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import SpinnerLoading from "@/components/Loader";
import Footer from "@/components/Footer";

export default function ThanksPage() {
  const { data: session } = useSession();

  useEffect(() => {
    const audio = new Audio("/beep.mp3");
    audio.play();
  }, []);

  return (
    <>
      <Navbar />
      {session ? (
        <div className="w-96 pt-10 h-full m-auto flex justify-center items-center align-center font-semibold text-red">
          Vote has been recorded - thank you!
        </div>
      ) : (
        <>
          <div className="w-96 pt-10 h-full m-auto text-center flex items-center justify-center">
            <SpinnerLoading />
          </div>
        </>
      )}
      <div className="w-96 pt-10 h-full m-auto flex justify-center items-center align-center">
        <Link
          className="rounded bg-accented text-white p-3 mx-2 cursor-pointer"
          href="/"
        >
          Go to Dashboard
        </Link>
      </div>
      <Footer />
    </>
  );
}
