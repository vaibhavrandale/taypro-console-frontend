/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable default-case */
import React, { useEffect, useReducer, useState, useRef } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormTextarea,
  CButton,
  CRow,
  CCol,
  CListGroup,
  CListGroupItem,
  CBadge,
  CModalFooter,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
} from "@coreui/react";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { cilX } from "@coreui/icons";
import { cilCloudUpload } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./servicetickts.css";
// import imageCompression from "browser-image-compression";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_ROBOTS_REQUEST":
      return { ...state, robotsloading: true };

    case "FETCH_ROBOTS_SUCCESS":
      return { ...state, robots: action.payload, robotsloading: false };

    case "FETCH_ROBOTS_FAIL":
      return { ...state, robotsloading: false, roboterror: action.payload };

    case "FETCH_FAULTS_REQUEST":
      return { ...state, faultsloading: true };

    case "FETCH_FAULTS_SUCCESS":
      return {
        ...state,
        serviceticketsfault: action.payload,
        faultsloading: false,
      };

    case "FETCH_FAULTS_FAIL":
      return { ...state, faultsloading: false, faulterror: action.payload };
  }
};

const SiteTechnicianCreateServiceTicket = () => {
  const [
    {
      faultsloading,
      roboterror,
      robotsloading,
      faulterror,
      robots,
      serviceticketsfault,
    },
    dispatch,
  ] = useReducer(reducer, {
    faultsloading: true,
    robotsloading: true,
    roboterror: "",
    faulterror: "",
    robots: [],
    serviceticketsfault: [],
  });

  const [formData, setFormData] = useState({
    robot_no: "",
    deveui: "",
    site_id: "",
    company: "",
    lora_no: "",
    fault_type: "",
    ticket_generating_notes: "",
    block: "",
    robot_type: "",
    ticket_resolved: false,
    ticket_generated_images1: "",
    ticket_generated_images2: "",
    ticket_generated_images3: "",
    ticket_generated_images4: "",
    ticket_generated_images5: "",
  });

  const authtoken = useSelector((state) => state.authtoken);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRobots, setFilteredRobots] = useState([]);
  const [uploadingFields, setUploadingFields] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [faultSearchTerm, setFaultSearchTerm] = useState("");
  const [filteredFaults, setFilteredFaults] = useState([]);
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [currentImageField, setCurrentImageField] = useState("");
  const [loadingCamera, setLoadingCamera] = useState(false);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchRobots = async () => {
      try {
        dispatch({ type: "FETCH_ROBOTS_REQUEST" });

        const result = await axios.get(
          `/api/v1/robots/get-robots-no`,

          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );

        dispatch({
          type: "FETCH_ROBOTS_SUCCESS",
          payload: result.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_ROBOTS_FAIL",
          payload: error.response.statusText,
        });
        toast.error(error.response.statusText);
      }
    };
    const fetchAllFaults = async () => {
      try {
        dispatch({ type: "FETCH_FAULTS_REQUEST" });
        const response = await axios.get(
          "/api/v1/serviceticketsfaults/all-serviceticketsfaults-without-pg",
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );

        dispatch({
          type: "FETCH_FAULTS_SUCCESS",
          payload: response.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_ROBOTS_FAIL",
          payload: error.response.data.message || error.response.data.error,
        });
      }
    };
    fetchRobots();
    fetchAllFaults();
  }, [authtoken]);

  const handleFaultSearchChange = (e) => {
    const value = e.target.value;
    setFaultSearchTerm(value);
    if (value.length > 0) {
      const filtered = serviceticketsfault.filter((fault) =>
        fault.fault_name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredFaults(filtered);
    } else {
      setFilteredFaults([]);
    }
  };
  const selectFaultFromSearch = (fault) => {
    setFormData({ ...formData, fault_type: fault.fault_name });
    setFaultSearchTerm("");
    setFilteredFaults([]);
  };

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 0) {
      const filtered = robots.filter(
        (robot) =>
          robot.robot_no.toLowerCase().includes(value.toLowerCase()) ||
          robot.site_id.toLowerCase().includes(value.toLowerCase())
      );

      setFilteredRobots(filtered);
    } else {
      setFilteredRobots([]);
    }
  };

  const deleteFileHandler = async (fileName) => {
    setFormData((prevData) => ({
      ...prevData,
      [`ticket_generated_images${fileName}`]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/v1/servicetickets", formData, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });
      toast.success(
        `${response.data.data.ticket_id}, Ticket Created Successfully!`
      );
      setLoading(false);
      navigate(`/site-technician/service-tickets`);
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  const selectRobotFromSearch = (robot) => {
    setFormData({
      ...formData,
      robot_no: robot.robot_no,
      deveui: robot.deveui,
      site_id: robot.site_id,
      company: robot.company,
      lora_no: robot.lora_no,
      block: robot.block,
      robot_type: robot.robot_type,
    });
    setSearchTerm(""); // Clear search input
    setFilteredRobots([]); // Hide suggestions
  };

  // const handleFileChange = async (event) => {
  //   const { name, files } = event.target;
  //   if (files.length === 0) return;

  //   const file = files[0];
  //   const formData = new FormData();
  //   formData.append("file", file);

  //   try {
  //     setUploadingFields((prev) => ({ ...prev, [name]: true })); // ✅ Set only this field to loading

  //     const response = await axios.post(
  //       "/api/v1/image-upload/service-tickets",
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${authtoken}`,
  //         },
  //       }
  //     );

  //     setFormData((prevData) => ({
  //       ...prevData,
  //       [name]: response.data.url, // Assuming backend returns { url: "uploaded_image_url" }
  //     }));

  //     setUploadingFields((prev) => ({ ...prev, [name]: false })); // ✅ Stop loading for this input
  //   } catch (error) {
  //     setUploadingFields((prev) => ({ ...prev, [name]: false })); // ✅ Stop loading on error
  //     console.error("File upload error:", error);
  //   }
  // };

  // const handleFileChange = async (event) => {
  //   const { name, files } = event.target;
  //   if (files.length === 0) return;

  //   const file = files[0];

  //   try {
  //     setUploadingFields((prev) => ({ ...prev, [name]: true }));

  //     // Compress image
  //     const options = {
  //       maxSizeMB: 5, // Keep below 10MB Cloudinary limit
  //       maxWidthOrHeight: 1920, // Resize large images
  //       useWebWorker: true,
  //     };

  //     const compressedFile = await imageCompression(file, options);

  //     const formData = new FormData();
  //     formData.append("file", compressedFile);

  //     const response = await axios.post(
  //       "/api/v1/image-upload/service-tickets",
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${authtoken}`,
  //         },
  //       }
  //     );

  //     setFormData((prevData) => ({
  //       ...prevData,
  //       [name]: response.data.url,
  //     }));

  //     setUploadingFields((prev) => ({ ...prev, [name]: false }));
  //   } catch (error) {
  //     setUploadingFields((prev) => ({ ...prev, [name]: false }));
  //     console.error("File upload error:", error);
  //   }
  // };

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
            setLocation({ lat, lng, name: "Location not available" });
            setLoadingCamera(false);
          }
        },
        (err) => {
          setLocation({
            lat: "N/A",
            lng: "N/A",
            name: "Location not available",
          });
        }
      );
    }
  }, [cameraModalVisible]);

  useEffect(() => {
    if (cameraModalVisible) {
      startCamera();
    } else {
      stopCamera();
    }
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

  const openCamera = (fieldName) => {
    setCurrentImageField(fieldName);
    setCameraModalVisible(true);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.save();
      // Mirror only if using user-facing camera
      const track =
        video.srcObject && video.srcObject.getVideoTracks
          ? video.srcObject.getVideoTracks()[0]
          : null;
      const settings = track ? track.getSettings() : {};
      if (settings.facingMode === "user") {
        context.scale(-1, 1);
        context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
      } else {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
      context.restore();

      const timestamp = new Date().toLocaleString("en-IN", {
        hour12: true,
        timeZone: "Asia/Kolkata",
      });
      const coords = `Coordinates: ${location.lat}, ${location.lng}`;
      const address = `Address: ${location.name || "Fetching address..."}`;
      const timeLabel = `Timestamp: ${timestamp}`;
      const boxHeight = 90;
      context.fillStyle = "rgba(0,0,0,0.5)";
      context.fillRect(0, canvas.height - boxHeight, canvas.width, boxHeight);
      context.fillStyle = "white";
      context.font = "16px Arial";
      context.textAlign = "left";
      let y = canvas.height - boxHeight + 25;
      context.fillText(coords, 10, y);
      y += 20;
      context.fillText(address, 10, y);
      y += 20;
      context.fillText(timeLabel, 10, y);
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
    setUploadingFields((prev) => ({ ...prev, [fieldName]: true }));
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", blob, `camera-capture-${Date.now()}.jpg`);
      const response = await axios.post(
        "/api/v1/image-upload/service-tickets",
        formDataUpload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authtoken}`,
          },
        }
      );
      setFormData((prevData) => ({
        ...prevData,
        [fieldName]: response.data.url,
      }));
      setUploadingFields((prev) => ({ ...prev, [fieldName]: false }));
      toast.success("Image uploaded successfully.");
    } catch (error) {
      setUploadingFields((prev) => ({ ...prev, [fieldName]: false }));
      toast.error("Image upload failed.");
    }
  };

  return (
    <CRow className="justify-content-center">
      <CCol>
        <CCard className="shadow">
          <CCardHeader>
            <h5>Create New Service Ticket</h5>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              {robotsloading ? (
                <LoadingSpinner />
              ) : roboterror ? (
                <span className="badge bg-danger p-2">{roboterror}</span>
              ) : (
                <CFormInput
                  type="text"
                  placeholder="Search Robot No or Site ID..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="mb-3"
                />
              )}
              {searchTerm && (
                <CListGroup
                  className="mb-3"
                  style={{
                    maxHeight: "250px",
                    overflowY: "auto",
                    width: "300px",
                    padding: "8px",
                    marginTop: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "0.375rem",
                    backgroundColor: "#fff",
                  }}
                >
                  {filteredRobots.length === 0 ? (
                    <CListGroupItem>No robots found</CListGroupItem>
                  ) : (
                    filteredRobots.map((robot, index) => (
                      <CListGroupItem
                        id="robot_no"
                        key={index}
                        action
                        style={{ cursor: "pointer", padding: "10px" }}
                        onClick={() => selectRobotFromSearch(robot)}
                      >
                        {robot.robot_no} - {robot.site_id}
                      </CListGroupItem>
                    ))
                  )}
                </CListGroup>
              )}
              <CRow>
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    name="deveui"
                    value={formData.robot_no}
                    label="Robot No"
                    disabled
                    className="mb-3"
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    name="deveui"
                    value={formData.deveui}
                    label="Deveui"
                    disabled
                    className="mb-3"
                  />
                </CCol>
              </CRow>
              <CRow>
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    name="site_id"
                    value={formData.site_id}
                    label="Site ID"
                    disabled
                    className="mb-3"
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    name="company"
                    value={formData.company}
                    label="Company"
                    disabled
                    className="mb-3"
                  />
                </CCol>
              </CRow>
              <CRow>
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    name="lora_no"
                    value={formData.lora_no ? formData.lora_no : "N/A"}
                    label="Lora No"
                    disabled
                    className="mb-3"
                  />
                </CCol>
              </CRow>

              {/* 📌 Select Fault Type */}
              {faultsloading ? (
                <LoadingSpinner />
              ) : faulterror ? (
                <span className="badge bg-danger p-2">{roboterror}</span>
              ) : (
                <>
                  <CFormInput
                    type="text"
                    placeholder="Search Fault Type..."
                    value={faultSearchTerm}
                    onChange={handleFaultSearchChange}
                    className="mb-3"
                  />
                  {faultSearchTerm && (
                    <CListGroup
                      className="mb-3"
                      style={{
                        maxHeight: "250px",
                        overflowY: "auto",
                        width: "300px",
                        padding: "8px",
                        marginTop: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "0.375rem",
                        backgroundColor: "#fff",
                      }}
                    >
                      {filteredFaults.length === 0 ? (
                        <CListGroupItem>No fault types found</CListGroupItem>
                      ) : (
                        filteredFaults.map((fault, index) => (
                          <CListGroupItem
                            key={index}
                            action
                            style={{ cursor: "pointer", padding: "10px" }}
                            onClick={() => selectFaultFromSearch(fault)}
                          >
                            {fault.fault_name.replace(/-/g, " ")}
                          </CListGroupItem>
                        ))
                      )}
                    </CListGroup>
                  )}
                  {formData.fault_type && !faultSearchTerm && (
                    <div className="mb-3">
                      <strong>Selected Fault:</strong>{" "}
                      {formData.fault_type.replace(/-/g, " ")}
                    </div>
                  )}
                </>
              )}
              {/* 📌 Notes */}
              <CFormTextarea
                name="notes"
                value={formData.ticket_generating_notes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ticket_generating_notes: e.target.value,
                  })
                }
                rows={3}
                placeholder="Add any additional notes..."
                className="mb-3"
              />

              {/* {[1, 2, 3, 4, 5].map((num, index) => (
                <CRow>
                  <CCol md={2} key={`resolved-${index}`}>
                    <div className="container-btn-file p-2 m-2 w-80">
                      <CIcon icon={cilCloudUpload} className="upload-icon" />
                      {`Image ${num}`}
                      <input
                        className="file"
                        name={`ticket_generated_images${num}`}
                        type="file"
                        onChange={handleFileChange}
                        disabled={
                          uploadingFields[`ticket_generated_images${num}`]
                        }
                      />
                    </div>
                  </CCol>

                  <CCol md={3}>
                    {uploadingFields[`ticket_generated_images${num}`] ? ( // ✅ Show loader only for the uploading input
                      <div className="mt-2 d-flex justify-content-center">
                        <LoadingSpinner />
                      </div>
                    ) : formData[`ticket_generated_images${num}`] ? (
                      <div className="my-2">
                        <img
                          className="position-relative "
                          src={formData[`ticket_generated_images${num}`]}
                          alt={`Generated Image ${num}`}
                          width="80"
                          height="80"
                          style={{ objectFit: "cover", borderRadius: "5px" }}
                        />
                        <CBadge
                          color="primary"
                          position="absolute"
                          top="0"
                          left="0"
                          shape="rounded-pill"
                          className=" p-1"
                        >
                          <CIcon
                            icon={cilX}
                            cursor="pointer"
                            onClick={() => deleteFileHandler(num)}
                            title="Download file"
                          />
                        </CBadge>
                      </div>
                    ) : null}
                  </CCol>
                </CRow>
              ))} */}

              {[1, 2, 3, 4, 5].map((num, index) => (
                <CRow key={`row-${index}`} className="align-items-center">
                  <CCol md={2}>
                    <div
                      className="container-btn-file p-2 m-2 w-80"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        openCamera(`ticket_generated_images${num}`)
                      }
                      title={
                        formData[`ticket_generated_images${num}`]
                          ? "Retake Photo"
                          : "Take Photo"
                      }
                    >
                      <CIcon icon={cilCloudUpload} className="upload-icon" />
                      {`Image ${num}`}
                    </div>
                  </CCol>
                  <CCol md={3}>
                    {uploadingFields[`ticket_generated_images${num}`] ? (
                      <div className="mt-2 d-flex justify-content-center">
                        <LoadingSpinner />
                      </div>
                    ) : formData[`ticket_generated_images${num}`] ? (
                      <div className="my-2 position-relative">
                        <img
                          src={formData[`ticket_generated_images${num}`]}
                          alt={`Generated Image ${num}`}
                          width="80"
                          height="80"
                          style={{ objectFit: "cover", borderRadius: "5px" }}
                        />
                        <CBadge
                          color="primary"
                          shape="rounded-pill"
                          className="position-absolute top-0 start-0 p-1"
                          style={{ cursor: "pointer" }}
                          onClick={() => deleteFileHandler(num)}
                        >
                          <CIcon icon={cilX} title="Remove file" />
                        </CBadge>
                      </div>
                    ) : (
                      ""
                    )}
                  </CCol>
                </CRow>
              ))}

              {/* Camera Modal */}
              <CModal
                visible={cameraModalVisible}
                onClose={() => setCameraModalVisible(false)}
                size="xl"
                scrollable
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
                      uploadingFields[currentImageField] ||
                      loadingCamera ||
                      !location.lat ||
                      !location.lng
                    }
                  >
                    {uploadingFields[currentImageField] ? (
                      <>
                        Capturing... <LoadingSpinner />
                      </>
                    ) : (
                      "Capture"
                    )}
                  </CButton>
                </CModalFooter>
              </CModal>

              {/* 📌 Submit Button */}
              <div className="d-flex justify-content-end">
                <CButton
                  type="submit"
                  color="success"
                  size="sm"
                  className=" m-2"
                  disabled={
                    loading || !formData.fault_type || !formData.robot_no
                  }
                >
                  {loading ? (
                    <>
                      Creating... <LoadingSpinner />{" "}
                    </>
                  ) : (
                    "Create Ticket"
                  )}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default SiteTechnicianCreateServiceTicket;
