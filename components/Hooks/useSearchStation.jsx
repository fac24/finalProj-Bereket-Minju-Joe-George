import { useState } from "react";
const stationData = [
  { commonName: "Archway" },
  { commonName: "Finsbury Park" },
  { commonName: "Bermondsey" },
];

export default function useSearchStation() {
  const [search, setSearch] = useState("");
  const [filteredStations, setFilteredStations] = useState([]);
  const stations = stationData.flatMap((station) => station.commonName);

  const setSearchOptions = (event) => {
    event.preventDefault();
    const searchTerm = event.target.value;
    const filterOptions = stations.filter((station) =>
      station.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearch(searchTerm);
    setFilteredStations(filterOptions);
  };

  return [filteredStations, setSearchOptions];
}
