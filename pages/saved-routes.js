import Cookies from "cookies";
import crypto from "crypto";
import { createSession, getSession, getSavedRoutes } from "../database/model";

export async function getServerSideProps({ req, res }) {
  const cookieSigningKeys = [process.env.COOKIE_SECRET];

  const cookies = new Cookies(req, res, { keys: cookieSigningKeys });

  // Get the user's sid cookie. (If it doesn't exit, set to null)
  const sidCookie =
    cookies.get("sid", { signed: true, sameSite: "strict" }) || null;

  // Setup a variable for the saved routes (to be passed as a prop)
  let savedRoutes = null;

  // If the sid cookie is falsy, the user has no cookie, so set one
  if (!sidCookie) {
    // Generate unique sid and add to database
    const sid = await createSession(crypto.randomBytes(18).toString("base64"));

    // Set the sid cookie
    cookies.set("sid", sid, { signed: true });

    // Test sid:
    // cookies.set("sid", "anotherfakesessionid", { signed: true });
  } else {
    // The user has a cookie.

    // Is their sid in our db?
    const sid = await getSession(sidCookie);

    // If not, don't bother running the saved routes query
    // (This is an unnecessary optimisation right now! :)
    if (sid !== undefined) {
      savedRoutes = await getSavedRoutes(sidCookie);
    }
  }

  return { props: { savedRoutes } };
}

export default function SavedRoutes({ savedRoutes }) {
  // savedRoutes will be an empty array if the user has no saved routes,
  // and null if the user has no sid cookie. So check for both.
  if (savedRoutes === null || savedRoutes.length === 0) {
    return <p>No saved routes</p>;
  } else {
    return (
      <ul>
        {savedRoutes.map((route, index) => (
          <li key={index}>{route.name}</li>
        ))}
      </ul>
    );
  }
}
