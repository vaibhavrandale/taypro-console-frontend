import React, { useState } from 'react';
import {
  CAvatar,

  // CBadge,
  CDropdown,
  CDropdownDivider,
  // CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  // CModal,
  // CModalBody,
  // CModalHeader,
  // CModalTitle,
} from '@coreui/react';
import {
  // cilBell,
  // cilCreditCard,
  // cilCommentSquare,
  // cilEnvelopeOpen,
  // cilFile,
  cilLockLocked,
  cilSettings,
  // cilTask,
  cilUser,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
// import avatar8 from './../../assets/images/avatars/vaibhav.jpg';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
// import store from '../../store';
import { useDispatch, useSelector } from 'react-redux';

const AppHeaderDropdown = () => {
  const dispatch = useDispatch(); // ✅ FIXED: Initialize dispatch
  const userInfo = useSelector((state) => state.userInfo);

  // console.log(userInfo);
  const navigate = useNavigate();
  const [logoutModalOpen, setLogoutModalOpenn] = useState(false);

  const logoutModal = () => {
    setLogoutModalOpenn(!logoutModalOpen);
  };

  const LogoutHandler = () => {
    logoutModal();

    dispatch({ type: 'EMP_SIGNOUT' });
    localStorage.removeItem('userInfo');
    navigate('/login');
    toast.success('Sign out Successfully');
  };

  return (
    <>
      <CDropdown variant="nav-item">
        <CDropdownToggle
          placement="bottom-end"
          className="py-0 pe-0"
          caret={false}
        >
          <CAvatar src={userInfo && userInfo.profile_image} size="md" />
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
