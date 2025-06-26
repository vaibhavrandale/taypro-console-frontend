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
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilBell, cilMenu } from "@coreui/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { AppHeaderDropdown } from "./header/index";
import { AppBreadcrumb } from "./index";
import { useSelector } from "react-redux";
import LoadingSpinner from "./LoadingSpinner";
import toast from "react-hot-toast";
import "./AppHeader.css"; // Assuming you have some custom styles

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

    case "FETCH_USER_REQUEST":
      return { ...state, usersLoading: true };
    case "FETCH_USER_SUCCESS":
      return { ...state, users: action.payload, usersLoading: false };
    case "FETCH_USER_FAIL":
      return { ...state, usersLoading: false, userError: action.payload };

    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true, updateSuccess: false };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false, updateSuccess: true };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };

    case "UPDATE_RESET":
      return { ...state, loadingDelete: false, updateSuccess: false };

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
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
    notifications: [],
  });
  const notificationsFetched = useRef(false);
  const robotsGatewaysFetched = useRef(false); // New ref for robots/gateways
  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  const [count, setCount] = useState(0);
  const headerRef = useRef();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState({
    robots: [],
    gateways: [],
  });

  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        dispatch({ type: "FETCH_USER_REQUEST" });
        const response = await axios.get(`/api/v1/users/${userInfo._id}`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });

        let result = response.data.data;
        dispatch({ type: "FETCH_USER_SUCCESS", payload: result });
      } catch (error) {
        if (error?.response?.data?.message === "Session Expired") {
          dispatch({
            type: "EMP_SIGNOUT",
            payload: null,
            token: null,
          });
          localStorage.removeItem("userInfo");
          localStorage.removeItem("authtoken");
          navigate("/login");
        }
        dispatch({
          type: "FETCH_USER_FAIL",
          payload:
            error?.response?.data?.message || error?.response?.data?.error,
        });
      }
    };

    const fetchRobotsAndGateways = async () => {
      try {
        dispatch({ type: "FETCH_ROBOTS_GATEWAYS_REQUEST" });
        const response = await axios.get(
          `/api/v1/robots/get-gateways-and-robots`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
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
            headers: { Authorization: `Bearer ${authtoken}` },
          }
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

    // if (
    //   !notificationsFetched.current &&
    //   userInfo?.role &&
    //   [
    //     "Master Admin",
    //     "Project Admin",
    //     "Service Admin",
    //     "Service User",
    //     "Project User",
    //   ].includes(userInfo.role)
    // ) {
    //   fetchNotifications();
    //   fetchUserDetails();

    //   notificationsFetched.current = true;
    // }
    // fetchRobotsAndGateways();

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
      fetchUserDetails();
      notificationsFetched.current = true;
    }

    if (!robotsGatewaysFetched.current) {
      fetchRobotsAndGateways();
      robotsGatewaysFetched.current = true;
    }
  }, [authtoken, userInfo, navigate]);

  if (!userInfo) return null;
  const notificationPage =
    userInfo?.role === "Master Admin"
      ? "/master-admin/notifications"
      : userInfo?.role === "Service Admin"
      ? "/service-admin/notifications"
      : userInfo?.role === "Project Admin"
      ? "/project-admin/notifications"
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
          (status) => status.readbyId === userInfo._id && status.read
        )
    )
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);

  const unreadNotifications = notifications
    ? notifications.filter(
        (notification) =>
          !notification.read_status.some(
            (status) => status.readbyId === userInfo._id && status.read
          )
      )
    : [];
  const readNotification = async (notify) => {
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `/api/v1/notifications/notification-readby-user/${notify._id}`, // API call with notification ID
        { read: true }, // Sending "read" status in the request body
        {
          headers: {
            Authorization: `Bearer ${authtoken}`, // Authorization header
          },
        }
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
  } else if (userInfo?.role === "Client Technician") {
    adminroute = "client-technician";
  } else if (userInfo?.role === "Master User") {
    adminroute = "master-user";
  } else if (userInfo?.role === "Service User") {
    adminroute = "service-user";
  } else if (userInfo?.role === "Project User") {
    adminroute = "project-user";
  }

  //  "Site Incharge",
  //       "Site Technician",
  //       "Client Technician",

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(true);

    if (value.length > 0) {
      // Filter robots
      const filteredRobots = robots.filter((robot) =>
        robot.robot_no?.toLowerCase().includes(value.toLowerCase())
      );

      // Filter gateways
      const filteredGateways = gateways.filter((gateway) =>
        gateway.gateway_name?.toLowerCase().includes(value.toLowerCase())
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
          <CRow className="">
            <CCol>
              <div className="position-relative responsive-search">
                <CInputGroup>
                  <CFormInput
                    type="text"
                    placeholder="Search Robot/Gateway"
                    value={searchTerm}
                    className="form-control"
                    onChange={handleSearchChange}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // delay to allow link click
                  />
                </CInputGroup>

                {showDropdown && searchTerm && (
                  <div
                    className="position-absolute border rounded shadow-sm mt-1"
                    style={{
                      maxHeight: "200px",
                      width: "210px",
                      overflowY: "auto",
                      zIndex: 10,
                      backgroundColor: "white",
                    }}
                  >
                    {robotsGatewayLoading ? (
                      <div className="text-center text-dark p-2">
                        <LoadingSpinner />
                      </div>
                    ) : robotsGatewayError ? (
                      <div className="text-center text-danger p-2">
                        {robotsGatewayError}
                      </div>
                    ) : filteredData.robots.length === 0 &&
                      filteredData.gateways.length === 0 ? (
                      <div className="text-center text-dark p-2">
                        No robots or gateways found
                      </div>
                    ) : (
                      <>
                        {filteredData.robots.length > 0 && (
                          <>
                            <div className="text-dark px-2  py-1">Robots</div>
                            {filteredData.robots.map((robot, index) => (
                              <Link
                                key={`robot-${index}`}
                                to={`/${adminroute}/site-management/block-management/${robot.site_id}/${robot.block}/${robot.robot_no}`}
                                className="text-decoration-none"
                              >
                                <div className=" px-2 py-1 ">
                                  {robot.robot_no}
                                </div>
                              </Link>
                            ))}
                          </>
                        )}

                        {filteredData.gateways.length > 0 && (
                          <>
                            <div className="text-dark px-2 pt-2">Gateways</div>
                            {filteredData.gateways.map((gateway, index) => (
                              <Link
                                key={`gateway-${index}`}
                                to={`/${adminroute}/all-site-gateways/view-gateway/${gateway._id}`}
                                className="text-decoration-none "
                              >
                                <div className="px-2 py-1  border-bottom">
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
              </div>
            </CCol>
          </CRow>
          <li className="nav-item py-1 mx-2">
            {/* <div className="vr h-100 mx-2 text-body text-opacity-75"></div> */}
          </li>

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
                          status.readbyId === userInfo._id && status.read
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
                            width="45"
                            height="45"
                            style={{ objectFit: "cover", cursor: "pointer" }}
                          />
                          <div className="ms-2 flex-grow-1">
                            <strong className="d-block">
                              {notification.action}
                            </strong>
                            <small className="text-muted d-block">
                              {notification.details.length > 30
                                ? `${notification.details.substring(0, 30)}...`
                                : notification.details}
                            </small>
                            <small
                              className="d-block"
                              style={{ fontSize: "12px" }}
                            >
                              {notification.performed_by.name} |{" "}
                              {moment(notification.timestamp).format(
                                "MMM DD, YYYY HH:mm"
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
    </CHeader>
  );
};

export default AppHeader;
