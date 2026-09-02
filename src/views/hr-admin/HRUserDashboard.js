import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CBadge,
} from "@coreui/react";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import PaginateInput from "../../components/PaginateInput";
import { departments } from "../../data";
import socket from "../../components/Socket";

const API_BASE = "/api/v1/hr/hr-users";

const emptyForm = {
  name: "",
  email: "",
  employee_id: "",
  rfid_card_id: "",
  rfid_card_id_2: "",
  department: "",
  location: "office",
  phone: "",
  designation: "",
  is_active: true,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_HR_USERS_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_HR_USERS_SUCCESS":
      return {
        ...state,
        loading: false,
        hrUsers: action.payload.data,
        totalPages: action.payload.totalPages,
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_HR_USERS_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const HRUserDashboard = () => {
  const [state, dispatch] = useReducer(reducer, {
    hrUsers: [],
    loading: true,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const { hrUsers, loading, error, totalPages, hasNextPage, hasPrevPage } =
    state;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageInput, setPageInput] = useState("");
  const [searchText, setSearchText] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [fpDevices, setFpDevices] = useState([]);
  const [enrollDeviceId, setEnrollDeviceId] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [lastEnrollId, setLastEnrollId] = useState("");

  const fetchHRUsers = async () => {
    try {
      dispatch({ type: "FETCH_HR_USERS_REQUEST" });

      const payload = {
        pg: page,
        limit,
      };

      if (searchText.trim()) {
        payload.search = searchText.trim();
      }

      if (locationFilter !== "all") {
        payload.location = locationFilter;
      }

      const result = await axios.post(`${API_BASE}/list`, payload, {
        withCredentials: true,
      });

      const total = Math.ceil(
        Number(result.data.total) / Number(result.data.limit),
      );

      dispatch({
        type: "FETCH_HR_USERS_SUCCESS",
        payload: {
          data: result.data.data,
          totalPages: total,
          hasNextPage: result.data.hasNextPage,
          hasPrevPage: result.data.hasPrevPage,
        },
      });
    } catch (err) {
      dispatch({
        type: "FETCH_HR_USERS_FAIL",
        payload:
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to load HR users",
      });
    }
  };

  useEffect(() => {
    fetchHRUsers();
  }, [page, limit, locationFilter]);

  useEffect(() => {
    socket.emit("attendance-join");

    const handleEnroll = (payload) => {
      if (!payload) return;
      if (payload.phase === "started") {
        toast(payload.message || "Place finger on reader (twice)");
        return;
      }
      if (payload.phase === "done" && payload.card_id) {
        const finger = Number(payload.finger) === 2 ? 2 : 1;
        setForm((prev) => ({
          ...prev,
          ...(finger === 2
            ? { rfid_card_id_2: payload.card_id }
            : { rfid_card_id: payload.card_id }),
        }));
        setLastEnrollId(payload.card_id);
        toast.success(
          payload.message || `Finger ${finger}/2 → ${payload.card_id}`,
        );
        setEnrolling(false);
        if (editModal) {
          fetchHRUsers();
        }
        return;
      }
      if (payload.phase === "failed") {
        toast.error(payload.message || "Fingerprint enroll failed");
        setEnrolling(false);
      }
    };

    socket.on("attendance-enroll", handleEnroll);

    return () => {
      socket.off("attendance-enroll", handleEnroll);
    };
  }, [editModal]);

  useEffect(() => {
    const loadDevices = async () => {
      try {
        const res = await axios.post(
          "/api/v1/hr/attendance/devices/list",
          { pg: 1, limit: 100 },
          { withCredentials: true },
        );
        const list = res.data?.data || res.data?.devices || [];
        setFpDevices(Array.isArray(list) ? list : []);
        const online = (Array.isArray(list) ? list : []).find(
          (d) => d.status === "online",
        );
        if (online?.device_id) {
          setEnrollDeviceId((prev) => prev || online.device_id);
        }
      } catch {
        /* ignore — enroll button still usable if admin typed device earlier */
      }
    };
    loadDevices();
  }, []);

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handlePageInputSubmit = () => {
    const pageNumber = parseInt(pageInput, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      handlePageChange(pageNumber);
    }
  };

  const handleFingerprintEnroll = async (finger = 1) => {
    if (!enrollDeviceId) {
      toast.error("Select an online fingerprint device first");
      return;
    }
    try {
      setEnrolling(true);
      const body = { device_id: enrollDeviceId, finger };
      if (selectedItem?._id && editModal) {
        body.hr_user_id = selectedItem._id;
      }
      const res = await axios.post(
        "/api/v1/hr/attendance/fingerprint/enroll",
        body,
        { withCredentials: true },
      );
      toast.success(
        res.data?.message ||
          `Enroll finger ${finger}/2 — place that finger twice on Pi`,
      );
      setTimeout(() => setEnrolling(false), 90000);
    } catch (err) {
      setEnrolling(false);
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to start fingerprint enroll",
      );
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openAddModal = () => {
    setForm(emptyForm);
    setAddModal(true);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setForm({
      name: item.name || "",
      email: item.email || "",
      employee_id: item.employee_id || "",
      rfid_card_id: item.rfid_card_id || "",
      rfid_card_id_2: item.rfid_card_id_2 || "",
      department: item.department || "",
      location: item.location || "office",
      phone: item.phone || "",
      designation: item.designation || "",
      is_active: item.is_active !== false,
    });
    setEditModal(true);
  };

  const openViewModal = (item) => {
    setSelectedItem(item);
    setViewModal(true);
  };

  const handleCreate = async () => {
    try {
      setSubmitting(true);
      const res = await axios.post(API_BASE, form, {
        withCredentials: true,
      });
      toast.success(res.data.message || "HR user registered successfully");
      setAddModal(false);
      setForm(emptyForm);
      setPage(1);
      fetchHRUsers();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to register HR user",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setSubmitting(true);
      const res = await axios.put(`${API_BASE}/${selectedItem._id}`, form, {
        withCredentials: true,
      });
      toast.success(res.data.message || "HR user updated successfully");
      setEditModal(false);
      setSelectedItem(null);
      fetchHRUsers();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to update HR user",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${item.name}? This action cannot be undone.`,
    );
    if (!confirmed) return;

    try {
      const res = await axios.delete(`${API_BASE}/${item._id}`, {
        withCredentials: true,
      });
      toast.success(res.data.message || "HR user deleted successfully");
      fetchHRUsers();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to delete HR user",
      );
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchHRUsers();
  };

  const renderFormFields = () => (
    <CRow className="g-3">
      <CCol md={6}>
        <CFormLabel htmlFor="name">Name</CFormLabel>
        <CFormInput
          id="name"
          name="name"
          value={form.name}
          onChange={handleFormChange}
          placeholder="Enter full name"
          required
        />
      </CCol>
      <CCol md={6}>
        <CFormLabel htmlFor="email">Email</CFormLabel>
        <CFormInput
          id="email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleFormChange}
          placeholder="Enter email"
          required
        />
      </CCol>
      <CCol md={6}>
        <CFormLabel htmlFor="employee_id">Employee ID</CFormLabel>
        <CFormInput
          id="employee_id"
          name="employee_id"
          value={form.employee_id}
          onChange={handleFormChange}
          placeholder="Enter employee ID"
          required
        />
      </CCol>
      <CCol md={6}>
        <CFormLabel htmlFor="rfid_card_id">Fingerprint 1 ID</CFormLabel>
        <CFormInput
          id="rfid_card_id"
          name="rfid_card_id"
          value={form.rfid_card_id}
          onChange={handleFormChange}
          placeholder="FP0001 (from Enroll Finger 1)"
          required
        />
        <CFormLabel htmlFor="rfid_card_id_2" className="mt-2">
          Fingerprint 2 ID (backup)
        </CFormLabel>
        <CFormInput
          id="rfid_card_id_2"
          name="rfid_card_id_2"
          value={form.rfid_card_id_2}
          onChange={handleFormChange}
          placeholder="FP0002 (from Enroll Finger 2)"
        />
        <div className="d-flex gap-2 mt-2 align-items-center flex-wrap">
          <CFormSelect
            value={enrollDeviceId}
            onChange={(e) => setEnrollDeviceId(e.target.value)}
            style={{ maxWidth: 220 }}
          >
            <option value="">Select fingerprint reader</option>
            {fpDevices.map((d) => (
              <option key={d.device_id || d._id} value={d.device_id}>
                {d.name || d.device_id}
                {d.status === "online" ? " (online)" : " (offline)"}
              </option>
            ))}
          </CFormSelect>
          <CButton
            color="success"
            disabled={enrolling || !enrollDeviceId}
            onClick={() => handleFingerprintEnroll(1)}
          >
            {enrolling ? "Enrolling..." : "Enroll Finger 1"}
          </CButton>
          <CButton
            color="success"
            variant="outline"
            disabled={enrolling || !enrollDeviceId}
            onClick={() => handleFingerprintEnroll(2)}
          >
            Enroll Finger 2
          </CButton>
        </div>
        <small className="text-medium-emphasis d-block mt-1">
          Use Enroll on the Pi reader (no RFID card tap). Templates stay on
          the R307; IDs auto-fill here.
        </small>
        {lastEnrollId ? (
          <CBadge color="info" className="mt-2">
            Last enrolled: {lastEnrollId}
          </CBadge>
        ) : null}
      </CCol>
      <CCol md={6}>
        <CFormLabel htmlFor="department">Department</CFormLabel>
        <CFormSelect
          id="department"
          name="department"
          value={form.department}
          onChange={handleFormChange}
          required
        >
          <option value="">Select department</option>
          {departments.map((dept) => (
            <option key={dept.department_id || dept.id} value={dept.department}>
              {dept.department}
            </option>
          ))}
        </CFormSelect>
      </CCol>
      <CCol md={6}>
        <CFormLabel htmlFor="location">Location</CFormLabel>
        <CFormSelect
          id="location"
          name="location"
          value={form.location}
          onChange={handleFormChange}
          required
        >
          <option value="office">Office</option>
          <option value="factory">Factory</option>
          <option value="wfh">WFH</option>
        </CFormSelect>
      </CCol>
      <CCol md={6}>
        <CFormLabel htmlFor="phone">Phone</CFormLabel>
        <CFormInput
          id="phone"
          name="phone"
          value={form.phone}
          onChange={handleFormChange}
          placeholder="Enter phone number"
        />
      </CCol>
      <CCol md={6}>
        <CFormLabel htmlFor="designation">Designation</CFormLabel>
        <CFormInput
          id="designation"
          name="designation"
          value={form.designation}
          onChange={handleFormChange}
          placeholder="Enter designation"
        />
      </CCol>
      <CCol md={12}>
        <CFormCheck
          id="is_active"
          name="is_active"
          label="Active"
          checked={form.is_active}
          onChange={handleFormChange}
        />
      </CCol>
    </CRow>
  );

  return (
    <div className="p-2">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">HR User Registration</h2>
        <CButton color="success" size="sm" onClick={openAddModal}>
          + Register User
        </CButton>
      </div>

      <CCard className="mb-3">
        <CCardBody>
          <CForm onSubmit={handleSearch}>
            <CRow className="g-3 align-items-end">
              <CCol md={4}>
                <CFormLabel htmlFor="search">Search</CFormLabel>
                <CFormInput
                  id="search"
                  placeholder="Search by name, email, employee ID, fingerprint..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="locationFilter">Location</CFormLabel>
                <CFormSelect
                  id="locationFilter"
                  value={locationFilter}
                  onChange={(e) => {
                    setLocationFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="all">All Locations</option>
                  <option value="office">Office</option>
                  <option value="factory">Factory</option>
                  <option value="wfh">WFH</option>
                </CFormSelect>
              </CCol>
              <CCol md={2}>
                <CButton color="primary" type="submit">
                  Search
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>

      <CTable bordered hover responsive className="text-center shadow-sm">
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Name</CTableHeaderCell>
            <CTableHeaderCell>Email</CTableHeaderCell>
            <CTableHeaderCell>Employee ID</CTableHeaderCell>
            <CTableHeaderCell>Finger IDs</CTableHeaderCell>
            <CTableHeaderCell>Department</CTableHeaderCell>
            <CTableHeaderCell>Location</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loading ? (
            <CTableRow>
              <CTableDataCell colSpan={9}>
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : error ? (
            <CTableRow>
              <CTableDataCell colSpan={9} className="fw-bold">
                {error}
              </CTableDataCell>
            </CTableRow>
          ) : hrUsers.length > 0 ? (
            hrUsers.map((item, index) => (
              <CTableRow key={item._id}>
                <CTableDataCell>
                  {(page - 1) * limit + index + 1}
                </CTableDataCell>
                <CTableDataCell>{item.name}</CTableDataCell>
                <CTableDataCell>{item.email}</CTableDataCell>
                <CTableDataCell>{item.employee_id}</CTableDataCell>
                <CTableDataCell>
                  {item.rfid_card_id}
                  {item.rfid_card_id_2 ? ` / ${item.rfid_card_id_2}` : ""}
                </CTableDataCell>
                <CTableDataCell>{item.department}</CTableDataCell>
                <CTableDataCell>
                  <CBadge
                    color={
                      item.location === "office"
                        ? "info"
                        : item.location === "factory"
                          ? "warning"
                          : "success"
                    }
                  >
                    {item.location}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  <CBadge color={item.is_active ? "success" : "secondary"}>
                    {item.is_active ? "Active" : "Inactive"}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  <CButton
                    color="info"
                    size="sm"
                    className="m-1"
                    onClick={() => openViewModal(item)}
                  >
                    View
                  </CButton>
                  <CButton
                    color="warning"
                    size="sm"
                    className="m-1"
                    onClick={() => openEditModal(item)}
                  >
                    Edit
                  </CButton>
                  <CButton
                    color="danger"
                    size="sm"
                    onClick={() => handleDelete(item)}
                  >
                    Delete
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan={9}>No HR users found</CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>

      <PaginateInput
        page={page}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        pageInput={pageInput}
        handlePageInputChange={handlePageInputChange}
        handlePageChange={handlePageChange}
        handlePageInputSubmit={handlePageInputSubmit}
        limit={limit}
        handleLimitChange={setLimit}
      />

      <CModal
        visible={addModal}
        onClose={() => setAddModal(false)}
        size="lg"
        backdrop="static"
      >
        <CModalHeader>
          <CModalTitle>Register HR User</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>{renderFormFields()}</CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setAddModal(false)}>
            Cancel
          </CButton>
          <CButton color="success" onClick={handleCreate} disabled={submitting}>
            {submitting ? "Saving..." : "Register"}
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal
        visible={editModal}
        onClose={() => setEditModal(false)}
        size="lg"
        backdrop="static"
      >
        <CModalHeader>
          <CModalTitle>Edit HR User</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>{renderFormFields()}</CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditModal(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleUpdate} disabled={submitting}>
            {submitting ? "Updating..." : "Update"}
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal
        visible={viewModal}
        onClose={() => setViewModal(false)}
        size="lg"
        backdrop="static"
      >
        <CModalHeader>
          <CModalTitle>HR User Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedItem && (
            <CTable bordered responsive>
              <CTableBody>
                <CTableRow>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableDataCell>{selectedItem.name}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableDataCell>{selectedItem.email}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Employee ID</CTableHeaderCell>
                  <CTableDataCell>{selectedItem.employee_id}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Finger 1</CTableHeaderCell>
                  <CTableDataCell>{selectedItem.rfid_card_id}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Finger 2</CTableHeaderCell>
                  <CTableDataCell>
                    {selectedItem.rfid_card_id_2 || "—"}
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Department</CTableHeaderCell>
                  <CTableDataCell>{selectedItem.department}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Location</CTableHeaderCell>
                  <CTableDataCell>{selectedItem.location}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Phone</CTableHeaderCell>
                  <CTableDataCell>{selectedItem.phone || "-"}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Designation</CTableHeaderCell>
                  <CTableDataCell>
                    {selectedItem.designation || "-"}
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableDataCell>
                    {selectedItem.is_active ? "Active" : "Inactive"}
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Created At</CTableHeaderCell>
                  <CTableDataCell>
                    {new Date(selectedItem.createdAt).toLocaleString()}
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setViewModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default HRUserDashboard;
