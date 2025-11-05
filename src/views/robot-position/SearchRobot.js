import { CCol, CFormInput, CInputGroup, CRow } from "@coreui/react";
import React, { useState } from "react";

const SearchRobot = ({ robots }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRobot, setFilteredRobot] = useState([]);

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 0) {
      const filtered = robots.filter((robot) =>
        robot.robot_no.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredRobot(filtered);
    } else {
      setFilteredRobot([]);
    }
  };
  return (
    <div>
      <CRow className="justify-content-center my-3">
        <CCol md={4}>
          <CInputGroup className="mb-3">
            <CFormInput
              type="text"
              placeholder="Search by Robot No..."
              value={searchTerm}
              className="form-control"
              onChange={handleSearchChange}
            />
          </CInputGroup>
        </CCol>
      </CRow>
    </div>
  );
};

export default SearchRobot;
