// import React, { useReducer, useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-hot-toast";
// import {
//   CCard,
//   CCardHeader,
//   CCardBody,
//   CForm,
//   CFormLabel,
//   CFormInput,
//   CListGroup,
//   CListGroupItem,
//   CRow,
//   CCol,
//   CButton,
//   CFormSelect,
// } from "@coreui/react";
// import { useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import LoadingSpinner from "../../../components/LoadingSpinner";
// import imageCompression from "browser-image-compression";

// const initialState = {
//   pm_id: "",
//   robot_no: "",
//   robot_type: "",
//   client_id: "",
//   site_name: "",
//   site_id: "",
//   site_location: "",
//   physical_condition_of_transPipe_condition: "",
//   physical_condition_of_transPipe_image: "",
//   physical_condition_of_channel_condition: "",
//   physical_condition_of_channel_image: "",
//   oiling_need_for_bearing_condition: "",
//   oiling_need_for_bearing_condition_image: "",
//   oiling_need_for_motors_condition: "",
//   oiling_need_for_motors_image: "",
//   mf_clothes_alignment: "",
//   wheels_alignment: "",
//   is_wheels_loose: "",
//   is_nutbolt_loose: "",
//   start_date: "",
//   end_date: "",
//   loadingUpload: false,
// };

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "ADD_PM_REQUEST":
//       return { ...state, loadingPM: true, error: "" };

//     case "ADD_PM_SUCCESS":
//       return {
//         ...state,
//         loadingPM: false,
//         pmData: action.payload,
//         success: true,
//       };

//     case "ADD_PM_FAIL":
//       return {
//         ...state,
//         loadingPM: false,
//         error: action.payload,
//         success: false,
//       };

//     case "UPDATE_FIELD":
//       return { ...state, [action.field]: action.value };
//     case "FILL_ROBOT_DATA":
//       return { ...state, ...action.data };
//     case "SET_IMAGE":
//       return { ...state, [action.field]: action.url };

//     case "UPLOAD_REQUEST":
//       return {
//         ...state,
//         loadingUpload: { ...state.loadingUpload, [action.field]: true },
//       };

//     case "UPLOAD_SUCCESS":
//       return {
//         ...state,
//         loadingUpload: { ...state.loadingUpload, [action.field]: false },
//       };

//     case "UPLOAD_FAIL":
//       return {
//         ...state,
//         loadingUpload: { ...state.loadingUpload, [action.field]: false },
//         errorUpload: action.payload,
//       };

//     case "RESET":
//       return initialState;
//     default:
//       return state;
//   }
// };

// const CreateTechnicianPreventivemaintanance = () => {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   const authtoken = useSelector((state) => state.authtoken);
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [robots, setRobots] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredRobots, setFilteredRobots] = useState([]);

//   useEffect(() => {
//     const fetchRobots = async () => {
//       try {
//         const { data } = await axios.get("/api/v1/robots/get-robots-no", {
//           headers: { Authorization: `Bearer ${authtoken}` },
//         });
//         setRobots(data.data);
//       } catch (error) {
//         toast.error(
//           error.response?.data?.message || error.response?.data?.error
//         );
//       }
//     };
//     fetchRobots();
//   }, [authtoken]);

//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchTerm(value);

//     if (value.length > 0) {
//       const filtered = robots.filter(
//         (robot) =>
//           robot.robot_no.toLowerCase().includes(value.toLowerCase()) ||
//           robot.site_id.toLowerCase().includes(value.toLowerCase())
//       );
//       setFilteredRobots(filtered);
//     } else {
//       setFilteredRobots([]);
//     }
//   };

//   const selectRobotFromSearch = (robot) => {
//     dispatch({
//       type: "FILL_ROBOT_DATA",
//       data: {
//         robot_no: robot.robot_no,
//         robot_type: robot.robot_type,
//         site_id: robot.site_id,
//       },
//     });
//     setSearchTerm("");
//     setFilteredRobots([]);
//   };

//   // const handleImageUpload = async (e, fieldName) => {
//   //   const file = e.target.files[0];
//   //   if (!file) return;

//   //   const bodyFormData = new FormData();
//   //   bodyFormData.append("file", file);

//   //   dispatch({ type: "UPLOAD_REQUEST", field: fieldName }); // Set loading for this specific field

//   //   try {
//   //     const { data } = await axios.post(
//   //       "/api/v1/image-upload/preventive-maintanance",
//   //       bodyFormData,
//   //       {
//   //         headers: {
//   //           "Content-Type": "multipart/form-data",
//   //           Authorization: `Bearer ${authtoken}`,
//   //         },
//   //       }
//   //     );

//   //     if (data?.url) {
//   //       dispatch({ type: "SET_IMAGE", field: fieldName, url: data.url });
//   //     }

//   //     dispatch({ type: "UPLOAD_SUCCESS", field: fieldName }); // Stop loading for this field
//   //     toast.success("Image uploaded successfully.");
//   //   } catch (err) {
//   //     dispatch({
//   //       type: "UPLOAD_FAIL",
//   //       field: fieldName,
//   //       payload: "Upload failed",
//   //     });
//   //     toast.error("Image upload failed.");
//   //   }
//   // };

//   const handleImageUpload = async (e, fieldName) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     dispatch({ type: "UPLOAD_REQUEST", field: fieldName });

//     try {
//       // Compress image before upload
//       const options = {
//         maxSizeMB: 5, // keep size below 5MB to stay within Cloudinary limit
//         maxWidthOrHeight: 1920, // optional, resize dimensions if needed
//         useWebWorker: true,
//       };

//       const compressedFile = await imageCompression(file, options);

//       const bodyFormData = new FormData();
//       bodyFormData.append("file", compressedFile);

//       const { data } = await axios.post(
//         "/api/v1/image-upload/preventive-maintanance",
//         bodyFormData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${authtoken}`,
//           },
//         }
//       );

//       if (data?.url) {
//         dispatch({ type: "SET_IMAGE", field: fieldName, url: data.url });
//       }

//       dispatch({ type: "UPLOAD_SUCCESS", field: fieldName });
//       toast.success("Image uploaded successfully.");
//     } catch (err) {
//       dispatch({
//         type: "UPLOAD_FAIL",
//         field: fieldName,
//         payload: "Upload failed",
//       });
//       toast.error(err.response.data.error || err.response.data.message);
//     }
//   };

//   const handleChange = (e) => {
//     dispatch({
//       type: "UPDATE_FIELD",
//       field: e.target.name,
//       value: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       dispatch({ type: "ADD_PM_REQUEST" });

//       const data = await axios.post("/api/v1/preventivemaintenances", state, {
//         headers: { Authorization: `Bearer ${authtoken}` },
//       });
//       dispatch({ type: "ADD_PM_SUCCESS", payload: data.data });
//       toast.success("Preventive Maintenance Created Successfully!");

//       // toast.success("Preventive Maintenance Created!");
//       navigate("/site-technician/preventive-maintanance-dashboard");
//     } catch (error) {
//       toast.error(error.response?.data?.error || "Something went wrong");
//       dispatch({ type: "ADD_PM_FAIL", payload: error.message });
//       toast.error(error.response?.data?.error || "Something went wrong");
//     }
//   };

//   return (
//     <CCard className="max-w-3xl mx-auto p-4 shadow-lg rounded-lg">
//       <CCardHeader>
//         <h2>Create Preventive Maintenance</h2>
//       </CCardHeader>
//       <CCardBody>
//         <CForm onSubmit={handleSubmit}>
//           <CRow className="gy-3">
//             <CCol md={12}>
//               <CFormLabel>Search Robot</CFormLabel>
//               <CFormInput
//                 type="text"
//                 placeholder="Search Robot No or Site ID..."
//                 value={searchTerm}
//                 onChange={handleSearchChange}
//               />
//               <CListGroup className="mb-3">
//                 {searchTerm && filteredRobots.length === 0 ? (
//                   <CListGroupItem>No robots found</CListGroupItem>
//                 ) : (
//                   filteredRobots.map((robot, index) => (
//                     <CListGroupItem
//                       key={index}
//                       action
//                       onClick={() => selectRobotFromSearch(robot)}
//                     >
//                       {robot.robot_no} - {robot.site_id}
//                     </CListGroupItem>
//                   ))
//                 )}
//               </CListGroup>
//             </CCol>

//             {["robot_no", "robot_type", "site_id"].map((field) => (
//               <CCol md={6} key={field}>
//                 <CFormLabel>{field.replace(/_/g, " ")}</CFormLabel>
//                 <CFormInput
//                   type="text"
//                   name={field}
//                   value={state[field]}
//                   readOnly
//                 />
//               </CCol>
//             ))}

//             {[
//               "physical_condition_of_transPipe_condition",
//               "physical_condition_of_channel_condition",
//               "physical_condition_of_top_bottom_cover_condition",
//               "oiling_need_for_bearing_condition",
//               "oiling_need_for_coupling_condition",
//               "oiling_need_for_motors_condition",
//               "mf_clothes_alignment",
//               "wheels_alignment",
//               "is_wheels_loose",
//               "is_nutbolt_loose",
//             ].map((field) => (
//               <CCol md={6} key={field}>
//                 <CFormLabel>{field.replace(/_/g, " ")}</CFormLabel>

//                 <CFormSelect
//                   name={field}
//                   value={state[field]}
//                   onChange={handleChange}
//                 >
//                   {[
//                     "mf_clothes_alignment",
//                     "wheels_alignment",
//                     "physical_condition_of_transPipe_condition",
//                     "physical_condition_of_channel_condition",
//                     "physical_condition_of_top_bottom_cover_condition",
//                   ].includes(field) ? (
//                     <>
//                       <option value="">Select</option>
//                       <option value="OK">OK</option>
//                       <option value="Not OK">Not OK</option>
//                     </>
//                   ) : (
//                     <>
//                       <option value="">Select</option>
//                       <option value="Yes">Yes</option>
//                       <option value="No">No</option>
//                     </>
//                   )}
//                 </CFormSelect>
//               </CCol>
//             ))}

//             {[
//               "physical_condition_of_transPipe_image",
//               "physical_condition_of_channel_image",
//               "physical_condition_of_top_bottom_cover_image",
//               "oiling_need_for_bearing_condition_image",
//               "oiling_need_for_coupling_image",
//               "oiling_need_for_motors_image",
//             ].map((field) => (
//               <CCol md={6} key={field}>
//                 <CFormLabel>{field.replace(/_/g, " ")}</CFormLabel>

//                 {state.loadingUpload[field] ? ( // Show spinner while uploading
//                   <LoadingSpinner />
//                 ) : state[field] ? ( // Show View link only if image exists
//                   <Link to={state[field]} target="_blank">
//                     View
//                   </Link>
//                 ) : (
//                   <p>No Image Available</p> // Show this only when no image is uploaded
//                 )}

//                 <CFormInput
//                   type="file"
//                   onChange={(e) => handleImageUpload(e, field)}
//                 />
//               </CCol>
//             ))}
//           </CRow>

//           <CButton
//             color="primary"
//             type="submit"
//             className="mt-4"
//             disabled={loading}
//           >
//             {loading ? "Submitting..." : "Submit"}
//           </CButton>
//         </CForm>
//       </CCardBody>
//     </CCard>
//   );
// };

// export default CreateTechnicianPreventivemaintanance;

import React, { useReducer, useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CFormLabel,
  CFormInput,
  CListGroup,
  CListGroupItem,
  CRow,
  CCol,
  CButton,
  CFormSelect,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../components/LoadingSpinner";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";

const initialState = {
  pm_id: "",
  robot_no: "",
  robot_type: "",
  client_id: "",
  site_name: "",
  site_id: "",
  site_location: "",
  physical_condition_of_transPipe_condition: "",
  physical_condition_of_transPipe_image: "",
  physical_condition_of_channel_condition: "",
  physical_condition_of_channel_image: "",
  physical_condition_of_top_bottom_cover_condition: "",
  physical_condition_of_top_bottom_cover_image: "",
  oiling_need_for_bearing_condition: "",
  oiling_need_for_bearing_condition_image: "",
  oiling_need_for_coupling_condition: "",
  oiling_need_for_coupling_image: "",
  oiling_need_for_motors_condition: "",
  oiling_need_for_motors_image: "",
  mf_clothes_alignment: "",
  wheels_alignment: "",
  is_wheels_loose: "",
  is_nutbolt_loose: "",
  start_date: "",
  end_date: "",
  loadingUpload: false,
  loadingRobots: true,
  robots: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_PM_REQUEST":
      return { ...state, loadingPM: true, error: "" };

    case "ADD_PM_SUCCESS":
      return {
        ...state,
        loadingPM: false,
        pmData: action.payload,
        success: true,
      };

    case "ADD_PM_FAIL":
      return {
        ...state,
        loadingPM: false,
        error: action.payload,
        success: false,
      };

    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };
    case "FILL_ROBOT_DATA":
      return { ...state, ...action.data };
    case "SET_IMAGE":
      return { ...state, [action.field]: action.url };

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
    case "FETCH_ROBOTS_REQUEST":
      return { ...state, loadingRobots: true, error: "" };
    case "FETCH_ROBOTS_SUCCESS":
      return {
        ...state,
        loadingRobots: false,
        robots: action.payload.data,
      };
    case "FETCH_ROBOTS_FAIL":
      return { ...state, loadingRobots: false, error: action.payload };

    case "RESET":
      return initialState;
    default:
      return state;
  }
};

const CreateTechnicianPreventivemaintanance = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const authtoken = useSelector((state) => state.authtoken);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRobots, setFilteredRobots] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [loadingCamera, setLoadingCamera] = useState(false);

  // Camera states
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [currentImageField, setCurrentImageField] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [location, setLocation] = useState({ lat: null, lng: null, name: "" });

  useEffect(() => {
    const fetchRobots = async () => {
      dispatch({ type: "FETCH_ROBOTS_REQUEST" });
      try {
        const result = await axios.get("/api/v1/robots/get-robots-no", {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        dispatch({
          type: "FETCH_ROBOTS_SUCCESS",
          payload: {
            data: result.data.data,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_ROBOTS_FAIL",
          payload: error.response?.data?.message || error.response?.data?.error,
        });
        toast.error(
          error.response?.data?.message || error.response?.data?.error
        );
      }
    };
    fetchRobots();
  }, [authtoken]);

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
            setLoadingCamera(false);
          }
        },
        (err) => {
          console.error("Error fetching location:", err);
          setLocation({
            lat: "N/A",
            lng: "N/A",
            name: "Location not available",
          });
          setLoadingCamera(false);
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

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Set canvas dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw current frame
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Prepare watermark data
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
        dispatch({ type: "SET_IMAGE", field: fieldName, url: data.url });
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

  const validateForm = () => {
    const errors = {};
    const requiredFields = [
      "physical_condition_of_transPipe_condition",
      "physical_condition_of_channel_condition",
      "oiling_need_for_bearing_condition",
      // "client_id",
      // "site_name",
      // "site_location",
      "start_date",
      "end_date",
    ];

    requiredFields.forEach((field) => {
      if (!state[field] || state[field].trim() === "") {
        errors[field] = `${field.replace(/_/g, " ")} is required`;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      const filtered = state.robots.filter((robot) => {
        const robotNo = robot.robot_no?.toLowerCase() || "";
        const siteId = robot.site_id?.toLowerCase() || "";
        const searchValue = value.toLowerCase();

        return robotNo.includes(searchValue) || siteId.includes(searchValue);
      });

      setFilteredRobots(filtered);
    } else {
      setFilteredRobots([]);
    }
  };

  const selectRobotFromSearch = (robot) => {
    dispatch({
      type: "FILL_ROBOT_DATA",
      data: {
        robot_no: robot.robot_no,
        robot_type: robot.robot_type,
        site_id: robot.site_id,
        client_id: robot.client_id || "",
        site_name: robot.site_name || "",
        site_location: robot.site_location || "",
      },
    });
    setSearchTerm("");
    setFilteredRobots([]);
  };

  const handleChange = (e) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: e.target.name,
      value: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      dispatch({ type: "ADD_PM_REQUEST" });

      const data = await axios.post("/api/v1/preventivemaintenances", state, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });
      dispatch({ type: "ADD_PM_SUCCESS", payload: data.data });
      toast.success(data.data.message);
      navigate("/site-technician/preventive-maintanance-dashboard");
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Something went wrong";
      toast.error(errorMsg);
      dispatch({ type: "ADD_PM_FAIL", payload: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CCard className="max-w-3xl mx-auto p-4 shadow-lg rounded-lg">
        <CCardHeader>
          <h2>Create Preventive Maintenance</h2>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            <CRow className="gy-3">
              <CCol md={12}>
                <CFormLabel>
                  Search Robot {state.loadingRobots && <LoadingSpinner />}{" "}
                </CFormLabel>
                <CFormInput
                  type="text"
                  placeholder="Search Robot No or Site ID..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <CListGroup className="mb-3">
                  {searchTerm && filteredRobots.length === 0 ? (
                    <CListGroupItem>No robots found</CListGroupItem>
                  ) : (
                    filteredRobots.map((robot, index) => (
                      <CListGroupItem
                        key={index}
                        action
                        onClick={() => selectRobotFromSearch(robot)}
                      >
                        {robot.robot_no} - {robot.site_id}
                      </CListGroupItem>
                    ))
                  )}
                </CListGroup>
              </CCol>

              {["robot_no", "robot_type", "site_id"].map((field) => (
                <CCol md={6} key={field}>
                  <CFormLabel>{field.replace(/_/g, " ")}</CFormLabel>
                  <CFormInput
                    type="text"
                    name={field}
                    value={state[field]}
                    readOnly
                  />
                </CCol>
              ))}

              {["start_date", "end_date"].map((field) => (
                <CCol md={6} key={field}>
                  <CFormLabel>{field.replace(/_/g, " ")}</CFormLabel>
                  <CFormInput
                    type="date"
                    name={field}
                    value={state[field]}
                    onChange={handleChange}
                    required
                  />
                  {validationErrors[field] && (
                    <div className="text-danger small">
                      {validationErrors[field]}
                    </div>
                  )}
                </CCol>
              ))}

              {[
                "physical_condition_of_transPipe_condition",
                "physical_condition_of_channel_condition",
                "physical_condition_of_top_bottom_cover_condition",
                "oiling_need_for_bearing_condition",
                "oiling_need_for_coupling_condition",
                "oiling_need_for_motors_condition",
                "mf_clothes_alignment",
                "wheels_alignment",
                "is_wheels_loose",
                "is_nutbolt_loose",
              ].map((field) => (
                <CCol md={6} key={field}>
                  <CFormLabel>{field.replace(/_/g, " ")}</CFormLabel>

                  <CFormSelect
                    name={field}
                    value={state[field]}
                    onChange={handleChange}
                    required={[
                      "physical_condition_of_transPipe_condition",
                      "physical_condition_of_channel_condition",
                      "oiling_need_for_bearing_condition",
                    ].includes(field)}
                  >
                    <option value="">Select</option>
                    {[
                      "mf_clothes_alignment",
                      "wheels_alignment",
                      "physical_condition_of_transPipe_condition",
                      "physical_condition_of_channel_condition",
                      "physical_condition_of_top_bottom_cover_condition",
                    ].includes(field) ? (
                      <>
                        <option value="OK">OK</option>
                        <option value="Not OK">Not OK</option>
                      </>
                    ) : (
                      <>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </>
                    )}
                  </CFormSelect>
                  {validationErrors[field] && (
                    <div className="text-danger small">
                      {validationErrors[field]}
                    </div>
                  )}
                </CCol>
              ))}

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

                  {state.loadingUpload[field] ? (
                    <LoadingSpinner />
                  ) : state[field] ? (
                    <>
                      <Link
                        to={state[field]}
                        target="_blank"
                        className="d-block mb-2"
                      >
                        View Image
                      </Link>
                      <CButton
                        className="btn btn-success btn-sm"
                        onClick={() => openCamera(field)}
                      >
                        Retake Photo
                      </CButton>
                    </>
                  ) : (
                    <CButton
                      className="btn btn-success btn-sm"
                      onClick={() => openCamera(field)}
                    >
                      Take Photo
                    </CButton>
                  )}
                </CCol>
              ))}
            </CRow>

            <div className="d-flex justify-content-end mt-4 gap-2">
              <CButton
                type="submit"
                className=" d-flex justify-content-end align-items-center btn btn-success btn-sm"
                disabled={loading}
              >
                {loading ? (
                  <>
                    Submitting... <LoadingSpinner />
                  </>
                ) : (
                  "Submit"
                )}
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>

      {/* Camera Modal */}
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

        {/* <CModalBody className="text-center position-relative">
          {loadingCamera ? (
            <span>
              Loading Camera ... <LoadingSpinner />{" "}
            </span>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-100"
                style={{ maxHeight: "70vh" }}
              />
              <canvas ref={canvasRef} style={{ display: "none" }} />
             
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
                <div style={{ display: "flex", justifyContent: "start" }}>
                  <strong>Coordinates:</strong>{" "}
                  <span>
                    {location.lat},{location.lng}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "start" }}>
                  <strong>Address:</strong>{" "}
                  <span>{location.name || "Fetching address..."}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "start" }}>
                  <strong>Timestamp:</strong>{" "}
                  <span>
                    {new Date().toLocaleString("en-IN", {
                      hour12: true,
                      timeZone: "Asia/Kolkata",
                    })}
                  </span>
                </div>
              </div>
            </>
          )}
        </CModalBody> */}

        <CModalBody
          className="text-center position-relative"
          style={{ height: "70vh", padding: 0 }} // force modal body height
        >
          {/* Video container */}
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "black", // in case video not loaded
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-100 h-100"
              style={{ objectFit: "contain", transform: "scaleX(-1)" }} // mirror
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
            className="btn btn-success btn-sm"
            onClick={() => setCameraModalVisible(false)}
          >
            Cancel
          </CButton>
          <CButton
            className="btn btn-success btn-sm"
            onClick={captureImage}
            disabled={
              state.loadingUpload[currentImageField] ||
              loadingCamera ||
              !location.lat ||
              !location.lng
            }
          >
            {state.loadingUpload[currentImageField] ? (
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

export default CreateTechnicianPreventivemaintanance;

// const CameraList = () => {
//   const [cameras, setCameras] = useState([]);

//   useEffect(() => {
//     async function getCameras() {
//       try {
//         const devices = await navigator.mediaDevices.enumerateDevices();
//         const videoDevices = devices.filter(
//           (device) => device.kind === "videoinput"
//         );
//         setCameras(videoDevices);
//       } catch (err) {
//         console.error("Error fetching cameras:", err);
//       }
//     }

//     getCameras();
//   }, []);

//   return (
//     <div>
//       <h2>Available Cameras</h2>
//       {cameras.length > 0 ? (
//         <ul>
//           {cameras.map((cam, index) => (
//             <li key={cam.deviceId}>
//               Camera {index + 1}: {cam.label || "Unnamed camera"}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No cameras found</p>
//       )}
//     </div>
//   );
// };
