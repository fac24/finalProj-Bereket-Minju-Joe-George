import {
  getPlatformDataFromIndividualStopPoints,
  getRouteByIndividualStopIds,
  getStationCommonNamesFromNaptans,
  getTrainDirectionFromIndividualStopPoints,
} from "../database/model.js";

export async function getServerSideProps(params) {
  // The URL query string will look a bit like this:
  // /show-route?startStationNaptan=...&endStationNaptan=...&viaStationNaptans=...,...,&individualStopIds=...,...,...,...
  // See the big <Link>in new-route.js for the exact format of the URL query string.

  // Split comma-delimited lists in URL query strings into new arrays
  const platforms = params.query.individualStopIds.split(",");

  const vias = params.query.viaStationNaptans.split(",");
  const departingPlatformIsds = platforms.filter(
    (id, index) => index % 2 === 0
  );
  const arrivingPlatformIsds = platforms.filter((id, index) => index % 2 === 1);

  // await a bunch of DB queries and send as props
  const [
    startStationCommonName,
    endStationCommonName,
    viaStationsCommonNames,
    departingPlatformData,
    arrivalDirections,
    routeData,
  ] = await Promise.all([
    getStationCommonNamesFromNaptans([params.query.startStationNaptan]).then(
      (resolve) => resolve[0].common_name_short
    ),
    getStationCommonNamesFromNaptans([params.query.endStationNaptan]).then(
      (resolve) => resolve[0].common_name_short
    ),
    getStationCommonNamesFromNaptans(vias).then((resolve) =>
      resolve.map((name) => name.common_name_short)
    ),
    getPlatformDataFromIndividualStopPoints(departingPlatformIsds),
    getTrainDirectionFromIndividualStopPoints(arrivingPlatformIsds),
    getRouteByIndividualStopIds(platforms),
  ]);

  const stationStarts = [startStationCommonName, ...viaStationsCommonNames];
  console.log(stationStarts);

  const instructions = routeData.map((instruction, index) => {
    const side =
      departingPlatformData[index].train_direction ===
      arrivalDirections[index].train_direction
        ? "the same side"
        : "opposite sides";
    return {
      stationStart: stationStarts[index],
      carriage: instruction.carriage_from_front,
      door: instruction.door_from_front,
      line_name: departingPlatformData[index].line_name,
      line_direction: departingPlatformData[index].line_direction,
      train_direction: departingPlatformData[index].train_direction,
      side: side,
    };
  });

  const stationNames = {
    start: startStationCommonName,
    end: endStationCommonName,
    vias: viaStationsCommonNames,
  };

  return {
    props: {
      instructions,
      stationNames,
    },
  };
}

export default function StartToVia({ instructions, stationNames }) {
  return (
    <>
      <h2>
        <b>{stationNames.start}</b> to <b>{stationNames.end}</b>
        {stationNames.vias.length !== 0 ? (
          <div>
            via{" "}
            {stationNames.vias.map((element, index, array) => (
              <>
                <b>{element}</b>
                {index !== array.length - 2 ? (
                  <>
                    {/* todo: on the last iteration, say " and" instead of "," :) */}
                    , <br />
                  </>
                ) : index !== array.length - 1 ? (
                  <> and </>
                ) : null}
              </>
            ))}
          </div>
        ) : null}
      </h2>
      <ul>
        {instructions.map((instruction, index) => (
          <li key={index} className="p-4 my-4 border flex">
            <div className="border mr-4">
              <h3>{instruction.stationStart}</h3>
              <h4>
                {instruction.line_name}
                &#8226;
                {instruction.line_direction}
              </h4>
              <p>
                Carriage {instruction.carriage}, door {instruction.door}
              </p>
              <p>
                The train comes from your {instruction.train_direction} side{" "}
              </p>
              <p>Get on and off the train on {instruction.side}</p>
            </div>
          </li>
        ))}
        {/*

        Get in carriage {data[0].carriage_from_front} and door{" "}
        {data[0].door_from_front} at {startStationCommonName} To be able to
        quickly change at {viaStationsCommonNames[0].common_name_short}
*/}
      </ul>
    </>
  );
}
