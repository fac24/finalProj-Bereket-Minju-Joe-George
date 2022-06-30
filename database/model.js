const db = require("./connection.js");

async function getAllStations() {
  const SELECT_ALL_STATIONS = `SELECT * FROM stations;`;
  const allStations = await db.query(SELECT_ALL_STATIONS);
  return allStations.rows;
}

async function createSession(sid) {
  const CREATE_SESSION = `INSERT INTO sessions (sid) VALUES ($1) RETURNING sid;`;
  const session = db.query(CREATE_SESSION, [sid]);
  return session.rows[0].sid;
}

async function getSession(sid) {
  const SELECT_SESSION = `SELECT * FROM sessions WHERE sid = $1;`;
  const session = await db.query(SELECT_SESSION, [sid]);
  return session.rows[0];
}

async function getSavedRoutes(sid) {
  const SELECT_ROUTES = `SELECT name FROM session_routes LEFT JOIN routes ON session_routes.route_id = routes.id WHERE sid = $1;`;
  const routes = await db.query(SELECT_ROUTES, [sid]);
  return routes.rows;
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
};
