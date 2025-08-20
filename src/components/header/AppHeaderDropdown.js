import React, { useEffect, useReducer, useState } from "react";
import {
  CDropdown,
  CDropdownDivider,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from "@coreui/react";
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

  // const dispatch = useDispatch(); // ✅ FIXED: Initialize dispatch
  const userInfo = useSelector((state) => state.userInfo);
  const authtoken = useSelector((state) => state.authtoken);

  const [logoutModalOpen, setLogoutModalOpenn] = useState(false);
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
  } else if (userInfo?.role === "Opex Site Technician") {
    adminroute = "opex-site-technician";
  } else if (userInfo?.role === "Opex Client Admin") {
    adminroute = "opex-client-admin";
  }

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

    if (!user?._id) {
      fetchUserDetails();
    }
  }, [authtoken, userInfo, navigate, dispatch, user?._id]);

  const logoutModal = () => {
    setLogoutModalOpenn(!logoutModalOpen);
  };

  const LogoutHandler = () => {
    logoutModal();

    dispatch({ type: "EMP_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("selectedChatId");
    navigate("/login");
    toast.success("Logged out Successfully!");
  };

  const image = user
    ? user?.profile_image
      ? user?.profile_image
      : "https://www.pngitem.com/pimgs/m/146-1462217_profile-icon-png-image-free-download-searchpng-employee.png"
    : "";

  return (
    <>
      <CDropdown variant="nav-item">
        <CDropdownToggle
          placement="bottom-end"
          className="py-0 pe-0"
          caret={false}
        >
          {usersLoading ? (
            <LoadingSpinner />
          ) : (
            <img
              src={image}
              alt="Profile"
              className="rounded-circle fade-in"
              width="50"
              height="50"
              style={{ objectFit: "cover" }}
            />
          )}
        </CDropdownToggle>

        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownItem
            onClick={() => navigate(`/${adminroute}/profile-tab`)}
            className="cursor-pointer"
          >
            <CIcon icon={cilUser} className="me-2 text-info" />
            Profile
            {userError ? userError : ""}
          </CDropdownItem>

          {userInfo.role === "Client Admin" && (
            <CDropdownItem
              onClick={() => navigate(`/${adminroute}/subscriptions`)}
              className="cursor-pointer"
            >
              <CIcon icon={cilMoney} className="me-2 text-success" />
              My Scubsription
            </CDropdownItem>
          )}

          <CDropdownDivider />

          <CDropdownItem onClick={LogoutHandler} as="button">
            <CIcon icon={cilLockLocked} className="me-2 text-danger" />
            Logout
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
    </>
  );
};

export default AppHeaderDropdown;
