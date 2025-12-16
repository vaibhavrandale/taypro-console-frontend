import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import {
  CCard,
  CCardBody,
  CBadge,
  CSpinner,
  CButton,
  CAlert,
  CModalFooter,
  CModalBody,
  CModalHeader,
  CModal,
} from "@coreui/react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import PaginateInput from "../../../components/PaginateInput";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_NOTIFICATION_REQUEST":
      return { ...state, loading: true, error: "" };

    case "FETCH_NOTIFICATION_SUCCESS":
      return {
        ...state,
        loading: false,
        notifications: action.payload.data,
        totalPages: action.payload.totalPages,
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };

    case "FETCH_NOTIFICATION_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default function CustomNotifications() {
  const [state, dispatch] = useReducer(reducer, {
    notifications: [],
    loading: true,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const {
    notifications,
    loading,
    error,
    totalPages,
    hasNextPage,
    hasPrevPage,
  } = state;
  const authtoken = useSelector((state) => state.authtoken);
  const [pageInput, setPageInput] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [updating, setUpdating] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [readFilter, setReadFilter] = useState("all"); // all | read | unread
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        dispatch({ type: "FETCH_NOTIFICATION_REQUEST" });

        const res = await axios.post(
          "/api/v1/customnotifications/list",
          { pg: page, limit },
          { headers: { Authorization: `Bearer ${authtoken}` } }
        );
        console.log(res.data.data.data);

        dispatch({
          type: "FETCH_NOTIFICATION_SUCCESS",
          payload: {
            data: res.data.data,
            totalPages: Math.ceil(res.data.total / res.data.limit),
            hasNextPage: res.data.hasNextPage,
            hasPrevPage: res.data.hasPrevPage,
          },
        });
      } catch (err) {
        dispatch({
          type: "FETCH_NOTIFICATION_FAIL",
          payload:
            err.response?.data?.message || "Failed to load notifications",
        });
      }
    };

    fetchNotifications();
  }, [authtoken, page, limit]);

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handlePageInputSubmit = () => {
    const pageNumber = parseInt(pageInput);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      handlePageChange(pageNumber);
    }
  };

  const openViewModal = (item) => {
    setSelectedItem(item);
    setViewModal(true);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setEditForm({
      subject: item.subject,
      description: item.description,
      for_user_roles: item.for_user_roles,
      is_active: item.is_active,
      is_feedback_required: item.is_feedback_required,
    });
    setEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);

      await axios.put(
        `/api/v1/customnotifications/${selectedItem._id}`,
        editForm,
        { headers: { Authorization: `Bearer ${authtoken}` } }
      );

      setEditModal(false);
      setSelectedItem(null);

      // Refresh list
      setPage(1);
    } catch (err) {
      alert("Update failed");
    } finally {
      setUpdating(false);
    }
  };
  const filteredUsers = selectedItem?.users
    ?.filter((user) => {
      const matchesSearch =
        user.username?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchText.toLowerCase());

      const matchesRead =
        readFilter === "all"
          ? true
          : readFilter === "read"
          ? user.read_status === true
          : user.read_status === false;

      const matchesRole =
        roleFilter === "all" ? true : user.role === roleFilter;

      return matchesSearch && matchesRead && matchesRole;
    })
    ?.sort((a, b) => a.username.localeCompare(b.username));

  return (
    <div className="m-3">
      <h5 className="mb-3 text-light">Custom Notifications</h5>

      {/* List */}
      <div className=" ">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <CBadge color="danger">{error}</CBadge>
        ) : notifications.length > 0 ? (
          notifications.map((item, index) => {
            const serialNumber = (page - 1) * limit + index + 1;

            const readCount =
              item.users?.filter((u) => u.read_status === true).length || 0;
            const unreadCount =
              item.users?.filter((u) => u.read_status !== true).length || 0;

            return (
              <CCard
                className="mb-3 shadow-sm bg-dark text-light border"
                key={item._id}
              >
                <CCardBody>
                  <div className="d-flex justify-content-between align-items-start">
                    {/* Left section: Avatar + Details */}
                    <div className="d-flex align-items-start gap-3">
                      {/* User Avatar */}
                      <img
                        src={item.posted_by?.profile_image}
                        alt="User"
                        width={50}
                        height={50}
                        className="rounded-circle border"
                        style={{ objectFit: "cover" }}
                      />

                      {/* Text Details */}
                      <div>
                        <h6 className=" mb-1  d-flex align-items-center gap-2">
                          <CBadge color="warning" className="border text-muted">
                            #{serialNumber}
                          </CBadge>
                          {item.subject}
                        </h6>

                        <small className="text-muted d-block">
                          Posted by{" "}
                          <span className="text-light">
                            {item.posted_by?.name}
                          </span>
                        </small>

                        <small className="text-muted">
                          {new Date(item.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: true,
                            }
                          )}
                        </small>
                      </div>
                    </div>

                    {/* Right section: Status Badge */}
                    <CBadge
                      color={item.is_active ? "success" : "secondary"}
                      className="rounded-pill px-3 py-1"
                    >
                      {item.is_active ? "Active" : "Inactive"}
                    </CBadge>
                  </div>

                  <p className="mt-2  small">
                    {item.description.slice(0, 120)}...
                  </p>

                  {/* Meta Row */}
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    <CBadge color="secondary">
                      Roles: {item.for_user_roles.join(", ")}
                    </CBadge>

                    <CBadge
                      color={
                        item.is_feedback_required ? "warning" : "secondary"
                      }
                    >
                      {item.is_feedback_required
                        ? "Feedback Required"
                        : "No Feedback"}
                    </CBadge>

                    <CBadge color="primary">
                      Total Users: {item.users.length}
                    </CBadge>

                    <CBadge color="success">Read: {readCount}</CBadge>

                    <CBadge color="danger">Unread: {unreadCount}</CBadge>
                  </div>
                  <div className="d-flex justify-content-end gap-2 mt-3">
                    <CButton
                      size="sm"
                      color="info"
                      onClick={() => openViewModal(item)}
                    >
                      View
                    </CButton>

                    <CButton
                      size="sm"
                      color="warning"
                      onClick={() => openEditModal(item)}
                    >
                      Edit
                    </CButton>

                    <CButton size="sm" color="danger">
                      Delete
                    </CButton>
                  </div>
                </CCardBody>
              </CCard>
            );
          })
        ) : (
          <CCard className="mb-3 shadow-sm bg-dark text-light border">
            <CCardBody>
              <CAlert color="danger">No Custom Notifications Found</CAlert>
            </CCardBody>
          </CCard>
        )}
      </div>
      <PaginateInput
        page={page}
        totalPages={totalPages}
        hasPrevPage={hasPrevPage}
        hasNextPage={hasNextPage}
        pageInput={pageInput}
        handlePageChange={handlePageChange}
        handlePageInputChange={handlePageInputChange}
        handlePageInputSubmit={handlePageInputSubmit}
        limit={limit}
        handleLimitChange={setLimit} // New prop
      />
      {selectedItem && (
        <CModal
          scrollable
          visible={viewModal}
          onClose={() => setViewModal(false)}
          size="xl"
        >
          <CModalHeader className="" closeButton={false}>
            <h5 className="">{selectedItem.subject}</h5>
            <button
              type="button"
              className="border-0 ms-auto py-0 px-1"
              onClick={() => setViewModal(false)}
              style={{ background: "none" }}
            >
              <CIcon icon={cilX} size="lg" />
            </button>
          </CModalHeader>

          <CModalBody className="bg-dark text-light">
            <>
              {/* DESCRIPTION */}
              <div className="mb-4">
                <h6 className="text-muted">Description</h6>
                <p className="mb-0">{selectedItem.description}</p>
              </div>

              <hr className="border-secondary" />

              {/* POSTED BY */}
              <div className="mb-4">
                <h6 className="text-muted mb-2">Posted By</h6>
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={selectedItem.posted_by?.profile_image}
                    alt="profile"
                    width={50}
                    height={50}
                    className="rounded-circle border"
                    style={{ objectFit: "cover" }}
                  />
                  <div>
                    <div className="fw-semibold">
                      {selectedItem.posted_by?.name}
                    </div>
                    <small className="text-muted">
                      {selectedItem.posted_by?.email}
                    </small>
                    <div>
                      <CBadge color="info" className="mt-1">
                        {selectedItem.posted_by?.role}
                      </CBadge>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-secondary" />

              {/* KEY POINTS */}
              {selectedItem.points?.length > 0 && (
                <div className="mb-4">
                  <h6 className="text-muted mb-2">Key Points</h6>
                  <ul className="ps-3">
                    {selectedItem.points.map((point, idx) => (
                      <li key={idx} className="mb-1">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <hr className="border-secondary" />

              {/* META INFO */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <h6 className="text-muted">Target Roles</h6>
                  {selectedItem.for_user_roles.map((role, idx) => (
                    <CBadge key={idx} color="secondary" className="me-2 mb-1">
                      {role}
                    </CBadge>
                  ))}
                </div>

                <div className="col-md-6">
                  <h6 className="text-muted">Status</h6>
                  <CBadge
                    color={selectedItem.is_active ? "success" : "secondary"}
                  >
                    {selectedItem.is_active ? "Active" : "Inactive"}
                  </CBadge>
                </div>

                <div className="col-md-6">
                  <h6 className="text-muted">Feedback Required</h6>
                  <CBadge
                    color={
                      selectedItem.is_feedback_required
                        ? "warning"
                        : "secondary"
                    }
                  >
                    {selectedItem.is_feedback_required ? "Yes" : "No"}
                  </CBadge>
                </div>

                <div className="col-md-6">
                  <h6 className="text-muted">Users</h6>
                  <CBadge color="primary">
                    Total: {selectedItem.users.length}
                  </CBadge>
                </div>
              </div>

              <hr className="border-secondary" />

              {/* READ / UNREAD SUMMARY */}
              <div className="mb-4">
                <h6 className="text-muted mb-2">User Read Status</h6>
                <CBadge color="success" className="me-2">
                  Read: {selectedItem.users.filter((u) => u.read_status).length}
                </CBadge>
                <CBadge color="danger">
                  Unread:{" "}
                  {selectedItem.users.filter((u) => !u.read_status).length}
                </CBadge>
              </div>

              <hr className="border-secondary" />
              {/* SEARCH & FILTER BAR */}
              <div className="d-flex flex-wrap gap-2 mb-3">
                <input
                  type="text"
                  className="form-control form-control-sm bg-dark text-light border-secondary"
                  placeholder="Search by name or email..."
                  style={{ maxWidth: "250px" }}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />

                <select
                  className="form-select form-select-sm bg-dark text-light border-secondary"
                  style={{ maxWidth: "160px" }}
                  value={readFilter}
                  onChange={(e) => setReadFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="read">Read</option>
                  <option value="unread">Unread</option>
                </select>

                <select
                  className="form-select form-select-sm bg-dark text-light border-secondary"
                  style={{ maxWidth: "180px" }}
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  {[...new Set(selectedItem.users.map((u) => u.role))].map(
                    (role, idx) => (
                      <option key={idx} value={role}>
                        {role}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* USERS LIST */}
              <div className="mb-4">
                <h6 className="text-muted mb-3">User Details</h6>

                <div className="d-flex flex-column gap-3">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, idx) => (
                      <div key={idx} className="p-3 rounded border ">
                        {/* TOP ROW */}
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={user.image}
                              alt={user.username}
                              width={50}
                              height={50}
                              className="rounded-circle border"
                              style={{ objectFit: "cover" }}
                            />

                            <div>
                              <div className="fw-semibold">{user.username}</div>
                              <small className="text-muted d-block">
                                {user.email}
                              </small>

                              <CBadge color="warning" className="mt-1">
                                {user.role}
                              </CBadge>
                            </div>
                          </div>

                          <div className="text-end">
                            <CBadge
                              color={user.read_status ? "success" : "danger"}
                            >
                              {user.read_status ? "Read" : "Unread"}
                            </CBadge>

                            {user.read_at && (
                              <div className="small text-muted mt-1">
                                {new Date(user.read_at).toLocaleString("en-GB")}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* FEEDBACK SECTION */}
                        {user.feedback && user.feedback.trim() !== "" && (
                          <>
                            <hr className="border-secondary my-2" />
                            <div className="small">
                              <span className="text-muted fw-semibold">
                                Feedback:
                              </span>
                              <div className="mt-1">{user.feedback}</div>
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-3 rounded border border-secondary text-muted text-center">
                      No users found
                    </div>
                  )}
                </div>
              </div>

              <hr className="border-secondary" />

              {/* TIMESTAMPS */}
              <div className="small text-muted">
                <div>
                  <strong>Created At:</strong>{" "}
                  {new Date(selectedItem.createdAt).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })}
                </div>
                <div>
                  <strong>Last Updated:</strong>{" "}
                  {new Date(selectedItem.updatedAt).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })}
                </div>
              </div>
            </>
          </CModalBody>

          <CModalFooter className="bg-dark">
            <CButton color="secondary" onClick={() => setViewModal(false)}>
              Close
            </CButton>
          </CModalFooter>
        </CModal>
      )}
      <CModal visible={editModal} onClose={() => setEditModal(false)} size="lg">
        <CModalHeader className="bg-dark text-light">
          <strong>Edit Notification</strong>
        </CModalHeader>

        <CModalBody className="bg-dark text-light">
          <div className="mb-3">
            <label className="form-label">Subject</label>
            <input
              className="form-control bg-dark text-light border"
              value={editForm.subject || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, subject: e.target.value })
              }
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              rows={4}
              className="form-control bg-dark text-light border"
              value={editForm.description || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
            />
          </div>

          <div className="d-flex gap-3">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={editForm.is_active}
                onChange={(e) =>
                  setEditForm({ ...editForm, is_active: e.target.checked })
                }
              />
              <label className="form-check-label">Active</label>
            </div>

            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={editForm.is_feedback_required}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    is_feedback_required: e.target.checked,
                  })
                }
              />
              <label className="form-check-label">Feedback Required</label>
            </div>
          </div>
        </CModalBody>

        <CModalFooter className="bg-dark">
          <CButton color="secondary" onClick={() => setEditModal(false)}>
            Cancel
          </CButton>

          <CButton color="warning" disabled={updating} onClick={handleUpdate}>
            {updating ? <CSpinner size="sm" /> : "Update"}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
}
