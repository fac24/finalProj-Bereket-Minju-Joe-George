import Cookies from "cookies";
import { getSavedRoutes } from "../database/model";
// import { createSession, getSession, getSavedRoutes } from "../database/model";

export async function getServerSideProps({ req, res }) {
  const cookieSigningKeys = [process.env.COOKIE_SECRET];

  const cookies = new Cookies(req, res, { keys: cookieSigningKeys });

  // Get a cookie
  const sidCookie =
    cookies.get("sid", { signed: true, sameSite: "strict" }) || null;
  let savedRoutes;
  if (!sidCookie) {
    // Set a cookie
    cookies.set("sid", "anotherfakesessionid", { signed: true });
  } else {
    savedRoutes = await getSavedRoutes(sidCookie);
  }
  return { props: { savedRoutes } };
}

export default function SavedRoutes({ savedRoutes }) {
  return (
    <ul>
      {savedRoutes.map((route, index) => (
        <li key={index}>{route.name}</li>
      ))}
    </ul>
  );
}
