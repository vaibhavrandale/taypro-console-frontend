import axios from "axios";
import React, { useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilCloudUpload, cilX } from "@coreui/icons";
import "../service-tickets/servicetickts.css";

const reducer = (state, action) => {
  switch (action.type) {
    case "SUBMIT_REQUEST":
      return { ...state, loading: true, success: false };
    case "SUBMIT_SUCCESS":
      return { ...state, loading: false, success: true };
    case "SET_FIELD":
      return {
        ...state,
        serviceItemData: {
          ...state.serviceItemData,
          [action.name]: action.value,
        },
      };
    case "SUBMIT_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };
    default:
      return state;
  }
};

const NewServiceItem = () => {
  const authtoken = useSelector((state) => state.authtoken);
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(reducer, {
    serviceItemData: {
      item_name: "",
      item_code: "",
      item_image: "",
      item_description: "",
    },
    loading: false,
    success: false,
    loadingUpload: false,
  });
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    dispatch({
      type: "SET_FIELD",
      name: e.target.name,
      value: e.target.value,
    });
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
            Authorization: `Bearer ${authtoken}`,
          },
        }
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "SUBMIT_REQUEST" });
    if (state.serviceItemData.item_name === "") {
      toast.error("Item Name is required!");
    }
    const newdata = { ...state.serviceItemData, item_image: image };
    try {
      await axios.post("/api/v1/service-items", newdata, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });
      toast.success("Service Item Added Successfully!");
      dispatch({ type: "SUBMIT_SUCCESS" });

      navigate(`/${adminroute}/inventories`);
    } catch (error) {
      dispatch({
        type: "SUBMIT_FAIL",
        payload: error.response?.data?.error || "Error Adding Service Item",
      });

      toast.error(error.response.data.error || "Error Adding Service Item");
    }
  };

  return (
    <div className="container mt-6">
      <CCard>
        <CCardHeader>
          <h2>Add Service Item</h2>
        </CCardHeader>
        <CCardBody>
          <form>
            <CRow>
              <CCol md="6">
                <div className="mb-3">
                  <label className="form-label">Item Name</label>

                  <input
                    type="text"
                    className="form-control"
                    name="item_name"
                    value={state.serviceItemData.item_name}
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
                    value={state.serviceItemData.item_code}
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
                    value={state.serviceItemData.item_description}
                    onChange={handleChange}
                  />
                </div>
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
                      disabled={uploading}
                    />
                  </div>
                </div>
              </CCol>

              <CCol md="3">
                {uploading ? (
                  <div className=" d-flex justify-content-center">
                    <LoadingSpinner />
                  </div>
                ) : image ? (
                  <div className="position-relative d-inline-block">
                    <img
                      src={image}
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

            <Link onClick={handleSubmit} className="btn btn-warning btn-sm">
              {state.loading ? (
                <>
                  Adding..
                  <LoadingSpinner />
                </>
              ) : (
                "Add"
              )}
            </Link>
          </form>
        </CCardBody>
      </CCard>
    </div>
  );
};
export default NewServiceItem;
