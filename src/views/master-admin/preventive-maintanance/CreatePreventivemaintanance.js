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
//   loadingRobots: true,
//   robots: [],
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
//     case "FETCH_ROBOTS_REQUEST":
//       return { ...state, loadingRobots: true, error: "" };
//     case "FETCH_ROBOTS_SUCCESS":
//       return {
//         ...state,
//         loadingRobots: false,
//         robots: action.payload.data,
//       };
//     case "FETCH_ROBOTS_FAIL":
//       return { ...state, loadingRobots: false, error: action.payload };

//     case "RESET":
//       return initialState;
//     default:
//       return state;
//   }
// };

// const CreatePreventiveMaintenance = () => {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   const authtoken = useSelector((state) => state.authtoken);
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredRobots, setFilteredRobots] = useState([]);

//   useEffect(() => {
//     const fetchRobots = async () => {
//       dispatch({ type: "FETCH_ROBOTS_REQUEST" });
//       try {
//         const result = await axios.get(
//           "/api/v1/robots/get-robots/robots-without-pg",
//           {
//             headers: { Authorization: `Bearer ${authtoken}` },
//           }
//         );
//         dispatch({
//           type: "FETCH_ROBOTS_SUCCESS",
//           payload: {
//             data: result.data.data,
//           },
//         });
//       } catch (error) {
//         dispatch({
//           type: "FETCH_ROBOTS_FAIL",
//           payload: error.response?.data?.message || error.response?.data?.error,
//         });
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
//       const filtered = state.robots.filter((robot) => {
//         const robotNo = robot.robot_no?.toLowerCase() || "";
//         const siteId = robot.site_id?.toLowerCase() || "";
//         const searchValue = value.toLowerCase();

//         return robotNo.includes(searchValue) || siteId.includes(searchValue);
//       });

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

//   const handleImageUpload = async (e, fieldName) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const bodyFormData = new FormData();
//     bodyFormData.append("file", file);

//     dispatch({ type: "UPLOAD_REQUEST", field: fieldName }); // Set loading for this specific field

//     try {
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

//       dispatch({ type: "UPLOAD_SUCCESS", field: fieldName }); // Stop loading for this field
//       toast.success("Image uploaded successfully.");
//     } catch (err) {
//       dispatch({
//         type: "UPLOAD_FAIL",
//         field: fieldName,
//         payload: "Upload failed",
//       });
//       toast.error("Image upload failed.");
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
//       navigate("/master-admin/preventive-maintanance-dashboard");
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
//               handleSearchChange
//               <CFormLabel>
//                 Search Robot {state.loadingRobots && <LoadingSpinner />}{" "}
//               </CFormLabel>
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

// export default CreatePreventiveMaintenance;

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
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
// } from "@coreui/react";
// import { useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import LoadingSpinner from "../../../components/LoadingSpinner";

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
//   physical_condition_of_top_bottom_cover_condition: "",
//   physical_condition_of_top_bottom_cover_image: "",
//   oiling_need_for_bearing_condition: "",
//   oiling_need_for_bearing_condition_image: "",
//   oiling_need_for_coupling_condition: "",
//   oiling_need_for_coupling_image: "",
//   oiling_need_for_motors_condition: "",
//   oiling_need_for_motors_image: "",
//   mf_clothes_alignment: "",
//   wheels_alignment: "",
//   is_wheels_loose: "",
//   is_nutbolt_loose: "",
//   start_date: "",
//   end_date: "",
//   loadingUpload: false,
//   loadingRobots: true,
//   robots: [],
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
//     case "FETCH_ROBOTS_REQUEST":
//       return { ...state, loadingRobots: true, error: "" };
//     case "FETCH_ROBOTS_SUCCESS":
//       return {
//         ...state,
//         loadingRobots: false,
//         robots: action.payload.data,
//       };
//     case "FETCH_ROBOTS_FAIL":
//       return { ...state, loadingRobots: false, error: action.payload };

//     case "RESET":
//       return initialState;
//     default:
//       return state;
//   }
// };

// const CreatePreventiveMaintenance = () => {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   const authtoken = useSelector((state) => state.authtoken);
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredRobots, setFilteredRobots] = useState([]);
//   const [validationErrors, setValidationErrors] = useState({});

//   // Camera states
//   const [cameraModalVisible, setCameraModalVisible] = useState(false);
//   const [currentImageField, setCurrentImageField] = useState("");
//   const [cameraAppUrl] = useState(
//     "https://play.google.com/store/apps/details?id=com.gpsmapcamera.geotagginglocationonphoto"
//   ); // Replace with your actual camera app URL

//   useEffect(() => {
//     const fetchRobots = async () => {
//       dispatch({ type: "FETCH_ROBOTS_REQUEST" });
//       try {
//         const result = await axios.get(
//           "/api/v1/robots/get-robots/robots-without-pg",
//           {
//             headers: { Authorization: `Bearer ${authtoken}` },
//           }
//         );
//         dispatch({
//           type: "FETCH_ROBOTS_SUCCESS",
//           payload: {
//             data: result.data.data,
//           },
//         });
//       } catch (error) {
//         dispatch({
//           type: "FETCH_ROBOTS_FAIL",
//           payload: error.response?.data?.message || error.response?.data?.error,
//         });
//         toast.error(
//           error.response?.data?.message || error.response?.data?.error
//         );
//       }
//     };
//     fetchRobots();
//   }, [authtoken]);

//   // Listen for messages from the camera app
//   useEffect(() => {
//     const handleMessage = (event) => {
//       // Security check - validate the origin if possible
//       // if (event.origin !== "https://your-camera-app-domain.com") return;

//       if (event.data.type === "CAMERA_APP_IMAGE_CAPTURED") {
//         const imageData = event.data.imageData;
//         handleImageFromCameraApp(imageData);
//       }
//     };

//     window.addEventListener("message", handleMessage);
//     return () => window.removeEventListener("message", handleMessage);
//   }, []);

//   const handleImageFromCameraApp = async (imageData) => {
//     if (!currentImageField) return;

//     try {
//       // Convert base64 to blob
//       const response = await fetch(imageData);
//       const blob = await response.blob();

//       await uploadImage(blob, currentImageField);
//       setCameraModalVisible(false);
//     } catch (error) {
//       toast.error("Failed to process image from camera app");
//       console.error("Camera app error:", error);
//     }
//   };

//   const uploadImage = async (blob, fieldName) => {
//     const bodyFormData = new FormData();
//     bodyFormData.append("file", blob, `camera-capture-${Date.now()}.jpg`);

//     dispatch({ type: "UPLOAD_REQUEST", field: fieldName });

//     try {
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
//       toast.error("Image upload failed.");
//     }
//   };

//   const openCameraApp = (fieldName) => {
//     setCurrentImageField(fieldName);

//     // Option 1: Open camera app in a new window
//     // window.open(
//     //   cameraAppUrl,
//     //   "CameraApp",
//     //   "width=600,height=800,left=200,top=200"
//     // );

//     // Option 2: Show a modal with iframe (uncomment below if you prefer this approach)
//     setCameraModalVisible(true);
//   };

//   const handleFileUpload = (event, fieldName) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     if (!file.type.match("image.*")) {
//       toast.error("Please select an image file");
//       return;
//     }

//     uploadImage(file, fieldName);
//     event.target.value = ""; // Reset the input
//   };

//   const validateForm = () => {
//     const errors = {};
//     const requiredFields = [
//       "physical_condition_of_transPipe_condition",
//       "physical_condition_of_channel_condition",
//       "oiling_need_for_bearing_condition",
//       "client_id",
//       "site_name",
//       "site_location",
//       "start_date",
//       "end_date",
//     ];

//     requiredFields.forEach((field) => {
//       if (!state[field] || state[field].trim() === "") {
//         errors[field] = `${field.replace(/_/g, " ")} is required`;
//       }
//     });

//     setValidationErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchTerm(value);

//     if (value.length > 0) {
//       const filtered = state.robots.filter((robot) => {
//         const robotNo = robot.robot_no?.toLowerCase() || "";
//         const siteId = robot.site_id?.toLowerCase() || "";
//         const searchValue = value.toLowerCase();

//         return robotNo.includes(searchValue) || siteId.includes(searchValue);
//       });

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

//   const handleChange = (e) => {
//     dispatch({
//       type: "UPDATE_FIELD",
//       field: e.target.name,
//       value: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate form before submitting
//     if (!validateForm()) {
//       toast.error("Please fill all required fields");
//       return;
//     }

//     setLoading(true);
//     try {
//       dispatch({ type: "ADD_PM_REQUEST" });

//       const data = await axios.post("/api/v1/preventivemaintenances", state, {
//         headers: { Authorization: `Bearer ${authtoken}` },
//       });
//       dispatch({ type: "ADD_PM_SUCCESS", payload: data.data });
//       toast.success("Preventive Maintenance Created Successfully!");
//       navigate("/master-admin/preventive-maintanance-dashboard");
//     } catch (error) {
//       toast.error(error.response?.data?.error || "Something went wrong");
//       dispatch({ type: "ADD_PM_FAIL", payload: error.message });
//       toast.error(error.response?.data?.error || "Something went wrong");
//     }
//   };

//   return (
//     <>
//       <CCard className="max-w-3xl mx-auto p-4 shadow-lg rounded-lg">
//         <CCardHeader>
//           <h2>Create Preventive Maintenance</h2>
//         </CCardHeader>
//         <CCardBody>
//           <CForm onSubmit={handleSubmit}>
//             <CRow className="gy-3">
//               <CCol md={12}>
//                 <CFormLabel>
//                   Search Robot {state.loadingRobots && <LoadingSpinner />}{" "}
//                 </CFormLabel>
//                 <CFormInput
//                   type="text"
//                   placeholder="Search Robot No or Site ID..."
//                   value={searchTerm}
//                   onChange={handleSearchChange}
//                 />
//                 <CListGroup className="mb-3">
//                   {searchTerm && filteredRobots.length === 0 ? (
//                     <CListGroupItem>No robots found</CListGroupItem>
//                   ) : (
//                     filteredRobots.map((robot, index) => (
//                       <CListGroupItem
//                         key={index}
//                         action
//                         onClick={() => selectRobotFromSearch(robot)}
//                       >
//                         {robot.robot_no} - {robot.site_id}
//                       </CListGroupItem>
//                     ))
//                   )}
//                 </CListGroup>
//               </CCol>

//               {["robot_no", "robot_type", "site_id"].map((field) => (
//                 <CCol md={6} key={field}>
//                   <CFormLabel>{field.replace(/_/g, " ")}</CFormLabel>
//                   <CFormInput
//                     type="text"
//                     name={field}
//                     value={state[field]}
//                     readOnly
//                   />
//                 </CCol>
//               ))}

//               {["start_date", "end_date"].map((field) => (
//                 <CCol md={6} key={field}>
//                   <CFormLabel>{field.replace(/_/g, " ")}</CFormLabel>
//                   <CFormInput
//                     type="date"
//                     name={field}
//                     value={state[field]}
//                     onChange={handleChange}
//                     required
//                   />
//                   {validationErrors[field] && (
//                     <div className="text-danger small">
//                       {validationErrors[field]}
//                     </div>
//                   )}
//                 </CCol>
//               ))}

//               {[
//                 "physical_condition_of_transPipe_condition",
//                 "physical_condition_of_channel_condition",
//                 "physical_condition_of_top_bottom_cover_condition",
//                 "oiling_need_for_bearing_condition",
//                 "oiling_need_for_coupling_condition",
//                 "oiling_need_for_motors_condition",
//                 "mf_clothes_alignment",
//                 "wheels_alignment",
//                 "is_wheels_loose",
//                 "is_nutbolt_loose",
//               ].map((field) => (
//                 <CCol md={6} key={field}>
//                   <CFormLabel>{field.replace(/_/g, " ")}</CFormLabel>

//                   <CFormSelect
//                     name={field}
//                     value={state[field]}
//                     onChange={handleChange}
//                     required={[
//                       "physical_condition_of_transPipe_condition",
//                       "physical_condition_of_channel_condition",
//                       "oiling_need_for_bearing_condition",
//                     ].includes(field)}
//                   >
//                     <option value="">Select</option>
//                     {[
//                       "mf_clothes_alignment",
//                       "wheels_alignment",
//                       "physical_condition_of_transPipe_condition",
//                       "physical_condition_of_channel_condition",
//                       "physical_condition_of_top_bottom_cover_condition",
//                     ].includes(field) ? (
//                       <>
//                         <option value="OK">OK</option>
//                         <option value="Not OK">Not OK</option>
//                       </>
//                     ) : (
//                       <>
//                         <option value="Yes">Yes</option>
//                         <option value="No">No</option>
//                       </>
//                     )}
//                   </CFormSelect>
//                   {validationErrors[field] && (
//                     <div className="text-danger small">
//                       {validationErrors[field]}
//                     </div>
//                   )}
//                 </CCol>
//               ))}

// {[
//   "physical_condition_of_transPipe_image",
//   "physical_condition_of_channel_image",
//   "physical_condition_of_top_bottom_cover_image",
//   "oiling_need_for_bearing_condition_image",
//   "oiling_need_for_coupling_image",
//   "oiling_need_for_motors_image",
// ].map((field) => (
//   <CCol md={6} key={field}>
//     <CFormLabel>{field.replace(/_/g, " ")}</CFormLabel>

//     {state.loadingUpload[field] ? (
//       <LoadingSpinner />
//     ) : state[field] ? (
//                     <>
//                       <Link
//                         to={state[field]}
//                         target="_blank"
//                         className="d-block mb-2"
//                       >
//                         View Image
//                       </Link>
//                       <div className="d-flex gap-2">
//                         <CButton
//                           color="secondary"
//                           size="sm"
//                           onClick={() => openCameraApp(field)}
//                         >
//                           Retake with Camera App
//                         </CButton>
//                         <CButton
//                           color="secondary"
//                           size="sm"
//                           onClick={() =>
//                             document.getElementById(`${field}-file`).click()
//                           }
//                         >
//                           Upload Different
//                         </CButton>
//                       </div>
//                     </>
//                   ) : (
//                     <div className="d-flex gap-2">
//                       <CButton
//                         color="primary"
//                         onClick={() => openCameraApp(field)}
//                       >
//                         Use Camera App
//                       </CButton>

//                       <input
//                         type="file"
//                         id={`${field}-file`}
//                         accept="image/*"
//                         style={{ display: "none" }}
//                         onChange={(e) => handleFileUpload(e, field)}
//                       />
//                     </div>
//                   )}
//                 </CCol>
//               ))}
//             </CRow>

//             <CButton
//               color="primary"
//               type="submit"
//               className="mt-4"
//               disabled={loading}
//             >
//               {loading ? "Submitting..." : "Submit"}
//             </CButton>
//           </CForm>
//         </CCardBody>
//       </CCard>

//       {/* Camera App Modal (iframe approach) - Optional */}
//       <CModal
//         visible={cameraModalVisible}
//         onClose={() => setCameraModalVisible(false)}
//         size="lg"
//       >
//         <CModalHeader>
//           <CModalTitle>Camera App</CModalTitle>
//         </CModalHeader>
//         <CModalBody className="p-0" style={{ height: "70vh" }}>
//           <iframe
//             src={cameraAppUrl}
//             style={{ width: "100%", height: "100%", border: "none" }}
//             title="Camera App"
//           />
//         </CModalBody>
//         <CModalFooter>
//           <CButton
//             color="secondary"
//             onClick={() => setCameraModalVisible(false)}
//           >
//             Cancel
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </>
//   );
// };

// export default CreatePreventiveMaintenance;

//Noraml Camera Integration Code

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

const CreatePreventiveMaintenance = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const authtoken = useSelector((state) => state.authtoken);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRobots, setFilteredRobots] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});

  // Camera states
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [currentImageField, setCurrentImageField] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [location, setLocation] = useState({ lat: null, lng: null });

  // === Add watermark (lat, lng, address, timestamp) ===
  const timestamp = new Date().toLocaleString();
  const text = `Lat: ${location.lat}, Lng: ${location.lng} | ${timestamp}`;
  const address = location.name ? location.name : "";

  useEffect(() => {
    const fetchRobots = async () => {
      dispatch({ type: "FETCH_ROBOTS_REQUEST" });
      try {
        const result = await axios.get(
          "/api/v1/robots/get-robots/robots-without-pg",
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );
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
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
            );
            const data = await response.json();

            setLocation({
              lat,
              lng,
              name: data.display_name || "Unknown location",
            });
          } catch (err) {
            console.error("Error fetching address:", err);
            setLocation({ lat, lng, name: "Location not available" });
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
  }, [cameraModalVisible]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
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

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();

          setLocation({
            lat: latitude.toFixed(5),
            lng: longitude.toFixed(5),
            name: data.display_name, // full address string
          });
        } catch (err) {
          console.error("Error reverse geocoding:", err);
          setLocation({
            lat: latitude,
            lng: longitude,
            name: "Unknown location",
          });
        }
      },
      (error) => {
        console.error("Error fetching location:", error);
        setLocation({ lat: null, lng: null, name: "Location not available" });
      }
    );
  };
  useEffect(() => {
    if (cameraModalVisible) getLocation();
  }, [cameraModalVisible]);
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

      // === Add watermark (lat, lng, timestamp, address) ===
      const timestamp = new Date().toLocaleString();
      const coords = `Lat: ${location.lat}, Lng: ${location.lng} | ${timestamp}`;
      const address = location.name || "Fetching address...";

      // Semi-transparent background
      context.fillStyle = "rgba(0, 0, 0, 0.5)";
      context.fillRect(0, canvas.height - 70, canvas.width, 70);

      // White text
      context.fillStyle = "white";
      context.font = "16px Arial";
      context.textAlign = "left";
      context.fillText(coords, 10, canvas.height - 45);
      context.fillText(address, 10, canvas.height - 20);

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
      "client_id",
      "site_name",
      "site_location",
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

    // Validate form before submitting
    // if (!validateForm()) {
    //   toast.error("Please fill all required fields");
    //   return;
    // }

    setLoading(true);
    try {
      dispatch({ type: "ADD_PM_REQUEST" });

      const data = await axios.post("/api/v1/preventivemaintenances", state, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });
      dispatch({ type: "ADD_PM_SUCCESS", payload: data.data });
      toast.success(data.data.message);
      navigate("/master-admin/preventive-maintanance-dashboard");
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
        <CameraList />
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
                  {/* Field Label */}
                  <CFormLabel className="fw-bold d-block mb-3">
                    {field.replace(/_/g, " ")}
                  </CFormLabel>

                  {/* Content */}
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

            <CButton
              type="submit"
              className="btn btn-success btn-sm"
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

        <CModalBody className="text-center position-relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-100"
            style={{ maxHeight: "70vh" }}
          />
          <canvas ref={canvasRef} style={{ display: "none" }} />

          {/* Overlay Location & Address */}
          <div
            style={{
              display: "flex",
              alignItems: "left",
              position: "absolute",
              bottom: "10px",
              left: "10px",
              color: "white",
              backgroundColor: "rgba(0,0,0,0.5)",
              padding: "5px 10px",
              borderRadius: "5px",
              fontSize: "14px",
              maxWidth: "90%",
              wordWrap: "break-word",
            }}
          >
            <div>
              <strong>Lat:</strong> {location.lat} <strong>Lng:</strong>{" "}
              {location.lng}
              {new Date().toLocaleString("en-IN", {
                hour12: true,
                timeZone: "Asia/Kolkata",
              })}
            </div>
            <div>
              <strong>Address:</strong> {location.name || "Fetching address..."}
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
            disabled={state.loadingUpload[currentImageField]}
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

export default CreatePreventiveMaintenance;

const CameraList = () => {
  const [cameras, setCameras] = useState([]);

  useEffect(() => {
    async function getCameras() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setCameras(videoDevices);
      } catch (err) {
        console.error("Error fetching cameras:", err);
      }
    }

    getCameras();
  }, []);

  return (
    <div>
      <h2>Available Cameras</h2>
      {cameras.length > 0 ? (
        <ul>
          {cameras.map((cam, index) => (
            <li key={cam.deviceId}>
              Camera {index + 1}: {cam.label || "Unnamed camera"}
            </li>
          ))}
        </ul>
      ) : (
        <p>No cameras found</p>
      )}
    </div>
  );
};
