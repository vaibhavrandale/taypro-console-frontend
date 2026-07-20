import React, { useEffect, useReducer, useState } from "react";
import {
  CBadge,
  CButton,
  CCol,
  CFormInput,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import moment from "moment";
import LoadingSpinner from "../../../components/LoadingSpinner";

const STATUS_COLOR = {
  Draft: "secondary",
  Submitted: "info",
  "In Transit": "warning",
  Received: "success",
  Cancelled: "danger",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOAD":
      return { ...state, loading: true, error: "" };
    case "OK":
      return { ...state, loading: false, rows: action.payload };
    case "FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const adminRouteFromRole = (role) => {
  if (role === "Master Admin") return "master-admin";
  if (role === "Service Admin") return "service-admin";
  if (role === "Project Admin") return "project-admin";
  if (role === "Master User") return "master-user";
  if (role === "Service User") return "service-user";
  if (role === "Project User") return "project-user";
  return "master-admin";
};

const FaultyReturnDashboard = () => {
  const [{ loading, rows, error }, dispatch] = useReducer(reducer, {
    loading: true,
    rows: [],
    error: "",
  });
  const userInfo = useSelector((s) => s.userInfo);
  const adminroute = adminRouteFromRole(userInfo?.role);
  const [search, setSearch] = useState("");

  const load = async () => {
    dispatch({ type: "LOAD" });
    try {
      const res = await axios.get(`/api/v1/faulty-inventory/returns`, {
        withCredentials: true,
      });
      dispatch({ type: "OK", payload: res.data.data || [] });
    } catch (err) {
      dispatch({
        type: "FAIL",
        payload: err.response?.data?.message || "Failed to load returns",
      });
      toast.error(err.response?.data?.message || "Failed to load returns");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = rows.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.return_id?.toLowerCase().includes(q) ||
      r.status?.toLowerCase().includes(q) ||
      r.destination?.toLowerCase().includes(q) ||
      r.items?.some(
        (i) =>
          i.site_id?.toLowerCase().includes(q) ||
          i.item_name?.toLowerCase().includes(q),
      )
    );
  });

  return (
    <div className="p-2">
      <CRow className="mb-3 align-items-center">
        <CCol>
          <h5 className="mb-0">Faulty Return — Site → Factory Rework</h5>
          <div className="small text-medium-emphasis">
            Return faulty parts from one or more sites to the main factory.
          </div>
        </CCol>
        <CCol xs="auto" className="d-flex gap-2 flex-wrap">
          <Link
            className="btn btn-sm btn-outline-secondary"
            to={`/${adminroute}/inventory-hub`}
          >
            Inventory Hub
          </Link>
          <Link
            className="btn btn-sm btn-outline-secondary"
            to={`/${adminroute}/faulty-inventory`}
          >
            Faulty Stock
          </Link>
          <Link
            className="btn btn-sm btn-primary"
            to={`/${adminroute}/faulty-return-rework/create`}
          >
            New Return
          </Link>
        </CCol>
      </CRow>

      <CRow className="mb-3">
        <CCol md={4}>
          <CFormInput
            size="sm"
            placeholder="Search return id, site, item, status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CCol>
        <CCol xs="auto">
          <CButton color="secondary" size="sm" variant="outline" onClick={load}>
            Refresh
          </CButton>
        </CCol>
      </CRow>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-danger">{error}</div>
      ) : (
        <CTable bordered hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Return ID</CTableHeaderCell>
              <CTableHeaderCell>Sites</CTableHeaderCell>
              <CTableHeaderCell>Items</CTableHeaderCell>
              <CTableHeaderCell>Qty</CTableHeaderCell>
              <CTableHeaderCell>Destination</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Created</CTableHeaderCell>
              <CTableHeaderCell>Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filtered.length ? (
              filtered.map((r) => {
                const sites = [
                  ...new Set(r.items?.map((i) => i.site_id) || []),
                ];
                const qty = (r.items || []).reduce(
                  (s, i) => s + (i.quantity || 0),
                  0,
                );
                return (
                  <CTableRow key={r._id}>
                    <CTableDataCell>{r.return_id}</CTableDataCell>
                    <CTableDataCell>
                      {sites.slice(0, 2).join(", ")}
                      {sites.length > 2 ? ` +${sites.length - 2}` : ""}
                    </CTableDataCell>
                    <CTableDataCell>{r.items?.length || 0}</CTableDataCell>
                    <CTableDataCell>{qty}</CTableDataCell>
                    <CTableDataCell>{r.destination}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={STATUS_COLOR[r.status] || "secondary"}>
                        {r.status}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      {moment(r.createdAt).format("DD MMM YY")}
                    </CTableDataCell>
                    <CTableDataCell>
                      <Link
                        className="btn btn-sm btn-outline-info"
                        to={`/${adminroute}/faulty-return-rework/view/${r._id}`}
                      >
                        View
                      </Link>
                    </CTableDataCell>
                  </CTableRow>
                );
              })
            ) : (
              <CTableRow>
                <CTableDataCell colSpan={8} className="text-center">
                  No return requests yet.
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      )}
    </div>
  );
};

export default FaultyReturnDashboard;
