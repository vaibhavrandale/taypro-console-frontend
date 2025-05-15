import React, { useState } from "react";
import {
  CDropdown,
  CDropdownDivider,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from "@coreui/react";
import { cilLockLocked, cilSettings, cilUser } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const AppHeaderDropdown = () => {
  const dispatch = useDispatch(); // ✅ FIXED: Initialize dispatch
  const userInfo = useSelector((state) => state.userInfo);

  const navigate = useNavigate();
  const [logoutModalOpen, setLogoutModalOpenn] = useState(false);

  const logoutModal = () => {
    setLogoutModalOpenn(!logoutModalOpen);
  };

  const LogoutHandler = () => {
    logoutModal();

    dispatch({ type: "EMP_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("selectedChatId");
    navigate("/login");
    toast.success("Sign out Successfully");
  };

  const image = userInfo
    ? userInfo.profile_image
      ? userInfo.profile_image
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
          <img
            src={image}
            alt="Profile"
            className="rounded-circle"
            width="50"
            height="50"
            style={{ objectFit: "cover" }}
          />
        </CDropdownToggle>

        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownItem href="#">
            <CIcon icon={cilUser} className="me-2" />
            Profile
          </CDropdownItem>
          <CDropdownItem href="#">
            <CIcon icon={cilSettings} className="me-2" />
            Settings
          </CDropdownItem>

          <CDropdownDivider />

          <CDropdownItem
            // onClick={handleLogout}
            onClick={LogoutHandler}
            as="button"
          >
            <CIcon icon={cilLockLocked} className="me-2" />
            Logout
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
    </>
  );
};

export default AppHeaderDropdown;
