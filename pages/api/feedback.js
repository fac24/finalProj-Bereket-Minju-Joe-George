import { addFeedback } from "../../database/model";

export default async function handler(req, res) {
  const body = req.body;

  const result = await addFeedback(body.sid, body.platform_exits_id, true);

  res.status(200).json(result.rows);
  // res.status(200).json(body);
}
