export async function getServerSideProps({ params }) {
  const platforms = params.startToVia.split("-");
  // Get data from db to then send as props
  // - Platform name - line
  // - where to stand for next arrival point
  // - Station name
  // - 
  return { props: { platforms: platforms } };
}

export default function StartToVia({ platforms }) {
  return (
    <>
      <ul>
        {platforms.map((platform, index) => (
          <li key={index}>{platform}</li>
        ))}
      </ul>
    </>
  );
}
