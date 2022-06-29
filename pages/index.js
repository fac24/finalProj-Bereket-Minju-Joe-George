// import App from "next/app.js";
import Link from "next/link";
import SearchStation from "../components/SearchStation.jsx";
import { useState, useEffect } from "react";

const BASE_URL = `https://api.tfl.gov.uk/`;

// i don't know why but API_KEY include API_KEY & APP_ID
export default function Home(API_KEY) {
  // when user click the pin then get user's location.
  const KEY = API_KEY.API_KEY;
  const ID = API_KEY.APP_ID;

  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  console.log(lat, lon);
  fetch(
    `${BASE_URL}StopPoint/mode/tube?lat=${lat}&lon=${lon}&app_id=${ID}&app_key=${KEY}`
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        // error
      }
    })
    .then((result) => {
      if (result) {
        console.log(result.stopPoints[1].commonName);
      }
    });

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(location);
    } else {
      console.log("no geolocation");
    }
  };

  const location = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setLat(latitude);
    setLon(longitude);
  };

  return (
    <>
      <form>
        <label htmlFor="startStation">Select Starting Station</label>
        <input type="text" name="startStation" id="startStation" />
        <span onClick={getLocation}>📍</span>
        <br />
        <Link href="/map">
          <a>Show me a map</a>
        </Link>
        <br />
        <SearchStation startEndName={"endStation"} startEnd={"End"} />
        <br />
        <input type="checkbox" id="stepFree" name="stepFree" />
        <label htmlFor="stepFree">Step Free?</label>
        <br />

        <button type="submit">Find My Route</button>
      </form>
    </>
  );
}