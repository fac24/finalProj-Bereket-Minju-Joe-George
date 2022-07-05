import FromToVia from "../components/FromToVia.jsx";
import Instruction from "../components/Instruction.jsx";
import {
  getPlatformDataFromIndividualStopPoints,
  getRouteByIndividualStopIds,
  getStationCommonNamesFromNaptans,
  getTrainDirectionFromIndividualStopPoints,
} from "../database/model.js";

const toCommonNameShort = (resolve) => {
  return resolve.map((name) => name.common_name_short);
};

export async function getServerSideProps(params) {
  // The URL query string will look a bit like this:
  // /show-route?startStationNaptan=...&endStationNaptan=...&viaStationNaptans=...,...,&individualStopIds=...,...,...,...
  // See the big <Link>in new-route.js for the exact format of the URL query string.

  // Split comma-delimited lists in URL query strings into new arrays
  const platforms = params.query.individualStopIds.split(",");
  const vias = params.query.viaStationNaptans.split(",");
  const departingPlatformIsds = platforms.filter((_, index) => index % 2 === 0);
  const arrivingPlatformIsds = platforms.filter((_, index) => index % 2 === 1);
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
      toCommonNameShort
    ),
    getStationCommonNamesFromNaptans([params.query.endStationNaptan]).then(
      toCommonNameShort
    ),
    getStationCommonNamesFromNaptans(vias).then(toCommonNameShort),
    getPlatformDataFromIndividualStopPoints(departingPlatformIsds),
    getTrainDirectionFromIndividualStopPoints(arrivingPlatformIsds),
    getRouteByIndividualStopIds(platforms),
  ]);

  const stationStarts = [startStationCommonName, ...viaStationsCommonNames];

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
      line_id: departingPlatformData[index].line_id,
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
      <FromToVia
        from={stationNames.start}
        to={stationNames.end}
        vias={stationNames.vias}
      />
      <ul>
        {instructions.map((instruction, index) => (
          <Instruction key={index} instruction={instruction} />
        ))}
      </ul>
    </>
  );
}
