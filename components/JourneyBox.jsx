import { removeExcessUnderground } from "./functions";

export default function JourneyBox({ journey, startEndNames }) {
  return journey.legs.map((leg, index, arr) => {
    const lineColour = leg.routeOptions[0].lineIdentifier?.id;
    const departurePoint = removeExcessUnderground(leg.departurePoint);
    const arrivalPoint = removeExcessUnderground(leg.arrivalPoint);

    return (
      <div key={index} className="block relative">
        <div className="inline-block text-lg">
          <div className="flex">
            <div className="rounded-full border-4 border-black h-4">&nbsp;</div>
            <span>{departurePoint}</span>
          </div>
          <div className="h-full">
            <span className={lineColour}>&nbsp;</span>
          </div>
          {index === arr.length - 1 ? (
            <div className="flex">
              <div className="rounded-full border-4 border-black h-4">
                &nbsp;
              </div>
              <span>{arrivalPoint}</span>
            </div>
          ) : null}
        </div>
      </div>
    );
  });
}
