export default function Instruction({ instruction, feedbackMode, sid }) {
  function feedbackCorrect(obj) {
    console.log(obj);
  }

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
          <button
            type="button"
            className="border rounded shadow-md bg-green-300 px-2 py-1"
            onClick={() =>
              feedbackCorrect({
                carriage: instruction.carriage,
                door: instruction.door,
                train_direction: instruction.train_direction,
                side: instruction.side,
                sid: sid,
              })
            }
          >
            Yes, this worked!
          </button>
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
