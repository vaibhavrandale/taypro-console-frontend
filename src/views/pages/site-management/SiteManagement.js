import React, { useEffect, useReducer, useState } from "react";
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CInputGroup,
  CFormInput,
  CRow,
  CCol,
} from "@coreui/react";
// import { sites } from "../../../data"; // Import sites from data.js
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, sites: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
const SiteManagement = () => {
  const [{ loading, error, sites }, dispatch] = useReducer(reducer, {
    sites: [],
    loading: true,
    error: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const authtoken = useSelector((state) => state.authtoken);

  useEffect(() => {
    const fetchDownlink = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axios.get(`/api/v1/sites`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });

        dispatch({ type: "FETCH_SUCCESS", payload: data.data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data || "Failed to fetch data",
        });
        toast.error(error.response?.data || "Failed to fetch data");
      }
    };

    fetchDownlink();
  }, [authtoken]);

  // Filter table rows based on search term
  const filteredData = sites.filter(
    (site) =>
      site.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="">
      <h2 className="blinker-semibold">Site Management</h2>

      {/* Search Input */}
      <CRow className="justify-content-end">
        <CCol xs={12} sm={10} md={8} lg={5}>
          <CInputGroup className="mb-3">
            <CFormInput
              type="text"
              placeholder="Search Site..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CInputGroup>
        </CCol>
      </CRow>

      {/* Dynamic Data Table */}
      <CTable bordered hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Sr</CTableHeaderCell>
            <CTableHeaderCell>Site Name</CTableHeaderCell>
            <CTableHeaderCell>Location</CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loading ? (
            <CTableRow>
              <CTableHeaderCell colSpan="4" className="text-center">
                <LoadingSpinner />
              </CTableHeaderCell>
            </CTableRow>
          ) : error ? (
            <CTableRow>
              <CTableHeaderCell colSpan="4" className="text-center">
                {error}
              </CTableHeaderCell>
            </CTableRow>
          ) : filteredData.length > 0 ? (
            filteredData.map((site, index) => (
              <CTableRow key={site.id}>
                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                <CTableDataCell>{site.siteName}</CTableDataCell>
                <CTableDataCell>{site.location}</CTableDataCell>
                <CTableDataCell>
                  <Link
                    color="primary"
                    size="sm"
                    className="btn btn-primary btn-sm m-1"
                    to={`block-management/${site.site_id}`}
                  >
                    Manage
                  </Link>
                  {/* <Link
                    color="primary"
                    size="sm"
                    className="btn btn-warning btn-sm mx-1 px-3"
                  >
                    Edit
                  </Link> */}
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="4" className="text-center">
                No Site found
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default SiteManagement;
