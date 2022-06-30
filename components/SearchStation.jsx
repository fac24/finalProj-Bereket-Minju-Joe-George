import useSearchStation from "./Hooks/useSearchStation";

const debounce = (func, timeout = 300) => {
  // look up?? auto-complete function
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

export default function SearchStation({
  startEndName,
  startEnd,
  setEndStation,
}) {
  const [searchOptions, setSearchOptions] = useSearchStation();

  const processChange = debounce((event) => setSearchOptions(event));
  return (
    <>
      <label htmlFor={startEndName}>Select {startEnd} Station</label>
      <input
        type="text"
        name={startEndName}
        id={startEndName}
        onChange={(event) => {
          setEndStation(event.target.value);
          return processChange(event);
        }}
      />
      <ul>
        {searchOptions.map((station, index) => (
          <li key={index}>{station}</li>
        ))}
      </ul>
    </>
  );
}
