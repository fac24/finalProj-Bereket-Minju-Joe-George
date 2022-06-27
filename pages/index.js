import Link from "next/link";
import SearchStation from "../components/SearchStation.jsx";

const API_KEY = process.env.API_KEY;
const APP_ID = process.env.APP_ID;
const BASE_URL = `https://api.tfl.gov.uk/`;

export default function Home() {
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(setStation);
    } else {
      console.log("no geolocation");
    }
  };

  const setStation = async (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const stationsURL = `${BASE_URL}StopPoint?lat=${latitude}&lon=${longitude}&stopTypes=NaptanMetroStation&includeDistances=true&radius=1000&useStopPointHierarchy=true&modes=tube&app_id=${APP_ID}&app_key=${API_KEY}`;
    const stations = await fetch(stationsURL).then((result) => {
      return result.json();
    });
    console.log(stations);
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
