import { deleteSavedRoute } from "../../database/model";
import Cookies from "cookies";

export default async function DeleteSavedRoute(req, res) {
  const body = req.body;
  const cookieSigningKeys = [process.env.COOKIE_SECRET];
  // Get the sid to be able to save to the db for saved routes
  const cookies = new Cookies(req, res, { keys: cookieSigningKeys });
  const sid = cookies.get("sid", { signed: true, sameSite: "strict" });
  await deleteSavedRoute(body.route_id, sid);
  res.redirect("/saved-routes");
}
