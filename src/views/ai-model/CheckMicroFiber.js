import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CRow,
  CCol,
  CImage,
  CBadge,
  CListGroup,
  CListGroupItem,
  CButton,
  CFormInput,
  CSpinner,
  CModal,
  CModalHeader,
  CModalBody,
} from "@coreui/react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Link } from "react-router-dom";
import LastActivity from "../../components/LastActivity";

const CheckMicroFiber = () => {
  const authtoken = useSelector((state) => state.authtoken);

  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState("");
  const [modalImageTitle, setModalImageTitle] = useState("");
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus("");
    setJobData(null);
  };
  const openImageModal = (src, title) => {
    setModalImageSrc(src);
    setModalImageTitle(title);
    setModalVisible(true);
  };
  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select an image.");
      return;
    }

    setStatus("⏳ Uploading...");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // 1. Upload and trigger AI analysis
      const res = await axios.post("/api/v1/ai-model", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authtoken}`,
        },
      });

      const jobId = res.data.data._id;
      setStatus("📡 Upload successful. Analyzing...");

      // 2. Polling for the result
      // const pollResult = async (retries = 10, delay = 3000) => {
      //   for (let i = 0; i < retries; i++) {
      const jobRes = await axios.get(`/api/v1/ai-model/${jobId}`, {
        headers: {
          Authorization: `Bearer ${authtoken}`,
        },
      });
      const job = jobRes.data.data;

      if (job.status === "done") {
        setJobData(job);
        setStatus("✅ Analysis complete!");
        setLoading(false);
        return;
      } else if (job.status === "error") {
        setStatus(job.last_activity[0].details || "❌ Analysis failed.");
        setLoading(false);
        return;
      }
      // await new Promise((res) => setTimeout(res, delay));
      // }

      setStatus("⚠️ Timeout: Analysis took too long.");
      setLoading(false);
      // };

      // pollResult();
    } catch (err) {
      console.error(err.response.data.message || err.response.data.error);
      setStatus(`❌ ${err.response.data.message || err.response.data.error}`);
      setLoading(false);
    }
  };

  const statusColor = {
    done: "success",
    pending: "warning",
    error: "danger",
  };

  return (
    <div className="p-3">
      <CCard className="mb-4">
        <CCardHeader>🧪 Upload Microfiber Image</CCardHeader>
        <CCardBody>
          <CRow className="align-items-center">
            <CCol md={4}>
              <CFormInput
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </CCol>
            <CCol md={6}>
              <CButton
                color="primary"
                className="d-flex align-items-center justify-content-center"
                onClick={handleUpload}
                disabled={loading}
                size="sm"
              >
                {loading ? <LoadingSpinner /> : "Upload & Analyze"}
              </CButton>
            </CCol>
          </CRow>
          {status && <p className="mt-3">{status}</p>}
        </CCardBody>
      </CCard>

      {jobData && (
        <CCard>
          <CCardHeader className="fw-bold">🧾 AI Result</CCardHeader>
          <CCardBody>
            <CRow className="mb-3">
              <CCol md={6}>
                <p>
                  <strong>Status : </strong>
                  <CBadge color={statusColor[jobData.status]}>
                    {jobData.status}
                  </CBadge>
                </p>
                <p>
                  <strong>Overall Result : </strong>
                  <CBadge
                    color={`${
                      jobData.overall === "done"
                        ? "success"
                        : jobData.overall === "error"
                        ? "danger"
                        : "warning"
                    }`}
                  >
                    {jobData.overall.toUpperCase()}
                  </CBadge>
                </p>
              </CCol>
              <CCol md={6}>
                <h6 className="text-muted">🔍 Breakdown</h6>
                {Object.entries(jobData.breakdown).map(([key, val]) => (
                  <CBadge
                    color={
                      key === "good"
                        ? "success"
                        : key === "moderate"
                        ? "warning"
                        : "danger"
                    }
                    className="me-2 text-capitalize"
                    key={key}
                  >
                    {key}: {val}
                  </CBadge>
                ))}
              </CCol>
            </CRow>

            <CRow className="mb-4">
              <CCol md={4}>
                <h6 className="text-muted">Original</h6>

                <CImage
                  style={{
                    height: "200px",
                    width: "100%",
                    cursor: "pointer",
                    objectFit: "cover",
                  }}
                  onClick={() =>
                    openImageModal(jobData.uploadedimageUrl, "Original Image")
                  }
                  src={jobData.uploadedimageUrl}
                />
              </CCol>
              <CCol md={4}>
                <h6 className="text-muted">Summary</h6>

                <CImage
                  style={{
                    height: "200px",
                    width: "100%",
                    cursor: "pointer",
                    objectFit: "cover",
                  }}
                  onClick={() =>
                    openImageModal(jobData.summaryImageUrl, "Summary Image")
                  }
                  src={jobData.summaryImageUrl}
                />
              </CCol>
              <CCol md={4}>
                <h6 className="text-muted">Contour</h6>

                <CImage
                  style={{
                    height: "200px",
                    width: "100%",
                    cursor: "pointer",
                    objectFit: "cover",
                  }}
                  onClick={() =>
                    openImageModal(jobData.contourImageUrl, "Contour Image")
                  }
                  src={jobData.contourImageUrl}
                />
              </CCol>
            </CRow>
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
            <LastActivity lastactivity={jobData.last_activity} />
          </CCardBody>
        </CCard>
      )}
    </div>
  );
};

export default CheckMicroFiber;
