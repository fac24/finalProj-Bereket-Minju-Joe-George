export default function Instruction({ instruction, feedbackMode, sid }) {
  function feedbackCorrect(obj) {
    // console.log(obj);
    // fetch("/api/feedback", { method: "POST", body: JSON.stringify(obj) })
    //   .then((resolve) => resolve.json())
    //   .then((resolve) => console.log(resolve));
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("form submitted");

    // Get the data from the form
    const data = {
      carriage: event.target.carriage.value,
      door: event.target.door.value,
      train_direction: event.target.train_direction.value,
      side: event.target.side.value,
      sid: event.target.sid.value,
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

    console.log(result);
  };

  return (
    <li className="p-4 my-4 border">
      <div className="border mr-4">
        <h3>{instruction.stationStart}</h3>
        <h4>
          <span className={instruction.line_id}>{instruction.line_name}</span>
          &#8226;
          {instruction.line_direction}
        </h4>
        <p>
          Carriage {instruction.carriage}, door {instruction.door}
        </p>
        <p>The train comes from your {instruction.train_direction} side </p>
        <p>Get on and off the train on {instruction.side}</p>
      </div>
      {feedbackMode ? (
        <div>
          <form action="/api/feedback" method="post" onSubmit={handleSubmit}>
            <input type="hidden" name="carriage" value={instruction.carriage} />
            <input type="hidden" name="door" value={instruction.door} />
            <input
              type="hidden"
              name="train_direction"
              value={instruction.train_direction}
            />
            <input type="hidden" name="side" value={instruction.side} />
            <input type="hidden" name="sid" value={sid.sid} />
            <button
              type="submit"
              className="border rounded shadow-md bg-green-300 px-2 py-1"
              onClick={() =>
                feedbackCorrect({
                  carriage: instruction.carriage,
                  door: instruction.door,
                  train_direction: instruction.train_direction,
                  side: instruction.side,
                  sid: sid,
                  station_common_name: instruction.stationStart[0],
                })
              }
            >
              Yes, this worked
            </button>
          </form>
          <button
            type="button"
            className="border rounded shadow-md bg-red-300 px-2 py-1"
          >
            No, this was wrong
          </button>
        </div>
      ) : null}
    </li>
  );
}
