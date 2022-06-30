import { useState } from "react";
const stationData = [
  { commonName: "Archway" },
  { commonName: "Finsbury Park" },
  { commonName: "Bermondsey" },
];

export default function useSearchStation() {  // function to let user search station
  const [search, setSearch] = useState("");
  const [filteredStations, setFilteredStations] = useState([]); //  filter stations based on search term 
  const stations = stationData.flatMap((station) => station.commonName);

  const setSearchOptions = (event) => {
    event.preventDefault(); // keep form from submitting
    const searchTerm = event.target.value;  // input from user 
    const filterOptions = stations.filter((station) =>
      station.toLowerCase().includes(searchTerm.toLowerCase()) // filter search to include lower case
    );
    setSearch(searchTerm);
    setFilteredStations(filterOptions);
  };

  return [filteredStations, setSearchOptions];  // return values to be used when searching station 
}
