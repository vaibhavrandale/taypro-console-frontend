// import axios from "axios";
// import React, { useEffect, useReducer, useState } from "react";
// import toast from "react-hot-toast";
// import { useSelector } from "react-redux";
// import { useParams } from "react-router-dom";

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "FETCH_REQUEST":
//       return { ...state, loading: true, error: "" };
//     case "FETCH_SUCCESS":
//       return {
//         ...state,
//         cycle: action.payload.data,
//         loading: false,
//       };
//     case "FETCH_FAIL":
//       return { ...state, loading: false, error: action.payload };
//     default:
//       return state;
//   }
// };

// const OpexManageCycle = () => {
//   const [{ loading, cycle, error }, dispatch] = useReducer(reducer, {
//     cycle: [],
//     loading: true,
//     error: "",
//   });
//   const authtoken = useSelector((state) => state.authtoken);
//   const { moduleId, cycleId } = useParams();

//   useEffect(() => {
//     const fetchCycle = async () => {
//       try {
//         dispatch({ type: "FETCH_REQUEST" });

//         const result = await axios.get(
//           `/api/v1/opex/${moduleId}/cycle/${cycleId}`,
//           {
//             headers: { Authorization: `Bearer ${authtoken}` },
//           }
//         );
//         // console.log(result);
//         dispatch({
//           type: "FETCH_SUCCESS",
//           payload: {
//             data: result.data.data,
//           },
//         });
//       } catch (error) {
//         dispatch({
//           type: "FETCH_FAIL",
//           payload: error.response?.data.error || error.response?.data.message,
//         });
//         toast.error(error.response?.data.error || error.response?.data.message);
//       }
//     };

//     fetchCycle();
//   }, [authtoken, cycleId, moduleId]);

//   return <div></div>;
// };

// export default OpexManageCycle;

import React, { useEffect, useReducer } from "react";
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
  CProgress,
  CRow,
  CCol,
  CInputGroup,
  CFormInput,
} from "@coreui/react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import CIcon from "@coreui/icons-react";
import { cilCheckCircle, cilX } from "@coreui/icons";
import LoadingSpinner from "../../../components/LoadingSpinner";

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
  const [searchTerm, setSearchTerm] = React.useState("");

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
                  {new Date(cycle.start_date).toLocaleDateString()} -{" "}
                  {new Date(cycle.end_date).toLocaleDateString()}
                </span>
              </div>
            </CCardHeader>
            <CCardBody>
              <CRow className="mb-2">
                <CCol md={4}>
                  <strong>Total Modules Planned:</strong>{" "}
                  {cycle.modules_planned}
                </CCol>
                <CCol md={4}>
                  <strong>Modules Cleaned:</strong> {cycle.modules_cleaned}
                </CCol>
                <CCol md={4}>
                  <strong>Modules Remaining:</strong> {cycle.modules_remaining}
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>

          {/* Daily Progress */}
          <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <h5>Daily Cleaning Progress</h5>
              <CInputGroup style={{ width: "300px" }}>
                <CFormInput
                  placeholder="Search by date..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CInputGroup>
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
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {cycle.day_wise_data
                    .filter((day) =>
                      new Date(day.date)
                        .toLocaleDateString()
                        .includes(searchTerm)
                    )
                    .map((day, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>Day {index + 1}</CTableDataCell>
                        <CTableDataCell>{day._id}</CTableDataCell>
                        <CTableDataCell>
                          {new Date(day.date).toLocaleDateString()}
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
                      </CTableRow>
                    ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </>
      )}
    </div>
  );
};

export default OpexManageCycle;
