import React, { useEffect, useReducer, useState } from "react";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormInput,
  CRow,
  CCol,
  CBadge,
  CAlert,
  CFormSelect,
} from "@coreui/react";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";

import LoadingSpinner from "../../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_ROBOTS_REQUEST":
      return { ...state, loadingRobots: true, error: "" };
    case "FETCH_ROBOTS_SUCCESS":
      return {
        ...state,
        loadingRobots: false,
        robots: action.payload,
      };
    case "FETCH_ROBOTS_FAIL":
      return { ...state, loadingRobots: false, error: action.payload };

    case "GENERATE_DOC_REQUEST":
      return {
        ...state,
        rowLoading: { ...state.rowLoading, [action.payload]: true },
        rowError: { ...state.rowError, [action.payload]: null },
      };

    case "GENERATE_DOC_SUCCESS":
      return {
        ...state,
        rowLoading: { ...state.rowLoading, [action.payload]: false },
      };

    case "GENERATE_DOC_FAIL":
      return {
        ...state,
        rowLoading: { ...state.rowLoading, [action.payload.id]: false },
        rowError: {
          ...state.rowError,
          [action.payload.id]: action.payload.error,
        },
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

const NonCommisionedRobots = () => {
  const [
    {
      robots,
      error,
      loadingRobots,
      generateError,
      rowLoading,
      rowError,
      sites,
      loadingSites,
      sitesError,
    },
    dispatch,
  ] = useReducer(reducer, {
    robots: [],
    loadingaddRobots: false,
    updateloading: false,
    error: "",

    rowLoading: {},
    rowError: {},
    generateSuccess: false,
    sites: [],
    loadingSites: false,
    sitesError: "",
  });

  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  // const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  // let site_id = "avaada_soyegaon";

  const [site_id, setSiteId] = useState("all");

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
      dispatch({ type: "FETCH_ROBOTS_REQUEST" });
      try {
        const result = await axios.get(
          `/api/v1/commisioning-docs/non-commisioned-robots/${site_id}`,
          {
            // headers: { Authorization: `Bearer ${authtoken}` },
            withCredentials: true,
          },
        );

        dispatch({
          type: "FETCH_ROBOTS_SUCCESS",

          payload: result.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_ROBOTS_FAIL",
          payload: error.response?.data?.message || error.response?.data?.error,
        });
        toast.error(
          error.response?.data?.message || error.response?.data?.error,
        );
      }
    };

    fetchRobots();
  }, [site_id]);

  // Filter robots based on search term
  const filteredRobots = robots.filter(
    (robot) =>
      robot.robot_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      robot.deveui.toLowerCase().includes(searchTerm.toLowerCase()) ||
      robot.lora_no
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  //lora_no, old_lora_no

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

  const genereateCommisitionDoc = async (id) => {
    try {
      dispatch({ type: "GENERATE_DOC_REQUEST", payload: id });

      const res = await axios.post(
        `/api/v1/commisioning-docs`,
        { _id: id },
        {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        },
      );

      dispatch({ type: "GENERATE_DOC_SUCCESS", payload: id });

      navigate(
        `/${adminroute}/commissioning/update-robot-commisioning-doc/${res.data.data._id}`,
      );
      toast.success("Doc created successfully");
    } catch (error) {
      dispatch({
        type: "GENERATE_DOC_FAIL",
        payload: {
          id,
          error:
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Failed",
        },
      });

      toast.error(error.response?.data?.message || error.response?.data?.error);
    }
  };
  const handleSiteNameChange = (e) => {
    const selectedSiteId = e.target.value;
    setSiteId(selectedSiteId); // Updates local state
  };
  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>All Non Commisioned Robots</h2>
      </div>
      <CRow className="justify-content-end">
        <CCol md={3} xs={12} className="m-1">
          <CFormSelect
            name="site_id"
            value={site_id}
            onChange={handleSiteNameChange}
          >
            <option value="all">All Data</option>
            {loadingSites ? (
              <LoadingSpinner />
            ) : sitesError ? (
              <CAlert>{sitesError}</CAlert>
            ) : (
              sites?.length > 0 &&
              sites.map((item) => (
                <option key={item.site_id} value={item.site_id}>
                  {item.site_id}
                </option>
              ))
            )}
          </CFormSelect>
        </CCol>
        <CCol md={4} lg={4} className="m-1">
          {/* Search Input */}
          <CFormInput
            type="text"
            placeholder="Search by Robot No, Deveui, or Lora No"
            className="mb-3 "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
      </CRow>
      {generateError && <CAlert color="danger">{generateError}</CAlert>}
      <CTable bordered hover responsive className="text-center">
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>Sr</CTableHeaderCell>
            <CTableHeaderCell>Robot No</CTableHeaderCell>
            <CTableHeaderCell>Site ID</CTableHeaderCell>
            <CTableHeaderCell>Block</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Commmisioned Date</CTableHeaderCell>
            <CTableHeaderCell>Online Status</CTableHeaderCell>
            <CTableHeaderCell>Last Uplink</CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loadingRobots ? (
            <CTableRow>
              <CTableDataCell colSpan={9}>
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : error ? (
            <CTableRow>
              <CTableDataCell colSpan={9}>{error}</CTableDataCell>
            </CTableRow>
          ) : filteredRobots.length > 0 ? (
            filteredRobots.map((robot, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{robot.robot_no}</CTableDataCell>
                <CTableDataCell>{robot.site_id}</CTableDataCell>
                <CTableDataCell>{robot.block}</CTableDataCell>
                <CTableDataCell>
                  {robot.commissioned ? (
                    <CBadge color="success">Commissioned</CBadge>
                  ) : (
                    <CBadge color="danger">Non Commisioned</CBadge>
                  )}
                </CTableDataCell>
                <CTableDataCell>
                  {robot.commissioned ? (
                    robot.commissioning_date
                  ) : (
                    <CBadge color="danger">Non Commisioned</CBadge>
                  )}
                </CTableDataCell>
                <CTableDataCell>
                  {robot.lora_state === 1 ? (
                    <CBadge color="success">Online</CBadge>
                  ) : (
                    <CBadge color="danger">Offline</CBadge>
                  )}
                </CTableDataCell>
                <CTableDataCell>
                  {robot.lora_state === 1 ? (
                    <CBadge color="success">{robot.last_uplink}</CBadge>
                  ) : (
                    <CBadge color="danger">Offline</CBadge>
                  )}
                </CTableDataCell>

                <CTableDataCell>
                  <button
                    className="btn btn-sm btn-primary"
                    disabled={rowLoading[robot._id]}
                    onClick={() => genereateCommisitionDoc(robot._id)}
                  >
                    {rowLoading[robot._id] ? "Generating..." : "Create"}
                  </button>

                  {rowError[robot._id] && (
                    <div className="text-danger mt-1">
                      {rowError[robot._id]}
                    </div>
                  )}
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan={9}>No Robots Found</CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default NonCommisionedRobots;
