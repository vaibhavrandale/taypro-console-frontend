// import {
//   CCard,
//   CCardImage,
//   CCardBody,
//   CCardText,
//   CRow,
//   CCol,
//   CModal,
//   CModalBody,
//   CImage,
//   CFormInput,
//   CModalHeader,
//   CModalTitle,
//   CBadge,
// } from "@coreui/react";
// import { useEffect, useReducer } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import toast from "react-hot-toast";
// import { Link } from "react-router-dom";
// import CIcon from "@coreui/icons-react";
// import { cilPencil, cilX } from "@coreui/icons";
// import LoadingSpinner from "../../../components/LoadingSpinner";

// const initialState = {
//   microfiberData: [],
//   loading: false,
//   error: "",
//   modalVisible: false,
//   selectedImage: null,
//   selectedItem: null,
//   searchTerm: "",
// };

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "FETCH_START":
//       return { ...state, loading: true };
//     case "FETCH_SUCCESS":
//       return { ...state, loading: false, microfiberData: action.payload };
//     case "FETCH_FAIL":
//       return { ...state, loading: false, error: action.payload };
//     case "SET_SEARCH":
//       return { ...state, searchTerm: action.payload };
//     case "OPEN_MODAL":
//       return {
//         ...state,
//         modalVisible: true,
//         selectedImage: action.payload.image,
//         selectedItem: action.payload.item,
//       };
//     case "CLOSE_MODAL":
//       return {
//         ...state,
//         modalVisible: false,
//         selectedImage: null,
//         selectedItem: null,
//       };
//     default:
//       return state;
//   }
// };

// const Microfiberdata = () => {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   const authtoken = useSelector((state) => state.authtoken);
//   const userInfo = useSelector((state) => state.userInfo);

//   useEffect(() => {
//     const fetchData = async () => {
//       dispatch({ type: "FETCH_START" });
//       try {
//         const res = await axios.get(`/api/v1/microfiberdata/${userInfo._id}`, {
//           headers: {
//             Authorization: `Bearer ${authtoken}`,
//           },
//         });
//         dispatch({ type: "FETCH_SUCCESS", payload: res.data.data });
//       } catch (error) {
//         dispatch({
//           type: "FETCH_FAIL",
//           payload: error.response?.data?.error || error.response?.data?.message,
//         });
//         toast.error(
//           error.response?.data?.error ||
//             error.response?.data?.message ||
//             "Failed to fetch Micro Fiber data"
//         );
//       }
//     };

//     if (userInfo._id) {
//       fetchData();
//     }
//   }, [authtoken, userInfo._id]);

//   const filteredData = state.microfiberData.filter(
//     (item) =>
//       item.site_id.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
//       item.category.toLowerCase().includes(state.searchTerm.toLowerCase())
//   );

//   return (
//     <div className="p-2">
//       <h2 className="text-center mt-2 mb-2">Micro Fiber Data</h2>
//       <CRow className="align-items-center mb-5 justify-content-between">
//         <CCol md={4}>
//           <CFormInput
//             type="text"
//             placeholder="Search by Site Id & Category..."
//             value={state.searchTerm}
//             onChange={(e) =>
//               dispatch({ type: "SET_SEARCH", payload: e.target.value })
//             }
//           />
//         </CCol>
//         <CCol md="auto">
//           <Link
//             className="btn btn-sm btn-secondary"
//             to={`/site-technician/micro-fiber-data/add-micro-fiber-data`}
//           >
//             Add Micro Fiber Data
//           </Link>
//         </CCol>
//       </CRow>

//       <CRow>
//         {state.loading ? (
//           <span className="text-center fw-bold">
//             <LoadingSpinner />
//           </span>
//         ) : filteredData.length < 0 ? (
//           <p className="text-center fw-bold">No Micro Fiber Data Found</p>
//         ) : (
//           filteredData.map((item) => (
//             <CCol key={item._id} md={3} className="mb-4">
//               <CCard className="shadow-sm">
//                 <CCardImage
//                   orientation="top"
//                   src={item.image}
//                   style={{
//                     height: "200px",
//                     objectFit: "cover",
//                     cursor: "pointer",
//                   }}
//                   onClick={() =>
//                     dispatch({
//                       type: "OPEN_MODAL",
//                       payload: { image: item.image, item },
//                     })
//                   }
//                 />

//                 <CCardBody className="position-relative">
//                   <CCardText className="fw-bold mb-1">
//                     Site ID: <CBadge color="blue">{item.site_id}</CBadge>
//                   </CCardText>
//                   <CCardText className="fw-bold mb-1">
//                     Category: <CBadge color="warning">{item.category}</CBadge>
//                   </CCardText>

//                   <Link
//                     to={`/site-technician/micro-fiber-data/update-micro-fiber-data/${item._id}`}
//                     className="position-absolute bottom-0 end-0 m-2"
//                   >
//                     <CIcon icon={cilPencil} size="md" className="text-white" />
//                   </Link>
//                 </CCardBody>
//               </CCard>
//             </CCol>
//           ))
//         )}
//       </CRow>

//       <CModal
//         visible={state.modalVisible}
//         onClose={() => dispatch({ type: "CLOSE_MODAL" })}
//         size="lg"
//         centered
//       >
//         {state.selectedItem && (
//           <>
//             <CModalHeader closeButton={false}>
//               <CModalTitle className="">
//                 Site ID: {state.selectedItem.site_id}
//               </CModalTitle>
//               <button
//                 type="button"
//                 className=" border-0 ms-auto py-0 px-1"
//                 onClick={() => dispatch({ type: "CLOSE_MODAL" })}
//                 style={{ background: "none" }}
//               >
//                 <CIcon icon={cilX} size="lg" />
//               </button>
//             </CModalHeader>
//             <CModalBody className="text-center">
//               <CImage
//                 src={state.selectedImage}
//                 fluid
//                 style={{
//                   maxHeight: "500px",
//                   width: "100%",
//                   objectFit: "contain",
//                 }}
//               />
//               <div className="mt-3">
//                 <CBadge
//                   color={
//                     state.selectedItem.category === "Good"
//                       ? "success"
//                       : state.selectedItem.category === "Bad"
//                       ? "danger"
//                       : "warning"
//                   }
//                   className="px-3 py-2 fs-6"
//                 >
//                   Category: {state.selectedItem.category}
//                 </CBadge>
//               </div>
//             </CModalBody>
//           </>
//         )}
//       </CModal>
//     </div>
//   );
// };

// export default Microfiberdata;

import React, { useReducer, useEffect, useCallback, useRef } from "react";
import {
  CRow,
  CCol,
  CFormInput,
  CCard,
  CCardImage,
  CCardBody,
  CCardText,
  CBadge,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CImage,
} from "@coreui/react";
import { cilPencil, cilX } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner";

const initialState = {
  microfiberData: [],
  loading: false,
  error: "",
  modalVisible: false,
  selectedImage: null,
  selectedItem: null,
  searchTerm: "",
  page: 1,
  hasMore: true,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        microfiberData: [...state.microfiberData, ...action.payload.data],
        hasMore: action.payload.hasMore,
        page: state.page + 1,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "SET_SEARCH":
      return { ...state, searchTerm: action.payload };
    case "OPEN_MODAL":
      return {
        ...state,
        modalVisible: true,
        selectedImage: action.payload.image,
        selectedItem: action.payload.item,
      };
    case "CLOSE_MODAL":
      return {
        ...state,
        modalVisible: false,
        selectedImage: null,
        selectedItem: null,
      };
    default:
      return state;
  }
};

const Microfiberdata = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);

  const observer = useRef();

  const fetchData = async (page) => {
    dispatch({ type: "FETCH_START" });
    try {
      const res = await axios.get(
        `/api/v1/microfiberdata/${userInfo._id}?page=${page}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${authtoken}`,
          },
        }
      );

      dispatch({
        type: "FETCH_SUCCESS",
        payload: {
          data: res.data.data,
          hasMore: res.data.hasMore,
        },
      });
    } catch (error) {
      dispatch({
        type: "FETCH_FAIL",
        payload:
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to fetch Micro Fiber data",
      });
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to fetch Micro Fiber data"
      );
    }
  };

  useEffect(() => {
    if (userInfo._id) fetchData(1);
  }, [authtoken, userInfo._id]);

  const lastCardRef = useCallback(
    (node) => {
      if (state.loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && state.hasMore) {
          fetchData(state.page);
        }
      });

      if (node) observer.current.observe(node);
    },
    [state.loading, state.hasMore, state.page]
  );

  const filteredData = state.microfiberData.filter(
    (item) =>
      item.site_id.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(state.searchTerm.toLowerCase())
  );

  return (
    <div className="p-2">
      <h2 className="text-center mt-2 mb-2">Micro Fiber Data</h2>
      <CRow className="align-items-center mb-5 justify-content-between">
        <CCol md={4}>
          <CFormInput
            type="text"
            placeholder="Search by Site Id & Category..."
            value={state.searchTerm}
            onChange={(e) =>
              dispatch({ type: "SET_SEARCH", payload: e.target.value })
            }
          />
        </CCol>
        <CCol md="auto">
          <Link
            className="btn btn-sm btn-secondary"
            to={`/site-technician/micro-fiber-data/add-micro-fiber-data`}
          >
            Add Micro Fiber Data
          </Link>
        </CCol>
      </CRow>

      <CRow>
        {state.loading && state.microfiberData.length === 0 ? (
          <span className="text-center fw-bold">
            <LoadingSpinner />
          </span>
        ) : filteredData.length === 0 ? (
          <p className="text-center fw-bold">No Micro Fiber Data Found</p>
        ) : (
          filteredData.map((item, index) => {
            const isLast = index === filteredData.length - 1;
            return (
              <CCol
                key={item._id}
                md={3}
                className="mb-4"
                ref={isLast ? lastCardRef : null}
              >
                <CCard className="shadow-sm">
                  <CCardImage
                    loading="lazy"
                    orientation="top"
                    src={item.image}
                    style={{
                      height: "200px",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      dispatch({
                        type: "OPEN_MODAL",
                        payload: { image: item.image, item },
                      })
                    }
                  />
                  <CCardBody className="position-relative">
                    <CCardText className="fw-bold mb-1">
                      Site ID: <CBadge color="blue">{item.site_id}</CBadge>
                    </CCardText>
                    <CCardText className="fw-bold mb-1">
                      Category: <CBadge color="warning">{item.category}</CBadge>
                    </CCardText>
                    <Link
                      to={`/site-technician/micro-fiber-data/update-micro-fiber-data/${item._id}`}
                      className="position-absolute bottom-0 end-0 m-2"
                    >
                      <CIcon
                        icon={cilPencil}
                        size="md"
                        className="text-white"
                      />
                    </Link>
                  </CCardBody>
                </CCard>
              </CCol>
            );
          })
        )}
      </CRow>

      <CModal
        visible={state.modalVisible}
        onClose={() => dispatch({ type: "CLOSE_MODAL" })}
        size="lg"
        centered
      >
        {state.selectedItem && (
          <>
            <CModalHeader closeButton={false}>
              <CModalTitle className="">
                Site ID: {state.selectedItem.site_id}
              </CModalTitle>
              <button
                type="button"
                className=" border-0 ms-auto py-0 px-1"
                onClick={() => dispatch({ type: "CLOSE_MODAL" })}
                style={{ background: "none" }}
              >
                <CIcon icon={cilX} size="lg" />
              </button>
            </CModalHeader>
            <CModalBody className="text-center">
              <CImage
                src={state.selectedImage}
                fluid
                style={{
                  maxHeight: "500px",
                  width: "100%",
                  objectFit: "contain",
                }}
              />
              <div className="mt-3">
                <CBadge
                  color={
                    state.selectedItem.category === "Good"
                      ? "success"
                      : state.selectedItem.category === "Bad"
                      ? "danger"
                      : "warning"
                  }
                  className="px-3 py-2 fs-6"
                >
                  Category: {state.selectedItem.category}
                </CBadge>
              </div>
            </CModalBody>
          </>
        )}
      </CModal>
    </div>
  );
};

export default Microfiberdata;
