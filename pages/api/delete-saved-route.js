import { deleteSavedRoute } from "../../database/model";
import { getOrCreateSid } from "../../helpers/cookie";

export default async function DeleteSavedRoute(req, res) {
  const body = req.body;
  const sid = await getOrCreateSid(req, res);
  await deleteSavedRoute(body.route_id, sid);
  res.redirect("/saved-routes");
}
