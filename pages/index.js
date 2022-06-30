// import App from "next/app.js";
import Link from "next/link";
import SearchStation from "../components/SearchStation.jsx";
import { useState, useEffect } from "react";

const BASE_URL = `https://api.tfl.gov.uk/`;

export default function Home({ APP_KEY, APP_ID }) {
  const [lat, setLat] = useState(0); // keep the state of latitude 
  const [lon, setLon] = useState(0); // keep thew state of longitude to update incase of any changes
  const [station, setStation] = useState(null); // station state set to null initially  

  // when user click the pin then get user's location.
  useEffect(() => {  // useEffect to fetch and maintain updated location information relative to the state assigned to it initially
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
          setStation(result.stopPoints[0].commonName);
        }
      })
      .catch((error) => console.log(error));
  }, [lat, lon, setStation]);  // when this bit changes the code is re-run to reflect the new updated state to give us updated location

  const getLocation = () => {  // function to get user location 
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(location); // using the navigator.geolocation taking the location function as the parameter
    } else {
      console.log("no geolocation");
    }
  };

  const location = (position) => {  // function to get user location taking position as the parameter 
    const latitude = position.coords.latitude; // current position based on latitude and longitude coordinates
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
