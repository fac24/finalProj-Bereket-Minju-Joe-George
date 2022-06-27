import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Hello world!</title>
      </Head>

      <main>
        <h1 className="text-3xl font-bold underline">hello world!</h1>
      </main>

      <footer></footer>
    </div>
  );
}
