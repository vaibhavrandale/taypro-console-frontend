import React, { useState } from "react";
import {
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
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";

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
        <CSidebarBrand>
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
        <button
          type="button"
          className=" border-0 ms-auto py-0 px-1 d-lg-none"
          onClick={() => setSidebarShow(false)}
          style={{ background: "none" }}
        >
          <CIcon icon={cilX} size="lg" />
        </button>
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler onClick={() => setUnfoldable(!unfoldable)} />
      </CSidebarFooter>
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
