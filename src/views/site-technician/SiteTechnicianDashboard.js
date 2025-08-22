// import React, { useEffect, useReducer, useState } from "react";
// import {
//   CContainer,
//   CCard,
//   CCardHeader,
//   CCardBody,
//   CForm,
//   CRow,
//   CCol,
//   CFormLabel,
//   CFormSelect,
//   CButton,
//   CAlert,
//   CBadge,
// } from "@coreui/react";
// import { useSelector } from "react-redux";
// import axios from "axios";

// import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
// import "leaflet/dist/leaflet.css";

// import L from "leaflet";
// import toast from "react-hot-toast";
// delete L.Icon.Default.prototype._getIconUrl;

// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
// });

// const initialState = {
//   loading: false,
//   statusLoaded: false,
//   success: false,
//   error: null,
//   site_id: "",
//   punchin_location: { lat: "", lng: "" },
//   punchout_location: { lat: "", lng: "" },
//   punchedIn: false,
//   punchedOut: false,
//   selectedSiteData: null,
// };

// function reducer(state, action) {
//   switch (action.type) {
//     case "SET_FIELD":
//       return { ...state, [action.name]: action.value };
//     case "SET_LOCATION_FIELD":
//       return {
//         ...state,
//         [action.locationType]: {
//           ...state[action.locationType],
//           [action.field]: action.value,
//         },
//       };
//     case "SET_STATUS":
//       return {
//         ...state,
//         punchedIn: action.payload.punchedIn,
//         punchedOut: action.payload.punchedOut,
//         statusLoaded: true,
//       };
//     case "SET_SITE_COORDINATES":
//       return { ...state, selectedSiteData: action.payload };
//     case "PUNCH_REQUEST":
//       return { ...state, loading: true, error: null, success: false };
//     case "PUNCH_SUCCESS":
//       return {
//         ...state,
//         loading: false,
//         success: true,
//         punchedIn: action.isPunchIn ? true : state.punchedIn,
//         punchedOut: action.isPunchIn ? state.punchedOut : true,
//         error: null,
//       };
//     case "PUNCH_FAIL":
//       return {
//         ...state,
//         loading: false,
//         success: false,
//         error: action.payload,
//       };
//     default:
//       return state;
//   }
// }

// const SiteTechnicianDashboard = () => {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   const {
//     site_id,
//     punchin_location,
//     punchout_location,
//     loading,
//     success,
//     error,
//     punchedIn,
//     punchedOut,
//     selectedSiteData,
//   } = state;
//   const [geoLoading, setGeoLoading] = useState(true); // ⬅️ add this

//   const authtoken = useSelector((state) => state.authtoken);
//   const userInfo = useSelector((state) => state.userInfo);
//   const [sites, setSites] = useState([]);

//   const [inTime, setinTime] = useState(new Date());
//   const [currentTime, setcurrentTime] = useState(new Date());

//   const [liveLocation, setLiveLocation] = useState(null);

//   const fetchPunchStatus = async () => {
//     try {
//       const data = await axios.get(
//         "/api/v1/technician-attendance/punchstatus",
//         { headers: { Authorization: `Bearer ${authtoken}` } }
//       );

//       setinTime(data?.data?.data?.punchin_time);

//       dispatch({
//         type: "SET_STATUS",
//         payload: {
//           punchedIn: data.data.punchedIn,
//           punchedOut: data.data.punchedOut,
//         },
//       });
//     } catch (err) {
//       console.error(err.response.data.error || err.response.data.message);
//     }
//   };

//   const fetchCoordinates = async (selectedId) => {
//     try {
//       const res = await axios.post(
//         "/api/v1/sites-coordinates/get-by-siteId",
//         { site_id: selectedId },
//         { headers: { Authorization: `Bearer ${authtoken}` } }
//       );
//       dispatch({ type: "SET_SITE_COORDINATES", payload: res.data.data });
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setLiveLocation({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           });

//           if (!punchedIn) {
//             dispatch({
//               type: "SET_LOCATION_FIELD",
//               locationType: "punchin_location",
//               field: "lat",
//               value: position.coords.latitude.toString(),
//             });
//             dispatch({
//               type: "SET_LOCATION_FIELD",
//               locationType: "punchin_location",
//               field: "lng",
//               value: position.coords.longitude.toString(),
//             });
//           }

//           setGeoLoading(false); // ✅ stop loading
//         },
//         (err) => {
//           console.error("Geolocation error:", err);
//           toast.error("Unable to access location");
//           setGeoLoading(false); // ✅ stop loading even on error
//         }
//       );
//     } catch (error) {
//       toast.error(error.response.data.message || error.response.data.error);
//       dispatch({
//         type: "PUNCH_FAIL",
//         payload: error.response.data.message || error.response.data.error,
//       });
//     }
//   };

//   // useEffect(() => {
//   //   if (!userInfo) return; // ⛔️
//   //   const userSites = userInfo.assigned_sites || [];
//   //   setSites(userSites);

//   //   if (userSites.length === 1) {
//   //     const siteId = userSites[0].site_id;
//   //     dispatch({ type: "SET_FIELD", name: "site_id", value: siteId });
//   //     fetchCoordinates(siteId);
//   //   }

//   //   fetchPunchStatus();

//   //   navigator.geolocation.getCurrentPosition(
//   //     (position) => {
//   //       setLiveLocation({
//   //         lat: position.coords.latitude,
//   //         lng: position.coords.longitude,
//   //       });
//   //       if (!punchedIn) {
//   //         dispatch({
//   //           type: "SET_LOCATION_FIELD",
//   //           locationType: "punchin_location",
//   //           field: "lat",
//   //           value: position.coords.latitude.toString(),
//   //         });
//   //         dispatch({
//   //           type: "SET_LOCATION_FIELD",
//   //           locationType: "punchin_location",
//   //           field: "lng",
//   //           value: position.coords.longitude.toString(),
//   //         });
//   //       }
//   //     },
//   //     (err) => console.error("Geolocation error:", err)
//   //   );
//   // }, [punchedIn, userInfo]);

//   useEffect(() => {
//     if (!userInfo) return;

//     const userSites = userInfo.assigned_sites || [];
//     setSites(userSites);

//     if (userSites.length === 1) {
//       const siteId = userSites[0].site_id;
//       dispatch({ type: "SET_FIELD", name: "site_id", value: siteId });
//       fetchCoordinates(siteId);
//     }

//     fetchPunchStatus();

//     setGeoLoading(true); // ⬅️ start loading
//   }, [punchedIn, userInfo]);

//   useEffect(() => {
//     if (punchedIn && !punchedOut) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           dispatch({
//             type: "SET_LOCATION_FIELD",
//             locationType: "punchout_location",
//             field: "lat",
//             value: position.coords.latitude.toString(),
//           });
//           dispatch({
//             type: "SET_LOCATION_FIELD",
//             locationType: "punchout_location",
//             field: "lng",
//             value: position.coords.longitude.toString(),
//           });
//         },
//         (err) => console.error("Punch-out location error:", err)
//       );
//     }
//   }, [punchedIn, punchedOut]);

//   const isInsideRadius = (lat1, lng1, lat2, lng2, radius) => {
//     const R = 6371000; // meters
//     const toRad = (deg) => (deg * Math.PI) / 180;

//     const dLat = toRad(lat2 - lat1);
//     const dLng = toRad(lng2 - lng1);

//     const a =
//       Math.sin(dLat / 2) ** 2 +
//       Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//     return R * c <= radius;
//   };

//   const handlePunchIn = async (e) => {
//     e.preventDefault();

//     if (!site_id) {
//       toast.error("Please select a site.");
//       return;
//     }

//     if (!selectedSiteData) {
//       toast.error("Site coordinates not available.");
//       dispatch({ type: "PUNCH_FAIL", payload: "Site data missing" });
//       return;
//     }

//     const within = isInsideRadius(
//       parseFloat(punchin_location.lat),
//       parseFloat(punchin_location.lng),
//       selectedSiteData.latitude,
//       selectedSiteData.longitude,
//       selectedSiteData.radius
//     );

//     if (!within) {
//       toast.error("You're outside the allowed site area!");
//       dispatch({ type: "PUNCH_FAIL", payload: "Outside site area" });
//       return;
//     }

//     dispatch({ type: "PUNCH_REQUEST" });

//     try {
//       const res = await axios.post(
//         "/api/v1/technician-attendance/punchin",
//         {
//           site_id,

//           punchin_location: {
//             lat: parseFloat(punchin_location.lat),
//             lng: parseFloat(punchin_location.lng),
//           },
//         },
//         { headers: { Authorization: `Bearer ${authtoken}` } }
//       );

//       dispatch({ type: "PUNCH_SUCCESS", isPunchIn: true });
//       toast.success("Punched in successfully");
//     } catch (error) {
//       dispatch({
//         type: "PUNCH_FAIL",
//         payload: error.response?.data?.message || "Punch in failed",
//       });
//       toast.error(error.response?.data?.message || "Punch in failed");
//     }
//   };

//   const handlePunchOut = async (e) => {
//     e.preventDefault();

//     if (!selectedSiteData) {
//       toast.error("Site coordinates not available.");
//       dispatch({ type: "PUNCH_FAIL", payload: "Site data missing" });
//       return;
//     }

//     const within = isInsideRadius(
//       parseFloat(punchout_location.lat),
//       parseFloat(punchout_location.lng),
//       selectedSiteData.latitude,
//       selectedSiteData.longitude,
//       selectedSiteData.radius
//     );

//     if (!within) {
//       toast.error("You're outside the allowed site area!");
//       dispatch({ type: "PUNCH_FAIL", payload: "Outside site area" });
//       return;
//     }

//     dispatch({ type: "PUNCH_REQUEST" });

//     try {
//       await axios.put(
//         "/api/v1/technician-attendance/punchout",
//         {
//           punchout_location: {
//             lat: parseFloat(punchout_location.lat),
//             lng: parseFloat(punchout_location.lng),
//           },
//         },
//         { headers: { Authorization: `Bearer ${authtoken}` } }
//       );

//       dispatch({ type: "PUNCH_SUCCESS", isPunchIn: false });
//       toast.success("Punched out successfully");
//     } catch (err) {
//       dispatch({
//         type: "PUNCH_FAIL",
//         payload: err.response?.data?.message || "Punch out failed",
//       });
//       toast.error(err.response?.data?.message || "Punch out failed");
//     }
//   };

//   const isAfterFiveHours = () => {
//     const current = new Date(currentTime);

//     const punchIn = new Date(inTime);
//     const diffInMs = current - punchIn;
//     const diffInHours = diffInMs / (1000 * 60 * 60); // convert ms to hours

//     return diffInHours > 5;
//   };

//   const getRemainingTime = () => {
//     const current = new Date(currentTime);
//     const punchIn = new Date(inTime);
//     const elapsedMs = current - punchIn;
//     const fiveHoursMs = 5 * 60 * 60 * 1000;
//     const remainingMs = fiveHoursMs - elapsedMs;

//     if (remainingMs <= 0) return null;

//     const hours = Math.floor(remainingMs / (1000 * 60 * 60));
//     const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
//     const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

//     return `${hours}h ${minutes}m ${seconds}s`;
//   };

//   return (
//     <div className="my-2">
//       <CRow>
//         <CCol md={5} lg={5}>
//           <CCard>
//             <CCardHeader>
//               <strong>Technician Attendance</strong>
//             </CCardHeader>
//             <CCardBody>
//               {error && <CAlert color="danger">{error}</CAlert>}
//               {success && <CAlert color="success">Punch successful!</CAlert>}

//               {!state.statusLoaded ? (
//                 <CAlert color="warning">Loading attendance status...</CAlert>
//               ) : punchedIn && punchedOut ? (
//                 <CAlert color="info">
//                   ✅ You have already punched in and out for today.
//                 </CAlert>
//               ) : !punchedIn ? (
//                 <CForm
//                   onSubmit={handlePunchIn}
//                   className="needs-validation"
//                   noValidate
//                 >
//                   <CRow>
//                     <CCol md={6}>
//                       <CFormLabel>Select Site</CFormLabel>
//                       <CFormSelect
//                         value={site_id}
//                         onChange={(e) => {
//                           dispatch({
//                             type: "SET_FIELD",
//                             name: "site_id",
//                             value: e.target.value,
//                           });
//                           fetchCoordinates(e.target.value);
//                         }}
//                         required
//                       >
//                         <option value="">-- Select Site --</option>
//                         {sites.map((site, index) => (
//                           <option key={index} value={site.site_id}>
//                             {site.site_id}
//                           </option>
//                         ))}
//                       </CFormSelect>
//                     </CCol>
//                   </CRow>
//                   <CButton
//                     type="submit"
//                     color="success"
//                     size="sm"
//                     className="mt-3"
//                     disabled={loading}
//                   >
//                     {loading ? "Punching In..." : "Punch In"}
//                   </CButton>
//                 </CForm>
//               ) : (
//                 <CForm onSubmit={handlePunchOut}>
//                   <CRow>
//                     <CCol md={6}>
//                       <CFormLabel>Select Site</CFormLabel>
//                       <CFormSelect
//                         value={site_id}
//                         onChange={(e) => {
//                           dispatch({
//                             type: "SET_FIELD",
//                             name: "site_id",
//                             value: e.target.value,
//                           });
//                           fetchCoordinates(e.target.value);
//                         }}
//                         required
//                       >
//                         <option value="">-- Select Site --</option>
//                         {sites.map((site, index) => (
//                           <option key={index} value={site.site_id}>
//                             {site.site_id}
//                           </option>
//                         ))}
//                       </CFormSelect>
//                     </CCol>
//                   </CRow>{" "}
//                   {isAfterFiveHours() ? (
//                     <CButton
//                       type="submit"
//                       color="warning"
//                       size="sm"
//                       className="mt-3"
//                       disabled={loading}
//                     >
//                       {loading ? "Punching Out..." : "Punch Out"}
//                     </CButton>
//                   ) : (
//                     <div className="my-3 d-flex align-items-start">
//                       <CBadge className="" color="danger">
//                         Wait for Punch Out
//                       </CBadge>
//                       &nbsp;
//                       <div className="text small">
//                         ( Time remaining: {getRemainingTime()} )
//                       </div>
//                     </div>
//                   )}
//                 </CForm>
//               )}

//               {/* Map Section */}
//               <div className="mt-4" style={{ height: "400px" }}>
//                 {geoLoading ? (
//                   <CAlert color="info">
//                     📍 Fetching your current location...
//                   </CAlert>
//                 ) : (
//                   <MapContainer
//                     center={
//                       liveLocation
//                         ? [liveLocation.lat, liveLocation.lng]
//                         : selectedSiteData
//                         ? [
//                             selectedSiteData.latitude,
//                             selectedSiteData.longitude,
//                           ]
//                         : ["", ""]
//                     }
//                     zoom={14}
//                     scrollWheelZoom={false}
//                     style={{ height: "100%", width: "100%" }}
//                   >
//                     <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                     {selectedSiteData && (
//                       <Circle
//                         center={[
//                           selectedSiteData.latitude,
//                           selectedSiteData.longitude,
//                         ]}
//                         radius={selectedSiteData.radius}
//                         pathOptions={{
//                           color: "#2aba47ff",
//                           fillColor: "#00FF00",
//                           fillOpacity: 0.1,
//                         }}
//                       />
//                     )}
//                     {liveLocation && (
//                       <Marker position={[liveLocation.lat, liveLocation.lng]} />
//                     )}
//                   </MapContainer>
//                 )}
//               </div>
//             </CCardBody>
//           </CCard>
//         </CCol>
//       </CRow>
//     </div>
//   );
// };

// export default SiteTechnicianDashboard;

// import React from "react";

// const SiteTechnicianDashboard = () => {
//   return <div>SiteTechnicianDashboard</div>;
// };

// export default SiteTechnicianDashboard;

import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormSelect,
  CRow,
} from "@coreui/react";
import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../components/LoadingSpinner";
import { CChartLine, CChartPie } from "@coreui/react-chartjs";
import "./GoogleMapEmbed.css";
import CIcon from "@coreui/icons-react";
import { cilBolt, cilCloud, cilSpeedometer } from "@coreui/icons";
// import moment from "moment";

const chartColors = ["#52357B", "#5459AC", "#648DB3", "#B2D8CE"];

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SITEID_REQUEST":
      return { ...state, loadingSiteIds: true, errorSIteIds: "" };
    case "FETCH_SITEID_SUCCESS":
      return {
        ...state,
        loadingSiteIds: false,
        siteIds: action.payload,
      };
    case "FETCH_SITEID_FAIL":
      return { ...state, loadingSiteIds: false, errorSIteIds: action.payload };

    case "FETCH_SITE_DETAILS_REQUEST":
      return {
        ...state,
        loadingSiteDetails: true,
      };
    case "FETCH_SITE_DETAILS_SUCCESS":
      return {
        ...state,
        loadingSiteDetails: false,
        siteDetails: action.payload,
      };
    case "FETCH_SITE_DETAILS_FAIL":
      return {
        ...state,
        loadingSiteDetails: false,
        siteDetailsError: action.payload,
      };
    case "FETCH_WEATHER_REQUEST":
      return { ...state, loadingWeatherData: true, errorWeatherData: "" };
    case "FETCH_WEATHER_SUCCESS":
      return {
        ...state,
        loadingWeatherData: false,
        weatherData: action.payload,
      };
    case "FETCH_WEATHER_FAIL":
      return {
        ...state,
        loadingWeatherData: false,
        errorWeatherData: action.payload,
      };
    default:
      return state;
  }
};

const SiteTechnicianDashboard = () => {
  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  const [
    {
      siteDetailsError,
      loadingSiteDetails,
      loadingSiteIds,
      siteIds,
      weatherData,
      loadingWeatherData,
      errorWeatherData,
    },
    dispatch,
  ] = useReducer(reducer, {
    siteDetailsError: "",
    loadingSiteDetails: false,
    siteDetails: {},
    weatherData: {},
    siteIds: [],
    loadingSiteIds: false,
    loadingWeatherData: true,
    errorSIteIds: "",
    errorWeatherData: "",
  });

  const [site_id, setSiteid] = useState(
    userInfo.assigned_sites[0]?.site_id || ""
  );
  const [blockWiseCleaning, setBlockWiseCleaning] = useState([]);
  const [gateways, setGateways] = useState([]);
  const [robotsData, setRobotsData] = useState([]);
  const [siteCoordinates, setSiteCoordinates] = useState({});
  const [totalAreaCleaned, setTotalAreaCleaned] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const fetchSiteIds = async () => {
    dispatch({ type: "FETCH_SITEID_REQUEST" });
    try {
      const result = await axios.get(`/api/v1/sites`, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });
      dispatch({
        type: "FETCH_SITEID_SUCCESS",
        payload: result.data.data,
      });
    } catch (error) {
      dispatch({
        type: "FETCH_SITEID_FAIL",
        payload: error.response?.data?.error || error.response?.data?.message,
      });
      toast.error(error.response?.data?.error || error.response?.data?.message);
    }
  };

  useEffect(() => {
    const fetchSiteDetails = async () => {
      dispatch({ type: "FETCH_SITE_DETAILS_REQUEST" });
      try {
        const response = await axios.get(
          `/api/v1/sites-coordinates/site-details/${site_id}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );

        dispatch({
          type: "FETCH_SITE_DETAILS_SUCCESS",
          payload: response.data.data,
        });
        setSiteCoordinates(response.data.data.coordinates);
        setTotalAreaCleaned(response.data.data.totalAreaCleaned);
        setRobotsData(response.data.data.robots);
        setGateways(response.data.data.gateways);
        setBlockWiseCleaning(response.data.data.blockWiseCleaning);
      } catch (error) {
        dispatch({
          type: "FETCH_SITE_DETAILS_FAIL",
          payload: error.response?.data?.message || error.response?.data?.error,
        });
        toast.error(
          error.response?.data?.message || error.response?.data?.error
        );
      }
    };

    const fetchWeatherData = async () => {
      dispatch({ type: "FETCH_WEATHER_REQUEST" });
      try {
        const response = await axios.get(
          `/api/v1/weatherdata/client/${site_id}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );
        dispatch({
          type: "FETCH_WEATHER_SUCCESS",
          payload: response.data.data,
        });

        console.log(response.data.data);
      } catch (error) {
        dispatch({
          type: "FETCH_WEATHER_FAIL",
          payload: error.response?.data?.message || error.response?.data?.error,
        });
        toast.error(
          error.response?.data?.message || error.response?.data?.error
        );
      }
    };

    fetchSiteDetails();
    fetchWeatherData();
    fetchSiteIds();
  }, [authtoken, site_id]);

  const handleSiteNameChange = (e) => {
    dispatch({ type: "SELECT_SITENAME_REQUEST" });

    const selectedSiteName = e.target.value;

    const selectedSite = siteIds.find(
      (site) => site.site_id === selectedSiteName
    );

    if (selectedSite) {
      setSiteid(selectedSite.site_id);

      dispatch({
        type: "SELECT_SITENAME_SUCCESS",
        payload: selectedSite.site_id,
      });
    } else {
      dispatch({ type: "SELECT_SITENAME_FAIL" });
    }
  };

  // const greeting = weatherData.createdAt
  //   ? new Date(weatherData.createdAt).getHours()
  //   : 0;
  const greeting = new Date().getHours();

  const getGreeting = () => {
    if (greeting < 12) {
      return "Good Morning";
    } else if (greeting < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  const GoogleMapEmbed = (latitude, longitude) => {
    const mapSrc = `https://maps.google.com/maps?hl=en&q=${latitude},${longitude}&t=k&z=18&ie=UTF8&iwloc=B&output=embed`;

    return (
      <div
        className="map-container"
        style={{
          position: "relative",
          height: "415px",
          width: "100%",
          // borderRadius: "5px",
          overflow: "hidden",
        }}
      >
        {!isLoaded && (
          <div className="map-loader">
            <div className="spinner"></div>
            <p>Loading Map...</p>
          </div>
        )}
        <iframe
          title="Google Satellite Map"
          width="100%"
          height="100%"
          src={mapSrc}
          onLoad={() => setIsLoaded(true)}
          allowFullScreen
        ></iframe>
      </div>
    );
  };

  const batteryChartData =
    robotsData?.map((entry) => ({
      robot: entry.robot_no,
      value: parseInt(entry.battery_voltage),
    })) || [];

  return (
    <>
      <div className="p-2">
        <div className="">
          <CRow className="g-4">
            {/* Map Section */}
            <CCol xs={12} md={7}>
              <CCard className="h-100 border-0 shadow-sm">
                <CCardHeader className="">
                  Hello {userInfo.username},
                  <span className="text-success"> {getGreeting()}</span>
                </CCardHeader>
                <CCardBody className="p-0">
                  <div>
                    {loadingSiteDetails ? (
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ minHeight: "350px" }}
                      >
                        <LoadingSpinner />
                      </div>
                    ) : (
                      GoogleMapEmbed(
                        siteCoordinates.latitude,
                        siteCoordinates.longitude
                      )
                    )}
                  </div>
                </CCardBody>
              </CCard>
            </CCol>

            {/* Weather Section */}
            <CCol xs={12} md={5}>
              <CCard className="h-100 shadow-sm border-0">
                <CCardHeader className="fw-bold">
                  <CRow className="d-flex justify-content-between align-items-center">
                    <CCol md={5} className="mb-3">
                      Weather Today{" "}
                    </CCol>

                    <CCol md={7} className="m-0">
                      {loadingSiteIds ? (
                        "fetching"
                      ) : siteIds?.length > 0 ? (
                        <CFormSelect
                          name="site_id"
                          value={site_id}
                          onChange={handleSiteNameChange}
                        >
                          {siteIds.map((item) => (
                            <option key={item.site_id} value={item.site_id}>
                              {item.site_id}
                            </option>
                          ))}
                        </CFormSelect>
                      ) : (
                        <p>No Sites Found</p>
                      )}
                    </CCol>
                  </CRow>
                </CCardHeader>
                <CCardBody className="d-flex flex-column">
                  {loadingWeatherData ? (
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{ minHeight: "350px" }}
                    >
                      <LoadingSpinner />
                    </div>
                  ) : errorWeatherData ? (
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{ minHeight: "350px" }}
                    >
                      <CBadge color="danger">{errorWeatherData}</CBadge>
                    </div>
                  ) : (
                    <>
                      {/* Welcome */}
                      <p className="">
                        Last Updated:{" "}
                        {/* {new Date(weatherData?.createdAt).toLocaleString()} */}
                        {new Date(weatherData?.createdAt).toLocaleString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                          }
                        )}
                      </p>
                      <p className="">{weatherData?.siteName}</p>

                      {/* Weather Grid */}
                      <CRow className="s">
                        <CCol xs={6}>
                          <CCard className="text-center border-0 shadow-sm">
                            <CCardBody>
                              <CIcon
                                icon={cilSpeedometer}
                                className="mb-2 text-danger"
                                size="lg"
                              />
                              <h5>{weatherData?.temperature}°C</h5>
                              <div className="text-muted small">Feels Like</div>
                            </CCardBody>
                          </CCard>
                        </CCol>
                        <CCol xs={6}>
                          <CCard className="text-center border-0 shadow-sm">
                            <CCardBody>
                              <CIcon
                                icon={cilCloud}
                                className="mb-2 text-primary"
                                size="lg"
                              />
                              <h5>{weatherData?.cloudiness}%</h5>
                              <div className="text-muted small">Cloudiness</div>
                            </CCardBody>
                          </CCard>
                        </CCol>
                        <CCol xs={6}>
                          <CCard className="text-center border-0 shadow-sm">
                            <CCardBody>
                              <CIcon
                                icon={cilSpeedometer}
                                className="mb-2 text-warning"
                                size="lg"
                              />
                              <h5>{weatherData?.wind_speed} m/s</h5>
                              <div className="text-muted small">
                                Wind @{" "}
                                {new Date(
                                  weatherData?.createdAt
                                ).toLocaleTimeString()}
                              </div>
                            </CCardBody>
                          </CCard>
                        </CCol>
                        <CCol xs={6}>
                          <CCard className="text-center border-0 shadow-sm">
                            <CCardBody>
                              <CIcon
                                icon={cilBolt}
                                className="mb-2 text-success"
                                size="lg"
                              />
                              <h5>{weatherData?.humidity}%</h5>
                              <div className="text-muted small">Humidity</div>
                            </CCardBody>
                          </CCard>
                        </CCol>
                      </CRow>
                    </>
                  )}
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </div>
        <div className="mt-4">
          <CRow className="justify-content-center">
            <CCol xs={12} md={6} className="mt-4">
              <CCard className="mb-4 shadow">
                <CCardHeader>
                  <h5 className="text-center">
                    Total Area Cleaned:{" "}
                    <span className="text-success fw-bold">
                      {totalAreaCleaned} m²
                    </span>
                  </h5>
                </CCardHeader>
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ minHeight: "350px" }}
                >
                  {loadingSiteDetails ? (
                    <LoadingSpinner />
                  ) : siteDetailsError ? (
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{ minHeight: "350px" }}
                    >
                      <CBadge color="warning">{siteDetailsError}</CBadge>
                    </div>
                  ) : (
                    <>
                      {blockWiseCleaning?.length > 0 ? (
                        <CChartPie
                          data={{
                            labels: blockWiseCleaning.map(
                              (block) => block.block
                            ),
                            datasets: [
                              {
                                data: blockWiseCleaning.map(
                                  (block) => block.areaCleaned
                                ),
                                backgroundColor: chartColors.slice(
                                  0,
                                  blockWiseCleaning.length
                                ),
                              },
                            ],
                          }}
                          options={{
                            plugins: {
                              legend: {
                                display: false, // ✅ This hides the legend
                              },
                              tooltip: {
                                callbacks: {
                                  label: function (tooltipItem) {
                                    const block =
                                      blockWiseCleaning[tooltipItem.dataIndex];
                                    return ` ${
                                      block.block || "Unassigned"
                                    } |  ${block.areaCleaned} m²`;
                                  },
                                },
                              },
                            },
                          }}
                        />
                      ) : (
                        <CBadge color="warning">
                          No Cleaning Data available
                        </CBadge>
                      )}
                    </>
                  )}
                </div>
              </CCard>
            </CCol>

            <CCol xs={12} md={6} className="mt-4">
              <CCard className="mb-4 shadow">
                <CCardHeader>
                  <h5 className="text-center">Gateway Details</h5>
                </CCardHeader>
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ minHeight: "350px" }}
                >
                  {loadingSiteDetails ? (
                    <LoadingSpinner />
                  ) : siteDetailsError ? (
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{ minHeight: "350px" }}
                    >
                      <CBadge color="warning">{siteDetailsError}</CBadge>
                    </div>
                  ) : (
                    <>
                      {gateways.length > 0 ? (
                        <CChartPie
                          data={{
                            labels: gateways.map(
                              (gateway) => gateway.gateway_name
                            ),
                            datasets: [
                              {
                                data: gateways.map(() => 1),
                                backgroundColor: gateways.map((gateway) =>
                                  gateway.gateway_status ? "#28a745" : "#dc3545"
                                ),
                              },
                            ],
                          }}
                          options={{
                            plugins: {
                              legend: {
                                display: false, // ✅ This hides the legend
                              },

                              tooltip: {
                                callbacks: {
                                  label: function (tooltipItem) {
                                    const gateway =
                                      gateways[tooltipItem.dataIndex];
                                    return `${
                                      gateway.gateway_status
                                        ? "Online"
                                        : "Offline"
                                    }`;
                                  },
                                },
                              },
                            },
                          }}
                        />
                      ) : (
                        <CBadge color="warning">
                          No Gateway details available
                        </CBadge>
                      )}
                    </>
                  )}
                </div>
              </CCard>
            </CCol>
          </CRow>
        </div>
        <div className="mt-4">
          <CCard className="mb-4 shadow">
            <CCardHeader>
              <h5>Battery Status</h5>{" "}
            </CCardHeader>
            <CCardBody className="d-flex justify-content-center align-items-center">
              {loadingSiteDetails ? (
                <LoadingSpinner />
              ) : siteDetailsError ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ minHeight: "350px" }}
                >
                  {" "}
                  <CBadge color="warning">{siteDetailsError}</CBadge>
                </div>
              ) : (
                <>
                  {robotsData?.length > 0 ? (
                    <CChartLine
                      style={{ height: "300px", width: "100%" }}
                      data={{
                        labels: batteryChartData.map((entry) =>
                          entry.robot.slice(-3)
                        ),
                        datasets: [
                          {
                            label: "Battery (%)",
                            data: batteryChartData.map((entry) => entry.value),
                            borderColor: "#648DB3",
                            tension: 0.4,
                          },
                        ],
                      }}
                      options={{
                        scales: {
                          y: {
                            beginAtZero: true,
                          },
                        },
                      }}
                    />
                  ) : (
                    <CBadge color="warning">
                      No battery logs found for the Robots
                    </CBadge>
                  )}
                </>
              )}
            </CCardBody>
          </CCard>
        </div>
      </div>
    </>
  );
};

export default SiteTechnicianDashboard;
