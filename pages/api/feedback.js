import { addFeedback, getVote, updateFeedback } from "../../database/model";

export default async function handler(req, res) {
  const body = req.body;
  // turn from string to boolean
  const correct = body.correct === "true" ? true : false;

  // check if respective sid and respective platform_exit_id is already in db returning true/false (if there)
  const checkSidCorrectVotes = await getVote(body.sid, body.platform_exits_id);
  if (checkSidCorrectVotes?.correct === undefined) {
    //if not already in db then we add their vote to the db
    // increase total votes by 1
    // if true will also increase correct votes by 1
    await addFeedback(body.sid, body.platform_exits_id, correct); // await addFeedback(body.sid, body.platform_exits_id, false);
  } else if (checkSidCorrectVotes.correct !== correct) {
    // if already in the db will then check if the button clicked is the opposite of what's under their sid in db
    // and update their vote to ¬vote
    // if true correct_vote +1
    // if false correct_vote -1
    await updateFeedback(body.sid, body.platform_exits_id, correct);
  }

  //res.status(200); //.json(result.rows);
  res.status(200).json(body);
}
