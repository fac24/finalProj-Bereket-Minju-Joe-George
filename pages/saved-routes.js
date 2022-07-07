import Cookies from "cookies";
import crypto from "crypto";
import {
  createSession,
  getSession,
  getSavedRoutes,
  getAllStations,
  getAllLines,
} from "../database/model";
import Link from "next/link";
import FromToVia from "../components/FromToVia";

export async function getServerSideProps({ req, res }) {
  const cookieSigningKeys = [process.env.COOKIE_SECRET];

  const cookies = new Cookies(req, res, { keys: cookieSigningKeys });

  // Get the user's sid cookie. (If it doesn't exit, set to null)
  const sidCookie =
    cookies.get("sid", { signed: true, sameSite: "strict" }) || null;

  // Setup a variable for the saved routes (to be passed as a prop)
  let savedRoutes = null;

  // If the sid cookie is falsy, the user has no cookie, so set one
  if (!sidCookie) {
    // Generate unique sid and add to database
    const sid = await createSession(crypto.randomBytes(18).toString("base64"));

    // Set the sid cookie
    // cookies.set("sid", sid, { signed: true });

    // Test sid:
    cookies.set("sid", "anotherfakesessionid", { signed: true });
  } else {
    // The user has a cookie.

    // Is their sid in our db?
    const sid = await getSession(sidCookie);

    // If not, don't bother running the saved routes query
    // (This is an unnecessary optimisation right now! :)
    if (sid !== undefined) {
      savedRoutes = await getSavedRoutes(sidCookie);
    }
  }
  const stationNaptansToName = {};
  const lineIdToName = {};
  await Promise.all([
    getAllStations().then((resolve) =>
      resolve.map((station) => {
        stationNaptansToName[station.station_naptan] =
          station.common_name_short;
      })
    ),
    getAllLines().then((resolve) => {
      resolve.map((line) => (lineIdToName[line.id] = line.name));
    }),
  ]);

  return { props: { savedRoutes, stationNaptansToName, lineIdToName } };
}

export default function SavedRoutes({
  savedRoutes,
  stationNaptansToName,
  lineIdToName,
}) {
  //console.log(savedRoutes);
  // savedRoutes will be an empty array if the user has no saved routes,
  // and null if the user has no sid cookie. So check for both.
  if (savedRoutes === null || savedRoutes.length === 0) {
    return <p>No saved routes</p>;
  } else {
    return (
      <ul>
        {savedRoutes.map((route, index) => {
          const routeData = Object.entries(route.data);
          const startStationNaptan = routeData[0][1].startStationNaptan;
          const endStationNaptan =
            routeData[routeData.length - 1][1].endStationNaptan;
          const individualStopIds = [];
          const viaStationNaptans = [];
          const lineTaken = [];
          routeData.forEach((routeDatum) => {
            if (routeDatum[1]?.platformIndividualStopId) {
              individualStopIds.push(routeDatum[1].platformIndividualStopId);
            } else if (routeDatum[1]?.stationNaptan) {
              viaStationNaptans.push(routeDatum[1].stationNaptan);
            } else if (routeDatum[1]?.lineId) {
              lineTaken.push(routeDatum[1].lineId);
            }
          });
          const href = `/show-route?startStationNaptan=${startStationNaptan}&endStationNaptan=${endStationNaptan}&viaStationNaptans=${viaStationNaptans.join(
            ","
          )}&individualStopIds=${individualStopIds.join(",")}`;

          return (
            <li key={index} className="border-4 my-6 p-2">
              <Link href={href}>
                <a>
                  <ul>
                    <FromToVia
                      from={stationNaptansToName[startStationNaptan]}
                      to={stationNaptansToName[endStationNaptan]}
                      vias={viaStationNaptans.map(
                        (station) => stationNaptansToName[station]
                      )}
                    />
                    {lineTaken.map((lineId, index) => {
                      return (
                        <span key={index} className={lineId}>
                          {lineIdToName[lineId]}
                        </span>
                      );
                    })}
                  </ul>
                </a>
              </Link>
              <form method="POST" action="../api/delete-saved-route">
                <button name="route_id" value={route.route_id}>
                  <span className="central"> DELETE </span>
                </button>
              </form>
            </li>
          );
        })}
      </ul>
    );
  }
}
