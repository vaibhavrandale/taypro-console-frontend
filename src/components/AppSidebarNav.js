// import React, { useEffect, useRef } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import PropTypes from "prop-types";
// import SimpleBar from "simplebar-react";
// import "simplebar-react/dist/simplebar.min.css";
// import { CBadge, CNavLink, CSidebarNav } from "@coreui/react";
// import _nav from "../_nav"; // Import Navigation Data
// import { useSelector } from "react-redux";

// export const AppSidebarNav = () => {
//   const userInfo = useSelector((state) => state.userInfo);
//   const headerRef = useRef();
//   const navigate = useNavigate();

//   useEffect(() => {
//     document.addEventListener("scroll", () => {
//       headerRef.current &&
//         headerRef.current.classList.toggle(
//           "shadow-sm",
//           document.documentElement.scrollTop > 0
//         );
//     });

//     if (!userInfo) {
//       navigate("/login"); // Redirect to login if user is not found
//     }
//   }, [navigate, userInfo]);

//   if (!userInfo) {
//     return null; // Prevent rendering if user isn't loaded
//   }

//   // 🔍 Filter Navigation Links Based on User Role
//   const filteredNav = _nav.filter((navItem) => {
//     if (userInfo.role === "Master Admin") {
//       // return true; // Show all menu items
//       return navItem.name === "Master Admin";
//     } else if (userInfo.role === "Project Admin") {
//       return navItem.name === "Project Admin"; // Show only Service Admin items
//     } else if (userInfo.role === "Service Admin") {
//       return navItem.name === "Service Admin"; // Show only Service Admin items
//     } else if (userInfo.role === "Service User") {
//       return navItem.name === "Service User"; // Show only Service Admin items
//     } else if (userInfo.role === "Site Technician") {
//       return navItem.name === "Site Technician"; // Show only Service Admin items
//     } else if (userInfo.role === "Client Admin") {
//       return navItem.name === "Client Admin"; // Show only Client Admin items
//     } else if (userInfo.role === "Site Incharge") {
//       return navItem.name === "Site Incharge"; // Show only Client Admin items
//     } else if (userInfo.role === "Client Site Technician") {
//       return navItem.name === "Client Site Technician"; // Show only Client Admin items
//     } else if (userInfo.role === "Master User") {
//       return navItem.name === "Master User"; // Show only Service Admin items
//     } else if (userInfo.role === "Project User") {
//       return navItem.name === "Project User"; // Show only Service Admin items
//     } else if (userInfo.role === "Service User") {
//       return navItem.name === "Service User"; // Show only Service Admin items
//     }
//     return false;
//   });

//   const navLink = (name, icon, badge, indent = false) => (
//     <>
//       {icon
//         ? icon
//         : indent && (
//             <span className="nav-icon">
//               <span className="nav-icon-bullet"></span>
//             </span>
//           )}
//       {name && name}
//       {badge && (
//         <CBadge color={badge.color} className="ms-auto" size="sm">
//           {badge.text}
//         </CBadge>
//       )}
//     </>
//   );

//   const navItem = (item, index, indent = false) => {
//     const { component, name, badge, icon, ...rest } = item;
//     const Component = component;
//     return (
//       <Component as="div" key={index}>
//         {rest.to || rest.to ? (
//           <CNavLink
//             {...(rest.to && { as: NavLink })}
//             {...(rest.to && { target: "_blank", rel: "noopener noreferrer" })}
//             {...rest}
//           >
//             {navLink(name, icon, badge, indent)}
//           </CNavLink>
//         ) : (
//           navLink(name, icon, badge, indent)
//         )}
//       </Component>
//     );
//   };

//   const navGroup = (item, index) => {
//     const { component, name, icon, items, to, ...rest } = item;
//     const Component = component;
//     return (
//       <Component
//         compact
//         as="div"
//         key={index}
//         toggler={navLink(name, icon)}
//         {...rest}
//       >
//         {item.items?.map((item, index) =>
//           item.items ? navGroup(item, index) : navItem(item, index, true)
//         )}
//       </Component>
//     );
//   };

//   return (
//     <CSidebarNav as={SimpleBar}>
//       {filteredNav.map((item, index) =>
//         item.items ? navGroup(item, index) : navItem(item, index)
//       )}
//     </CSidebarNav>
//   );
// };

// AppSidebarNav.propTypes = {
//   items: PropTypes.arrayOf(PropTypes.any).isRequired,
// };

// export default AppSidebarNav;

import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { CBadge, CNavLink, CSidebarNav, CFormInput } from "@coreui/react";
import _nav from "../_nav";
import { useSelector } from "react-redux";

export const AppSidebarNav = () => {
  const userInfo = useSelector((state) => state.userInfo);
  const headerRef = useRef();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!userInfo) navigate("/login");

    document.addEventListener("scroll", () => {
      headerRef.current?.classList.toggle(
        "shadow-sm",
        document.documentElement.scrollTop > 0
      );
    });
  }, [navigate, userInfo]);

  if (!userInfo) return null;

  // const navLink = (name, icon, badge, indent = false, subscriptionIcon) => (
  //   <>
  //     {icon ||
  //       (indent && (
  //         <span className="nav-icon">
  //           <span
  //             className="nav-icon-bullet"
  //             style={{ color: "rgb(57, 214, 0)" }}
  //           ></span>
  //         </span>
  //       ))}
  //     {name}
  //     <span className="d-flex justify-content-between align-items-center">
  //       <span>
  //         {badge && (
  //           <CBadge color={badge.color} className="ms-auto" size="sm">
  //             {badge.text}
  //           </CBadge>
  //         )}
  //       </span>
  //       <span> {subscriptionIcon && subscriptionIcon}</span>
  //     </span>
  //   </>
  // );

  const navLink = (name, icon, badge, indent = false, subscriptionIcon) => (
    <div className="d-flex justify-content-between align-items-center w-100">
      {/* Left side: icon + name */}
      <div className="d-flex align-items-center">
        {icon ||
          (indent && (
            <span className="nav-icon">
              <span
                className="nav-icon-bullet"
                style={{ color: "rgb(57, 214, 0)" }}
              ></span>
            </span>
          ))}
        <span className="ms-2">{name}</span>
      </div>

      {/* Right side: badge + premium icon */}
      <div className="d-flex align-items-center">
        {badge && (
          <CBadge
            color={badge.color}
            className="ms-2"
            size="sm"
            style={{ fontWeight: 600, fontSize: "0.75rem" }}
          >
            {badge.text}
          </CBadge>
        )}
        {subscriptionIcon && <span className="ms-2">{subscriptionIcon}</span>}
      </div>
    </div>
  );

  const navItem = (item, index, indent = false) => {
    const { component, name, badge, icon, subscriptionIcon, ...rest } = item;
    const Component = component;
    return (
      <Component as="div" key={index}>
        {rest.to || rest.to ? (
          <CNavLink
            {...(rest.to && { as: NavLink })}
            {...(rest.to && { rel: "noopener noreferrer" })}
            {...rest}
          >
            {navLink(name, icon, badge, indent, subscriptionIcon)}
          </CNavLink>
        ) : (
          navLink(name, icon, badge, indent, subscriptionIcon)
        )}
      </Component>
    );
  };

  const navGroup = (item, index) => {
    const { component, name, icon, items, ...rest } = item;
    const Component = component;

    return (
      <Component
        compact
        as="div"
        key={index}
        toggler={navLink(name, icon)}
        {...rest}
      >
        {items?.map((child, childIndex) =>
          child.items
            ? navGroup(child, childIndex)
            : navItem(child, childIndex, true)
        )}
      </Component>
    );
  };

  const getRoleNav = (items, role) =>
    items.find(
      (item) =>
        typeof item.name === "string" &&
        item.name.toLowerCase() === role.toLowerCase()
    );

  const filterSearchItems = (items, searchText) =>
    items
      .filter((item) => {
        const name =
          typeof item.name === "string" ? item.name.toLowerCase() : "";

        const matchesSearch = searchText
          ? name.includes(searchText.toLowerCase())
          : true;

        const filteredChildren = item.items
          ? filterSearchItems(item.items, searchText)
          : [];

        return matchesSearch || filteredChildren.length > 0;
      })
      .map((item) => ({
        ...item,
        items: item.items
          ? filterSearchItems(item.items, searchText)
          : undefined,
      }))
      .sort((a, b) => {
        const nameA = a.name ? a.name.toLowerCase() : "";
        const nameB = b.name ? b.name.toLowerCase() : "";
        return nameA.localeCompare(nameB);
      });
  const roleNav = getRoleNav(_nav, userInfo.role);

  const filteredNav = roleNav
    ? [
        {
          ...roleNav,
          items: roleNav.items
            ? filterSearchItems(roleNav.items, search)
            : undefined,
        },
      ]
    : [];

  return (
    <CSidebarNav as={SimpleBar}>
      <CFormInput
        className="px-3 py-2 my-2 border-0"
        placeholder="Search links..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {/* {filteredNav.map((item, index) =>
        item.items ? navGroup(item, index) : navItem(item, index)
      )} */}
      {filteredNav.flatMap((item) =>
        item.items
          ? item.items.map((child, idx) =>
              child.items ? navGroup(child, idx) : navItem(child, idx)
            )
          : [navItem(item)]
      )}
    </CSidebarNav>
  );
};

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any),
};

export default AppSidebarNav;
