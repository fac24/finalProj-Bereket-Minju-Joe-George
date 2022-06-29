const db = require("./connection.js");

async function getAllStations() {
  const SELECT_ALL_STATIONS = `SELECT * FROM stations;`;
  const allStations = await db.query(SELECT_ALL_STATIONS);
  return allStations.rows;
}

module.exports = {
  getAllStations,
};
