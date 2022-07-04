import Head from "next/head";
import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div>
      <Head>
        <title>Train Exits</title>
      </Head>
      <header className="border-b-8">
        <Link href="/">
          <a className="text-3xl font-bold underline">Train Exits</a>
        </Link>
        <br />
        <Link href="/">
          <a>New Route</a>
        </Link>
        <Link href="/saved-routes">
          <a>Saved Routes</a>
        </Link>
      </header>
      <main>{children}</main>
      <footer className="text-sm text-center">
        <p>All rights reserved.</p>
        <p>
          Copyright <br className="md:hidden"></br>© 2022 FAC24 final project
        </p>
      </footer>
    </div>
  );
}
