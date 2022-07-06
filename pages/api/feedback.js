import { addFeedback } from "../../database/model";

export default async function handler(req, res) {
  const body = req.body;

  // const parsed = JSON.parse(req.body);

  // console.log(JSON.parse(body).side);
  // res.status(200).json("it works");
  // res.status(200).json(parsed);

  res.status(200).json(body);
}
