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
//   CAvatar,
//   CDropdownDivider,
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilBell, cilContrast, cilMenu, cilMoon, cilSun } from '@coreui/icons';

// import { AppBreadcrumb } from './index';
// import { AppHeaderDropdown } from './header/index';
// import { Link, useNavigate } from 'react-router-dom';
// import moment from 'moment';
// import { notifications } from '../data'; // Import notifications data

// // const AppHeader = () => {
// const AppHeader = ({ sidebarShow, setSidebarShow }) => {
//   const headerRef = useRef();
//   const { colorMode, setColorMode } = useColorModes('theme');

//   const dispatch = useDispatch();
//   // const sidebarShow = useSelector((state) => state.sidebarShow);
//   const navigate = useNavigate();
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
//       navigate('/login'); // Redirect to login if user is not found
//     } else {
//       setStoredUser(user);
//     }
//   }, [navigate]);

//   if (!storedUser) {
//     return null; // Don't render the header if user is not found
//   }

//   // 📌 Get the latest 5 notifications
//   const latestNotifications = [...notifications]
//     .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Sort by latest
//     .slice(0, 5);

//   const unreadNotifications = latestNotifications.filter(
//     (item) => item.status === 'Unread'
//   );
//   return (
//     <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
//       <CContainer className="border-bottom px-4" fluid>
//         <CHeaderToggler
//           // onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
//           onClick={() => setSidebarShow(!sidebarShow)}
//           style={{ marginInlineStart: '-14px' }}
//         >
//           <CIcon icon={cilMenu} size="lg" />
//         </CHeaderToggler>
//         <CHeaderNav className="d-none d-md-flex">
//           <CNavItem>
//             <CNavLink>Welcome, &nbsp;{storedUser?.username}</CNavLink>
//           </CNavItem>
//         </CHeaderNav>

//         <CHeaderNav className="ms-auto">
//           {/* 🔔 Notifications Dropdown */}
//           <CDropdown variant="nav-item" placement="top-end">
//             <CDropdownToggle caret={false}>
//               <div className="d-flex justify-content-center align-items-center">
//                 <CIcon icon={cilBell} size="lg" />
//                 {notifications.filter(
//                   (item) =>
//                     !item.read_status.some(
//                       (status) =>
//                         status.readbyId === storedUser?.id && status.read
//                     )
//                 ).length > 0 && (
//                   <span className="badge bg-danger ms-1">
//                     {
//                       notifications.filter(
//                         (item) =>
//                           !item.read_status.some(
//                             (status) =>
//                               status.readbyId === storedUser?.id && status.read
//                           )
//                       ).length
//                     }
//                   </span>
//                 )}
//               </div>
//             </CDropdownToggle>

//             <CDropdownMenu
//               className="p-2"
//               style={{ minWidth: '200px', overflowX: 'auto' }}
//             >
//               <div className="d-flex justify-content-between align-items-center px-3 py-2">
//                 <strong>Notifications</strong>
//                 <Link
//                   to="/master-admin/notifications"
//                   className="text-primary small"
//                 >
//                   View All
//                 </Link>
//               </div>
//               <CDropdownDivider />

//               {notifications.length > 0 ? (
//                 notifications.slice(0, 5).map((notification, index) => {
//                   const isRead = notification.read_status.some(
//                     (status) =>
//                       status.readbyId === storedUser?.id && status.read
//                   );

//                   return (
//                     <CDropdownItem
//                       as="button"
//                       key={index}
//                       className={`d-flex align-items-center py-2 my-1 ${
//                         isRead ? 'text-muted' : 'fw-bold'
//                       }`}
//                     >
//                       <CAvatar
//                         className="me-3"
//                         size="md"
//                         src={notification.performed_by.profile_image}
//                       />
//                       <div>
//                         <strong className="d-block">
//                           {notification.action}
//                         </strong>
//                         <small className="text-muted d-block">
//                           {notification.details.length > 30
//                             ? `${notification.details.substring(0, 30)}...`
//                             : notification.details}
//                         </small>

//                         <small className="d-block" style={{ fontSize: '12px' }}>
//                           {notification.performed_by.username} |{' '}
//                           {moment(notification.timestamp).format(
//                             'MMM DD, YYYY HH:mm'
//                           )}
//                         </small>
//                       </div>
//                     </CDropdownItem>
//                   );
//                 })
//               ) : (
//                 <CDropdownItem disabled className="text-center py-3">
//                   No new notifications
//                 </CDropdownItem>
//               )}

//               {/* <CDropdownDivider />
//               <CDropdownItem className="text-center w-100">
//                 <Link
//                   to="/master-admin/notifications"
//                   className="btn btn-sm btn-light w-100"
//                 >
//                   All Notifications
//                 </Link>
//               </CDropdownItem> */}
//             </CDropdownMenu>
//           </CDropdown>
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
//                 onClick={() => setColorMode('light')}
//                 as="button"
//               >
//                 <CIcon className="me-2" icon={cilSun} size="lg" /> Light
//               </CDropdownItem>
//               <CDropdownItem
//                 as="button"
//                 active={colorMode === 'dark'}
//                 onClick={() => setColorMode('dark')}
//               >
//                 <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
//               </CDropdownItem>
//               <CDropdownItem
//                 as="button"
//                 active={colorMode === 'auto'}
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

// import React, { useEffect, useRef, useState } from 'react';
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
//   CAvatar,
//   CDropdownDivider,
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilBell, cilContrast, cilMenu, cilMoon, cilSun } from '@coreui/icons';
// import { Link, useNavigate } from 'react-router-dom';
// import moment from 'moment';
// import { notifications } from '../data'; // Import notifications data
// import { AppBreadcrumb } from './index';
// import { AppHeaderDropdown } from './header/index';
// const AppHeader = ({ sidebarShow, setSidebarShow }) => {
//   const headerRef = useRef();
//   const { colorMode, setColorMode } = useColorModes('theme');
//   const navigate = useNavigate();
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
//       navigate('/login'); // Redirect to login if user is not found
//     } else {
//       setStoredUser(user);
//     }
//   }, [navigate]);

//   if (!storedUser) return null; // Don't render header if user isn't found

//   // 🔍 Filter notifications based on role
//   const filteredNotifications = notifications.filter((notification) => {
//     if (storedUser.role === 'Master Admin') {
//       return true; // Show all notifications
//     } else if (storedUser.role === 'Client Admin') {
//       return notification.clientadmin === true; // Show only Client Admin notifications
//     } else if (storedUser.role === 'Project Admin') {
//       return notification.projectadmin === true; // Show only Client Admin notifications
//     } else if (storedUser.role === 'Service Admin') {
//       return notification.serviceadmin === true; // Show only Client Admin notifications
//     }
//     return false;
//   });

//   // 📌 Get latest 5 notifications
//   const latestNotifications = [...filteredNotifications]
//     .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
//     .slice(0, 5);

//   // 📌 Count unread notifications for logged-in user
//   const unreadNotifications = latestNotifications.filter(
//     (notification) =>
//       !notification.read_status.some(
//         (status) => status.readbyId === storedUser.id && status.read
//       )
//   );

//   return (
//     <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
//       <CContainer className="border-bottom px-4" fluid>
//         <CHeaderToggler
//           onClick={() => setSidebarShow(!sidebarShow)}
//           style={{ marginInlineStart: '-14px' }}
//         >
//           <CIcon icon={cilMenu} size="lg" />
//         </CHeaderToggler>
//         <CHeaderNav className="d-none d-md-flex">
//           <CNavItem>
//             <CNavLink>
//               Welcome, &nbsp;
//               <span className="fw-bold">{storedUser?.username}</span>
//             </CNavLink>
//           </CNavItem>
//         </CHeaderNav>

//         <CHeaderNav className="ms-auto">
//           {/* 🔔 Notifications Dropdown */}
//           <CDropdown variant="nav-item" placement="top-end">
//             <CDropdownToggle caret={false}>
//               <div className="d-flex justify-content-center align-items-center">
//                 <CIcon icon={cilBell} size="lg" />
//                 {unreadNotifications.length > 0 && (
//                   <span className="badge bg-danger ms-1">
//                     {unreadNotifications.length}
//                   </span>
//                 )}
//               </div>
//             </CDropdownToggle>

//             <CDropdownMenu className="p-2" style={{ minWidth: '250px' }}>
//               <div className="d-flex justify-content-between align-items-center px-3 py-2">
//                 <strong>Notifications</strong>
//                 <Link
//                   to="/master-admin/notifications"
//                   className="text-primary small"
//                 >
//                   View All
//                 </Link>
//               </div>
//               <CDropdownDivider />

//               {latestNotifications.length > 0 ? (
//                 latestNotifications.map((notification, index) => {
//                   const isRead = notification.read_status.some(
//                     (status) => status.readbyId === storedUser.id && status.read
//                   );

//                   return (
//                     <CDropdownItem
//                       as="button"
//                       key={index}
//                       className={`d-flex align-items-center py-2 my-1 ${
//                         isRead ? 'text-muted' : 'fw-bold'
//                       }`}
//                     >
//                       <CAvatar
//                         className="me-3"
//                         size="md"
//                         src={notification.performed_by.profile_image}
//                       />
//                       <div>
//                         <strong className="d-block">
//                           {notification.action}
//                         </strong>
//                         <small className="text-muted d-block">
//                           {notification.details.length > 30
//                             ? `${notification.details.substring(0, 30)}...`
//                             : notification.details}
//                         </small>
//                         <small className="d-block" style={{ fontSize: '12px' }}>
//                           {notification.performed_by.username} |{' '}
//                           {moment(notification.timestamp).format(
//                             'MMM DD, YYYY HH:mm'
//                           )}
//                         </small>
//                       </div>
//                     </CDropdownItem>
//                   );
//                 })
//               ) : (
//                 <CDropdownItem disabled className="text-center py-3">
//                   No new notifications
//                 </CDropdownItem>
//               )}
//             </CDropdownMenu>
//           </CDropdown>
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
//                 onClick={() => setColorMode('light')}
//                 as="button"
//               >
//                 <CIcon className="me-2" icon={cilSun} size="lg" /> Light
//               </CDropdownItem>
//               <CDropdownItem
//                 as="button"
//                 active={colorMode === 'dark'}
//                 onClick={() => setColorMode('dark')}
//               >
//                 <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
//               </CDropdownItem>
//               <CDropdownItem
//                 as="button"
//                 active={colorMode === 'auto'}
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

import React, { useEffect, useRef, useState } from 'react';
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
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { notifications } from '../data'; // Import notifications data
import { AppBreadcrumb } from './index';
import { AppHeaderDropdown } from './header/index';

const AppHeader = ({ sidebarShow, setSidebarShow }) => {
  const headerRef = useRef();
  const { colorMode, setColorMode } = useColorModes('theme'); // ✅ Fixed usage
  const navigate = useNavigate();
  const [storedUser, setStoredUser] = useState(null);

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current?.classList.toggle(
        'shadow-sm',
        document.documentElement.scrollTop > 0
      );
    });

    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (!user) {
      navigate('/login'); // Redirect if user is not logged in
    } else {
      setStoredUser(user);
    }
  }, [navigate]);

  // const fetchUsers = async () => {
  //   try {
  //     const response = await axios.get('/api/v1/notifications', {
  //       headers: { authorization: `Bearer ${authtoken}` },
  //     }); // Replace with your API endpoint

  //     // setUsers(filteredUsers)
  //     // const data = response.data.data;
  //     // console.log(data);

  //     setNotifications(response.data.data);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error('Error fetching users:', error.response.data.error);
  //   }
  // };
  // fetchUsers();
  if (!storedUser) return null; // Don't render if no user is logged in

  // 🔍 Dynamic Notification Link Based on Role
  const notificationPage =
    storedUser.role === 'Master Admin'
      ? '/master-admin/notifications'
      : storedUser.role === 'Service Admin'
      ? '/service-admin/notifications'
      : storedUser.role === 'Project Admin'
      ? '/project-admin/notifications'
      : storedUser.role === 'Client Admin'
      ? '/client-admin/notifications'
      : '/notifications';

  // 🔍 Filter notifications based on user role
  const filteredNotifications = notifications.filter((notification) => {
    switch (storedUser.role) {
      case 'Master Admin':
        return true; // Show all notifications
      case 'Client Admin':
        return notification.clientadmin === true;
      case 'Project Admin':
        return notification.projectadmin === true;
      case 'Service Admin':
        return notification.serviceadmin === true;
      default:
        return false;
    }
  });

  // 📌 Get the latest 5 notifications
  const latestNotifications = [...filteredNotifications]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);

  // 📌 Count unread notifications for logged-in user
  const unreadNotifications = latestNotifications.filter(
    (notification) =>
      !notification.read_status.some(
        (status) => status.readbyId === storedUser._id && status.read
      )
  );
  console.log(unreadNotifications);

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => setSidebarShow(!sidebarShow)}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>

        <CHeaderNav className="d-none d-md-flex">
          <CNavItem>
            <CNavLink>
              Welcome, &nbsp;
              <span className="fw-bold">{storedUser?.username}</span>
            </CNavLink>
          </CNavItem>
        </CHeaderNav>

        <CHeaderNav className="ms-auto">
          {/* 🌗 Theme Toggle */}
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
              {/* <CDropdownItem
                as="button"
                active={colorMode === 'auto'}
                onClick={() => setColorMode('auto')}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
              </CDropdownItem> */}
            </CDropdownMenu>
          </CDropdown>
        </CHeaderNav>

        {/* 🔔 Notifications Dropdown */}
        <CHeaderNav>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
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

            <CDropdownMenu className="p-2" style={{ minWidth: '250px' }}>
              <div className="d-flex justify-content-between align-items-center px-3 py-2">
                <strong>Notifications</strong>
                <Link to={notificationPage} className="text-primary small">
                  View All
                </Link>
              </div>
              <CDropdownDivider />

              {latestNotifications.length > 0 ? (
                latestNotifications.map((notification, index) => {
                  const isRead = notification.read_status.some(
                    (status) => status.readbyId === storedUser.id && status.read
                  );

                  return (
                    <CDropdownItem
                      as="button"
                      key={index}
                      className={`d-flex align-items-center py-2 my-1 ${
                        isRead ? 'text-muted' : 'fw-bold'
                      }`}
                    >
                      <CAvatar
                        className="me-3"
                        size="md"
                        src={notification.performed_by.profile_image}
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
                        <small className="d-block" style={{ fontSize: '12px' }}>
                          {notification.performed_by.username} |{' '}
                          {moment(notification.timestamp).format(
                            'MMM DD, YYYY HH:mm'
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
