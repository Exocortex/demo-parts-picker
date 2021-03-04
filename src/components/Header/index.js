import React, { useState, useEffect } from "react";
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from "react-device-detect";
import { PageHeader } from "antd";
import "./style.css"

function Header(props) {
  useEffect(() => {});

  return (
    <div>
      <PageHeader
        className="site-page-header"
        className="site-page-header"
        title="3K Auto Parts"
        subTitle="Select a make, model, and year to get started"
      />
    </div>
  );
}

export default Header;
