import React, { useEffect, useReducer, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  CAvatar,
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CSpinner,
  CAlert,
  CButton,
  CInputGroup,
  CFormInput,
  CTooltip,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import toast from "react-hot-toast";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_TECHNICIAN_REQUEST":
      return { ...state, loadingtechnicians: true, technicianserror: "" };
    case "FETCH_TECHNICIAN_SUCCESS":
      return {
        ...state,
        loadingtechnicians: false,
        technicians: action.payload,
      };
    case "FETCH_TECHNICIAN_FAIL":
      return {
        ...state,
        loadingtechnicians: false,
        technicianserror: action.payload,
      };
    default:
      return state;
  }
};

const UserPerformanceDashboard = () => {
  const [{ loadingtechnicians, technicians, technicianserror }, dispatch] =
    useReducer(reducer, {
      loadingtechnicians: true,
      technicians: [],
      technicianserror: "",
    });

  const [searchTerm, setSearchTerm] = useState("");
  const userInfo = useSelector((state) => state.userInfo);
  const authtoken = useSelector((state) => state.authtoken);

  let adminroute = "";
  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    adminroute = "project-admin";
  }

  useEffect(() => {
    const fetchAllSiteTechnicians = async () => {
      dispatch({ type: "FETCH_TECHNICIAN_REQUEST" });
      try {
        const response = await axios.get(
          "/api/v1/users/get-all-site-technicians",
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );

        // Ensure payload is the array, not an object
        dispatch({
          type: "FETCH_TECHNICIAN_SUCCESS",
          payload: response.data.data || [], // updated here
        });

        console.log("Technicians fetched successfully:", response.data.data);
      } catch (error) {
        dispatch({
          type: "FETCH_TECHNICIAN_FAIL",
          payload:
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Failed to fetch technicians",
        });
        toast.error(
          error.response?.data?.message ||
            error.response?.data?.error ||
            "Failed to fetch technicians"
        );
      }
    };

    fetchAllSiteTechnicians();
  }, [authtoken]);

  const filteredTechnicians = Array.isArray(technicians)
    ? technicians.filter(
        (technician) =>
          technician.username
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          technician.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          technician.designation
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="p-2">
      <h2 className="text-center mt-4 mb-4">All Site Technicians</h2>

      <div className="d-flex justify-content-end mb-3">
        <CCol md={4}>
          <CFormInput
            type="text"
            placeholder="Search by Technician Name, Email..."
            className="mb-3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
      </div>

      {/* Site Technicians Table */}
      <CTable bordered hover responsive className="text-center shadow-sm">
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "200px" }}>
              Name
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "100px" }}>
              Email
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "140px" }}>
              Designation
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "200px" }}>
              Assigned Sites
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "100px" }}>
              Action
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loadingtechnicians ? (
            <CTableRow>
              <CTableDataCell colSpan="6" className="text-center fw-bold">
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : technicianserror ? (
            <CTableRow>
              <CTableDataCell colSpan="6" className="text-center fw-bold">
                {technicianserror}
              </CTableDataCell>
            </CTableRow>
          ) : filteredTechnicians.length > 0 ? (
            filteredTechnicians.map((technician, index) => (
              <CTableRow
                key={index}
                className={technician.is_delete ? "table-danger" : ""}
              >
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{technician.username}</CTableDataCell>
                <CTableDataCell>{technician.email}</CTableDataCell>
                <CTableDataCell>{technician.designation}</CTableDataCell>
                <CTableDataCell>
                  {Array.isArray(technician.assigned_sites) &&
                  technician.assigned_sites.length > 0
                    ? technician.assigned_sites
                        .map((site) => site.siteName)
                        .join(", ")
                    : "No sites assigned"}
                </CTableDataCell>

                <CTableDataCell>
                  <Link
                    to={`/${adminroute}/user-performance-dashboard/user-performance/${technician._id}`}
                  >
                    <CButton size="sm" color="info">
                      View
                    </CButton>
                  </Link>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="6" className="text-center fw-bold">
                No technicians found.
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default UserPerformanceDashboard;
