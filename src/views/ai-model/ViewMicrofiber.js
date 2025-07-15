import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CBadge,
  CListGroup,
  CListGroupItem,
  CSpinner,
  CAlert,
  CModal,
  CModalHeader,
  CModalBody,
  CButton,
} from "@coreui/react";
import LastActivity from "../../components/LastActivity";

const statusColor = {
  done: "success",
  pending: "warning",
  error: "danger",
};

const ViewMicrofiber = () => {
  const { id } = useParams();
  const authtoken = useSelector((state) => state.authtoken);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState("");
  const [modalImageTitle, setModalImageTitle] = useState("");

  const openImageModal = (src, title) => {
    setModalImageSrc(src);
    setModalImageTitle(title);
    setModalVisible(true);
  };
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`/api/v1/ai-model/${id}`, {
          headers: {
            Authorization: `Bearer ${authtoken}`,
          },
        });
        setJob(res.data.data);
      } catch (error) {
        console.error("Failed to fetch job:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, authtoken]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <CSpinner color="primary" />
      </div>
    );
  }

  if (!job) {
    return (
      <CAlert color="danger" className="mt-4">
        Job not found or error occurred.
      </CAlert>
    );
  }

  return (
    <CCard className="mt-3">
      <CCardHeader className="fw-bold">
        🔍 Microfiber Analysis Result -{" "}
        <CBadge color={statusColor[job.status]}>{job.status}</CBadge>
      </CCardHeader>
      <CCardBody>
        <CRow className="mb-4">
          <CCol md={6}>
            <h5>🧪 Prediction Summary</h5>
            <p>
              <strong>Overall :</strong>{" "}
              <CBadge
                color={`${
                  job.overall === "done"
                    ? "success"
                    : job.overall === "error"
                    ? "danger"
                    : "warning"
                }`}
                className="text-uppercase"
              >
                {job.overall || "N/A"}
              </CBadge>
            </p>

            <h6>Breakdown :</h6>
            <ul>
              {Object.entries(job.breakdown || {}).map(([label, count]) => (
                <li key={label}>
                  <strong>{label}:</strong> {count}
                </li>
              ))}
            </ul>
          </CCol>
        </CRow>
        <CRow className="mb-4">
          <CCol md={4}>
            <h6>📤 Uploaded Image</h6>
            <img
              src={job.uploadedimageUrl}
              alt="Uploaded"
              className="img-fluid rounded shadow"
              style={{ cursor: "pointer" }}
              onClick={() =>
                openImageModal(job.uploadedimageUrl, "Uploaded Image")
              }
            />
          </CCol>
          {job.summaryImageUrl && (
            <CCol md={4}>
              <h6>🧾 Summary Output</h6>
              <img
                src={job.summaryImageUrl}
                alt="Summary"
                className="img-fluid rounded shadow"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  openImageModal(job.summaryImageUrl, "Summary Output")
                }
              />
            </CCol>
          )}
          {job.contourImageUrl && (
            <CCol md={4}>
              <h6>📐 Contour Image</h6>
              <img
                src={job.contourImageUrl}
                alt="Contour"
                className="img-fluid rounded shadow"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  openImageModal(job.contourImageUrl, "Contour Image")
                }
              />

              <CModal
                visible={modalVisible}
                scrollable={true}
                onClose={() => setModalVisible(false)}
                size="xl"
              >
                <CModalHeader>{modalImageTitle}</CModalHeader>
                <CModalBody className="text-center">
                  <img
                    src={modalImageSrc}
                    alt="Preview"
                    className="img-fluid rounded"
                    style={{ objectFit: "contain" }}
                  />
                </CModalBody>
              </CModal>
            </CCol>
          )}
        </CRow>

        <hr />

        <hr />

        <LastActivity lastactivity={job.last_activity} />
      </CCardBody>
    </CCard>
  );
};

export default ViewMicrofiber;
