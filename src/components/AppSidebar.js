import React, { useState } from "react";
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from "@coreui/react";

import { AppSidebarNav } from "./AppSidebarNav";
import TayproLogo from "../assets/brand/logofordarkbg.png"; // Import the image
import navigation from "../_nav";
import { Link } from "react-router-dom";

const AppSidebar = ({ sidebarShow, setSidebarShow }) => {
  const [unfoldable, setUnfoldable] = useState(false);

  return (
    <CSidebar
      className="border-end"
      style={{ background: "#080f25" }}
      // colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => setSidebarShow(visible)}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <Link to="/">
            <img
              src={TayproLogo}
              alt="Taypro Logo"
              style={{ height: "50px", width: "200px", objectFit: "contain" }}
              className="sidebar-brand-full"
            />
          </Link>
          <Link to="/">
            <img
              src={TayproLogo}
              alt="Taypro Logo"
              height={30}
              className="sidebar-brand-narrow"
            />
          </Link>
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => setSidebarShow(false)}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler onClick={() => setUnfoldable(!unfoldable)} />
      </CSidebarFooter>
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
