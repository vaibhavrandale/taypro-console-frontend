import {
  CAlert,
  CBadge,
  CCol,
  CFormSelect,
  CRow,
  CTab,
  CTabContent,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTabList,
  CTabPanel,
  CTabs,
} from "@coreui/react";
import React, { useEffect, useReducer, useState } from "react";
import { Link } from "react-router-dom";
// import { commissioning_certificates, robot_commissioning_doc } from "./cdata";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../components/LoadingSpinner";
import SiteSelect from "../../components/SiteSelect";

// status: "completed", // pending | in_progress | completed | failed
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_DOCS_REQUEST":
      return { ...state, loadingDoc: true, fetchDocError: "" };
    case "FETCH_DOCS_SUCCESS":
      return {
        ...state,
        loadingDoc: false,
        docs: action.payload,
      };
    case "FETCH_DOCS_FAIL":
      return { ...state, loadingDoc: false, fetchDocError: action.payload };

    case "FETCH_CERTIFICATES_REQUEST":
      return { ...state, loadingCertificates: true, certificatesError: "" };
    case "FETCH_CERTIFICATES_SUCCESS":
      return {
        ...state,
        loadingCertificates: false,
        certificates: action.payload,
      };
    case "FETCH_CERTIFICATES_FAIL":
      return {
        ...state,
        loadingCertificates: false,
        certificatesError: action.payload,
      };

    case "FETCH_SITES_REQUEST":
      return { ...state, loadingSites: true, sitesError: "" };
    case "FETCH_SITES_SUCCESS":
      return {
        ...state,
        loadingSites: false,
        sites: action.payload,
      };
    case "FETCH_SITES_FAIL":
      return { ...state, loadingSites: false, sitesError: action.payload };
    default:
      return state;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "warning";
    case "in_progress":
      return "primary";
    case "completed":
      return "success";
    case "failed":
      return "danger";
    default:
      return "secondary";
  }
};
const CommisioningDashboard = () => {
  const [
    {
      loadingDoc,
      fetchDocError,
      docs,
      sites,
      loadingSites,
      sitesError,
      loadingCertificates,
      certificates,
      certificatesError,
    },
    dispatch,
  ] = useReducer(reducer, {
    loadingDoc: false,
    fetchDocError: "",
    docs: [],
    sites: [],
    loadingSites: false,
    sitesError: "",
    certificates: [],
    loadingCertificates: false,
    certificatesError: "",
  });
  const userInfo = useSelector((state) => state.userInfo);
  // const authtoken = useSelector((state) => state.authtoken);
  const [site_id, setSiteId] = useState("all");
  // let site_id = "avaada_soyegaon";

  useEffect(() => {
    const fetchSites = async () => {
      dispatch({ type: "FETCH_SITES_REQUEST" });
      try {
        const result = await axios.get(`/api/v1/sites`, {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        });
        dispatch({
          type: "FETCH_SITES_SUCCESS",
          payload: result.data.data,
        });
        setSiteId(result.data.data[0]?.site_id); // Set default site_id to the first site or "all" if no sites
      } catch (error) {
        dispatch({
          type: "FETCH_SITES_FAIL",
          payload: error.response?.data?.error || error.response?.data?.message,
        });
      }
    };
    fetchSites();
  }, []);

  useEffect(() => {
    const fetchRobots = async () => {
      dispatch({ type: "FETCH_DOCS_REQUEST" });
      try {
        const result = await axios.get(
          `/api/v1/commisioning-docs/commisioned-sitewise-robots/${site_id}`,
          {
            // headers: { Authorization: `Bearer ${authtoken}` },
            withCredentials: true,
          },
        );

        dispatch({
          type: "FETCH_DOCS_SUCCESS",

          payload: result.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_DOCS_FAIL",
          payload: error.response?.data?.message || error.response?.data?.error,
        });
        toast.error(
          error.response?.data?.message || error.response?.data?.error,
        );
      }
    };

    const fetchCertificates = async () => {
      dispatch({ type: "FETCH_CERTIFICATES_REQUEST" });
      try {
        const result = await axios.get(
          `/api/v1/commisioning-certificates/sitewise-certificates/${site_id}`,
          {
            // headers: { Authorization: `Bearer ${authtoken}` },
            withCredentials: true,
          },
        );

        dispatch({
          type: "FETCH_CERTIFICATES_SUCCESS",

          payload: result.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_CERTIFICATES_FAIL",
          payload: error.response?.data?.message || error.response?.data?.error,
        });
        toast.error(
          error.response?.data?.message || error.response?.data?.error,
        );
      }
    };

    fetchRobots();
    fetchCertificates();
  }, [site_id]);

  let adminroute = "";

  if (userInfo?.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo?.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo?.role === "Project Admin") {
    adminroute = "project-admin";
  } else if (userInfo?.role === "Client Admin") {
    adminroute = "client-admin";
  } else if (userInfo?.role === "Site Incharge") {
    adminroute = "site-incharge";
  } else if (userInfo?.role === "Site Technician") {
    adminroute = "site-technician";
  } else if (userInfo?.role === "Client Site Technician") {
    adminroute = "client-site-technician";
  } else if (userInfo?.role === "Master User") {
    adminroute = "master-user";
  } else if (userInfo?.role === "Service User") {
    adminroute = "service-user";
  } else if (userInfo?.role === "Project User") {
    adminroute = "project-user";
  } else if (userInfo?.role === "Factory Admin") {
    adminroute = "factory-admin";
  }

  const handleSiteNameChange = (e) => {
    const selectedSiteId = e.target.value;
    setSiteId(selectedSiteId); // Updates local state
  };

  return (
    <div>
      {/* <Link to="/master-admin/commissioning/view/1234">View Doc</Link> */}
      <CRow className="my-2 d-flex align-items-center justify-content-end">
        <CCol md={3} xs={12} className="m-1">
          {loadingSites ? (
            <LoadingSpinner />
          ) : sitesError ? (
            <CAlert>{sitesError}</CAlert>
          ) : (
            <div>
              <SiteSelect value={site_id} onChange={setSiteId} />
            </div>
            // <CFormSelect
            //   name="site_id"
            //   value={site_id}
            //   onChange={handleSiteNameChange}
            // >
            //   <option value="all">All Data</option>

            //   {sites?.length > 0 &&
            //     sites.map((item) => (
            //       <option key={item.site_id} value={item.site_id}>
            //         {item.site_id}
            //       </option>
            //     ))}
            // </CFormSelect>
          )}
        </CCol>
      </CRow>
      <CTabs
        activeItemKey={`${userInfo?.type === "Internal" ? "comm-robots" : "comm-certificates"}`}
      >
        {/* ✅ ONLY tabs here */}
        <CTabList variant="tabs" className="border-bottom">
          {userInfo?.type === "Internal" && (
            <CTab itemKey="comm-robots" className="text-white">
              Commisioned Robots
            </CTab>
          )}
          <CTab itemKey="comm-certificates" className="text-white">
            Commisioned Certificates
          </CTab>
        </CTabList>

        {/* ✅ Content OUTSIDE */}
        <CTabContent>
          <CTabPanel itemKey="comm-certificates">
            <div className="d-flex justify-content-end align-items-center my-2">
              {userInfo?.type === "Internal" && (
                <Link className="btn btn-sm" to="new-certificate">
                  New Certificate
                </Link>
              )}
            </div>
            <CTable
              bordered
              hover
              responsive
              className="text-center bg-important mb-2"
            >
              <CTableHead color="secondary">
                <CTableRow>
                  <CTableHeaderCell>Sr</CTableHeaderCell>
                  <CTableHeaderCell>Certificate No</CTableHeaderCell>
                  <CTableHeaderCell>Project Code</CTableHeaderCell>
                  <CTableHeaderCell>Client Name</CTableHeaderCell>
                  <CTableHeaderCell>Site Location</CTableHeaderCell>
                  <CTableHeaderCell>Client Verification</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {loadingCertificates ? (
                  <CTableRow>
                    <CTableDataCell colSpan={6}>
                      {" "}
                      <LoadingSpinner />
                    </CTableDataCell>
                  </CTableRow>
                ) : certificatesError ? (
                  <CTableRow>
                    <CTableDataCell colSpan={6}>
                      {" "}
                      <CAlert>{certificatesError}</CAlert>
                    </CTableDataCell>
                  </CTableRow>
                ) : certificates.length > 0 ? (
                  certificates.map((cert, index) => (
                    <CTableRow key={cert._id}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>
                        <Link
                          to={`/${adminroute}/commissioning/view/${cert._id}`}
                        >
                          {cert.certificate_no}
                        </Link>
                      </CTableDataCell>
                      <CTableDataCell>{cert.project_code}</CTableDataCell>
                      <CTableDataCell>{cert.client_name}</CTableDataCell>
                      <CTableDataCell>{cert.site_location}</CTableDataCell>
                      <CTableDataCell>
                        {cert.signatures[1]?.verified ? (
                          <CBadge color="success">Verified</CBadge>
                        ) : (
                          <CBadge color="danger">Pending</CBadge>
                        )}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={6}>
                      No Certificate Found
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </CTabPanel>

          <CTabPanel itemKey="comm-robots">
            <CRow className="my-2 d-flex align-items-center justify-content-end">
              <CCol md={2} xs={12} className="m-1">
                {" "}
                {userInfo?.type === "Internal" && (
                  <Link className="btn btn-sm" to="non-commisioned-robots">
                    New Commisioning
                  </Link>
                )}
              </CCol>
            </CRow>
            <CTable
              bordered
              hover
              responsive
              className="text-center bg-important mb-2"
            >
              <CTableHead color="secondary">
                <CTableRow>
                  <CTableHeaderCell>Sr</CTableHeaderCell>
                  <CTableHeaderCell>Robot No</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Site ID</CTableHeaderCell>
                  <CTableHeaderCell>Block</CTableHeaderCell>
                  <CTableHeaderCell>Client Name</CTableHeaderCell>
                  <CTableHeaderCell>Site Location</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {loadingDoc ? (
                  <CTableRow>
                    <CTableDataCell colSpan={8}>
                      {" "}
                      <LoadingSpinner />
                    </CTableDataCell>
                  </CTableRow>
                ) : fetchDocError ? (
                  <CTableRow>
                    <CTableDataCell colSpan={8}>
                      {" "}
                      <CAlert>{fetchDocError}</CAlert>
                    </CTableDataCell>
                  </CTableRow>
                ) : docs.length > 0 ? (
                  docs.map((robot, index) => (
                    <CTableRow key={robot._id}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>
                        <Link
                          to={`/${adminroute}/commissioning/view-robot-commisioning-doc/${robot._id}`}
                        >
                          {" "}
                          {robot.robot_no}
                        </Link>{" "}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={`${getStatusColor(robot.status)}`}>
                          {robot.status}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>{robot.site_id}</CTableDataCell>
                      <CTableDataCell>{robot.block}</CTableDataCell>
                      <CTableDataCell>{robot.client_name}</CTableDataCell>
                      <CTableDataCell>{robot.site_location}</CTableDataCell>
                      <CTableDataCell>
                        <Link
                          className="btn btn-sm m-1"
                          to={`/${adminroute}/commissioning/view-robot-commisioning-doc/${robot._id}`}
                        >
                          View
                        </Link>
                        {userInfo?.type === "Internal" && (
                          <Link
                            className="btn btn-sm m-1"
                            to={`/${adminroute}/commissioning/update-robot-commisioning-doc/${robot._id}`}
                          >
                            Update
                          </Link>
                        )}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={8}>No Docs Found..</CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </CTabPanel>
        </CTabContent>
      </CTabs>
    </div>
  );
};

export default CommisioningDashboard;
