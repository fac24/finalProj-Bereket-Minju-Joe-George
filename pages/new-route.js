const baseJourneyURL = "https://api.tfl.gov.uk/Journey/JourneyResults/";

export async function getServerSideProps(params) {
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
  console.log(url);
  const apiResponseData = await fetch(url).then((resolve) => resolve.json());
  return { props: { apiResponseData: apiResponseData } };
}

export default function NewRoute({ apiResponseData }) {
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
          From <b>Finsbury Park</b> to <b>Bermondsey</b> via:
        </h2>
        <ul>
          {apiResponseData.journeys.map((journey, index) => (
            <li key={index} className="p-4 my-4 border flex">
              <div className="border mr-4">
                {journey.legs.map((leg, index, arr) => (
                  // Todo: replace these text labels with colourful rectangles :)
                  // Use the line name as hidden text for a11y
                  // Maybe use a table so we can vertically align interchanges and lines.
                  <div key={index}>
                    {leg.routeOptions[0].lineIdentifier?.name}
                  </div>
                ))}
              </div>
              <ul>
                {journey.legs.map((leg, index, arr) =>
                  /* <li key={index}>{leg.instruction.summary}</li> */
                  // For all legs except the last, print the arrival station name,
                  // as this is equivalent to the "interchange" stop.
                  // (The arrival station of leg 1 will be the same as the departure station of leg 2, etc.)
                  index !== arr.length - 1 ? (
                    <li key={index}>{leg.arrivalPoint.commonName}</li>
                  ) : null
                )}
              </ul>
            </li>
          ))}
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
