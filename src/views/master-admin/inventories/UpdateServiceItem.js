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
  CFormCheck,
  CFormLabel,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilCloudUpload, cilX } from "@coreui/icons";
import "../service-tickets/servicetickts.css";

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

    default:
      return state;
  }
};

const UpdateServiceItem = () => {
  const [{ loading, error, updating }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    updating: false,
    loadingUpload: false,
  });

  const { id } = useParams();
  // const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  let adminroute = "";

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    adminroute = "project-admin";
  } else if (userInfo?.role === "Master User") {
    adminroute = "master-user";
  } else if (userInfo?.role === "Service User") {
    adminroute = "service-user";
  } else if (userInfo?.role === "Project User") {
    adminroute = "project-user";
  }

  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

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
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
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
  }, [id]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

    setServiceItemData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const bodyFormData = new FormData();
    bodyFormData.append("file", file);

    try {
      setUploading(true);
      const { data } = await axios.post(
        "/api/v1/image-upload/service-item",
        bodyFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            // Authorization: `Bearer ${authtoken}`,
          },
          withCredentials: true,
        },
      );

      setImage(data.url);
      toast.success("Image uploaded successfully. Click Update to apply it.");
    } catch (err) {
      toast.error("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const deleteImageHandler = () => {
    setImage("");
    toast.success("Image removed.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Fix: Prevent default form submission

    try {
      dispatch({ type: "UPDATE_REQUEST" });
      const {
        createdAt,
        _id,
        item_id,
        updatedAt,
        last_activity,

        ...filteredFormData
      } = serviceItemData;

      const newData = { ...filteredFormData, item_image: image };
      await axios.put(`/api/v1/service-items/${id}`, newData, {
        // headers: { Authorization: `Bearer ${authtoken}` },
        withCredentials: true,
      });

      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Service Item Updated Successfully!");

      navigate(`/${adminroute}/inventories`);
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
                  <CFormLabel>
                    Delete Inventory :
                    <span className="text-muted ms-2">
                      {" "}
                      (When checked, it will be soft deleted)
                    </span>
                  </CFormLabel>{" "}
                  <br />
                  <CFormCheck
                    id="is_delete"
                    name="is_delete"
                    checked={serviceItemData.is_delete || false}
                    onChange={handleChange}
                  />{" "}
                </CCol>

                <CCol md="3">
                  <div className="mb-3">
                    <label className="form-label">Upload Image</label>
                    <div className="container-btn-file p-2 m-2 w-80">
                      <CIcon icon={cilCloudUpload} className="upload-icon" />
                      <input
                        type="file"
                        name="item_image"
                        onChange={handleImageUpload}
                        className="mb-3 file"
                        // disabled={uploading}
                      />
                    </div>
                  </div>
                </CCol>

                <CCol md="3" className="d-flex align-items-center">
                  {uploading ? (
                    <div className="d-flex justify-content-center w-100">
                      <LoadingSpinner />
                    </div>
                  ) : image || serviceItemData.item_image ? (
                    <div className="d-flex align-items-center">
                      <img
                        src={image || serviceItemData.item_image}
                        alt="Uploaded Item"
                        width="100"
                        height="100"
                        style={{ objectFit: "cover", borderRadius: "5px" }}
                      />
                      <CBadge
                        color="primary"
                        className="p-1 position-absolute"
                        style={{
                          top: "-8px",
                          right: "-8px",
                          cursor: "pointer",
                          borderRadius: "50%",
                          backgroundColor: "red",
                        }}
                        onClick={deleteImageHandler}
                      >
                        <CIcon icon={cilX} size="sm" />
                      </CBadge>
                    </div>
                  ) : null}
                </CCol>
              </CRow>

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
