import "../styles/globals.css";
import Layout from "../components/Layout.jsx";

function MyApp({ Component, pageProps }) {
  const APP_KEY = process.env.APP_KEY;
  const APP_ID = process.env.APP_ID;
  return (
    <Layout>
      <Component APP_ID={APP_ID} APP_KEY={APP_KEY} {...pageProps} />
    </Layout>
  );
}
export default MyApp;
