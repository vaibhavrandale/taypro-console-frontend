import React, { useEffect, useReducer, useState } from "react";
import {
  CContainer,
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
} from "@coreui/react";
import { useSelector } from "react-redux";
import axios from "axios";

import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// For marker icons fix in Leaflet
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

const SiteTechnicianDashboard = () => {
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

  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  const [sites, setSites] = useState([]);
  const [liveLocation, setLiveLocation] = useState(null);

  const fetchPunchStatus = async () => {
    try {
      const { data } = await axios.get(
        "/api/v1/technician-attendance/punchstatus",
        { headers: { Authorization: `Bearer ${authtoken}` } }
      );

      dispatch({
        type: "SET_STATUS",
        payload: {
          punchedIn: data.punchedIn,
          punchedOut: data.punchedOut,
        },
      });
    } catch (err) {
      console.error("Error fetching punch status:", err);
    }
  };

  const fetchCoordinates = async (selectedId) => {
    try {
      const res = await axios.post(
        "/api/v1/sites-coordinates/site/get-by-siteId",
        { site_id: selectedId },
        { headers: { Authorization: `Bearer ${authtoken}` } }
      );
      console.log(res);
      dispatch({ type: "SET_SITE_COORDINATES", payload: res.data.data });
    } catch (error) {
      toast.error(error.response.data.message || error.response.data.error);
      dispatch({
        type: "PUNCH_FAIL",
        payload: error.response.data.message || error.response.data.error,
      });
    }
  };

  useEffect(() => {
    if (!userInfo) return; // ⛔️
    const userSites = userInfo.assigned_sites || [];
    setSites(userSites);

    if (userSites.length === 1) {
      const siteId = userSites[0].site_id;
      dispatch({ type: "SET_FIELD", name: "site_id", value: siteId });
      fetchCoordinates(siteId);
    }

    fetchPunchStatus();

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
      },
      (err) => console.error("Geolocation error:", err)
    );
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

  const handlePunchIn = async (e) => {
    e.preventDefault();
    dispatch({ type: "PUNCH_REQUEST" });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        if (!selectedSiteData) {
          toast.error("Site coordinates not available.");
          dispatch({ type: "PUNCH_FAIL", payload: "Site data missing" });
          return;
        }

        const within = isInsideRadius(
          lat,
          lng,
          selectedSiteData.latitude,
          selectedSiteData.longitude,
          selectedSiteData.radius
        );

        if (!within) {
          toast.error("You're outside the allowed site area!");
          dispatch({ type: "PUNCH_FAIL", payload: "Outside site area" });
          return;
        }

        try {
          await axios.post(
            "/api/v1/technician-attendance/punchin",
            {
              site_id,
              punchin_location: { lat, lng },
            },
            { headers: { Authorization: `Bearer ${authtoken}` } }
          );
          dispatch({ type: "PUNCH_SUCCESS", isPunchIn: true });
        } catch (err) {
          dispatch({
            type: "PUNCH_FAIL",
            payload: err.response?.data?.message || "Punch in failed",
          });
        }
      },
      () => {
        dispatch({
          type: "PUNCH_FAIL",
          payload: "Location access denied. Please enable location services.",
        });
      }
    );
  };

  const handlePunchOut = async (e) => {
    e.preventDefault();
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
    } catch (err) {
      dispatch({
        type: "PUNCH_FAIL",
        payload: err.response?.data?.message || "Punch out failed",
      });
    }
  };

  return (
    <CContainer className="mt-4">
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
              <CButton
                type="submit"
                color="primary"
                className="mt-3"
                disabled={loading}
              >
                {loading ? "Punching In..." : "Punch In"}
              </CButton>
            </CForm>
          ) : (
            <CForm onSubmit={handlePunchOut}>
              <CButton
                type="submit"
                color="warning"
                className="mt-3"
                disabled={loading}
              >
                {loading ? "Punching Out..." : "Punch Out"}
              </CButton>
            </CForm>
          )}

          {/* Map Section */}
          <div className="mt-4" style={{ height: "400px" }}>
            <MapContainer
              center={
                selectedSiteData
                  ? [selectedSiteData.latitude, selectedSiteData.longitude]
                  : [18.6485, 73.8313]
              }
              zoom={13}
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
                    color: "blue",
                    fillColor: "#00f",
                    fillOpacity: 0.2,
                  }}
                />
              )}
              {liveLocation && (
                <Marker position={[liveLocation.lat, liveLocation.lng]} />
              )}
            </MapContainer>
          </div>
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default SiteTechnicianDashboard;
