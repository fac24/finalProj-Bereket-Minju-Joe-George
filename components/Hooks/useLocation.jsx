import { useState, useEffect } from "react";
const BASE_URL = `https://api.tfl.gov.uk/`;
export default function useLocation(options) {
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [station, setStation] = useState(null);

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
          setStation(
            result.stopPoints[0].commonName.replace("Underground Station", "")
          );
          // add user location's station inside options as first row.
          if (station !== null) {
            options.unshift({ value: 0, label: `📍${station}` });
          }
        }
      })
      .catch((error) => console.log(error));
  }, [lat, lon, station, setStation, options]);

  return [setLat, setLon];
}
