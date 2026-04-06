import React, { useState } from "react";

import { commissioning_certificates } from "./cdata";
import "./commisioning.css";
// import Tayprofordarkbg from "../../../assets/brand/logofordarkbg.png";
import Tayprofordarkbg from "../../assets/brand/logofordarkbg.png";
import Tayproforwhitebg from "../../assets/brand/logoforwhitebg.png";
import { useParams } from "react-router-dom";
import RobotSelectionModal from "./RobotSelectionModal";
import { CButton } from "@coreui/react";
const ViewDoc = () => {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [selectedRobots, setSelectedRobots] = useState([]);
  const data = commissioning_certificates.find((doc) => doc._id === id);
  if (!data) return <div className="p-3">Document not found</div>;
  // const data = commissioning_certificates[0];
  if (!data) return null;

  const robots = data.robots || [];
  const sortedRobots = [...robots].sort((a, b) => {
    const typeOrder = { Automatic: 1, "Semi-Automatic": 2 };
    return (typeOrder[a.robot_type] || 99) - (typeOrder[b.robot_type] || 99);
  });
  // Split into 3 columns (1–10, 11–20, 21–30)
  const chunk = (arr, size) =>
    Array.from({ length: size }, (_, i) => arr[i] || null);

  const col1 = chunk(sortedRobots, 10);
  const col2 = chunk(sortedRobots.slice(10), 10);
  const col3 = chunk(sortedRobots.slice(20), 10);
  const uniquRobotTypes = [
    ...new Set(sortedRobots.filter(Boolean).map((r) => r.robot_type)),
  ].join(", ");

  const uniqueSystemCodes = [
    ...new Set(sortedRobots.filter(Boolean).map((r) => r.system_code)),
  ].join(", ");

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h4>Commissoning Doc</h4>
        <div>
          <CButton size="sm" onClick={() => window.print()}>
            Print
          </CButton>
          <CButton
            size="sm"
            className="ms-2"
            onClick={() => setShowModal(true)}
          >
            Add Robots
          </CButton>
        </div>
      </div>
      <div className="my-2 card rounded-0 doc-container">
        <div className="doc-body p-2">
          {/* HEADER */}
          <div className="doc-header ">
            <div className="logo border-start border-top border-bottom">
              {/* Screen logo */}
              <img
                src={Tayprofordarkbg}
                alt="Taypro Logo"
                className="logo-dark"
              />

              {/* Print logo */}
              <img
                src={Tayproforwhitebg}
                alt="Taypro Logo"
                className="logo-print"
              />
            </div>
            <div className="title border">
              <div className="bold">SOLAR MODULE DRY CLEANING</div>
              <div className="bold">SYSTEM COMMISSIONING</div>
            </div>
            <div className="meta-grid  border-top border-end border-bottom">
              <div className="cell label border-end border-bottom">DOC NO</div>
              <div className="cell value border-bottom">{data.doc_no}</div>

              <div className="cell label border-end border-bottom">REV NO</div>
              <div className="cell value border-bottom">A & 13-06-2024</div>
              <div className="cell label border-end border-bottom">
                PREPARED BY
              </div>
              <div className="cell value border-bottom">TEJAS MANE</div>

              <div className="cell label border-end ">APPROVED BY</div>
              <div className="cell value ">TEJAS MEMANE</div>
            </div>
          </div>

          <div className="info-grid  my-2">
            {[
              ["PROJECT CODE", data.project_code],
              ["CUSTOMER NAME", data.client_name],
              ["PLANT LOCATION", data.site_location],
              ["DATE", new Date().toLocaleDateString()],
              ["CERTIFICATE NO", data.certificate_no],
            ].map(([label, value], i) => (
              <React.Fragment key={i}>
                <div
                  className={`bold ps-1 cell label border-start  ${i === 0 ? "border-top border-bottom" : "border-bottom"}`}
                >
                  {label}
                </div>
                <div
                  className={`ps-1 cell value border-start border-end ${i === 0 ? "border-top border-bottom" : "border-bottom"}`}
                >
                  {value}
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* DESCRIPTION */}
          <div className="desc border">
            <span className="bold">SYSTEM OVERVIEW</span> : The solar module dry
            cleaning robot system is designed to efficiently clean and maintain
            solar PV modules. This document ensures all commissioning checks are
            completed.
          </div>

          <div className="type-grid  my-2">
            <div className="cell border-start border-top bold">
              TYPE OF SYSTEM
            </div>
            <div className="cell border-start border-top bold">SYSTEM CODE</div>
            <div className="cell border-start border-top border-end bold">
              SYSTEM QTY
            </div>

            <div className="cell border-start border-top border-bottom">
              {uniquRobotTypes}
            </div>
            <div className="cell system-code border-start border-top border-bottom">
              {uniqueSystemCodes}
            </div>
            <div className="cell border-start border-top border-bottom border-end">
              {robots.length}
            </div>
          </div>

          <div className="checklist-grid border-top border-start border-end mb-2">
            <div className="checklist-header bold">
              SYSTEM COMMISSIONING CHECK LIST POINT
            </div>

            {[
              "System condition (no visible damage)",
              "Fasteners tightness",
              "Battery voltage",
              "ON/OFF switch",
              "Direction switch",
              "Supporting wheels",
              "Drive train",
              "Brush cleaning",
              "Sensors",
              "Complete 1 test cycle",
            ].map((item, i) => (
              <React.Fragment key={i}>
                <div
                  className={`  cell text-center border-end border-bottom ${i === 0 ? "border-top" : ""}`}
                >
                  {i + 1}
                </div>
                <div
                  className={`cell  border-bottom ${i === 0 ? "border-top" : ""}`}
                >
                  <span className="ms-1">{item} </span>
                </div>
              </React.Fragment>
            ))}
          </div>

          <div className="robot-grid">
            {[col1, col2, col3].map((col, colIndex) => (
              <div key={colIndex} className="robot-col border">
                <div className="robot-header border-bottom">
                  <div className="bold">SR NO</div>
                  <div className="border-start bold">ROBOT NO</div>
                </div>

                {/* {col.map((r, i) => (
                  <div key={i} className="robot-row">
                    <div
                      className={`text-center border-end ${i === col.length - 1 ? "" : "border-bottom "}`}
                    >
                      {colIndex * 10 + i + 1}
                    </div>
                    <div
                      className={`text-center ${i === col.length - 1 ? "" : "border-bottom "}`}
                    >
                      {r && r.robot_type === "Automatic"
                        ? "A"
                        : r.robot_type === "Semi-Automatic"
                          ? "S"
                          : ""}
                      {r ? r.robot_no : ""}
                    </div>
                  </div>
                ))} */}
                {col.map((r, i) => {
                  const prefix =
                    r?.robot_type === "Automatic"
                      ? "A - "
                      : r?.robot_type === "Semi-Automatic"
                        ? "S - "
                        : "";

                  return (
                    <div key={i} className="robot-row">
                      <div
                        className={`text-center border-end ${
                          i === col.length - 1 ? "" : "border-bottom"
                        }`}
                      >
                        {colIndex * 10 + i + 1}
                      </div>

                      <div
                        className={`text-center ${
                          i === col.length - 1 ? "" : "border-bottom"
                        }`}
                      >
                        {r ? `${prefix}${r.robot_no}` : ""}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* SIGNATURES */}
          <div className="sign-grid">
            {data.signatures.map((item, i) => (
              <div
                key={i}
                className={`sign-box  border-top border-bottom   ${i === 0 ? "border-start border-end" : "border-end"}`}
              >
                <div className="sign-title ">CHECKED BY</div>
                <div className="sign-sub">For {item.for}</div>
                <div className="sign-line  border-top">Sign:</div>
                <div className="sign-line  border-top">
                  Name :<span className="ms-1">{item.name}</span>
                </div>
                <div className="sign-line  border-top">
                  Designation :<span className="ms-1">{item.designation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <RobotSelectionModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSelect={(robots) => {
          console.log("Selected from modal:", robots);
          setSelectedRobots(robots);
        }}
      />
    </>
  );
};

export default ViewDoc;
