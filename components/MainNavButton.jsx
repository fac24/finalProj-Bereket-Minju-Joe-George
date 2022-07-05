import Link from "next/link";
import { useRouter } from "next/router";

export default function MainNavButton({ href, text }) {
  const router = useRouter();
  const pathname = router.pathname;

  let myClassName = "border rounded-md py-1 px-3 ";

  if (pathname === href) {
    myClassName += "bg-slate-600 text-white";
  } else {
    myClassName += "bg-slate-200 hover:bg-slate-300";
  }

  return (
    <Link href={href}>
      <a className={myClassName}>{text}</a>
    </Link>
  );
}
