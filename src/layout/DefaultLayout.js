import React, { useState } from "react";
import {
  AppContent,
  AppSidebar,
  AppFooter,
  AppHeader,
} from "../components/index";
// import ChatWidget from "../components/ChatWidget";

const DefaultLayout = () => {
  const [sidebarShow, setSidebarShow] = useState(true); // Use local state

  return (
    <div>
      {/* <AppSidebar /> */}
      <AppSidebar sidebarShow={sidebarShow} setSidebarShow={setSidebarShow} />
      <div className="wrapper d-flex flex-column min-vh-100">
        {/* <AppHeader /> */}
        <AppHeader sidebarShow={sidebarShow} setSidebarShow={setSidebarShow} />
        <div className="body flex-grow-1">
          <AppContent />
          {/* <ChatWidget /> */}
        </div>
        <AppFooter />
      </div>
    </div>
  );
};

export default DefaultLayout;
