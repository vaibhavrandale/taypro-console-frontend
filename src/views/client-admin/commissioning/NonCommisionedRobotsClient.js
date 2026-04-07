// import React from "react";

// const NonCommisionedRobotsClient = () => {
//   return <div>NonCommisionedRobotsClient</div>;
// };

// export default NonCommisionedRobotsClient;

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
} from "@coreui/react";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../components/LoadingSpinner";

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
    default:
      return state;
  }
};

const NonCommisionedRobotsClient = () => {
  const [
    { robots, error, loadingRobots, generateError, rowLoading, rowError },
    dispatch,
  ] = useReducer(reducer, {
    robots: [],
    loadingaddRobots: false,
    updateloading: false,
    error: "",

    rowLoading: {},
    rowError: {},
    generateSuccess: false,
  });

  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  let site_id = "avaada_soyegaon";
  useEffect(() => {
    const fetchRobots = async () => {
      dispatch({ type: "FETCH_ROBOTS_REQUEST" });
      try {
        const result = await axios.get(
          `/api/v1/commisioning-docs/non-commisioned-robots/${site_id}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
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
  }, [authtoken, site_id]);

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
          headers: { Authorization: `Bearer ${authtoken}` },
        },
      );

      dispatch({ type: "GENERATE_DOC_SUCCESS", payload: id });

      navigate(
        `/${adminroute}/commissioning/view-robot-commisioning-doc/${res.data.data._id}`,
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

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>All Non Commisioned Robots</h2>
      </div>
      <CRow className="justify-content-end">
        <CCol md={4} lg={4}>
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
            error
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

export default NonCommisionedRobotsClient;
