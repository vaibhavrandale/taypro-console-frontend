import React, { useEffect, useReducer } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CRow,
  CCol,
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CImage,
} from "@coreui/react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_OPEX_REQUEST":
      return { ...state, loadingOpex: true, error: "" };
    case "FETCH_OPEX_SUCCESS":
      return {
        ...state,
        loadingOpex: false,
        opexData: action.payload,
      };
    case "FETCH_OPEX_FAIL":
      return { ...state, loadingOpex: false, error: action.payload };
    default:
      return state;
  }
};

const OpexTemplateManager = () => {
  const [{ opexData, loadingOpex, error }, dispatch] = useReducer(reducer, {
    opexData: {},
    loadingOpex: true,
    error: "",
  });

  const authtoken = useSelector((state) => state.authtoken);
  const { site_id } = useParams();
  const userInfo = useSelector((state) => state.userInfo);

  let adminroute = "";
  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    adminroute = "project-admin";
  } else if (userInfo.role === "Master User") {
    adminroute = "master-user";
  } else if (userInfo.role === "Service User") {
    adminroute = "service-user";
  } else if (userInfo.role === "Project User") {
    adminroute = "project-user";
  } else if (userInfo.role === "Site Technician") {
    adminroute = "site-technician";
  }

  useEffect(() => {
    const fetchOpexData = async () => {
      dispatch({ type: "FETCH_OPEX_REQUEST" });
      try {
        const result = await axios.get(`/api/v1/opex/site/${site_id}`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });

        dispatch({
          type: "FETCH_OPEX_SUCCESS",
          payload: result.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_OPEX_FAIL",
          payload: error.response.data.message || error.response.data.error,
        });
        toast.error(error.response.data.message || error.response.data.error);
      }
    };
    fetchOpexData();
  }, [authtoken, site_id]);

  console.log(!opexData);

  return (
    <div className="mt-5">
      {!loadingOpex && Object.keys(opexData).length === 0 && (
        <div style={{ minWidth: "160px" }} className="text-end mb-2">
          <Link
            to={`/${adminroute}/opex-templates/create`}
            className="btn btn-warning btn-sm"
          >
            Create Template
          </Link>
        </div>
      )}

      {loadingOpex ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="d-flex justify-content-center">
          <CBadge color="danger" className="p-3">
            {error}
          </CBadge>
        </div>
      ) : (
        <>
          <CCard className="mb-4">
            <>
              <CCardHeader>
                <div className="d-flex w-100 align-items-center justify-content-between">
                  {/* Left: Client Logo */}
                  <div style={{ minWidth: "60px" }}>
                    {opexData.client.logo && (
                      <CImage
                        src={opexData?.client?.logo}
                        width={60}
                        height={60}
                        className="me-2 rounded-50"
                      />
                    )}
                  </div>

                  {/* Center: Title */}
                  <div className="flex-grow-1 text-center">
                    <h5 className="mb-0">Site Information</h5>
                  </div>

                  {/* Right: Create Template Button */}
                </div>
              </CCardHeader>

              <CCardBody>
                <CRow>
                  <CCol md={4}>
                    <div className="d-flex align-items-center mb-3">
                      <div>
                        <h6 className="text-primary mb-0">
                          {opexData.client.client_name}
                        </h6>
                        <CBadge color="info">{opexData.site.site_type}</CBadge>
                      </div>
                    </div>
                    <p className="mb-1">
                      <strong>Site:</strong> {opexData.site.siteName}
                    </p>
                    <p className="mb-1">
                      <strong>Location:</strong> {opexData.site.location}
                    </p>
                  </CCol>
                  <CCol md={4}>
                    <h6 className="text-primary">Modules Information</h6>
                    <p className="mb-1">
                      <strong>Total Modules:</strong>{" "}
                      <span className="fw-bold">{opexData.total_modules}</span>
                    </p>
                    <p className="mb-1">
                      <strong>Cycle Frequency:</strong>{" "}
                      <CBadge color="primary">
                        {opexData.cycle_frequency}
                      </CBadge>
                    </p>
                    <p className="mb-1">
                      <strong>Daily Target:</strong>{" "}
                      {opexData.modules_cleaned_per_day}
                    </p>
                  </CCol>
                  <CCol md={4}>
                    <h6 className="text-primary">Resources</h6>
                    <p className="mb-1">
                      <strong>Robots:</strong> {opexData.total_robots}
                    </p>
                    <p className="mb-1">
                      <strong>Manpower:</strong> {opexData.total_manpower}
                    </p>
                    <p className="mb-1">
                      <strong>Trolleys:</strong> {opexData.total_trolley}
                    </p>
                  </CCol>
                </CRow>
              </CCardBody>
            </>
          </CCard>

          {/* Blocks Configuration Card */}
          {opexData && opexData.blocks_data.length > 0 && (
            <CCard className="mb-4">
              <CCardHeader>
                <h5 className="mb-0">Blocks Configuration</h5>
              </CCardHeader>
              <CCardBody>
                <CTable bordered hover responsive>
                  <CTableHead color="secondary">
                    <CTableRow>
                      <CTableHeaderCell>Block No</CTableHeaderCell>
                      <CTableHeaderCell>Robots</CTableHeaderCell>
                      <CTableHeaderCell>Manpower</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {loadingOpex ? (
                      <CTableRow>
                        <CTableDataCell
                          colSpan="9"
                          className="text-center fw-bold"
                        >
                          <LoadingSpinner />
                        </CTableDataCell>
                      </CTableRow>
                    ) : error ? (
                      <CTableRow>
                        {" "}
                        <CTableDataCell
                          colSpan="9"
                          className="text-center fw-bold"
                        >
                          {error}
                        </CTableDataCell>
                      </CTableRow>
                    ) : opexData.blocks_data.length > 0 ? (
                      opexData.blocks_data.map((block, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>{block.block_no}</CTableDataCell>
                          <CTableDataCell>{block.no_of_robots}</CTableDataCell>
                          <CTableDataCell>
                            {block.no_of_manpower}
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell
                          colSpan="9"
                          className="text-center fw-bold"
                        >
                          No matching Result Found.
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          )}

          {opexData.cycles.length === 0 && (
            <div
              className="d-flex align-items-center justify-content-end mb-2"
              style={{ minWidth: "150px" }}
            >
              {!["Master User", "Project User", "Service User"].includes(
                userInfo.role
              ) && (
                <Link
                  to={`/${adminroute}/opex-templates/create-cycle/${site_id}`}
                  className="btn btn-primary btn-sm"
                >
                  Create Cycle
                </Link>
              )}
            </div>
          )}

          {/* Cycles Information Card */}
          <CCard className="mb-4">
            <CCardHeader>
              <div className="d-flex w-100 align-items-center justify-content-between">
                {/* Left: Total cycles badge */}
                <div
                  className="d-flex align-items-center"
                  style={{ minWidth: "100px" }}
                >
                  {opexData && opexData.cycles.length > 0 && (
                    <CBadge color="primary">
                      {opexData.cycles.length}/{opexData.total_cycles} Cycles
                    </CBadge>
                  )}
                </div>

                {/* Center: Heading */}
                <div className="flex-grow-1 text-center">
                  <h5 className="mb-0">Cycles Information</h5>
                </div>

                {/* Right: Create Cycle button (if role is allowed) */}
              </div>
            </CCardHeader>

            <CCardBody>
              <CTable bordered hover responsive>
                <CTableHead color="secondary">
                  <CTableRow>
                    <CTableHeaderCell>Cycle</CTableHeaderCell>
                    <CTableHeaderCell>Start Date</CTableHeaderCell>
                    <CTableHeaderCell>End Date</CTableHeaderCell>
                    <CTableHeaderCell>Modules</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {loadingOpex ? (
                    <CTableRow>
                      <CTableDataCell
                        colSpan="9"
                        className="text-center fw-bold"
                      >
                        <LoadingSpinner />
                      </CTableDataCell>
                    </CTableRow>
                  ) : error ? (
                    <CTableRow>
                      {" "}
                      <CTableDataCell
                        colSpan="9"
                        className="text-center fw-bold"
                      >
                        {error}
                      </CTableDataCell>
                    </CTableRow>
                  ) : opexData.cycles.length > 0 ? (
                    opexData.cycles.map((cycle, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>Cycle {index + 1}</CTableDataCell>
                        <CTableDataCell>
                          {new Date(cycle.start_date).toLocaleDateString()}
                        </CTableDataCell>
                        <CTableDataCell>
                          {new Date(cycle.end_date).toLocaleDateString()}
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex flex-column">
                            <span className="text-success">
                              Cleaned- {cycle.modules_cleaned.toLocaleString()}
                            </span>
                            <span className="text-warning">
                              Remaining-
                              {(
                                cycle.modules_planned - cycle.modules_cleaned
                              ).toLocaleString()}{" "}
                            </span>
                            <span className="text-primary">
                              Planned-
                              {cycle.modules_planned.toLocaleString()}
                            </span>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          {cycle.modules_cleaned === cycle.modules_planned ? (
                            <CBadge color="success">Completed</CBadge>
                          ) : (
                            <CBadge color="warning">In Progress</CBadge>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          <Link
                            className="btn btn-primary btn-sm"
                            to={`/${adminroute}/opexdata/${site_id}/${opexData._id}/cycle/${cycle._id}`}
                          >
                            Manage
                          </Link>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell
                        colSpan="9"
                        className="text-center fw-bold"
                      >
                        No matching DPR found.
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </>
      )}
    </div>
  );
};
export default OpexTemplateManager;
