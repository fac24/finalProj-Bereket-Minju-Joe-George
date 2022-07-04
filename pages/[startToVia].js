import {
  getRouteByIndividualStopIds,
  getStationNameByIndividualStopIds,
} from "../database/model.js";

export async function getServerSideProps({ params }) {
  const platforms = params.startToVia.split("-");
  const routeData = await Promise.all([
    getRouteByIndividualStopIds(platforms),
    getStationNameByIndividualStopIds(platforms),
  ]);
  const data = routeData[0];
  const stationName = routeData[1];
  // Get data from db to then send as props
  // - ////// Platform name - line
  // - ////////where to stand for next arrival point
  // - ////Station name
  // -
  return { props: { data: data, stationName: stationName } };
}

export default function StartToVia({ data, stationName }) {
  return (
    <>
      <h2>
        <b>
          {stationName[0].common_name_short} to{" "}
          {stationName[3].common_name_short} via{" "}
          {stationName[1].common_name_short}
        </b>
      </h2>
      <p>
        Get in carriage {data[0][0].carriage_from_front} and door{" "}
        {data[0][0].door_from_front} at {stationName[0].common_name_short} To be
        able to quickly change at {stationName[1].common_name_short}
      </p>
    </>
  );
}
