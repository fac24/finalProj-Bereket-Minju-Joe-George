import Link from "next/link";

const baseJourneyURL = "https://api.tfl.gov.uk/Journey/JourneyResults/";
import Cookies from "cookies";

import { getSession } from "../database/model";

export async function getServerSideProps(params) {
  const cookieSigningKeys = [process.env.COOKIE_SECRET];

  const cookies = new Cookies(params.req, params.res, {
    keys: cookieSigningKeys,
  });

  const sidCookie =
    cookies.get("sid", { signed: true, sameSite: "strict" }) || null;

  const sid = await getSession(sidCookie);

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
  return { props: { apiResponseData, urlParams } };
}

export default function NewRoute({ apiResponseData, urlParams }) {
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
        <h2>
          From <b>{urlParams.startStation}</b> to <b>{urlParams.endStation}</b>{" "}
          via:
        </h2>
        <ul>
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
                <Link
                  key={index}
                  href={`/show-route?startStationNaptan=${
                    urlParams.startStation
                  }&endStationNaptan=${
                    urlParams.endStation
                  }&viaStationNaptans=${journey.legs.map((leg, index, arr) => {
                    if (index !== arr.length - 1) {
                      return leg.arrivalPoint.naptanId;
                    }
                  })}&individualStopIds=${href.join(",")}`}
                >
                  <a>
                    <li className="p-4 my-4 border flex">
                      <div className="border mr-4">
                        {journey.legs.map(
                          (
                            leg,
                            index,
                            arr // map data to list journey
                          ) => (
                            // Todo: replace these text labels with colourful rectangles :)
                            // Use the line name as hidden text for a11y
                            // Maybe use a table so we can vertically align interchanges and lines.
                            <div key={index}>
                              {leg.routeOptions[0].lineIdentifier?.name}
                            </div>
                          )
                        )}
                      </div>
                      <ul>
                        {journey.legs.map((leg, index, arr) =>
                          /* <li key={index}>{leg.instruction.summary}</li> */
                          // For all legs except the last, print the arrival station name,
                          // as this is equivalent to the "interchange" stop.
                          // (The arrival station of leg 1 will be the same as the departure station of leg 2, etc.)
                          index !== arr.length - 1 ? ( // if this is the last leg then list journey leg arrivalPoint name
                            <li key={index}>{leg.arrivalPoint.commonName}</li>
                          ) : null
                        )}
                      </ul>
                    </li>
                  </a>
                </Link>
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
