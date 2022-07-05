import Head from "next/head";
import Link from "next/link";
import MainNavButton from "./MainNavButton";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Train Exits</title>
      </Head>
      <div className="mx-auto max-w-xs pt-5">
        <header className="text-center mb-6">
          <h1 className="mb-3">
            <Link href="/">
              <a className="text-3xl font-bold">Train Exits</a>
            </Link>
          </h1>
          <nav className="flex gap-x-2 justify-center">
            <MainNavButton href="/" text="New route" />
            <MainNavButton href="/saved-routes" text="Saved routes" />
          </nav>
        </header>
        <main>{children}</main>
        <footer className="text-sm text-center mt-6 mb-4 pt-3 border-t">
          <p>FAC24 final project</p>
          <p>Bereket, George, Joe, Minju</p>
        </footer>
      </div>
    </>
  );
}
