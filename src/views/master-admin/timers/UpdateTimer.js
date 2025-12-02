// import axios from "axios";
// import React, { useState, useEffect, useReducer } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { useSelector } from "react-redux";
// import LoadingSpinner from "../../../components/LoadingSpinner";
// import {
//   CAlert,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CCol,
//   CRow,
// } from "@coreui/react";

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "FETCH_REQUEST":
//       return { ...state, loading: true, error: "" };
//     case "FETCH_SUCCESS":
//       return { ...state, timer: action.payload, loading: false };
//     case "FETCH_FAIL":
//       return { ...state, loading: false, error: action.payload };
//     case "UPDATE_REQUEST":
//       return { ...state, updating: true };
//     case "UPDATE_SUCCESS":
//       return { ...state, updating: false };
//     case "UPDATE_FAIL":
//       return { ...state, updating: false, error: action.payload };
//     default:
//       return state;
//   }
// };

// const UpdateTimer = () => {
//   const [{ loading, error, updating }, dispatch] = useReducer(reducer, {
//     loading: true,
//     error: "",
//     updating: false,
//   });

//   const { block, site_id } = useParams();
//   const authtoken = useSelector((state) => state.authtoken);
//   const navigate = useNavigate();
//   const userInfo = useSelector((state) => state.userInfo);

//   const [timerData, setTimerData] = useState({
//     timer1: "",
//     timer1_date: "",
//     timer2: "",
//     timer2_date: "",
//     timer3: "",
//     timer3_date: "",
//   });

//   useEffect(() => {
//     const fetchTimer = async () => {
//       try {
//         dispatch({ type: "FETCH_REQUEST" });

//         const { data } = await axios.get(
//           `/api/v1/robots/get-timer-by-siteid-block/${block}/${site_id}`,
//           {
//             headers: { Authorization: `Bearer ${authtoken}` },
//           }
//         );

//         if (data?.data?.length > 0 && data.data[0]?.robots?.length > 0) {
//           setTimerData({
//             timer1: data.data[0].robots[0].timer1 || "",
//             timer1_date: data.data[0].robots[0].timer1_date || "",
//             timer2: data.data[0].robots[0].timer2 || "",
//             timer2_date: data.data[0].robots[0].timer2_date || "",
//             timer3: data.data[0].robots[0].timer3 || "",
//             timer3_date: data.data[0].robots[0].timer3_date || "",
//           });
//         }

//         dispatch({ type: "FETCH_SUCCESS" });
//       } catch (error) {
//         dispatch({
//           type: "FETCH_FAIL",
//           payload: error.response?.data || "Failed to fetch data",
//         });
//         toast.error(error.response?.data || "Failed to fetch data");
//       }
//     };

//     fetchTimer();
//   }, [block, site_id, authtoken]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setTimerData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   let adminroute = "";

//   if (userInfo.role === "Master Admin") {
//     adminroute = "master-admin";
//   } else if (userInfo.role === "Service Admin") {
//     adminroute = "service-admin";
//   } else if (userInfo.role === "Project Admin") {
//     adminroute = "project-admin";
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       dispatch({ type: "UPDATE_REQUEST" });

//       const result = await axios.put(
//         `/api/v1/robots/update-timer-blockwise/${block}/${site_id}`,
//         timerData,
//         {
//           headers: { Authorization: `Bearer ${authtoken}` },
//         }
//       );

//       dispatch({ type: "UPDATE_SUCCESS" });
//       toast.success(result.data.message);

//       navigate(`/${adminroute}/timers`);
//     } catch (error) {
//       dispatch({
//         type: "UPDATE_FAIL",
//         payload: error.response?.data || "Update failed",
//       });
//       toast.error(error.response?.data || "Update failed");
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <CCard>
//         <CCardHeader>
//           Update Timer -{" "}
//           <b className="badge bg-success">
//             {site_id} : {block}
//           </b>
//         </CCardHeader>
//         {loading ? (
//           <div className="d-flex mt-2 justify-content-center align-items-center">
//             <LoadingSpinner />
//           </div>
//         ) : error ? (
//           <CAlert color="danger">{error}</CAlert>
//         ) : (
//           <CCardBody>
//             <form onSubmit={handleSubmit}>
//               <CRow>
//                 <CCol>
//                   <div className="mb-3">
//                     <label className="form-label">Timer1</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       name="timer1"
//                       value={timerData.timer1}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </CCol>
//                 <CCol>
//                   <div className="mb-3">
//                     <label className="form-label">Timer1_date</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       name="timer1_date"
//                       value={timerData.timer1_date}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </CCol>
//                 <CCol>
//                   <div className="mb-3">
//                     <label className="form-label">Timer2</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       name="timer2"
//                       value={timerData.timer2}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </CCol>
//               </CRow>
//               <CRow>
//                 <CCol>
//                   <div className="mb-3">
//                     <label className="form-label">Timer2_date</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       name="timer2_date"
//                       value={timerData.timer2_date}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </CCol>
//                 <CCol>
//                   <div className="mb-3">
//                     <label className="form-label">Timer3</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       name="timer3"
//                       value={timerData.timer3}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </CCol>
//                 <CCol>
//                   <div className="mb-3">
//                     <label className="form-label">Timer3_date</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       name="timer3_date"
//                       value={timerData.timer3_date}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </CCol>
//               </CRow>
//               <button
//                 type="submit"
//                 className="btn btn-warning btn-sm"
//                 disabled={updating}
//               >
//                 {updating ? "Updating..." : "Update"}
//               </button>
//             </form>
//           </CCardBody>
//         )}
//       </CCard>
//     </div>
//   );
// };

// export default UpdateTimer;
import axios from "axios";
import React, { useState, useEffect, useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  CAlert,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
} from "@coreui/react";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, timer: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, updating: true };
    case "UPDATE_SUCCESS":
      return { ...state, updating: false };
    case "UPDATE_FAIL":
      return { ...state, updating: false, error: action.payload };
    default:
      return state;
  }
};

const UpdateTimer = () => {
  const [{ loading, error, updating }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    updating: false,
  });

  const { block, site_id } = useParams();
  const authtoken = useSelector((state) => state.authtoken);
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.userInfo);

  const [timerData, setTimerData] = useState({
    timer1: "",
    timer1_date: "",
    timer2: "",
    timer2_date: "",
    timer3: "",
    timer3_date: "",
  });

  useEffect(() => {
    const fetchTimer = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axios.get(
          `/api/v1/robots/get-timer-by-siteid-block/${block}/${site_id}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );

        if (data?.data?.length > 0 && data.data[0]?.robots?.length > 0) {
          setTimerData({
            timer1: data.data[0].robots[0].timer1 || "",
            timer1_date: data.data[0].robots[0].timer1_date || "",
            timer2: data.data[0].robots[0].timer2 || "",
            timer2_date: data.data[0].robots[0].timer2_date || "",
            timer3: data.data[0].robots[0].timer3 || "",
            timer3_date: data.data[0].robots[0].timer3_date || "",
          });
        }

        dispatch({ type: "FETCH_SUCCESS" });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data || "Failed to fetch data",
        });
        toast.error(error.response?.data || "Failed to fetch data");
      }
    };

    fetchTimer();
  }, [block, site_id, authtoken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTimerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  let adminroute = "";
  if (userInfo.role === "Master Admin") adminroute = "master-admin";
  else if (userInfo.role === "Service Admin") adminroute = "service-admin";
  else if (userInfo.role === "Project Admin") adminroute = "project-admin";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch({ type: "UPDATE_REQUEST" });

      const result = await axios.put(
        `/api/v1/robots/update-timer-blockwise/${block}/${site_id}`,
        timerData,
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
      );

      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success(result.data.message);
      navigate(`/${adminroute}/timers`);
    } catch (error) {
      dispatch({
        type: "UPDATE_FAIL",
        payload: error.response?.data || "Update failed",
      });
      toast.error(error.response?.data || "Update failed");
    }
  };

  const renderTimerInput = (timerKey, label) => {
    return (
      <CCol>
        <div className="mb-3">
          <label className="form-label">{label}</label>
          <input
            type="time"
            className="form-control"
            name={timerKey}
            value={
              timerData[timerKey] === "25:00:00" ? "" : timerData[timerKey]
            }
            onChange={handleChange}
            step="1"
            disabled={timerData[timerKey] === "25:00:00"}
          />
          <div className="form-check mt-1">
            <input
              className="form-check-input"
              type="checkbox"
              checked={timerData[timerKey] === "25:00:00"}
              onChange={(e) =>
                setTimerData((prev) => ({
                  ...prev,
                  [timerKey]: e.target.checked ? "25:00:00" : "00:00:00",
                }))
              }
              id={`disable-${timerKey}`}
            />
            <label className="form-check-label" htmlFor={`disable-${timerKey}`}>
              Disable Timer
            </label>
          </div>
        </div>
      </CCol>
    );
  };

  return (
    <div className="container mt-4">
      <CCard>
        <CCardHeader>
          Update Timer -{" "}
          <b className="badge bg-success">
            {site_id} : {block}
          </b>
        </CCardHeader>
        {loading ? (
          <div className="d-flex mt-2 justify-content-center align-items-center">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <CAlert color="danger">{error}</CAlert>
        ) : (
          <CCardBody>
            <form onSubmit={handleSubmit}>
              <CRow>
                {/* Timer1 */}
                {renderTimerInput("timer1", "Timer1")}
                <CCol>
                  <div className="mb-3">
                    <label className="form-label">Timer1_date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="timer1_date"
                      value={timerData.timer1_date}
                      onChange={handleChange}
                    />
                  </div>
                </CCol>

                {/* Timer2 */}
                {renderTimerInput("timer2", "Timer2")}
                <CCol>
                  <div className="mb-3">
                    <label className="form-label">Timer2_date</label>
                    <input
                      type="text"
                      className="form-control"
                      name="timer2_date"
                      value={timerData.timer2_date}
                      onChange={handleChange}
                    />
                  </div>
                </CCol>

                {/* Timer3 */}
                {renderTimerInput("timer3", "Timer3")}
                <CCol>
                  <div className="mb-3">
                    <label className="form-label">Timer3_date</label>
                    <input
                      type="text"
                      className="form-control"
                      name="timer3_date"
                      value={timerData.timer3_date}
                      onChange={handleChange}
                    />
                  </div>
                </CCol>
              </CRow>
              <button
                type="submit"
                className="btn btn-warning btn-sm"
                disabled={updating}
              >
                {updating ? "Updating..." : "Update"}
              </button>
            </form>
          </CCardBody>
        )}
      </CCard>
    </div>
  );
};

export default UpdateTimer;
