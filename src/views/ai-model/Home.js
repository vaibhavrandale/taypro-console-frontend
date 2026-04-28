import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CBadge,
} from "@coreui/react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../components/LoadingSpinner";

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  // const authtoken = useSelector((state) => state.authtoken);

  useEffect(() => {
    setLoading(true);
    const fetchJobs = async () => {
      try {
        const res = await axios.get("/api/v1/ai-model", {
          headers: {
            Authorization: `Bearer ${authtoken}`,
          },
        });
        setJobs(res.data.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  const statusColor = {
    done: "success",
    pending: "warning",
    error: "danger",
  };

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
  }

  return (
    <CCard>
      <CCardHeader className="fw-bold">🧾 All AI Model Jobs</CCardHeader>
      <CCardBody>
        <div className="mb-3 d-flex justify-content-end align-items-center">
          <Link
            to={`/${adminroute}/ai-model/check-micro-fiber`}
            className="btn btn-primary p-1"
            size="sm"
          >
            ➕ Check Micro Fiber
          </Link>
        </div>

        <CTable bordered hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>#</CTableHeaderCell>
              <CTableHeaderCell>Image</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Result</CTableHeaderCell>
              <CTableHeaderCell>Date</CTableHeaderCell>
              <CTableHeaderCell>Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {loading ? (
              <CTableRow>
                <CTableDataCell colSpan="6" className="text-center">
                  <div className="d-flex justify-content-center align-items-center">
                    <LoadingSpinner />
                  </div>
                </CTableDataCell>
              </CTableRow>
            ) : jobs.length > 0 ? (
              jobs.map((job, index) => (
                <CTableRow key={job._id}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>
                    <img
                      src={job.uploadedimageUrl}
                      alt="original"
                      width={70}
                      height={70}
                      style={{ objectFit: "cover", borderRadius: 6 }}
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={statusColor[job.status]}>
                      {job.status}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>{job.overall || "-"}</CTableDataCell>
                  <CTableDataCell>
                    {new Date(job.createdAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                  </CTableDataCell>
                  <CTableDataCell>
                    <Link to={`/${adminroute}/ai-model/view/${job._id}`}>
                      <CButton size="sm" color="info">
                        View
                      </CButton>
                    </Link>
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="6" className="text-center">
                  No AI model jobs found.
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  );
};

export default Home;
