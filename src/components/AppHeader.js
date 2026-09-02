import React, { useEffect, useReducer, useRef, useState } from "react";
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  CDropdownDivider,
  CBadge,
  CRow,
  CCol,
  CInputGroup,
  CFormInput,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CImage,
  CModal,
  CForm,
  CFormLabel,
  CFormTextarea,
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilBell, cilMenu, cilSearch, cilX } from "@coreui/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { AppHeaderDropdown } from "./header/index";
import { AppBreadcrumb } from "./index";
import { useSelector } from "react-redux";
import LoadingSpinner from "./LoadingSpinner";
import toast from "react-hot-toast";
import "./AppHeader.css"; // Assuming you have some custom styles
import { BsStar, BsStarFill } from "react-icons/bs";
import TayproLogo from "../assets/brand/logofordarkbg.png"; // Import the image
import { customNotifications } from "../data";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, notifications: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "FETCH_ROBOTS_GATEWAYS_REQUEST":
      return { ...state, robotsGatewayLoading: true };
    case "FETCH_ROBOTS_GATEWAYS_SUCCESS":
      return {
        ...state,
        robots: action.payload.robots,
        gateways: action.payload.gateways,
        robotsGatewayLoading: false,
      };
    case "FETCH_ROBOTS_GATEWAYS_FAIL":
      return {
        ...state,
        robotsGatewayLoading: false,
        robotsGatewayError: action.payload,
      };

    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true, updateSuccess: false };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false, updateSuccess: true };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };

    case "UPDATE_RESET":
      return { ...state, loadingDelete: false, updateSuccess: false };

    case "FETCH_FEEDBACK_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_FEEDBACK_SUCCESS":
      return {
        ...state,
        loading: false,
        latestfeedback: action.payload,
      };
    case "FETCH_FEEDBACK_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "FETCH_TIMER_REQUEST":
      return { ...state, timerLoading: true, timerError: "" };
    case "FETCH_TIMER_SUCCESS":
      return {
        ...state,
        timerLoading: false,
        timernotification: action.payload,
      };
    case "FETCH_TIMER_FAIL":
      return { ...state, timerLoading: false, timerError: action.payload };

    case "FETCH_CUSTOM_NOTIFIATION_REQUEST":
      return {
        ...state,
        customNotificationLoading: true,
        customNotificationError: "",
      };
    case "FETCH_CUSTOM_NOTIFIATION_SUCCESS":
      return {
        ...state,
        customNotificationLoading: false,
        customNotificationData: action.payload,
      };
    case "FETCH_CUSTOM_NOTIFIATION_FAIL":
      return {
        ...state,
        customNotificationLoading: false,
        customNotificationError: action.payload,
      };

    case "SUBMIT_REQUEST":
      return { ...state, submitLoading: true, submiterror: "" };

    case "SUBMIT_SUCCESS":
      return { ...state, submitLoading: false };

    case "SUBMIT_FAIL":
      return { ...state, submitLoading: false, submiterror: action.payload };

    case "UPDATE_TIMER_REQUEST":
      return { ...state, updateLoading: true, updateError: "" };

    case "UPDATE_TIMER_SUCCESS":
      return { ...state, updateLoading: false };

    case "UPDATE_TIMER_FAIL":
      return { ...state, updateLoading: false, updateError: action.payload };

    case "UPDATE_CUSTOM_NOTIFICATION_REQUEST":
      return {
        ...state,
        updatecustomNotificationLoading: true,
        updateCustomNotificationError: "",
      };

    case "UPDATE_CUSTOM_NOTIFICATION_SUCCESS":
      return { ...state, updatecustomNotificationLoading: false };

    case "UPDATE_CUSTOM_NOTIFICATION_FAIL":
      return {
        ...state,
        updatecustomNotificationLoading: false,
        updateCustomNotificationError: action.payload,
      };

    default:
      return state;
  }
};

const AppHeader = ({ sidebarShow, setSidebarShow }) => {
  const [
    {
      loading,
      error,
      notifications,
      loadingUpdate,
      robots,
      gateways,
      robotsGatewayLoading,
      robotsGatewayError,
      latestfeedback,
      submitLoading,
      submiterror,
      timerError,
      timernotification,
      timerLoading,
      updateError,
      updateLoading,
      customNotificationData,
      customNotificationError,
      customNotificationLoading,
      updatecustomNotificationLoading,
      updateCustomNotificationError,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: false,
    error: "",
    notifications: [],
    latestfeedback: null,
    updateLoading: false,
    timerLoading: false,
    submitLoading: false,
    robotsGatewayLoading: false,
    timernotification: [],
    submiterror: "",
    updateError: "",
    timerError: "",
    customNotificationData: {},
    customNotificationError: "",
    customNotificationLoading: false,
    updatecustomNotificationLoading: false,
    updateCustomNotificationError: "",
  });
  const notificationsFetched = useRef(false);
  const robotsGatewaysFetched = useRef(false); // New ref for robots/gateways
  // const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  const [count, setCount] = useState(0);
  const headerRef = useRef();
  const [searchButtonOpen, setSearchButtonOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState({
    robots: [],
    gateways: [],
  });

  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const [feedbackModal, setFeedbackModal] = useState(true);
  const [timerModal, setTimerModal] = useState(false);
  const [customNotificationModal, setCustomNotificationModal] = useState(false);
  const [customNotificationFeedback, setCustomNotificationFeedback] =
    useState("");

  const [formData, setFormData] = useState({
    feedback_data: {
      comments: "",
      rating: "",
    },
    technician_feedback_data: {
      is_technician_assigned:
        latestfeedback?.technician_feedback_data?.is_technician_assigned,
      comments: "",
      rating: "",
    },
    service_feedback_data: {
      comments: "",
      rating: "",
    },
  });

  useEffect(() => {
    if (!userInfo) {
      navigate("/login"); // Redirect if user is not found
    }

    const fetchTimerData = async () => {
      try {
        dispatch({ type: "FETCH_TIMER_REQUEST" });

        const result = await axios.get(
          `/api/v1/timerexecutionnotifications/get-by-userId/${userInfo._id}`,
          {
            // headers: { Authorization: `Bearer ${authtoken}` },
            withCredentials: true,
          },
        );
        // console.log(result.data.data);

        dispatch({
          type: "FETCH_TIMER_SUCCESS",
          payload: result.data.data,
        });
        // if (result.data.data.read_status === false) {
        if (result.data.data.length > 0) {
          setTimerModal(true); // Hide the modal
        } else {
          setTimerModal(false); // Hide the modal
        }
      } catch (error) {
        if (
          error.response?.data.error ===
          "Timer Execution Notifications Not Found"
        ) {
          setTimerModal(false); // Hide the modal if no notifications
        }

        if (
          error?.response?.data?.message === "Session Expired" ||
          error?.response?.data?.message === "Unauthorized"
        ) {
          dispatch({ type: "EMP_SIGNOUT" });
          localStorage.removeItem("userInfo");
          localStorage.removeItem("authtoken");
          navigate("/login");
        }

        dispatch({
          type: "FETCH_TIMER_FAIL",
          payload: error.response?.data.error || error.response?.data.message,
        });
      }
    };

    if (userInfo?.role === "Client Admin") {
      const fetchfeedback = async () => {
        try {
          dispatch({ type: "FETCH_FEEDBACK_REQUEST" });

          const result = await axios.get(
            `/api/v1/customer-feedback/get-customer-feedback-by-user-latest/${userInfo._id}`,
            {
              // headers: { Authorization: `Bearer ${authtoken}` },
              withCredentials: true,
            },
          );

          dispatch({
            type: "FETCH_FEEDBACK_SUCCESS",
            payload: result.data.data,
          });
          if (result.data.data.status === true) {
            setFeedbackModal(false); // Hide the modal
          } else {
            setFeedbackModal(true); // Hide the modal
          }
        } catch (error) {
          dispatch({
            type: "FETCH_FEEDBACK_FAIL",
            payload: error.response?.data.error || error.response?.data.message,
          });
        }
      };
      fetchfeedback();
    }

    const fetchRobotsAndGateways = async () => {
      try {
        dispatch({ type: "FETCH_ROBOTS_GATEWAYS_REQUEST" });
        const response = await axios.get(
          `/api/v1/robots/get-gateways-and-robots`,
          {
            // headers: { Authorization: `Bearer ${authtoken}` },
            withCredentials: true,
          },
        );
        // console.log(response.data.robots);
        // console.log(response.data.gateways);

        // let result = response;
        dispatch({
          type: "FETCH_ROBOTS_GATEWAYS_SUCCESS",
          payload: {
            robots: response.data.robots,
            gateways: response.data.gateways,
          },
        });
        localStorage.setItem("robots", JSON.stringify(response.data.robots));
        localStorage.setItem(
          "gateways",
          JSON.stringify(response.data.gateways),
        );
      } catch (error) {
        dispatch({
          type: "FETCH_ROBOTS_GATEWAYS_FAIL",
          payload:
            error?.response?.data?.message || error?.response?.data?.error,
        });
      }
    };

    const fetchNotifications = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const response = await axios.get(
          "/api/v1/notifications/get-ten-notifications",
          {
            // headers: { Authorization: `Bearer ${authtoken}` },
            withCredentials: true,
          },
        );

        let result = response.data.data;
        setCount(response.data.unread_count);
        dispatch({ type: "FETCH_SUCCESS", payload: result });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response.data.message || error.response.data.error,
        });
      }
    };

    const fetchCustomNotifications = async () => {
      try {
        dispatch({ type: "FETCH_CUSTOM_NOTIFIATION_REQUEST" });
        const response = await axios.get(
          "/api/v1/customnotifications/active/latest/unread",
          {
            // headers: { Authorization: `Bearer ${authtoken}` },
            withCredentials: true,
          },
        );

        dispatch({
          type: "FETCH_CUSTOM_NOTIFIATION_SUCCESS",
          payload: response.data.data,
        });
        if (response.data.data) setCustomNotificationModal(true);
      } catch (error) {
        dispatch({
          type: "FETCH_CUSTOM_NOTIFIATION_FAIL",
          payload: error.response.data.message || error.response.data.error,
        });
      }
    };

    const allowedRoles = [
      "Master Admin",
      "Master User",
      "Project Admin",
      "Service Admin",
      "Service User",
      "Project User",
    ];

    if (
      !notificationsFetched.current &&
      userInfo?.role &&
      allowedRoles.includes(userInfo.role)
    ) {
      fetchNotifications();
      notificationsFetched.current = true;
    }
    const cachedRobots = localStorage.getItem("robots");
    const cachedGateways = localStorage.getItem("gateways");

    if (
      !robotsGatewaysFetched.current &&
      !userInfo?.role.includes(["Opex Client Admin", "Opex Site Technician"])
    ) {
      if (cachedRobots && cachedGateways) {
        // Load from cache
        dispatch({
          type: "FETCH_ROBOTS_GATEWAYS_SUCCESS",
          payload: {
            robots: JSON.parse(cachedRobots),
            gateways: JSON.parse(cachedGateways),
          },
        });
      } else {
        // Fetch fresh
        fetchRobotsAndGateways();
      }

      fetchTimerData();
      fetchCustomNotifications();
      robotsGatewaysFetched.current = true;
    }
  }, [userInfo, navigate]);

  if (!userInfo) return null;
  const notificationPage =
    userInfo?.role === "Master Admin"
      ? "/master-admin/notifications"
      : userInfo?.role === "Service Admin"
        ? "/service-admin/notifications"
        : userInfo?.role === "Project Admin"
          ? "/project-admin/notifications"
          : userInfo?.role === "Master User"
            ? "/master-user/notifications"
            : userInfo?.role === "Service User"
              ? "/service-user/notifications"
              : userInfo?.role === "Project User"
                ? "/project-user/notifications"
                : "/notifications";

  const filteredNotifications = notifications
    ? notifications.filter((notification) => {
        switch (userInfo.role) {
          case "Master Admin":
            return true;
          case "Client Admin":
            return notification.clientadmin;
          case "Project Admin":
            return notification.projectadmin;
          case "Service Admin":
            return notification.serviceadmin;
          case "Master User":
            return notification.masteruser;
          case "Project User":
            return notification.projectuser;
          case "Service User":
            return notification.serviceuser;
          default:
            return false;
        }
      })
    : [];

  const latestNotifications = [...filteredNotifications]
    .filter(
      (notification) =>
        !notification.read_status.some(
          (status) => status.readbyId === userInfo._id && status.read,
        ),
    )
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);

  const unreadNotifications = notifications
    ? notifications.filter(
        (notification) =>
          !notification.read_status.some(
            (status) => status.readbyId === userInfo._id && status.read,
          ),
      )
    : [];
  const readNotification = async (notify) => {
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `/api/v1/notifications/notification-readby-user/${notify._id}`, // API call with notification ID
        { read: true }, // Sending "read" status in the request body
        {
          // headers: {
          //   Authorization: `Bearer ${authtoken}`, // Authorization header
          // },
          withCredentials: true,
        },
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Notification read");
    } catch (error) {
      toast.error(error.response.data.error);
      dispatch({
        type: "UPDATE_FAIL",
      });
    }
  };

  let adminroute = "";

  if (userInfo?.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo?.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo?.role === "Project Admin") {
    adminroute = "project-admin";
  } else if (userInfo?.role === "Client Admin") {
    adminroute = "client-admin";
  } else if (userInfo?.role === "Site Incharge") {
    adminroute = "site-incharge";
  } else if (userInfo?.role === "Site Technician") {
    adminroute = "site-technician";
  } else if (userInfo?.role === "Client Site Technician") {
    adminroute = "client-site-technician";
  } else if (userInfo?.role === "Master User") {
    adminroute = "master-user";
  } else if (userInfo?.role === "Service User") {
    adminroute = "service-user";
  } else if (userInfo?.role === "Project User") {
    adminroute = "project-user";
  } else if (userInfo?.role === "Factory Admin") {
    adminroute = "factory-admin";
  }

  //  "Site Incharge",
  //       "Site Technician",
  //       "Client Site Technician",

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(true);

    if (value.length > 0) {
      // Filter robots
      const filteredRobots = robots.filter(
        (robot) =>
          robot.robot_no?.toLowerCase().includes(value.toLowerCase()) ||
          robot.lora_no?.toString().includes(value) ||
          robot.deveui?.toLowerCase().includes(value.toLowerCase()),
      );

      // Filter gateways
      const filteredGateways = gateways.filter(
        (gateway) =>
          gateway.gateway_name?.toLowerCase().includes(value.toLowerCase()) ||
          gateway.gateway_id_in_lns_server
            ?.toLowerCase()
            .includes(value.toLowerCase()),
      );

      // Store them separately
      setFilteredData({
        robots: filteredRobots,
        gateways: filteredGateways,
      });
    } else {
      setFilteredData({ robots: [], gateways: [] });
    }
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Accept both (StarRating + textarea)
    const section = e.target.section || e.target.dataset.section;

    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    // Remove focus from the currently focused element
    if (document.activeElement) {
      document.activeElement.blur();
    }

    dispatch({ type: "SUBMIT_REQUEST" });
    try {
      const isTechnicianAssigned = Boolean(
        latestfeedback?.technician_feedback_data?.is_technician_assigned,
      );
      const data = await axios.put(
        `/api/v1/customer-feedback/${latestfeedback._id}`,
        {
          ...formData,
          technician_feedback_data: {
            ...formData.technician_feedback_data,
            is_technician_assigned: isTechnicianAssigned,
          },
        },
        {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        },
      );

      toast.success(data.data.message);
      dispatch({ type: "SUBMIT_SUCCESS" });
      setFeedbackModal(false); // Hide the modal
      setFormData({
        feedback_data: {
          comments: "",
          rating: "",
        },
        technician_feedback_data: {
          is_technician_assigned:
            latestfeedback.technician_feedback_data.is_technician_assigned,
          comments: latestfeedback.technician_feedback_data
            .is_technician_assigned
            ? ""
            : "No Technician Assigned",

          rating: latestfeedback.technician_feedback_data.is_technician_assigned
            ? ""
            : 1,
        },
        service_feedback_data: {
          comments: "",
          rating: "",
        },
      });
    } catch (error) {
      dispatch({
        type: "SUBMIT_FAIL",
        payload: error.response?.data?.message || error.response?.data?.error,
      });
    }
  };

  const handleReadTimerNotification = async () => {
    // Remove focus from the currently focused element
    if (document.activeElement) {
      document.activeElement.blur();
    }

    const allUnreadTmerNotifications = timernotification.map(
      (item) => item._id,
    );
    dispatch({ type: "UPDATE_TIMER_REQUEST" });
    try {
      const data = await axios.put(
        `/api/v1/timerexecutionnotifications/mark-allnotification/as-read`,
        { allUnreadTmerNotifications },
        {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        },
      );

      toast.success(data.data.message);
      dispatch({ type: "UPDATE_TIMER_SUCCESS" });
      setTimerModal(false); // Hide the modal
    } catch (error) {
      dispatch({
        type: "UPDATE_TIMER_FAIL",
        payload: error.response?.data?.message || error.response?.data?.error,
      });
      toast.error(error.response?.data?.message || error.response?.data?.error);
    }
  };

  const StarRating = ({ rating, onChange, section }) => {
    const currentRating = Number(rating) || 0;

    return (
      <div
        className="d-flex gap-2"
        style={{ cursor: "pointer", fontSize: "1.8rem" }}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const FilledStar = star <= currentRating;
          return FilledStar ? (
            <BsStarFill
              size={20}
              key={star}
              color="#ffc107"
              onClick={() =>
                onChange({
                  //  target: { name: "rating", value: star }
                  target: { name: "rating", value: star, section },
                })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  onChange({
                    target: { name: "rating", value: star, section },
                  });
              }}
              role="radio"
              tabIndex={0}
              aria-checked={star === currentRating}
              aria-label={`${star} Star${star > 1 ? "s" : ""}`}
            />
          ) : (
            <BsStar
              size={20}
              key={star}
              color="#e4e5e9"
              onClick={() =>
                onChange({ target: { name: "rating", value: star, section } })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  onChange({
                    target: { name: "rating", value: star, section },
                  });
              }}
              role="radio"
              tabIndex={0}
              aria-checked={star === currentRating}
              aria-label={`${star} Star${star > 1 ? "s" : ""}`}
            />
          );
        })}
      </div>
    );
  };

  const openSearchRobotAndGatewayModal = () => {
    setSearchButtonOpen(true);
  };

  const robotLink = (site_id, block, robot_no) => {
    window.location.href = `/${adminroute}/site-management/block-management/${site_id}/${block}/${robot_no}`;
    setSearchButtonOpen(false);
    setSearchTerm("");
    // to={`/${adminroute}/site-management/block-management/${robot.site_id}/${robot.block}/${robot.robot_no}`}
  };
  const gatewayLink = (gatewayid) => {
    // to={`/${adminroute}/all-site-gateways/view-gateway/${gateway._id}`}
    window.location.href = `/${adminroute}/all-site-gateways/view-gateway/${gatewayid}`;
    setSearchButtonOpen(false);
    setSearchTerm("");
    // to={`/${adminroute}/site-management/block-management/${robot.site_id}/${robot.block}/${robot.robot_no}`}
  };

  const readCustomNotification = async () => {
    dispatch({ type: "UPDATE_CUSTOM_NOTIFICATION_REQUEST" });
    try {
      let feedback;
      if (customNotificationData.is_feedback_required) {
        feedback = customNotificationFeedback;
      } else {
        feedback = "";
      }
      const data = await axios.put(
        `/api/v1/customnotifications/read/${customNotificationData._id}`,
        { feedback },
        {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        },
      );

      toast.success(data.data.message);
      dispatch({ type: "UPDATE_CUSTOM_NOTIFICATION_SUCCESS" });
      setCustomNotificationModal(false); // Hide the modal
    } catch (error) {
      dispatch({
        type: "UPDATE_CUSTOM_NOTIFICATION_FAIL",
        payload: error.response?.data?.message || error.response?.data?.error,
      });
      toast.error(error.response?.data?.message || error.response?.data?.error);
    }
  };

  return (
    <CHeader
      position="sticky"
      className="mb-4 p-0"
      ref={headerRef}
      style={{ background: "#080f25" }}
    >
      <CContainer className="border-bottom px-2" fluid>
        <CHeaderToggler
          onClick={() => setSidebarShow(!sidebarShow)}
          style={{ marginInlineStart: "-14px" }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>

        <CHeaderNav className="d-none d-md-flex">
          <CNavItem>
            <CNavLink>
              Welcome, &nbsp;
              <span className="fw-bold">{userInfo?.username}</span>
            </CNavLink>
          </CNavItem>
        </CHeaderNav>

        <CHeaderNav className="ms-auto"> </CHeaderNav>

        <CHeaderNav className="ms-auto  d-flex align-items-center justify-content-end flex-wrap my-2">
          <CIcon
            icon={cilSearch}
            size="lg"
            onClick={openSearchRobotAndGatewayModal}
            className="cursor-pointer m-1"
          />{" "}
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          {[
            "Master Admin",
            "Project Admin",
            "Service Admin",
            "Service User",
            "Project User",
            "Master User",
            "Site Technician",
          ].includes(userInfo.role) && (
            <>
              <Link
                to={`/${adminroute}/robot-activity`}
                className="text-decoration-none text-body m-1 align-self-center mt-1"
              >
                🤖
              </Link>
              <li className="nav-item py-1">
                <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
              </li>
            </>
          )}
          {[
            "Master Admin",
            "Project Admin",
            "Service Admin",
            "Service User",
            "Project User",
            "Master User",
          ].includes(userInfo.role) && (
            <>
              {" "}
              <CDropdown variant="nav-item" placement="top-end">
                <CDropdownToggle
                  caret={false}
                  className="align-self-center mt-1"
                >
                  <div className="d-flex justify-content-center align-items-center">
                    {loadingUpdate || loading ? (
                      <span className="text-center">
                        <LoadingSpinner />
                      </span>
                    ) : error ? (
                      <span className="text-center text-danger">{error}</span>
                    ) : unreadNotifications.length > 0 ? (
                      <span className="position-relative">
                        <CIcon icon={cilBell} size="xl" />
                        <CBadge
                          className="badge bg-primary d-flex justify-content-center align-items-center"
                          style={{
                            height:
                              unreadNotifications.length > 99 ? "36px" : "22px",
                            width:
                              unreadNotifications.length > 99 ? "35px" : "25px",
                            borderRadius: "50%",
                            fontSize: "12px",
                          }}
                          position="top-end"
                          shape="rounded-pill"
                        >
                          {count}
                        </CBadge>
                      </span>
                    ) : (
                      <span className="position-relative">
                        <CIcon icon={cilBell} size="xl" />
                      </span>
                    )}
                  </div>
                </CDropdownToggle>

                <CDropdownMenu
                  className="p-2 bg-important"
                  style={{ minWidth: "250px" }}
                >
                  <div className="d-flex justify-content-between align-items-center px-3 py-2">
                    <strong>Notifications</strong>
                    <Link to={notificationPage} className=" small">
                      View All
                    </Link>
                  </div>
                  <CDropdownDivider />
                  {loading ? (
                    <span className="text-center">
                      <LoadingSpinner />
                    </span>
                  ) : latestNotifications.length > 0 ? (
                    latestNotifications.map((notification, index) => {
                      const isRead = notification.read_status.some(
                        (status) =>
                          status.readbyId === userInfo._id && status.read,
                      );
                      // Replace Bootstrap color classes with inline styles before injecting
                      const inlineStyled = (html) =>
                        html
                          .replace(
                            /class='text-success'/g,
                            "style='color:#198754'",
                          )
                          .replace(
                            /class='text-danger'/g,
                            "style='color:#dc3545'",
                          )
                          .replace(
                            /class='text-warning'/g,
                            "style='color:#ffc107'",
                          )
                          .replace(
                            /class='text-info'/g,
                            "style='color:#0dcaf0'",
                          )
                          .replace(
                            /class="text-success"/g,
                            "style='color:#198754'",
                          )
                          .replace(
                            /class="text-danger"/g,
                            "style='color:#dc3545'",
                          )
                          .replace(
                            /class="text-warning"/g,
                            "style='color:#ffc107'",
                          )
                          .replace(
                            /class="text-info"/g,
                            "style='color:#0dcaf0'",
                          );

                      const stripHtml = (html) => html.replace(/<[^>]*>/g, "");
                      // In your map:
                      const plainText = stripHtml(notification.details);
                      const displayHtml = inlineStyled(
                        plainText.length > 30
                          ? `${plainText.substring(0, 40)}...`
                          : notification.details, // full HTML with inline colors now
                      );

                      return (
                        <CDropdownItem
                          as="button"
                          key={index}
                          disabled={isRead}
                          className={`d-flex align-items-center py-2 my-1 ${
                            isRead ? "text-muted" : "fw-bold"
                          }`}
                          onClick={() => readNotification(notification)}
                        >
                          <img
                            src={notification.performed_by.profile_image}
                            alt="Profile"
                            className="rounded-circle"
                            width="40"
                            height="40"
                            style={{ objectFit: "cover", cursor: "pointer" }}
                          />
                          <div className="ms-2 flex-grow-1">
                            <strong className="d-block">
                              {notification.action}
                            </strong>
                            <small
                              className="d-block"
                              style={{
                                fontSize: "12px",
                                color: "inherit",
                                opacity: 1,
                              }} // ← override disabled opacity
                              dangerouslySetInnerHTML={{
                                __html: displayHtml,
                              }}
                            >
                              {/* {notificationText} */}
                            </small>
                            <small
                              className="d-block"
                              style={{ fontSize: "12px" }}
                            >
                              {notification.performed_by.name} |{" "}
                              {moment(notification.timestamp).format(
                                "MMM DD, YYYY HH:mm",
                              )}
                            </small>
                          </div>
                        </CDropdownItem>
                      );
                    })
                  ) : (
                    <CDropdownItem disabled className="text-center py-3">
                      No new notifications
                    </CDropdownItem>
                  )}
                </CDropdownMenu>
              </CDropdown>
              <li className="nav-item py-1">
                <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
              </li>
            </>
          )}
          {/* ✅ Always show user dropdown */}
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CContainer className="px-4" fluid>
        <AppBreadcrumb />
      </CContainer>

      {latestfeedback && (
        <CModal
          // className={feedbackModal ? "fade-out" : "fade-in"}
          // size="m"
          backdrop="static"
          scrollable
          alignment="top"
          visible={feedbackModal}
          size="xl"
        >
          {loading ? (
            <div
              className="d-flex justify-content-center align-items-center flex-column"
              style={{ height: "200px", width: "100%" }}
            >
              <CImage
                src={TayproLogo}
                alt="Logo"
                width={200}
                height={100}
                style={{
                  objectFit: "contain",
                  marginBottom: "20px",
                }}
                className="mb-3"
              />
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <CModalHeader
                closeButton={false}
                className="d-flex justify-content-between align-items-center"
              >
                <CModalTitle>
                  Rate Us
                  {latestfeedback.createdAt && (
                    <span className="text-body-secondary fs-6 fw-normal ms-2">
                      ·{" "}
                      {moment(latestfeedback.createdAt).format("MMMM YYYY")}
                    </span>
                  )}
                </CModalTitle>
                <CButton
                  color="success"
                  size="sm"
                  onClick={handleSubmit}
                  disabled={
                    !formData.feedback_data.comments ||
                    !formData.feedback_data.rating ||
                    // !formData.technician_feedback_data.rating ||
                    // !formData.technician_feedback_data.comments ||
                    !formData.service_feedback_data.rating ||
                    !formData.service_feedback_data.comments ||
                    submitLoading
                  }
                >
                  {submitLoading ? (
                    <>
                      Submitting Your Feedback <LoadingSpinner />
                    </>
                  ) : (
                    "Submit"
                  )}
                </CButton>
              </CModalHeader>

              <CModalBody>
                {submiterror && (
                  <div className="alert alert-danger" role="alert">
                    {submiterror}
                  </div>
                )}
                {/* <CForm>
                  <CRow>
                    <CCol md={4}>
                      <CCard
                        className="shadow-lg rounded-0 p-2"
                        style={{
                          color: "#fff",
                          borderRadius: "10px",
                          // border: "1px solid #3a3a3a",
                        }}
                      >
                        <div className="mb-3">
                          <CFormLabel>Rating for Portal</CFormLabel>
                          <StarRating
                            rating={formData.feedback_data.rating}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="mb-3">
                          <CFormLabel htmlFor="comments">
                            Portal Feedback
                          </CFormLabel>
                          <CFormTextarea
                            id="comments"
                            name="comments"
                            style={{}}
                            rows={4}
                            placeholder="Write your portal feedback..."
                            value={formData.feedback_data.comments}
                            onChange={handleChange}
                          />
                        </div>
                      </CCard>
                    </CCol>
                    <CCol md={4}>
                      <div className="mb-3">
                        <CFormLabel>Rating for technician</CFormLabel>
                        <StarRating
                          rating={formData.technician_feedback_data.rating}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <CFormLabel htmlFor="comments">
                          Technician Feedback
                        </CFormLabel>
                        <CFormTextarea
                          id="comments"
                          name="comments"
                          rows={4}
                          placeholder="Write your technician feedback..."
                          value={formData.technician_feedback_data.comments}
                          onChange={handleChange}
                        />
                      </div>
                    </CCol>
                    <CCol md={4}>
                      <div className="mb-3">
                        <CFormLabel>Rating for our overall Service</CFormLabel>
                        <StarRating
                          rating={formData.service_feedback_data.rating}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <CFormLabel htmlFor="comments">
                          Service Feedback
                        </CFormLabel>
                        <CFormTextarea
                          id="comments"
                          name="comments"
                          rows={4}
                          placeholder="Write your service feedback..."
                          value={formData.service_feedback_data.comments}
                          onChange={handleChange}
                        />
                      </div>
                    </CCol>
                  </CRow>
                </CForm> */}
                <CForm>
                  <CRow className="g-4">
                    {/* Portal Feedback */}
                    <CCol md={4}>
                      <CCard
                        className="shadow-sm rounded-3 p-3 border-0"
                        style={{ background: "#f8f9fa" }}
                      >
                        <h6 className="mb-3 text-warning fw-bold">
                          Portal Feedback
                        </h6>

                        <div className="mb-3">
                          <CFormLabel className="fw-semibold">
                            Rating
                          </CFormLabel>
                          <StarRating
                            section="feedback_data"
                            rating={formData.feedback_data.rating}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="mb-3">
                          <CFormLabel
                            htmlFor="portal_comments"
                            className="fw-semibold"
                          >
                            Comments
                          </CFormLabel>
                          <CFormTextarea
                            id="portal_comments"
                            data-section="feedback_data"
                            name="comments"
                            rows={4}
                            placeholder="Share your portal experience..."
                            value={formData.feedback_data.comments}
                            onChange={handleChange}
                          />
                        </div>
                      </CCard>
                    </CCol>

                    {/* Technician Feedback */}
                    {latestfeedback.technician_feedback_data
                      .is_technician_assigned && (
                      <CCol md={4}>
                        <CCard
                          className="shadow-sm rounded-3 p-3 border-0"
                          style={{ background: "#f8f9fa" }}
                        >
                          <h6 className="mb-3 text-success fw-bold">
                            Technician Feedback
                          </h6>

                          <div className="mb-3">
                            <CFormLabel className="fw-semibold">
                              Rating
                            </CFormLabel>
                            <StarRating
                              section="technician_feedback_data"
                              rating={formData.technician_feedback_data.rating}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="mb-3">
                            <CFormLabel
                              htmlFor="tech_comments"
                              className="fw-semibold"
                            >
                              Comments
                            </CFormLabel>
                            <CFormTextarea
                              id="tech_comments"
                              name="comments"
                              rows={4}
                              data-section="technician_feedback_data"
                              placeholder="Share your technician feedback..."
                              value={formData.technician_feedback_data.comments}
                              onChange={handleChange}
                            />
                          </div>
                        </CCard>
                      </CCol>
                    )}

                    {/* Service Feedback */}
                    <CCol md={4}>
                      <CCard
                        className="shadow-sm rounded-3 p-3 border-0"
                        style={{ background: "#f8f9fa" }}
                      >
                        <h6 className="mb-3 text-info fw-bold">
                          Service Feedback
                        </h6>

                        <div className="mb-3">
                          <CFormLabel className="fw-semibold">
                            Rating
                          </CFormLabel>
                          <StarRating
                            section="service_feedback_data"
                            rating={formData.service_feedback_data.rating}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="mb-3">
                          <CFormLabel
                            htmlFor="service_comments"
                            className="fw-semibold"
                          >
                            Comments
                          </CFormLabel>
                          <CFormTextarea
                            id="service_comments"
                            data-section="service_feedback_data"
                            name="comments"
                            rows={4}
                            placeholder="Write about your overall service experience..."
                            value={formData.service_feedback_data.comments}
                            onChange={handleChange}
                          />
                        </div>
                      </CCard>
                    </CCol>
                  </CRow>
                </CForm>
              </CModalBody>
            </>
          )}
        </CModal>
      )}

      {/* {timernotification.length > 0 && (
        <CModal
          backdrop="static"
          scrollable
          alignment="top"
          size="xl"
          visible={timerModal}
        >
          {timerLoading ? (
            <div
              className="d-flex justify-content-center align-items-center flex-column"
              style={{ height: "250px", width: "100%" }}
            >
              <CImage
                src={TayproLogo}
                alt="Logo"
                width={200}
                height={100}
                style={{ objectFit: "contain" }}
                className="mb-3"
              />
              <LoadingSpinner />
            </div>
          ) : (
            <>
           
              <CModalHeader
                closeButton={false}
                className="d-flex justify-content-between align-items-center flex-wrap"
              >
                {" "}
                <CModalTitle>
                  {" "}
                  Cleaning Timer Executed of Below Sites And Blocks{" "}
                </CModalTitle>{" "}
                <CButton
                  color="success"
                  size="sm"
                  onClick={handleReadTimerNotification}
                  disabled={updateError || updateLoading}
                >
                  {" "}
                  {updateLoading ? (
                    <>
                      {" "}
                      Please Wait <LoadingSpinner />{" "}
                    </>
                  ) : (
                    "Mark all as Read"
                  )}{" "}
                </CButton>{" "}
              </CModalHeader>
        
              <CModalBody className="">
                {timerError && (
                  <div className="alert alert-danger" role="alert">
                    {timerError}
                  </div>
                )}

                <CRow>
                  {timernotification.map((item) => (
                    <CCol key={item._id} lg={3} md={4} sm={6} xs={12}>
                      <CCard className="shadow-sm border-0 m-2 card-hover">
                  
                        <CCardHeader className="p-2  border-bottom d-flex justify-content-between align-items-center rounded-top">
                          <CBadge
                            color="success"
                            className="p-2 text-uppercase"
                          >
                            {item.site_id}
                          </CBadge>
                        </CCardHeader>

              
                        <CCardBody className="p-2">
                          {item.block?.length > 0 &&
                            item.block.map((blockItem, index) => (
                              <div
                                key={index}
                                className="d-flex justify-content-between align-items-center rounded p-2 mb-2 flex-wrap"
                              >
                          
                                <CBadge
                                  color="warning"
                                  className="p-2  text-dark"
                                  style={{ fontSize: "11px" }}
                                >
                                  {blockItem}
                                </CBadge>

                          
                                <div
                                  className="text-muted"
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {new Date(item.createdAt).toLocaleString(
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
                                </div>
                              </div>
                            ))}
                        </CCardBody>
                      </CCard>
                    </CCol>
                  ))}
                </CRow>
              </CModalBody>
            </>
          )}
        </CModal>
      )} */}

      {timernotification.length > 0 && (
        <CModal
          backdrop="static"
          alignment="top"
          size="xl"
          visible={timerModal}
          scrollable={!timerLoading} // Disable scroll while loading
        >
          {timerLoading ? (
            // ----------- LOADER -----------
            <div
              className="d-flex justify-content-center align-items-center flex-column"
              style={{
                height: "300px",
                width: "100%",
              }}
            >
              <CImage
                src={TayproLogo}
                alt="Logo"
                width={200}
                height={100}
                className="mb-3"
                style={{ objectFit: "contain" }}
              />
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {/* ----------- HEADER ----------- */}
              <CModalHeader
                closeButton={false}
                className="d-flex justify-content-between align-items-center flex-wrap"
              >
                <CModalTitle>
                  Cleaning Timer Executed for Below Sites & Blocks
                </CModalTitle>

                <CButton
                  color="success"
                  size="sm"
                  onClick={handleReadTimerNotification}
                  disabled={updateError || updateLoading}
                >
                  {updateLoading ? (
                    <>
                      Please Wait <LoadingSpinner />
                    </>
                  ) : (
                    "Mark all as Read"
                  )}
                </CButton>
              </CModalHeader>

              {/* ----------- BODY ----------- */}
              <CModalBody>
                {timerError && (
                  <div className="alert alert-danger" role="alert">
                    {timerError}
                  </div>
                )}

                <CRow>
                  {timernotification.map((item) => (
                    <CCol key={item._id} lg={3} md={4} sm={6} xs={12}>
                      <CCard className="shadow-sm border-0 m-2 card-hover">
                        {/* ---- Card Header ---- */}
                        <CCardHeader className="p-2 border-bottom d-flex justify-content-between align-items-center rounded-top">
                          <CBadge
                            color="success"
                            className="p-2 text-uppercase"
                          >
                            {item.site_id}
                          </CBadge>
                        </CCardHeader>

                        {/* ---- Card Body ---- */}
                        <CCardBody className="p-2">
                          {item.block?.length > 0 &&
                            item.block.map((blockItem, index) => (
                              <div
                                key={index}
                                className="d-flex justify-content-between align-items-center rounded p-2 mb-2 flex-wrap"
                              >
                                {/* Block ID badge */}
                                <CBadge
                                  color="warning"
                                  className="p-2 text-dark"
                                  style={{ fontSize: "11px" }}
                                >
                                  {blockItem}
                                </CBadge>

                                {/* Timestamp */}
                                <div
                                  className="text-muted"
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {new Date(item.createdAt).toLocaleString(
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
                            ))}
                        </CCardBody>
                      </CCard>
                    </CCol>
                  ))}
                </CRow>
              </CModalBody>
            </>
          )}
        </CModal>
      )}

      {customNotificationData && (
        <CModal
          backdrop="static"
          size="xl" // smaller size = better mobile experience
          visible={customNotificationModal}
          scrollable
          className="custom-modal"
        >
          {customNotificationLoading ? (
            // ---------------- LOADER SECTION ----------------
            <div
              className="d-flex justify-content-center align-items-center flex-column p-4"
              style={{ minHeight: "200px", width: "100%" }}
            >
              <CImage
                src={TayproLogo}
                alt="Logo"
                width={150}
                height={60}
                className="mb-3"
                style={{ objectFit: "contain" }}
              />
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {/* ---------------- HEADER ---------------- */}
              <CModalHeader
                closeButton={false}
                className="d-flex justify-content-between align-items-center"
              >
                <CModalTitle className="text-warning fw-bold">
                  New Notification
                </CModalTitle>
              </CModalHeader>

              {/* ---------------- BODY ---------------- */}
              <CModalBody className="p-2 p-md-3">
                {customNotificationError && (
                  <div className="alert alert-danger small">
                    {customNotificationError}
                  </div>
                )}

                {/* <CCard className="shadow-sm border-0 card-hover"> */}
                {/* -------- CARD HEADER -------- */}
                <div className="border-bottom d-flex justify-content-between align-items-center">
                  <div className="me-3 flex-grow-1">
                    <h6 className=" mb-1">{customNotificationData.subject}</h6>
                    <small className="text-muted font-italic">
                      <span>Posted At - </span>
                      {new Date(
                        customNotificationData.createdAt,
                      ).toLocaleString("en-GB")}
                    </small>
                  </div>

                  <div className="text-center">
                    <CImage
                      src={customNotificationData.posted_by?.profile_image}
                      alt="posted-by"
                      width={45}
                      height={45}
                      className="rounded-circle border mb-1"
                      style={{ objectFit: "cover" }}
                    />
                    <p className="text-muted small m-0">
                      {customNotificationData.posted_by?.name}
                    </p>
                  </div>
                </div>

                {/* -------- CARD BODY -------- */}
                {/* <CCardBody className="pt-3"> */}
                {/* Description */}
                <p className="m-2 ">{customNotificationData.description}</p>

                {/* Points */}
                {customNotificationData.points?.length > 0 && (
                  <ul className="">
                    {customNotificationData.points.map((p, i) => (
                      <li
                        key={i}
                        dangerouslySetInnerHTML={{
                          __html: p,
                        }}
                      ></li>
                    ))}
                  </ul>
                )}

                {customNotificationData.link ? (
                  <div className="m-2">
                    <small className="text-muted d-block mb-1">Link</small>
                    <a
                      href={customNotificationData.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-break"
                    >
                      {customNotificationData.link}
                    </a>
                  </div>
                ) : null}

                {/* Images */}
                {customNotificationData.images?.length > 0 && (
                  <div className="mt-3 row g-2 border-bottom">
                    {customNotificationData.images.map((img, idx) => (
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

                {customNotificationData.is_feedback_required && (
                  <div className="my-3 ">
                    <CFormTextarea
                      rows={3}
                      value={customNotificationFeedback}
                      onChange={(e) =>
                        setCustomNotificationFeedback(e.target.value)
                      }
                      label="Feedback*"
                    ></CFormTextarea>
                  </div>
                )}
                {/* </CCardBody> */}
                {/* </CCard> */}
                {/* -------- FOOTER ACTION -------- */}
                <div className="text-end mt-3">
                  <CButton
                    color="success"
                    size="sm"
                    disabled={updatecustomNotificationLoading}
                    onClick={readCustomNotification}
                  >
                    {updatecustomNotificationLoading ? (
                      <>
                        Please Wait <LoadingSpinner />
                      </>
                    ) : (
                      "Mark as Read"
                    )}
                  </CButton>
                </div>
              </CModalBody>
            </>
          )}
        </CModal>
      )}

      {searchButtonOpen && (
        <CModal
          backdrop="static"
          alignment="top"
          visible={searchButtonOpen}
          scrollable
          size="sm"
          className="rounded-0"
          onClose={() => setSearchButtonOpen(false)}
        >
          {/* Header */}
          <CModalHeader
            className="border-0 align-items-center py-2"
            closeButton={false}
          >
            <CModalTitle>
              <h6 className="fw-semibold mb-0">Search Robot And Gateway</h6>
            </CModalTitle>

            <button
              type="button"
              className=" border-0 ms-auto py-0 px-1"
              onClick={() => setSearchButtonOpen(false)}
              style={{ background: "none" }}
            >
              <CIcon icon={cilX} size="lg" />
            </button>
          </CModalHeader>

          {/* Body */}
          <CModalBody
            className="pt-0"
            style={{ minHeight: searchTerm.length > 0 ? "280px" : "0px" }}
          >
            {[
              "Master Admin",
              "Project Admin",
              "Service Admin",
              "Service User",
              "Project User",
              "Master User",
              "Site Technician",
              "Client Admin",
              "Site Incharge",
              "Client Site Technician",
              "Factory Admin",
            ].includes(userInfo.role) && (
              <CRow className="justify-content-center">
                <CCol>
                  <div className="position-relative responsive-search">
                    {robotsGatewayLoading ? (
                      <div className="text-center p-2">
                        <LoadingSpinner />
                      </div>
                    ) : (
                      <CInputGroup>
                        <CFormInput
                          type="text"
                          placeholder="Search Robot/Gateway"
                          value={searchTerm}
                          className="form-control py-2"
                          onChange={handleSearchChange}
                          onFocus={() => setShowDropdown(true)}
                          onBlur={() =>
                            setTimeout(() => setShowDropdown(false), 200)
                          }
                        />
                      </CInputGroup>
                    )}
                  </div>
                </CCol>
              </CRow>
            )}

            {/* Dropdown */}
            {searchTerm && (
              <div
                className="position-absolute mt-2 rounded-2"
                style={{
                  maxHeight: "220px",
                  width: "90%",
                  overflowY: "auto",

                  // backgroundColor: "#101936",
                }}
              >
                {robotsGatewayLoading ? (
                  <div className="text-center p-2">
                    <LoadingSpinner />
                  </div>
                ) : robotsGatewayError ? (
                  <div className="text-center text-danger p-2">
                    {robotsGatewayError}
                  </div>
                ) : filteredData.robots.length === 0 &&
                  filteredData.gateways.length === 0 ? (
                  <div className="text-center p-2">
                    No robots or gateways found
                  </div>
                ) : (
                  <>
                    {filteredData.robots.length > 0 && (
                      <>
                        <div className="px-3 py-2 fw-semibold small">
                          Robots
                        </div>
                        {filteredData.robots.map((robot, index) => (
                          // <Link
                          //   key={`robot-${index}`}
                          //   // to={`/${adminroute}/site-management/block-management/${robot.site_id}/${robot.block}/${robot.robot_no}`}
                          //   onClick={() =>
                          //     robotLink(
                          //       robot.site_id,
                          //       robot.block,
                          //       robot.robot_no,
                          //     )
                          //   }
                          //   className="text-decoration-none text-warning"
                          //   id="robot-no"
                          // >
                          //   <div className="px-2 py-1 fw-bold  d-flex justify-content-start align-items-center ">
                          //     <div className=" ">{robot.robot_no}</div>{" "}
                          //     {/* <small className="ms-2 text-warning">
                          //       [&nbsp;{robot.deveui} - {robot.lora_no}&nbsp;]
                          //     </small> */}
                          //   </div>
                          // </Link>

                          <Link
                            key={`robot-${index}`}
                            onClick={() =>
                              robotLink(
                                robot.site_id,
                                robot.block,
                                robot.robot_no,
                              )
                            }
                            className="text-decoration-none text-warning robot-no-hover"
                          >
                            <div className="px-2 py-1 fw-bold d-flex justify-content-start align-items-center">
                              <div>{robot.robot_no}</div>
                            </div>
                          </Link>
                        ))}
                      </>
                    )}

                    {filteredData.gateways.length > 0 && (
                      <>
                        <div className="px-3 py-2 fw-semibold small">
                          Gateways
                        </div>
                        {filteredData.gateways.map((gateway, index) => (
                          <Link
                            key={`gateway-${index}`}
                            // to={`/${adminroute}/all-site-gateways/view-gateway/${gateway._id}`}
                            onClick={() => gatewayLink(gateway._id)}
                            className="text-decoration-none"
                          >
                            <div className="px-3 py-2">
                              {gateway.gateway_name}
                            </div>
                          </Link>
                        ))}
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </CModalBody>
        </CModal>
      )}
    </CHeader>
  );
};

export default AppHeader;
