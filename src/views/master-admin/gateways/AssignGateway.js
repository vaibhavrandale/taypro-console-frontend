import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { CButton, CCol, CForm, CFormInput, CRow } from "@coreui/react";
import LoadingSpinner from "../../../components/LoadingSpinner";

// Reducer
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
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

const AssignGateway = () => {
  const [{ loading, updating }, dispatch] = useReducer(reducer, {
    loading: false,
    updating: false,
    error: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);

  const [formData, setFormData] = useState({
    gateway_id: "",
    robot_no: "",
  });

  let adminroute = "";
  if (userInfo.role === "Master Admin") adminroute = "master-admin";
  else if (userInfo.role === "Service Admin") adminroute = "service-admin";
  else if (userInfo.role === "Project Admin") adminroute = "project-admin";

  useEffect(() => {
    const fetchGateway = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/v1/gateways/${id}`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        console.log(data);
        dispatch({ type: "FETCH_SUCCESS", payload: data.data });

        setFormData({
          gateway_id: data.data.gateway_id || "",
          robot_no: data.data.gateway_robot_no || "",
        });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: "Failed to fetch gateway" });
      }
    };

    fetchGateway();
  }, [id, authtoken]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });

      console.log(formData);

      const { data } = await axios.post(
        `/api/v1/gateways/assign-to-gateway`,
        formData,
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
      );
      console.log(data);
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success(data.message);
      navigate(`/${adminroute}/all-site-gateways`);
    } catch (error) {
      console.log(error);

      dispatch({
        type: "UPDATE_FAIL",
        payload: error.response.data.error || error.response.data.message,
      });
      toast.error(error.response.data.error || error.response.data.message);
    }
  };

  return (
    <div className="mt-5">
      <h2 className="text-center">Assign Robot to Gateway</h2>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <CForm onSubmit={handleSubmit}>
          <CRow className="mb-3">
            <CCol md={6}>
              <label>Gateway ID</label>
              <CFormInput
                type="text"
                name="gateway_id"
                value={formData.gateway_id}
                onChange={handleChange}
                disabled
              />
            </CCol>
            <CCol md={6}>
              <label>Enter Robot Number from Robots data</label>
              <CFormInput
                type="text"
                name="robot_no"
                value={formData.robot_no}
                onChange={handleChange}
                required
              />
            </CCol>
          </CRow>
          <div className="text-end mt-4">
            <CButton
              type="submit"
              color="success"
              size="sm"
              disabled={updating}
            >
              {updating ? "Assigning..." : "Assign Robot"}
            </CButton>
            <CButton
              color="secondary"
              className="ms-2"
              size="sm"
              onClick={() => navigate(`/${adminroute}/all-site-gateways`)}
            >
              Cancel
            </CButton>
          </div>
        </CForm>
      )}
    </div>
  );
};

export default AssignGateway;
