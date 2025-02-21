import React, { useEffect, useReducer, useRef, useState } from 'react';
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
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBell, cilContrast, cilMenu, cilMoon, cilSun } from '@coreui/icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { AppHeaderDropdown } from './header/index';
import { AppBreadcrumb } from './index';
import { useSelector } from 'react-redux';
import LoadingSpinner from './LoadingSpinner';
import toast from 'react-hot-toast';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, notifications: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true, updateSuccess: false };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, updateSuccess: true };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };

    case 'UPDATE_RESET':
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
    error: '',
  });
  const userInfo = useSelector((state) => state.userInfo);
  const authtoken = useSelector((state) => state.authtoken);

  const headerRef = useRef();
  const { colorMode, setColorMode } = useColorModes('theme');
  const navigate = useNavigate();
  const [storedUser, setStoredUser] = useState(null);
  // const [notifications, setNotifications] = useState([]);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current?.classList.toggle(
        'shadow-sm',
        document.documentElement.scrollTop > 0
      );
    });

    if (!userInfo) {
      navigate('/login');
    } else {
      setStoredUser(userInfo);
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const response = await axios.get('/api/v1/notifications', {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        let result = response.data.data;
        dispatch({ type: 'FETCH_SUCCESS', payload: result });

        // setNotifications(response.data.data);
        // console.log(notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        dispatch({
          type: 'FETCH_FAIL',
          payload: error,
        });
      }
    };

    if (storedUser && updateSuccess) {
      dispatch({ type: 'UPDATE_RESET' });
    } else {
      fetchNotifications();
    }
  }, [authtoken, storedUser, updateSuccess]);

  if (!storedUser) return null;

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

  const filteredNotifications = notifications
    ? notifications.filter((notification) => {
        switch (storedUser.role) {
          case 'Master Admin':
            return true;
          case 'Client Admin':
            return notification.clientadmin;
          case 'Project Admin':
            return notification.projectadmin;
          case 'Service Admin':
            return notification.serviceadmin;
          default:
            return false;
        }
      })
    : [];

  const latestNotifications = [...filteredNotifications]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);

  const unreadNotifications = latestNotifications.filter(
    (notification) =>
      !notification.read_status.some(
        (status) => status.readbyId === storedUser._id && status.read
      )
  );
  const readNotification = async (notify) => {
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      const response = await axios.put(
        `/api/v1/notifications/notification-readby-user/${notify._id}`, // API call with notification ID
        { read: true }, // Sending "read" status in the request body
        {
          headers: {
            Authorization: `Bearer ${authtoken}`, // Authorization header
          },
        }
      );
      dispatch({ type: 'UPDATE_SUCCESS' });
      console.log('Notification marked as read:', response.data);
      toast.success('Notification read');
    } catch (error) {
      console.error(
        'Error marking notification as read:',
        error.response.data.error
      );
      toast.error(error.response.data.error);
      dispatch({
        type: 'UPDATE_FAIL',
      });
    }
  };

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
                {loadingUpdate || loading ? (
                  <span className="text-center">
                    <LoadingSpinner />
                  </span>
                ) : unreadNotifications.length > 0 ? (
                  <>
                    <span className="position-relative">
                      <CIcon icon={cilBell} size="xl" />
                      <CBadge
                        className="badge bg-danger   d-flex justify-content-center align-items-center"
                        style={{
                          height: '15px',
                          width: '15px',
                          borderRadius: '50%',
                        }}
                        position="top-end"
                        shape="rounded-pill"
                      >
                        {unreadNotifications.length}
                      </CBadge>
                    </span>
                  </>
                ) : (
                  <>
                    <span className="position-relative">
                      <CIcon icon={cilBell} size="xl" />
                    </span>
                  </>
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

              {loading ? (
                <span className="text-center">
                  <LoadingSpinner />
                </span>
              ) : latestNotifications.length > 0 ? (
                latestNotifications.map((notification, index) => {
                  const isRead = notification.read_status.some(
                    (status) =>
                      status.readbyId === storedUser._id && status.read
                  );

                  return (
                    <CDropdownItem
                      as="button"
                      key={index}
                      disabled={isRead}
                      className={`d-flex align-items-center py-2 my-1 ${
                        isRead ? 'text-muted' : 'fw-bold'
                      }`}
                      onClick={() => readNotification(notification)}
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
