export default function Instruction({ instruction }) {
  return (
    <li className="p-4 my-4 border flex">
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
    </li>
  );
}
