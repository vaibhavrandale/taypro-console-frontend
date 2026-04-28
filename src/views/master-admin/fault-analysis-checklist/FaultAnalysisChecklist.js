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
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import PaginateInput from "../../../components/PaginateInput";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SERVICEITEM_REQUEST":
      return { ...state, loadingServiceItems: true, error: "" };
    case "FETCH_SERVICEITEM_SUCCESS":
      return {
        ...state,
        loadingServiceItems: false,
        serviceItems: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_SERVICEITEM_FAIL":
      return { ...state, loadingServiceItems: false, error: action.payload };
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

const FaultAnalysisChecklist = () => {
  const [
    {
      error,
      serviceItems,
      loadingServiceItems,
      totalPages,
      hasNextPage,
      hasPrevPage,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    serviceItems: [],
    loading: true,
    loadingServiceItems: true,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  // const authtoken = useSelector((state) => state.authtoken);

  const [searchTerm, setSearchTerm] = useState("");
  const [pageInput, setPageInput] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [existingChecklistItemIds, setExistingChecklistItemIds] = useState([]);

  useEffect(() => {
    let pagination = {
      pg: page,
      limit: limit,
    };
    const fetchServiceItems = async () => {
      dispatch({ type: "FETCH_SERVICEITEM_REQUEST" });
      try {
        const result = await axios.post(
          `/api/v1/service-items/get-service-items`,
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
          type: "FETCH_SERVICEITEM_SUCCESS",
          payload: {
            data: result.data.data,
            totalPages: total,
            hasNextPage: next,
            hasPrevPage: prev,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_SERVICEITEM_FAIL",
          payload: "Failed to fetch Service Items",
        });
        toast.error("Failed to fetch Service Items");
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchServiceItems();
    }
    const fetchChecklistComponentIds = async () => {
      try {
        const { data } = await axios.get(
          `/api/v1/faultanalysis/all-components`,
          {
            // headers: { Authorization: `Bearer ${authtoken}` },
            withCredentials: true,
          },
        );
        const ids = data.data.map((checklist) => checklist.component._id);
        console.log(ids);
        setExistingChecklistItemIds(ids);
      } catch (error) {
        toast.error("Failed to fetch checklist items");
      }
    };

    fetchChecklistComponentIds();
  }, [successDelete, , limit, page]);

  // Filter robots based on search term
  const filteredInventories = serviceItems.filter(
    (serviceItem) =>
      serviceItem.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serviceItem.item_code.toLowerCase().includes(searchTerm.toLowerCase()),
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
  } else if (userInfo?.role === "Project User") {
    adminroute = "project-user";
  } else if (userInfo?.role === "Site Technician") {
    adminroute = "site-technician";
  }

  return (
    <div className="p-2">
      <h2 className="text-center mt-4">Fault Analysis Checklist</h2>

      {/* Search Input */}
      <CRow className="justify-content-end mb-3">
        <CCol md={4}>
          <CFormInput
            type="text"
            placeholder="Search by Item Name, Item Code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
      </CRow>

      {/* ServiceItems Table */}
      <CTable
        bordered
        hover
        responsive
        className="text-center shadow-sm bg-important"
      >
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "200px" }}>
              Item Name
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "100px" }}>
              Item Code
            </CTableHeaderCell>

            <CTableHeaderCell style={{ minWidth: "140px" }}>
              Description
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "140px" }}>
              Action
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loadingServiceItems ? (
            <CTableRow>
              <CTableDataCell colSpan="9" className="text-center fw-bold">
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
          ) : filteredInventories.length > 0 ? (
            filteredInventories.map((serviceItem, index) => (
              <CTableRow
                key={index}
                className={serviceItem.is_delete ? "table-danger" : ""}
              >
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{serviceItem.item_name}</CTableDataCell>
                <CTableDataCell>{serviceItem.item_code}</CTableDataCell>

                <CTableDataCell>{serviceItem.item_description}</CTableDataCell>
                <CTableDataCell>
                  {!existingChecklistItemIds.includes(
                    String(serviceItem._id),
                  ) && (
                    <Link
                      className="btn btn-sm btn-secondary m-1"
                      color="secondary"
                      size="sm"
                      to={`/${adminroute}/fault-analysis-checklist/add-checklist/${serviceItem._id}`}
                    >
                      Add Checklist
                    </Link>
                  )}

                  {existingChecklistItemIds.includes(
                    String(serviceItem._id),
                  ) && (
                    <Link
                      className="btn btn-sm btn-warning m-1"
                      to={`/${adminroute}/fault-analysis-checklist/update-checklist/${serviceItem._id}`}
                    >
                      Update
                    </Link>
                  )}
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="7" className="text-center fw-bold">
                No Matching Service Items Found.
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

export default FaultAnalysisChecklist;
