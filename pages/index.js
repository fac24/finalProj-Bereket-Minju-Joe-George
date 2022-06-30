import Link from "next/link";
import Select from "react-select";
import useLocation from "../components/Hooks/useLocation";
import { getAllStations } from "../database/model";

const BASE_URL = `https://api.tfl.gov.uk/`;

// Delete when addded model js
// const stationData = [
//   { station_naptan: "940GZZLUACY", common_name_short: "Archway" },
//   { station_naptan: "940GZZLUEPG", common_name_short: "Epping" },
//   { station_naptan: "940GZZLUFPK", common_name_short: "Finsbury Park" },
//   { station_naptan: "940GZZLUBMY", common_name_short: "Bermondsey" },
// ];

export async function getServerSideProps() {
  const stationData = await getAllStations();

  // #######GET MODEL.JS TO GET THE STATIONDATA

  const options = stationData.map((station) => {
    return { value: station.station_naptan, label: station.common_name_short };
  });
  return { props: { options: options } };
}

export default function Home({
  APP_KEY,
  APP_ID,
  setSelectedStart,
  selectedStart,
  setSelectedEnd,
  selectedEnd,
  setStepFree,
  options,
}) {
  const [setLat, setLon] = useLocation(options);

  const getLocation = () => {
    // function to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(location);
      document.querySelector("span").textContent =
        "your nearest station is added.";
    } else {
      console.log("no geolocation");
    }
  };

  const location = (position) => {
    // function to get user location taking position as the parameter
    const latitude = position.coords.latitude; // current position based on latitude and longitude coordinates
    const longitude = position.coords.longitude;
    setLat(latitude);
    setLon(longitude);
  };

  return (
    <>
      <form action="/new-route">
        <label htmlFor="startStation">Select Starting Station</label>
        <Select
          id="startStation"
          name="startStation"
          defaultValue={selectedStart}
          onChange={setSelectedStart}
          options={options}
        />
        <span onClick={getLocation}>📍</span>
        <br />
        <Link href="/map">
          <a>Show me a map</a>
        </Link>
        <br />
        <label htmlFor="endStation">Select Ending Station</label>
        <Select
          id="endStation"
          name="endStation"
          defaultValue={selectedEnd}
          onChange={setSelectedEnd}
          options={options}
        />
        <br />
        <input
          type="checkbox"
          id="stepFree"
          name="stepFree"
          onChange={(event) => setStepFree(event.target.value)}
        />
        <label htmlFor="stepFree">Step Free?</label>
        <br />

        <button type="submit">Find My Route</button>
      </form>
    </>
  );
}
