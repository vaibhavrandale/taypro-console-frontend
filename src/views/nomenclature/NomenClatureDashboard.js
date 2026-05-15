// import React from "react";

// const NomenClatureDashboard = () => {
//   return <div>NomenClatureDashboard</div>;
// };

// export default NomenClatureDashboard;

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
} from "@coreui/react";

import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../components/LoadingSpinner";
import PaginateInput from "../../components/PaginateInput";
import { Link } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SITES_REQUEST":
      return { ...state, loadingSites: true, error: "" };
    case "FETCH_SITES_SUCCESS":
      return { ...state, loadingSites: false, sites: action.payload };
    case "FETCH_SITES_FAIL":
      return { ...state, loadingSites: false, error: action.payload };

    case "FETCH_NOMENCLATURES_REQUEST":
      return { ...state, loadingNomenclatures: true, error: "" };
    case "FETCH_NOMENCLATURES_SUCCESS":
      return {
        ...state,
        loadingNomenclatures: false,
        nomenclatures: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_NOMENCLATURES_FAIL":
      return { ...state, loadingNomenclatures: false, error: action.payload };
    default:
      return state;
  }
};
const NomenClatureDashboard = () => {
  const [
    {
      error,
      nomenclatures,
      loadingNomenclatures,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
    dispatch,
  ] = useReducer(reducer, {
    sites: [],
    nomenclatures: [],
    loading: true,
    loadingNomenclatures: true,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  // const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);

  const [searchTerm, setSearchTerm] = useState("");

  const [pageInput, setPageInput] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    let pagination = {
      pg: page,
      limit: limit,
    };
    const fetchNomenclatures = async () => {
      dispatch({ type: "FETCH_NOMENCLATURES_REQUEST" });
      try {
        const result = await axios.post(
          `/api/v1/nomenclatures/all`,
          pagination,
          {
            // headers: { Authorization: `Bearer ${authtoken}` },
            withCredentials: true,
          },
        );

        let total = Math.ceil(
          Number(result.data.total) / Number(result.data.limit),
        );
        let next = result.data.hasNextPage;
        let prev = result.data.hasPrevPage;

        dispatch({
          type: "FETCH_NOMENCLATURES_SUCCESS",
          payload: {
            data: result.data.data,
            totalPages: total,
            hasNextPage: next,
            hasPrevPage: prev,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_NOMENCLATURES_FAIL",
          payload: error.response?.data?.message || error.response?.data?.error,
        });
        toast.error(
          error.response?.data?.message || error.response?.data?.error,
        );
      }
    };

    fetchNomenclatures();
  }, [limit, page]);

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
  } else if (userInfo?.role === "Master User") {
    adminroute = "master-user";
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
  } else if (userInfo?.role === "Project User") {
    adminroute = "project-user";
  } else if (userInfo?.role === "Service User") {
    adminroute = "service-user";
  }

  return (
    <div className="p-2">
      <h2 className="text-center">All Nomenclatures</h2>

      {/* Search Input */}
      <CRow className="justify-content-end mb-3">
        <CCol md={4}>
          <CFormInput
            type="text"
            placeholder="Search: Robot No, Version, Lora No, Deveui, Site ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
      </CRow>

      {/* Robots Table */}
      <CTable bordered hover responsive className="text-center shadow-sm">
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>

            <CTableHeaderCell style={{ minWidth: "340px" }}>
              site_id
            </CTableHeaderCell>

            <CTableHeaderCell style={{ minWidth: "340px" }}>
              MMS Type Name
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "340px" }}>
              Status
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loadingNomenclatures ? (
            <CTableRow>
              <CTableDataCell colSpan="10" className="text-center ">
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : error ? (
            <CTableRow>
              {" "}
              <CTableDataCell colSpan="9" className="text-center fw-bold">
                {error}
              </CTableDataCell>
            </CTableRow>
          ) : nomenclatures.length > 0 ? (
            nomenclatures.map((nomenclature, index) => (
              <CTableRow key={nomenclature._id}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>
                  <Link
                    to={`/${adminroute}/view-nomenclature/${nomenclature._id}`}
                  >
                    {nomenclature.site.site_name}
                  </Link>
                </CTableDataCell>
                <CTableDataCell>
                  {nomenclature.mms_type},{nomenclature.mms_type_name}
                </CTableDataCell>
                <CTableDataCell>{nomenclature.status}</CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="7" className="text-center fw-bold">
                No matching robots found.
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

export default NomenClatureDashboard;
