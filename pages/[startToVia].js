import {
  getRouteByIndividualStopIds,
  getStationNameByIndividualStopIds,
} from "../database/model.js";

export async function getServerSideProps({ params }) {
  const platforms = params.startToVia.split("-");
  const data = await getRouteByIndividualStopIds(platforms);
  const stationName = await getStationNameByIndividualStopIds(platforms);
  console.log(stationName);
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
      <p>Hiya</p>
    </>
  );
}
