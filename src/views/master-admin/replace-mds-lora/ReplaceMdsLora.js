// import React from 'react'

// const ReplaceMdsLora = () => {
//   return (
//     <div>ReplaceMdsLora</div>
//   )
// }

// export default ReplaceMdsLora

import React from "react";
import {
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CRow,
  CCol,
} from "@coreui/react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"; // Import icons

const ReplaceMdsLora = () => {
  return (
    <div className="p-4">
      <h2 className="text-center">Replace MDS Lora</h2>
      <CRow className="mt-4 justify-content-center">
        {/* Active Robots Card */}
        <CCol md={5} className="m-2">
          <CCard className="border-0 shadow-sm text-center">
            <CCardBody>
              <FaCheckCircle size={50} color="green" />
              <CCardTitle className="mt-3">Active MDS Devices</CCardTitle>
              <CCardText>
                <p>
                  View and manage all <b>active</b> MDS devices.
                </p>
                <p>(to replace lora 1st update new lora no using this link)</p>
              </CCardText>
              <Link
                className="btn btn-sm btn-success text-white"
                to="active-mdss"
              >
                Active MDS Devices
              </Link>
            </CCardBody>
          </CCard>
        </CCol>
        {/* Inactive MDS Devices Card */}
        <CCol md={5} className="m-2">
          <CCard className="border-0 shadow-sm text-center">
            <CCardBody>
              <FaTimesCircle size={50} color="red" />
              <CCardTitle className="mt-3">Inactive MDS Devices</CCardTitle>
              <CCardText>
                <p>
                  View and manage all <b>in-active</b> MDS devices.
                </p>
                <p>
                  (After updating new lora no to activate MDS device use this
                  link)
                </p>
              </CCardText>
              <Link
                className="btn btn-sm btn-danger text-white"
                color="danger"
                to="in-active-mdss"
              >
                Inactive MDS Devices
              </Link>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default ReplaceMdsLora;
