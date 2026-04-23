import {
  CAlert,
  CBadge,
  CButton,
  CCol,
  CFormInput,
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
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };

    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };

    case "DELETE_FAIL":
      return { ...state, loadingDelete: false, successDelete: false };

    case "DELETE_RESET":
      return { ...state, successDelete: false };

    default:
      return state;
  }
};
const RobotLocation = () => {
  const [
    {
      data,
      fetchrobotsLoading,
      robotsError,
      sites,
      loadingSites,
      sitesError,
      // loadingDelete,
      // successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    data: [],
    fetchrobotsLoading: false,
    robotsError: "",
    loadingSites: false,
    sites: [],
    sitesError: "",
    // loadingDelete: false,
    // successDelete: false,
  });
  const [site_id, setSiteId] = useState("");
  const authtoken = useSelector((state) => state.authtoken);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchSites = async () => {
      dispatch({ type: "FETCH_SITES_REQUEST" });
      try {
        const result = await axios.get(`/api/v1/sites`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        const siteData = result.data.data || [];
        dispatch({ type: "FETCH_SITES_SUCCESS", payload: siteData });
        if (siteData.length > 0) {
          setSiteId(siteData[0].site_id);
        }
      } catch (error) {
        dispatch({
          type: "FETCH_SITES_FAIL",
          payload: error.response.data.error,
        });
        toast.error("Failed to fetch sites");
      }
    };
    fetchSites();
  }, [authtoken]);

  useEffect(() => {
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

  // Filter robots based on search term
  const filteredRobots = data.filter((item) =>
    ["robot_no", "deveui", "site_id", "version", "lora_no"].some((field) =>
      (item?.robot?.[field] ?? "")
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    ),
  );
  const handleDelete = async (location) => {
    if (!location?._id) {
      toast.error("Invalid location data");
      return;
    }
    setDeletingId(location._id);
    const confirm = window.confirm(
      "Are you sure you want to delete this robot location?",
    );
    if (!confirm) return;

    try {
      dispatch({ type: "DELETE_REQUEST" });

      await axios.delete(`/api/v1/robot-locations/${location._id}`, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });

      toast.success("Robot location deleted successfully");

      // ✅ Instant UI update (NO reload)
      const updatedData = data.map((item) =>
        item.location?._id === location._id
          ? { ...item, location: null }
          : item,
      );

      dispatch({
        type: "FETCH_ROBOTS_SUCCESS",
        payload: { data: updatedData },
      });

      dispatch({ type: "DELETE_SUCCESS" });
      setDeletingId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      dispatch({ type: "DELETE_FAIL" });
      setDeletingId(null);
    }
  };
  const userInfo = useSelector((state) => state.userInfo);

  let adminroute = "";

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    adminroute = "project-admin";
  } else if (userInfo?.role === "Master User") {
    adminroute = "master-user";
  } else if (userInfo?.role === "Service User") {
    adminroute = "service-user";
  } else if (userInfo?.role === "Site Technician") {
    adminroute = "site-technician";
  }

  return (
    <div>
      {" "}
      <CRow className="mb-3 align-items-end">
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

        <CCol md={4} className="ms-auto">
          <CFormInput
            type="text"
            placeholder="Search: Robot No, Version, Lora No, Deveui, Site ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
          ) : filteredRobots.length > 0 ? (
            filteredRobots.map((item, index) => (
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
                      to={`https://www.google.com/maps?q=${item.location.latitude},${item.location.longitude}`}
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
                    <>
                      <CBadge color="success">Created</CBadge>

                      <CButton
                        color="danger"
                        size="sm"
                        className="ms-2"
                        onClick={() => handleDelete(item.location)}
                      >
                        {deletingId === item.location._id ? (
                          <>
                            Deleting...
                            <LoadingSpinner />
                          </>
                        ) : (
                          "Delete"
                        )}
                      </CButton>
                    </>
                  ) : (
                    <Link
                      to={`/${adminroute}/robot-location/${item.robot.robot_no}/${item.robot.site_id}`}
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
