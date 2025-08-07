import React, { useEffect, useReducer } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CBadge,
  CRow,
  CCol,
} from "@coreui/react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, cycle: action.payload.data, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const OpexCycleData = () => {
  const [{ loading, cycle, error }, dispatch] = useReducer(reducer, {
    cycle: {},
    loading: true,
    error: "",
  });

  const authtoken = useSelector((state) => state.authtoken);
  const { moduleId, cycleId, site_id } = useParams();
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
  } else if (userInfo?.role === "Opex Client Admin") {
    adminroute = "opex-client-admin";
  } else if (userInfo?.role === "Opex Site Technician") {
    adminroute = "opex-site-technician";
  }

  useEffect(() => {
    const fetchCycle = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const result = await axios.get(
          `/api/v1/opex/${moduleId}/cycle/${cycleId}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );
        dispatch({
          type: "FETCH_SUCCESS",
          payload: { data: result.data.data },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data.error || error.response?.data.message,
        });
        toast.error(error.response?.data.error || error.response?.data.message);
      }
    };

    fetchCycle();
  }, [authtoken, moduleId, cycleId]);

  const calculateProgress = () => {
    if (!cycle || !cycle.day_wise_data) return 0;
    const totalCleaned = cycle.day_wise_data.reduce(
      (sum, day) => sum + day.modules_cleaned_for_day,
      0
    );
    return (totalCleaned / cycle.modules_planned) * 100;
  };

  const totalModulesPlanned = cycle?.day_wise_data?.reduce(
    (sum, day) => sum + (day.modules_planned_for_day || 0),
    0
  );
  const totalModulesCleaned = cycle?.day_wise_data?.reduce(
    (sum, day) => sum + (day.modules_cleaned_for_day || 0),
    0
  );
  const totalModulesRemaining = cycle?.day_wise_data?.reduce(
    (sum, day) => sum + (day.modules_remaining_for_day || 0),
    0
  );

  return (
    <div className="mt-4">
      {/* Cycle Overview */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center">
          <CBadge color="danger" className="p-2">
            {error}
          </CBadge>
        </div>
      ) : (
        <>
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <h5>Cycle Overview</h5>
              <div className="d-flex align-items-center">
                <CBadge color="success" className="me-3">
                  {calculateProgress().toFixed(1)}% Complete
                </CBadge>
                <span>
                  {new Date(cycle.start_date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  -{" "}
                  {new Date(cycle.end_date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </CCardHeader>
            <CCardBody>
              <CRow className="mb-2">
                <CCol md={4}>
                  Total Modules Planned: {cycle.modules_planned}
                </CCol>
                <CCol md={4}>Modules Cleaned: {cycle.modules_cleaned}</CCol>
                <CCol md={4}>Modules Remaining: {cycle.modules_remaining}</CCol>
              </CRow>
            </CCardBody>
          </CCard>

          {/* Daily Progress */}
          <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <h5>Daily Cleaning Progress</h5>
            </CCardHeader>
            <CCardBody>
              <CTable bordered hover responsive>
                <CTableHead color="secondary">
                  <CTableRow>
                    <CTableHeaderCell>DAY</CTableHeaderCell>
                    <CTableHeaderCell>Id</CTableHeaderCell>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                    <CTableHeaderCell>Planned</CTableHeaderCell>
                    <CTableHeaderCell>Cleaned</CTableHeaderCell>
                    <CTableHeaderCell>Remaining</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    {userInfo.role === "Opex Site Technician" && (
                      <CTableHeaderCell>Action</CTableHeaderCell>
                    )}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {cycle.day_wise_data.map((day, index) => (
                    <>
                      <CTableRow key={index}>
                        <CTableDataCell>Day {index + 1}</CTableDataCell>
                        <CTableDataCell>{day._id}</CTableDataCell>
                        <CTableDataCell>
                          {new Date(day.date).toLocaleDateString("en-GB")}

                          {day.is_sunday && (
                            <CBadge color="warning" className="ms-2">
                              Sunday
                            </CBadge>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          {day.modules_planned_for_day}
                        </CTableDataCell>
                        <CTableDataCell>
                          {day.modules_cleaned_for_day}
                        </CTableDataCell>
                        <CTableDataCell>
                          {day.modules_remaining_for_day}
                        </CTableDataCell>
                        <CTableDataCell>
                          {day.is_cleaning_done &&
                          day.modules_remaining_for_day === 0 ? (
                            <CBadge color="success">Completed</CBadge>
                          ) : (
                            <CBadge color="warning">Pending</CBadge>
                          )}

                          {day.is_verified && (
                            <CBadge color="info" className="ms-2">
                              Verified
                            </CBadge>
                          )}
                        </CTableDataCell>
                        {userInfo.role === "Opex Site Technician" && (
                          <CTableDataCell>
                            <Link
                              className="btn btn-sm btn-secondary m-2"
                              color="secondary"
                              size="sm"
                              to={`/${adminroute}/upload-images/${moduleId}/${cycleId}/${day._id}/${site_id}`}
                            >
                              Add Attachments
                            </Link>
                          </CTableDataCell>
                        )}
                      </CTableRow>
                    </>
                  ))}
                  <CTableRow color="">
                    <CTableHeaderCell colSpan={3} className="text-center">
                      Total
                    </CTableHeaderCell>
                    <CTableHeaderCell>{totalModulesPlanned}</CTableHeaderCell>
                    <CTableHeaderCell>{totalModulesCleaned}</CTableHeaderCell>
                    <CTableHeaderCell>{totalModulesRemaining}</CTableHeaderCell>
                    <CTableHeaderCell colSpan={1}></CTableHeaderCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </>
      )}
    </div>
  );
};

export default OpexCycleData;
