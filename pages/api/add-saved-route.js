import { postSavedRoute } from "../../database/model";
import { getOrCreateSid } from "../../helpers/cookie";

// just so don't have to copy this check each time
const checkArray = (arrToCheck) => {
  return Array.isArray(arrToCheck) ? arrToCheck : [arrToCheck];
};

// Async api route so we can add to the db
export default async function addSavedRoute(req, res) {
  const body = req.body;
  // If only one then it doesn't give us an array so if it's not array we create one
  const lineIds = checkArray(body.lineIds);
  const arrivalStationNaptans = checkArray(body.arrivalStationNaptans);
  const departureStationNaptans = checkArray(body.departureStationNaptans);

  //Create the object to save to the db
  // we know the first element is the first element of the departure stations every time
  const routeObj = {
    0: { startStationNaptan: departureStationNaptans[0] },
  };
  let objectKeyNumber = 1;
  // There will always be platform ids inbetween other data so this is a good
  // array to do a forEach in
  body.platformIds.forEach((platformId, index, arr) => {
    //Always add the platform individual stop Id first
    routeObj[objectKeyNumber] = { platformIndividualStopId: platformId };
    objectKeyNumber++;
    // If even we know that a line will come next in the object
    if (index % 2 === 0) {
      routeObj[objectKeyNumber] = { lineId: lineIds[index / 2] };
      // index/2 as lineIds only half as long and only want for every other platform
      objectKeyNumber++;
    } else {
      // If odd we know it's going to be the final stationNaptan or interchange
      // The last element of the array is always the endStationNaptan any others are interchanges
      if (index === arr.length - 1) {
        routeObj[objectKeyNumber] = {
          endStationNaptan: arrivalStationNaptans[Math.floor(index / 2)],
          //Odd numbered so rounding down
        };
        objectKeyNumber++;
      } else {
        routeObj[objectKeyNumber] = {
          stationNaptan: arrivalStationNaptans[Math.floor(index / 2)], //interchange Naptan
        };
        objectKeyNumber++;
      }
    }
  });

  const sid = await getOrCreateSid(req, res);
  console.log(`\n\nmy log: ${sid} \n\nend of my log\n\n`);
  await postSavedRoute(JSON.stringify(routeObj), sid);
  return res.redirect(req.body.href);
}
