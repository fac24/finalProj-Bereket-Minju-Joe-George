const db = require("./connection.js");

async function getAllStations() {
  const SELECT_ALL_STATIONS = /* SQL */ `SELECT * FROM stations ORDER BY common_name_short;`;
  const allStations = await db.query(SELECT_ALL_STATIONS);
  return allStations.rows;
}

async function createSession(sid) {
  const CREATE_SESSION = `INSERT INTO sessions (sid) VALUES ($1) RETURNING sid;`;
  const session = await db.query(CREATE_SESSION, [sid]);
  return session.rows[0].sid;
}

async function getSession(sid) {
  const SELECT_SESSION = `SELECT * FROM sessions WHERE sid = $1;`;
  const session = await db.query(SELECT_SESSION, [sid]);
  return session.rows[0];
}

async function getSavedRoutes(sid) {
  const SELECT_ROUTES = `SELECT data FROM session_routes LEFT JOIN routes ON session_routes.route_id = routes.id WHERE sid = $1;`;
  const routes = await db.query(SELECT_ROUTES, [sid]);
  return routes.rows;
}

async function getStation(stationNaptan) {
  const SELECT_STATION = `SELECT common_name_short FROM stations WHERE station_naptan=$1;`;
  const station = await db.query(SELECT_STATION, [stationNaptan]);
  return station.rows[0];
}
// Get data from db to then send as props
// - Platform name - line
// - where to stand for next arrival point
// - Station name
// -

async function getRouteByIndividualStopIds(stopIds) {
  const arrivalPoints = stopIds.filter((stopId, index) => index % 2 === 1);
  const departurePoints = stopIds.filter((stopId, index) => index % 2 === 0);

  const SELECT_PLATFORM_EXIT_ID = /* SQL */ `
    SELECT platform_exit_id 
    FROM exit_interchanges 
    WHERE dest_platform_id = (
      SELECT id 
      FROM platforms 
      WHERE individual_stop_id = $1
    )
  `;

  const query1 = await Promise.all(
    departurePoints.map((departurePoint) =>
      db
        .query(SELECT_PLATFORM_EXIT_ID, [departurePoint])
        .then((res) => res.rows)
    )
  );
  // For hard coded we get [[], [{id for exit interchange}]]

  const SELECT_PLATFORM_EXITS = /* SQL */ `
    SELECT *
    FROM platform_exits
    WHERE platform_id = (
      SELECT id 
      FROM platforms 
      WHERE individual_stop_id = $1
    )
  `;

  let SELECT_INTERCHANGE;
  let SELECT_EXIT;
  const query2 = await Promise.all(
    arrivalPoints
      .map((arrivalPoint, index, arr) => {
        if (index !== arr.length - 1) {
          SELECT_INTERCHANGE = SELECT_PLATFORM_EXITS + `AND id = $2`;
          return [arrivalPoint, query1[index + 1][0].platform_exit_id];
        } else {
          SELECT_EXIT = SELECT_PLATFORM_EXITS + `AND type = $2`;
          return [arrivalPoint, 0];
        }
      })
      .map((arrivalPoint, index, arr) => {
        if (arr.length === index + 1) {
          return db.query(SELECT_EXIT, arrivalPoint).then((res) => res.rows[0]);
        } else {
          return db
            .query(SELECT_INTERCHANGE, [arrivalPoint[0], arrivalPoint[1]])
            .then((res) => res.rows[0]);
        }
      })
  );

  return query2;
}

async function getStationNameByIndividualStopIds(stopIds) {
  const SELECT_STATION_NAMES = /* SQL */ `
    SELECT common_name_short 
    FROM stations 
    WHERE station_naptan = (
      SELECT station_naptan
      FROM platforms 
      WHERE individual_stop_id = $1
    )
  `;

  const stationNames = await Promise.all(
    stopIds.map((stopId) => {
      return db
        .query(SELECT_STATION_NAMES, [stopId])
        .then((res) => res.rows[0]);
    })
  );
  return stationNames;
}

// async function getStation(stationNaptan) {
//   const SELECT_STATION = `SELECT common_name_short FROM stations WHERE station_naptan=$1;`;
//   const station = await db.query(SELECT_STATION, [stationNaptan]);
//   return station.rows[0];
// }

// Takes an array of station naptans and returns an array of rows with one column (common_name_short)
async function getStationCommonNamesFromNaptans(stationNaptans) {
  const SELECT_STATIONS = /* SQL */ `
    SELECT common_name_short
    FROM stations
    WHERE station_naptan = ANY ($1)
    ORDER BY idx($1, station_naptan) -- Look at init.sql for what idx does
  `;

  const stationNames = await db.query(SELECT_STATIONS, [stationNaptans]);

  return stationNames.rows;
}

async function getPlatformDataFromIndividualStopPoints(stopIds) {
  const SELECT_PLATFORM_DATA = /* SQL */ `
    SELECT platforms.tfl_public_direction_name AS line_direction, platforms.train_direction, lines.name AS line_name
    FROM platforms, lines, platform_line
    WHERE (lines.id = platform_line.line_id AND platforms.id = platform_line.platform_id)
    AND platforms.individual_stop_id = ANY ($1)
    ORDER BY idx($1, station_naptan)
  `;
  const platformData = await db.query(SELECT_PLATFORM_DATA, [stopIds]);
  return platformData.rows;
}

async function getTrainDirectionFromIndividualStopPoints(stopIds) {
  const SELECT_TRAIN_DIRECTION = /*SQL*/ `
    SELECT train_direction
    FROM platforms
    WHERE individual_stop_id = ANY ($1)
    ORDER BY idx($1, station_naptan)
  `;
  const trainDirections = await db.query(SELECT_TRAIN_DIRECTION, [stopIds]);
  return trainDirections.rows;
}

/*

  Kinda pseudo-code about how to do the all-important exits query based on TfL's journey planning API response:

  - For leg 0, get the individualStopId of the arrivalPoint (call this A).
  - For leg 1, get the individualStopId of the departurePoint (call this B).
  - (Do the rest of the legs - haven't worked out how to handle more than two yet!)

  Query one: SELECT platform_exit_id FROM exit_interchanges WHERE dest_platform_id = (SELECT id FROM platforms WHERE individual_stop_id='[B]');

  There could be multiple platform exits for a given destination platform, so for each of those:

  Query two: SELECT * FROM platform_exits WHERE id = [the current platform_exit_id we got from Query one] AND platform_id=(SELECT id FROM platforms WHERE individual_stop_id = '[A]');

  And I think this'll narrow it down to one?

  (Though we haven't considered what happens if we specify multiple exits for the same interchange on a given journey!)

*/

module.exports = {
  getAllStations,
  createSession,
  getSession,
  getSavedRoutes,
  getStation,
  getRouteByIndividualStopIds,
  getStationNameByIndividualStopIds,
  getStationCommonNamesFromNaptans,
  getPlatformDataFromIndividualStopPoints,
  getTrainDirectionFromIndividualStopPoints,
};
