import { Expand, Shrink } from "lucide-react";

import React, { useState, useEffect } from "react";
import { CButton } from "@coreui/react";

const FullScreen = ({ pageRef }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const enterFullScreen = () => {
    if (pageRef.current?.requestFullscreen) {
      pageRef.current.requestFullscreen();
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  // Detect full screen change
  useEffect(() => {
    const handleChange = () => {
      setIsFullScreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleChange);
    };
  }, []);

  return (
    <>
      <CButton
        size="sm"
        color={isFullScreen ? "danger" : "primary"}
        onClick={isFullScreen ? exitFullScreen : enterFullScreen}
      >
        {isFullScreen ? <Shrink size={16} /> : <Expand size={16} />}
      </CButton>
    </>
  );
};

export default FullScreen;
