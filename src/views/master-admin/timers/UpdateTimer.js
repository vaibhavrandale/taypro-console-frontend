import axios from "axios";
import React, { useState, useEffect, useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
} from "@coreui/react";
import TimerInstructionModal from "../../../components/TimerInstructionModal";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, fetchLoading: true, fetchError: "" };
    case "FETCH_SUCCESS":
      return { ...state, timers: action.payload, fetchLoading: false };
    case "FETCH_FAIL":
      return { ...state, fetchLoading: false, fetchError: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, updateLoading: true };
    case "UPDATE_SUCCESS":
      return { ...state, updateLoading: false };
    case "UPDATE_FAIL":
      return { ...state, updateLoading: false, updateError: action.payload };
    default:
      return state;
  }
};

const UpdateTimer = () => {
  const [
    { fetchLoading, fetchError, updateLoading, timers, updateError },
    dispatch,
  ] = useReducer(reducer, {
    fetchLoading: true,
    fetchError: "",
    updateLoading: false,
    timers: {},
    updateError: "",
  });

  const { id } = useParams();
  // const authtoken = useSelector((state) => state.authtoken);
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.userInfo);
  const [showModal, setShowModal] = useState(false);
  const [timerData, setTimerData] = useState({
    timer1: "00:00:00",
    timer1_date: "",
    timer2: "00:00:00",
    timer2_date: "",
    timer3: "00:00:00",
    timer3_date: "",
  });

  useEffect(() => {
    const fetchTimer = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const data = await axios.get(`/api/v1/timers/${id}`, {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        });

        dispatch({ type: "FETCH_SUCCESS", payload: data.data.data });
        console.log(data.data.data);
        setTimerData({
          site_id: data.data.data?.site_id || "",
          block: data.data.data?.block || "",
          timer1: data.data.data?.timer1 || "25:00:00",
          timer1_date: data.data.data?.timer1_date || "",
          timer2: data.data.data?.timer2 || "25:00:00",
          timer2_date: data.data.data?.timer2_date || "",
          timer3: data.data.data?.timer3 || "25:00:00",
          timer3_date: data.data.data?.timer3_date || "",
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data || "Failed to fetch data",
        });
        toast.error(error.response?.data || "Failed to fetch data");
      }
    };

    fetchTimer();
  }, [id]);

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
  else if (userInfo.role === "Project User") adminroute = "project-user";
  else if (userInfo.role === "Service User") adminroute = "service-user";
  else if (userInfo.role === "Master User") adminroute = "master-user";
  else if (userInfo.role === "Client Admin") adminroute = "client-admin";
  else if (userInfo?.role === "Site Technician") {
    adminroute = "site-technician";
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch({ type: "UPDATE_REQUEST" });

      const result = await axios.put(`/api/v1/timers/${id}`, timerData, {
        // headers: { Authorization: `Bearer ${authtoken}` },
        withCredentials: true,
      });

      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success(result.data.message);
      navigate(`/${adminroute}/timers`);
    } catch (error) {
      dispatch({
        type: "UPDATE_FAIL",
        payload:
          error.response?.data.error ||
          error.response?.data.message ||
          "Failed to update timer",
      });
      toast.error(
        error.response?.data.error ||
          error.response?.data.message ||
          "Failed to update timer",
      );
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
    <div className=" mt-4">
      {fetchLoading ? (
        <div className="d-flex mt-2 justify-content-center align-items-center">
          <LoadingSpinner />
        </div>
      ) : fetchError ? (
        <CAlert color="danger">{fetchError}</CAlert>
      ) : (
        <CCard>
          <CCardHeader className="d-flex justify-content-between align-items-center flex-wrap">
            <div>
              Update Timer -{" "}
              <span className="badge bg-warning p-2">
                {timerData.site_id} : {timerData.block}
              </span>
            </div>
            <CButton size="sm" color="info" onClick={() => setShowModal(true)}>
              ?
            </CButton>
            <TimerInstructionModal
              visible={showModal}
              onClose={() => setShowModal(false)}
            />
          </CCardHeader>
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
                      type="date"
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
                      type="date"
                      className="form-control"
                      name="timer3_date"
                      value={timerData.timer3_date}
                      onChange={handleChange}
                    />
                  </div>
                </CCol>
              </CRow>
              <div className="d-flex justify-content-end">
                <button
                  type="submit"
                  className="btn btn-warning btn-sm"
                  disabled={updateLoading}
                >
                  {updateLoading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </CCardBody>
        </CCard>
      )}
    </div>
  );
};

export default UpdateTimer;
