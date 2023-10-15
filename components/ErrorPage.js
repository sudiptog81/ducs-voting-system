import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function StartPage() {
  return (
    <>
      <Navbar />
      <div className="w-96 pt-10 h-full m-auto flex justify-center items-center align-center font-semibold text-red">
        Error! Please contact the admin.
      </div>
      <div className="w-96 pt-10 h-full m-auto flex justify-center items-center align-center">
        <Link className="rounded bg-accented text-white p-3 mx-2" href="/">
          Go to Dashboard
        </Link>
      </div>
      <Footer />
    </>
  );
}
