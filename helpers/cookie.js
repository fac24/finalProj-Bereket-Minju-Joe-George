import Cookies from "cookies";
import crypto from "crypto";
import { createSession, getSession } from "../database/model";

export async function getOrCreateSid(req, res) {
  const cookieSigningKeys = [process.env.COOKIE_SECRET];

  const cookies = new Cookies(req, res, { keys: cookieSigningKeys });

  // Get the user's sid cookie. (If it doesn't exit, set to null)
  const sidCookie =
    cookies.get("sid", { signed: true, sameSite: "strict" }) || null;

  let sid;

  // If the sid cookie is falsy, the user has no cookie, so set one
  if (!sidCookie) {
    // Generate unique sid and add to database
    sid = await createSession(crypto.randomBytes(18).toString("base64"));

    // Set the sid cookie
    cookies.set("sid", sid, { signed: true });

    // Test sid:
    // cookies.set("sid", "anotherfakesessionid", { signed: true });
  } else {
    // The user has a cookie.

    // Is their sid in our db?
    sid = await getSession(sidCookie);
  }

  return sid;
}
