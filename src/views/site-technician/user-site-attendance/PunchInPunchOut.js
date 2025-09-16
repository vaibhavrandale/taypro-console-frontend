import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CRow,
  CCol,
  CFormLabel,
  CFormSelect,
  CButton,
  CAlert,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
import { useSelector } from "react-redux";
import axios from "axios";

import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import toast from "react-hot-toast";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";
import Webcam from "react-webcam";
import LoadingSpinner from "../../../components/LoadingSpinner";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const initialState = {
  loading: false,
  statusLoaded: false,
  success: false,
  error: null,
  site_id: "",
  punchin_location: { lat: "", lng: "" },
  punchout_location: { lat: "", lng: "" },
  punchedIn: false,
  punchedOut: false,
  selectedSiteData: null,
  mapReady: false, // New state for map readiness
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.name]: action.value };
    case "SET_LOCATION_FIELD":
      return {
        ...state,
        [action.locationType]: {
          ...state[action.locationType],
          [action.field]: action.value,
        },
      };
    case "SET_STATUS":
      return {
        ...state,
        punchedIn: action.payload.punchedIn,
        punchedOut: action.payload.punchedOut,
        statusLoaded: true,
      };
    case "SET_SITE_COORDINATES":
      return { ...state, selectedSiteData: action.payload };
    case "SET_MAP_READY":
      return { ...state, mapReady: action.payload };
    case "UPLOAD_USER_IMAGE_REQUEST":
      return { ...state, uploadingImage: true, uploadError: null };
    case "UPLOAD_USER_IMAGE_SUCCESS":
      return { ...state, uploadingImage: false };
    case "UPLOAD_USER_IMAGE_FAIL":
      return { ...state, uploadingImage: false, uploadError: action.payload };
    case "SAVE_USER_IMAGE_REQUEST":
      return { ...state, savingImage: true, saveError: null };
    case "SAVE_USER_IMAGE_SUCCESS":
      return { ...state, savingImage: false };
    case "SAVE_USER_IMAGE_FAIL":
      return { ...state, savingImage: false, saveError: action.payload };
    case "PUNCH_REQUEST":
      return { ...state, loading: true, error: null, success: false };
    case "PUNCH_SUCCESS":
      return {
        ...state,
        loading: false,
        success: true,
        punchedIn: action.isPunchIn ? true : state.punchedIn,
        punchedOut: action.isPunchIn ? state.punchedOut : true,
        error: null,
      };
    case "PUNCH_FAIL":
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload,
      };

    default:
      return state;
  }
}

const PunchInPunchOut = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    site_id,
    punchin_location,
    punchout_location,
    loading,
    success,
    error,
    punchedIn,
    punchedOut,
    selectedSiteData,
    uploadingImage,
    savingImage,
    uploadError,
    mapReady,
  } = state;

  const [geoLoading, setGeoLoading] = useState(true);
  const [canPunchIn, setCanPunchIn] = useState(false);
  const [canPunchOut, setCanPunchOut] = useState(false);
  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  const [sites, setSites] = useState([]);
  const [inTime, setinTime] = useState(new Date());
  const [currentTime, setcurrentTime] = useState(new Date());
  const [liveLocation, setLiveLocation] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showPunchInModal, setShowPunchInModal] = useState(false);
  const [showPunchOutModal, setShowPunchOutModal] = useState(false);
  const isProcessing = uploadingImage || savingImage;
  const webcamRef = useRef(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  const fetchPunchStatus = async () => {
    try {
      const data = await axios.get(
        "/api/v1/technician-attendance/punchstatus",
        { headers: { Authorization: `Bearer ${authtoken}` } }
      );

      setinTime(data?.data?.data?.punchin_time);

      dispatch({
        type: "SET_STATUS",
        payload: {
          punchedIn: data.data.punchedIn,
          punchedOut: data.data.punchedOut,
        },
      });
    } catch (err) {
      console.error(err.response.data.error || err.response.data.message);
    }
  };

  const fetchCoordinates = async (selectedId) => {
    try {
      const res = await axios.post(
        "/api/v1/sites-coordinates/get-by-siteId",
        { site_id: selectedId },
        { headers: { Authorization: `Bearer ${authtoken}` } }
      );
      dispatch({ type: "SET_SITE_COORDINATES", payload: res.data.data });

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLiveLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });

          if (!punchedIn) {
            dispatch({
              type: "SET_LOCATION_FIELD",
              locationType: "punchin_location",
              field: "lat",
              value: position.coords.latitude.toString(),
            });
            dispatch({
              type: "SET_LOCATION_FIELD",
              locationType: "punchin_location",
              field: "lng",
              value: position.coords.longitude.toString(),
            });
          }

          setGeoLoading(false);
          // Set map ready after location is obtained
          dispatch({ type: "SET_MAP_READY", payload: true });
        },
        (err) => {
          console.error("Geolocation error:", err);
          toast.error("Unable to access location");
          console.log(err);
          setGeoLoading(false);
          // Even if geolocation fails, show the map
          dispatch({ type: "SET_MAP_READY", payload: true });
        }
      );
    } catch (error) {
      toast.error(error.response.data.message || error.response.data.error);
      dispatch({
        type: "PUNCH_FAIL",
        payload: error.response.data.message || error.response.data.error,
      });
      setGeoLoading(false);
      dispatch({ type: "SET_MAP_READY", payload: true });
    }
  };

  // Initialize sites and auto-select first site
  useEffect(() => {
    if (!userInfo) return;

    const userSites = userInfo.assigned_sites || [];
    setSites(userSites);

    // Auto-select first site if available
    if (userSites && userSites.length > 0) {
      const firstSiteId = userSites[0].site_id;
      dispatch({ type: "SET_FIELD", name: "site_id", value: firstSiteId });
      fetchCoordinates(firstSiteId);
    } else {
      // No sites available, stop loading
      setGeoLoading(false);
      dispatch({ type: "SET_MAP_READY", payload: true });
    }

    fetchPunchStatus();
  }, [userInfo]);

  useEffect(() => {
    if (punchedIn && !punchedOut) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          dispatch({
            type: "SET_LOCATION_FIELD",
            locationType: "punchout_location",
            field: "lat",
            value: position.coords.latitude.toString(),
          });
          dispatch({
            type: "SET_LOCATION_FIELD",
            locationType: "punchout_location",
            field: "lng",
            value: position.coords.longitude.toString(),
          });
        },
        (err) => console.error("Punch-out location error:", err)
      );
    }
  }, [punchedIn, punchedOut]);

  const isInsideRadius = (lat1, lng1, lat2, lng2, radius) => {
    const R = 6371000; // meters
    const toRad = (deg) => (deg * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c <= radius;
  };

  // Check if user is inside radius for punch in
  useEffect(() => {
    if (!liveLocation || !selectedSiteData) {
      setCanPunchIn(false);
      return;
    }
    const within = isInsideRadius(
      liveLocation.lat,
      liveLocation.lng,
      selectedSiteData.latitude,
      selectedSiteData.longitude,
      selectedSiteData.radius
    );
    setCanPunchIn(within);
  }, [liveLocation, selectedSiteData]);

  // Check if user is inside radius for punch out
  useEffect(() => {
    if (!liveLocation || !selectedSiteData || !punchedIn || punchedOut) {
      setCanPunchOut(false);
      return;
    }
    const within = isInsideRadius(
      liveLocation.lat,
      liveLocation.lng,
      selectedSiteData.latitude,
      selectedSiteData.longitude,
      selectedSiteData.radius
    );
    setCanPunchOut(within);
  }, [liveLocation, selectedSiteData, punchedIn, punchedOut]);

  // Modified to open camera modal instead of direct punch in
  const handlePunchInClick = (e) => {
    e.preventDefault();

    if (!site_id) {
      toast.error("Please select a site.");
      return;
    }

    if (!selectedSiteData) {
      toast.error("Site coordinates not available.");
      dispatch({ type: "PUNCH_FAIL", payload: "Site data missing" });
      return;
    }

    const within = isInsideRadius(
      parseFloat(punchin_location.lat),
      parseFloat(punchin_location.lng),
      selectedSiteData.latitude,
      selectedSiteData.longitude,
      selectedSiteData.radius
    );

    if (!within) {
      toast.error("You're outside the allowed site area!");
      dispatch({ type: "PUNCH_FAIL", payload: "Outside site area" });
      return;
    }

    // Open camera modal instead of direct punch in
    setShowPunchInModal(true);
  };

  // Modified to open camera modal instead of direct punch out
  const handlePunchOutClick = (e) => {
    e.preventDefault();

    if (!selectedSiteData) {
      toast.error("Site coordinates not available.");
      dispatch({ type: "PUNCH_FAIL", payload: "Site data missing" });
      return;
    }

    const within = isInsideRadius(
      parseFloat(punchout_location.lat),
      parseFloat(punchout_location.lng),
      selectedSiteData.latitude,
      selectedSiteData.longitude,
      selectedSiteData.radius
    );

    if (!within) {
      toast.error("You're outside the allowed site area!");
      dispatch({ type: "PUNCH_FAIL", payload: "Outside site area" });
      return;
    }

    // Open camera modal instead of direct punch out
    setShowPunchOutModal(true);
  };

  // Handle site selection change
  const handleSiteChange = (e) => {
    const selectedSiteId = e.target.value;
    dispatch({
      type: "SET_FIELD",
      name: "site_id",
      value: selectedSiteId,
    });

    if (selectedSiteId) {
      setGeoLoading(true);
      dispatch({ type: "SET_MAP_READY", payload: false });
      fetchCoordinates(selectedSiteId);
    }
  };

  // Actual punch in function that will be called from modal
  const handlePunchIn = async () => {
    dispatch({ type: "PUNCH_REQUEST" });

    try {
      const res = await axios.post(
        "/api/v1/technician-attendance/punchin",
        {
          site_id,
          punch_in_image: uploadedImageUrl,
          punchin_location: {
            lat: parseFloat(punchin_location.lat),
            lng: parseFloat(punchin_location.lng),
          },
        },
        { headers: { Authorization: `Bearer ${authtoken}` } }
      );

      dispatch({ type: "PUNCH_SUCCESS", isPunchIn: true });
      toast.success("Punched in successfully");
      handleClosePunchInModal(); // Close modal after successful punch in
    } catch (error) {
      dispatch({
        type: "PUNCH_FAIL",
        payload: error.response?.data?.message || "Punch in failed",
      });
      toast.error(error.response?.data?.message || "Punch in failed");
    }
  };

  // Actual punch out function that will be called from modal
  const handlePunchOut = async () => {
    dispatch({ type: "PUNCH_REQUEST" });

    try {
      await axios.put(
        "/api/v1/technician-attendance/punchout",
        {
          punch_out_image: uploadedImageUrl,
          punchout_location: {
            lat: parseFloat(punchout_location.lat),
            lng: parseFloat(punchout_location.lng),
          },
        },
        { headers: { Authorization: `Bearer ${authtoken}` } }
      );

      dispatch({ type: "PUNCH_SUCCESS", isPunchIn: false });
      toast.success("Punched out successfully");
      handleClosePunchOutModal(); // Close modal after successful punch out
    } catch (err) {
      dispatch({
        type: "PUNCH_FAIL",
        payload: err.response?.data?.message || "Punch out failed",
      });
      toast.error(err.response?.data?.message || "Punch out failed");
    }
  };

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user", //"user" for front camera, "environment" for back camera
  };

  const captureImage = useCallback(() => {
    const src = webcamRef.current.getScreenshot();
    setCapturedImage(src);
  }, []);

  const handleClosePunchInModal = () => {
    setShowPunchInModal(false);
    setCapturedImage(null);
    setUploadedImageUrl("");
  };

  const handleClosePunchOutModal = () => {
    setShowPunchOutModal(false);
    setCapturedImage(null);
    setUploadedImageUrl("");
  };

  const retake = () => setCapturedImage(null);

  const isAfterFiveHours = () => {
    const current = new Date(currentTime);

    const punchIn = new Date(inTime);
    const diffInMs = current - punchIn;
    const diffInHours = diffInMs / (1000 * 60 * 60); // convert ms to hours

    return diffInHours > 5;
  };

  const getRemainingTime = () => {
    const current = new Date(currentTime);
    const punchIn = new Date(inTime);
    const elapsedMs = current - punchIn;
    const fiveHoursMs = 5 * 60 * 60 * 1000;
    const remainingMs = fiveHoursMs - elapsedMs;

    if (remainingMs <= 0) return null;

    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const handleUploadAndSave = async () => {
    await handleImageUpload();
  };

  const base64ToBlob = (base64, mimeType) => {
    const bytes = atob(base64.split(",")[1]);
    const arr = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
    return new Blob([arr], { type: mimeType });
  };

  const handleImageUpload = useCallback(async () => {
    if (!capturedImage) return;
    const blob = base64ToBlob(capturedImage, "image/jpeg");
    const form = new FormData();
    form.append("file", blob, "captured.jpg");

    try {
      dispatch({ type: "UPLOAD_USER_IMAGE_REQUEST" });
      const { data } = await axios.post(
        "/api/v1/image-upload/user-images",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authtoken}`,
          },
        }
      );
      dispatch({ type: "UPLOAD_USER_IMAGE_SUCCESS" });
      setUploadedImageUrl(data.url);
    } catch (err) {
      dispatch({
        type: "UPLOAD_USER_IMAGE_FAIL",
        payload: err.response?.data?.error || "Upload failed",
      });
      toast.error("Upload failed");
    }
  }, [capturedImage, authtoken]);

  return (
    <div className="my-2">
      <CRow>
        <CCol md={5} lg={5}>
          <CCard>
            <CCardHeader>
              <strong>Technician Attendance</strong>
            </CCardHeader>
            <CCardBody>
              {error && <CAlert color="danger">{error}</CAlert>}
              {success && <CAlert color="success">Punch successful!</CAlert>}

              {!state.statusLoaded ? (
                <CAlert color="warning">Loading attendance status...</CAlert>
              ) : punchedIn && punchedOut ? (
                <CAlert color="info">
                  ✅ You have already punched in and out for today.
                </CAlert>
              ) : !punchedIn ? (
                <CForm
                  onSubmit={handlePunchInClick}
                  className="needs-validation"
                  noValidate
                >
                  <CRow>
                    <CCol md={6}>
                      <CFormLabel>Select Site</CFormLabel>
                      <CFormSelect
                        value={site_id}
                        onChange={handleSiteChange}
                        required
                      >
                        {sites.map((site, index) => (
                          <option key={index} value={site.site_id}>
                            {site.site_id}
                          </option>
                        ))}
                      </CFormSelect>
                    </CCol>
                  </CRow>

                  {canPunchIn ? (
                    <CButton
                      type="submit"
                      color="success"
                      size="sm"
                      className="mt-3"
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Punch In"}
                    </CButton>
                  ) : (
                    <div className="mt-3 text-danger">
                      You are outside the allotted area.
                    </div>
                  )}
                </CForm>
              ) : (
                <CForm onSubmit={handlePunchOutClick}>
                  <CRow>
                    <CCol md={6}>
                      <CFormLabel>Select Site</CFormLabel>
                      <CFormSelect
                        value={site_id}
                        onChange={handleSiteChange}
                        required
                      >
                        {sites.map((site, index) => (
                          <option key={index} value={site.site_id}>
                            {site.site_id}
                          </option>
                        ))}
                      </CFormSelect>
                    </CCol>
                  </CRow>

                  {isAfterFiveHours() && canPunchOut ? (
                    <CButton
                      type="submit"
                      color="warning"
                      size="sm"
                      className="mt-3"
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Punch Out"}
                    </CButton>
                  ) : !canPunchOut ? (
                    <div className="mt-3 text-danger">
                      You are outside the allotted area for punch out.
                    </div>
                  ) : (
                    <div className="my-3 d-flex align-items-start">
                      <CBadge className="" color="danger">
                        Wait for Punch Out
                      </CBadge>
                      &nbsp;
                      <div className="text small">
                        ( Time remaining: {getRemainingTime()} )
                      </div>
                    </div>
                  )}
                </CForm>
              )}

              {/* Map Section */}
              <div className="mt-4" style={{ height: "400px" }}>
                {geoLoading || !mapReady ? (
                  <div className="d-flex justify-content-center align-items-center h-100">
                    <div className="text-center">
                      <LoadingSpinner />
                      <div className="mt-2">
                        📍 Loading location and map data...
                      </div>
                    </div>
                  </div>
                ) : (
                  <MapContainer
                    center={
                      liveLocation
                        ? [liveLocation.lat, liveLocation.lng]
                        : selectedSiteData
                        ? [
                            selectedSiteData.latitude,
                            selectedSiteData.longitude,
                          ]
                        : [0, 0]
                    }
                    zoom={14}
                    scrollWheelZoom={false}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {selectedSiteData && (
                      <Circle
                        center={[
                          selectedSiteData.latitude,
                          selectedSiteData.longitude,
                        ]}
                        radius={selectedSiteData.radius}
                        pathOptions={{
                          color: "#2aba47ff",
                          fillColor: "#00FF00",
                          fillOpacity: 0.1,
                        }}
                      />
                    )}
                    {liveLocation && (
                      <Marker position={[liveLocation.lat, liveLocation.lng]} />
                    )}
                  </MapContainer>
                )}
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Punch In Camera Modal */}
      <CModal
        visible={showPunchInModal}
        onClose={handleClosePunchInModal}
        size="lg"
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>Capture Photo for Punch In</CModalTitle>
          <span>(with white bg)</span>
          <button
            type="button"
            className=" border-0 ms-auto py-0 px-1"
            onClick={handleClosePunchInModal}
            style={{ background: "none" }}
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>
        <CModalBody className="text-center">
          {capturedImage ? (
            <>
              <img
                src={capturedImage}
                alt="Captured"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "8px",
                  border: "2px solid #ccc",
                }}
              />
              {uploadedImageUrl && (
                <div className="mt-2 text-success">✓ uploaded successfully</div>
              )}
            </>
          ) : (
            <Webcam
              audio={false}
              height={480}
              width={640}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              mirrored
              style={{
                borderRadius: "8px",
                border: "2px solid #ccc",
                maxWidth: "100%",
                height: "auto",
              }}
            />
          )}
        </CModalBody>
        <CModalFooter className="d-flex justify-content-center gap-2">
          {capturedImage ? (
            <>
              {uploadedImageUrl ? (
                // show Punch In button after image is uploaded
                <CButton
                  color="success"
                  size="sm"
                  onClick={handlePunchIn}
                  disabled={loading}
                >
                  {loading ? "Punching In..." : "Punch In"}
                </CButton>
              ) : (
                // show Save Photo button if image not yet uploaded
                <CButton
                  color="success"
                  size="sm"
                  onClick={handleUploadAndSave}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <LoadingSpinner />
                      {uploadingImage ? "Uploading..." : "Saving..."}
                    </>
                  ) : (
                    "Save Photo"
                  )}
                </CButton>
              )}
              <CButton
                color="warning"
                size="sm"
                onClick={retake}
                disabled={isProcessing || loading}
              >
                Retake
              </CButton>
            </>
          ) : (
            <CButton color="primary" size="sm" onClick={captureImage}>
              Capture
            </CButton>
          )}
        </CModalFooter>
      </CModal>

      {/* Punch Out Camera Modal */}
      <CModal
        visible={showPunchOutModal}
        onClose={handleClosePunchOutModal}
        size="lg"
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>Capture Photo for Punch Out</CModalTitle>
          <span>(with white bg)</span>
          <button
            type="button"
            className=" border-0 ms-auto py-0 px-1"
            onClick={handleClosePunchOutModal}
            style={{ background: "none" }}
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>
        <CModalBody className="text-center">
          {capturedImage ? (
            <>
              <img
                src={capturedImage}
                alt="Captured"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "8px",
                  border: "2px solid #ccc",
                }}
              />
              {uploadedImageUrl && (
                <div className="mt-2 text-success">✓ uploaded successfully</div>
              )}
            </>
          ) : (
            <Webcam
              audio={false}
              height={480}
              width={640}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              mirrored
              style={{
                borderRadius: "8px",
                border: "2px solid #ccc",
                maxWidth: "100%",
                height: "auto",
              }}
            />
          )}
        </CModalBody>
        <CModalFooter className="d-flex justify-content-center gap-2">
          {capturedImage ? (
            <>
              {uploadedImageUrl ? (
                // show Punch Out button after image is uploaded
                <CButton
                  color="warning"
                  size="sm"
                  onClick={handlePunchOut}
                  disabled={loading}
                >
                  {loading ? "Punching Out..." : "Punch Out"}
                </CButton>
              ) : (
                // show Save Photo button if image not yet uploaded
                <CButton
                  color="success"
                  size="sm"
                  onClick={handleUploadAndSave}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <LoadingSpinner />
                      {uploadingImage ? "Uploading..." : "Saving..."}
                    </>
                  ) : (
                    "Save Photo"
                  )}
                </CButton>
              )}
              <CButton
                color="warning"
                size="sm"
                onClick={retake}
                disabled={isProcessing || loading}
              >
                Retake
              </CButton>
            </>
          ) : (
            <CButton color="primary" size="sm" onClick={captureImage}>
              Capture
            </CButton>
          )}
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default PunchInPunchOut;
