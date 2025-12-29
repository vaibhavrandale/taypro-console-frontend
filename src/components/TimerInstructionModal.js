import React from "react";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CAlert,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";

const TimerInstructionModal = ({ visible, onClose }) => {
  return (
    <CModal
      visible={visible}
      onClose={onClose}
      size="lg"
      backdrop="static"
      scrollable
    >
      <CModalHeader closeButton={false}>
        <CModalTitle>Timer Execution Instructions</CModalTitle>
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
        <CAlert color="warning">
          ⚠ Incorrect date or time configuration may cause the timer to execute
          immediately or at an unexpected time.
        </CAlert>

        <h6 className="mt-3">
          📅 Setting Timer for <span className="text-success">Today</span>
        </h6>
        <ul>
          <li>
            If you want to execute{" "}
            <span className="text-success">Timer 1 today</span>:
          </li>
          <li>
            <span className="text-success">timer1_date</span> must be set to{" "}
            <span className="text-success">Yesterday</span>
          </li>
          <li>
            <span className="text-success">timer1</span> time should be set to
            the desired execution time for today
          </li>
          <li>
            Follow{" "}
            <span className="text-success">
              24-hour time format for Laptop/UserBasedLinkDashboard
            </span>{" "}
            (HH:mm)
          </li>
          <li>
            If you are operating from{" "}
            <span className="text-success">mobile follow 12 hr format</span> set
            am/pm according you time.
          </li>
          <li className="">
            <CAlert color="danger" className="p-1">
              If the date is not set correctly, the timer will execute
              immediately or within the next minute
            </CAlert>
          </li>
        </ul>

        <hr />

        <h6>
          📅 Setting Timer for <span className="text-success">Tomorrow</span>
        </h6>
        <ul>
          <li>
            If you want to execute{" "}
            <span className="text-success">Timer 1 tomorrow</span>:
          </li>
          <li>
            <span className="text-success">timer1_date</span> must be set to{" "}
            <span className="text-success">Today</span>
          </li>
          <li>
            <span className="text-success">timer1</span> time should be the
            desired execution time for tomorrow
          </li>
          <li>
            Follow <span className="text-success">24-hour time format</span>{" "}
            (HH:mm)
          </li>
          <li>
            If you are operating from{" "}
            <span className="text-success">mobile follow 12 hr format</span> set
            am/pm according you time.
          </li>
        </ul>

        <hr />

        <h6>🕒 Time Format Examples</h6>
        <ul>
          <li>06:30:00 → 6:30:00 AM</li>
          <li>14:00:00 → 2:00:00 PM</li>
          <li>18:45:00 → 6:45:00 PM</li>
        </ul>

        <CAlert color="info" className="mt-3">
          ✔ Always verify date and time before saving timers to avoid accidental
          execution.
        </CAlert>
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default TimerInstructionModal;
