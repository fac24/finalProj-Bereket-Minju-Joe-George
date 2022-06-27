// const fs = require("fs");
// const fetch = require("node-fetch");

import fs from "fs";
import fetch from "node-fetch";

const API_KEY = process.env.API_KEY;
const APP_ID = process.env.APP_ID;
const BASE_URL = `https://api.tfl.gov.uk/`;

// https://api.tfl.gov.uk/StopPoint/Type/NaptanMetroStation?app_id={{app_id}}&app_key={{app_key}}
// https://api.tfl.gov.uk/StopPoint/Mode/tube?app_id=train-exits&app_key=21a14b6d9b1242bfb15985e4a78ede3d
// https://api.tfl.gov.uk/StopPoint/Meta/Modes?app_id=train-exits&app_key=21a14b6d9b1242bfb15985e4a78ede3d

const scrapingFunction = async () => {
  //const stationsURL = `${BASE_URL}StopPoint/Type/NaptanMetroStation?app_id=${APP_ID}&app_key=${API_KEY}`;
  const stationsURL = `https://api.tfl.gov.uk/StopPoint/Mode/tube`;
  const stations = await fetch(stationsURL)
    .then((result) => result.json())
    .then((obj) => obj.stopPoints);
  const stationData = [];

  // console.log(stations[0].stationNaptan);
  // console.log(stations[0].commonName);

  stations.forEach((station) => {
    // add a text file that contains this json
    //add to file system {id: station.id, commonName: station.commonName}
    stationData.push({
      stationNaptan: station.stationNaptan,
      commonName: station.commonName,
    });
  });

  fs.writeFile("../stations.txt", JSON.stringify(stationData), (err) => {
    if (err) {
      console.error(err);
    }
    // file written successfully
  });
  console.log("wrote file");
};

scrapingFunction();
// For this endpoint:
// https://api.tfl.gov.uk/StopPoint/Mode/tube
// We could make a new array which only contains unique stationNaptan codes
// And then save those along with the commonName in a new file
