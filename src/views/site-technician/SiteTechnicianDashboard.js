import React, { useReducer, useEffect, useState } from "react";
import {
  CContainer,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CForm,
  CFormLabel,
  CAlert,
  CRow,
  CCol,
  CFormSelect,
} from "@coreui/react";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../components/LoadingSpinner";

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
  } = state;

  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  const [sites, setSites] = useState([]);
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

  useEffect(() => {
    const userSites = userInfo.assigned_sites || [];
    setSites(userSites);

    if (userSites.length === 1) {
      dispatch({
        type: "SET_FIELD",
        name: "site_id",
        value: userSites[0].site_id,
      });
    }

    // 🔥 Add this line to fetch punch status
    fetchPunchStatus();

    if (!punchedIn) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
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
        },
        (err) => {
          console.error("Punch-in location error:", err);
        }
      );
    }
  }, [punchedIn, userInfo.assigned_sites]);

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
        (err) => {
          console.error("Punch-out location error:", err);
        }
      );
    }
  }, [punchedIn, punchedOut]);

  const handlePunchIn = async (e) => {
    e.preventDefault();
    console.log("Punch In Form Submitted");
    console.log("Selected site_id:", site_id);

    dispatch({ type: "PUNCH_REQUEST" });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        // const lat = "1223343";
        // const lng = "5435345";

        console.log("Retrieved location:", { lat, lng });

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
          console.error("Punch-in API error:", err);
          dispatch({
            type: "PUNCH_FAIL",
            payload: err.response?.data?.message || "Punch in failed",
          });
        }
      },
      (err) => {
        console.error("Location access denied or error:", err);
        dispatch({
          type: "PUNCH_FAIL",
          payload: "Location access denied. Please enable location services.",
        });
      }
    );
  };

  const handlePunchOut = async (e) => {
    e.preventDefault();
    console.log("Punch Out Form Submitted");
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
            <CAlert color="warning">
              Loading attendance status...
              <LoadingSpinner />{" "}
            </CAlert>
          ) : punchedIn && punchedOut ? (
            <CAlert color="info">
              ✅You have already punched in and out for today.
            </CAlert>
          ) : !punchedIn ? (
            <CForm onSubmit={handlePunchIn}>
              <CRow>
                <CCol md={6}>
                  <CFormLabel>Select Site</CFormLabel>
                  <CFormSelect
                    value={site_id}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_FIELD",
                        name: "site_id",
                        value: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">-- Select Site --</option>
                    {sites.length === 0 ? (
                      <option disabled>No sites available</option>
                    ) : (
                      sites.map((site, index) => (
                        <option key={index} value={site.site_id}>
                          {site.site_id}
                        </option>
                      ))
                    )}
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
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default SiteTechnicianDashboard;
