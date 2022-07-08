import { removeExcessUnderground } from "./functions";

export default function JourneyBox({ journey, startEndNames }) {
  return journey.legs.map((leg, index, arr) => {
    const lineColour = leg.routeOptions[0].lineIdentifier?.id;
    const departurePoint = removeExcessUnderground(leg.departurePoint);
    const arrivalPoint = removeExcessUnderground(leg.arrivalPoint);

    return (
      <div key={index} className="block relative">
        <div className="inline-block text-lg">
          <div className="flex content-end">
            <div className="rounded-full border-4 border-black h-5 w-5 m-auto">
              &nbsp;
            </div>
            <span className="ml-2 mt-1">{departurePoint}</span>
          </div>
          <div className="h-7">
            <span className={`text-4xl ml-1.5 ${lineColour}`}>&nbsp;</span>
          </div>
          {index === arr.length - 1 ? (
            <div className="flex content-end mt-2.5">
              <div className="rounded-full border-4 border-black h-5 w-5 mt-2.5">
                &nbsp;
              </div>
              <span className="ml-2 mt-1.5">{arrivalPoint}</span>
            </div>
          ) : null}
        </div>
      </div>
    );
  });
}
