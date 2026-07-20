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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CBadge,
  CButton,
  CNav,
  CNavItem,
  CNavLink,
} from "@coreui/react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import LastActivity from "../../../components/LastActivity";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";
import SiteSelect from "../../../components/SiteSelect";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_FAULTYINVENTORY_REQUEST":
      return { ...state, loadingInventories: true, error: "" };
    case "FETCH_FAULTYINVENTORY_SUCCESS":
      return {
        ...state,
        loadingInventories: false,
        inventories: action.payload.data,
      };
    case "FETCH_FAULTYINVENTORY_FAIL":
      return { ...state, loadingInventories: false, error: action.payload };
    case "FETCH_TRACKING_REQUEST":
      return { ...state, loadingTracking: true };
    case "FETCH_TRACKING_SUCCESS":
      return {
        ...state,
        loadingTracking: false,
        tracking: action.payload,
      };
    case "FETCH_TRACKING_FAIL":
      return { ...state, loadingTracking: false };
    default:
      return state;
  }
};

const useAdminRoute = () => {
  const userInfo = useSelector((state) => state.userInfo);
  const role = userInfo?.role;
  if (role === "Master Admin") return "master-admin";
  if (role === "Service Admin") return "service-admin";
  if (role === "Project Admin") return "project-admin";
  if (role === "Master User") return "master-user";
  if (role === "Service User") return "service-user";
  if (role === "Project User") return "project-user";
  return "master-admin";
};

const FaultyInventory = () => {
  const [
    { inventories, loadingInventories, tracking, loadingTracking, error },
    dispatch,
  ] = useReducer(reducer, {
    inventories: [],
    tracking: [],
    loadingInventories: true,
    loadingTracking: false,
    error: "",
  });

  const adminroute = useAdminRoute();
  const [searchParams] = useSearchParams();
  const [siteId, setSiteId] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [trackSearch, setTrackSearch] = useState("");
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") === "tracking" ? "tracking" : "faulty",
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "tracking") setActiveTab("tracking");
    if (tab === "faulty") setActiveTab("faulty");
  }, [searchParams]);

  useEffect(() => {
    const fetchInventories = async () => {
      dispatch({ type: "FETCH_FAULTYINVENTORY_REQUEST" });
      try {
        const result = await axios.post(
          `/api/v1/faulty-inventory`,
          { site_id: siteId },
          { withCredentials: true },
        );
        dispatch({
          type: "FETCH_FAULTYINVENTORY_SUCCESS",
          payload: { data: result.data.data || [] },
        });
      } catch (err) {
        dispatch({
          type: "FETCH_FAULTYINVENTORY_FAIL",
          payload: "Failed to fetch Inventories",
        });
        toast.error("Failed to fetch Inventories");
      }
    };
    fetchInventories();
  }, [siteId]);

  useEffect(() => {
    if (activeTab !== "tracking") return;
    const fetchTracking = async () => {
      dispatch({ type: "FETCH_TRACKING_REQUEST" });
      try {
        const q = siteId !== "all" ? `?site_id=${siteId}` : "";
        const result = await axios.get(
          `/api/v1/faulty-inventory/item-tracking${q}`,
          { withCredentials: true },
        );
        dispatch({
          type: "FETCH_TRACKING_SUCCESS",
          payload: result.data.data || [],
        });
      } catch (err) {
        dispatch({ type: "FETCH_TRACKING_FAIL" });
        toast.error(
          err.response?.data?.message || "Failed to fetch item tracking",
        );
      }
    };
    fetchTracking();
  }, [activeTab, siteId]);

  const filteredInventories = (inventories || []).filter((inventory) => {
    const q = searchTerm.toLowerCase();
    return (
      inventory.site_id?.toLowerCase().includes(q) ||
      String(inventory.item_id || "")
        .toLowerCase()
        .includes(q) ||
      inventory.item_name?.toLowerCase().includes(q) ||
      inventory.item_code?.toLowerCase().includes(q)
    );
  });

  const filteredTracking = (tracking || []).filter((row) => {
    const q = trackSearch.toLowerCase();
    return (
      row.item_name?.toLowerCase().includes(q) ||
      row.item_code?.toLowerCase().includes(q)
    );
  });

  const openModal = (inventory) => {
    setFormData(inventory);
    setModalVisible(true);
  };

  return (
    <div className="p-2">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <h5 className="mb-0">Faulty Inventory</h5>
        <div className="d-flex gap-2 flex-wrap">
          <Link
            className="btn btn-sm btn-outline-secondary"
            to={`/${adminroute}/inventory-hub`}
          >
            Inventory Hub
          </Link>
          <Link
            className="btn btn-sm btn-outline-info"
            to={`/${adminroute}/faulty-return-rework`}
          >
            Return to Factory
          </Link>
          <Link
            className="btn btn-sm btn-primary"
            to={`/${adminroute}/faulty-return-rework/create`}
          >
            New Return
          </Link>
        </div>
      </div>

      <CNav variant="tabs" className="mb-3">
        <CNavItem>
          <CNavLink
            active={activeTab === "faulty"}
            style={{ cursor: "pointer" }}
            onClick={() => setActiveTab("faulty")}
          >
            Faulty Stock
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            active={activeTab === "tracking"}
            style={{ cursor: "pointer" }}
            onClick={() => setActiveTab("tracking")}
          >
            Item Tracking
          </CNavLink>
        </CNavItem>
      </CNav>

      {activeTab === "faulty" && (
        <>
          <CRow className="mb-3 justify-content-between align-items-center">
            <CCol md={4}>
              <SiteSelect value={siteId} onChange={setSiteId} />
            </CCol>
            <CCol md={4}>
              <CFormInput
                type="text"
                size="sm"
                placeholder="Search site, item name, or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </CCol>
          </CRow>

          {loadingInventories ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="text-danger">{error}</div>
          ) : (
            <CTable bordered hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>Site</CTableHeaderCell>
                  <CTableHeaderCell>Item</CTableHeaderCell>
                  <CTableHeaderCell>Code</CTableHeaderCell>
                  <CTableHeaderCell>Qty</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredInventories.length ? (
                  filteredInventories.map((inv, idx) => (
                    <CTableRow key={inv._id}>
                      <CTableDataCell>{idx + 1}</CTableDataCell>
                      <CTableDataCell>{inv.site_id}</CTableDataCell>
                      <CTableDataCell>{inv.item_name}</CTableDataCell>
                      <CTableDataCell>{inv.item_code}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="danger">{inv.quantity}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="secondary"
                          size="sm"
                          variant="outline"
                          onClick={() => openModal(inv)}
                        >
                          View
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={6} className="text-center">
                      No faulty inventory found.
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          )}
        </>
      )}

      {activeTab === "tracking" && (
        <>
          <CRow className="mb-3 justify-content-between align-items-center">
            <CCol md={4}>
              <SiteSelect value={siteId} onChange={setSiteId} />
            </CCol>
            <CCol md={4}>
              <CFormInput
                type="text"
                size="sm"
                placeholder="Search item name or code..."
                value={trackSearch}
                onChange={(e) => setTrackSearch(e.target.value)}
              />
            </CCol>
          </CRow>
          <p className="small text-medium-emphasis mb-2">
            Per-item counts: inward (lifetime estimate) · on site (good) ·
            consumed (tickets) · faulty (at site) · returned (to factory).
          </p>
          {loadingTracking ? (
            <LoadingSpinner />
          ) : (
            <CTable bordered hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>Item</CTableHeaderCell>
                  <CTableHeaderCell>Code</CTableHeaderCell>
                  <CTableHeaderCell>Inward</CTableHeaderCell>
                  <CTableHeaderCell>On Site</CTableHeaderCell>
                  <CTableHeaderCell>Consumed</CTableHeaderCell>
                  <CTableHeaderCell>Faulty</CTableHeaderCell>
                  <CTableHeaderCell>Returned</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredTracking.length ? (
                  filteredTracking.map((row, idx) => (
                    <CTableRow key={row.item_id}>
                      <CTableDataCell>{idx + 1}</CTableDataCell>
                      <CTableDataCell>{row.item_name}</CTableDataCell>
                      <CTableDataCell>{row.item_code}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="info">{row.inward}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="success">{row.on_site}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="warning">{row.consumed}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="danger">{row.faulty}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="secondary">{row.returned}</CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={8} className="text-center">
                      No tracking data.
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          )}
        </>
      )}

      <CModal
        size="lg"
        scrollable
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>
            Faulty Item — {formData.item_name}{" "}
            <CBadge color="success">{formData.site_id}</CBadge>
          </CModalTitle>
          <button
            type="button"
            className="border-0 ms-auto py-0 px-1"
            onClick={() => setModalVisible(false)}
            style={{ background: "none" }}
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>
        <CModalBody>
          <CTable bordered>
            <CTableBody>
              <CTableRow>
                <CTableHeaderCell>Item Code</CTableHeaderCell>
                <CTableDataCell>{formData.item_code}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Quantity</CTableHeaderCell>
                <CTableDataCell>{formData.quantity}</CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
          {formData.last_activity?.length > 0 && (
            <LastActivity lastactivity={formData.last_activity} />
          )}
        </CModalBody>
      </CModal>
    </div>
  );
};

export default FaultyInventory;
