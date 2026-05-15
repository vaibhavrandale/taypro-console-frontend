import React, { useEffect, useReducer, useState, useRef } from "react";
import { cilLockLocked, cilMoney, cilUser } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import axios from "axios";
import LoadingSpinner from "../LoadingSpinner";
import "./appHeaderDropdown.css";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_USER_REQUEST":
      return { ...state, usersLoading: true };
    case "FETCH_USER_SUCCESS":
      return { ...state, user: action.payload, usersLoading: false };
    case "FETCH_USER_FAIL":
      return { ...state, usersLoading: false, userError: action.payload };
    default:
      return state;
  }
};

const AppHeaderDropdown = () => {
  const [{ user, usersLoading, userError }, dispatch] = useReducer(reducer, {
    usersLoading: true,
    userError: "",
    user: {},
  });

  const userInfo = useSelector((state) => state.userInfo);
  // const authtoken = useSelector((state) => state.authtoken);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  let adminroute = "";
  if (userInfo?.role === "Master Admin") adminroute = "master-admin";
  else if (userInfo?.role === "Service Admin") adminroute = "service-admin";
  else if (userInfo?.role === "Project Admin") adminroute = "project-admin";
  else if (userInfo?.role === "Client Admin") adminroute = "client-admin";
  else if (userInfo?.role === "Site Incharge") adminroute = "site-incharge";
  else if (userInfo?.role === "Site Technician") adminroute = "site-technician";
  else if (userInfo?.role === "Client Site Technician")
    adminroute = "client-site-technician";
  else if (userInfo?.role === "Master User") adminroute = "master-user";
  else if (userInfo?.role === "Service User") adminroute = "service-user";
  else if (userInfo?.role === "Project User") adminroute = "project-user";
  else if (userInfo?.role === "Opex Site Technician")
    adminroute = "opex-site-technician";
  else if (userInfo?.role === "Opex Client Admin")
    adminroute = "opex-client-admin";
  else if (userInfo?.role === "Factory Admin") adminroute = "factory-admin";
  else if (userInfo?.role === "Design Admin") adminroute = "design-admin";

  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchUserDetails = async () => {
  //     try {
  //       dispatch({ type: "FETCH_USER_REQUEST" });
  //       const response = await axios.get(`/api/v1/users/${userInfo._id}`, {
  //         // headers: { Authorization: `Bearer ${authtoken}` },
  // withCredentials: (true,
  //       });
  //       dispatch({ type: "FETCH_USER_SUCCESS", payload: response.data.data });
  //     } catch (error) {
  //       if (error?.response?.data?.message === "Session Expired") {
  //         dispatch({ type: "EMP_SIGNOUT" });
  //         localStorage.removeItem("userInfo");
  //         localStorage.removeItem("authtoken");
  //         navigate("/login");
  //       }
  //       dispatch({
  //         type: "FETCH_USER_FAIL",
  //         payload:
  //           error?.response?.data?.message || error?.response?.data?.error,
  //       });
  //     }
  //   };

  //   if (!user?._id) {
  //     fetchUserDetails();
  //   }
  // }, [ userInfo, navigate, user?._id]);

  // Close dropdown on outside click

  useEffect(() => {
    // If Redux already has user info → do NOT fetch
    if (userInfo && userInfo?._id) {
      dispatch({ type: "FETCH_USER_SUCCESS", payload: userInfo });
      return;
    }

    const fetchUserDetails = async () => {
      try {
        dispatch({ type: "FETCH_USER_REQUEST" });

        const response = await axios.get(`/api/v1/users/${userInfo._id}`, {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        });

        dispatch({ type: "FETCH_USER_SUCCESS", payload: response.data.data });
      } catch (error) {
        if (
          error?.response?.data?.message === "Session Expired" ||
          error?.response?.data?.message === "Unauthorized"
        ) {
          localStorage.removeItem("userInfo");
          localStorage.removeItem("authtoken");
          localStorage.removeItem("robots");
          localStorage.removeItem("gateways");
          dispatch({ type: "EMP_SIGNOUT" });

          navigate("/login");
        }

        dispatch({
          type: "FETCH_USER_FAIL",
          payload:
            error?.response?.data?.message || error?.response?.data?.error,
        });
      }
    };

    // Only call if userInfo is missing
    if (!userInfo || !userInfo._id) {
      fetchUserDetails();
    }
  }, [dispatch, navigate, userInfo]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const LogoutHandler = async () => {
    dispatch({ type: "EMP_SIGNOUT" });
    const response = await axios.post(`/api/v1/auth/sign-out`);
    console.log(response.status);
    if (response.status === 200) {
      localStorage.removeItem("userInfo");
      localStorage.removeItem("selectedChatId");
      // localStorage.removeItem("authtoken");
      localStorage.removeItem("robots");
      localStorage.removeItem("gateways");
      navigate("/login");
      toast.success(response.data.message);
    }
  };

  const image =
    user?.profile_image ||
    "https://www.pngitem.com/pimgs/m/146-1462217_profile-icon-png-image-free-download-searchpng-employee.png";

  return (
    <div className="dropdown" ref={dropdownRef}>
      {usersLoading ? (
        <LoadingSpinner />
      ) : (
        <img
          src={image}
          alt="Profile"
          className="profile"
          width="50"
          height="50"
          onClick={() => setIsOpen((prev) => !prev)}
          style={{ cursor: "pointer", objectFit: "cover" }}
        />
      )}

      {isOpen && (
        <div className="dropdown-menu show">
          <div
            className="dropdown-item"
            onClick={() => navigate(`/${adminroute}/profile-tab`)}
          >
            <CIcon icon={cilUser} className="me-2 text-info" />
            Profile {userError || ""}
          </div>

          {userInfo.role === "Client Admin" && (
            <div
              className="dropdown-item"
              onClick={() => navigate(`/${adminroute}/subscriptions`)}
            >
              <CIcon icon={cilMoney} className="me-2 text-success" />
              My Subscription
            </div>
          )}

          <hr className="dropdown-divider" />

          <div className="dropdown-item logout" onClick={LogoutHandler}>
            <CIcon icon={cilLockLocked} className="me-2 text-danger" />
            Logout
          </div>
        </div>
      )}
    </div>
  );
};

export default AppHeaderDropdown;
