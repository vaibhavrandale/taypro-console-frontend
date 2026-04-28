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
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner";
import PaginateInput from "../../../components/PaginateInput";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        sites: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
const Sites = () => {
  const [
    { loading, error, sites, totalPages, hasNextPage, hasPrevPage },
    dispatch,
  ] = useReducer(reducer, {
    sites: [],
    loading: true,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [searchTerm, setSearchTerm] = useState("");

  // const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  const [pageInput, setPageInput] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    let pagination = {
      pg: page,
      limit: limit,
    };
    const fetchDownlink = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const result = await axios.post(`/api/v1/sites/get-sites`, pagination, {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        });
        let total = Math.ceil(
          Number(result.data.total) / Number(result.data.limit),
        );
        let next = result.data.hasNextPage;
        let prev = result.data.hasPrevPage;
        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            data: result.data.data,
            totalPages: total,
            hasNextPage: next,
            hasPrevPage: prev,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data || "Failed to fetch data",
        });
        toast.error(error.response?.data || "Failed to fetch data");
      }
    };

    fetchDownlink();
  }, [limit, page]);

  // Filter table rows based on search term
  const filteredData = sites.filter(
    (site) =>
      site.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.location.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handlePageInputSubmit = () => {
    const pageNumber = parseInt(pageInput);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      handlePageChange(pageNumber);
    }
  };

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
  }
  const date = new Date().toISOString().split("T")[0];

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
      <CTable bordered hover responsive className="bg-important">
        <CTableHead color="secondary">
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
              <CTableRow key={site._id}>
                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                <CTableDataCell>{site.siteName}</CTableDataCell>
                <CTableDataCell>{site.location}</CTableDataCell>
                <CTableDataCell>
                  <Link
                    color="success"
                    size="sm"
                    className="btn btn-success btn-sm m-1"
                    to={`/${adminroute}/cleaning-log-sites/daywise-cleaning/${site.site_id}/${date}`}
                  >
                    Manage
                  </Link>
                  <Link
                    color="success"
                    size="sm"
                    className="btn btn-success btn-sm m-1"
                    to={`/${adminroute}/cleaning-log-sites/cleaning-report/${site.site_id}`}
                  >
                    Report
                  </Link>
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

      <PaginateInput
        page={page}
        totalPages={totalPages}
        hasPrevPage={hasPrevPage}
        hasNextPage={hasNextPage}
        pageInput={pageInput}
        handlePageChange={handlePageChange}
        handlePageInputChange={handlePageInputChange}
        handlePageInputSubmit={handlePageInputSubmit}
        limit={limit}
        handleLimitChange={setLimit} // New prop
      />
    </div>
  );
};

export default Sites;
