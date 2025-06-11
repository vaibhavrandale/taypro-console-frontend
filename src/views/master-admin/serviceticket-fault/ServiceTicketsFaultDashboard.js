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
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import PaginateInput from "../../../components/PaginateInput";
import { cilX } from "@coreui/icons";
import CIcon from "@coreui/icons-react";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SERVICE_TICKET_FAULT_REQUEST":
      return { ...state, loadingTickets: true, error: "" };
    case "FETCH_SERVICE_TICKET_FAULT_SUCCESS":
      return {
        ...state,
        loadingTickets: false,
        servicetickets_fault: action.payload.data,
        totalPages: action.payload.totalPages,
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
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewFault, setViewFault] = useState(null);

  const userInfo = useSelector((state) => state.userInfo);

  let adminroute = "";
  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    adminroute = "project-admin";
  }

  useEffect(() => {
    const fetchServiceTicketsFaults = async () => {
      dispatch({ type: "FETCH_SERVICE_TICKET_FAULT_REQUEST" });
      try {
        const result = await axios.post(
          `/api/v1/serviceticketsfaults/get-serviceticketsfaults`,
          { pg: page, limit: limit },
          { headers: { Authorization: `Bearer ${authtoken}` } }
        );

        dispatch({
          type: "FETCH_SERVICE_TICKET_FAULT_SUCCESS",
          payload: {
            data: result.data.data,
            totalPages: Math.ceil(result.data.total / result.data.limit),
            hasNextPage: result.data.hasNextPage,
            hasPrevPage: result.data.hasPrevPage,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_SERVICE_TICKET_FAULT_FAIL",
          payload: error?.response?.data?.error,
        });
        toast.error(error?.response?.data?.error || "Failed to fetch faults");
      }
    };

    fetchServiceTicketsFaults();
  }, [authtoken, limit, page]);

  const filteredFaults = servicetickets_fault.filter((fault) =>
    fault.fault_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openViewModal = async (id) => {
    setViewModalVisible(true);
    try {
      const res = await axios.get(`/api/v1/serviceticketsfaults/${id}`, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });
      setViewFault(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch fault details");
      setViewModalVisible(false);
    }
  };

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

      <CTable bordered hover responsive className="text-center">
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Fault Name</CTableHeaderCell>
            <CTableHeaderCell>Target Days</CTableHeaderCell>
            <CTableHeaderCell>Added By</CTableHeaderCell>
            <CTableHeaderCell>Added At</CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>

        <CTableBody>
          {loadingTickets ? (
            <CTableRow>
              <CTableDataCell colSpan="6" className="text-center">
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : filteredFaults.length > 0 ? (
            filteredFaults.map((fault, index) => (
              <CTableRow key={fault._id}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{fault.fault_name}</CTableDataCell>
                <CTableDataCell>{fault.target_days ?? "N/A"}</CTableDataCell>
                <CTableDataCell>
                  {fault.last_activity?.[0]?.name ?? "N/A"}
                </CTableDataCell>
                <CTableDataCell>
                  {fault.last_activity?.[0]?.timestamp
                    ? new Date(
                        fault.last_activity[0].timestamp
                      ).toLocaleString()
                    : "N/A"}
                </CTableDataCell>
                <CTableDataCell style={{ minWidth: "210px" }}>
                  <CButton
                    color="secondary"
                    size="sm"
                    className="m-1"
                    onClick={() => openViewModal(fault._id)}
                  >
                    View
                  </CButton>

                  <Link
                    className="m-1 btn btn-sm btn-primary text-decoration-none"
                    to={`update-serviceticket-fault/${fault._id}`}
                  >
                    Update
                  </Link>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan={6} className="text-danger">
                No faults found.
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
        limit={limit}
        handleLimitChange={setLimit}
        setPage={setPage}
        setPageInput={setPageInput}
      />

      {/* View Modal */}
      <CModal
        scrollable
        size="xl"
        backdrop="static"
        visible={viewModalVisible}
        onClose={() => setViewModalVisible(false)}
      >
        {!viewFault ? (
          <CModalBody className="d-flex justify-content-center align-items-center">
            <LoadingSpinner />
          </CModalBody>
        ) : (
          <>
            <CModalHeader closeButton={false}>
              <CModalTitle>
                Fault Details&nbsp;:&nbsp;
                <span className="badge bg-dark">
                  {viewFault.fault_name || "N/A"}
                </span>
              </CModalTitle>
              <button
                type="button"
                className="border-0 ms-auto py-0 px-1"
                onClick={() => setViewModalVisible(false)}
                style={{ background: "none" }}
              >
                <CIcon icon={cilX} size="lg" />
              </button>
            </CModalHeader>

            <CModalBody>
              <CTable bordered striped hover responsive>
                <CTableBody>
                  <CTableRow>
                    <CTableHeaderCell>Fault Name</CTableHeaderCell>
                    <CTableDataCell>{viewFault.fault_name}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Target Days</CTableHeaderCell>
                    <CTableDataCell>
                      {viewFault.target_days ?? "N/A"}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Added By</CTableHeaderCell>
                    <CTableDataCell>
                      {viewFault.last_activity?.[0]?.name ?? "N/A"}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Added At</CTableHeaderCell>
                    <CTableDataCell>
                      {viewFault.last_activity?.[0]?.timestamp
                        ? new Date(
                            viewFault.last_activity[0].timestamp
                          ).toLocaleString()
                        : "N/A"}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Fault ID</CTableHeaderCell>
                    <CTableDataCell>{viewFault._id}</CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CModalBody>

            <CModalFooter>
              <CButton
                color="secondary"
                onClick={() => setViewModalVisible(false)}
              >
                Close
              </CButton>
            </CModalFooter>
          </>
        )}
      </CModal>
    </div>
  );
};

export default ServiceTicketsFaultDashboard;
