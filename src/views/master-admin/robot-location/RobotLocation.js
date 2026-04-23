// import React from "react";

// const RobotLocation = () => {
//   return <div>RobotLocation</div>;
// };

// export default RobotLocation;

import {
  CAlert,
  CBadge,
  CCol,
  CFormSelect,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { Link } from "react-router-dom";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_ROBOTS_REQUEST":
      return { ...state, fetchrobotsLoading: true, robotsError: "" };
    case "FETCH_ROBOTS_SUCCESS":
      return {
        ...state,
        fetchrobotsLoading: false,
        data: action.payload.data,
      };
    case "FETCH_ROBOTS_FAIL":
      return {
        ...state,
        fetchrobotsLoading: false,
        robotsError: action.payload,
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

    case "UPDATE_REQUEST":
      return { ...state, updateRobotLoding: true, updateRobotError: "" };
    case "UPDATE_SUCCESS":
      return {
        ...state,
        updateRobotLoding: false,
      };
    case "UPDATE_FAIL":
      return {
        ...state,
        updateRobotLoding: false,
        updateRobotError: action.payload,
      };

    default:
      return state;
  }
};
const RobotLocation = () => {
  const [
    { data, fetchrobotsLoading, robotsError, sites, loadingSites, sitesError },
    dispatch,
  ] = useReducer(reducer, {
    data: [],
    fetchrobotsLoading: false,
    robotsError: "",
    loadingSites: false,
    sites: [],
    sitesError: "",
  });
  const [site_id, setSiteId] = useState("");
  const authtoken = useSelector((state) => state.authtoken);

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
        setSiteId(result.data.data[0]?.site_id || "");
      } catch (error) {
        dispatch({
          type: "FETCH_SITES_FAIL",
          payload: error.response.data.error,
        });
        toast.error("Failed to fetch sites");
      }
    };
    fetchSites();
    if (!site_id) return;
    const fetchRobots = async () => {
      dispatch({ type: "FETCH_ROBOTS_REQUEST" });
      try {
        const result = await axios.get(
          `/api/v1/robot-locations/${site_id}`,

          {
            headers: { Authorization: `Bearer ${authtoken}` },
          },
        );

        dispatch({
          type: "FETCH_ROBOTS_SUCCESS",
          payload: result.data,
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

  return (
    <div>
      {" "}
      <CRow>
        <CCol md={4}>
          {loadingSites ? (
            <LoadingSpinner />
          ) : sitesError ? (
            <CAlert color="danger">{sitesError}</CAlert>
          ) : (
            <CFormSelect
              id="siteSelect"
              label="Select Site"
              value={site_id}
              onChange={(e) => {
                setSiteId(e.target.value);
              }}
            >
              <option value="">Select a site</option>
              {sites?.map((site, index) => (
                <option key={index} value={site.site_id}>
                  {site.site_id}
                </option>
              ))}
            </CFormSelect>
          )}
        </CCol>
      </CRow>
      <CTable bordered hover responsive className="text-center shadow-sm mt-3">
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Robot No</CTableHeaderCell>
            <CTableHeaderCell>Block No</CTableHeaderCell>
            <CTableHeaderCell>Lora No</CTableHeaderCell>
            <CTableHeaderCell>Deveui</CTableHeaderCell>
            <CTableHeaderCell>View Image</CTableHeaderCell>
            <CTableHeaderCell>Location</CTableHeaderCell>

            <CTableHeaderCell>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {fetchrobotsLoading ? (
            <CTableRow>
              <CTableDataCell colSpan="9" className="text-center fw-bold">
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : robotsError ? (
            <CTableRow>
              <CTableDataCell
                colSpan="9"
                className="text-center text-danger fw-bold"
              >
                {robotsError}
              </CTableDataCell>
            </CTableRow>
          ) : data.length > 0 ? (
            data.map((item, index) => (
              <CTableRow key={item.robot._id}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{item.robot.robot_no}</CTableDataCell>
                <CTableDataCell>{item.robot.block}</CTableDataCell>
                <CTableDataCell>{item.robot.lora_no}</CTableDataCell>
                <CTableDataCell>{item.robot.deveui}</CTableDataCell>
                <CTableDataCell>
                  {item.location?.image ? (
                    <a
                      href={item.location.image}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <CBadge color="info">View Image</CBadge>
                    </a>
                  ) : (
                    <CBadge color="secondary">Pending</CBadge>
                  )}
                </CTableDataCell>
                <CTableDataCell>
                  {item.location ? (
                    <Link
                      href={`https://www.google.com/maps?q=${item.location.latitude},${item.location.longitude}`}
                      target="_blank"
                    >
                      View Location
                    </Link>
                  ) : (
                    <CBadge color="secondary">Pending</CBadge>
                  )}
                </CTableDataCell>
                <CTableDataCell>
                  {item.location ? (
                    <CBadge color="success">Created</CBadge>
                  ) : (
                    <Link
                      to={`/site-technician/robot-location/${item.robot.robot_no}/${item.robot.site_id}`}
                    >
                      <CBadge color="primary">Create</CBadge>
                    </Link>
                  )}
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="9" className="text-center">
                No robots found.
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default RobotLocation;
