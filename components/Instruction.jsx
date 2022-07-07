import { useState, useEffect } from "react";

export default function Instruction({
  instruction,
  routeData,
  feedbackMode,
  sid,
}) {
  // const [correctFeedback, setCorrectFeedback] = useState(false);
  const [correctVotes, setCorrectVotes] = useState(routeData.correct_votes);
  const [totalVotes, setTotalVotes] = useState(routeData.total_votes);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // console.log("form submitted");
    // Get the data from the form
    const data = {
      platform_exits_id: event.target.platform_exits_id.value,
      carriage: event.target.carriage.value,
      door: event.target.door.value,
      train_direction: event.target.train_direction.value,
      side: event.target.side.value,
      sid: event.target.sid.value,
      correct: event.target.correct.value,
    };

    // Send the data to the server in JSON format.
    const JSONdata = JSON.stringify(data);

    // API endpoint where we send form data.
    const endpoint = "/api/feedback";

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "POST",
      // Tell the server we're sending JSON.
      headers: {
        "Content-Type": "application/json",
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    };

    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options);

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result = await response.json();

    // If the user has already voted correct or incorrect, the response will be "false".
    // In that case, don't do anything.
    // In any other case, run the useState updaters.
    if (result !== false) {
      setCorrectVotes(result.correct_votes);
      setTotalVotes(result.total_votes);
    }
    // console.log(result);
  };

  return (
    <li className="p-2 my-4 border instruction-leg">
      <div className="mr-4 instruction-container">
        <h3 className="font-bold">{instruction.stationStart}</h3>
        <h4>
          <span
            className={instruction.line_id + " inline-block px-2 py-0.5 mr-2"}
          >
            {instruction.line_name}
          </span>
          {instruction.line_direction}
        </h4>
        <p className="border rounded bg-gray-100 p-2">
          Carriage {instruction.carriage}, door {instruction.door}
        </p>
        <p>
          The train comes from your{" "}
          <span className="font-bold">{instruction.train_direction}</span> side.
        </p>
        <p>
          Get on and off the train on{" "}
          <span className="font-bold">{instruction.side}</span>.
        </p>
        <p className="bg-amber-100 px-2 py-1 text-amber-800 text-sm">
          {correctVotes} out of {totalVotes} said this was correct
        </p>
      </div>
      {feedbackMode ? (
        <div className="feedback-forms-container">
          <form method="post" onSubmit={handleSubmit}>
            <input
              type="hidden"
              name="platform_exits_id"
              value={routeData.id}
            />
            <input type="hidden" name="carriage" value={instruction.carriage} />
            <input type="hidden" name="door" value={instruction.door} />
            <input
              type="hidden"
              name="train_direction"
              value={instruction.train_direction}
            />
            <input type="hidden" name="side" value={instruction.side} />
            <input type="hidden" name="sid" value={sid} />
            <input type="hidden" name="correct" value="true" />
            <button
              type="submit"
              className="border rounded shadow-sm bg-green-300 px-2 py-1"
            >
              Yes, this worked
            </button>
          </form>
          <form method="post" onSubmit={handleSubmit}>
            <input
              type="hidden"
              name="platform_exits_id"
              value={routeData.id}
            />
            <input type="hidden" name="carriage" value={instruction.carriage} />
            <input type="hidden" name="door" value={instruction.door} />
            <input
              type="hidden"
              name="train_direction"
              value={instruction.train_direction}
            />
            <input type="hidden" name="side" value={instruction.side} />
            <input type="hidden" name="sid" value={sid} />
            <input type="hidden" name="correct" value="false" />
            <button
              type="submit"
              className="border rounded shadow-sm bg-red-300 px-2 py-1"
            >
              No, this was wrong
            </button>
          </form>
        </div>
      ) : null}
    </li>
  );
}
