import axios from "axios";
import React, { useState, useEffect, useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
} from "@coreui/react";
import LoadingSpinner from "../../../components/LoadingSpinner";

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, gatewayData: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, updating: true };
    case "UPDATE_SUCCESS":
      return { ...state, updating: false };
    case "UPDATE_FAIL":
      return { ...state, updating: false, error: action.payload };
    default:
      return state;
  }
};

const UpdateGateway = () => {
  const [{ loading, error, updating }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
    updating: false,
  });

  const { id } = useParams();
  const authtoken = useSelector((state) => state.authtoken);
  const navigate = useNavigate();
  const [gatewayData, setGatewayData] = useState({
    gateway_id: "",
    gateway_name: "",
    site_id: "",
    gateway_id_in_lns_server: "",
    gateway_name_in_lns_server: "",
    gateway_lattitude: "",
    gateway_longitude: "",
    gateway_simnumber: "",
    gateway_type: "",
    gateway_robot_no: "",
    gateway_lora_deveui: "",
    gateway_lora_no: "",
  });
  const userInfo = useSelector((state) => state.userInfo);
  // console.log(Robotdata[0].last_uplink);
  let adminroute = "";

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    adminroute = "project-admin";
  }
  // Fetch gateway data on component mount
  useEffect(() => {
    const fetchGateway = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/v1/gateways/${id}`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        setGatewayData(data.data);
        dispatch({ type: "FETCH_SUCCESS", payload: data.data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: error.message });
      }
    };
    fetchGateway();
  }, [id, authtoken]);

  // Handle input changes
  const handleInputChange = (e) => {
    setGatewayData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      const { createdAt, _id, updatedAt, last_activity, ...filteredData } =
        gatewayData;

      const result = await axios.put(`/api/v1/gateways/${id}`, filteredData, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });

      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success(result.data.message);
      navigate(`/${adminroute}/all-site-gateways`);
    } catch (error) {
      dispatch({ type: "UPDATE_FAIL", payload: "Update failed" });
      toast.error("Update failed");
    }
  };

  return (
    <div className="mt-5">
      <h2 className="text-center">
        Update Gateway -{" "}
        <span className="text-primary">{gatewayData?.gateway_id || "N/A"}</span>
      </h2>
      {loading ? (
        <LoadingSpinner />
      ) : gatewayData ? (
        <CForm>
          <CRow className="mb-3">
            <CCol md={6}>
              <label>Gateway ID</label>
              <CFormInput
                type="text"
                name="gateway_id"
                value={gatewayData.gateway_id}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={6}>
              <label>Gateway Name</label>
              <CFormInput
                type="text"
                name="gateway_name"
                value={gatewayData.gateway_name}
                onChange={handleInputChange}
              />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol md={6}>
              <label>Site ID</label>
              <CFormInput
                type="text"
                name="site_id"
                value={gatewayData.site_id}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={6}>
              <label>Gateway ID in LNS Server</label>
              <CFormInput
                type="text"
                name="gateway_id_in_lns_server"
                value={gatewayData.gateway_id_in_lns_server}
                onChange={handleInputChange}
              />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol md={6}>
              <label>Gateway Name in LNS Server</label>
              <CFormInput
                type="text"
                name="gateway_name_in_lns_server"
                value={gatewayData.gateway_name_in_lns_server}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={6}>
              <label>Latitude</label>
              <CFormInput
                type="text"
                name="gateway_lattitude"
                value={gatewayData.gateway_lattitude}
                onChange={handleInputChange}
              />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol md={6}>
              <label>Longitude</label>
              <CFormInput
                type="text"
                name="gateway_longitude"
                value={gatewayData.gateway_longitude}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={6}>
              <label>SIM Number</label>
              <CFormInput
                type="text"
                name="gateway_simnumber"
                value={gatewayData.gateway_simnumber}
                onChange={handleInputChange}
              />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol md={6}>
              <label>Gateway Type</label>
              <CFormSelect
                name="gateway_type"
                value={gatewayData.gateway_type}
                onChange={handleInputChange}
              >
                <option value="">Select Type</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Indoor">Indoor</option>
              </CFormSelect>
            </CCol>
            <CCol md={6}>
              <label>Robot Number</label>
              <CFormInput
                type="text"
                name="gateway_robot_no"
                value={gatewayData.gateway_robot_no}
                onChange={handleInputChange}
              />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol md={6}>
              <label>LoRa DEVEUI</label>
              <CFormInput
                type="text"
                name="gateway_lora_deveui"
                value={gatewayData.gateway_lora_deveui}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={6}>
              <label>LoRa Number</label>
              <CFormInput
                type="text"
                name="gateway_lora_no"
                value={gatewayData.gateway_lora_no}
                onChange={handleInputChange}
              />
            </CCol>
          </CRow>
          <div className="text-end mt-4">
            <CButton
              color="success"
              size="sm"
              onClick={handleSubmit}
              disabled={updating}
            >
              {updating ? (
                <>
                  Updating...
                  <LoadingSpinner />
                </>
              ) : (
                "Update"
              )}
            </CButton>
            <CButton
              color="secondary"
              className="ms-2"
              size="sm"
              onClick={() => navigate("/master-admin/all-site-gateways")}
            >
              Cancel
            </CButton>
          </div>
        </CForm>
      ) : (
        <h4 className="text-danger text-center">Gateway not found.</h4>
      )}
    </div>
  );
};

export default UpdateGateway;

//   {/* Robot Data Table */}
//   {/* <h4 className="mt-5">Connected Robots/Lora</h4>
//   {matchingRobots.length > 0 ? (
//     <CTable striped bordered hover responsive className="mt-3">
//       <CTableHead color="secondary">
//         <CTableRow>
//           <CTableHeaderCell>Robot No</CTableHeaderCell>
//           <CTableHeaderCell>Status</CTableHeaderCell>
//           <CTableHeaderCell>Site ID</CTableHeaderCell>
//           <CTableHeaderCell>LoRa No</CTableHeaderCell>
//           <CTableHeaderCell>LoRa DEVEUI</CTableHeaderCell>
//           <CTableHeaderCell>Battery %</CTableHeaderCell>
//           <CTableHeaderCell>Last Seen</CTableHeaderCell>
//         </CTableRow>
//       </CTableHead>
//       <CTableBody>
//         {matchingRobots.map((robot, index) => (
//           <CTableRow key={index}>
//             <CTableDataCell>{robot.robot_no}</CTableDataCell>
//             <CTableDataCell>
//               {robot.lora_state === 1 ? (
//                 <span className="badge bg-success">online</span>
//               ) : (
//                 <span className="badge bg-danger">offline</span>
//               )}
//             </CTableDataCell>
//             <CTableDataCell>{robot.site_id}</CTableDataCell>
//             <CTableDataCell>{robot.lora_no}</CTableDataCell>
//             <CTableDataCell>{robot.deveui}</CTableDataCell>
//             <CTableDataCell>{robot.battery_percentage}%</CTableDataCell>
//             <CTableDataCell>{robot.last_update}</CTableDataCell>
//           </CTableRow>
//         ))}
//       </CTableBody>
//     </CTable>
//   ) : (
//     <p className="text-muted">No connected robots found.</p>
//   )} */}
// </>
