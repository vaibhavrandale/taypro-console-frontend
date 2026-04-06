import React, { useState } from "react";
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormCheck,
  CButton,
} from "@coreui/react";

import { robot_commissioning_doc } from "./cdata";

const GenerateNewCertificate = () => {
  const [selectedRobots, setSelectedRobots] = useState([]);

  // ✅ Filter robots
  const filteredRobots = robot_commissioning_doc.filter(
    (r) =>
      r.status === "completed" &&
      (r.commissioning_certificate_id === null ||
        r.commissioning_certificate_id === ""),
  );

  // ✅ Handle checkbox toggle
  const handleSelect = (robot) => {
    setSelectedRobots((prev) =>
      prev.some((r) => r.id === robot.id)
        ? prev.filter((r) => r.id !== robot.id)
        : [...prev, robot],
    );
  };

  // ✅ Handler when user proceeds
  const handleGenerate = () => {
    console.log("Selected Robot IDs:", selectedRobots);

    // 👉 Next step (API call / navigation)
    // axios.post("/create-certificate", { robots: selectedRobots })
  };

  return (
    <div>
      <h5>Select Robots for Certificate</h5>

      <div className="d-flex justify-content-between align-items-center my-2">
        {/* Debug */}
        <div className="mt-2">
          Selected IDs:{" "}
          {selectedRobots.length > 0 && selectedRobots.map((r) => r.robot_no)}
        </div>

        {/* ✅ Show button only if selection exists */}
        {selectedRobots.length > 0 && (
          <div className="d-flex justify-content-end align-items-end">
            <CButton size="sm" color="primary" onClick={handleGenerate}>
              Generate Certificate ({selectedRobots.length})
            </CButton>
          </div>
        )}
      </div>

      <CTable bordered hover responsive className="text-center">
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>Select</CTableHeaderCell>
            <CTableHeaderCell>Sr</CTableHeaderCell>
            <CTableHeaderCell>Robot No</CTableHeaderCell>
            <CTableHeaderCell>Block</CTableHeaderCell>
            <CTableHeaderCell>Type</CTableHeaderCell>
            <CTableHeaderCell>Site</CTableHeaderCell>
          </CTableRow>
        </CTableHead>

        <CTableBody>
          {filteredRobots.length === 0 ? (
            <CTableRow>
              <CTableDataCell colSpan={6}>
                No eligible robots found
              </CTableDataCell>
            </CTableRow>
          ) : (
            filteredRobots.map((robot, index) => (
              <CTableRow key={robot._id}>
                <CTableDataCell>
                  <CFormCheck
                    checked={selectedRobots.some((r) => r.id === robot._id)}
                    onChange={() =>
                      handleSelect({ id: robot._id, robot_no: robot.robot_no })
                    }
                  />
                </CTableDataCell>

                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{robot.robot_no}</CTableDataCell>
                <CTableDataCell>{robot.block}</CTableDataCell>
                <CTableDataCell>{robot.robot_type}</CTableDataCell>
                <CTableDataCell>{robot.site_location}</CTableDataCell>
              </CTableRow>
            ))
          )}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default GenerateNewCertificate;
