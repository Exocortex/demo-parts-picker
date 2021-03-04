import React, { useState, useEffect } from "react";
import "./style.css";
import config from "../../config/";
import Player from "../Player";
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from "react-device-detect";

// Car make and models
import { autoMakes, autoData } from "./autoData";

import { Tree, Tabs, Select } from "antd";

const { DirectoryTree } = Tree;
const { TabPane } = Tabs;
const { Option } = Select;

function Form(props) {
  useEffect(() => {
    console.log(autoData);
  });

  // The car's make, model, year
  let [make, setMake] = useState();
  // Used to query the auto object for the models available
  let [makeIndex, setMakeIndex] = useState();

  let [model, setModel] = useState();
  // Store current models in an array to map through
  let [modelArr, setModelArr] = useState([]);

  let [yearArr, setYearArr] = useState([]);
  let [carYear, setCarYear] = useState();

  // Child menu items that are populated via player
  let [menu, setMenu] = useState([]);
  // Checks if there is an active player
  let [active, setActive] = useState(false);
  // Populated the part system parts with 'Loading...' until data comes in
  let [menuLoading, setMenuLoading] = useState(true);
  // The selected part
  let [selected, setSelected] = useState("");
  // Check which system is expanded
  let [expanded, setExpanded] = useState(["01", ""]);
  // Loading menu
  let loadingMenuObject = [
    {
      title: "Loading...",
      key: "01-menu-loading",
      isLeaf: true,
    },
  ];

  // Handle select actions
  const handleDropdown = (e, info) => {
    console.log(e, info);
    if (info.make == "true") {
      setMake(e);
      setMakeIndex(parseInt(info.key));
      setModelArr(
        Object.keys(Object.values(autoData)[parseInt(parseInt(info.key))])
      );
    } else if (info.model == "true") {
      setModel(e);
      console.log(e);

      setYearArr(Object.keys(Object.values(autoData)[makeIndex][e]));
    } else if (info.year == "true") {
      setCarYear(e);
    }
  };

  // Get menu from loaded asset
  const getPartsFromPlayer = (data) => {
    // Replace menu loading data with real parts
    setMenuLoading(false);
    setMenu(data);
    console.log(data);
  };

  // Get selected parts from the player
  const getSelected = (data) => {
    setSelected(data);
  };

  let menuData = [
    {
      title: "Parts",
      key: "01",
      children: [
        {
          title: "Cooling System",
          key: "da0d6c3f-64a2-491f-a7d9-c924d9698e88",
          children: menuLoading ? loadingMenuObject : menu,
          isLeaf: false,
        },
        {
          title: "Exhaust",
          key: "ef49b5c0-86b8-4c3d-965e-aaabd057707c",
          children: menuLoading ? loadingMenuObject : menu,
          isLeaf: false,
        },
      ],
      isLeaf: false,
    },
  ];

  const handleChange = (e, info) => {
    // If the menu item selected is a leaf (system part), execute Threekit highlight, otherwise expand the menu
    if (info.node.isLeaf) {
      window.player.selectionSet.clear();
      window.player.selectionSet.toggle(info.node.key);
      setSelected([info.node.key]);
      window.nodeId = info.node.key;
    } else {
      handleExpand(e, info);
    }
  };

  const handleExpand = (e, info) => {
    if (expanded == info.node.key) {
      expanded.pop();
    }
    if (info.node.key == "01") {
      return null;
    }

    if (active) {
      console.log("handle-expand-is-active");
      // Testing
      setExpanded(["01", info.node.key]);

      let unloadPlayer = new Promise((resolve, reject) => {
        let success = () => {
          window.player.unload();
          setActive(false);
          setMenu([]);
          setMenuLoading(true);
          expanded.pop();
        };

        resolve(success());
      });

      unloadPlayer.then((successMessage) => {
        setExpanded(["01", info.node.key]);
        setActive(true);
      });
    } else if (!info.node.isLeaf) {
      console.log("handle-expand-else-if");

      setExpanded(["01", info.node.key]);
      setActive(true);
    }
    console.log({ expanded });
  };

  return (
    <div>
      {/* <p>{expanded}</p> */}
      {/* <BrowserView> */}
      <div className={isMobile ? "mobile-form-container" : "form-container"}>
        <div className="form-dropdown">
          <Select
            style={{ width: 120 }}
            placeholder="Make"
            onChange={handleDropdown}
          >
            {/* WORKING */}
            {autoMakes().makes.map((e, i) => (
              <Option value={e} key={i} make={"true"}>
                {e}
              </Option>
            ))}
          </Select>
        </div>
        {make ? (
          <div className="form-dropdown">
            <Select
              style={{ width: 120 }}
              placeholder="Model"
              onChange={handleDropdown}
            >
              {modelArr.map((e, i) => (
                <Option value={e} key={i} model={"true"}>
                  {e}
                </Option>
              ))}
            </Select>
          </div>
        ) : (
          <p></p>
        )}
        {model ? (
          <div className="form-dropdown">
            <Select
              style={{ width: 120 }}
              placeholder="Year"
              onChange={handleDropdown}
            >
              {yearArr.map((e, i) => (
                <Option value={e} key={i} year={"true"}>
                  {e}
                </Option>
              ))}
            </Select>
          </div>
        ) : (
          <div></div>
        )}
        {carYear ? (
          <DirectoryTree
            className="draggable-tree"
            onSelect={handleChange}
            defaultExpandedKeys={["01"]}
            onExpand={handleExpand}
            expandedKeys={expanded}
            selectedKeys={selected}
            // height={'50%'}
            treeData={menuData}
          />
        ) : (
          <div></div>
        )}
      </div>

      {active ? (
        <Player
          authToken={config.authToken}
          stageId={"b9230872-9e52-47ab-879b-dd928372722a"}
          assetId={expanded[1]}
          initialConfig={{}}
          showConfigurator={false}
          showAR={false}
          parentCallback={getPartsFromPlayer}
          getSelected={getSelected}
          mobile={false}
        />
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Form;
