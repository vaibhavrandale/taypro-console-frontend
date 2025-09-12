import React, { useEffect, useReducer, useState } from "react";
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
} from "@coreui/react";
import { useSelector } from "react-redux";
import axios from "axios";

import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import toast from "react-hot-toast";
delete L.Icon.Default.prototype._getIconUrl;

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
  } = state;
  const [geoLoading, setGeoLoading] = useState(true); // ⬅️ add this
  const [canPunchIn, setCanPunchIn] = useState(false);
  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  const [sites, setSites] = useState([]);

  const [inTime, setinTime] = useState(new Date());
  const [currentTime, setcurrentTime] = useState(new Date());

  const [liveLocation, setLiveLocation] = useState(null);

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

          setGeoLoading(false); // ✅ stop loading
        },
        (err) => {
          console.error("Geolocation error:", err);
          toast.error("Unable to access location");
          setGeoLoading(false); // ✅ stop loading even on error
        }
      );
    } catch (error) {
      toast.error(error.response.data.message || error.response.data.error);
      dispatch({
        type: "PUNCH_FAIL",
        payload: error.response.data.message || error.response.data.error,
      });
    }
  };

  useEffect(() => {
    if (!userInfo) return;

    const userSites = userInfo.assigned_sites || [];
    setSites(userSites);

    if (userSites && userSites.length > 1) {
      const siteId = userSites[0].site_id;
      dispatch({ type: "SET_FIELD", name: "site_id", value: siteId });
      fetchCoordinates(siteId);
    }

    fetchPunchStatus();

    setGeoLoading(true); // ⬅️ start loading
  }, [punchedIn, userInfo]);

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

  const handlePunchIn = async (e) => {
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

    dispatch({ type: "PUNCH_REQUEST" });

    try {
      const res = await axios.post(
        "/api/v1/technician-attendance/punchin",
        {
          site_id,

          punchin_location: {
            lat: parseFloat(punchin_location.lat),
            lng: parseFloat(punchin_location.lng),
          },
        },
        { headers: { Authorization: `Bearer ${authtoken}` } }
      );

      dispatch({ type: "PUNCH_SUCCESS", isPunchIn: true });
      toast.success("Punched in successfully");
    } catch (error) {
      dispatch({
        type: "PUNCH_FAIL",
        payload: error.response?.data?.message || "Punch in failed",
      });
      toast.error(error.response?.data?.message || "Punch in failed");
    }
  };

  const handlePunchOut = async (e) => {
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

    dispatch({ type: "PUNCH_REQUEST" });

    try {
      await axios.put(
        "/api/v1/technician-attendance/punchout",
        {
          punchout_location: {
            lat: parseFloat(punchout_location.lat),
            lng: parseFloat(punchout_location.lng),
          },
        },
        { headers: { Authorization: `Bearer ${authtoken}` } }
      );

      dispatch({ type: "PUNCH_SUCCESS", isPunchIn: false });
      toast.success("Punched out successfully");
    } catch (err) {
      dispatch({
        type: "PUNCH_FAIL",
        payload: err.response?.data?.message || "Punch out failed",
      });
      toast.error(err.response?.data?.message || "Punch out failed");
    }
  };

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
                  onSubmit={handlePunchIn}
                  className="needs-validation"
                  noValidate
                >
                  <CRow>
                    <CCol md={6}>
                      <CFormLabel>Select Site</CFormLabel>
                      <CFormSelect
                        value={site_id}
                        onChange={(e) => {
                          dispatch({
                            type: "SET_FIELD",
                            name: "site_id",
                            value: e.target.value,
                          });
                          fetchCoordinates(e.target.value);
                        }}
                        required
                      >
                        <option value="">-- Select Site --</option>
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
                      {loading ? "Punching In..." : "Punch In"}
                    </CButton>
                  ) : (
                    <div className="mt-3 text-danger">
                      You are outside the allotted area.
                    </div>
                  )}
                </CForm>
              ) : (
                <CForm onSubmit={handlePunchOut}>
                  <CRow>
                    <CCol md={6}>
                      <CFormLabel>Select Site</CFormLabel>
                      <CFormSelect
                        value={site_id}
                        onChange={(e) => {
                          dispatch({
                            type: "SET_FIELD",
                            name: "site_id",
                            value: e.target.value,
                          });
                          fetchCoordinates(e.target.value);
                        }}
                        required
                      >
                        <option value="">-- Select Site --</option>
                        {sites.map((site, index) => (
                          <option key={index} value={site.site_id}>
                            {site.site_id}
                          </option>
                        ))}
                      </CFormSelect>
                    </CCol>
                  </CRow>{" "}
                  {isAfterFiveHours() ? (
                    <CButton
                      type="submit"
                      color="warning"
                      size="sm"
                      className="mt-3"
                      disabled={loading}
                    >
                      {loading ? "Punching Out..." : "Punch Out"}
                    </CButton>
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
                {geoLoading ? (
                  <CAlert color="info">
                    📍 Fetching your current location...
                  </CAlert>
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
                        : ["", ""]
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
    </div>
  );
};

export default PunchInPunchOut;
