import { addCorrectFeedback } from "../../database/model";

export default async function handler(req, res) {
  const body = req.body;

  const result = await addCorrectFeedback(body.sid, body.platform_exits_id);

  res.status(200).json(result.rows);
  // res.status(200).json(body);
}
