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
  useColorModes,
  CDropdownDivider,
  CAvatar,
  CBadge,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilBell, cilContrast, cilMenu, cilMoon, cilSun } from "@coreui/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { AppHeaderDropdown } from "./header/index";
import { AppBreadcrumb } from "./index";
import { useSelector } from "react-redux";
import LoadingSpinner from "./LoadingSpinner";
import toast from "react-hot-toast";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, notifications: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

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
    { loading, error, notifications, loadingUpdate, updateSuccess },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const userInfo = useSelector((state) => state.userInfo);
  const authtoken = useSelector((state) => state.authtoken);
  const [count, setCount] = useState(0);
  const headerRef = useRef();
  const { colorMode, setColorMode } = useColorModes("theme");
  const navigate = useNavigate();

  useEffect(() => {
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
        console.log(error);

        if (error.status === 401) {
          dispatch({
            type: "EMP_SIGNOUT",
          });
          navigate("/login");
        }
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response.message,
        });
      }
    };

    if (!userInfo) return null;
    if (userInfo && updateSuccess) {
      dispatch({ type: "UPDATE_RESET" });
    } else if (
      userInfo.role === "Master Admin" ||
      userInfo.role === "Project Admin" ||
      userInfo.role === "Service Admin" ||
      userInfo.role === "Service User" ||
      userInfo.role === "Project Engineer"
    ) {
      fetchNotifications();
    }
  }, [authtoken, userInfo, updateSuccess, navigate]);

  const notificationPage =
    userInfo.role === "Master Admin"
      ? "/master-admin/notifications"
      : userInfo.role === "Service Admin"
      ? "/service-admin/notifications"
      : userInfo.role === "Project Admin"
      ? "/project-admin/notifications"
      : // : userInfo.role === "Client Admin"
        // ? "/client-admin/notifications"
        // : userInfo.role === "Site Incharge"
        // ? "/client-site-incharge/notifications"
        "/notifications";

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
      console.log(error.response);

      toast.error(error.response.data.error);
      dispatch({
        type: "UPDATE_FAIL",
      });
    }
  };

  let adminroute = "";

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    adminroute = "project-admin";
  }

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
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

        <CHeaderNav className="ms-auto"></CHeaderNav>

        <CHeaderNav className="ms-auto">
          {/* 🌗 Theme Toggle */}
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false} className="align-self-center mt-1">
              {colorMode === "dark" ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === "auto" ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === "light"}
                onClick={() => setColorMode("light")}
                as="button"
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
              <CDropdownItem
                as="button"
                active={colorMode === "dark"}
                onClick={() => setColorMode("dark")}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>

          {[
            "Master Admin",
            "Project Admin",
            "Service Admin",
            "Service User",
            "Project Engineer",
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
                          className="badge bg-danger d-flex justify-content-center align-items-center"
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

                <CDropdownMenu className="p-2" style={{ minWidth: "250px" }}>
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
                            width="50"
                            height="50"
                            style={{ objectFit: "cover", cursor: "pointer" }}
                          />
                          <div>
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
