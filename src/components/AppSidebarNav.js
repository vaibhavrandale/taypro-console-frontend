// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import PropTypes from 'prop-types';

// import SimpleBar from 'simplebar-react';
// import 'simplebar-react/dist/simplebar.min.css';

// import { CBadge, CNavLink, CSidebarNav } from '@coreui/react';

// export const AppSidebarNav = ({ items }) => {
//   const navLink = (name, icon, badge, indent = false) => {
//     return (
//       <>
//         {icon
//           ? icon
//           : indent && (
//               <span className="nav-icon">
//                 <span className="nav-icon-bullet"></span>
//               </span>
//             )}
//         {name && name}
//         {badge && (
//           <CBadge color={badge.color} className="ms-auto" size="sm">
//             {badge.text}
//           </CBadge>
//         )}
//       </>
//     );
//   };

//   const navItem = (item, index, indent = false) => {
//     const { component, name, badge, icon, ...rest } = item;
//     const Component = component;
//     return (
//       <Component as="div" key={index}>
//         {rest.to || rest.href ? (
//           <CNavLink
//             {...(rest.to && { as: NavLink })}
//             {...(rest.href && { target: '_blank', rel: 'noopener noreferrer' })}
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
//       {items &&
//         items.map((item, index) =>
//           item.items ? navGroup(item, index) : navItem(item, index)
//         )}
//     </CSidebarNav>
//   );
// };

// AppSidebarNav.propTypes = {
//   items: PropTypes.arrayOf(PropTypes.any).isRequired,
// };

import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { CBadge, CNavLink, CSidebarNav } from '@coreui/react';
import _nav from '../_nav'; // Import Navigation Data

export const AppSidebarNav = () => {
  const [storedUser, setStoredUser] = useState(null);
  const headerRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle(
          'shadow-sm',
          document.documentElement.scrollTop > 0
        );
    });

    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (!user) {
      navigate('/login'); // Redirect to login if user is not found
    } else {
      setStoredUser(user);
    }
  }, [navigate]);

  if (!storedUser) {
    return null; // Prevent rendering if user isn't loaded
  }

  // 🔍 Filter Navigation Links Based on User Role
  const filteredNav = _nav.filter((navItem) => {
    if (storedUser.role === 'Master Admin') {
      // return true; // Show all menu items
      return navItem.name === 'Master Admin';
    } else if (storedUser.role === 'Project Admin') {
      return navItem.name === 'Project Admin'; // Show only Service Admin items
    } else if (storedUser.role === 'Service Admin') {
      return navItem.name === 'Service Admin'; // Show only Service Admin items
    } else if (storedUser.role === 'Client Admin') {
      return navItem.name === 'Client Admin'; // Show only Client Admin items
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
            {...(rest.href && { target: '_blank', rel: 'noopener noreferrer' })}
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
