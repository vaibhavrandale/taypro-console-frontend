// import axios from "axios";
// import React, { useState, useEffect, useReducer } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { useSelector } from "react-redux";
// import LoadingSpinner from "../../../components/LoadingSpinner";
// import {
//   CAlert,
//   CButton,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CCol,
//   CRow,
// } from "@coreui/react";
// import TimerInstructionModal from "../../../components/TimerInstructionModal";

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "FETCH_REQUEST":
//       return { ...state, fetchLoading: true, fetchError: "" };
//     case "FETCH_SUCCESS":
//       return { ...state, timers: action.payload, fetchLoading: false };
//     case "FETCH_FAIL":
//       return { ...state, fetchLoading: false, fetchError: action.payload };
//     case "UPDATE_REQUEST":
//       return { ...state, updateLoading: true };
//     case "UPDATE_SUCCESS":
//       return { ...state, updateLoading: false };
//     case "UPDATE_FAIL":
//       return { ...state, updateLoading: false, updateError: action.payload };
//     default:
//       return state;
//   }
// };

// const UpdateTimer = () => {
//   const [
//     { fetchLoading, fetchError, updateLoading, timers, updateError },
//     dispatch,
//   ] = useReducer(reducer, {
//     fetchLoading: true,
//     fetchError: "",
//     updateLoading: false,
//     timers: {},
//     updateError: "",
//   });

//   const { id } = useParams();
//   // const authtoken = useSelector((state) => state.authtoken);
//   const navigate = useNavigate();
//   const userInfo = useSelector((state) => state.userInfo);
//   const [showModal, setShowModal] = useState(false);
//   const [timerData, setTimerData] = useState({
//     timer1: "00:00:00",
//     timer1_date: "",
//     timer2: "00:00:00",
//     timer2_date: "",
//     timer3: "00:00:00",
//     timer3_date: "",
//     timer_command: "11",
//   });

//   useEffect(() => {
//     const fetchTimer = async () => {
//       try {
//         dispatch({ type: "FETCH_REQUEST" });

//         const data = await axios.get(`/api/v1/timers/${id}`, {
//           // headers: { Authorization: `Bearer ${authtoken}` },
//           withCredentials: true,
//         });

//         dispatch({ type: "FETCH_SUCCESS", payload: data.data.data });
//         console.log(data.data.data);
//         setTimerData({
//           site_id: data.data.data?.site_id || "",
//           block: data.data.data?.block || "",
//           timer1: data.data.data?.timer1 || "25:00:00",
//           timer1_date: data.data.data?.timer1_date || "",
//           timer2: data.data.data?.timer2 || "25:00:00",
//           timer2_date: data.data.data?.timer2_date || "",
//           timer3: data.data.data?.timer3 || "25:00:00",
//           timer3_date: data.data.data?.timer3_date || "",
//           timer_command: data.data.data?.timer_command || "11",
//         });
//       } catch (error) {
//         dispatch({
//           type: "FETCH_FAIL",
//           payload: error.response?.data || "Failed to fetch data",
//         });
//         toast.error(error.response?.data || "Failed to fetch data");
//       }
//     };

//     fetchTimer();
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setTimerData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   let adminroute = "";
//   if (userInfo.role === "Master Admin") adminroute = "master-admin";
//   else if (userInfo.role === "Service Admin") adminroute = "service-admin";
//   else if (userInfo.role === "Project Admin") adminroute = "project-admin";
//   else if (userInfo.role === "Project User") adminroute = "project-user";
//   else if (userInfo.role === "Service User") adminroute = "service-user";
//   else if (userInfo.role === "Master User") adminroute = "master-user";
//   else if (userInfo.role === "Client Admin") adminroute = "client-admin";
//   else if (userInfo.role === "Site Incharge") adminroute = "site-incharge";
//   else if (userInfo.role === "Client Site Technician")
//     adminroute = "client-site-technician";
//   else if (userInfo?.role === "Site Technician") {
//     adminroute = "site-technician";
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       dispatch({ type: "UPDATE_REQUEST" });

//       const result = await axios.put(`/api/v1/timers/${id}`, timerData, {
//         // headers: { Authorization: `Bearer ${authtoken}` },
//         withCredentials: true,
//       });

//       dispatch({ type: "UPDATE_SUCCESS" });
//       toast.success(result.data.message);
//       navigate(`/${adminroute}/timers`);
//     } catch (error) {
//       dispatch({
//         type: "UPDATE_FAIL",
//         payload:
//           error.response?.data.error ||
//           error.response?.data.message ||
//           "Failed to update timer",
//       });
//       toast.error(
//         error.response?.data.error ||
//           error.response?.data.message ||
//           "Failed to update timer",
//       );
//     }
//   };

//   const renderTimerInput = (timerKey, label) => {
//     return (
//       <CCol>
//         <div className="mb-3">
//           <label className="form-label">{label}</label>
//           <input
//             type="time"
//             className="form-control"
//             name={timerKey}
//             value={
//               timerData[timerKey] === "25:00:00" ? "" : timerData[timerKey]
//             }
//             onChange={handleChange}
//             step="1"
//             disabled={timerData[timerKey] === "25:00:00"}
//           />
//           <div className="form-check mt-1">
//             <input
//               className="form-check-input"
//               type="checkbox"
//               checked={timerData[timerKey] === "25:00:00"}
//               onChange={(e) =>
//                 setTimerData((prev) => ({
//                   ...prev,
//                   [timerKey]: e.target.checked ? "25:00:00" : "00:00:00",
//                 }))
//               }
//               id={`disable-${timerKey}`}
//             />
//             <label className="form-check-label" htmlFor={`disable-${timerKey}`}>
//               Disable Timer
//             </label>
//           </div>
//         </div>
//       </CCol>
//     );
//   };

//   return (
//     <div className=" mt-4">
//       {fetchLoading ? (
//         <div className="d-flex mt-2 justify-content-center align-items-center">
//           <LoadingSpinner />
//         </div>
//       ) : fetchError ? (
//         <CAlert color="danger">{fetchError}</CAlert>
//       ) : (
//         <CCard>
//           <CCardHeader className="d-flex justify-content-between align-items-center flex-wrap">
//             <div>
//               Update Timer -{" "}
//               <span className="badge bg-warning p-2">
//                 {timerData.site_id} : {timerData.block}
//               </span>
//             </div>
//             <CButton size="sm" color="info" onClick={() => setShowModal(true)}>
//               ?
//             </CButton>
//             <TimerInstructionModal
//               visible={showModal}
//               onClose={() => setShowModal(false)}
//             />
//           </CCardHeader>
//           <CCardBody>
//             <form onSubmit={handleSubmit}>
//               <CRow>
//                 {/* Timer1 */}
//                 {renderTimerInput("timer1", "Timer1")}
//                 <CCol>
//                   <div className="mb-3">
//                     <label className="form-label">Timer1_date</label>
//                     <input
//                       type="date"
//                       className="form-control"
//                       name="timer1_date"
//                       value={timerData.timer1_date}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </CCol>

//                 {/* Timer2 */}
//                 {renderTimerInput("timer2", "Timer2")}
//                 <CCol>
//                   <div className="mb-3">
//                     <label className="form-label">Timer2_date</label>
//                     <input
//                       type="date"
//                       className="form-control"
//                       name="timer2_date"
//                       value={timerData.timer2_date}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </CCol>

//                 {/* Timer3 */}
//                 {renderTimerInput("timer3", "Timer3")}
//                 <CCol>
//                   <div className="mb-3">
//                     <label className="form-label">Timer3_date</label>
//                     <input
//                       type="date"
//                       className="form-control"
//                       name="timer3_date"
//                       value={timerData.timer3_date}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </CCol>
//               </CRow>
//               <div className="form-check mt-1">
//                 <input
//                   className="form-check-input"
//                   type="checkbox"
//                   checked={timerData.timer_command === "13"}
//                   onChange={(e) =>
//                     setTimerData((prev) => ({
//                       ...prev,
//                       timer_command: e.target.checked ? "13" : "11",
//                     }))
//                   }
//                   id={`disable-${"timer_command"}`}
//                 />
//                 <label
//                   className="form-check-label"
//                   htmlFor={`disable-${"timer_command"}`}
//                 >
//                   Timer Command
//                 </label>
//               </div>
//               <div className="d-flex justify-content-start mt-2 mb-3">
//                 <span className="badge bg-success m-1 fs-6">
//                   Checked - Intelligent - 13
//                 </span>
//                 ,{" "}
//                 <span className="badge bg-danger m-1 fs-6">
//                   Unchecked - Normal - 11
//                 </span>
//               </div>
//               <div className="d-flex justify-content-end">
//                 <button
//                   type="submit"
//                   className="btn btn-warning btn-sm"
//                   disabled={updateLoading}
//                 >
//                   {updateLoading ? "Updating..." : "Update"}
//                 </button>
//               </div>
//             </form>
//           </CCardBody>
//         </CCard>
//       )}
//     </div>
//   );
// };

// export default UpdateTimer;

import axios from "axios";
import React, {
  useState,
  useEffect,
  useReducer,
  useMemo,
  useCallback,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  CAlert,
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CFormSwitch,
  CRow,
  CSpinner,
  CTooltip,
} from "@coreui/react";
import TimerInstructionModal from "../../../components/TimerInstructionModal";

/* ----------------------------- Constants ----------------------------- */

// "25:00:00" is the sentinel value the device firmware treats as "timer off"
const TIMER_DISABLED = "25:00:00";
const TIMER_DEFAULT_ENABLED = "00:00:00";

const COMMAND_NORMAL = "11";
const COMMAND_INTELLIGENT = "13";

const COMMANDS = [
  { value: COMMAND_NORMAL, label: "Normal", color: "success" },
  { value: COMMAND_INTELLIGENT, label: "Intelligent", color: "warning" },
];

const TIMERS = [
  { key: "timer1", dateKey: "timer1_date", label: "Timer 1" },
  { key: "timer2", dateKey: "timer2_date", label: "Timer 2" },
  { key: "timer3", dateKey: "timer3_date", label: "Timer 3" },
];

const ROLE_ROUTES = {
  "Master Admin": "master-admin",
  "Service Admin": "service-admin",
  "Project Admin": "project-admin",
  "Project User": "project-user",
  "Service User": "service-user",
  "Master User": "master-user",
  "Client Admin": "client-admin",
  "Site Incharge": "site-incharge",
  "Client Site Technician": "client-site-technician",
  "Site Technician": "site-technician",
};

const EMPTY_FORM = {
  site_id: "",
  block: "",
  timer1: TIMER_DISABLED,
  timer1_date: "",
  timer2: TIMER_DISABLED,
  timer2_date: "",
  timer3: TIMER_DISABLED,
  timer3_date: "",
  timer_command: COMMAND_NORMAL,
};

/* ------------------------------ Helpers ------------------------------ */

const getErrorMessage = (error, fallback) => {
  const data = error?.response?.data;
  if (typeof data === "string" && data) return data;
  return data?.error || data?.message || fallback;
};

const mapToForm = (data = {}) => ({
  site_id: data.site_id || "",
  block: data.block || "",
  timer1: data.timer1 || TIMER_DISABLED,
  timer1_date: data.timer1_date || "",
  timer2: data.timer2 || TIMER_DISABLED,
  timer2_date: data.timer2_date || "",
  timer3: data.timer3 || TIMER_DISABLED,
  timer3_date: data.timer3_date || "",
  timer_command: data.timer_command || COMMAND_NORMAL,
});

/* ------------------------------ Reducer ------------------------------ */

const initialState = {
  fetchLoading: true,
  fetchError: "",
  updateLoading: false,
  initial: EMPTY_FORM, // last server copy, used for the "unsaved changes" check
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, fetchLoading: true, fetchError: "" };
    case "FETCH_SUCCESS":
      return { ...state, fetchLoading: false, initial: action.payload };
    case "FETCH_FAIL":
      return { ...state, fetchLoading: false, fetchError: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, updateLoading: true };
    case "UPDATE_SUCCESS":
    case "UPDATE_FAIL":
      return { ...state, updateLoading: false };
    default:
      return state;
  }
};

/* --------------------------- Timer card UI --------------------------- */

const TimerCard = ({ label, timeKey, dateKey, form, onChange, onToggle }) => {
  const isDisabled = form[timeKey] === TIMER_DISABLED;

  return (
    <CCard
      className="h-100 rounded-0"
      style={{
        borderColor: isDisabled ? undefined : "var(--cui-success)",
        transition: "border-color 0.2s ease",
      }}
    >
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <strong>{label}</strong>
          <CBadge color={isDisabled ? "danger" : "success"}>
            {isDisabled ? "Disabled" : "Enabled"}
          </CBadge>
        </div>
        <CFormSwitch
          id={`enable-${timeKey}`}
          aria-label={`Enable ${label}`}
          checked={!isDisabled}
          onChange={(e) => onToggle(timeKey, e.target.checked)}
        />
      </CCardHeader>

      <CCardBody>
        {isDisabled ? (
          <div className="d-flex flex-column justify-content-center align-items-center text-center text-body-secondary h-100 py-4">
            <span className="fs-3 mb-1" aria-hidden="true">
              ⏻
            </span>
            <span>{label} is Disabled</span>
            <small>Enable to set a time</small>
          </div>
        ) : (
          <>
            <div className="mb-3">
              <CFormLabel htmlFor={timeKey}>Time</CFormLabel>
              <CFormInput
                id={timeKey}
                type="time"
                step="1"
                name={timeKey}
                value={form[timeKey]}
                onChange={onChange}
                required
              />
            </div>
            <div>
              <CFormLabel htmlFor={dateKey}>Date</CFormLabel>
              <CFormInput
                id={dateKey}
                type="date"
                name={dateKey}
                value={form[dateKey]}
                onChange={onChange}
              />
            </div>
          </>
        )}
      </CCardBody>
    </CCard>
  );
};

/* ------------------------- Command option card ------------------------ */

const CommandOption = ({ option, selected, onSelect }) => (
  <div
    role="radio"
    aria-checked={selected}
    tabIndex={0}
    onClick={() => onSelect(option.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect(option.value);
      }
    }}
    className="d-flex align-items-center gap-3 p-3 rounded h-100"
    style={{
      cursor: "pointer",
      border: `2px solid ${
        selected ? `var(--cui-${option.color})` : "var(--cui-border-color)"
      }`,
      background: selected
        ? `color-mix(in srgb, var(--cui-${option.color}) 12%, transparent)`
        : "transparent",
      transition: "all 0.15s ease",
    }}
  >
    <span
      aria-hidden="true"
      className="d-inline-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
      style={{
        width: 22,
        height: 22,
        border: `2px solid ${
          selected ? `var(--cui-${option.color})` : "var(--cui-border-color)"
        }`,
        background: selected ? `var(--cui-${option.color})` : "transparent",
        color: "#fff",
        fontSize: 12,
        lineHeight: 1,
      }}
    >
      {selected ? "✓" : ""}
    </span>
    <div>
      <div className="fw-semibold">{option.label}</div>
      <small className="text-body-secondary">Command {option.value}</small>
    </div>
  </div>
);

/* ----------------------------- Component ----------------------------- */

const UpdateTimer = () => {
  const [{ fetchLoading, fetchError, updateLoading, initial }, dispatch] =
    useReducer(reducer, initialState);

  const { id } = useParams();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.userInfo);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const adminRoute = ROLE_ROUTES[userInfo?.role] || "";
  const listPath = `/${adminRoute}/timers`;

  /* Fetch timer */
  useEffect(() => {
    const controller = new AbortController();

    const fetchTimer = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/v1/timers/${id}`, {
          withCredentials: true,
          signal: controller.signal,
        });
        const mapped = mapToForm(data.data);
        dispatch({ type: "FETCH_SUCCESS", payload: mapped });
        setForm(mapped);
      } catch (error) {
        if (axios.isCancel(error)) return;
        const message = getErrorMessage(error, "Failed to fetch data");
        dispatch({ type: "FETCH_FAIL", payload: message });
        toast.error(message);
      }
    };

    fetchTimer();
    return () => controller.abort();
  }, [id]);

  /* Handlers */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleToggleTimer = useCallback((key, enabled) => {
    setForm((prev) => ({
      ...prev,
      [key]: enabled ? TIMER_DEFAULT_ENABLED : TIMER_DISABLED,
    }));
  }, []);

  const setCommand = (command) =>
    setForm((prev) => ({ ...prev, timer_command: command }));

  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(initial),
    [form, initial],
  );

  const handleReset = () => setForm(initial);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      const result = await axios.put(`/api/v1/timers/${id}`, form, {
        withCredentials: true,
      });
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success(result.data.message);
      navigate(listPath);
    } catch (error) {
      dispatch({ type: "UPDATE_FAIL" });
      toast.error(getErrorMessage(error, "Failed to update timer"));
    }
  };

  /* Loading / error states */
  if (fetchLoading) {
    return (
      <div className="d-flex mt-4 justify-content-center align-items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="mt-4">
        <CAlert
          color="danger"
          className="d-flex justify-content-between align-items-center"
        >
          <span>{fetchError}</span>
          <CButton
            size="sm"
            color="danger"
            variant="outline"
            onClick={() => navigate(listPath)}
          >
            Back to timers
          </CButton>
        </CAlert>
      </div>
    );
  }

  return (
    <div className="mt-2">
      {" "}
      <CButton
        type="button"
        size="sm"
        color="secondary"
        variant="outline"
        className="my-2"
        onClick={() => navigate(listPath)}
      >
        ← Back
      </CButton>
      <form onSubmit={handleSubmit}>
        <CCard className="rounded-0">
          {/* Header */}
          <CCardHeader className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <h5 className="mb-0">Update Timer</h5>
              <CBadge color="warning" className="p-2">
                {form.site_id} : {form.block}
              </CBadge>
              {isDirty && (
                <CBadge color="info" shape="rounded-pill">
                  Unsaved changes
                </CBadge>
              )}
            </div>

            <CTooltip content="Timer instructions">
              <CButton
                type="button"
                size="sm"
                color="info"
                variant="outline"
                aria-label="Timer instructions"
                onClick={() => setShowModal(true)}
              >
                ? Help
              </CButton>
            </CTooltip>
            <TimerInstructionModal
              visible={showModal}
              onClose={() => setShowModal(false)}
            />
          </CCardHeader>

          <CCardBody className="rounded-0">
            {/* Timers */}
            <h6 className="text-body-secondary text-uppercase mb-3">
              Schedules
            </h6>
            <CRow className="g-3 mb-4">
              {TIMERS.map(({ key, dateKey, label }) => (
                <CCol key={key} xs={12} md={6} xl={4}>
                  <TimerCard
                    label={label}
                    timeKey={key}
                    dateKey={dateKey}
                    form={form}
                    onChange={handleChange}
                    onToggle={handleToggleTimer}
                  />
                </CCol>
              ))}
            </CRow>

            {/* Command mode */}
            <h6 className="text-body-secondary text-uppercase mb-3">
              Timer Command
            </h6>
            <CRow
              className="g-3"
              role="radiogroup"
              aria-label="Timer command mode"
            >
              {COMMANDS.map((option) => (
                <CCol key={option.value} xs={12} md={6} xl={4}>
                  <CommandOption
                    option={option}
                    selected={form.timer_command === option.value}
                    onSelect={setCommand}
                  />
                </CCol>
              ))}
            </CRow>
          </CCardBody>

          {/* Actions */}
          <CCardFooter className="d-flex justify-content-end gap-2">
            <CButton
              type="button"
              color="secondary"
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={!isDirty || updateLoading}
            >
              Reset
            </CButton>
            <CButton
              type="submit"
              color="warning"
              size="sm"
              disabled={!isDirty || updateLoading}
            >
              {updateLoading ? (
                <>
                  <CSpinner size="sm" className="me-2" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </CButton>
          </CCardFooter>
        </CCard>
      </form>
    </div>
  );
};

export default UpdateTimer;
