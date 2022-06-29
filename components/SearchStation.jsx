import useSearchStation from "./Hooks/useSearchStation";

const debounce = (func, timeout = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

export default function SearchStation({ startEndName, startEnd }) {
  const [searchOptions, setSearchOptions] = useSearchStation();

  const processChange = debounce((event) => setSearchOptions(event));
  return (
    <>
      <label htmlFor={startEndName}>Select {startEnd} Station</label>
      <input
        type="text"
        name={startEndName}
        id={startEndName}
        onChange={(event) => processChange(event)}
      />
      <ul>
        {searchOptions.map((station, index) => (
          <li key={index}>{station}</li>
        ))}
      </ul>
    </>
  );
}
