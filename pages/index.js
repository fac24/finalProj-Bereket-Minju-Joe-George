// import App from "next/app.js";
import Link from "next/link";
import SearchStation from "../components/SearchStation.jsx";
import { useState, useEffect } from "react";

const BASE_URL = `https://api.tfl.gov.uk/`;

export default function Home({ APP_KEY, APP_ID }) {
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);

  // when user click the pin then get user's location.
  useEffect(() => {
    fetch(
      `${BASE_URL}StopPoint?lat=${lat}&lon=${lon}&stopTypes=NaptanMetroStation`
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error");
        }
      })
      .then((result) => {
        if (result) {
          //at space 4, user will get finsbury park as staiton naem.
          let stationName = result.stopPoints[0].commonName;
        }
      })
      .catch((error) => console.log(error));
  }, [lat, lon]);

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
