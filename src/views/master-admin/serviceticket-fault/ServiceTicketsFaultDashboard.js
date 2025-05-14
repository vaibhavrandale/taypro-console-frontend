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
    case "FETCH_SERVICE_TICKET_FAULT_REQUEST":
      return { ...state, loadingTickets: true, error: "" };
    case "FETCH_SERVICE_TICKET_FAULT_SUCCESS":
      return {
        ...state,
        loadingTickets: false,
        servicetickets_fault: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_SERVICE_TICKET_FAULT_FAIL":
      return { ...state, loadingTickets: false, error: action.payload };

    default:
      return state;
  }
};

const ServiceTicketsFaultDashboard = () => {
  const [
    {
      servicetickets_fault,
      loadingTickets,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
    dispatch,
  ] = useReducer(reducer, {
    servicetickets_fault: [],
    loadingTickets: true,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const authtoken = useSelector((state) => state.authtoken);
  const [pageInput, setPageInput] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  useEffect(() => {
    let pagination = {
      pg: page,
      limit: limit,
    };

    const fetchServiceTicketsFaults = async () => {
      dispatch({ type: "FETCH_SERVICE_TICKET_FAULT_REQUEST" });

      try {
        const result = await axios.post(
          `/api/v1/serviceticketsfaults/get-serviceticketsfaults`,
          pagination, // should be an object like { pg: 1, limit: 10 }
          { headers: { Authorization: `Bearer ${authtoken}` } }
        );

        // Calculate pagination details
        let total = Math.ceil(
          Number(result.data.total) / Number(result.data.limit)
        );
        let next = result.data.hasNextPage;
        let prev = result.data.hasPrevPage;

        // Dispatch success with result
        dispatch({
          type: "FETCH_SERVICE_TICKET_FAULT_SUCCESS",
          payload: {
            data: result.data.data,
            totalPages: total,
            hasNextPage: next,
            hasPrevPage: prev,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_SERVICE_TICKET_FAULT_FAIL",
          payload: error?.response?.data?.error,
        });
        toast.error(error?.response?.data?.error);
      }
    };
    // Reset the delete state if successDelete flag is true
    fetchServiceTicketsFaults();
  }, [authtoken, limit, page]);

  const userInfo = useSelector((state) => state.userInfo);
  let adminroute = "";

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    adminroute = "project-admin";
  }

  /** 🔍 Search Function */
  //   const filteredFaults = servicetickets_fault.filter(
  //     (ticket) =>
  //       ticket.ticket_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       ticket.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       ticket.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       ticket.created_by.name.toLowerCase().includes(searchTerm.toLowerCase())
  //   );

  const filteredFaults = servicetickets_fault.filter((fault) =>
    fault.fault_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-center mb-4">Service Tickets Faults</h2>
      <div className="d-flex justify-content-end my-2 align-items-center">
        <Link
          to={`/${adminroute}/serviceticket-fault/service-tickets-fault-dashboard/create-serviceticket-fault`}
          className="btn btn-sm btn-primary"
        >
          NEW
        </Link>
      </div>
      {/* 🔍 Search */}
      <CRow className="justify-content-end mb-3">
        <CCol md={4}>
          <CFormInput
            type="text"
            placeholder="Search by fault name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
      </CRow>

      {/* 📋 Faults Table */}
      <CTable bordered hover responsive className="text-center">
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Fault Name</CTableHeaderCell>
            <CTableHeaderCell>Added By</CTableHeaderCell>
            <CTableHeaderCell>Added At</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loadingTickets ? (
            <CTableRow>
              <CTableDataCell colSpan="5" className="text-center">
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : filteredFaults.length > 0 ? (
            filteredFaults.map((fault, index) => (
              <CTableRow key={fault._id}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{fault.fault_name}</CTableDataCell>

                <CTableDataCell>{fault.last_activity[0].name}</CTableDataCell>
                <CTableDataCell>
                  {new Date(fault.last_activity[0].timestamp).toLocaleString()}
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan={5} className="text-danger">
                No faults found.
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>

      {/* Pagination if needed */}
      <PaginateInput
        page={page}
        totalPages={totalPages}
        hasPrevPage={hasPrevPage}
        hasNextPage={hasNextPage}
        pageInput={pageInput}
        limit={limit}
        handleLimitChange={setLimit}
      />
    </div>
  );
};
export default ServiceTicketsFaultDashboard;
