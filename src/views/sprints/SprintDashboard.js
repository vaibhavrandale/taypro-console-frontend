// import React from "react";

// const SprintDashboard = () => {
//   return <div>SprintDashboard</div>;
// };

// export default SprintDashboard;

import React, { useEffect, useReducer } from "react";
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CAlert,
} from "@coreui/react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../components/LoadingSpinner";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SPRINTS_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SPRINTS_SUCCESS":
      return { ...state, loading: false, sprints: action.payload };
    case "FETCH_SPRINTS_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "FETCH_SPRINT_REPORT_REQUEST":
      return { ...state, reportLoading: true, reportError: "" };
    case "FETCH_SPRINT_REPORT_SUCCESS":
      return { ...state, reportLoading: false, reports: action.payload };
    case "FETCH_SPRINT_REPORT_FAIL":
      return { ...state, reportLoading: false, reportError: action.payload };
    default:
      return state;
  }
};

const SprintDashboard = () => {
  const [state, dispatch] = useReducer(reducer, {
    sprints: [],
    loading: false,
    error: "",
    reportLoading: false,
    reportError: "",
    reports: [],
  });
  const authtoken = useSelector((state) => state.authtoken);

  // const userInfo = useSelector((state) => state.userInfo);
  useEffect(() => {
    const fetchSprints = async () => {
      dispatch({ type: "FETCH_SPRINTS_REQUEST" });
      try {
        const { data } = await axios.get("/api/v1/sprint-tracking", {
          headers: { Authorization: `Bearer ${authtoken}` },
        });

        dispatch({ type: "FETCH_SPRINTS_SUCCESS", payload: data.data });
      } catch (error) {
        dispatch({
          type: "FETCH_SPRINTS_FAIL",
          payload: error.response?.data?.message || error.response?.data?.error,
        });
        toast.error(
          error.response?.data?.message || error.response?.data?.error
        );
      }
    };
    fetchSprints();
  }, [authtoken]);

  const { sprints, loading, error } = state;

  return (
    <div className="">
      <h4 className="text-center">All Sprints</h4>
      <div className="d-flex justify-content-end align-items-center mb-2">
        {" "}
        <Link className="btn btn-primary btn-sm me-2" to="generate-report">
          Generate Report
        </Link>
        <Link className="btn btn-primary btn-sm" to="create-sprint">
          Create Sprint
        </Link>
      </div>

      <CRow className="mt-3 ">
        {loading ? (
          <CCol md={4} className="mb-3 ">
            <LoadingSpinner />
          </CCol>
        ) : error ? (
          <CCol md={4} className="mb-3 ">
            <CAlert color="danger">{error}</CAlert>
          </CCol>
        ) : sprints.length > 0 ? (
          sprints.map((sprint, index) => (
            <CCol md={4} className="mb-3 " key={index}>
              <CCard className=" shadow-sm ">
                <CCardHeader className="d-flex justify-content-between align-items-center">
                  <span> {sprint.name} </span>
                  <Link className="btn btn-sm" to={`${sprint._id}`}>
                    view
                  </Link>
                </CCardHeader>{" "}
                <CCardBody>
                  <p>
                    {new Date(sprint.startDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}{" "}
                    -{" "}
                    {new Date(sprint.endDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: sprint.goal,
                    }}
                  ></p>
                  <Link className="btn btn-sm" to={`${sprint._id}`}>
                    View Sprint
                  </Link>
                </CCardBody>
              </CCard>{" "}
            </CCol>
          ))
        ) : (
          <CCol md={4}>
            <CCard className="h-100 shadow-sm">
              <CCardHeader>No Sprints Found</CCardHeader>
              <CCardBody>
                <p>No sprints have been created/assigned yet.</p>
              </CCardBody>
            </CCard>
          </CCol>
        )}{" "}
      </CRow>
    </div>
  );
};

export default SprintDashboard;
