import React, { useEffect, useReducer, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CForm,
  CFormInput,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner,
  CBadge,
} from "@coreui/react";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner";

const initialState = {
  client: {},
  loading: false,
  error: "",
  updateLoading: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, client: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, updateLoading: true };
    case "UPDATE_SUCCESS":
      return { ...state, client: action.payload, updateLoading: false };
    case "UPDATE_FAIL":
      return { ...state, updateLoading: false, error: action.payload };
    default:
      return state;
  }
};

const EditClient = () => {
  const [{ loading, error, client, updateLoading }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const { id } = useParams();
  const navigate = useNavigate();
  const authtoken = useSelector((state) => state.authtoken);
  const [formData, setFormData] = useState({
    client_name: "",
    client_id: "",
    logo: "",
  });
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const response = await axios.get(`/api/v1/clients/${id}`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: response.data });
        console.log(response.data.data);

        setFormData({
          client_name: response.data.data.client_name,
          client_id: response.data.data.client_id,
          logo: response.data.data.logo,
        });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: error.message });
      }
    };
    fetchClient();
  }, [id, authtoken]);

  const handleFileChange = (e) => {
    setLogoFile(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      let updatedData = { ...formData };

      if (logoFile) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", logoFile);
        const uploadRes = await axios.post(
          "/api/v1/image-upload/client-logo",
          formDataUpload,
          {
            headers: {
              Authorization: `Bearer ${authtoken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        updatedData.logo = uploadRes.data.url;
      }

      const response = await axios.put(`/api/v1/clients/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });
      dispatch({ type: "UPDATE_SUCCESS", payload: response.data });
      toast.success("Client updated successfully!");
      navigate("/master-admin/clients-dashboard");
    } catch (error) {
      dispatch({ type: "UPDATE_FAIL", payload: error.message });
      toast.error("Failed to update client.");
    }
  };

  return (
    <CCard>
      <CCardHeader>
        Edit Client - <CBadge color="danger">{formData.client_id}</CBadge>
      </CCardHeader>
      <CCardBody>
        {loading ? (
          <CSpinner />
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <CForm onSubmit={handleUpdate}>
            <CFormInput
              label="Client Id"
              type="text"
              value={formData.client_id}
              className="my-3"
              placeholder="Client ID"
              onChange={(e) =>
                setFormData({ ...formData, client_id: e.target.value })
              }
            />
            <CFormInput
              label="Client Name"
              type="text"
              value={formData.client_name}
              onChange={(e) =>
                setFormData({ ...formData, client_name: e.target.value })
              }
              placeholder="Enter client name"
              required
              className="my-3"
            />
            <CFormInput
              label="Logo"
              type="file"
              onChange={handleFileChange}
              className="my-3"
            />
            {formData.logo && (
              <img
                src={formData.logo}
                alt="Client Logo"
                width="100"
                className="mt-3"
              />
            )}
            <br />
            <div className="d-flex justify-content-end">
              <CButton
                size="sm"
                type="submit"
                color="primary"
                className="mt-3"
                disabled={updateLoading}
              >
                {updateLoading ? (
                  <>
                    Upading....
                    <LoadingSpinner />
                  </>
                ) : (
                  "Update"
                )}
              </CButton>
            </div>
          </CForm>
        )}
      </CCardBody>
    </CCard>
  );
};

export default EditClient;
