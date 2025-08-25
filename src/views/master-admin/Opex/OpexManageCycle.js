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
  CWidgetStatsB,
} from "@coreui/react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner";
import LastActivity from "../../../components/LastActivity";

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

const OpexManageCycle = () => {
  const [{ loading, cycle, error }, dispatch] = useReducer(reducer, {
    cycle: {},
    loading: true,
    error: "",
  });

  const authtoken = useSelector((state) => state.authtoken);
  const { moduleId, cycleId } = useParams();

  const userInfo = useSelector((state) => state.userInfo);

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

  return (
    <div className="mt-4">
      {/* Cycle Overview */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <CBadge color="danger" className="p-2">
          {error}
        </CBadge>
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
                progress="disable"
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
          {/* Daily Progress */}
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
                    <CTableHeaderCell style={{ minWidth: "70px" }}>
                      Day
                    </CTableHeaderCell>
                    <CTableHeaderCell>ID</CTableHeaderCell>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                    <CTableHeaderCell>Planned</CTableHeaderCell>
                    <CTableHeaderCell>Cleaned</CTableHeaderCell>
                    <CTableHeaderCell>Remaining</CTableHeaderCell>
                    <CTableHeaderCell style={{ minWidth: "250px" }}>
                      Status
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ minWidth: "200px" }}>
                      Activity
                    </CTableHeaderCell>
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
                          <CBadge color="warning">Other Reason</CBadge>
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
                            Admin Verified
                          </CBadge>
                        )}
                        {day.is_client_verified ? (
                          <CBadge color="success" className="ms-2">
                            client Verified
                          </CBadge>
                        ) : (
                          <CBadge color="danger" className="ms-2">
                            client verification pending
                          </CBadge>
                        )}
                      </CTableDataCell>

                      <CTableDataCell>
                        {!day.is_verified &&
                          ![
                            "Master User",
                            "Project User",
                            "Service User",
                          ].includes(userInfo?.role) && (
                            <Link
                              to={`verify-day/${day._id}`}
                              className="btn btn-sm btn-primary  m-1"
                            >
                              Verify
                            </Link>
                          )}

                        <Link
                          to={`day/${day._id}/technician-details`}
                          className="btn btn-sm btn-primary  m-1"
                        >
                          Cleaning Activity
                        </Link>
                      </CTableDataCell>
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

export default OpexManageCycle;
