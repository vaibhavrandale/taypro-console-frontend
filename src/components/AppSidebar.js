// import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';

// import {
//   CCloseButton,
//   CSidebar,
//   CSidebarBrand,
//   CSidebarFooter,
//   CSidebarHeader,
//   CSidebarToggler,
// } from '@coreui/react';

// import { AppSidebarNav } from './AppSidebarNav';

// import TayproLogo from '../assets/brand/logofordarkbg.png'; // Import the image

// import navigation from '../_nav';

// const AppSidebar = () => {
//   const dispatch = useDispatch();
//   const unfoldable = useSelector((state) => state.sidebarUnfoldable);
//   const sidebarShow = useSelector((state) => state.sidebarShow);

//   return (
//     <CSidebar
//       className="border-end"
//       style={{
//         background: '#052638',
//       }}
//       colorScheme="dark"
//       position="fixed"
//       unfoldable={unfoldable}
//       visible={sidebarShow}
//       onVisibleChange={(visible) => {
//         dispatch({ type: 'set', sidebarShow: visible });
//       }}
//     >
//       <CSidebarHeader className="border-bottom">
//         <CSidebarBrand to="/">
//           {/* Use img tag to display TayproLogo */}
//           <img
//             src={TayproLogo}
//             alt="Taypro Logo"
//             // height={30}
//             style={{
//               height: '50px',
//               width: '200px',
//               objectFit: 'contain',
//             }}
//             className="sidebar-brand-full"
//           />
//           <img
//             src={TayproLogo}
//             alt="Taypro Logo"
//             height={30}
//             className="sidebar-brand-narrow"
//           />
//         </CSidebarBrand>
//         <CCloseButton
//           className="d-lg-none"
//           dark
//           onClick={() => dispatch({ type: 'set', sidebarShow: false })}
//         />
//       </CSidebarHeader>
//       <AppSidebarNav items={navigation} />
//       <CSidebarFooter className="border-top d-none d-lg-flex">
//         <CSidebarToggler
//           onClick={() =>
//             dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })
//           }
//         />
//       </CSidebarFooter>
//     </CSidebar>
//   );
// };

// export default React.memo(AppSidebar);

import React, { useState } from 'react';
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react';

import { AppSidebarNav } from './AppSidebarNav';
import TayproLogo from '../assets/brand/logofordarkbg.png'; // Import the image
import navigation from '../_nav';
import { Link } from 'react-router-dom';

const AppSidebar = ({ sidebarShow, setSidebarShow }) => {
  const [unfoldable, setUnfoldable] = useState(false);

  return (
    <CSidebar
      className="border-end"
      style={{ background: '#052638' }}
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => setSidebarShow(visible)}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <Link to="/">
            <img
              src={TayproLogo}
              alt="Taypro Logo"
              style={{ height: '50px', width: '200px', objectFit: 'contain' }}
              className="sidebar-brand-full"
            />
          </Link>
          <Link to="/">
            <img
              src={TayproLogo}
              alt="Taypro Logo"
              height={30}
              className="sidebar-brand-narrow"
            />
          </Link>
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => setSidebarShow(false)}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler onClick={() => setUnfoldable(!unfoldable)} />
      </CSidebarFooter>
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
