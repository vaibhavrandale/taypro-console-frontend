import React, { useEffect, useReducer, useState } from "react";
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
  CButton,
  CFormCheck,
} from "@coreui/react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import LastActivity from "../../../components/LastActivity";

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

    case "CREATE_REQUEST":
      return { ...state, createLoading: true, createError: "", success: false };
    case "CREATE_SUCCESS":
      return { ...state, createLoading: false, success: true };
    case "CREATE_FAIL":
      return { ...state, createLoading: false, createError: action.payload };

    case "GENERATE_CERTIFICATE_REQUEST":
      return { ...state, generatingCertificate: true, certificateError: "" };
    case "GENERATE_CERTIFICATE_SUCCESS":
      return {
        ...state,
        generatingCertificate: false,
        opexData: action.payload,
        selectedCycles: [],
      };
    case "GENERATE_CERTIFICATE_FAIL":
      return {
        ...state,
        generatingCertificate: false,
        certificateError: action.payload,
      };

    case "VERIFY_CYCLE_REQUEST":
      return {
        ...state,
        verifyCycleLoading: true,
        verifyCycleError: "",
        success: false,
      };
    case "VERIFY_CYCLE_SUCCESS":
      return {
        ...state,
        verifyCycleLoading: false,

        // cycles: [...state.opexData.cycles, action.payload],
        opexData: {
          ...state.opexData,
          cycles: state.opexData.cycles.map((cycle) =>
            cycle._id === action.payload._id ? action.payload : cycle
          ),
        },
      };
    case "VERIFY_CYCLE_FAIL":
      return {
        ...state,
        verifyCycleLoading: false,
        verifyCycleError: action.payload,
      };

    default:
      return state;
  }
};

const OpexTemplateManager = () => {
  const [
    {
      opexData,
      loadingOpex,
      error,
      createLoading,
      createError,
      generatingCertificate,
      certificateError,
      verifyCycleError,
      verifyCycleLoading,
    },
    dispatch,
  ] = useReducer(reducer, {
    opexData: {},
    loadingOpex: true,
    createError: "",
    createLoading: false,
    error: "",
    generatingCertificate: false,
    certificateError: "",
    verifyCycleError: "",
    verifyCycleLoading: false,
  });

  const [selectedCycles, setSelectedCycles] = useState([]);
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

  useEffect(() => {
    fetchOpexData();
  }, [authtoken]);

  const handleCreateCycle = async (id) => {
    dispatch({ type: "CREATE_REQUEST" });

    try {
      const response = await axios.post(
        `/api/v1/opex/first-cycle/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authtoken}`,
            "Content-Type": "application/json",
          },
        }
      );

      dispatch({
        type: "CREATE_SUCCESS",
        sucess: true,
      });

      if (response.status === 201 || response.status === 200) {
        toast.success(response.data.message);
      }
      fetchOpexData();
    } catch (error) {
      dispatch({
        type: "CREATE_FAIL",
        payload: error.response.data.message || error.response.data.error,
      });
      toast.error(error.response.data.message || error.response.data.error);
    }
  };

  // Handle checkbox selection
  const handleCheckboxChange = (cycle) => {
    setSelectedCycles((prev) =>
      prev.some((c) => c._id === cycle._id)
        ? prev.filter((c) => c._id !== cycle._id)
        : [...prev, cycle]
    );
  };

  // Select all cycles
  const selectAllCycles = () => {
    if (selectedCycles.length === opexData.cycles.length) {
      setSelectedCycles([]);
    } else {
      setSelectedCycles([...opexData.cycles]);
    }
  };

  // Generate certificate for selected cycles
  const generateCertificate = async () => {
    if (selectedCycles.length === 0) {
      toast.error("Please select at least one cycle to generate certificate");
      return;
    }

    dispatch({ type: "GENERATE_CERTIFICATE_REQUEST" });

    try {
      const response = await axios.put(
        `/api/v1/opex/generate-certificate/${opexData._id}`,
        { cyclesArray: selectedCycles.map((cycle) => cycle._id) },
        { headers: { Authorization: `Bearer ${authtoken}` } }
      );

      dispatch({
        type: "GENERATE_CERTIFICATE_SUCCESS",
        payload: response.data.updatedModule,
      });

      toast.success("Certificate generated successfully");
      fetchOpexData();
    } catch (error) {
      dispatch({
        type: "GENERATE_CERTIFICATE_FAIL",
        payload: error.response?.data?.message || error.response?.data?.error,
      });
      toast.error(error.response?.data?.message || error.response?.data?.error);
    }
  };

  const verifyCycleHandler = async (id) => {
    dispatch({ type: "VERIFY_CYCLE_REQUEST" });

    try {
      const response = await axios.put(
        `/api/v1/opex/verify-cycle/${opexData._id}/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authtoken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      dispatch({
        type: "VERIFY_CYCLE_SUCCESS",
        payload: response.data.cycle,
      });

      toast.success(response.data.message);
    } catch (error) {
      dispatch({
        type: "VERIFY_CYCLE_FAIL",
        payload: error.response.data.message || error.response.data.error,
      });
      toast.error(error.response.data.message || error.response.data.error);
    }
  };

  return (
    <div className="mt-5">
      {!loadingOpex && Object.keys(opexData).length === 0 && (
        <div style={{ minWidth: "160px" }} className="text-end mb-2">
          <Link
            to={`/${adminroute}/create-template/${site_id}`}
            className="btn btn-warning btn-sm"
          >
            Create Template
          </Link>
        </div>
      )}

      {loadingOpex ? (
        <LoadingSpinner />
      ) : error || certificateError || verifyCycleError ? (
        <div className="d-flex justify-content-center">
          <CBadge color="danger" className="p-3">
            {error || certificateError || verifyCycleError}
          </CBadge>
        </div>
      ) : (
        <>
          <CCard className="mb-4">
            <CCardHeader>
              <div className="d-flex w-100 align-items-center justify-content-between">
                {/* Left: Client Logo */}

                {/* Center: Title */}
                <div className="">
                  <h5 className="mb-0">Site Information</h5>
                </div>
              </div>
            </CCardHeader>

            <CCardBody>
              <CRow>
                <CCol md={4}>
                  <div className="d-flex align-items-between mb-3">
                    <div
                      style={{ minWidth: "60px", background: "#fff" }}
                      className="m-1"
                    >
                      {opexData.client.logo && (
                        <CImage
                          src={opexData.client.logo}
                          width={90}
                          height={60}
                          className="me-2"
                          style={{ objectFit: "contain" }}
                        />
                      )}
                    </div>
                    <div>
                      <h6 className="text-danger mb-0">
                        {opexData.client.client_name}
                      </h6>
                      <CBadge color="success">{opexData.site.site_type}</CBadge>
                    </div>
                  </div>
                  <p className="mb-1">Site : {opexData.site.siteName}</p>
                  <p className="mb-1">Location : {opexData.site.location}</p>
                </CCol>
                <CCol md={4}>
                  <h6 className="text-success">Modules Information</h6>
                  <p className="mb-1">
                    Total Modules :{" "}
                    <span className="">{opexData.total_modules}</span>
                  </p>
                  <p className="mb-1">
                    Cycle Frequency :{" "}
                    <CBadge color="success">{opexData.cycle_frequency}</CBadge>
                  </p>
                  <p className="mb-1">
                    Daily Target : {opexData.modules_cleaned_per_day}
                  </p>
                </CCol>
                <CCol md={4}>
                  <h6 className="text-success">Resources</h6>
                  <p className="mb-1">Robots : {opexData.total_robots}</p>
                  <p className="mb-1">Manpower : {opexData.total_manpower}</p>
                  <p className="mb-1">Trolleys : {opexData.total_trolley}</p>
                </CCol>
              </CRow>
            </CCardBody>
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

          {/* certificate Card */}
          {opexData && opexData.blocks_data.length > 0 && (
            <CCard className="mb-4">
              <CCardHeader>
                <h5 className="mb-0">Certificates</h5>
              </CCardHeader>
              <CCardBody>
                <CTable bordered hover responsive>
                  <CTableHead color="secondary">
                    <CTableRow>
                      <CTableHeaderCell>Month</CTableHeaderCell>
                      <CTableHeaderCell>Certificate ID</CTableHeaderCell>
                      <CTableHeaderCell>Verified By</CTableHeaderCell>
                      <CTableHeaderCell>Verified At</CTableHeaderCell>
                      <CTableHeaderCell>Action</CTableHeaderCell>
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
                    ) : opexData.certificates.length > 0 ? (
                      opexData.certificates.map((block, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>
                            {new Date(
                              block.verified_by.timestamp
                            ).toLocaleString("en-GB", {
                              month: "2-digit",
                            })}
                          </CTableDataCell>
                          <CTableDataCell>{block._id}</CTableDataCell>
                          <CTableDataCell>
                            {block.verified_by.name}
                          </CTableDataCell>
                          <CTableDataCell>
                            {new Date(
                              block.verified_by.timestamp
                            ).toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </CTableDataCell>
                          <CTableDataCell>
                            <Link
                              className="btn btn-primary btn-sm m-1"
                              to={`/${adminroute}/opexdata/${site_id}/opex-certificate/${block._id}`}
                            >
                              View
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
                          No certificates Found.
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          )}

          <div
            className="d-flex flex-column align-items-end justify-content-end mb-2"
            style={{ minWidth: "150px" }}
          >
            {!["Master User", "Project User", "Service User"].includes(
              userInfo.role
            ) && (
              <Link
                // to={`/${adminroute}/opex-templates/create-cycle/${site_id}`}
                onClick={() => handleCreateCycle(opexData._id)}
                className="btn btn-primary btn-sm"
              >
                {createLoading ? (
                  <>
                    Creating <LoadingSpinner />
                  </>
                ) : (
                  "Create Cycle"
                )}{" "}
              </Link>
            )}
            {createError ? (
              <span className="text-danger">{createError}</span>
            ) : (
              ""
            )}
          </div>

          <div className="d-flex justify-content-end mb-3">
            {selectedCycles.length > 0 ? (
              <CButton
                color="success"
                size="sm"
                onClick={generateCertificate}
                disabled={generatingCertificate || selectedCycles.length === 0}
              >
                {generatingCertificate ? (
                  <>
                    Generating Certificate <LoadingSpinner />
                  </>
                ) : (
                  "Generate Certificate"
                )}
              </CButton>
            ) : (
              ""
            )}
          </div>

          {/* Cycles Information Card */}
          <CCard className="mb-4">
            <CCardHeader>
              <h5 className="mb-0">Cycles Information</h5>
            </CCardHeader>

            <CCardBody>
              <CTable bordered hover responsive>
                <CTableHead color="secondary">
                  <CTableRow>
                    <CTableHeaderCell>
                      <CFormCheck
                        checked={
                          opexData.cycles &&
                          selectedCycles.length === opexData.cycles.length
                        }
                        onChange={selectAllCycles}
                      />
                    </CTableHeaderCell>
                    <CTableHeaderCell>Cycle</CTableHeaderCell>
                    <CTableHeaderCell>Cycle id</CTableHeaderCell>
                    <CTableHeaderCell>Cycle status</CTableHeaderCell>
                    <CTableHeaderCell>Start Date</CTableHeaderCell>
                    <CTableHeaderCell>End Date</CTableHeaderCell>
                    <CTableHeaderCell>Planned</CTableHeaderCell>
                    <CTableHeaderCell>Cleaned</CTableHeaderCell>
                    <CTableHeaderCell>Remaining</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {loadingOpex ? (
                    <CTableRow>
                      <CTableDataCell
                        colSpan="10"
                        className="text-center fw-bold"
                      >
                        <LoadingSpinner />
                      </CTableDataCell>
                    </CTableRow>
                  ) : error ? (
                    <CTableRow>
                      <CTableDataCell
                        colSpan="10"
                        className="text-center fw-bold"
                      >
                        {error}
                      </CTableDataCell>
                    </CTableRow>
                  ) : opexData.cycles && opexData.cycles.length > 0 ? (
                    opexData.cycles.map((cycle, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>
                          <CFormCheck
                            checked={selectedCycles.some(
                              (c) => c._id === cycle._id
                            )}
                            onChange={() => handleCheckboxChange(cycle)}
                          />
                        </CTableDataCell>
                        <CTableDataCell>Cycle {index + 1}</CTableDataCell>
                        <CTableDataCell>{cycle._id}</CTableDataCell>
                        <CTableDataCell>
                          {cycle.is_cycle_verified ? (
                            <CBadge color="success">Verified</CBadge>
                          ) : (
                            <CBadge color="warning">Pending</CBadge>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          {new Date(cycle.start_date).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </CTableDataCell>
                        <CTableDataCell>
                          {new Date(cycle.end_date).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </CTableDataCell>
                        <CTableDataCell>{cycle.modules_planned}</CTableDataCell>
                        <CTableDataCell>{cycle.modules_cleaned}</CTableDataCell>
                        <CTableDataCell>
                          {cycle.modules_remaining}
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
                            className="btn btn-primary btn-sm m-1"
                            to={`/${adminroute}/opexdata/${site_id}/${opexData._id}/cycle/${cycle._id}`}
                          >
                            Manage
                          </Link>

                          {!cycle.is_cycle_verified &&
                          cycle.modules_planned === cycle.modules_cleaned ? (
                            <Link
                              className="btn btn-primary btn-sm m-1"
                              onClick={() => verifyCycleHandler(cycle._id)}
                            >
                              {verifyCycleLoading ? (
                                <LoadingSpinner />
                              ) : (
                                "Verify"
                              )}
                            </Link>
                          ) : cycle.is_cycle_verified ? (
                            <CBadge color="success">Verified</CBadge>
                          ) : (
                            <CBadge color="warning">Pending</CBadge>
                          )}
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell
                        colSpan="11"
                        className="text-center fw-bold"
                      >
                        No cycles found
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
          <LastActivity lastactivity={opexData.last_activity} />
        </>
      )}
    </div>
  );
};

export default OpexTemplateManager;
