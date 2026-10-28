import RobotNoLink from "../../../components/RobotNoLink";
import React, { useEffect, useReducer, useState } from "react";
import {
  CAlert,
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
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
import moment from "moment";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner";
import SiteSelect from "../../../components/SiteSelect";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        rows: action.payload.rows || [],
        errorRows: action.payload.error_rows || [],
        siteName: action.payload.site_name || "",
        message: action.payload.message || "",
      };
    case "FETCH_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
        rows: [],
        errorRows: [],
      };
    default:
      return state;
  }
};

const blockNumber = (block) => {
  const match = String(block || "").match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

const formatSigned = (delta, laterAt) => {
  if (delta == null || !laterAt) return "no later reading";
  const sign = delta > 0 ? "+" : "";
  return `${sign}${delta}(${moment(laterAt).format("HH:mm")})`;
};

const formatChange = (row) => {
  if (row.dock_voltage == null) return "no dock reading";
  return formatSigned(row.delta, row.later_at);
};

const formatErrorChange = (row) => {
  if (row.battery_at_error == null) return "no battery uplink";
  return formatSigned(row.delta, row.later_at);
};

const changeClassName = (delta) => {
  if (delta == null || delta === 0) return "";
  if (delta < 0) return "text-danger fw-semibold";
  return "text-success fw-semibold";
};

const DockCharge = () => {
  const [{ loading, error, rows, errorRows, siteName, message }, dispatch] =
    useReducer(reducer, {
      loading: false,
      error: "",
      rows: [],
      errorRows: [],
      siteName: "",
      message: "",
    });

  const [site_id, setSiteId] = useState("");
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [block, setBlock] = useState("");
  const [showCharging, setShowCharging] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const fetchDockCharge = async (selectedSite = site_id, selectedDate = date) => {
    if (!selectedSite) return;

    dispatch({ type: "FETCH_REQUEST" });
    try {
      const result = await axios.get("/api/v1/robots/dock-charge", {
        params: { site_id: selectedSite, date: selectedDate },
        withCredentials: true,
      });
      dispatch({
        type: "FETCH_SUCCESS",
        payload: { ...result.data.data, message: result.data.message },
      });
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to load dock charge";
      dispatch({ type: "FETCH_FAIL", payload: msg });
      toast.error(msg);
    }
  };

  useEffect(() => {
    if (!site_id) return;
    fetchDockCharge(site_id, date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [site_id, date]);

  useEffect(() => {
    const known = [...rows, ...errorRows].some((row) => row.block === block);
    if (block && !known) setBlock("");
  }, [rows, errorRows, block]);

  const blocks = [
    ...new Set(
      [...rows, ...errorRows].map((row) => row.block).filter(Boolean),
    ),
  ].sort(
    (a, b) => blockNumber(a) - blockNumber(b) || String(a).localeCompare(String(b)),
  );

  const visibleRows = block ? rows.filter((row) => row.block === block) : rows;
  const visibleErrors = block
    ? errorRows.filter((row) => row.block === block)
    : errorRows;

  const notCharging = visibleRows.filter((row) => row.delta == null || row.delta <= 0);
  const charging = visibleRows.filter((row) => row.delta > 0);

  const withTime = (value, at) => {
    if (value == null) return "-";
    return at ? `${value} (${moment(at).format("HH:mm")})` : String(value);
  };

  return (
    <div className="container-fluid">
      <h3 className="mb-4">Not charging</h3>

      <CCard className="mb-4">
        <CCardHeader>Filters</CCardHeader>
        <CCardBody>
          <CRow className="g-3 align-items-end">
            <CCol md={3}>
              <CFormLabel>Site</CFormLabel>
              <SiteSelect
                value={site_id}
                onChange={(next) => {
                  setBlock("");
                  setSiteId(next);
                }}
              />
            </CCol>

            <CCol md={3}>
              <CFormLabel>Date</CFormLabel>
              <CFormInput
                type="date"
                value={date}
                max={moment().format("YYYY-MM-DD")}
                onChange={(e) => setDate(e.target.value)}
              />
            </CCol>

            <CCol md={3}>
              <CFormLabel>Block</CFormLabel>
              <CFormSelect
                value={block}
                onChange={(e) => setBlock(e.target.value)}
              >
                <option value="">All Blocks</option>
                {blocks.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </CFormSelect>
            </CCol>

            <CCol md="auto">
              <CButton
                color="primary"
                size="sm"
                disabled={loading || !site_id}
                onClick={() => fetchDockCharge()}
              >
                {loading ? <LoadingSpinner size="sm" /> : "Search"}
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {error && <CAlert color="danger">{error}</CAlert>}

      {!site_id ? (
        <CAlert color="warning">Select a site.</CAlert>
      ) : (
        <>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <CBadge color="danger">Not charging {notCharging.length}</CBadge>
            <CBadge color="success">Charging {charging.length}</CBadge>
            {siteName ? (
              <span className="align-self-center small text-medium-emphasis">
                {siteName}
              </span>
            ) : null}
          </div>

          <CCard className="mb-3">
            <CCardBody>
              <CTable bordered hover responsive className="text-center">
                <CTableHead color="secondary">
                  <CTableRow>
                    <CTableHeaderCell>Block</CTableHeaderCell>
                    <CTableHeaderCell>Robot No</CTableHeaderCell>
                    <CTableHeaderCell>At dock</CTableHeaderCell>
                    <CTableHeaderCell>Later</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {loading ? (
                    <CTableRow>
                      <CTableDataCell colSpan="5" className="text-center">
                        <LoadingSpinner />
                      </CTableDataCell>
                    </CTableRow>
                  ) : notCharging.length === 0 ? (
                    <CTableRow>
                      <CTableDataCell colSpan="5" className="text-center">
                        {visibleRows.length === 0
                          ? message || "No dock events for this date"
                          : "Every docked robot is charging"}
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    notCharging.map((row) => (
                      <CTableRow key={`${row.robot_no}-${row.dock_at}`}>
                        <CTableDataCell>{row.block}</CTableDataCell>
                        <CTableDataCell>
                          <RobotNoLink robot={row} />
                        </CTableDataCell>
                        <CTableDataCell>
                          {withTime(row.dock_voltage, row.dock_at)}
                        </CTableDataCell>
                        <CTableDataCell>
                          {withTime(row.later_voltage, row.later_at)}
                        </CTableDataCell>
                        <CTableDataCell className="text-danger fw-semibold">
                          Not charging
                          {row.delta != null ? ` ${formatChange(row)}` : ""}
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>

          <div className="d-flex flex-wrap gap-2 mb-3">
            <CButton
              color="success"
              variant="outline"
              size="sm"
              onClick={() => setShowCharging((open) => !open)}
            >
              {showCharging ? "Hide" : "Show"} charging ({charging.length})
            </CButton>
            <CButton
              color="secondary"
              variant="outline"
              size="sm"
              onClick={() => setShowErrors((open) => !open)}
            >
              {showErrors ? "Hide" : "Show"} error cycles ({visibleErrors.length})
            </CButton>
          </div>

          {showCharging && (
            <CCard className="mb-3">
              <CCardHeader>Charging</CCardHeader>
              <CCardBody>
                <CTable bordered hover responsive className="text-center">
                  <CTableHead color="secondary">
                    <CTableRow>
                      <CTableHeaderCell>Block</CTableHeaderCell>
                      <CTableHeaderCell>Robot No</CTableHeaderCell>
                      <CTableHeaderCell>At dock</CTableHeaderCell>
                      <CTableHeaderCell>Later</CTableHeaderCell>
                      <CTableHeaderCell>Change</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {charging.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan="5" className="text-center">
                          No robots with a rising battery
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      charging.map((row) => (
                        <CTableRow key={`${row.robot_no}-${row.dock_at}`}>
                          <CTableDataCell>{row.block}</CTableDataCell>
                          <CTableDataCell>
                            <RobotNoLink robot={row} />
                          </CTableDataCell>
                          <CTableDataCell>
                            {withTime(row.dock_voltage, row.dock_at)}
                          </CTableDataCell>
                          <CTableDataCell>
                            {withTime(row.later_voltage, row.later_at)}
                          </CTableDataCell>
                          <CTableDataCell className="text-success fw-semibold">
                            {formatChange(row)}
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    )}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          )}

          {showErrors && (
            <CCard className="mb-3">
              <CCardHeader>Battery one hour after error</CCardHeader>
              <CCardBody>
                <CTable bordered hover responsive className="text-center">
                  <CTableHead color="secondary">
                    <CTableRow>
                      <CTableHeaderCell>Block</CTableHeaderCell>
                      <CTableHeaderCell>Robot No</CTableHeaderCell>
                      <CTableHeaderCell>Reason</CTableHeaderCell>
                      <CTableHeaderCell>Battery at error</CTableHeaderCell>
                      <CTableHeaderCell>After 1 hr</CTableHeaderCell>
                      <CTableHeaderCell>Change</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {visibleErrors.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan="6" className="text-center">
                          No error robots for this date
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      visibleErrors.map((row) => (
                        <CTableRow
                          key={`${row.robot_no}-${row.error_at}-${row.reason}`}
                        >
                          <CTableDataCell>{row.block}</CTableDataCell>
                          <CTableDataCell>
                            <RobotNoLink robot={row} />
                          </CTableDataCell>
                          <CTableDataCell>{row.reason}</CTableDataCell>
                          <CTableDataCell>
                            {withTime(row.battery_at_error, row.battery_at_error_at)}
                          </CTableDataCell>
                          <CTableDataCell>
                            {withTime(row.battery_after_1hr, row.later_at)}
                          </CTableDataCell>
                          <CTableDataCell className={changeClassName(row.delta)}>
                            {formatErrorChange(row)}
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    )}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          )}
        </>
      )}
    </div>
  );
};

export default DockCharge;
