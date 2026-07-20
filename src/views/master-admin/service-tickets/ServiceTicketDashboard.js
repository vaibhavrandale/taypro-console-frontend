import React, { useEffect, useReducer, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CFormInput,
  CFormSelect,
  CFormLabel,
  CRow,
  CCol,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
} from "@coreui/react";
import * as XLSX from "xlsx";
import LoadingSpinner from "../../../components/LoadingSpinner";
import PieChart from "./PieChart";
import "./servicetickts.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import PaginateInput from "../../../components/PaginateInput";
import BarGraph from "./BarGraph";
import toast from "react-hot-toast";
import moment from "moment";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        servicetickets: action.payload.data,
        totalPages: action.payload.totalPages,
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

const fmtSite = (id = "") =>
  id.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const ServiceTicketDashboard = () => {
  const [
    { loading, error, servicetickets, totalPages, hasNextPage, hasPrevPage },
    dispatch,
  ] = useReducer(reducer, {
    servicetickets: [],
    loading: true,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const userInfo = useSelector((state) => state.userInfo);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [pageInput, setPageInput] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [exportModal, setExportModal] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [faultOptions, setFaultOptions] = useState([]);
  const [siteOptions, setSiteOptions] = useState([]);
  const [exportFilters, setExportFilters] = useState({
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date().toISOString().split("T")[0],
    fault_type: "all",
    site_id: "all",
    status: "all",
  });

  useEffect(() => {
    const fetchServicetickets = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const response = await axios.post(
          `/api/v1/servicetickets/get-servicetickets`,
          { pg: page, limit },
          { withCredentials: true },
        );

        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            data: response.data.data,
            totalPages: Math.ceil(
              Number(response.data.total) / Number(response.data.limit),
            ),
            hasNextPage: response.data.hasNextPage,
            hasPrevPage: response.data.hasPrevPage,
          },
        });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err });
      }
    };

    fetchServicetickets();
  }, [limit, page]);

  const openExportModal = async () => {
    setExportFilters({
      start_date: startDate,
      end_date: endDate,
      fault_type: "all",
      site_id: "all",
      status: "all",
    });
    setExportModal(true);

    try {
      const [faultRes, siteRes] = await Promise.all([
        axios.get("/api/v1/servicetickets/faultcount", {
          withCredentials: true,
        }),
        axios.get("/api/v1/servicetickets/siteresolve", {
          withCredentials: true,
        }),
      ]);

      setFaultOptions(
        (faultRes.data.data || [])
          .map((f) => f.fault_type)
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b)),
      );
      setSiteOptions(
        (siteRes.data.data || [])
          .map((s) => s.site_id)
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b)),
      );
    } catch {
      // dropdowns stay empty; user can still export All
    }
  };

  const filteredData = servicetickets
    ? servicetickets.filter((item) => {
        const createdAtDate = new Date(item.createdAt)
          .toISOString()
          .split("T")[0];
        const q = searchTerm.toLowerCase();

        return (
          (item.ticket_id.toLowerCase().includes(q) ||
            item.fault_type.toLowerCase().includes(q) ||
            item.robot_no.toLowerCase().includes(q) ||
            item.deveui.toLowerCase().includes(q) ||
            item.site_id.toLowerCase().includes(q) ||
            (q === "open" && !item.ticket_resolved) ||
            (q === "resolved" && item.ticket_resolved)) &&
          createdAtDate >= startDate &&
          createdAtDate <= endDate
        );
      })
    : [];

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  const handlePageInputSubmit = () => {
    const pageNumber = parseInt(pageInput, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      handlePageChange(pageNumber);
    }
  };

  const TImetoResolvedTicket = (createdAt, resolvedAt) => {
    const duration = moment.duration(
      moment(resolvedAt).diff(moment(createdAt)),
    );
    return `${Math.floor(duration.asDays())}d ${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`;
  };

  const exportToExcel = async () => {
    if (!exportFilters.start_date || !exportFilters.end_date) {
      toast.error("Start date and end date are required.");
      return;
    }
    if (exportFilters.start_date > exportFilters.end_date) {
      toast.error("Start date cannot be after end date.");
      return;
    }

    try {
      setExporting(true);
      const res = await axios.post(
        "/api/v1/servicetickets/export-servicetickets",
        exportFilters,
        { withCredentials: true },
      );
      const rows = res.data.data || [];

      if (rows.length === 0) {
        toast.error("No tickets match the selected filters.");
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(
        rows.map((item, index) => ({
          "#": index + 1,
          "Ticket Id": item.ticket_id,
          "Robot No": item.robot_no,
          "Site Id": item.site_id,
          "Fault Type": item.fault_type,
          Status: item.ticket_resolved ? "RESOLVED" : "OPEN",
          "Created Date": moment(item.createdAt).format("DD/MM/YYYY hh:mm A"),
          "Resolved Date": item.ticket_resolved
            ? moment(item.ticket_resolved_at).format("DD/MM/YYYY hh:mm A")
            : "OPEN",
          "Time to Resolve": item.ticket_resolved
            ? TImetoResolvedTicket(item.createdAt, item.ticket_resolved_at)
            : "OPEN",
          "Generating Notes": item.ticket_generating_notes || "",
          "Resolving Notes": item.ticket_resolving_notes || "",
          "Generated Image 1": item.ticket_generated_images1 || "",
          "Generated Image 2": item.ticket_generated_images2 || "",
          "Generated Image 3": item.ticket_generated_images3 || "",
          "Generated Image 4": item.ticket_generated_images4 || "",
          "Generated Image 5": item.ticket_generated_images5 || "",
          "Resolved Image 1": item.ticket_resolved_images1 || "",
          "Resolved Image 2": item.ticket_resolved_images2 || "",
          "Resolved Image 3": item.ticket_resolved_images3 || "",
          "Resolved Image 4": item.ticket_resolved_images4 || "",
          "Resolved Image 5": item.ticket_resolved_images5 || "",
        })),
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Service Ticket");
      XLSX.writeFile(
        workbook,
        `Service-Ticket(${exportFilters.start_date}-${exportFilters.end_date}).xlsx`,
      );
      toast.success(`Exported ${rows.length} ticket(s).`);
      setExportModal(false);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Export failed",
      );
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <h4 className="mb-3">Service Tickets Dashboard</h4>
      <p className="text-medium-emphasis mb-4">
        Raised, resolved, pending by site — plus recurring faults and aging.
      </p>

      <PieChart />
      <BarGraph />

      <CCard className="mt-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">All Service Tickets</h5>
          <div className="d-flex justify-content-end">
            <Link
              to="key-preventive-matrix"
              className="btn btn-sm btn-primary m-1"
            >
              KEY MAINTENANCE MATRIX
            </Link>
            {!["Master User", "Project User", "Service User"].includes(
              userInfo?.role,
            ) && (
              <Link
                to="create-new-ticket"
                className="btn btn-sm btn-secondary m-1"
              >
                NEW
              </Link>
            )}
            <button
              type="button"
              className="btn btn-sm btn-secondary m-1"
              onClick={openExportModal}
            >
              Export
            </button>
          </div>
        </CCardHeader>

        <CCardBody>
          <CRow className="justify-content-end">
            <CCol md={2} xs={12} className="m-1">
              <CFormInput
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </CCol>
            <CCol md={2} xs={12} className="m-1">
              <CFormInput
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </CCol>
            <CCol md={3} xs={12} lg={3}>
              <CFormInput
                type="text"
                placeholder="Search by Robot No, Deveui, or Site ID"
                className="mb-3"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </CCol>
          </CRow>

          <CTable bordered hover responsive className="text-center">
            <CTableHead color="secondary">
              <CTableRow>
                <CTableHeaderCell>Serial</CTableHeaderCell>
                <CTableHeaderCell className="sticky-col">
                  Ticket ID
                </CTableHeaderCell>
                <CTableHeaderCell>Robot No</CTableHeaderCell>
                <CTableHeaderCell>Site ID</CTableHeaderCell>
                <CTableHeaderCell>Fault Type</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Date</CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {loading ? (
                <CTableRow>
                  <CTableDataCell colSpan="8" className="text-start">
                    <LoadingSpinner />
                  </CTableDataCell>
                </CTableRow>
              ) : error ? (
                <CTableRow>
                  <CTableDataCell colSpan={8}>{String(error)}</CTableDataCell>
                </CTableRow>
              ) : filteredData.length > 0 ? (
                filteredData.map((ticket, index) => (
                  <CTableRow
                    key={ticket._id || index}
                    className={ticket.is_delete ? "table-danger" : ""}
                  >
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell
                      style={{ minWidth: "240px" }}
                      className="sticky-col"
                    >
                      <Link
                        to={`view-service-ticket/${ticket._id}`}
                        className="text-decoration-none"
                      >
                        {ticket.ticket_id}
                      </Link>
                    </CTableDataCell>
                    <CTableDataCell style={{ minWidth: "150px" }}>
                      {ticket.robot_no}
                    </CTableDataCell>
                    <CTableDataCell style={{ minWidth: "150px" }}>
                      {ticket.site_id}
                    </CTableDataCell>
                    <CTableDataCell style={{ minWidth: "150px" }}>
                      {ticket.fault_type}
                    </CTableDataCell>
                    <CTableDataCell style={{ minWidth: "150px" }}>
                      {ticket.ticket_resolved ? (
                        <CBadge color="success">Resolved</CBadge>
                      ) : (
                        <CBadge color="danger">Open</CBadge>
                      )}
                    </CTableDataCell>
                    <CTableDataCell style={{ minWidth: "190px" }}>
                      {new Date(ticket.createdAt).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })}
                    </CTableDataCell>
                    <CTableDataCell style={{ minWidth: "210px" }}>
                      <Link
                        className="mx-1 btn btn-sm btn-secondary text-decoration-none"
                        to={`view-service-ticket/${ticket._id}`}
                      >
                        View
                      </Link>

                      {userInfo.role === "Master Admin" && (
                        <Link
                          className="mx-1 btn btn-sm btn-primary text-decoration-none"
                          to={`update-service-ticket/${ticket._id}`}
                        >
                          Update
                        </Link>
                      )}
                      {![
                        "Master User",
                        "Project User",
                        "Service User",
                      ].includes(userInfo?.role) && (
                        <Link
                          className="m-1 btn btn-sm btn-success text-decoration-none"
                          to={`resolve-service-ticket/${ticket._id}`}
                        >
                          Resolve
                        </Link>
                      )}
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan={8} className="text-start">
                    No data found
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
            handlePageInputChange={(e) => setPageInput(e.target.value)}
            handlePageInputSubmit={handlePageInputSubmit}
            limit={limit}
            handleLimitChange={setLimit}
          />
        </CCardBody>
      </CCard>

      <CModal
        visible={exportModal}
        onClose={() => !exporting && setExportModal(false)}
        backdrop="static"
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle>Export Service Tickets</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="g-3">
            <CCol xs={12} md={6}>
              <CFormLabel>Start date</CFormLabel>
              <CFormInput
                type="date"
                value={exportFilters.start_date}
                onChange={(e) =>
                  setExportFilters((f) => ({
                    ...f,
                    start_date: e.target.value,
                  }))
                }
              />
            </CCol>
            <CCol xs={12} md={6}>
              <CFormLabel>End date</CFormLabel>
              <CFormInput
                type="date"
                value={exportFilters.end_date}
                onChange={(e) =>
                  setExportFilters((f) => ({
                    ...f,
                    end_date: e.target.value,
                  }))
                }
              />
            </CCol>
            <CCol xs={12}>
              <CFormLabel>Fault type</CFormLabel>
              <CFormSelect
                value={exportFilters.fault_type}
                onChange={(e) =>
                  setExportFilters((f) => ({
                    ...f,
                    fault_type: e.target.value,
                  }))
                }
              >
                <option value="all">All</option>
                {faultOptions.map((fault) => (
                  <option key={fault} value={fault}>
                    {fault}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol xs={12}>
              <CFormLabel>Site</CFormLabel>
              <CFormSelect
                value={exportFilters.site_id}
                onChange={(e) =>
                  setExportFilters((f) => ({
                    ...f,
                    site_id: e.target.value,
                  }))
                }
              >
                <option value="all">All</option>
                {siteOptions.map((site) => (
                  <option key={site} value={site}>
                    {fmtSite(site)}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol xs={12}>
              <CFormLabel>Status</CFormLabel>
              <CFormSelect
                value={exportFilters.status}
                onChange={(e) =>
                  setExportFilters((f) => ({
                    ...f,
                    status: e.target.value,
                  }))
                }
              >
                <option value="all">All</option>
                <option value="open">Open</option>
                <option value="resolved">Resolved</option>
              </CFormSelect>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            size="sm"
            disabled={exporting}
            onClick={() => setExportModal(false)}
          >
            Cancel
          </CButton>
          <CButton
            color="primary"
            size="sm"
            disabled={exporting}
            onClick={exportToExcel}
          >
            {exporting ? (
              <>
                Exporting <LoadingSpinner />
              </>
            ) : (
              "Export Excel"
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default ServiceTicketDashboard;
