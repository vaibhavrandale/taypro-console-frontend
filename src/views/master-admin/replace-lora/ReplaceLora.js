import React from 'react';
import {
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CRow,
  CCol,
} from '@coreui/react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Import icons

const ReplaceLora = () => {
  // const navigate = useNavigate();
  return (
    <div className="p-4">
      <h2 className="text-center">Replace Lora</h2>
      <CRow className="mt-4 justify-content-center">
        {/* Active Robots Card */}
        <CCol md={5} className="m-2">
          <CCard className="border-0 shadow-sm text-center">
            <CCardBody>
              <FaCheckCircle size={50} color="green" />
              <CCardTitle className="mt-3">Active Robots</CCardTitle>
              <CCardText>
                <p>
                  View and manage all <b>active</b> robots.
                </p>
                <p>(to replace lora 1st update new lora no using this link)</p>
              </CCardText>
              <Link
                className="btn btn-sm btn-success text-white"
                to="active-robots"
              >
                Active Robots
              </Link>
            </CCardBody>
          </CCard>
        </CCol>
        {/* Inactive Robots Card */}
        <CCol md={5} className="m-2">
          <CCard className="border-0 shadow-sm text-center">
            <CCardBody>
              <FaTimesCircle size={50} color="red" />
              <CCardTitle className="mt-3">Inactive Robots</CCardTitle>
              <CCardText>
                <p>
                  View and manage all <b>in-active</b> robots.
                </p>
                <p>
                  (After updating new lora no to activate robot use this link)
                </p>
              </CCardText>
              <Link
                className="btn btn-sm btn-danger text-white"
                color="danger"
                to="in-active-robots"
              >
                Inactive Robots
              </Link>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default ReplaceLora;
