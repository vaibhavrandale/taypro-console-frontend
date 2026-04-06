import React, { useState } from "react";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormCheck,
} from "@coreui/react";

import { robot_commissioning_doc } from "./cdata";
import { cilX } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import toast from "react-hot-toast";

const RobotSelectionModal = ({ visible, onClose, onSelect }) => {
  const [selected, setSelected] = useState([]);

  // ✅ Filter only completed robots
  const robots = robot_commissioning_doc.filter(
    (r) => r.status === "completed",
  );

  const handleToggle = (robot) => {
    setSelected((prev) =>
      prev.some((r) => r.id === robot._id)
        ? prev.filter((r) => r.id !== robot._id)
        : [...prev, { id: robot._id, robot_no: robot.robot_no }],
    );
  };

  const handleSubmit = () => {
    onSelect(selected);

    toast.success("Added");
    onClose();
  };

  return (
    <CModal visible={visible} onClose={onClose} size="lg" backdrop="static">
      <CModalHeader
        closeButton={false}
        className="d-flex justify-content-between align-items-center"
      >
        <CModalTitle>Select Robots</CModalTitle>
        <button
          type="button"
          className="border-0 ms-auto py-0 px-1"
          onClick={onClose}
          style={{ background: "none" }}
          disabled={!visible}
        >
          <CIcon icon={cilX} size="lg" />
        </button>
      </CModalHeader>

      <CModalBody>
        <CTable bordered hover responsive className="text-center">
          <CTableHead color="secondary">
            <CTableRow>
              <CTableHeaderCell>Select</CTableHeaderCell>
              <CTableHeaderCell>Robot No</CTableHeaderCell>
              <CTableHeaderCell>Block</CTableHeaderCell>
              <CTableHeaderCell>Type</CTableHeaderCell>
              <CTableHeaderCell>Site</CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {robots.map((robot) => (
              <CTableRow key={robot._id}>
                <CTableDataCell>
                  <CFormCheck
                    checked={selected.some((r) => r.id === robot._id)}
                    onChange={() => handleToggle(robot)}
                  />
                </CTableDataCell>

                <CTableDataCell>{robot.robot_no}</CTableDataCell>
                <CTableDataCell>{robot.block}</CTableDataCell>
                <CTableDataCell>{robot.robot_type}</CTableDataCell>
                <CTableDataCell>{robot.site_location}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CModalBody>

      <CModalFooter>
        <CButton size="sm" color="secondary" onClick={onClose}>
          Cancel
        </CButton>

        {selected.length > 0 && (
          <CButton size="sm" color="primary" onClick={handleSubmit}>
            Add Selected ({selected.length})
          </CButton>
        )}
      </CModalFooter>
    </CModal>
  );
};

export default RobotSelectionModal;
