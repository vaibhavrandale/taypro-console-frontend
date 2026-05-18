// import axios from "axios";
// import React, { useEffect, useReducer } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import toast from "react-hot-toast";
// import { useSelector } from "react-redux";
// import {
//   CAvatar,
//   CButton,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CCol,
//   CFormCheck,
//   CFormSelect,
//   CRow,
//   CTable,
//   CTableBody,
//   CTableDataCell,
//   CTableHead,
//   CTableHeaderCell,
//   CTableRow,
// } from "@coreui/react";
// import LoadingSpinner from "../../../components/LoadingSpinner";

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "FETCH_DPR_REQUEST":
//       return { ...state, loading: true, error: "" };
//     case "FETCH_DPR_SUCCESS":
//       return { ...state, loading: false, dprData: action.payload };
//     case "FETCH_DPR_FAIL":
//       return { ...state, loading: false, error: action.payload };
//     case "SET_FIELD":
//       return {
//         ...state,
//         dprData: { ...state.dprData, [action.name]: action.value },
//       };
//     case "UPDATE_REQUEST":
//       return { ...state, updateLoading: true, success: false };
//     case "UPDATE_SUCCESS":
//       return { ...state, updateLoading: false, success: true };
//     case "UPDATE_FAIL":
//       return {
//         ...state,
//         updateLoading: false,
//         error: action.payload,
//         success: false,
//       };

//     case "FETCH_SITEID_REQUEST":
//       return { ...state, loadingSiteIds: true, error: "" };
//     case "FETCH_SITEID_SUCCESS":
//       return {
//         ...state,
//         loadingSiteIds: false,
//         sites: action.payload,
//       };
//     case "FETCH_SITEID_FAIL":
//       return { ...state, loadingSiteIds: false, error: action.payload };

//     case "FETCH_TECHNICIAN_REQUEST":
//       return { ...state, loadingTechnicians: true, error: "" };
//     case "FETCH_TECHNICIAN_SUCCESS":
//       return {
//         ...state,
//         loadingTechnicians: false,
//         technicians: action.payload,
//       };
//     case "FETCH_TECHNICIAN_FAIL":
//       return { ...state, loadingTechnicians: false, error: action.payload };
//     default:
//       return state;
//   }
// };

// const UpdateDpr = () => {
//   const { id } = useParams();
//   // const authtoken = useSelector((state) => state.authtoken);
//   const navigate = useNavigate();
//   const userInfo = useSelector((state) => state.userInfo);
//   let adminroute = "";

//   if (userInfo.role === "Master Admin") {
//     adminroute = "master-admin";
//   } else if (userInfo.role === "Service Admin") {
//     adminroute = "service-admin";
//   } else if (userInfo.role === "Project Admin") {
//     adminroute = "project-admin";
//   } else if (userInfo?.role === "Master User") {
//     adminroute = "master-user";
//   } else if (userInfo?.role === "Service User") {
//     adminroute = "service-user";
//   } else if (userInfo?.role === "Project User") {
//     adminroute = "project-user";
//   }

//   const [state, dispatch] = useReducer(reducer, {
//     dprData: {
//       site_id: "",
//       total_running_robots: "",
//       total_failed_robots: "",
//       robots_run_by: "",
//       total_robots: "",
//       comments: "",
//       technician_present: [],
//     },
//     loading: false,
//     error: "",
//     success: false,
//     updateLoading: false,
//     sites: [],
//     technicians: [],
//   });

//   useEffect(() => {
//     const fetchDprDetails = async () => {
//       dispatch({ type: "FETCH_DPR_REQUEST" });
//       try {
//         const result = await axios.get(`/api/v1/techniciandprs/${id}`, {
//           // headers: { Authorization: `Bearer ${authtoken}` },
//           withCredentials: true,
//         });

//         dispatch({ type: "FETCH_DPR_SUCCESS", payload: result.data.data });
//       } catch (error) {
//         dispatch({
//           type: "FETCH_DPR_FAIL",
//           payload: error.response?.data?.error || "Error fetching DPR details",
//         });
//       }
//     };
//     const fetchSiteIds = async () => {
//       dispatch({ type: "FETCH_SITEID_REQUEST" });
//       try {
//         const result = await axios.get(`/api/v1/sites`, {
//           // headers: { Authorization: `Bearer ${authtoken}` },
//           withCredentials: true,
//         });
//         dispatch({
//           type: "FETCH_SITEID_SUCCESS",
//           payload: result.data.data,
//         });
//       } catch (error) {
//         dispatch({
//           type: "FETCH_SITEID_FAIL",
//           payload: error.response?.data?.error || "Error fetching sites",
//         });
//         toast.error(error.response.data.error || "Error fetching sites");
//       }
//     };
//     fetchSiteIds();
//     fetchDprDetails();
//   }, [id]);

//   const handleChange = (e) => {
//     dispatch({ type: "SET_FIELD", name: e.target.name, value: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     dispatch({ type: "UPDATE_REQUEST" });

//     try {
//       const {
//         createdAt,
//         _id,
//         last_activity,
//         assigned_to,
//         created_by,
//         ...updatedData
//       } = state.dprData;
//       const result = await axios.put(
//         `/api/v1/techniciandprs/${id}`,
//         updatedData,
//         {
//           // headers: { Authorization: `Bearer ${authtoken}` },
//           withCredentials: true,
//         },
//       );
//       toast.success(result.data.message);
//       dispatch({ type: "UPDATE_SUCCESS" });
//       navigate(`/${adminroute}/all-site-dpr`);
//     } catch (error) {
//       dispatch({
//         type: "UPDATE_FAIL",
//         payload: error.response?.data?.error || "Error updating DPR",
//       });
//       toast.error(error.response?.data?.error || "Error updating DPR");
//     }
//   };

//   return (
//     <div className="container mt-6">
//       <CCard>
//         <CCardHeader>
//           <h2>Update Technician Daily Progress Report (DPR)</h2>
//         </CCardHeader>

//         <CCardBody>
//           {state.loading ? (
//             <LoadingSpinner />
//           ) : (
//             <form onSubmit={handleSubmit}>
//               <CRow>
//                 <CCol>
//                   <label className="form-label">Site Id</label>
//                   <CFormSelect
//                     name="site_id"
//                     value={state.dprData.site_id}
//                     onChange={handleChange}
//                   >
//                     <option value="">Select Site Id</option>
//                     {state.sites?.length > 0 &&
//                       state.sites.map((item) => (
//                         <option key={item.site_id} value={item.site_id}>
//                           {item.site_id}
//                         </option>
//                       ))}
//                   </CFormSelect>
//                 </CCol>
//                 <CCol md="6">
//                   <div className="mb-3">
//                     <label className="form-label">Running Robots</label>

//                     <input
//                       type="text"
//                       className="form-control"
//                       name="total_running_robots"
//                       value={state.dprData.total_running_robots}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </CCol>

//                 <CCol md="6">
//                   <div className="mb-3">
//                     <label className="form-label">Failed Robots</label>

//                     <input
//                       type="text"
//                       className="form-control"
//                       name="total_failed_robots"
//                       value={state.dprData.total_failed_robots}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </CCol>

//                 <CCol md="6">
//                   <div className="mb-3">
//                     <label className="form-label">Total Robots</label>

//                     <input
//                       type="text"
//                       className="form-control"
//                       name="total_robots"
//                       value={state.dprData.total_robots}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </CCol>
//                 <CCol md="6">
//                   <div className="mb-3">
//                     <label className="form-label">robots_run_by</label>

//                     <input
//                       type="text"
//                       className="form-control"
//                       name="robots_run_by"
//                       value={state.dprData.robots_run_by}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </CCol>

//                 <CCol md="6">
//                   <div className="mb-3">
//                     <label className="form-label">Comments</label>

//                     <input
//                       type="text"
//                       className="form-control"
//                       name="comments"
//                       value={state.dprData.comments}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </CCol>
//                 <CCol md="6">
//                   <div className="mb-3">
//                     <label className="form-label"> Date</label>
//                     {userInfo.role === "Master Admin" ? (
//                       <input
//                         type="date"
//                         className="form-control"
//                         name="report_date"
//                         value={state.dprData.report_date.split("T")[0]}
//                         onChange={handleChange}
//                       />
//                     ) : (
//                       <input
//                         type="text"
//                         className="form-control"
//                         value={state.dprData.report_date.split("T")[0]}
//                         readOnly
//                         disabled
//                       />
//                     )}
//                   </div>
//                 </CCol>
//                 <CTable striped bordered className="mt-2 bg-important">
//                   <CTableHead color="secondary">
//                     <CTableRow>
//                       <CTableHeaderCell>#</CTableHeaderCell>
//                       <CTableHeaderCell>Image</CTableHeaderCell>
//                       <CTableHeaderCell>Name</CTableHeaderCell>
//                       <CTableHeaderCell style={{ width: "80px" }}>
//                         Actions
//                       </CTableHeaderCell>
//                     </CTableRow>
//                   </CTableHead>
//                   <CTableBody>
//                     {state.dprData.technician_present.map((tech, index) => (
//                       <CTableRow key={index}>
//                         <CTableHeaderCell>{index + 1}</CTableHeaderCell>
//                         <CTableDataCell>
//                           <CAvatar src={tech.profile_image} className="me-2" />
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {tech.name} - {tech.email}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           <CFormCheck
//                             checked={state.dprData.technician_present.some(
//                               (t) => t.technician_id === tech._id,
//                             )}
//                             onChange={(e) => {
//                               const updatedList = e.target.checked
//                                 ? [
//                                     ...state.dprData.technician_present,
//                                     {
//                                       name: tech.username,
//                                       email: tech.email,
//                                       technician_id: tech._id, // Ensure consistent field name
//                                       _id: tech._id, // Ensure consistent field name
//                                       role: tech.role,
//                                       profile_image: tech.profile_image,
//                                     },
//                                   ]
//                                 : state.dprData.technician_present.filter(
//                                     (t) => t.technician_id !== tech._id, // Match correctly
//                                   );

//                               dispatch({
//                                 type: "SET_FIELD",
//                                 name: "technician_present",
//                                 value: updatedList,
//                               });
//                             }}
//                           />
//                         </CTableDataCell>
//                       </CTableRow>
//                     ))}
//                   </CTableBody>
//                 </CTable>
//               </CRow>
//               <CButton
//                 size="sm"
//                 type="submit"
//                 siz
//                 className="btn btn-primary mt-3"
//               >
//                 {state.updateLoading ? (
//                   <>
//                     upadting..
//                     <LoadingSpinner />
//                   </>
//                 ) : (
//                   "Update"
//                 )}
//               </CButton>
//             </form>
//           )}
//         </CCardBody>
//       </CCard>
//     </div>
//   );
// };

// export default UpdateDpr;

import axios from "axios";
import React, { useEffect, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import {
  CAvatar,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormCheck,
  CFormSelect,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";

import LoadingSpinner from "../../../components/LoadingSpinner";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_DPR_REQUEST":
      return { ...state, loading: true };

    case "FETCH_DPR_SUCCESS":
      return {
        ...state,
        loading: false,
        dprData: action.payload,
      };

    case "FETCH_DPR_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "SET_FIELD":
      return {
        ...state,
        dprData: {
          ...state.dprData,
          [action.name]: action.value,
        },
      };

    case "FETCH_SITE_SUCCESS":
      return {
        ...state,
        sites: action.payload,
      };

    case "FETCH_TECHNICIAN_SUCCESS":
      return {
        ...state,
        technicians: action.payload,
      };

    case "UPDATE_REQUEST":
      return {
        ...state,
        updateLoading: true,
      };

    case "UPDATE_SUCCESS":
      return {
        ...state,
        updateLoading: false,
      };

    case "UPDATE_FAIL":
      return {
        ...state,
        updateLoading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

const UpdateDpr = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const userInfo = useSelector((state) => state.userInfo);

  let adminroute = "";

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    adminroute = "project-admin";
  } else if (userInfo?.role === "Master User") {
    adminroute = "master-user";
  } else if (userInfo?.role === "Service User") {
    adminroute = "service-user";
  } else if (userInfo?.role === "Project User") {
    adminroute = "project-user";
  }

  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    updateLoading: false,
    error: "",

    sites: [],
    technicians: [],

    dprData: {
      site_id: "",
      total_running_robots: "",
      total_failed_robots: "",
      total_robots: "",
      robots_run_by: "",
      comments: "",
      report_date: "",
      technician_present: [],
    },
  });

  const fetchTechnicians = async () => {
    try {
      const result = await axios.get(
        `/api/v1/users/role/sitetechnician/${state.dprData.site_id}`,
        {
          withCredentials: true,
        },
      );

      dispatch({
        type: "FETCH_TECHNICIAN_SUCCESS",
        payload: result.data.data,
      });
    } catch (error) {
      toast.error(error.response?.data?.error || "Error fetching technicians");
    }
  };

  useEffect(() => {
    const fetchDpr = async () => {
      try {
        dispatch({ type: "FETCH_DPR_REQUEST" });

        const result = await axios.get(`/api/v1/techniciandprs/${id}`, {
          withCredentials: true,
        });

        dispatch({
          type: "FETCH_DPR_SUCCESS",
          payload: result.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_DPR_FAIL",
          payload: error.response?.data?.error || "Error fetching DPR",
        });

        toast.error(
          error.response?.data?.error || "Error fetching DPR details",
        );
      }
    };

    const fetchSites = async () => {
      try {
        const result = await axios.get(`/api/v1/sites`, {
          withCredentials: true,
        });

        dispatch({
          type: "FETCH_SITE_SUCCESS",
          payload: result.data.data,
        });
      } catch (error) {
        toast.error(error.response?.data?.error || "Error fetching sites");
      }
    };

    fetchDpr();
    fetchSites();
    if (state.dprData.site_id) {
      fetchTechnicians();
    }
  }, [id, state.dprData.site_id]);

  // const handleChange = (e) => {
  //   dispatch({
  //     type: "SET_FIELD",
  //     name: e.target.name,
  //     value: e.target.value,
  //   });
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const robotFields = [
      "online_operational",
      "manual_operational",
      "unoperational",
      "ready_for_operational",
      "robots_uptime",
    ];

    if (robotFields.includes(name)) {
      dispatch({
        type: "SET_FIELD",
        name: "robots_operational_details",
        value: {
          ...state.dprData.robots_operational_details,
          [name]: Number(value),
        },
      });

      return;
    }

    dispatch({
      type: "SET_FIELD",
      name,
      value,
    });
  };
  const handleTechnicianToggle = (technician, checked) => {
    let updatedList = [...state.dprData.technician_present];

    if (checked) {
      updatedList.push({
        technician_id: technician._id,
        name: technician.username,
        email: technician.email,
        role: technician.role,
        profile_image: technician.profile_image,
      });
    } else {
      updatedList = updatedList.filter(
        (item) => item.technician_id !== technician._id,
      );
    }

    dispatch({
      type: "SET_FIELD",
      name: "technician_present",
      value: updatedList,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch({ type: "UPDATE_REQUEST" });

      // const {
      //   _id,
      //   updatedAt,
      //   last_activity,
      //   created_by,
      //   assigned_to,
      //   __v,
      //   ...payload
      // } = state.dprData;

      const payload = {
        site_id: state.dprData.site_id,
        total_robots: state.dprData.total_robots,
        robots_run_by: state.dprData.robots_run_by,
        comments: state.dprData.comments,

        new_report_date: state.dprData.new_report_date,
        technician_present: state.dprData.technician_present,

        robots_operational_details: state.dprData.robots_operational_details,
      };

      const result = await axios.put(`/api/v1/techniciandprs/${id}`, payload, {
        withCredentials: true,
      });

      toast.success(result.data.message);

      dispatch({ type: "UPDATE_SUCCESS" });

      navigate(`/${adminroute}/all-site-dpr`);
    } catch (error) {
      dispatch({
        type: "UPDATE_FAIL",
        payload: error.response?.data?.error || "Error updating DPR",
      });

      toast.error(error.response?.data?.error || "Error updating DPR");
    }
  };

  return (
    <div className="container mt-4">
      <CCard>
        <CCardHeader>
          <h4>Update Technician DPR</h4>
        </CCardHeader>

        <CCardBody>
          {state.loading ? (
            <LoadingSpinner />
          ) : (
            <form onSubmit={handleSubmit}>
              <CRow>
                <CCol md={6} className="mb-3">
                  <label className="form-label">Site ID</label>

                  <CFormSelect
                    name="site_id"
                    value={state.dprData.site_id}
                    onChange={handleChange}
                  >
                    <option value="">Select Site</option>

                    {state.sites?.map((site) => (
                      <option key={site._id} value={site.site_id}>
                        {site.site_id}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>

                <CCol md={6} className="mb-3">
                  <label className="form-label">Running Robots</label>

                  <input
                    type="number"
                    className="form-control"
                    name="online_operational"
                    value={
                      state.dprData?.robots_operational_details
                        ?.online_operational
                    }
                    onChange={handleChange}
                  />
                </CCol>

                <CCol md={6} className="mb-3">
                  <label className="form-label">Failed Robots</label>

                  <input
                    type="number"
                    className="form-control"
                    name="unoperational"
                    value={
                      state.dprData?.robots_operational_details?.unoperational
                    }
                    onChange={handleChange}
                  />
                </CCol>
                <CCol md={6} className="mb-3">
                  <label className="form-label">
                    Manual Operational Robots
                  </label>

                  <input
                    type="number"
                    className="form-control"
                    name="manual_operational"
                    value={
                      state.dprData?.robots_operational_details
                        ?.manual_operational
                    }
                    onChange={handleChange}
                  />
                </CCol>

                <CCol md={6} className="mb-3">
                  <label className="form-label">Total Robots</label>

                  <input
                    type="number"
                    className="form-control"
                    name="total_robots"
                    value={state.dprData.total_robots}
                    onChange={handleChange}
                  />
                </CCol>

                <CCol md={6} className="mb-3">
                  <label className="form-label">Robots Run By</label>

                  <input
                    type="text"
                    className="form-control"
                    name="robots_run_by"
                    value={state.dprData.robots_run_by}
                    onChange={handleChange}
                  />
                </CCol>

                <CCol md={6} className="mb-3">
                  <label className="form-label">Comments</label>

                  <textarea
                    type="text"
                    rows={5}
                    className="form-control"
                    name="comments"
                    value={state.dprData.comments}
                    onChange={handleChange}
                  />
                </CCol>

                <CCol md={6} className="mb-3">
                  <label className="form-label">Report Date</label>

                  <input
                    type="date"
                    className="form-control"
                    name="new_report_date"
                    value={
                      state.dprData.new_report_date
                        ? new Date(state.dprData.new_report_date)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={handleChange}
                  />
                </CCol>
              </CRow>

              <h5 className="mt-4 mb-3">Technicians Present</h5>

              <CTable bordered striped responsive>
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Image</CTableHeaderCell>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Select</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {state.technicians?.map((tech, index) => (
                    <CTableRow key={tech._id}>
                      <CTableDataCell>{index + 1}</CTableDataCell>

                      <CTableDataCell>
                        <CAvatar src={tech.profile_image} />
                      </CTableDataCell>

                      <CTableDataCell>
                        {tech.username}
                        <br />
                        <small>{tech.email}</small>
                      </CTableDataCell>

                      <CTableDataCell>
                        <CFormCheck
                          checked={state.dprData.technician_present?.some(
                            (item) =>
                              item.technician_id === tech._id ||
                              item._id === tech._id,
                          )}
                          onChange={(e) =>
                            handleTechnicianToggle(tech, e.target.checked)
                          }
                        />
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>

              <CButton
                type="submit"
                color="primary"
                className="mt-3"
                disabled={state.updateLoading}
              >
                {state.updateLoading ? "Updating..." : "Update DPR"}
              </CButton>
            </form>
          )}
        </CCardBody>
      </CCard>
    </div>
  );
};

export default UpdateDpr;
