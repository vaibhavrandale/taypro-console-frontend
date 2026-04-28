import axios from "axios";

import React, { useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../components/LoadingSpinner";
import PerformanceTable from "./PerformanceTable";
const reducer = (state, action) => {
  switch (action.type) {
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
const GenerateReport = () => {
  const [{ reportLoading, reportError, reports }, dispatch] = useReducer(
    reducer,
    {
      reportLoading: false,
      reportError: "",
      reports: [],
    },
  );

  // const authtoken = useSelector((state) => state.authtoken);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];
  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i,
  );
  useEffect(() => {
    const fetchReports = async () => {
      dispatch({ type: "FETCH_SPRINT_REPORT_REQUEST" });
      try {
        const data = await axios.post(
          "/api/v1/sprint-tracking/generate-report",
          { month, year },

          {
            // headers: { Authorization: `Bearer ${authtoken}` },
            withCredentials: true,
          },
        );

        dispatch({
          type: "FETCH_SPRINT_REPORT_SUCCESS",
          payload: data.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_SPRINT_REPORT_FAIL",
          payload: error.response?.data?.message || error.response?.data?.error,
        });
        toast.error(
          error.response?.data?.message || error.response?.data?.error,
        );
      }
    };
    fetchReports();
  }, [month, year]);

  return (
    <div>
      {" "}
      <div className="container py-3">
        <h4 className="mb-3 text-info"> Sprint Report</h4>

        <div className="d-flex gap-3 align-items-center mb-3">
          <select
            className="form-select w-auto"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>

          <select
            className="form-select w-auto"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        {reportLoading && <LoadingSpinner />}
        {reportError && (
          <div className="alert alert-danger py-2">{reportError}</div>
        )}

        <div className="mt-4">
          {reports && <PerformanceTable reports={reports} />}
        </div>
      </div>
    </div>
  );
};

export default GenerateReport;
