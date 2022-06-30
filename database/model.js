const db = require("./connection.js");

async function getAllStations() {
  const SELECT_ALL_STATIONS = `SELECT * FROM stations ORDER BY common_name_short;`;
  const allStations = await db.query(SELECT_ALL_STATIONS);
  return allStations.rows;
}

// Get data from db to then send as props
// - Platform name - line
// - where to stand for next arrival point
// - Station name
// -

async function getRouteByIndividualStopIds(stopIds) {
  const arrivalPoints = stopIds.filter((stopId, index) => index % 2 === 1);
  const departurePoints = stopIds.filter((stopId, index) => index % 2 === 0);
  console.log(arrivalPoints[0]);
  const SELECT_PLATFORM_EXIT_ID = /* SQL */ `SELECT
    platform_exit_id FROM exit_interchanges WHERE dest_platform_id = (SELECT id from platforms WHERE individual_stop_id = $1)`;
  const query1 = await Promise.all(
    departurePoints.map((departurePoint) =>
      db
        .query(SELECT_PLATFORM_EXIT_ID, [departurePoint])
        .then((res) => res.rows)
    )
  );
  const SELECT_PLATFORM_EXITS = `SELECT * FROM platform_exits WHERE platform_id = (SELECT id FROM platforms WHERE individual_stop_id = $1)`;
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
      .map((arrivalPoint, index) => {
        if (arrivalPoints.length === index + 1) {
          return db
            .query(SELECT_EXIT, [arrivalPoint[0], arrivalPoint[1]])
            .then((res) => res.rows);
        } else {
          return db
            .query(SELECT_INTERCHANGE, [arrivalPoint[0], arrivalPoint[1]])
            .then((res) => res.rows);
        }
      })
  );

  return query2;
}

async function getStationNameByIndividualStopIds(stopIds) {
  const SELECT_STATION_NAMES = `SELECT common_name_short FROM stations WHERE station_naptan = (SELECT station_naptan FROM platforms WHERE individual_stop_id = $1)`;
  const stationNames = await Promise.all(
    stopIds.map((stopId) => {
      return db
        .query(SELECT_STATION_NAMES, [stopId])
        .then((res) => res.rows[0]);
    })
  );
  return stationNames;
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
  getRouteByIndividualStopIds,
  getStationNameByIndividualStopIds,
};
