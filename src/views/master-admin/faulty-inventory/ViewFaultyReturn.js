import React, { useEffect, useState } from "react";
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import moment from "moment";
import LoadingSpinner from "../../../components/LoadingSpinner";
import LastActivity from "../../../components/LastActivity";

const STATUS_COLOR = {
  Draft: "secondary",
  Submitted: "info",
  "In Transit": "warning",
  Received: "success",
  Cancelled: "danger",
};

const NEXT = {
  Draft: ["Submitted", "Cancelled"],
  Submitted: ["In Transit", "Received", "Cancelled"],
  "In Transit": ["Received", "Cancelled"],
  Received: [],
  Cancelled: [],
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

const ViewFaultyReturn = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userInfo = useSelector((s) => s.userInfo);
  const adminroute = adminRouteFromRole(userInfo?.role);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [doc, setDoc] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/v1/faulty-inventory/returns/${id}`, {
        withCredentials: true,
      });
      setDoc(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load");
      navigate(`/${adminroute}/faulty-return-rework`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const setStatus = async (status) => {
    if (!window.confirm(`Change status to ${status}?`)) return;
    setUpdating(true);
    try {
      const res = await axios.put(
        `/api/v1/faulty-inventory/returns/${id}/status`,
        { status },
        { withCredentials: true },
      );
      setDoc(res.data.data);
      toast.success(res.data.message || "Updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!doc) return null;

  const sites = [...new Set(doc.items?.map((i) => i.site_id) || [])];
  const totalQty = (doc.items || []).reduce((s, i) => s + (i.quantity || 0), 0);

  return (
    <div className="p-2">
      <CRow className="mb-3 align-items-center">
        <CCol>
          <h5 className="mb-0">
            {doc.return_id}{" "}
            <CBadge color={STATUS_COLOR[doc.status]}>{doc.status}</CBadge>
          </h5>
          <div className="small text-medium-emphasis">
            {doc.destination} · {sites.length} site(s) · {totalQty} pcs
          </div>
        </CCol>
        <CCol xs="auto">
          <Link
            className="btn btn-sm btn-outline-secondary"
            to={`/${adminroute}/faulty-return-rework`}
          >
            Back
          </Link>
        </CCol>
      </CRow>

      <CCard className="mb-3">
        <CCardBody>
          <CRow className="g-3">
            <CCol md={3}>
              <div className="small text-medium-emphasis">Created by</div>
              <div>{doc.created_by?.name || "—"}</div>
            </CCol>
            <CCol md={3}>
              <div className="small text-medium-emphasis">Created at</div>
              <div>{moment(doc.createdAt).format("DD MMM YYYY HH:mm")}</div>
            </CCol>
            <CCol md={3}>
              <div className="small text-medium-emphasis">Received by</div>
              <div>{doc.received_by?.name || "—"}</div>
            </CCol>
            <CCol md={3}>
              <div className="small text-medium-emphasis">Remark</div>
              <div>{doc.remark || "—"}</div>
            </CCol>
          </CRow>

          {NEXT[doc.status]?.length > 0 && (
            <div className="d-flex flex-wrap gap-2 mt-3">
              {NEXT[doc.status].map((s) => (
                <CButton
                  key={s}
                  size="sm"
                  color={s === "Cancelled" ? "danger" : "primary"}
                  variant={s === "Cancelled" ? "outline" : undefined}
                  disabled={updating}
                  onClick={() => setStatus(s)}
                >
                  Mark {s}
                </CButton>
              ))}
            </div>
          )}
        </CCardBody>
      </CCard>

      <CTable bordered hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Site</CTableHeaderCell>
            <CTableHeaderCell>Item</CTableHeaderCell>
            <CTableHeaderCell>Code</CTableHeaderCell>
            <CTableHeaderCell>Qty</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {doc.items?.map((item, idx) => (
            <CTableRow key={`${item.site_id}-${item.item_id}-${idx}`}>
              <CTableDataCell>{idx + 1}</CTableDataCell>
              <CTableDataCell>{item.site_id}</CTableDataCell>
              <CTableDataCell>{item.item_name}</CTableDataCell>
              <CTableDataCell>{item.item_code}</CTableDataCell>
              <CTableDataCell>{item.quantity}</CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      {doc.last_activity?.length > 0 && (
        <div className="mt-3">
          <LastActivity lastactivity={doc.last_activity} />
        </div>
      )}
    </div>
  );
};

export default ViewFaultyReturn;
