import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
  CAvatar,
  CDropdownDivider,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBell, cilContrast, cilMenu, cilMoon, cilSun } from '@coreui/icons';

import { AppBreadcrumb } from './index';
import { AppHeaderDropdown } from './header/index';
import { Link, useNavigate } from 'react-router-dom';
import { notifications } from '../data'; // Import notifications data

const AppHeader = () => {
  const headerRef = useRef();
  const { colorMode, setColorMode } = useColorModes('theme');

  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);
  const navigate = useNavigate();
  const [storedUser, setStoredUser] = useState(null);

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
    return null; // Don't render the header if user is not found
  }

  // 📌 Get the latest 5 notifications
  const latestNotifications = [...notifications]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Sort by latest
    .slice(0, 5);

  const unreadNotifications = latestNotifications.filter(
    (item) => item.status === 'Unread'
  );
  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderNav className="d-none d-md-flex">
          <CNavItem>
            <CNavLink>Welcome, &nbsp;{storedUser?.username}</CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className="ms-auto">
          {/* 🔔 Notifications Dropdown */}
          <CDropdown variant="nav-item" placement="top-end">
            <CDropdownToggle caret={false}>
              <div className="d-flex justify-content-center align-items-center">
                <CIcon icon={cilBell} size="lg" />
                {unreadNotifications.length > 0 && (
                  <span className="badge bg-danger ms-1">
                    {unreadNotifications.length}
                  </span>
                )}
              </div>
            </CDropdownToggle>
            <CDropdownMenu className="p-2" style={{ minWidth: '300px' }}>
              {latestNotifications.length > 0 ? (
                latestNotifications.map((notification, index) => (
                  <CDropdownItem
                    as="button"
                    // active={notification.status === 'Unread'}
                    key={index}
                    className="d-flex align-items-center py-1 my-1"
                  >
                    <CAvatar
                      className=" me-3"
                      size="md"
                      src={notification.performed_by.profile_image}
                      status={
                        notification.status === 'Read' ? 'success' : 'danger'
                      }
                    />
                    <div className="text-wrap">
                      <strong className="d-block">{notification.action}</strong>
                      <small className=" d-block" style={{ fontSize: '12px' }}>
                        {notification.performed_by.username} |{' '}
                        {notification.timestamp}
                      </small>
                    </div>
                  </CDropdownItem>
                ))
              ) : (
                <CDropdownItem disabled className="text-center py-3">
                  No new notifications
                </CDropdownItem>
              )}

              {/* Divider & View All Button */}
              <CDropdownDivider />
              <CDropdownItem className="text-center w-100">
                <Link
                  to="/master-admin/notifications"
                  className="btn btn-sm btn-light w-100"
                >
                  All Notifications
                </Link>
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </CHeaderNav>

        <CHeaderNav>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === 'light'}
                onClick={() => setColorMode('light')}
                as="button"
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
              <CDropdownItem
                as="button"
                active={colorMode === 'dark'}
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </CDropdownItem>
              <CDropdownItem
                as="button"
                active={colorMode === 'auto'}
                onClick={() => setColorMode('auto')}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
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

// import React, { useEffect, useRef, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import {
//   CContainer,
//   CDropdown,
//   CDropdownItem,
//   CDropdownMenu,
//   CDropdownToggle,
//   CHeader,
//   CHeaderNav,
//   CHeaderToggler,
//   CNavLink,
//   CNavItem,
//   useColorModes,
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilBell, cilContrast, cilMenu, cilMoon, cilSun } from '@coreui/icons';

// import { AppBreadcrumb } from './index';
// import { AppHeaderDropdown } from './header/index';
// import { useNavigate } from 'react-router-dom';

// const AppHeader = () => {
//   const headerRef = useRef();
//   const { colorMode, setColorMode } = useColorModes(
//     'coreui-free-react-admin-template-theme'
//   );

//   const dispatch = useDispatch();
//   const sidebarShow = useSelector((state) => state.sidebarShow);
//   const navigate = useNavigate();

//   // ✅ Store user in state to prevent repeated calls to localStorage
//   const [storedUser, setStoredUser] = useState(null);

//   useEffect(() => {
//     document.addEventListener('scroll', () => {
//       headerRef.current &&
//         headerRef.current.classList.toggle(
//           'shadow-sm',
//           document.documentElement.scrollTop > 0
//         );
//     });

//     const user = JSON.parse(localStorage.getItem('userInfo'));

//     if (!user) {
//       navigate('/login'); // 🔹 Redirect to login if user is not found
//     } else {
//       setStoredUser(user);
//     }
//   }, [navigate]);

//   // ✅ Prevent errors by checking if `storedUser` exists before rendering
//   if (!storedUser) {
//     return null; // Don't render the header if user is not found
//   }

//   return (
//     <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
//       <CContainer className="border-bottom px-4" fluid>
//         <CHeaderToggler
//           onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
//           style={{ marginInlineStart: '-14px' }}
//         >
//           <CIcon icon={cilMenu} size="lg" />
//         </CHeaderToggler>
//         <CHeaderNav className="d-none d-md-flex">
//           <CNavItem>
//             <CNavLink>
//               Welcome,{' '}
//               <span className="text-primary fw-bold">
//                 {storedUser?.username}
//               </span>
//             </CNavLink>
//           </CNavItem>
//         </CHeaderNav>
//         <CHeaderNav className="ms-auto">
//           <CNavItem>
//             <CNavLink href="/admin-notifications">
//               <CIcon icon={cilBell} size="lg" />
//             </CNavLink>
//           </CNavItem>
//         </CHeaderNav>
//         <CHeaderNav>
//           <li className="nav-item py-1">
//             <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
//           </li>
//           <CDropdown variant="nav-item" placement="bottom-end">
//             <CDropdownToggle caret={false}>
//               {colorMode === 'dark' ? (
//                 <CIcon icon={cilMoon} size="lg" />
//               ) : colorMode === 'auto' ? (
//                 <CIcon icon={cilContrast} size="lg" />
//               ) : (
//                 <CIcon icon={cilSun} size="lg" />
//               )}
//             </CDropdownToggle>
//             <CDropdownMenu>
//               <CDropdownItem
//                 active={colorMode === 'light'}
//                 className="d-flex align-items-center"
//                 as="button"
//                 type="button"
//                 onClick={() => setColorMode('light')}
//               >
//                 <CIcon className="me-2" icon={cilSun} size="lg" /> Light
//               </CDropdownItem>
//               <CDropdownItem
//                 active={colorMode === 'dark'}
//                 className="d-flex align-items-center"
//                 as="button"
//                 type="button"
//                 onClick={() => setColorMode('dark')}
//               >
//                 <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
//               </CDropdownItem>
//               <CDropdownItem
//                 active={colorMode === 'auto'}
//                 className="d-flex align-items-center"
//                 as="button"
//                 type="button"
//                 onClick={() => setColorMode('auto')}
//               >
//                 <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
//               </CDropdownItem>
//             </CDropdownMenu>
//           </CDropdown>
//           <li className="nav-item py-1">
//             <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
//           </li>
//           <AppHeaderDropdown />
//         </CHeaderNav>
//       </CContainer>
//       <CContainer className="px-4" fluid>
//         <AppBreadcrumb />
//       </CContainer>
//     </CHeader>
//   );
// };

// export default AppHeader;
