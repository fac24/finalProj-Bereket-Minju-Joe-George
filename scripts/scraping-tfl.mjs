// This file has the .mjs extension, which makes import work
// (which seems to be required for node-fetch).
import fs from "fs";
import fetch from "node-fetch";

// const API_KEY = process.env.API_KEY;
// const APP_ID = process.env.APP_ID;
// const BASE_URL = `https://api.tfl.gov.uk/`;

// https://api.tfl.gov.uk/StopPoint/Type/NaptanMetroStation?app_id={{app_id}}&app_key={{app_key}}
// https://api.tfl.gov.uk/StopPoint/Mode/tube?app_id=train-exits&app_key=21a14b6d9b1242bfb15985e4a78ede3d
// https://api.tfl.gov.uk/StopPoint/Meta/Modes?app_id=train-exits&app_key=21a14b6d9b1242bfb15985e4a78ede3d

const scrapingFunction = async () => {
  //const stationsURL = `${BASE_URL}StopPoint/Type/NaptanMetroStation?app_id=${APP_ID}&app_key=${API_KEY}`;

  // We don't actually need an API key for this request, and we won't make this fetch often:
  const apiUrl = `https://api.tfl.gov.uk/StopPoint/Mode/tube`;
  const apiResponseArray = await fetch(apiUrl)
    .then((resolve) => resolve.json())
    .then((resolve) => resolve.stopPoints);

  const stationData = [];

  // console.log(stations[0].stationNaptan);
  // console.log(stations[0].commonName);

  let myCounter = 1;

  myOuterLoop: for (let i = 0; i < apiResponseArray.length; i++) {
    let commonName = apiResponseArray[i].commonName;

    // Get rid of undefined stationNaptans
    if (apiResponseArray[i].stationNaptan === undefined) {
      continue myOuterLoop;
    }

    // A hard-coded exception for Hammersmith!
    if (commonName === "Hammersmith Stn / H&C and Circle Lines") {
      continue myOuterLoop;
    }

    // Look at every item in the new array:
    for (let j = 0; j < stationData.length; j++) {
      // If the current item.stationNaptan is the same as the stationNaptan from the API:
      if (stationData[j].stationNaptan === apiResponseArray[i].stationNaptan) {
        // Then skip to the next element in the outer forEach.
        continue myOuterLoop;
      }
    }

    commonName = commonName.replace(" Underground Station", "");
    commonName = commonName.replace(" Underground Stn", "");

    stationData.push({
      id: myCounter,
      stationNaptan: apiResponseArray[i].stationNaptan,
      commonName: commonName,
    });

    myCounter++;
  }

  /*

  What we're aiming for:

  INSERT INTO station (stationNaptan, commonName) VALUES
    ('940GZZLUAMS', 'Amersham Underground Station'),
    ('940GZZLUCAL', 'Chalfont & Latimer Underground Station'),
    ... [all the rest of the stations go here] ...
    ('940GZZNEUGST', 'Nine Elms Underground Station');

  */

  let sqlOutput =
    "BEGIN;\n\nINSERT INTO stations (station_naptan, common_name_short) VALUES\n";

  stationData.forEach((station) => {
    // We need to escape single quotes.
    // Backslashes might work:
    // const escapedCommonName = station.commonName.replaceAll("'", "\\'");
    // But double quotes are probably better? :)
    const escapedCommonName = station.commonName.replaceAll("'", "''");

    sqlOutput += `('${station.stationNaptan}', '${escapedCommonName}'),\n`;
  });

  // Replace last comma with semi-colon
  sqlOutput = sqlOutput.substring(0, sqlOutput.length - 2) + ";";

  // End transaction at end of .sql file
  sqlOutput += "\n\nCOMMIT;";

  fs.writeFile("./database/stations.sql", sqlOutput, (err) => {
    if (err) {
      console.error(err);
    }
    // file written successfully
    console.log("wrote file");
  });
};

scrapingFunction();
