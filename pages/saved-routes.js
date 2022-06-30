import Cookies from "cookies";

export async function getServerSideProps({ req, res }) {
  const cookieSigningKeys = [process.env.COOKIE_SECRET];

  const cookies = new Cookies(req, res, { keys: cookieSigningKeys });

  // Get a cookie
  const sidCookie =
    cookies.get("sid", { signed: true, sameSite: "strict" }) || null;

  if (!sidCookie) {
    // Set a cookie
    cookies.set("sid", "hello world", { signed: true });
  }

  return { props: { sidCookie: sidCookie } };
}

export default function SavedRoutes(props) {
  return (
    <>
      <p>Saved routes!</p>
    </>
  );
}
