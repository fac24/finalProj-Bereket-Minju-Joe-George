import Link from "next/link";
import Cookies from "cookies";
import crypto from "crypto";

import { getSession, createSession } from "../database/model";

import FromToVia from "../components/FromToVia.jsx";
import Instruction from "../components/Instruction.jsx";
import {
  getPlatformDataFromIndividualStopPoints,
  getRouteByIndividualStopIds,
  getStationCommonNamesFromNaptans,
  getTrainDirectionFromIndividualStopPoints,
} from "../database/model.js";

import { useState, useEffect } from "react";

const toCommonNameShort = (resolve) => {
  return resolve.map((name) => name.common_name_short);
};

export async function getServerSideProps(params) {
  const cookieSigningKeys = [process.env.COOKIE_SECRET];

  const cookies = new Cookies(params.req, params.res, {
    keys: cookieSigningKeys,
  });

  // Get the user's sid cookie. (If it doesn't exit, set to null)
  const sidCookie =
    cookies.get("sid", { signed: true, sameSite: "strict" }) || null;
  let sid;
  // If the sid cookie is falsy, the user has no cookie, so set one
  if (!sidCookie) {
    // Generate unique sid and add to database
    sid = await createSession(crypto.randomBytes(18).toString("base64"));

    // Set the sid cookie
    // cookies.set("sid", sid, { signed: true });

    // Test sid:
    cookies.set("sid", "anotherfakesessionid", { signed: true });
  } else {
    // The user has a cookie.

    // Is their sid in our db?
    sid = await getSession(sidCookie);
  }

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
      sid,
    },
  };
}

export default function StartToVia({ instructions, stationNames, sid }) {
  const [feedbackMode, setFeedbackMode] = useState(false);

  // console.log("query", query);
  return (
    <>
      <FromToVia
        from={stationNames.start}
        to={stationNames.end}
        vias={stationNames.vias}
      />
      <ul>
        {instructions.map((instruction, index) => (
          <Instruction
            key={index}
            instruction={instruction}
            feedbackMode={feedbackMode}
            sid={sid}
          />
        ))}
      </ul>

      <a
        className="bg-green-400 rounded py-1 px-2 hover:bg-green-500"
        onClick={() => setFeedbackMode(!feedbackMode)}
      >
        {feedbackMode ? <>Now submitting feedback</> : <>Is this correct?</>}
      </a>
    </>
  );
}
