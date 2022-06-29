import "../styles/globals.css";
import Layout from "../components/Layout.jsx";

function MyApp({ Component, pageProps }) {
  const API_KEY = process.env.API_KEY;
  const APP_ID = process.env.APP_ID;
  return (
    <Layout>
      <Component APP_ID={APP_ID} API_KEY={API_KEY} {...pageProps} />
    </Layout>
  );
}
export default MyApp;
