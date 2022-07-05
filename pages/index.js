import Link from "next/link";
import OurSelect from "../components/OurSelect.jsx";
import useLocation from "../components/Hooks/useLocation.jsx";
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
      <form id="new-route-form" action="/new-route">
        <label htmlFor="start-station">
          Select start station
          <OurSelect
            id="start-station"
            name="startStation"
            defaultValue={selectedStart}
            onChange={setSelectedStart}
            options={options}
          />
        </label>

        <button
          id="get-location"
          onClick={getLocation}
          className="border rounded px-2 py-1"
        >
          <span className="text-2xl">📍</span> Find my start location
        </button>

        <label htmlFor="end-station">
          Select end station
          <OurSelect
            id="end-station"
            name="endStation"
            defaultValue={selectedEnd}
            onChange={setSelectedEnd}
            options={options}
          />
        </label>

        <label htmlFor="step-free">
          <input
            type="checkbox"
            id="step-free"
            name="stepFree"
            onChange={(event) => setStepFree(event.target.value)}
            className="mr-2"
          />
          Step free
        </label>

        <button
          type="submit"
          className="block rounded py-1 px-3 mx-auto bg-sky-600 hover:bg-sky-700 text-lg text-white"
        >
          Find my route
        </button>
      </form>
    </>
  );
}
