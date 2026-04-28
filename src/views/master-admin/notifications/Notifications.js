import React, { useState, useEffect, useReducer } from "react";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormInput,
  CBadge,
  CRow,
  CCol,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPeople, cilX } from "@coreui/icons";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { formatDistanceToNow } from "date-fns";
import PaginateInput from "../../../components/PaginateInput";
import toast from "react-hot-toast";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        notifications: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true, updateError: "" };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false, updateError: "" };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false, updateError: action.payload };

    default:
      return state;
  }
};

const Notifications = () => {
  const [
    {
      loading,
      notifications,
      totalPages,
      hasNextPage,
      hasPrevPage,
      updateError,
      loadingUpdate,
    },
    dispatch,
  ] = useReducer(reducer, {
    notifications: [],
    loading: false,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    loadingUpdate: false,
    updateError: "",
  });
  // const authtoken = useSelector((state) => state.authtoken);

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [readUsers, setReadUsers] = useState([]);
  const [error, setError] = useState(null);
  const [pageInput, setPageInput] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const userInfo = useSelector((state) => state.userInfo);
  let adminroute = "";

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    // eslint-disable-next-line no-unused-vars
    adminroute = "project-admin";
  } else if (userInfo?.role === "Master User") {
    adminroute = "master-user";
  } else if (userInfo?.role === "Service User") {
    adminroute = "service-user";
  } else if (userInfo?.role === "Project User") {
    adminroute = "project-user";
  }
  useEffect(() => {
    const fetchNotifications = async () => {
      let pagination = {
        pg: page,
        limit: limit,
      };

      try {
        dispatch({ type: "FETCH_REQUEST" });
        const result = await axios.post("/api/v1/notifications", pagination, {
          // headers: {
          //   Authorization: `Bearer ${authtoken}`, // Attach Authorization token
          // },
          withCredentials: true,
        });
        let total = Math.ceil(
          Number(result.data.total) / Number(result.data.limit),
        );
        let next = result.data.hasNextPage;
        let prev = result.data.hasPrevPage;
        const data = result.data.data;
        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            data: data,
            totalPages: total,
            hasNextPage: next,
            hasPrevPage: prev,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response.data.error,
        });
        toast.error(error.response ? error.response.data.error : error.message);
      }
    };

    fetchNotifications();
  }, [limit, page]);

  const filteredNotifications = notifications.filter((notification) => {
    const action = notification.action ? notification.action.toLowerCase() : "";
    const details = notification.action
      ? notification.details.toLowerCase()
      : "";
    const module = notification.module ? notification.module.toLowerCase() : "";
    const username = notification.performed_by?.username
      ? notification.performed_by.username.toLowerCase()
      : "";
    const email = notification.performed_by?.email
      ? notification.performed_by.email.toLowerCase()
      : "";

    return (
      action.includes(searchTerm.toLowerCase()) ||
      module.includes(searchTerm.toLowerCase()) ||
      username.includes(searchTerm.toLowerCase()) ||
      details.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase())
    );
  });

  // 📌 Open Read Users Modal
  const handleViewReadUsers = (notification) => {
    setReadUsers(notification.read_status || []);
    setShowModal(true);
  };

  // if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;
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

  const readAllNotifications = async () => {
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      const resposne = await axios.put(
        `/api/v1/notifications/read-allnotifications-by-user`, // API call with notification ID
        {},
        {
          // headers: {
          //   Authorization: `Bearer ${authtoken}`, // Authorization header
          // },
          withCredentials: true,
        },
      );

      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success(resposne.data.message);
    } catch (error) {
      toast.error(error.response.data.error || error.response.data.message);
      dispatch({
        type: "UPDATE_FAIL",
        payload: error.response.data.error || error.response.data.message,
      });
    }
  };

  return (
    <div className="m-2">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>📢 System Notifications</h2>
        <CButton
          color="primary"
          size="sm"
          className="mb-2"
          onClick={readAllNotifications}
          disabled={loadingUpdate}
        >
          {loadingUpdate ? <LoadingSpinner /> : "Mark All as Read"}
        </CButton>
      </div>
      {updateError && (
        <p className="text-danger text-end">
          Error updating notifications: {updateError}
        </p>
      )}
      {/* 🔍 Search Input */}
      <CRow className="justify-content-end">
        <CCol md={4}>
          <CFormInput
            type="text"
            placeholder="Search by Action, Module, User, or Location"
            className="mb-3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
      </CRow>

      {/* 🔔 Notifications Table */}
      <CTable bordered hover responsive className="text-center ">
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>
              <CIcon icon={cilPeople} />
            </CTableHeaderCell>
            <CTableHeaderCell>Performed By</CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell>
            <CTableHeaderCell>Module</CTableHeaderCell>
            <CTableHeaderCell>Details</CTableHeaderCell>
            <CTableHeaderCell>Role</CTableHeaderCell>
            <CTableHeaderCell>Timestamp</CTableHeaderCell>
            <CTableHeaderCell>Read By</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody style={{}}>
          {loading ? (
            <CTableRow>
              <CTableDataCell colSpan="9" className="text-center">
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>
                  <img
                    src={notification.performed_by.profile_image}
                    alt="Profile"
                    className="rounded-circle"
                    width="50"
                    height="50"
                    style={{ objectFit: "cover", cursor: "pointer" }}
                  />
                </CTableDataCell>
                <CTableDataCell>
                  {notification.performed_by.name}
                  <br />
                  <small className="text-muted">
                    {notification.performed_by.email}
                  </small>
                </CTableDataCell>
                <CTableDataCell>{notification.action}</CTableDataCell>
                <CTableDataCell>{notification.module}</CTableDataCell>
                <CTableDataCell>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: notification.details,
                    }}
                  ></span>
                </CTableDataCell>
                <CTableDataCell>
                  {notification.performed_by.role}
                </CTableDataCell>
                <CTableDataCell>
                  {formatDistanceToNow(new Date(notification.timestamp), {
                    addSuffix: true,
                  })}
                  {}
                </CTableDataCell>
                <CTableDataCell>
                  <CButton
                    color="secondary"
                    size="sm"
                    onClick={() => handleViewReadUsers(notification)}
                  >
                    View
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="9" className="text-center text-danger">
                No notifications found.
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
        handlePageInputChange={handlePageInputChange}
        handlePageInputSubmit={handlePageInputSubmit}
        limit={limit}
        handleLimitChange={setLimit} // New prop
      />
      {/* 📌 Read Users Modal */}
      <CModal
        scrollable
        size="lg"
        visible={showModal}
        onClose={() => setShowModal(false)}
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>📖 Read Users</CModalTitle>
          <button
            type="button"
            className=" border-0 ms-auto py-0 px-1"
            onClick={() => setShowModal(false)}
            style={{ background: "none" }}
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>
        <CModalBody>
          {readUsers.length > 0 ? (
            <CTable bordered hover responsive>
              <CTableHead color="secondary">
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>User ID</CTableHeaderCell>
                  <CTableHeaderCell>User Name</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {readUsers.map((user, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{user.readbyId}</CTableDataCell>
                    <CTableDataCell>{user.readByName}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={user.read ? "success" : "danger"}>
                        {user.read ? "Read" : "Unread"}
                      </CBadge>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          ) : (
            <p className="text-center text-muted">No users have read this.</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            size="sm"
            onClick={() => setShowModal(false)}
          >
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default Notifications;
