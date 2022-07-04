import { useState, useEffect } from "react";
const BASE_URL = `https://api.tfl.gov.uk/`;
export default function useLocation(options) {
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [station, setStation] = useState(null);

  // when user click the pin then get user's location.
  useEffect(() => {
    console.log(lat, lon);
    if (lat !== null && lon !== null) {
      fetch(
        `${BASE_URL}StopPoint?lat=${lat}&lon=${lon}&stopTypes=NaptanMetroStation`
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((result) => {
          if (result) {
            // add user location's station inside options as first row.
            options.unshift({
              value: `${lat},${lon}`,
              label: `📍 Your Location`,
            });
          }
        });
    }
  }, [lat, lon, options]);

  return [setLat, setLon];
}
