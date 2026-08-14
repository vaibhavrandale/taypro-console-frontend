import React, { useState } from "react";
import {
  AppContent,
  AppSidebar,
  AppFooter,
  AppHeader,
} from "../components/index";
import { VoiceCallProvider } from "../context/VoiceCallContext";
import VoiceCallModal from "../components/VoiceCallModal";

const DefaultLayout = () => {
  const [sidebarShow, setSidebarShow] = useState(true);

  return (
    <VoiceCallProvider>
      <div>
        <AppSidebar sidebarShow={sidebarShow} setSidebarShow={setSidebarShow} />
        <div className="wrapper d-flex flex-column min-vh-100">
          <AppHeader
            sidebarShow={sidebarShow}
            setSidebarShow={setSidebarShow}
          />
          <div className="body flex-grow-1">
            <AppContent />
          </div>
          <AppFooter />
        </div>
        <VoiceCallModal />
      </div>
    </VoiceCallProvider>
  );
};

export default DefaultLayout;
