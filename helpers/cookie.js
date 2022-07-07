import Cookies from "cookies";
import crypto from "crypto";
import { createSession, getSession } from "../database/model";

export async function getOrCreateSid(req, res) {
  let sid;

  async function createSidAndSetCookie() {
    // Generate unique sid and add to database
    sid = await createSession(crypto.randomBytes(18).toString("base64"));

    // Set the sid cookie
    cookies.set("sid", sid, { signed: true });

    // Test sid:
    // cookies.set("sid", "anotherfakesessionid", { signed: true });
  }

  const cookieSigningKeys = [process.env.COOKIE_SECRET];

  const cookies = new Cookies(req, res, { keys: cookieSigningKeys });

  // Get the user's sid cookie. (If it doesn't exit, set to null)
  const sidCookie =
    cookies.get("sid", { signed: true, sameSite: "strict" }) || null;

  // If the sid cookie is falsy, the user has no cookie, so set one
  if (!sidCookie) {
    await createSidAndSetCookie();
  } else {
    // The user has a cookie.

    // Is their sid in our db?
    sid = await getSession(sidCookie);

    // If not (db returns undefined), then
    if (sid === undefined) {
      // Make a new session, overwriting the user's existing (bad/invalid/out-of-date) sid cookie
      await createSidAndSetCookie();
    }
  }

  return sid;
}
