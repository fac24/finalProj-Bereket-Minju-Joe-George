const db = require("./connection.js");

async function getAllStations() {
  const SELECT_ALL_STATIONS = `SELECT * FROM stations;`;
  const allStations = await db.query(SELECT_ALL_STATIONS);
  return allStations.rows;
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
};
