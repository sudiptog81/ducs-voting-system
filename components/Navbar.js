import Link from "next/link";

export default function Navbar({navigation}) {
  return (
    <nav className="bg-accented border-gray-200 dark:bg-accented">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <Link href="/" className="flex items-center">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">DUCS</span>
      </Link>
      <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1 text-white font-semibold" id="navbar-side">
        Student Society Elections 2023
      </div>
      </div>
    </nav>
  )
}
