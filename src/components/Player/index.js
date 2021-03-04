import React, { useState, useEffect } from "react";
import "./style.css";
import { Tree, Input } from "antd";
const { DirectoryTree } = Tree;

function Player(props) {
  let [clicked, setClicked] = useState(false);

  let [selected, setSelected] = useState("");

  const sendData = (data) => {
    props.parentCallback(data);
  };

  const sendSelected = (data) => {
    props.getSelected(data);
  };

  const hideHand = () => {
    // document.getElementById("hand-indicator") == undefined
    //   ? window.location.reload()
    document.getElementById("hand-indicator").style = "display: none";
  };

  useEffect(() => {
    if (clicked == false) {
      document
        .getElementById("threekit-container")
        .addEventListener("mousedown", function () {
          // document.getElementById("hand-container").remove();
          hideHand();
        });

      document
        .getElementById("threekit-container")
        .addEventListener("touchstart", function () {
          // document.getElementById("hand-container").remove();
          hideHand();
        });
    }

    window
      .threekitPlayer({
        authToken: props.authToken,
        el: document.getElementById("player-" + props.assetId),
        stageId: props.stageId,
        assetId: props.assetId,
        showLoadingThumbnail: true,
        initialConfiguration: props.initialConfig,
        showConfigurator: props.showConfigurator,
        showAR: props.showAR,
      })
      .then(async (api) => {
        window.player = api;
        window.configurator = await api.getConfigurator();

        await api.when("loaded");
        let arr = [];
        let allOptions = api.scene.getAll();
        for (const key in allOptions) {
          let obj = {
            title: allOptions[key].name,
            key: allOptions[key].id,
            isLeaf: true,
          };
          if (allOptions[key].name.includes("_")) {
            continue;
          }
          arr.push(obj);
        }
        sendData(arr);

        // Selection Code
        /****************************************************
         Apply Selection
        ****************************************************/

        // Custom Select tool to pass some info
        const findClickable = (id) => {
          var node = window.player.scene.get({ id: id });
          //if it's the scene you've reached the end. return it
          if (node.sceneId === node.id) {
            return node.id;
          }
          //if MetaData selectable_part true return it
          for (var i = 0; i < node.plugs.Properties.length; i++) {
            if (
              node.plugs.Properties[i].name === "MetaData" &&
              node.plugs.Properties[i].key === "selectable_part" &&
              node.plugs.Properties[i].value === "true"
            ) {
              return node.id;
            }
          }
          //else run the parent
          return findClickable(node.parent);
        };
        window.player.tools.addTool({
          key: "partSelect",
          label: "Part Select Tool",
          active: true,
          enabled: true,
          handlers: {
            click: (ev) => {
              const hits = ev.hitNodes;

              const nodeId = hits && hits.length > 0 && hits[0].nodeId;
              if (nodeId) {
                const newNodeId = findClickable(nodeId);
                const scopeNode =
                  window.player.scene.get({ id: nodeId }).sceneId === newNodeId
                    ? nodeId
                    : newNodeId;
                const selectable = window.player.scene.get({
                  id: scopeNode,
                  plug: "Properties",
                  property: "selectable",
                });
                if (selectable || typeof selectable === "undefined") {
                  window.player.selectionSet.set(scopeNode);
                  const nodeInfo = window.player.scene.get({ id: scopeNode });
                  setSelected([nodeInfo.id]);
                  sendSelected([nodeInfo.id]);
                } else {
                  window.player.selectionSet.clear();
                }
              } else {
                window.player.selectionSet.clear();
              }
            },
          },
        });
      });
  }, []);

  return (
      <div id="threekit-container">
        <div className="player-container">
          <div className="stage" id="hand-container">
            <div id="hand-indicator" className="hand bounce-2">
              <img
                style={{ height: "30px", width: "30px" }}
                src="https://solutions-engineering.s3.amazonaws.com/media/web-assets/hand.png"
              />
            </div>
          </div>
          <div id={"player-" + props.assetId} className={props.mobile ? 'player-mobile' : 'player'}></div>
        </div>
      </div>
  );
}

export default Player;
