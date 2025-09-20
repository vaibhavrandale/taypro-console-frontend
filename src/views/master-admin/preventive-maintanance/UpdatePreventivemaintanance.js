import React, { useEffect, useReducer, useState, useRef } from "react"; // Added useRef
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  // Added camera modal imports
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
import LoadingSpinner from "../../../components/LoadingSpinner";
// Added icon imports
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        preventivemaintanance: action.payload,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, updating: true };
    case "UPDATE_SUCCESS":
      return { ...state, updating: false };
    case "UPDATE_FAIL":
      return { ...state, updating: false, error: action.payload };

    case "UPLOAD_REQUEST":
      return {
        ...state,
        loadingUpload: { ...state.loadingUpload, [action.field]: true },
      };

    case "UPLOAD_SUCCESS":
      return {
        ...state,
        loadingUpload: { ...state.loadingUpload, [action.field]: false },
      };

    case "UPLOAD_FAIL":
      return {
        ...state,
        loadingUpload: { ...state.loadingUpload, [action.field]: false },
        errorUpload: action.payload,
      };

    // Added SET_IMAGE case for camera capture
    case "SET_IMAGE":
      return { ...state, [action.field]: action.url };

    default:
      return state;
  }
};

const UpdatePreventiveMaintenance = () => {
  const [{ loading, loadingUpload, updating }, dispatch] = useReducer(reducer, {
    preventivemaintanance: {},
    loading: true,
    error: "",
    updating: false,
    loadingUpload: {}, // Fixed: changed from false to {} for proper field-specific loading
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const authtoken = useSelector((state) => state.authtoken);
  const [formData, setFormData] = useState({});
  const userInfo = useSelector((state) => state.userInfo);
  const [loadingCamera, setLoadingCamera] = useState(false);

  // Camera states
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [currentImageField, setCurrentImageField] = useState("");
  const videoRef = useRef(null); // Added refs
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [location, setLocation] = useState({ lat: null, lng: null });

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

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const response = await axios.get(
          `/api/v1/preventivemaintenances/${id}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );
        const data = response.data?.data || {};
        dispatch({ type: "FETCH_SUCCESS" });
        setFormData(data);
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: error.response?.data?.error });
        toast.error(error.response?.data?.error || "Failed to fetch data");
      }
    };

    fetchMaintenance();
  }, [id, authtoken]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      const { createdAt, _id, last_activity, ...filteredFormData } = formData;
      await axios.put(
        `/api/v1/preventivemaintenances/${id}`,
        filteredFormData,
        { headers: { Authorization: `Bearer ${authtoken}` } }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Preventive Maintenance updated successfully!");
      navigate(`/${adminroute}/preventive-maintanance-dashboard`);
    } catch (error) {
      dispatch({ type: "UPDATE_FAIL", error: error.response?.data?.error });
      toast.error(
        error.response?.data?.error || "Failed to update maintenance"
      );
    }
  };

  useEffect(() => {
    if (cameraModalVisible) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude.toFixed(6);
          const lng = pos.coords.longitude.toFixed(6);

          try {
            setLoadingCamera(true);
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
            );
            const data = await response.json();

            setLocation({
              lat,
              lng,
              name: data.display_name || "Unknown location",
            });
            setLoadingCamera(false);
          } catch (err) {
            console.error("Error fetching address:", err);
            setLocation({ lat, lng, name: "Location not available" });
            setLoadingCamera(false); // Fixed: changed from setLoading to setLoadingCamera
          }
        },
        (err) => {
          console.error("Error fetching location:", err);
          setLocation({
            lat: "N/A",
            lng: "N/A",
            name: "Location not available",
          });
        }
      );
    }
  }, [cameraModalVisible]);

  // Start camera when modal opens
  useEffect(() => {
    if (cameraModalVisible) {
      startCamera();
    } else {
      stopCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraModalVisible]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });
      console.log(navigator.mediaDevices.enumerateDevices());

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (err) {
      toast.error("Could not access camera: " + err.message);
      setCameraModalVisible(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // Removed duplicate getLocation function since location fetching is already in useEffect

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Set canvas dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw current frame (with horizontal flip to match preview)
      context.save();
      context.scale(-1, 1);
      context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
      context.restore();

      // === Prepare watermark data ===
      const timestamp = new Date().toLocaleString("en-IN", {
        hour12: true,
        timeZone: "Asia/Kolkata",
      });
      const coords = `Coordinates: ${location.lat}, ${location.lng}`;
      const address = `Address: ${location.name || "Fetching address..."}`;
      const timeLabel = `Timestamp: ${timestamp}`;

      // Semi-transparent background
      const boxHeight = 90;
      context.fillStyle = "rgba(0, 0, 0, 0.5)";
      context.fillRect(0, canvas.height - boxHeight, canvas.width, boxHeight);

      // White text
      context.fillStyle = "white";
      context.font = "16px Arial";
      context.textAlign = "left";

      // Draw rows
      let y = canvas.height - boxHeight + 25;
      context.fillText(coords, 10, y);
      y += 20;
      context.fillText(address, 10, y);
      y += 20;
      context.fillText(timeLabel, 10, y);

      // Convert to blob & upload
      canvas.toBlob(
        async (blob) => {
          if (blob) {
            await uploadImage(blob, currentImageField);
            setCameraModalVisible(false);
          }
        },
        "image/jpeg",
        0.8
      );
    }
  };

  const uploadImage = async (blob, fieldName) => {
    const bodyFormData = new FormData();
    bodyFormData.append("file", blob, `camera-capture-${Date.now()}.jpg`);

    dispatch({ type: "UPLOAD_REQUEST", field: fieldName });

    try {
      const { data } = await axios.post(
        "/api/v1/image-upload/preventive-maintanance",
        bodyFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authtoken}`,
          },
        }
      );

      if (data?.url) {
        // Fixed: Update formData instead of dispatching SET_IMAGE
        setFormData((prev) => ({
          ...prev,
          [fieldName]: data.url,
        }));
      }

      dispatch({ type: "UPLOAD_SUCCESS", field: fieldName });
      toast.success("Image uploaded successfully.");
    } catch (err) {
      dispatch({
        type: "UPLOAD_FAIL",
        field: fieldName,
        payload: "Upload failed",
      });
      toast.error("Image upload failed.");
    }
  };

  const openCamera = (fieldName) => {
    setCurrentImageField(fieldName);
    setCameraModalVisible(true);
  };

  return (
    <>
      <CCard className="max-w-3xl mx-auto p-6 shadow-lg rounded-lg">
        <CCardHeader>
          <h2>Update Preventive Maintenance: {formData.pm_id}</h2>
        </CCardHeader>

        <CCardBody>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <CForm onSubmit={handleSubmit}>
              <CRow className="gy-3">
                {[
                  "pm_id",
                  "robot_no",
                  "robot_type",
                  "client_id",
                  "site_name",
                  "site_id",
                  "site_location",
                ].map((field) => (
                  <CCol md={6} key={field}>
                    <CFormLabel>{field.replace(/_/g, " ")}</CFormLabel>
                    <CFormInput
                      name={field}
                      value={formData[field] || ""}
                      onChange={handleChange}
                      required
                    />
                  </CCol>
                ))}
                <CCol md={6}>
                  <CFormLabel>Start Date</CFormLabel>
                  <CFormInput
                    type="date"
                    name="start_date"
                    value={formData.start_date.split("T")[0] || ""}
                    onChange={handleChange}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>End Date</CFormLabel>
                  <CFormInput
                    type="date"
                    name="end_date"
                    value={formData.end_date.split("T")[0] || ""}
                    onChange={handleChange}
                  />
                </CCol>

                {[
                  "oiling_need_for_bearing_condition",
                  "oiling_need_for_coupling_condition",
                  "oiling_need_for_motors_condition",
                  "is_wheels_loose",
                  "is_nutbolt_loose",
                ].map((field) => (
                  <CCol md={6} key={field}>
                    <CFormLabel>{field.replace(/_/g, " ")}</CFormLabel>
                    <CFormSelect
                      name={field}
                      value={formData[field] || ""}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </CFormSelect>
                  </CCol>
                ))}

                {/* Updated image fields with camera integration */}
                {[
                  "physical_condition_of_transPipe_image",
                  "physical_condition_of_channel_image",
                  "physical_condition_of_top_bottom_cover_image",
                  "oiling_need_for_bearing_condition_image",
                  "oiling_need_for_coupling_image",
                  "oiling_need_for_motors_image",
                ].map((field) => (
                  <CCol md={6} key={field} className="mb-4">
                    <CFormLabel className="fw-bold d-block mb-3">
                      {field.replace(/_/g, " ")}
                    </CFormLabel>

                    {loadingUpload[field] ? (
                      <LoadingSpinner />
                    ) : formData[field] ? (
                      <>
                        <Link
                          to={formData[field]}
                          target="_blank"
                          className="d-block mb-2"
                        >
                          View Image
                        </Link>
                        <div className="d-flex gap-2 mb-2">
                          <CButton
                            className="btn btn-success btn-sm"
                            onClick={() => openCamera(field)}
                          >
                            Retake Photo
                          </CButton>
                        </div>
                      </>
                    ) : (
                      <CButton
                        className="btn btn-success btn-sm mb-2"
                        onClick={() => openCamera(field)}
                      >
                        Take Photo
                      </CButton>
                    )}
                  </CCol>
                ))}

                <div className="d-flex justify-content-end mt-4 gap-2">
                  <CButton
                    type="submit"
                    className=" d-flex justify-content-end align-items-center btn btn-success btn-sm"
                    disabled={updating}
                  >
                    {updating ? (
                      <>
                        Updating... <LoadingSpinner />
                      </>
                    ) : (
                      "Update Maintenance"
                    )}
                  </CButton>
                </div>
              </CRow>
            </CForm>
          )}
        </CCardBody>
      </CCard>

      {/* Added complete Camera Modal */}
      <CModal
        visible={cameraModalVisible}
        onClose={() => setCameraModalVisible(false)}
        size="lg"
        backdrop="static"
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>Take Photo</CModalTitle>
          <button
            type="button"
            className="border-0 ms-auto py-0 px-1"
            onClick={() => setCameraModalVisible(false)}
            style={{ background: "none" }}
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>

        <CModalBody
          className="text-center position-relative"
          style={{ height: "70vh", padding: 0 }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "black",
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-100 h-100"
              style={{ objectFit: "contain", transform: "scaleX(-1)" }}
              onCanPlay={() => setLoadingCamera(false)}
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />

            {/* Loading overlay */}
            {loadingCamera && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 5,
                }}
              >
                <span style={{ color: "white" }}>
                  Loading Camera... <LoadingSpinner />
                </span>
              </div>
            )}

            {/* Overlay Location, Address & Timestamp */}
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                left: "10px",
                color: "white",
                backgroundColor: "rgba(0,0,0,0.5)",
                padding: "8px 12px",
                borderRadius: "6px",
                fontSize: "14px",
                maxWidth: "95%",
              }}
            >
              <div style={{ display: "flex", gap: "5px" }}>
                <strong>Coordinates:</strong>
                <span>
                  {location.lat},{location.lng}
                </span>
              </div>
              <div style={{ display: "flex", gap: "5px" }}>
                <strong>Address:</strong>
                <span>{location.name || "Fetching address..."}</span>
              </div>
              <div style={{ display: "flex", gap: "5px" }}>
                <strong>Timestamp:</strong>
                <span>
                  {new Date().toLocaleString("en-IN", {
                    hour12: true,
                    timeZone: "Asia/Kolkata",
                  })}
                </span>
              </div>
            </div>
          </div>
        </CModalBody>

        <CModalFooter>
          <CButton
            className="btn btn-secondary btn-sm"
            onClick={() => setCameraModalVisible(false)}
          >
            Cancel
          </CButton>
          <CButton
            className="btn btn-success btn-sm"
            onClick={captureImage}
            disabled={
              loadingUpload[currentImageField] ||
              loadingCamera ||
              !location.lat ||
              !location.lng
            }
          >
            {loadingUpload[currentImageField] ? (
              <>
                Capturing... <LoadingSpinner />
              </>
            ) : (
              "Capture"
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default UpdatePreventiveMaintenance;
