import axios from "axios";
import React, { useState, useEffect, useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  CAlert,
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CRow,
} from "@coreui/react";

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, inventory: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, updating: true };
    case "UPDATE_SUCCESS":
      return { ...state, updating: false };
    case "UPDATE_FAIL":
      return { ...state, updating: false, error: action.payload };
    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };
    case "UPLOAD_SUCCESS":
      return {
        ...state,
        loadingUpload: false,
        errorUpload: "",
      };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
};

const UpdateServiceItem = () => {
  const [{ loading, error, updating, loadingUpload, errorUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
      updating: false,
      loadingUpload: false,
      errorUpload: "",
    });

  const { id } = useParams();
  const authtoken = useSelector((state) => state.authtoken);
  const navigate = useNavigate();
  const [image, setImage] = useState("");

  const [serviceItemData, setServiceItemData] = useState({
    item_name: "",
    item_code: "",
    item_description: "",
    item_image: "",
  });

  useEffect(() => {
    const fetchServiceItem = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/v1/service-items/${id}`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data.data });
        setServiceItemData(data.data);
        setImage(data.data.item_image);
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data || "Failed to fetch data",
        });
        toast.error(error.response?.data || "Failed to fetch data");
      }
    };

    fetchServiceItem();
  }, [id, authtoken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServiceItemData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post(
        "/api/v1/image-upload/service-item",
        bodyFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authtoken}`,
          },
        }
      );
      dispatch({ type: "UPLOAD_SUCCESS" });
      console.log(data);

      setImage(data.url);

      toast.success("Image uploaded successfully. click Update to apply it");
    } catch (err) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Fix: Prevent default form submission

    try {
      dispatch({ type: "UPDATE_REQUEST" });
      const { createdAt, _id, last_activity, ...filteredFormData } =
        serviceItemData;

      await axios.put(`/api/v1/service-items/${id}`, filteredFormData, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });

      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Service Item Updated Successfully!");

      navigate(`/master-admin/inventories`);
    } catch (error) {
      dispatch({ type: "UPDATE_FAIL", payload: "Update failed" });
      toast.error("Update failed");
    }
  };

  return (
    <div className="container mt-4">
      <CCard>
        <CCardHeader>
          Update Service Item -{" "}
          <b className="badge bg-success">{serviceItemData.item_name}</b>
        </CCardHeader>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <CAlert color="danger">{error}</CAlert>
        ) : (
          <CCardBody>
            <form onSubmit={handleSubmit}>
              <CRow>
                <CCol md="6">
                  <div className="mb-">
                    <label className="form-label">Item Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="item_name"
                      value={serviceItemData.item_name || ""}
                      onChange={handleChange}
                    />
                  </div>
                </CCol>
                <CCol md="6">
                  <div className="mb-3">
                    <label className="form-label">Item Code</label>
                    <input
                      type="text"
                      className="form-control"
                      name="item_code"
                      value={serviceItemData.item_code || ""}
                      onChange={handleChange}
                    />
                  </div>
                </CCol>
              </CRow>
              <CRow>
                <CCol md="6">
                  <div className="mb-3">
                    <label className="form-label">Item Description</label>
                    <input
                      type="text"
                      className="form-control"
                      name="item_description"
                      value={serviceItemData.item_description || ""}
                      onChange={handleChange}
                    />
                  </div>
                </CCol>
                <CCol md="6">
                  <div className="mb-3">
                    <label className="form-label">Item Image</label>

                    <CFormInput
                      type="file"
                      name="item_image"
                      onChange={handleImageUpload}
                      className="mb-3 file"
                    />
                  </div>
                </CCol>
              </CRow>

              {loadingUpload ? (
                <div className="mt-2 d-flex justify-content-center">
                  <LoadingSpinner />
                </div>
              ) : image || serviceItemData.item_image ? (
                <div className="my-2">
                  <img
                    src={image || serviceItemData.item_image} // ✅ Use either the uploaded or existing image
                    alt="Uploaded logo"
                    width="100"
                    height="100"
                    style={{ objectFit: "cover", borderRadius: "5px" }}
                  />
                  <CBadge
                    color="primary"
                    position="absolute"
                    top="0"
                    left="0"
                    shape="rounded-pill"
                    className="p-1"
                  ></CBadge>
                </div>
              ) : null}
              <button
                type="submit"
                className="btn btn-warning btn-sm"
                disabled={updating}
              >
                {updating ? "Updating..." : "Update"}
              </button>
            </form>
          </CCardBody>
        )}
      </CCard>
    </div>
  );
};

export default UpdateServiceItem;
