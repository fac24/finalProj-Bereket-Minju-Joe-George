import { getOrCreateSid } from "../helpers/cookie";
import FromToVia from "../components/FromToVia";
import HiddenInputs from "../components/HiddenInputs";

const baseJourneyURL = "https://api.tfl.gov.uk/Journey/JourneyResults/";

export async function getServerSideProps(params) {
  const sid = await getOrCreateSid(params.req, params.res);

  const formData = params.query;
  const isStepFree = formData.stepFree || null;
  const urlParams = {
    startStation: formData.startStation,
    endStation: formData.endStation,
    stepFree: isStepFree,
  };
  let url = `${baseJourneyURL}${urlParams.startStation}/to/${urlParams.endStation}?mode=tube,dlr,overground`;
  if (isStepFree) {
    url += `&accessibilityPreference=noSolidStairs,noEscalators,stepFreeToVehicle,stepFreeToPlatform`;
  }
  // console.log(url);
  const apiResponseData = await fetch(url).then((resolve) => resolve.json());
  const firstLeg = apiResponseData.journeys[0].legs;
  const startEndNames = {
    start: firstLeg[0].departurePoint.commonName
      .replace(" Underground Station", "")
      .replace(" Underground Stn", ""),
    end: firstLeg[firstLeg.length - 1].arrivalPoint.commonName
      .replace(" Underground Station", "")
      .replace(" Underground Stn", ""),
  };
  return { props: { apiResponseData, urlParams, startEndNames } };
}

export default function NewRoute({
  apiResponseData,
  urlParams,
  startEndNames,
}) {
  //const [apiResponseData, setApiResponseData] = useState(null);
  /*
  
  - Is there more than one leg?
  - If not, just show that route (say "direct").
  - If so, make an array of the interchange stops to show "vias".
  - We could do this by taking the commonName (or UID and get the other name from our DB!)
  of the first, second, third, etc., n-2'th arrivalPoint.
  
  */
  if (apiResponseData !== null) {
    if (apiResponseData.httpStatusCode === 404)
      return <h2>No Journeys Available</h2>;
    return (
      <>
        <FromToVia from={startEndNames.start} to={startEndNames.end} />
        <ul id="all-possible-routes">
          {apiResponseData.journeys.map(
            (
              journey,
              index // take dataResponse.journeys to map journey and render as list items
            ) => {
              const href = journey.legs.map(
                (leg) =>
                  `${leg.departurePoint.individualStopId},${leg.arrivalPoint.individualStopId}`
              );
              return (
                <li className="my-4 border route-option" key={index}>
                  <form
                    key={index}
                    action="../api/add-saved-route"
                    method="POST"
                    className="route-option-form flex p-4 cursor-pointer"
                    onClick={(event) => event.currentTarget.submit()}
                  >
                    <input
                      type="hidden"
                      name="href"
                      value={`/show-route?startStationNaptan=${
                        urlParams.startStation
                      }&endStationNaptan=${
                        urlParams.endStation
                      }&viaStationNaptans=${journey.legs.map(
                        (leg, index, arr) => {
                          if (index !== arr.length - 1) {
                            return leg.arrivalPoint.naptanId;
                          }
                        }
                      )}&individualStopIds=${href.join(",")}`}
                    />
                    <div className="mr-4">
                      {journey.legs.map(
                        (
                          leg,
                          index // map data to list journey
                        ) => (
                          // Todo: replace these text labels with colourful rectangles :)
                          // Use the line name as hidden text for a11y
                          // Maybe use a table so we can vertically align interchanges and lines.
                          <div key={index}>
                            <HiddenInputs leg={leg} />
                            <span
                              className={
                                leg.routeOptions[0].lineIdentifier?.id +
                                " block px-1.5 py-1"
                              }
                            >
                              {leg.routeOptions[0].lineIdentifier?.name}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                    <ul>
                      {journey.legs.map((leg, index, arr) =>
                        leg.routeOptions[0].lineIdentifier?.id ===
                        undefined ? null : arr.length === 1 ? (
                          <li key={index}>Direct</li>
                        ) : /* <li key={index}>{leg.instruction.summary}</li> */
                        // For all legs except the last, print the arrival station name,
                        // as this is equivalent to the "interchange" stop.
                        // (The arrival station of leg 1 will be the same as the departure station of leg 2, etc.)
                        index !== arr.length - 1 ? ( // if this is the last leg then list journey leg arrivalPoint name
                          <li key={index}>{leg.arrivalPoint.commonName}</li>
                        ) : null
                      )}
                    </ul>
                  </form>
                </li>
              );
            }
          )}
        </ul>
      </>
    );
  } else {
    return (
      <>
        <p>No journeys yet</p>
      </>
    );
  }
}
