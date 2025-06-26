import React, { useEffect, useReducer, useState } from "react";

import { BsStarFill, BsStar } from "react-icons/bs";

import { Link, useNavigate } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CCardHeader,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CFormLabel,
  CForm,
  CFormTextarea,
  CButton,
  CImage,
  CBadge,
} from "@coreui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserShield,
  faUserTie,
  faCogs,
  faTools,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
// import { customer_feedback } from "../../data";
import toast from "react-hot-toast";
import axios from "axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import TayproLogo from "../../assets/brand/logoforwhitebg.png"; // Import the image

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_FEEDBACK_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_FEEDBACK_SUCCESS":
      return {
        ...state,
        loading: false,
        latestfeedback: action.payload,
      };
    case "FETCH_FEEDBACK_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "FETCH_TIMER_REQUEST":
      return { ...state, timerLoading: true, timerError: "" };
    case "FETCH_TIMER_SUCCESS":
      return {
        ...state,
        timerLoading: false,
        timernotification: action.payload,
      };
    case "FETCH_TIMER_FAIL":
      return { ...state, timerLoading: false, timerError: action.payload };

    case "SUBMIT_REQUEST":
      return { ...state, submitLoading: true, submiterror: "" };

    case "SUBMIT_SUCCESS":
      return { ...state, submitLoading: false };

    case "SUBMIT_FAIL":
      return { ...state, submitLoading: false, submiterror: action.payload };

    case "UPDATE_TIMER_REQUEST":
      return { ...state, updateLoading: true, updateError: "" };

    case "UPDATE_TIMER_SUCCESS":
      return { ...state, updateLoading: false };

    case "UPDATE_TIMER_FAIL":
      return { ...state, updateLoading: false, updateError: action.payload };
    default:
      return state;
  }
};

const UserBasedLinkDashboard = () => {
  const [
    {
      error,
      latestfeedback,
      loading,
      submitLoading,
      submiterror,
      timerError,
      timernotification,
      timerLoading,
      updateError,
      updateLoading,
    },
    dispatch,
  ] = useReducer(reducer, {
    latestfeedback: null,
    loading: false,
    updateLoading: false,
    timerLoading: false,
    submitLoading: false,
    timernotification: {},
    submiterror: "",
    updateError: "",
    timerError: "",
  });

  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  // const [latestFeedback, setLatestFeedback] = useState(null);

  const navigate = useNavigate();
  // const [userInfo, setUserInfo] = useState(null);
  const [feedbackModal, setFeedbackModal] = useState(true);
  const [timerModal, setTimerModal] = useState(false);
  const [formData, setFormData] = useState({
    comments: "",
    rating: "",
  });
  useEffect(() => {
    // const user = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      navigate("/login"); // Redirect if user is not found
    }

    const fetchTimerData = async () => {
      try {
        dispatch({ type: "FETCH_TIMER_REQUEST" });

        const result = await axios.get(
          `/api/v1/timerexecutionnotifications/get-by-userId/${userInfo._id}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );
        // console.log(result.data.data);

        dispatch({
          type: "FETCH_TIMER_SUCCESS",
          payload: result.data.data,
        });
        if (result.data.data.read_status === false) {
          setTimerModal(true); // Hide the modal
        } else {
          setTimerModal(false); // Hide the modal
        }
      } catch (error) {
        console.log(error.response?.data.error);
        if (
          error.response?.data.error ===
          "Timer Execution Notifications Not Found"
        ) {
          setTimerModal(false); // Hide the modal if no notifications
        }
        dispatch({
          type: "FETCH_TIMER_FAIL",
          payload: error.response?.data.error || error.response?.data.message,
        });
      }
    };

    if (userInfo?.role === "Client Admin") {
      const fetchfeedback = async () => {
        try {
          dispatch({ type: "FETCH_FEEDBACK_REQUEST" });

          const result = await axios.get(
            `/api/v1/customer-feedback/get-customer-feedback-by-user-latest/${userInfo._id}`,
            {
              headers: { Authorization: `Bearer ${authtoken}` },
            }
          );
          dispatch({
            type: "FETCH_FEEDBACK_SUCCESS",
            payload: result.data.data,
          });
          if (result.data.data.status === true) {
            setFeedbackModal(false); // Hide the modal
          } else {
            setFeedbackModal(true); // Hide the modal
          }
        } catch (error) {
          dispatch({
            type: "FETCH_FEEDBACK_FAIL",
            payload: error.response?.data.error || error.response?.data.message,
          });
        }
      };
      fetchfeedback();
    }

    fetchTimerData();
  }, [authtoken, navigate, userInfo]);

  if (!userInfo) {
    return null; // Prevent rendering if user isn't loaded
  }

  // Role-based routes
  const roleRoutes = {
    "Master Admin": {
      path: "/master-admin/dashboard",
      dept: "Administration",
      icon: faUserShield,
    },
    "Master User": {
      path: "/master-user/dashboard",
      dept: "Administration",
      icon: faUserTie,
    },
    "Project Admin": {
      path: "/project-admin/dashboard",
      dept: "Project Management",
      icon: faCogs,
    },
    "Project User": {
      path: "/project-user/dashboard",
      dept: "Project Management",
      icon: faCogs,
    },
    "Service Admin": {
      path: "/service-admin/dashboard",
      dept: "Service Department",
      icon: faTools,
    },
    "Service User": {
      path: "/service-user/dashboard",
      dept: "Service Department",
      icon: faTools,
    },
    "Site Technician": {
      path: "/site-technician/dashboard",
      dept: "Field Operations",
      icon: faTools,
    },
    "Client Admin": {
      path: "/client-admin/dashboard",
      dept: "Client Management",
      icon: faBuilding,
    },
    "Client Site Technician": {
      path: "/client-admin/dashboard",
      dept: "Client Management",
      icon: faBuilding,
    },
    "Site Incharge": {
      path: "/site-incharge/dashboard",
      dept: "Client Management",
      icon: faBuilding,
    },
  };

  // Get dashboard details for the logged-in user's role
  const userRoleData = roleRoutes[userInfo.role];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // Remove focus from the currently focused element
    if (document.activeElement) {
      document.activeElement.blur();
    }
    dispatch({ type: "SUBMIT_REQUEST" });
    try {
      const data = await axios.put(
        `/api/v1/customer-feedback/${latestfeedback._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
      );

      toast.success(data.data.message);
      dispatch({ type: "SUBMIT_SUCCESS" });
      setFeedbackModal(false); // Hide the modal
    } catch (error) {
      dispatch({
        type: "SUBMIT_FAIL",
        payload: error.response?.data?.message || error.response?.data?.error,
      });
    }
  };

  const handleReadTimerNotification = async () => {
    // Remove focus from the currently focused element
    if (document.activeElement) {
      document.activeElement.blur();
    }
    dispatch({ type: "UPDATE_TIMER_REQUEST" });
    try {
      const data = await axios.put(
        `/api/v1/timerexecutionnotifications/${timernotification._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
      );

      toast.success(data.data.message);
      dispatch({ type: "UPDATE_TIMER_SUCCESS" });
      setTimerModal(false); // Hide the modal
    } catch (error) {
      dispatch({
        type: "UPDATE_TIMER_FAIL",
        payload: error.response?.data?.message || error.response?.data?.error,
      });
      toast.error(error.response?.data?.message || error.response?.data?.error);
    }
  };

  const StarRating = ({ rating, onChange }) => {
    const currentRating = Number(rating) || 0;

    return (
      <div
        className="d-flex gap-2"
        style={{ cursor: "pointer", fontSize: "1.8rem" }}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const FilledStar = star <= currentRating;
          return FilledStar ? (
            <BsStarFill
              size={20}
              key={star}
              color="#ffc107"
              onClick={() =>
                onChange({ target: { name: "rating", value: star } })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  onChange({
                    target: { name: "rating", value: star },
                  });
              }}
              role="radio"
              tabIndex={0}
              aria-checked={star === currentRating}
              aria-label={`${star} Star${star > 1 ? "s" : ""}`}
            />
          ) : (
            <BsStar
              size={20}
              key={star}
              color="#e4e5e9"
              onClick={() =>
                onChange({ target: { name: "rating", value: star } })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  onChange({
                    target: { name: "rating", value: star },
                  });
              }}
              role="radio"
              tabIndex={0}
              aria-checked={star === currentRating}
              aria-label={`${star} Star${star > 1 ? "s" : ""}`}
            />
          );
        })}
      </div>
    );
  };

  // console.log(timernotification);

  return (
    <div className="mt-3 mx-2">
      <h2 className="text-center mb-4">
        Welcome, {userInfo.username} &nbsp;({userInfo.role})
      </h2>
      {/* <NetworkStatus /> */}
      <CRow className="justify-content-center">
        {userRoleData ? (
          <CCol md={4} className="mb-4">
            <CCard
              className=" card shadow-lg text-center"
              style={{ height: "100%" }}
            >
              <CCardHeader>
                <h5>{userInfo.role}</h5>
                <p className="">{userRoleData.dept}</p>
              </CCardHeader>
              <CCardBody>
                <FontAwesomeIcon
                  icon={userRoleData.icon}
                  size="3x"
                  className="mb-3"
                />
                <br />
                <Link to={userRoleData.path} className="btn btn-success btn-sm">
                  Go to {userInfo.role} Dashboard
                </Link>
              </CCardBody>
            </CCard>
          </CCol>
        ) : (
          <p className="text-center text-danger">
            No dashboard assigned for your role.
          </p>
        )}
      </CRow>

      {/* <CButton color="primary" onClick={() => setFeedbackModal(!feedbackModal)}>
        Rate us
      </CButton> */}

      {latestfeedback && (
        <CModal
          // className={feedbackModal ? "fade-out" : "fade-in"}
          // size="m"
          backdrop="static"
          scrollable
          alignment="top"
          visible={feedbackModal}
        >
          {loading ? (
            <div
              className="d-flex justify-content-center align-items-center flex-column"
              style={{ height: "200px", width: "100%" }}
            >
              <CImage
                src={TayproLogo}
                alt="Logo"
                width={200}
                height={100}
                style={{
                  objectFit: "contain",
                  marginBottom: "20px",
                }}
                className="mb-3"
              />
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <CModalHeader closeButton={false}>
                <CModalTitle>Rate for our Service</CModalTitle>
              </CModalHeader>

              <CModalBody>
                {submiterror && (
                  <div className="alert alert-danger" role="alert">
                    {submiterror}
                  </div>
                )}
                <CForm>
                  <div className="mb-3">
                    <CFormLabel htmlFor="comments">Feedback</CFormLabel>
                    <CFormTextarea
                      id="comments"
                      name="comments"
                      rows={2}
                      placeholder="Write your feedback..."
                      value={formData.comments}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <CFormLabel>Rating</CFormLabel>
                    <StarRating
                      rating={formData.rating}
                      onChange={handleChange}
                    />
                  </div>
                </CForm>
                <hr />
                <div className="d-flex justify-content-between">
                  <CButton
                    color="success"
                    size="sm"
                    onClick={handleSubmit}
                    disabled={!formData.comments || !formData.rating}
                  >
                    {submitLoading ? (
                      <>
                        Please Wait <LoadingSpinner />
                      </>
                    ) : (
                      "Submit"
                    )}
                  </CButton>
                </div>
              </CModalBody>
            </>
          )}
        </CModal>
      )}

      {timernotification && (
        <CModal
          // className={feedbackModal ? "fade-out" : "fade-in"}
          // size="m"
          backdrop="static"
          scrollable
          alignment="top"
          visible={timerModal}
        >
          {timerLoading ? (
            <div
              className="d-flex justify-content-center align-items-center flex-column"
              style={{ height: "200px", width: "100%" }}
            >
              <CImage
                src={TayproLogo}
                alt="Logo"
                width={200}
                height={100}
                style={{
                  objectFit: "contain",
                  marginBottom: "20px",
                }}
                className="mb-3"
              />
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <CModalHeader closeButton={false}>
                <CModalTitle>
                  {" "}
                  <CBadge color="success">
                    {timernotification.site_id}
                  </CBadge>{" "}
                  Timer Executed At&nbsp;
                  <b>
                    {new Date(timernotification.createdAt).toLocaleString()}
                  </b>
                </CModalTitle>
              </CModalHeader>

              <CModalBody>
                {timerError && (
                  <div className="alert alert-danger" role="alert">
                    {timerError}
                  </div>
                )}
                <div>
                  <ul>
                    {timernotification.block &&
                      timernotification.block.length > 0 &&
                      timernotification.block.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                  </ul>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <CButton
                    color="success"
                    size="sm"
                    onClick={handleReadTimerNotification}
                    disabled={updateError || updateLoading}
                  >
                    {updateLoading ? (
                      <>
                        Please Wait <LoadingSpinner />
                      </>
                    ) : (
                      "Submit"
                    )}
                  </CButton>
                </div>
              </CModalBody>
            </>
          )}
        </CModal>
      )}
    </div>
  );
};

export default UserBasedLinkDashboard;
