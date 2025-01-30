import React from 'react';
import { CFooter } from '@coreui/react';
import logo from '../assets/brand/favicon.png';
const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div className="ms-auto">
        <img
          src={logo}
          alt="Company Logo"
          style={{ width: '30px', height: '30px', marginRight: '8px' }}
        />
        <a
          className="text-decoration-none  fw-bold"
          href="https://taypro.in"
          target="_blank"
          rel="noopener noreferrer"
        >
          Taypro Private Limited
        </a>
        <span className="ms-1">
          <b>&copy; {new Date().getFullYear()}</b>
        </span>
      </div>
    </CFooter>
  );
};

export default React.memo(AppFooter);

// import React from 'react';
// import { CFooter } from '@coreui/react';
// import logo from '../assets/brand/favicon.png';
// const AppFooter = () => {
//   return (
//     <CFooter className="px-4">
//       <div>
//         <img
//           src={logo} // Replace this with the actual link to your favicon
//           alt="Company Logo"
//           style={{ width: '20px', height: '20px', marginRight: '8px' }}
//         />
//         <a
//           className="text-decoration-none fw-bold"
//           href="https://taypro.in"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Taypro Private Limited
//         </a>
//         <span className="ms-1">&copy; {new Date().getFullYear()} We drive Performance.</span>
//       </div>
//     </CFooter>
//   );
// };

// export default React.memo(AppFooter);
