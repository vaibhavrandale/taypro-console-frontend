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
  CImage,
} from "@coreui/react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import PaginateInput from "../../../components/PaginateInput";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";
import { Link } from "react-router-dom";
import { role_permissions } from "../../../data";
import toast from "react-hot-toast";
import LoadingImage from "../../../components/LoadingImage";

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
  const [deleting, setDeleting] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [readFilter, setReadFilter] = useState("all"); // all | read | unread
  const [roleFilter, setRoleFilter] = useState("all");
  const [addModal, setAddModal] = useState(false);
  const [adding, setAdding] = useState(false);

  const emptyAddForm = {
    subject: "",
    description: "",
    points: [],
    for_user_roles: [],
    is_active: true,
    is_feedback_required: false,
    users: [],
    images: [],
  };

  const [addForm, setAddForm] = useState(emptyAddForm);
  const fetchNotifications = async () => {
    try {
      dispatch({ type: "FETCH_NOTIFICATION_REQUEST" });

      const res = await axios.post(
        "/api/v1/customnotifications/list",
        { pg: page, limit },
        { headers: { Authorization: `Bearer ${authtoken}` } },
      );

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
        payload: err.response?.data?.message || "Failed to load notifications",
      });
    }
  };
  useEffect(() => {
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
      points: item.points,
      users: item.users,
      images: item.images,
    });
    setEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);

      const res = await axios.put(
        `/api/v1/customnotifications/${selectedItem._id}`,
        editForm,
        { headers: { Authorization: `Bearer ${authtoken}` } },
      );
      let message = res.data.message;

      setEditModal(false);
      setSelectedItem(null);
      toast.success(message);
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

  const handleAddNotification = async () => {
    try {
      setAdding(true);
      const res = await axios.post("/api/v1/customnotifications", addForm, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });
      console.log(res);
      setAddForm(emptyAddForm);
      setAddModal(false);
      dispatch({
        type: "FETCH_NOTIFICATION_SUCCESS",
        payload: {
          data: [res.data.data, ...notifications],
        },
      });
      toast.success("Notification Added Successfully");

      // refresh list
      setPage(1);
    } catch (err) {
      alert(err.response?.data?.message || err.response.data.error);
    }
  };

  const handleDelete = async (id, subject) => {
    try {
      const confirmed = window.confirm(
        `Are you sure you want to delete this notification of subject -${subject}? This action cannot be undone.`,
      );

      if (!confirmed) return;
      setDeleting(true);

      const res = await axios.delete(
        `/api/v1/customnotifications/${id}`,

        { headers: { Authorization: `Bearer ${authtoken}` } },
      );
      let message = res.data.message;

      toast.success(message);
      setDeleting(false);
      fetchNotifications();
    } catch (error) {
      alert(error);
    }
  };
  return (
    <div className="m-3">
      {loading ? (
        <LoadingImage />
      ) : error ? (
        <CBadge color="danger">{error}</CBadge>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="text-light mb-0">Custom Notifications</h5>

            <CButton
              size="sm"
              color="success"
              onClick={() => {
                setAddForm(emptyAddForm);
                setAddModal(true);
              }}
            >
              + Add Notification
            </CButton>
          </div>

          {/* List */}
          <div className=" ">
            {notifications.length > 0 ? (
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
                              <CBadge
                                color="warning"
                                className="border text-muted"
                              >
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
                                },
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

                        <CButton
                          size="sm"
                          color="danger"
                          onClick={() => handleDelete(item._id, item.subject)}
                        >
                          {deleting ? <LoadingSpinner /> : "Delete"}
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
                          <li
                            key={idx}
                            className="mb-1"
                            dangerouslySetInnerHTML={{
                              __html: point,
                            }}
                          ></li>
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
                        <CBadge
                          key={idx}
                          color="secondary"
                          className="me-2 mb-1"
                        >
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
                      Read:{" "}
                      {selectedItem.users.filter((u) => u.read_status).length}
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
                        ),
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
                                  <div className="fw-semibold">
                                    {user.username}
                                  </div>
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
                                  color={
                                    user.read_status ? "success" : "danger"
                                  }
                                >
                                  {user.read_status ? "Read" : "Unread"}
                                </CBadge>

                                {user.read_at && (
                                  <div className="small text-muted mt-1">
                                    {new Date(user.read_at).toLocaleString(
                                      "en-GB",
                                    )}
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
                  {selectedItem.images?.length > 0 && (
                    <div className="mt-3 row g-2 border-bottom">
                      {selectedItem.images.map((img, idx) => (
                        <div key={idx} className="col-4 col-md-3 col-lg-2">
                          <Link to={img} target="blank">
                            <CImage
                              src={img}
                              alt="notification-img"
                              className="border rounded thumbnail-img"
                              style={{
                                width: "100%",
                                height: "100px", // perfect thumbnail height
                                objectFit: "cover", // makes it thumbnail-style
                              }}
                            />
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}

                  <hr className="border-secondary" />

                  {/* TIMESTAMPS */}
                  <div className="small text-muted">
                    <div>
                      <strong>Created At:</strong>{" "}
                      {new Date(selectedItem.createdAt).toLocaleString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        },
                      )}
                    </div>
                    <div>
                      <strong>Last Updated:</strong>{" "}
                      {new Date(selectedItem.updatedAt).toLocaleString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        },
                      )}
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

          <CModal
            scrollable
            visible={editModal}
            onClose={() => setEditModal(false)}
            size="xl"
            backdrop="static"
          >
            <CModalHeader className="bg-dark text-light" closeButton={false}>
              <strong>Edit Notification</strong>
              <button
                type="button"
                className="border-0 ms-auto py-0 px-1"
                onClick={() => setEditModal(false)}
                style={{ background: "none" }}
              >
                <CIcon icon={cilX} size="lg" />
              </button>
            </CModalHeader>

            <CModalBody className="bg-dark text-light">
              {/* Subject */}
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

              {/* Description */}
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

              <hr className="border-secondary" />
              <div className="mb-3">
                <div className="d-flex align-items-center justify-content-between my-2">
                  <label className="form-label">Points</label>
                  <CButton
                    color="success"
                    size="sm"
                    onClick={() =>
                      setEditForm({
                        ...editForm,
                        points: [...(editForm.points || []), ""],
                      })
                    }
                  >
                    Add Point
                  </CButton>
                </div>
                {editForm.points?.length > 0 ? (
                  editForm.points?.map((point, index) => (
                    <div
                      key={index}
                      className="d-flex align-items-center gap-2 mb-2"
                    >
                      <input
                        className="form-control bg-dark text-light border"
                        value={point}
                        onChange={(e) => {
                          const updated = [...editForm.points];
                          updated[index] = e.target.value;
                          setEditForm({ ...editForm, points: updated });
                        }}
                      />
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => {
                          const updated = editForm.points.filter(
                            (_, i) => i !== index,
                          );
                          setEditForm({ ...editForm, points: updated });
                        }}
                      >
                        Remove
                      </CButton>
                    </div>
                  ))
                ) : (
                  <div>No Points FOund</div>
                )}
              </div>
              <hr className="border-secondary" />
              {/* User Roles */}
              <div className="mb-3">
                <label className="form-label">Visible For Roles</label>
                <div className="d-flex  flex-wrap">
                  {role_permissions.map((item) => {
                    const roleName = item.role;

                    return (
                      <div className="my-2 form-check" key={roleName}>
                        <input
                          type="checkbox"
                          className=" form-check-input"
                          checked={
                            editForm.for_user_roles?.includes(roleName) || false
                          }
                          onChange={(e) => {
                            const updatedRoles = e.target.checked
                              ? [...(editForm.for_user_roles || []), roleName]
                              : editForm.for_user_roles.filter(
                                  (r) => r !== roleName,
                                );

                            setEditForm({
                              ...editForm,
                              for_user_roles: updatedRoles,
                            });
                          }}
                        />
                        <label className="mx-2 form-check-label">
                          {roleName}
                        </label>
                      </div>
                    );
                  })}
                </div>{" "}
              </div>
              <hr className="border-secondary" />
              {/* Flags */}
              <div className="d-flex gap-4 mb-4">
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
              <hr className="border-secondary" />
              {/* Users Read & Feedback */}
              <label className="form-label">Users</label>
              <div className="mb-3 d-flex justify-content-start align-items-center flex-wrap">
                {editForm.users?.map((user, index) => (
                  <div
                    key={user._id}
                    className="border rounded p-2  m-1"
                    style={{ width: "260px" }}
                  >
                    <strong>{user.username}</strong>
                    <br />
                    <span style={{ fontSize: "13px" }}>({user.email})</span>
                    <div className="form-check mt-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={user.read_status}
                        onChange={(e) => {
                          const users = [...editForm.users];
                          users[index].read_status = e.target.checked;
                          setEditForm({ ...editForm, users });
                        }}
                      />
                      <label className="form-check-label ms-2">Read</label>
                    </div>

                    <textarea
                      className="form-control bg-dark text-light border mt-2"
                      placeholder="Feedback"
                      value={user.feedback || ""}
                      onChange={(e) => {
                        const users = [...editForm.users];
                        users[index].feedback = e.target.value;
                        setEditForm({ ...editForm, users });
                      }}
                    />
                  </div>
                ))}
              </div>
              <hr className="border-secondary" />
              {/* Images */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center my-2">
                  <label className="form-label">Images (URLs)</label>
                  <CButton
                    color="success"
                    size="sm"
                    onClick={() =>
                      setEditForm({
                        ...editForm,
                        images: [...(editForm.images || []), ""],
                      })
                    }
                  >
                    Add Image
                  </CButton>
                </div>

                {editForm.images?.map((img, index) => (
                  <div
                    key={index}
                    className="d-flex align-items-center gap-2 mb-2"
                  >
                    <input
                      className="form-control bg-dark text-light border"
                      value={img}
                      onChange={(e) => {
                        const images = [...editForm.images];
                        images[index] = e.target.value;
                        setEditForm({ ...editForm, images });
                      }}
                    />
                    <CButton
                      color="danger"
                      size="sm"
                      onClick={() => {
                        const images = editForm.images.filter(
                          (_, i) => i !== index,
                        );
                        setEditForm({ ...editForm, images });
                      }}
                    >
                      Remove
                    </CButton>
                  </div>
                ))}
              </div>
            </CModalBody>

            <CModalFooter className="bg-dark">
              <CButton
                size="sm"
                color="secondary"
                onClick={() => setEditModal(false)}
              >
                Cancel
              </CButton>

              <CButton
                size="sm"
                color="warning"
                disabled={updating}
                onClick={handleUpdate}
              >
                {updating ? <CSpinner size="sm" /> : "Update"}
              </CButton>
            </CModalFooter>
          </CModal>

          {/* add notification modal */}
          <CModal
            scrollable
            visible={addModal}
            onClose={() => setAddModal(false)}
            size="xl"
            backdrop="static"
          >
            <CModalHeader className="bg-dark text-light" closeButton={false}>
              <strong>Add Notification</strong>
              <button
                type="button"
                className="border-0 ms-auto py-0 px-1"
                onClick={() => setAddModal(false)}
                style={{ background: "none" }}
              >
                <CIcon icon={cilX} size="lg" />
              </button>
            </CModalHeader>

            <CModalBody className="bg-dark text-light">
              {/* Subject */}
              <div className="mb-3">
                <label className="form-label">Subject</label>
                <input
                  className="form-control bg-dark text-light border"
                  value={addForm.subject}
                  onChange={(e) =>
                    setAddForm({ ...addForm, subject: e.target.value })
                  }
                />
              </div>

              {/* Description */}
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  rows={4}
                  className="form-control bg-dark text-light border"
                  value={addForm.description}
                  onChange={(e) =>
                    setAddForm({ ...addForm, description: e.target.value })
                  }
                />
              </div>

              <hr className="border-secondary" />

              {/* Points */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label">Points</label>
                  <CButton
                    size="sm"
                    color="success"
                    onClick={() =>
                      setAddForm({
                        ...addForm,
                        points: [...addForm.points, ""],
                      })
                    }
                  >
                    Add Point
                  </CButton>
                </div>

                {addForm.points.map((point, index) => (
                  <div
                    key={index}
                    className="d-flex align-items-center gap-2 mb-2"
                  >
                    <input
                      className="form-control bg-dark text-light border"
                      value={point}
                      onChange={(e) => {
                        const points = [...addForm.points];
                        points[index] = e.target.value;
                        setAddForm({ ...addForm, points });
                      }}
                    />
                    <CButton
                      size="sm"
                      color="danger"
                      onClick={() => {
                        const points = addForm.points.filter(
                          (_, i) => i !== index,
                        );
                        setAddForm({ ...addForm, points });
                      }}
                    >
                      Remove
                    </CButton>
                  </div>
                ))}
              </div>

              <hr className="border-secondary" />

              {/* Roles */}
              <div className="mb-3">
                <label className="form-label">Visible For Roles</label>
                <div className="d-flex flex-wrap">
                  {role_permissions.map((item, idx) => {
                    const roleName = item.role;

                    return (
                      <div className="form-check my-1 me-3" key={idx}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={addForm.for_user_roles.includes(roleName)}
                          onChange={(e) => {
                            const roles = e.target.checked
                              ? [...addForm.for_user_roles, roleName]
                              : addForm.for_user_roles.filter(
                                  (r) => r !== roleName,
                                );

                            setAddForm({ ...addForm, for_user_roles: roles });
                          }}
                        />
                        <label className="form-check-label ms-2">
                          {roleName}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              <hr className="border-secondary" />

              {/* Flags */}
              <div className="d-flex gap-4 mb-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={addForm.is_active}
                    onChange={(e) =>
                      setAddForm({ ...addForm, is_active: e.target.checked })
                    }
                  />
                  <label className="form-check-label">Active</label>
                </div>

                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={addForm.is_feedback_required}
                    onChange={(e) =>
                      setAddForm({
                        ...addForm,
                        is_feedback_required: e.target.checked,
                      })
                    }
                  />
                  <label className="form-check-label">Feedback Required</label>
                </div>
              </div>

              <hr className="border-secondary" />

              {/* Images */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label">Images (URLs)</label>
                  <CButton
                    size="sm"
                    color="success"
                    onClick={() =>
                      setAddForm({
                        ...addForm,
                        images: [...addForm.images, ""],
                      })
                    }
                  >
                    Add Image
                  </CButton>
                </div>

                {addForm.images.map((img, index) => (
                  <div
                    key={index}
                    className="d-flex align-items-center gap-2 mb-2"
                  >
                    <input
                      className="form-control bg-dark text-light border"
                      value={img}
                      onChange={(e) => {
                        const images = [...addForm.images];
                        images[index] = e.target.value;
                        setAddForm({ ...addForm, images });
                      }}
                    />
                    <CButton
                      size="sm"
                      color="danger"
                      onClick={() => {
                        const images = addForm.images.filter(
                          (_, i) => i !== index,
                        );
                        setAddForm({ ...addForm, images });
                      }}
                    >
                      Remove
                    </CButton>
                  </div>
                ))}
              </div>
            </CModalBody>

            <CModalFooter className="bg-dark">
              <CButton
                size="sm"
                color="secondary"
                onClick={() => setAddModal(false)}
              >
                Cancel
              </CButton>

              <CButton
                size="sm"
                color="success"
                disabled={adding}
                onClick={handleAddNotification}
              >
                {adding ? <CSpinner size="sm" /> : "Create"}
              </CButton>
            </CModalFooter>
          </CModal>
        </>
      )}
    </div>
  );
}
