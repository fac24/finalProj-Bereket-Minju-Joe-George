// const fs = require("fs");
// const fetch = require("node-fetch");

// This requires having  "type": "module" in package.json which might break other stuff
// So when we're done with this scraping script we either delete that or fix the problem properly :)
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
  const apiUrl = `https://api.tfl.gov.uk/StopPoint/Mode/tube`;
  const apiResponseArray = await fetch(apiUrl)
    .then((resolve) => resolve.json())
    .then((resolve) => resolve.stopPoints);

  const stationData = [];

  // console.log(stations[0].stationNaptan);
  // console.log(stations[0].commonName);

  let myCounter = 1;

  myOuterLoop: for (let i = 0; i < apiResponseArray.length; i++) {
    // Look at every item in the new array:
    for (let j = 0; j < stationData.length; j++) {
      // If the current item.stationNaptan is the same as the stationNaptan from the API:
      if (stationData[j].stationNaptan === apiResponseArray[i].stationNaptan) {
        // Then skip to the next element in the outer forEach.
        continue myOuterLoop;
      }
    }

    stationData.push({
      id: myCounter,
      stationNaptan: apiResponseArray[i].stationNaptan,
      commonName: apiResponseArray[i].commonName,
    });

    myCounter++;
  }

  fs.writeFile("./stations.txt", JSON.stringify(stationData), (err) => {
    if (err) {
      console.error(err);
    }
    // file written successfully
  });
  console.log("wrote file");
};

scrapingFunction();
