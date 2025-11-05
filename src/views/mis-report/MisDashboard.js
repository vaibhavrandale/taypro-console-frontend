import React, { useEffect, useReducer, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { CAlert } from "@coreui/react";
import Sales from "./Sales";
import LoadingSpinner from "../../components/LoadingSpinner";
import ProductionAndOperation from "./ProductionAndOperation";
import Quality from "./Quality";
import Project from "./Project";
import Service from "./Service";
import SupplyChainAndLogisitics from "./SupplyChainAndLogisitics";
import ResearchAndDevelopment from "./ResearchAndDevelopment";
import Account from "./Account";
import HRAndAdmin from "./HRAndAdmin";
import { Link } from "react-router-dom";

// ---------- Reducer ----------
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, misreports: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// ---------- MIS Dashboard ----------
const MisDashboard = () => {
  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  const [{ loading, misreports, error }, dispatch] = useReducer(reducer, {
    misreports: [],
    loading: false,
    error: "",
  });
  const [selectedDept, setSelectedDept] = useState("");

  // ---------- Fetch MIS Data ----------
  const fetchMisReports = async () => {
    dispatch({ type: "FETCH_REQUEST" });
    try {
      const result = await axios.get(`/api/v1/mis-report-router`, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });
      const data = result.data.data;
      console.log(result.data.data);

      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (err) {
      dispatch({
        type: "FETCH_FAIL",
        payload: err.response?.data?.error || err.response?.data?.message,
      });
    }
  };
  useEffect(() => {
    fetchMisReports();
  }, [authtoken]);
  const departments = [
    { value: "Sales", label: "Sales" },
    { value: "Production_and_operations", label: "Production & Operations" },
    { value: "Quality", label: "Quality" },
    { value: "Projects", label: "Projects" },
    { value: "Service", label: "Service" },
    { value: "Supply_chain_and_logistics", label: "Supply Chain & Logistics" },
    {
      value: "Research_and_development_and_product_development",
      label: "R&D and Product Development",
    },
    { value: "Accounts", label: "Accounts" },
    { value: "Hr_and_admin", label: "HR & Admin" },
  ];
  // 👇 Auto-select department for non-admins
  useEffect(() => {
    if (userInfo.role !== "Master Admin" && userInfo.department) {
      setSelectedDept(userInfo.department);
    }
  }, [userInfo]);

  return (
    <div className="p-2">
      <div className="mb-4 flex gap-3 items-center d-flex justify-content-between align-items-center">
        <div>
          <label className="text-success">Select Department</label>
          <select
            className="form-select w-auto"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            // disabled={userInfo.role !== "Master Admin"}
          >
            {userInfo.role === "Master Admin" ? (
              <>
                <option value="">-- Choose Department --</option>
                {departments.map((dept) => (
                  <option key={dept.value} value={dept.value}>
                    {dept.label}
                  </option>
                ))}
              </>
            ) : (
              departments
                .filter((d) => d.value === userInfo.department)
                .map((dept) => (
                  <option key={dept.value} value={dept.value}>
                    {dept.label}
                  </option>
                ))
            )}
          </select>
        </div>
        <div className="">
          <Link to="summary" className="btn btn-sm">
            View Summary
          </Link>
        </div>
      </div>

      {/* Render Selected Department */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <CAlert color="danger" className="m-4">
          {error}
        </CAlert>
      ) : (
        misreports.map((report, index) => (
          <div key={index}>
            {selectedDept === "Sales" && (
              <Sales
                data={report.Sales}
                last_activity={report.last_activity}
                createdAt={report.createdAt}
                updatedAt={report.updatedAt}
                _id={report._id}
                authtoken={authtoken}
                refreshReports={fetchMisReports} // 👈 Pass refresh callback
              />
            )}
            {selectedDept === "Production_and_operations" && (
              <ProductionAndOperation
                data={report.Production_and_operations}
                last_activity={report.last_activity}
                createdAt={report.createdAt}
                updatedAt={report.updatedAt}
                _id={report._id}
                authtoken={authtoken}
                refreshReports={fetchMisReports} // 👈 Pass refresh callback
              />
            )}
            {selectedDept === "Quality" && (
              <Quality
                data={report.Quality}
                last_activity={report.last_activity}
                createdAt={report.createdAt}
                updatedAt={report.updatedAt}
                _id={report._id}
                authtoken={authtoken}
                refreshReports={fetchMisReports} // 👈 Pass refresh callback
              />
            )}
            {selectedDept === "Projects" && (
              <Project
                data={report.Projects}
                last_activity={report.last_activity}
                createdAt={report.createdAt}
                updatedAt={report.updatedAt}
                _id={report._id}
                authtoken={authtoken}
                refreshReports={fetchMisReports} // 👈 Pass refresh callback
              />
            )}
            {selectedDept === "Service" && (
              <Service
                data={report.Service}
                last_activity={report.last_activity}
                createdAt={report.createdAt}
                updatedAt={report.updatedAt}
                _id={report._id}
                authtoken={authtoken}
                refreshReports={fetchMisReports} // 👈 Pass refresh callback
              />
            )}
            {selectedDept === "Supply_chain_and_logistics" && (
              <SupplyChainAndLogisitics
                data={report.Supply_chain_and_logistics}
                last_activity={report.last_activity}
                createdAt={report.createdAt}
                updatedAt={report.updatedAt}
                _id={report._id}
                authtoken={authtoken}
                refreshReports={fetchMisReports} // 👈 Pass refresh callback
              />
            )}
            {selectedDept ===
              "Research_and_development_and_product_development" && (
              <ResearchAndDevelopment
                data={report.Research_and_development_and_product_development}
                last_activity={report.last_activity}
                createdAt={report.createdAt}
                updatedAt={report.updatedAt}
                _id={report._id}
                authtoken={authtoken}
                refreshReports={fetchMisReports} // 👈 Pass refresh callback
              />
            )}
            {selectedDept === "Accounts" && (
              <Account
                data={report.Accounts}
                last_activity={report.last_activity}
                createdAt={report.createdAt}
                updatedAt={report.updatedAt}
                _id={report._id}
                authtoken={authtoken}
                refreshReports={fetchMisReports} // 👈 Pass refresh callback
              />
            )}
            {selectedDept === "Hr_and_admin" && (
              <HRAndAdmin
                data={report.Hr_and_admin}
                last_activity={report.last_activity}
                createdAt={report.createdAt}
                updatedAt={report.updatedAt}
                _id={report._id}
                authtoken={authtoken}
                refreshReports={fetchMisReports} // 👈 Pass refresh callback
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MisDashboard;
