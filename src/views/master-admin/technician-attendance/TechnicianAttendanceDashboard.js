import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import {
  CBadge,
  CButton,
  CCol,
  CFormSelect,
  CImage,
  CModal,
  CModalBody,
  CModalHeader,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";
import { Link } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        technicians: Array.isArray(action.payload.data)
          ? action.payload.data
          : [],
        wfhRequests: Array.isArray(action.payload.wfh)
          ? action.payload.wfh
          : [],
        totalPages: action.payload.totalPages,
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const istYmd = (value) => {
  if (value == null || value === "") return null;
  // Pure calendar date from API — keep as-is (no TZ shift)
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value.trim())) {
    return value.trim();
  }
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
};

const mapsLink = (loc) => {
  const lat = loc?.lat ?? loc?.latitude;
  const lng = loc?.lng ?? loc?.longitude;
  if (lat == null || lng == null || lat === "" || lng === "") return null;
  return `https://www.google.com/maps?q=${lat},${lng}`;
};

const formatTime = (value) => {
  if (value == null || value === "") return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatDateTime = (value) => {
  if (value == null || value === "") return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

const TechnicianAttendanceDashboard = () => {
  const [{ loading, technicians, wfhRequests }, dispatch] = useReducer(
    reducer,
    {
      technicians: [],
      wfhRequests: [],
      loading: true,
      error: "",
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    },
  );

  // const authtoken = useSelector((state) => state.authtoken);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);

  const page = 1;
  const limit = 10;
  const [searchText, setSearchText] = useState("");

  const currentDate = new Date();
  const [month, setMonth] = useState(
    String(currentDate.getMonth() + 1).padStart(2, "0"),
  );
  const [year, setYear] = useState(String(currentDate.getFullYear()));

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const result = await axios.post(
          `/api/v1/technician-attendance/${month}/${year}`,
          { pg: page, limit: limit },
          {
            // headers: { Authorization: `Bearer ${authtoken}` },
            withCredentials: true,
          },
        );

        let total = Math.ceil(result.data.total / result.data.limit);
        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            data: Array.isArray(result.data.data) ? result.data.data : [],
            wfh: Array.isArray(result.data.wfh) ? result.data.wfh : [],
            totalPages: total,
            hasNextPage: result.data.hasNextPage,
            hasPrevPage: result.data.hasPrevPage,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data.error || "Failed to fetch",
        });
        toast.error(error.response?.data.error || "Failed to fetch");
      }
    };

    fetchAttendance();
  }, [limit, month, page, year]);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(month, year);

  const groupedData = {};
  // Grouping logic

  (technicians || []).forEach((record) => {
    // WFH rows often have date but null punchin_time — don't key as "Invalid Date"
    const date =
      istYmd(record.punchin_time) ||
      istYmd(record.date) ||
      istYmd(record.createdAt);
    if (!date || !record.username) return;

    if (!groupedData[record.username]) {
      groupedData[record.username] = {
        site_id: record.site_id || "",
        profile_image: record.profile_image || "",
        attendance: {},
      };
    }

    groupedData[record.username].attendance[date] = {
      _id: record._id,
      user_id: record.user_id,
      username: record.username,
      site_id: record.site_id,
      profile_image: record.profile_image,
      source: record.source || "site",
      wfhStatus: record.wfh_status || record.wfhStatus || null,
      reason: record.reason || null,
      in: record.punchin_time || null,
      out: record.punchout_time || null,
      punchin_location: record.punchin_location,
      punchout_location: record.punchout_location || null,
      punch_in_image: record.punch_in_image,
      punch_out_image: record.punch_out_image || null,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      __v: record.__v,
    };
  });

  (wfhRequests || []).forEach((wfh) => {
    const date = istYmd(wfh.date) || istYmd(wfh.createdAt);
    const username = wfh.username;
    if (!username || !date) return;
    if (!groupedData[username]) {
      groupedData[username] = {
        site_id: wfh.site_id || "",
        profile_image: "",
        attendance: {},
      };
    }
    const existing = groupedData[username].attendance[date];
    // Keep real punch times; still stamp WFH status onto the day cell
    if (existing?.in) {
      groupedData[username].attendance[date] = {
        ...existing,
        source: existing.source === "wfh" ? "wfh" : existing.source,
        wfhStatus: wfh.status || existing.wfhStatus,
        reason: wfh.reason || existing.reason,
      };
      return;
    }
    if (existing?.source === "wfh" && existing.wfhStatus === "approved") return;
    groupedData[username].attendance[date] = {
      _id: wfh._id,
      username,
      site_id: wfh.site_id,
      source: "wfh",
      wfhStatus: wfh.status,
      reason: wfh.reason,
      in: existing?.in || null,
      out: existing?.out || null,
      punchin_location: null,
      punchout_location: null,
      createdAt: wfh.createdAt,
    };
  });

  const exportToExcel = () => {
    const table = document.querySelector("table");
    if (!table) {
      console.error("Attendance table not found!");
      return;
    }

    if (!Object.keys(groupedData).length) {
      toast.error("No data available to export");
      return;
    }

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.table_to_sheet(table, { raw: true });

    XLSX.utils.book_append_sheet(workbook, worksheet, "Technician Attendance");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(data, `Technician_Attendance_${month}_${year}.xlsx`);
  };

  const filteredEntries = Object.entries(groupedData).filter(
    ([username, data]) =>
      username.toLowerCase().includes(searchText) ||
      String(data.site_id || "")
        .toLowerCase()
        .includes(searchText),
  );

  const openModal = (log) => {
    setModalVisible(true);
    setModalData(log);
  };

  return (
    <div>
      {" "}
      <h3 className="text-center">All Site Technicians Timesheet</h3>
      <CRow className="mb-3">
        <CCol xs="auto">
          <CFormSelect value={month} onChange={(e) => setMonth(e.target.value)}>
            {[...Array(12)].map((_, index) => {
              const m = String(index + 1).padStart(2, "0");
              return (
                <option key={m} value={m}>
                  {m}
                </option>
              );
            })}
          </CFormSelect>
        </CCol>
        <CCol xs="auto">
          <CFormSelect value={year} onChange={(e) => setYear(e.target.value)}>
            {Array.from({ length: 5 }).map((_, index) => {
              const y = String(new Date().getFullYear() - 2 + index);
              return (
                <option key={y} value={y}>
                  {y}
                </option>
              );
            })}
          </CFormSelect>
        </CCol>

        <CCol lg="2" xs="auto">
          <input
            type="text"
            className="form-control"
            placeholder="Search by username or site ID"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value.toLowerCase())}
          />
        </CCol>
        <CCol xs="auto">
          <CButton size="sm" color="success" onClick={exportToExcel}>
            Export
          </CButton>
        </CCol>
      </CRow>
      <CTable bordered hover responsive>
        <CTableHead color="dark">
          <CTableRow className="text-center">
            <CTableHeaderCell>Sr</CTableHeaderCell>
            <CTableHeaderCell>Profile</CTableHeaderCell>
            {/* <CTableHeaderCell>Name</CTableHeaderCell> */}
            <CTableHeaderCell
              style={{
                position: "sticky",
                left: 0,
                zIndex: 2,
                minWidth: "170px",
              }}
            >
              Name
            </CTableHeaderCell>
            <CTableHeaderCell>Site</CTableHeaderCell>
            {[...Array(daysInMonth)].map((_, i) => (
              <CTableHeaderCell key={i}>{i + 1}</CTableHeaderCell>
            ))}
            <CTableHeaderCell>Total</CTableHeaderCell>{" "}
            {/* 👈 Add Total column */}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loading ? (
            <CTableRow>
              <CTableDataCell colSpan={daysInMonth + 5}>
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : Object.keys(groupedData).length > 0 ? (
            filteredEntries.map(([username, data], idx) => {
              let presentCount = 0;

              return (
                <CTableRow key={idx} className="text-center">
                  <CTableDataCell>{idx + 1}</CTableDataCell>
                  <CTableDataCell>
                    {data.profile_image ? (
                      <CImage
                        src={data.profile_image}
                        style={{
                          height: "50px",
                          width: "50px",
                          borderRadius: "50%",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <div
                        className="rounded-circle bg-secondary text-white d-inline-flex align-items-center justify-content-center"
                        style={{ height: "50px", width: "50px" }}
                      >
                        {(username || "?").charAt(0).toUpperCase()}
                      </div>
                    )}
                  </CTableDataCell>
                  {/* <CTableDataCell style={{ minWidth: "170px" }}>
                    {username}
                  </CTableDataCell> */}
                  <CTableDataCell
                    style={{
                      position: "sticky",
                      left: 0,
                      zIndex: 1,
                      minWidth: "170px",
                    }}
                  >
                    {username}
                  </CTableDataCell>
                  <CTableDataCell>{data.site_id}</CTableDataCell>

                  {[...Array(daysInMonth)].map((_, dayIdx) => {
                    const day = String(dayIdx + 1).padStart(2, "0");
                    const formattedDate = `${year}-${month}-${day}`;
                    const log = data.attendance[formattedDate];

                    const isWfh =
                      log?.source === "wfh" || Boolean(log?.wfhStatus);
                    const inTime = formatTime(log?.in);
                    const outTime = formatTime(log?.out);

                    if (inTime && outTime) presentCount++;
                    else if (
                      isWfh &&
                      log?.wfhStatus === "approved" &&
                      !inTime
                    ) {
                      presentCount++;
                    } else if (isWfh && !log?.wfhStatus && !inTime) {
                      // Approved WFH attendance row (source only, no punch times)
                      presentCount++;
                    }

                    return (
                      <CTableDataCell key={dayIdx}>
                        {log ? (
                          isWfh && !inTime ? (
                            <CBadge
                              color={
                                log.wfhStatus === "rejected"
                                  ? "danger"
                                  : log.wfhStatus === "pending"
                                    ? "info"
                                    : "success"
                              }
                              className="cursor-pointer"
                              onClick={() => openModal(log)}
                              title={log.reason || "WFH"}
                            >
                              {log.wfhStatus === "pending"
                                ? "WFH*"
                                : log.wfhStatus === "rejected"
                                  ? "WFH×"
                                  : "WFH"}
                            </CBadge>
                          ) : inTime && outTime ? (
                            <CBadge
                              color={isWfh ? "info" : "success"}
                              className="cursor-pointer"
                              onClick={() => openModal(log)}
                              title={log.reason || undefined}
                            >
                              {isWfh ? "WFH" : "P"}
                              <br />
                              {inTime}
                              <br />
                              {outTime}
                            </CBadge>
                          ) : inTime && !outTime ? (
                            <CBadge
                              color="warning"
                              className="cursor-pointer"
                              onClick={() => openModal(log)}
                            >
                              {isWfh ? "WFH*" : "P*"}
                              <br />
                              {inTime}
                            </CBadge>
                          ) : (
                            <CBadge color="danger">A</CBadge>
                          )
                        ) : (
                          <CBadge color="danger">A</CBadge>
                        )}
                      </CTableDataCell>
                    );
                  })}

                  <CTableDataCell>
                    <strong>{presentCount}</strong>
                  </CTableDataCell>
                </CTableRow>
              );
            })
          ) : (
            <CTableRow>
              <CTableDataCell colSpan={daysInMonth + 4} className="text-center">
                No data found
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
      {modalData && (
        <CModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          size="lg"
          alignment="center"
          backdrop="static"
        >
          {/* Header */}
          <CModalHeader
            className="d-flex justify-content-between align-items-center"
            closeButton={false}
          >
            <div className="d-flex align-items-center">
              {modalData.profile_image ? (
                <img
                  src={modalData.profile_image}
                  alt={modalData.username}
                  className="rounded-circle me-2"
                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                />
              ) : (
                <div
                  className="rounded-circle me-2 bg-secondary text-white d-flex align-items-center justify-content-center"
                  style={{ width: "40px", height: "40px", flexShrink: 0 }}
                >
                  {(modalData.username || "?").charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h5 className="mb-0">{modalData.username}</h5>
                <small className="text-muted">{modalData.site_id}</small>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              className="border-0 bg-transparent p-0"
              onClick={() => setModalVisible(false)}
            >
              <CIcon icon={cilX} size="lg" />
            </button>
          </CModalHeader>

          {/* Body */}
          <CModalBody>
            <div className="row g-3">
              {/* Date */}
              <div className="d-flex justify-content-center align-items-center fw-semibold">
                {modalData.source === "wfh" || modalData.wfhStatus
                  ? `WFH${modalData.wfhStatus ? ` (${modalData.wfhStatus})` : ""}${
                      modalData.reason ? ` — ${modalData.reason}` : ""
                    }`
                  : null}
              </div>
              <div className="d-flex justify-content-center align-items-center fw-semibold">
                {istYmd(modalData.in || modalData.createdAt)
                  ? new Date(
                      `${istYmd(modalData.in || modalData.createdAt)}T12:00:00`,
                    ).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : ""}
              </div>
              {/* Punch In Section */}
              <div className="col-md-6">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-header bg-success text-white py-2">
                    {modalData.source === "wfh" || modalData.wfhStatus
                      ? "WFH"
                      : "Punch In"}
                  </div>
                  <div className="card-body text-center">
                    {modalData.punch_in_image ? (
                      <img
                        src={modalData.punch_in_image}
                        alt="Punch In"
                        className="img-fluid rounded mb-2"
                        style={{ maxHeight: "200px", objectFit: "contain" }}
                      />
                    ) : modalData.profile_image ? (
                      <img
                        src={modalData.profile_image}
                        alt="Punch In"
                        className="img-fluid rounded mb-2"
                        style={{ maxHeight: "200px", objectFit: "contain" }}
                      />
                    ) : null}
                    <p className="mb-1">
                      <strong>Time:</strong>{" "}
                      {formatDateTime(modalData.in) ||
                        (modalData.source === "wfh" || modalData.wfhStatus
                          ? "WFH (no punch)"
                          : "N/A")}
                    </p>
                    <p className="mb-0">
                      <strong>Location :</strong>
                      {mapsLink(modalData.punchin_location) ? (
                        <Link
                          className="ms-3"
                          target="blank"
                          to={mapsLink(modalData.punchin_location)}
                        >
                          View
                        </Link>
                      ) : (
                        <span className="ms-2 text-muted">
                          {modalData.source === "wfh" || modalData.wfhStatus
                            ? "WFH (no GPS)"
                            : "N/A"}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {modalData.out ? (
                <div className="col-md-6">
                  <div className="card shadow-sm border-0 h-100">
                    <div className="card-header bg-danger text-white py-2">
                      Punch Out
                    </div>
                    <div className="card-body text-center">
                      {modalData.punch_out_image ? (
                        <img
                          src={modalData.punch_out_image}
                          alt="Punch Out"
                          className="img-fluid rounded mb-2"
                          style={{ maxHeight: "200px", objectFit: "contain" }}
                        />
                      ) : modalData.profile_image ? (
                        <img
                          src={modalData.profile_image}
                          alt="Punch In"
                          className="img-fluid rounded mb-2"
                          style={{ maxHeight: "200px", objectFit: "contain" }}
                        />
                      ) : null}
                      <p className="mb-1">
                        <strong>Time:</strong>{" "}
                        {formatDateTime(modalData.out) || "Not Available"}
                      </p>
                      <p className="mb-0">
                        <strong>Location :</strong>{" "}
                        {mapsLink(modalData.punchout_location) ? (
                          <Link
                            target="blank"
                            className="ms-3"
                            to={mapsLink(modalData.punchout_location)}
                          >
                            View
                          </Link>
                        ) : (
                          <span className="ms-2 text-muted">
                            {modalData.source === "wfh" || modalData.wfhStatus
                              ? "WFH (no GPS)"
                              : "N/A"}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="col-md-6">
                  <div className="card shadow-sm border-0 h-100">
                    <div className="card-header bg-danger text-white py-2">
                      Punch Out
                    </div>
                    <div className="card-body d-flex justify-content-center align-items-center">
                      {modalData.source === "wfh" || modalData.wfhStatus
                        ? "WFH — no punch out"
                        : "No Punch Out Data Available"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CModalBody>
        </CModal>
      )}
    </div>
  );
};

export default TechnicianAttendanceDashboard;
