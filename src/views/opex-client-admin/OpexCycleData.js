// import React from "react";

// const OpexCycleData = () => {
//   return <div>OpexCycleData</div>;
// };

// export default OpexCycleData;

import React, { useEffect, useReducer, useState } from "react";
import { useParams } from "react-router-dom";
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
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
} from "@coreui/react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import { formatDistanceToNow } from "date-fns";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";

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
  const { moduleId, cycleId } = useParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [activityData, setActivityData] = useState([]);
  const [cleaningDay, setCleaningDay] = useState("");
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

  const openActivityModal = (day, index) => {
    console.log(day);

    setActivityData(day);
    setCleaningDay(index);
    setModalVisible(true);
  };

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
                    <CTableHeaderCell>Activity</CTableHeaderCell>
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
                          ) : day.modules_cleaned_for_day +
                              day.modules_planned_for_day +
                              day.modules_remaining_for_day ===
                            0 ? (
                            <CBadge color="danger">cancelled</CBadge>
                          ) : (
                            <CBadge color="warning">Pending</CBadge>
                          )}
                          {day.is_verified && (
                            <CBadge color="info" className="ms-2">
                              Verified
                            </CBadge>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          {day.is_verified ? (
                            <CButton
                              color="primary"
                              size="sm"
                              onClick={() =>
                                openActivityModal(day, `Day ${index + 1}`)
                              }
                            >
                              activity
                            </CButton>
                          ) : (
                            <CButton color="primary" size="sm" disabled>
                              data is not verified
                            </CButton>
                          )}
                        </CTableDataCell>
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
                    <CTableHeaderCell colSpan={2}></CTableHeaderCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
              {modalVisible && (
                <CModal
                  className="rounded-0"
                  visible={modalVisible}
                  backdrop="static"
                  alignment="center"
                  scrollable={true}
                  onClose={() => setModalVisible(false)}
                  size="lg"
                >
                  <CModalHeader closeButton={false}>
                    <CBadge color="success">{cleaningDay}</CBadge>&nbsp;
                    Verification details
                    <button
                      type="button"
                      className=" border-0 ms-auto py-0 px-1"
                      onClick={() => setModalVisible(false)}
                      style={{ background: "none" }}
                    >
                      <CIcon icon={cilX} size="lg" />
                    </button>
                  </CModalHeader>
                  <CModalBody>
                    <div className="d-flex align-items-center pb-3 mb-3">
                      <img
                        src={activityData.verified_by.profile_image}
                        alt="Profile"
                        className="rounded-circle"
                        width="50"
                        height="50"
                        style={{ objectFit: "cover", cursor: "pointer" }}
                      />
                      <div className="flex-grow-1 mx-2">
                        <p className="mb-1 fw-semibold d-flex justify-content-between flex-wrap">
                          <span className="fw-semibold">
                            {activityData.verified_by.name} -{" "}
                            <span className="text-muted small">
                              {new Date(
                                activityData.verified_by.verified_at
                              ).toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true,
                              })}
                            </span>
                          </span>
                          <span className="d-flex flex-column">
                            <span className="text-muted small">
                              {activityData.verified_by.verified_at
                                ? formatDistanceToNow(
                                    new Date(
                                      activityData.verified_by.verified_at
                                    ),
                                    {
                                      addSuffix: true,
                                    }
                                  )
                                : "NA"}
                            </span>
                          </span>
                        </p>

                        <p
                          className=" maxw-75 mw-75"
                          style={{
                            fontSize: "14px",
                            lineHeight: "1.5",
                            textAlign: "start",
                          }}
                        >
                          <CBadge color="warning">Details</CBadge> :&nbsp;
                          {activityData.verified_by.details}
                        </p>
                        {activityData.is_other ? (
                          <p
                            className=" maxw-75 mw-75"
                            style={{
                              fontSize: "14px",
                              lineHeight: "1.5",
                              textAlign: "start",
                            }}
                          >
                            <CBadge color="warning">Remark</CBadge> :&nbsp;
                            {activityData.remarks}
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </CModalBody>
                </CModal>
              )}
            </CCardBody>
          </CCard>
        </>
      )}
    </div>
  );
};

export default OpexCycleData;
