import "../styles/globals.css";
import Layout from "../components/Layout.jsx";
import { useState } from "react";

function MyApp({ Component, pageProps }) {
  const [stepFree, setStepFree] = useState(false);
  const [selectedStart, setSelectedStart] = useState(null);
  const [selectedEnd, setSelectedEnd] = useState(null);
  const APP_KEY = process.env.APP_KEY;
  const APP_ID = process.env.APP_ID;
  return (
    <Layout>
      <Component
        APP_ID={APP_ID}
        APP_KEY={APP_KEY}
        selectedStart={selectedStart}
        setSelectedStart={setSelectedStart}
        selectedEnd={selectedEnd}
        setSelectedEnd={setSelectedEnd}
        stepFree={stepFree}
        setStepFree={setStepFree}
        {...pageProps}
      />
    </Layout>
  );
}
export default MyApp;
