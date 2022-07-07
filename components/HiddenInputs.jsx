export default function HiddenInputs({ leg }) {
  // This is all the data we need for our api saving route
  return (
    <>
      <input
        type="hidden"
        name="departureStationNaptans"
        value={leg.departurePoint.naptanId}
      />
      <input
        type="hidden"
        name="arrivalStationNaptans"
        value={leg.arrivalPoint.naptanId}
      />
      <input
        type="hidden"
        name="lineIds"
        value={leg.routeOptions[0].lineIdentifier?.id}
      />
      <input
        type="hidden"
        name="platformIds"
        value={leg.departurePoint.individualStopId}
      />
      <input
        type="hidden"
        name="platformIds"
        value={leg.arrivalPoint.individualStopId}
      />
    </>
  );
}
