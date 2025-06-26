import React, { useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { CBadge, CNavLink, CSidebarNav } from "@coreui/react";
import _nav from "../_nav"; // Import Navigation Data
import { useSelector } from "react-redux";

export const AppSidebarNav = () => {
  const userInfo = useSelector((state) => state.userInfo);
  const headerRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    document.addEventListener("scroll", () => {
      headerRef.current &&
        headerRef.current.classList.toggle(
          "shadow-sm",
          document.documentElement.scrollTop > 0
        );
    });

    if (!userInfo) {
      navigate("/login"); // Redirect to login if user is not found
    }
  }, [navigate, userInfo]);

  if (!userInfo) {
    return null; // Prevent rendering if user isn't loaded
  }

  // 🔍 Filter Navigation Links Based on User Role
  const filteredNav = _nav.filter((navItem) => {
    if (userInfo.role === "Master Admin") {
      // return true; // Show all menu items
      return navItem.name === "Master Admin";
    } else if (userInfo.role === "Project Admin") {
      return navItem.name === "Project Admin"; // Show only Service Admin items
    } else if (userInfo.role === "Service Admin") {
      return navItem.name === "Service Admin"; // Show only Service Admin items
    } else if (userInfo.role === "Service User") {
      return navItem.name === "Service User"; // Show only Service Admin items
    } else if (userInfo.role === "Site Technician") {
      return navItem.name === "Site Technician"; // Show only Service Admin items
    } else if (userInfo.role === "Client Admin") {
      return navItem.name === "Client Admin"; // Show only Client Admin items
    } else if (userInfo.role === "Site Incharge") {
      return navItem.name === "Site Incharge"; // Show only Client Admin items
    } else if (userInfo.role === "Client Site Technician") {
      return navItem.name === "Client Site Technician"; // Show only Client Admin items
    } else if (userInfo.role === "Master User") {
      return navItem.name === "Master User"; // Show only Service Admin items
    } else if (userInfo.role === "Project User") {
      return navItem.name === "Project User"; // Show only Service Admin items
    } else if (userInfo.role === "Service User") {
      return navItem.name === "Service User"; // Show only Service Admin items
    }
    return false;
  });

  const navLink = (name, icon, badge, indent = false) => (
    <>
      {icon
        ? icon
        : indent && (
            <span className="nav-icon">
              <span className="nav-icon-bullet"></span>
            </span>
          )}
      {name && name}
      {badge && (
        <CBadge color={badge.color} className="ms-auto" size="sm">
          {badge.text}
        </CBadge>
      )}
    </>
  );

  const navItem = (item, index, indent = false) => {
    const { component, name, badge, icon, ...rest } = item;
    const Component = component;
    return (
      <Component as="div" key={index}>
        {rest.to || rest.href ? (
          <CNavLink
            {...(rest.to && { as: NavLink })}
            {...(rest.href && { target: "_blank", rel: "noopener noreferrer" })}
            {...rest}
          >
            {navLink(name, icon, badge, indent)}
          </CNavLink>
        ) : (
          navLink(name, icon, badge, indent)
        )}
      </Component>
    );
  };

  const navGroup = (item, index) => {
    const { component, name, icon, items, to, ...rest } = item;
    const Component = component;
    return (
      <Component
        compact
        as="div"
        key={index}
        toggler={navLink(name, icon)}
        {...rest}
      >
        {item.items?.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index, true)
        )}
      </Component>
    );
  };

  return (
    <CSidebarNav as={SimpleBar}>
      {filteredNav.map((item, index) =>
        item.items ? navGroup(item, index) : navItem(item, index)
      )}
    </CSidebarNav>
  );
};

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default AppSidebarNav;
