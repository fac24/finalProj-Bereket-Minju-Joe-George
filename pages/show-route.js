import {
  getRouteByIndividualStopIds,
  getStationCommonNamesFromNaptans,
} from "../database/model.js";

export async function getServerSideProps(params) {
  // The URL query string will look a bit like this:
  // /show-route?startStationNaptan=...&endStationNaptan=...&viaStationNaptans=...,...,&individualStopIds=...,...,...,...
  // See the big <Link>in new-route.js for the exact format of the URL query string.

  // Split comma-delimited lists in URL query strings into new arrays
  const platforms = params.query.individualStopIds.split(",");
  const vias = params.query.viaStationNaptans.split(",");
  const departingPlatforms = platforms.filter((id, index) => index % 2 === 0);
  // await a bunch of DB queries and send as props
  const [
    startStationCommonName,
    endStationCommonName,
    viaStationsCommonNames,
    ...routeData
  ] = await Promise.all([
    getStationCommonNamesFromNaptans([params.query.startStationNaptan]),
    getStationCommonNamesFromNaptans([params.query.endStationNaptan]),
    getStationCommonNamesFromNaptans(vias).then((resolve) =>
      resolve.map((name) => name.common_name_short)
    ),
    getRouteByIndividualStopIds(platforms),
  ]);

  const data = routeData[0];

  console.log(data);

  // - ////// Platform name - line
  // - ////////where to stand for next arrival point
  // - ////Station name
  // -

  return {
    props: {
      data: data,
      startStationCommonName: startStationCommonName[0].common_name_short,
      endStationCommonName: endStationCommonName[0].common_name_short,
      viaStationsCommonNames,
    },
  };
}

export default function StartToVia({
  data,
  startStationCommonName,
  endStationCommonName,
  viaStationsCommonNames,
}) {
  // console.log(viaStationsCommonNames);
  const stationStarts = [startStationCommonName, ...viaStationsCommonNames];
  return (
    <>
      <h2>
        <b>{startStationCommonName}</b> to <b>{endStationCommonName}</b>
        {viaStationsCommonNames.length !== 0 ? (
          <div>
            via{" "}
            {viaStationsCommonNames.map((element, index, array) => (
              <>
                <b>{element}</b>
                {index !== array.length - 1 ? (
                  <>
                    {/* todo: on the last iteration, say " and" instead of "," :) */}
                    , <br />
                  </>
                ) : null}
              </>
            ))}
          </div>
        ) : null}
      </h2>
      <ul>
        {data.map((leg, index) => (
          <li key={index}>
            <h3>{stationStarts[index]}</h3>
            Carriage {leg.carriage_from_front}, door {leg.door_from_front}
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
