import React, { useEffect, useReducer, useState } from "react";
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
  CWidgetStatsB,
  CButton,
} from "@coreui/react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import LastActivity from "../../components/LastActivity";
import LoadingSpinner from "../../components/LoadingSpinner";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, cycle: action.payload.data, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "CLIENT_VERIFY_DAY_REQUEST":
      return { ...state, verifyLoading: true, verifyError: "" };

    case "CLIENT_VERIFY_DAY_SUCCESS":
      return {
        ...state,
        verifyLoading: false,
        cycle: {
          ...state.cycle,
          day_wise_data: state.cycle.day_wise_data.map((day) =>
            day._id === action.payload._id ? action.payload : day
          ),
        },
      };

    case "CLIENT_VERIFY_DAY_FAIL":
      return {
        ...state,
        verifyLoading: false,
        verifyError: action.payload,
      };

    default:
      return state;
  }
};

const OpexCycleData = () => {
  const [{ loading, cycle, error, verifyError, verifyLoading }, dispatch] =
    useReducer(reducer, {
      cycle: {},
      loading: true,
      verifyLoading: false,
      error: "",
      verifyError: "",
    });

  const authtoken = useSelector((state) => state.authtoken);
  const { moduleId, cycleId } = useParams();
  const userInfo = useSelector((state) => state.userInfo);

  const [client_remark, setClient_remark] = useState("");

  useEffect(() => {
    setClient_remark("as per scheduled");
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

  const handleClientVerifyDay = async (e, dayId) => {
    e.preventDefault();
    try {
      dispatch({ type: "CLIENT_VERIFY_DAY_REQUEST" });
      const response = await axios.put(
        `/api/v1/opex/${moduleId}/cycle/${cycleId}/day/${dayId}/client-verify-day`,
        { client_remark },
        { headers: { Authorization: `Bearer ${authtoken}` } }
      );
      console.log(response);

      dispatch({
        type: "CLIENT_VERIFY_DAY_SUCCESS",
        payload: response.data.data,
      });

      toast.success(response.data.message);
    } catch (error) {
      dispatch({
        type: "CLIENT_VERIFY_DAY_FAIL",
        payload: error.response?.data?.message || error.response?.data?.error,
      });
      toast.error(error.response?.data?.message || error.response?.data?.error);
    }
  };

  const calculateProgress = () => {
    if (!cycle || !cycle.day_wise_data) return 0;
    const totalCleaned = cycle.day_wise_data.reduce(
      (sum, day) => sum + day.modules_cleaned_for_day,
      0
    );

    return (totalCleaned / cycle.modules_planned) * 100;
  };

  return (
    <div className="mt-1">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <h5 className="my-2 d-flex justify-content-center align-items-center">
            {new Date(cycle.start_date).toLocaleDateString("en-GB", {
              month: "long",
            })}{" "}
            - Cycle <span className="text-success ms-1">{cycle.index + 1}</span>
          </h5>
          {/* Cycle Overview */}
          <CRow className="mb-2">
            {/* Total Planned */}
            <CCol sm={6} lg={4}>
              <CWidgetStatsB
                className="mb-3 shadow-sm"
                color="primary"
                inverse
                value={cycle.modules_planned}
                title="Total Modules Planned"
              />
            </CCol>

            {/* Modules Cleaned */}
            <CCol sm={6} lg={4}>
              <CWidgetStatsB
                className="mb-3 shadow-sm"
                color="success"
                inverse
                value={cycle.modules_cleaned}
                title="Modules Cleaned"
              />
            </CCol>

            {/* Modules Remaining */}
            <CCol sm={6} lg={4}>
              <CWidgetStatsB
                className="mb-3 shadow-sm"
                color="warning"
                inverse
                value={
                  cycle.modules_remaining === 0 ? "0" : cycle.modules_remaining
                }
                title="Modules Remaining"
              />
            </CCol>
          </CRow>
          {error || verifyError ? (
            <div className="text-end my-1">
              <CBadge color="danger">{error || verifyError}</CBadge>
            </div>
          ) : (
            ""
          )}
          {/* Daily Progress Table */}
          <CCard className="border-0 shadow-sm">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Daily Cleaning Progress</h5>{" "}
              <div className="d-flex justify-content-end align-items-center">
                <span>
                  Cycle Completion:{" "}
                  <CBadge color="success">
                    {calculateProgress().toFixed(0)}%
                  </CBadge>
                </span>
                &nbsp;
                <CBadge color="warning" className="">
                  <span className="">
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
                </CBadge>
              </div>
            </CCardHeader>
            <CCardBody>
              <CTable hover responsive>
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell style={{ minWidth: "50px" }}>
                      Day
                    </CTableHeaderCell>
                    <CTableHeaderCell>ID</CTableHeaderCell>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                    <CTableHeaderCell>Planned</CTableHeaderCell>
                    <CTableHeaderCell>Cleaned</CTableHeaderCell>
                    <CTableHeaderCell>Remaining</CTableHeaderCell>
                    <CTableHeaderCell style={{ minWidth: "230px" }}>
                      Status
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ minWidth: "200px" }}>
                      Activity
                    </CTableHeaderCell>
                    {userInfo.role === "Opex Site Technician" && (
                      <CTableHeaderCell>Action</CTableHeaderCell>
                    )}
                    {userInfo.role === "Opex Client Admin" && (
                      <CTableHeaderCell>Verify</CTableHeaderCell>
                    )}
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {cycle.day_wise_data.map((day, index) => (
                    <CTableRow key={day._id} className="align-middle">
                      <CTableDataCell>Day {index + 1}</CTableDataCell>
                      <CTableDataCell>{day._id}</CTableDataCell>
                      <CTableDataCell>
                        {new Date(day.date).toLocaleDateString("en-GB")}
                        {day.is_sunday && (
                          <CBadge color="warning" className="ms-2">
                            Sunday
                          </CBadge>
                        )}

                        {day.is_pm && (
                          <CBadge color="warning" className="ms-2">
                            Preventive Maintenance Scheduled
                          </CBadge>
                        )}
                        {day.is_labour_absent && (
                          <CBadge color="warning">Labour Absent</CBadge>
                        )}
                        {day.is_other && (
                          <CBadge color="warning">
                            Other Reasonis_master_opex_site_technician
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
                          <CBadge color="success">Cleaning Completed</CBadge>
                        ) : (day.modules_cleaned_for_day === 0 &&
                            day.modules_planned_for_day === 0 &&
                            day.modules_remaining_for_day === 0) ||
                          day.is_sunday ||
                          day.is_pm ||
                          day.is_labour_absent ||
                          day.is_other ? (
                          <CBadge color="danger">Cancelled</CBadge>
                        ) : (
                          <CBadge color="warning">Pending</CBadge>
                        )}
                        {day.is_verified && (
                          <CBadge color="success" className="ms-2">
                            Taypro Verified
                          </CBadge>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        {day.is_verified ? (
                          <Link
                            to={`day/${day._id}/technician-detials`}
                            className="btn btn-sm btn-primary  m-1"
                          >
                            Cleaning Activity
                          </Link>
                        ) : (
                          <CBadge color="warning">Pending</CBadge>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        {day.is_verified && !day.is_client_verified ? (
                          <CButton
                            color="success"
                            size="sm"
                            onClick={(e) => handleClientVerifyDay(e, day._id)}
                          >
                            {verifyLoading ? <LoadingSpinner /> : "Verify"}
                          </CButton>
                        ) : day.is_client_verified ? (
                          <CBadge color="success">Already Verified</CBadge>
                        ) : (
                          <CButton
                            color="success"
                            size="sm"
                            onClick={(e) => handleClientVerifyDay(e, day._id)}
                          >
                            {verifyLoading ? <LoadingSpinner /> : "Verify"}
                          </CButton>
                        )}
                      </CTableDataCell>
                      {userInfo.role === "Opex Site Technician" && (
                        <CTableDataCell>
                          <Link
                            className="btn btn-sm btn-outline-dark  m-1"
                            to={`${day._id}/upload-images`}
                          >
                            Attachments
                          </Link>
                        </CTableDataCell>
                      )}
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
          <LastActivity lastactivity={cycle.cycle_last_activity} />
        </>
      )}
    </div>
  );
};

export default OpexCycleData;
