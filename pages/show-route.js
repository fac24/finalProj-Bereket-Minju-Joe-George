import { getOrCreateSid } from "../helpers/cookie";

import FromToVia from "../components/FromToVia.jsx";
import Instruction from "../components/Instruction.jsx";
import {
  getPlatformDataFromIndividualStopPoints,
  getRouteByIndividualStopIds,
  getStationCommonNamesFromNaptans,
  getTrainDirectionFromIndividualStopPoints,
} from "../database/model.js";

import { useState, useEffect } from "react";
import MainFeedbackButton from "../components/MainFeedbackButton";

const toCommonNameShort = (resolve) => {
  return resolve.map((name) => name.common_name_short);
};

export async function getServerSideProps(params) {
  const sid = await getOrCreateSid(params.req, params.res);

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

  // console.log("\n\nmy log\n\n");
  // console.log(routeData);
  // console.log("\n\nend of my log\n\n");

  const stationStarts = [startStationCommonName, ...viaStationsCommonNames];

  const instructions = routeData.map((instruction, index) => {
    const side =
      departingPlatformData[index]?.train_direction ===
      arrivalDirections[index]?.train_direction
        ? "the same side"
        : "opposite sides";
    return {
      stationStart: stationStarts[index],
      carriage: instruction?.carriage_from_front || null,
      door: instruction?.door_from_front || null,
      line_id: departingPlatformData[index]?.line_id || null,
      line_name: departingPlatformData[index]?.line_name || null,
      line_direction: departingPlatformData[index]?.line_direction || null,
      train_direction: departingPlatformData[index]?.train_direction || null,
      side: side || null,
    };
  });

  const stationNames = {
    start: startStationCommonName,
    end: endStationCommonName,
    vias: viaStationsCommonNames,
  };

  return {
    props: {
      routeData,
      instructions,
      stationNames,
      sid,
    },
  };
}

export default function StartToVia({
  routeData,
  instructions,
  stationNames,
  sid,
}) {
  const [feedbackMode, setFeedbackMode] = useState(false);

  // console.log("instructions:");
  // console.log(instructions);
  // console.log("routedata:");
  // console.log(routeData);

  return (
    <>
      <FromToVia
        from={stationNames.start}
        to={stationNames.end}
        vias={stationNames.vias}
      />

      {instructions[0]?.line_id === undefined ? (
        <h3>Unfortunately no data is available for this route</h3>
      ) : (
        <>
          <ul id="all-instruction-legs">
            {instructions.map((instruction, index) => (
              <Instruction
                key={index}
                instruction={instruction}
                routeData={routeData[index]}
                feedbackMode={feedbackMode}
                sid={sid}
              />
            ))}
          </ul>

          <MainFeedbackButton
            feedbackMode={feedbackMode}
            setFeedbackMode={setFeedbackMode}
          />
        </>
      )}
    </>
  );
}
