import React, { useEffect, useReducer, useState } from "react";
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormCheck,
  CButton,
  CFormSelect,
  CAlert,
} from "@coreui/react";

import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
const reducer = (state, action) => {
  switch (action.type) {
    case "GENERATE_CERTIFICATE_REQUEST":
      return { ...state, createLoading: true, createError: "" };
    case "GENERATE_CERTIFICATE_SUCCESS":
      return {
        ...state,
        createLoading: false,
      };
    case "GENERATE_CERTIFICATE_FAIL":
      return { ...state, createLoading: false, createError: action.payload };
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
    default:
      return state;
  }
};
const GenerateNewCertificate = () => {
  const [
    {
      createLoading,
      success,
      createError,
      sites,
      loadingSites,
      sitesError,
      loadingDoc,
      fetchDocError,
      docs,
    },
    dispatch,
  ] = useReducer(reducer, {
    createLoading: false,
    success: false,
    createError: "",
    sites: [],
    loadingSites: false,
    sitesError: "",
    loadingDoc: false,
    fetchDocError: "",
    docs: [],
  });

  const [selectedRobots, setSelectedRobots] = useState([]);
  const userInfo = useSelector((state) => state.userInfo);
  const authtoken = useSelector((state) => state.authtoken);
  const [site_id, setSiteId] = useState("all");

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

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSites = async () => {
      dispatch({ type: "FETCH_SITES_REQUEST" });
      try {
        const result = await axios.get(`/api/v1/sites`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        dispatch({
          type: "FETCH_SITES_SUCCESS",
          payload: result.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_SITES_FAIL",
          payload: error.response?.data?.error || error.response?.data?.message,
        });
      }
    };
    fetchSites();
  }, [authtoken]);

  useEffect(() => {
    const fetchRobots = async () => {
      dispatch({ type: "FETCH_DOCS_REQUEST" });
      try {
        const result = await axios.get(
          `/api/v1/commisioning-docs/commisioned-sitewise-not-incertificates-robots/${site_id}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
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

    fetchRobots();
  }, [adminroute, authtoken, site_id]);

  const handleSiteNameChange = (e) => {
    const selectedSiteId = e.target.value;
    setSiteId(selectedSiteId); // Updates local state
  };

  const signatures = [
    {
      for: "TAYPRO PVT LTD",
      name: userInfo?.username,
      designation: userInfo?.designation,
    },
    {
      for: "RECEIVER",
      name: "",
      designation: "",
    },
    {
      for: "RECEIVER",
      name: "",
      designation: "",
    },
  ];

  // ✅ Filter robots
  // const filteredRobots = docs.filter(
  //   (r) =>
  //     r.status === "completed" &&
  //     (r.commissioning_certificate_id === null ||
  //       r.commissioning_certificate_id === ""),
  // );

  // ✅ Handle checkbox toggle
  const handleSelect = (robot) => {
    setSelectedRobots((prev) =>
      prev.some((r) => r.commisioning_doc_id === robot.commisioning_doc_id)
        ? prev.filter(
            (r) => r.commisioning_doc_id !== robot.commisioning_doc_id,
          )
        : [...prev, robot],
    );
  };

  // let project_code = "AVAADA_AGAR_001";

  const handleGenerate = async () => {
    try {
      dispatch({ type: "GENERATE_CERTIFICATE_REQUEST" });

      const res = await axios.post(
        `/api/v1/commisioning-certificates`,
        { robots: selectedRobots, signatures },
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        },
      );

      dispatch({ type: "GENERATE_CERTIFICATE_SUCCESS" });

      navigate(`/${adminroute}/commissioning/view/${res.data.data._id}`);
      toast.success("Certificate Generated Successfully");
    } catch (error) {
      dispatch({
        type: "GENERATE_CERTIFICATE_FAIL",
        payload:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed",
      });

      toast.error(error.response?.data?.message || error.response?.data?.error);
    }
  };

  return (
    <div>
      <h5>Select Robots for Certificate</h5>

      <div className="d-flex justify-content-between align-items-center my-2">
        {/* Debug */}
        {selectedRobots.length > 0 && (
          <div className="mt-2">
            Selected Robots: {selectedRobots.map((r) => r.robot_no)}
          </div>
        )}

        <div>
          {loadingSites ? (
            <LoadingSpinner />
          ) : sitesError ? (
            <CAlert>{sitesError}</CAlert>
          ) : sites?.length > 0 ? (
            <CFormSelect
              name="site_id"
              value={site_id}
              onChange={handleSiteNameChange}
            >
              <option value="all">All Data</option>
              {sites.map((item) => (
                <option key={item.site_id} value={item.site_id}>
                  {item.site_id}
                </option>
              ))}
            </CFormSelect>
          ) : (
            <p>No SItes Found</p>
          )}

          {/* ✅ Show button only if selection exists */}
          {selectedRobots.length > 0 && (
            <div className="m-1 d-flex justify-content-end align-items-end">
              <CButton size="sm" color="primary" onClick={handleGenerate}>
                {createLoading
                  ? "Generating..."
                  : `Generate Certificate (${selectedRobots.length})`}
              </CButton>
            </div>
          )}
        </div>
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
          {
            // docs.length === 0 ? (
            // <CTableRow>
            //   <CTableDataCell colSpan={6}>
            //     No eligible robots found
            //   </CTableDataCell>
            // </CTableRow>
            // )
            loadingDoc ? (
              <CTableRow>
                <CTableDataCell colSpan={6}>
                  <LoadingSpinner />
                </CTableDataCell>
              </CTableRow>
            ) : fetchDocError ? (
              <CTableRow>
                <CTableDataCell colSpan={6}>
                  <CAlert color="danger">{fetchDocError}</CAlert>
                </CTableDataCell>
              </CTableRow>
            ) : docs.length > 0 ? (
              docs.map((robot, index) => (
                <CTableRow key={robot._id}>
                  <CTableDataCell>
                    <CFormCheck
                      checked={selectedRobots.some(
                        (r) => r.commisioning_doc_id === robot._id,
                      )}
                      onChange={() =>
                        handleSelect({
                          commisioning_doc_id: robot._id,
                          robot_no: robot.robot_no,
                          robot_type: robot.robot_type,

                          block: robot.block,
                          system_code:
                            robot.robot_type === "Automatic"
                              ? "TPL-AUTOMATIC-1"
                              : "TPL-SEMI-AUTOMATIC-1",
                        })
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
            ) : (
              <CTableRow>
                <CTableDataCell colSpan={6}>No docs found</CTableDataCell>
              </CTableRow>
            )
          }
        </CTableBody>
      </CTable>
    </div>
  );
};

export default GenerateNewCertificate;
