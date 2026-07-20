import React, { useEffect, useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import SiteSelect from "../../../components/SiteSelect";

const adminRouteFromRole = (role) => {
  if (role === "Master Admin") return "master-admin";
  if (role === "Service Admin") return "service-admin";
  if (role === "Project Admin") return "project-admin";
  if (role === "Master User") return "master-user";
  if (role === "Service User") return "service-user";
  if (role === "Project User") return "project-user";
  return "master-admin";
};

const CreateFaultyReturn = () => {
  const navigate = useNavigate();
  const userInfo = useSelector((s) => s.userInfo);
  const adminroute = adminRouteFromRole(userInfo?.role);

  const [loadingFaulty, setLoadingFaulty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [faultyRows, setFaultyRows] = useState([]);
  const [siteId, setSiteId] = useState("all");
  const [destination, setDestination] = useState("Main Factory");
  const [remark, setRemark] = useState("");
  // selected: { [faultyRowId]: quantity }
  const [selected, setSelected] = useState({});

  useEffect(() => {
    const load = async () => {
      setLoadingFaulty(true);
      try {
        const res = await axios.post(
          `/api/v1/faulty-inventory`,
          { site_id: siteId },
          { withCredentials: true },
        );
        setFaultyRows((res.data.data || []).filter((r) => r.quantity > 0));
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load faulty stock");
      } finally {
        setLoadingFaulty(false);
      }
    };
    load();
  }, [siteId]);

  const setQty = (row, qty) => {
    const n = Number(qty);
    if (!n || n <= 0) {
      const next = { ...selected };
      delete next[row._id];
      setSelected(next);
      return;
    }
    setSelected({
      ...selected,
      [row._id]: Math.min(n, row.quantity),
    });
  };

  const submit = async (asSubmitted) => {
    const items = faultyRows
      .filter((r) => selected[r._id])
      .map((r) => ({
        site_id: r.site_id,
        item_id: r.item_id,
        item_name: r.item_name,
        item_code: r.item_code,
        quantity: Number(selected[r._id]),
      }));

    if (!items.length) {
      toast.error("Select at least one item with quantity");
      return;
    }

    setSaving(true);
    try {
      const res = await axios.post(
        `/api/v1/faulty-inventory/returns`,
        {
          items,
          destination,
          remark,
          status: asSubmitted ? "Submitted" : "Draft",
        },
        { withCredentials: true },
      );
      toast.success(res.data.message || "Created");
      navigate(`/${adminroute}/faulty-return-rework/view/${res.data.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create return");
    } finally {
      setSaving(false);
    }
  };

  const selectedCount = Object.keys(selected).length;

  return (
    <div className="p-2">
      <CRow className="mb-3 align-items-center">
        <CCol>
          <h5 className="mb-0">Create Faulty Return</h5>
          <div className="small text-medium-emphasis">
            Pick faulty items from any sites — one request can cover multiple
            sites.
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
          <CRow className="g-2">
            <CCol md={4}>
              <label className="form-label small">Filter site</label>
              <SiteSelect value={siteId} onChange={setSiteId} />
            </CCol>
            <CCol md={4}>
              <label className="form-label small">Destination</label>
              <CFormSelect
                size="sm"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              >
                <option value="Main Factory">Main Factory</option>
                <option value="Main Office">Main Office</option>
              </CFormSelect>
            </CCol>
            <CCol md={4}>
              <label className="form-label small">Remark</label>
              <CFormTextarea
                rows={1}
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Optional note"
              />
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {loadingFaulty ? (
        <LoadingSpinner />
      ) : (
        <CTable bordered hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Site</CTableHeaderCell>
              <CTableHeaderCell>Item</CTableHeaderCell>
              <CTableHeaderCell>Code</CTableHeaderCell>
              <CTableHeaderCell>Faulty Qty</CTableHeaderCell>
              <CTableHeaderCell>Return Qty</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {faultyRows.length ? (
              faultyRows.map((row) => (
                <CTableRow key={row._id}>
                  <CTableDataCell>{row.site_id}</CTableDataCell>
                  <CTableDataCell>{row.item_name}</CTableDataCell>
                  <CTableDataCell>{row.item_code}</CTableDataCell>
                  <CTableDataCell>{row.quantity}</CTableDataCell>
                  <CTableDataCell style={{ maxWidth: 110 }}>
                    <CFormInput
                      type="number"
                      size="sm"
                      min={0}
                      max={row.quantity}
                      value={selected[row._id] || ""}
                      onChange={(e) => setQty(row, e.target.value)}
                    />
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan={5} className="text-center">
                  No faulty stock available.
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      )}

      <div className="d-flex justify-content-between align-items-center mt-3">
        <span className="small text-medium-emphasis">
          {selectedCount} line(s) selected
        </span>
        <div className="d-flex gap-2">
          <CButton
            color="secondary"
            size="sm"
            disabled={saving || !selectedCount}
            onClick={() => submit(false)}
          >
            Save Draft
          </CButton>
          <CButton
            color="primary"
            size="sm"
            disabled={saving || !selectedCount}
            onClick={() => submit(true)}
          >
            {saving ? "Saving…" : "Submit (deduct stock)"}
          </CButton>
        </div>
      </div>
    </div>
  );
};

export default CreateFaultyReturn;
