// import React from 'react'
// import { CToaster, CToast, CToastBody, CToastClose } from '@coreui/react'

// const Toast = ({ text, type }) => {
//   return (
//     <CToaster placement="top-end" className="p-3">
//       <CToast visible={true} className={`align-items-center bg-${type} text-white`}>
//         <div className="d-flex">
//           <CToastBody>{text}</CToastBody>
//           <CToastClose className="me-2 m-auto text-white" />
//         </div>
//       </CToast>
//     </CToaster>
//   )
// }

// export default Toast

import React from 'react'
import toast, { Toaster } from 'react-hot-toast'

const Toast = () => {
  return <Toaster position="top-right" reverseOrder={false} />
}

export default Toast
