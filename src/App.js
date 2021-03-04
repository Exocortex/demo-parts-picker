import React, { useEffect } from "react";

// import "antd/dist/antd.css";

// Less
// import 'antd/lib/style/themes/default.less';
// import 'antd/dist/antd.less'; // Import Ant Design styles by less entry
import "antd/dist/antd.less";
import "./theme.less"; // variables to override above
import ReactGA from "react-ga";

// Components
import Player from "./components/Player";
import Form from "./components/Form";
import Header from "./components/Header";


// Config
import config from "./config/index";

function App() {
  useEffect(() => {
    ReactGA.initialize("UA-63905846-9");
    ReactGA.set({ dimension1: "Auto Parts Demo" });
    ReactGA.pageview("Auto-Parts Selector Demo");
  }, []);
  return (
    <div>
      <Header/>
     <Form />
    </div>
  );
}

export default App;
