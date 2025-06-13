import React, { useEffect, useReducer } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CWidgetStatsA,
  CListGroup,
  CListGroupItem,
  CAvatar,
  CBadge,
  CProgress,
  CAlert,
  CTooltip,
  CLink,
} from "@coreui/react";
import {
  cilChartLine,
  cilHistory,
  cilWarning,
  cilCheckCircle,
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { format } from "date-fns";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useParams } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_USER_PERFORMANCE_REQUEST":
      return { ...state, loadingUserPerformance: true, error: "" };
    case "FETCH_USER_PERFORMANCE_SUCCESS":
      return {
        ...state,
        loadingUserPerformance: false,
        userPerformance: action.payload,
      };
    case "FETCH_USER_PERFORMANCE_FAIL":
      return { ...state, loadingUserPerformance: false, error: action.payload };
    default:
      return state;
  }
};

const ViewPerformance = () => {
  const [{ error, userPerformance, loadingUserPerformance }, dispatch] =
    useReducer(reducer, {
      userPerformance: {},
      loadingUserPerformance: true,
      error: "",
    });

  const { id } = useParams();
  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);

  useEffect(() => {
    const fetchUserPerformance = async () => {
      dispatch({ type: "FETCH_USER_PERFORMANCE_REQUEST" });
      try {
        const result = await axios.get(
          `/api/v1/userperformances/get-by-userId/${id}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );
        dispatch({
          type: "FETCH_USER_PERFORMANCE_SUCCESS",
          payload: result.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_USER_PERFORMANCE_FAIL",
          payload: error.response.data.message || error.response.data.error,
        });
        toast.error(error.response.data.message || error.response.data.error);
      }
    };

    fetchUserPerformance();
  }, [authtoken, userInfo._id]);

  const getPointColor = (points) => {
    if (points >= 0) return "success";
    if (points < -500) return "danger";
    return "warning";
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "PPpp");
  };

  if (loadingUserPerformance) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-60">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-60">
        <CAlert color="danger">{error}</CAlert>
      </div>
    );
  }

  if (!userPerformance || Object.keys(userPerformance).length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-60">
        <p>No performance data available</p>
      </div>
    );
  }

  return (
    <CRow>
      <CCol md={4}>
        <CCard className="mb-4">
          <CCardHeader className="bg-white">
            <h5 className="mb-0">User Profile</h5>
          </CCardHeader>
          <CCardBody className="text-center">
            <div className="position-relative mb-3">
              <CAvatar
                src={userPerformance.user?.profile_image}
                size="xl"
                className="border border-3 border-primary"
              />
              <CBadge
                shape="rounded-pill"
                color={getPointColor(userPerformance.employee_points)}
                className="position-absolute bottom-0 end-0"
              >
                {userPerformance.employee_points}
              </CBadge>
            </div>
            <h4>{userPerformance.user?.username}</h4>
            <p className="text-medium-emphasis">
              {userPerformance.user?.email}
            </p>

            <hr />

            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6>Performance Score</h6>
              <CBadge
                color={getPointColor(userPerformance.employee_points)}
                className="fs-6 fw-bold"
              >
                {userPerformance.employee_points}
              </CBadge>
            </div>

            <CProgress
              className="mb-3"
              height={10}
              value={Math.min(
                Math.abs(userPerformance.employee_points) / 10,
                100
              )}
              color={getPointColor(userPerformance.employee_points)}
            />

            <div className="d-flex justify-content-between small">
              <span className="text-medium-emphasis">Last Updated:</span>
              <span>{formatDate(userPerformance.updatedAt)}</span>
            </div>
          </CCardBody>
        </CCard>

        <CWidgetStatsA
          className="mb-4"
          color={getPointColor(userPerformance.employee_points)}
          value={
            <>
              {userPerformance.employee_points}
              <span className="fs-6 fw-normal">
                ({userPerformance.employee_points >= 0 ? "+" : ""}
                {userPerformance.employee_points} pts)
              </span>
            </>
          }
          title="Current Score"
          action={
            <CTooltip content="Higher is better">
              <CLink className="font-weight-bold">
                <CIcon icon={cilChartLine} />
              </CLink>
            </CTooltip>
          }
        />
      </CCol>

      <CCol md={8}>
        <CCard className="mb-4">
          <CCardHeader className="bg-white">
            <div className="d-flex align-items-center">
              <CIcon icon={cilHistory} className="me-2" />
              <h5 className="mb-0">Recent Activities</h5>
            </div>
          </CCardHeader>
          <CCardBody style={{ maxHeight: "67vh", overflowY: "auto" }}>
            {userPerformance.last_activity?.length > 0 ? (
              <CListGroup flush>
                {userPerformance.last_activity
                  .reverse()
                  .map((activity, index) => (
                    <React.Fragment key={activity.service_ticket_id}>
                      <CListGroupItem className="bg-important">
                        <div className="d-flex align-items-start">
                          <div className="me-3">
                            <CBadge
                              color={
                                activity.new_employee_points <
                                activity.old_employee_points
                                  ? "danger"
                                  : "success"
                              }
                              shape="rounded-pill"
                              className="p-2"
                            >
                              <CIcon
                                icon={
                                  activity.new_employee_points <
                                  activity.old_employee_points
                                    ? cilWarning
                                    : cilCheckCircle
                                }
                              />
                            </CBadge>
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between">
                              <h6 className="mb-1">
                                {activity.ticket_id} - {activity.fault_type}
                              </h6>
                              <small className="text-medium-emphasis">
                                {formatDate(activity.timestamp)}
                              </small>
                            </div>
                            <p className="mb-1">{activity.details}</p>
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-medium-emphasis">
                                Points changed:
                              </small>
                              <CBadge
                                color={
                                  activity.new_employee_points <
                                  activity.old_employee_points
                                    ? "danger"
                                    : "success"
                                }
                              >
                                {activity.old_employee_points} →{" "}
                                {activity.new_employee_points}
                              </CBadge>
                            </div>
                          </div>
                        </div>
                      </CListGroupItem>
                      {index < userPerformance.last_activity.length - 1 && (
                        <hr className="m-0" />
                      )}
                    </React.Fragment>
                  ))}
              </CListGroup>
            ) : (
              <div className="text-center py-5">
                <CIcon
                  icon={cilHistory}
                  size="xl"
                  className="text-muted mb-3"
                />
                <p className="text-medium-emphasis">
                  No recent activities found
                </p>
              </div>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default ViewPerformance;
