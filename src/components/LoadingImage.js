import React from "react";
import loading from "../assets/loading/loading.gif";
const LoadingImage = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "70vh",
      }}
    >
      <img src={loading} alt="taypro-loading" />
    </div>
  );
};

export default LoadingImage;
