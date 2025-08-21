import React from "react";
import { CFooter } from "@coreui/react";
import logo from "../assets/brand/favicon.png";
import { Link } from "react-router-dom";
const AppFooter = () => {
  return (
    <CFooter className="px-4" style={{ background: "#080f25" }}>
      <div className="ms-auto">
        <img
          src={logo}
          alt="Company Logo"
          style={{ width: "30px", height: "30px", marginRight: "8px" }}
        />
        <Link
          className="text-decoration-none"
          to="https://taypro.in"
          target="_blank"
          rel="noopener noreferrer"
        >
          Taypro Private Limited
        </Link>
        <span className="ms-1">
          <b>&copy; {new Date().getFullYear()}</b>
        </span>
      </div>
    </CFooter>
  );
};

export default React.memo(AppFooter);
