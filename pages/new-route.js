import { getOrCreateSid } from "../helpers/cookie";
import { removeExcessUnderground } from "../components/functions.js";
import FromToVia from "../components/FromToVia";
import HiddenInputs from "../components/HiddenInputs";
import JourneyBox from "../components/JourneyBox";

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
    start: removeExcessUnderground(firstLeg[0].departurePoint),
    end: removeExcessUnderground(firstLeg[firstLeg.length - 1].arrivalPoint),
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
          {apiResponseData.journeys
            .filter((journey, index, arr) => {
              if (
                journey.legs[0].mode.id === "walking" &&
                journey.legs.length === 1
              )
                return false;
              return true;
            })
            .filter((journey, index, arr) => {
              for (let i = index + 1; i < arr.length; i++) {
                for (let j = 0; j < journey.legs.length; j++) {
                  if (
                    journey.legs[j]?.path.lineString ===
                    arr[i].legs[j]?.path.lineString
                  )
                    return false;
                }
              }
              return true;
            })
            .map(
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
                            </div>
                          )
                        )}
                        <JourneyBox
                          journey={journey}
                          startEndNames={startEndNames}
                        />
                      </div>
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
