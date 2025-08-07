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
    default:
      return state;
  }
};

const OpexTemplateManager = () => {
  const [
    { opexData, loadingOpex, error, createLoading, createError },
    dispatch,
  ] = useReducer(reducer, {
    opexData: {},
    loadingOpex: true,
    createError: "",
    createLoading: false,
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
      ) : error ? (
        <div className="d-flex justify-content-center">
          <CBadge color="danger" className="p-3">
            {error}
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
          {/* Cycles Information Card */}
          <CCard className="mb-4">
            <CCardHeader>
              <h5 className="mb-0">Cycles Information</h5>
            </CCardHeader>

            <CCardBody>
              <CTable bordered hover responsive>
                <CTableHead color="secondary">
                  <CTableRow>
                    <CTableHeaderCell>Cycle</CTableHeaderCell>
                    <CTableHeaderCell>Cycle id</CTableHeaderCell>
                    <CTableHeaderCell>Cycle status</CTableHeaderCell>
                    <CTableHeaderCell>Start Date</CTableHeaderCell>
                    <CTableHeaderCell>End Date</CTableHeaderCell>
                    <CTableHeaderCell>Planned</CTableHeaderCell>
                    <CTableHeaderCell>Cleaned</CTableHeaderCell>
                    <CTableHeaderCell>Remaining</CTableHeaderCell>{" "}
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
                        <CTableDataCell>{cycle._id}</CTableDataCell>
                        <CTableDataCell>
                          {cycle.is_cycle_verified ? (
                            <CBadge color="success">Verified</CBadge>
                          ) : (
                            <CBadge color="warning">Pending</CBadge>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          {new Date(cycle.start_date).toLocaleDateString()}
                        </CTableDataCell>
                        <CTableDataCell>
                          {new Date(cycle.end_date).toLocaleDateString()}
                        </CTableDataCell>
                        <CTableDataCell>{cycle.modules_planned}</CTableDataCell>
                        <CTableDataCell>
                          {" "}
                          {cycle.modules_cleaned}
                        </CTableDataCell>
                        <CTableDataCell>
                          {" "}
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
          <LastActivity lastactivity={opexData.last_activity} />
        </>
      )}
    </div>
  );
};
export default OpexTemplateManager;
