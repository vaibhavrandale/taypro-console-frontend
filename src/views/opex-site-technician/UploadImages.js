import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  CBadge,
  CButton,
  CFormInput,
  CFormLabel,
  CImage,
  CModal,
  CModalBody,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_ATTACHMENTS_REQUEST":
      return { ...state, loadingAttachments: true, error: "" };
    case "FETCH_ATTACHMENTS_SUCCESS":
      return {
        ...state,
        loadingAttachments: false,
        attachmentsData: action.payload,
        error: "",
      };
    case "FETCH_ATTACHMENTS_FAIL":
      return { ...state, loadingAttachments: false, error: action.payload };
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
    case "ADD_ATTACHMENT_REQUEST":
      return { ...state, attachmentAddLoading: true, error: "" };

    case "ADD_ATTACHMENT_SUCCESS":
      return {
        ...state,
        attachmentAddLoading: false,
        attachments: [...state.attachments, action.payload],
      };

    case "ADD_ATTACHMENT_FAIL":
      return { ...state, attachmentAddLoading: false, error: action.payload };
    default:
      return state;
  }
};

const UploadImages = () => {
  const [
    {
      errorUpload,
      loadingUpload,
      attachmentAddLoading,
      error,
      attachments,
      loadingAttachments,
      attachmentsData,
    },
    dispatch,
  ] = useReducer(reducer, {
    errorUpload: "",
    loadingUpload: false,
    error: "",
    attachments: "",
    attachmentsData: [],
    loadingAttachments: false,
  });
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.userInfo);
  const authtoken = useSelector((state) => state.authtoken);
  const { moduleId, cycleId, dayId, site_id } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [image, setImage] = useState("");

  let adminroute = "";
  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    adminroute = "project-admin";
  } else if (userInfo.role === "Master User") {
    adminroute = "master-user";
  } else if (userInfo.role === "Project User") {
    adminroute = "project-user";
  } else if (userInfo.role === "Service User") {
    adminroute = "service-user";
  } else if (userInfo.role === "Opex Client Admin") {
    adminroute = "opex-client-admin";
  } else if (userInfo.role === "Opex Site Technician") {
    adminroute = "opex-site-technician";
  }

  useEffect(() => {
    const fetchAttachments = async () => {
      dispatch({ type: "FETCH_ATTACHMENTS_REQUEST" });
      try {
        const response = await axios.get(
          `/api/v1/opex/fetch-attachments/${moduleId}/${cycleId}/${dayId}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );
        console.log(response.data.data);
        dispatch({
          type: "FETCH_ATTACHMENTS_SUCCESS",
          payload: response.data.data,
        });
      } catch (error) {
        console.error(error);
        dispatch({
          type: "FETCH_ATTACHMENTS_FAIL",
          payload: error.response?.data?.error || "Failed to fetch attachments",
        });
      }
    };

    fetchAttachments();
  }, [moduleId, cycleId, dayId, authtoken]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post(
        "/api/v1/image-upload/daywise-cleaning",
        bodyFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authtoken}`,
          },
        }
      );
      dispatch({ type: "UPLOAD_SUCCESS" });
      setImage(data.url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = async () => {
    try {
      dispatch({ type: "ADD_ATTACHMENT_REQUEST" });
      const response = await axios.post(
        `/api/v1/opex/attachments/${moduleId}/${cycleId}/${dayId}`,
        { url: image },
        {
          headers: { authorization: `Bearer ${authtoken}` },
        }
      );
      if (response.status === 201 || response.status === 200) {
        dispatch({
          type: "ADD_ATTACHMENT_SUCCESS",
          payload: response.data.data.user,
        });
        setImage("");
      }
      navigate(
        `/${adminroute}/my-opex-data/${site_id}/${moduleId}/cycle/${cycleId}`
      );
      toast.success(response.data.message);
    } catch (error) {
      console.error(error);
      dispatch({
        type: "ADD_ATTACHMENT_FAIL",
        payload: error.response.data.error,
      });
      toast.error(error.response.data.error);
    }
  };

  return (
    <div className="container p-3">
      <h5 className="text-center mb-4">Cleaning Images</h5>

      {/* Image Uplaod */}
      <div className="row g-3 mb-4">
        <div className="col-auto">
          <CFormLabel htmlFor="imageUpload" className="fw-semibold">
            {loadingUpload ? (
              <div className="mt-3 d-flex justify-content-center">
                <LoadingSpinner />
              </div>
            ) : (
              "Upload Image"
            )}
          </CFormLabel>
          <CFormInput
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleFileChange}
            style={{ width: 250 }}
          />
        </div>

        {/* image when selected */}
        {image && (
          <div className="col-auto">
            <div className="position-relative border rounded shadow-sm p-2">
              <img
                src={image}
                alt="Preview"
                width="100%"
                height="160"
                className="rounded"
                style={{ objectFit: "cover" }}
              />
              <button
                className="position-absolute top-0 end-0 border-0 rounded-circle"
                onClick={() => setImage("")}
                aria-label="Remove image"
              >
                <CIcon icon={cilX} className="text-white" />
              </button>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <div className="col-auto d-flex align-items-end">
          <CButton
            type="submit"
            size="sm"
            color="success"
            className="text-white"
            onClick={handleAdd}
            disabled={!image || attachmentAddLoading}
          >
            {attachmentAddLoading ? (
              <>
                Uploading... <LoadingSpinner size="sm" />
              </>
            ) : (
              "Upload Attachment"
            )}
          </CButton>
        </div>
      </div>

      {/* Uploaded images */}
      <div className="row g-3">
        {loadingAttachments ? (
          <div className="my-3 d-flex justify-content-center">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center">
            <CBadge color="danger" className="p-2">
              {error}
            </CBadge>
          </div>
        ) : (
          attachmentsData &&
          attachmentsData.map((img, index) => (
            <div key={img._id} className="col-auto">
              <div
                className="position-relative border rounded shadow-sm p-2 bg-white"
                style={{ width: 180 }}
              >
                <img
                  src={img.url}
                  alt={`uploaded-${index}`}
                  width="100%"
                  height="160"
                  className="rounded cursor-pointer"
                  style={{ objectFit: "cover" }}
                  onClick={() => {
                    setSelectedImage(img.url);
                    setShowModal(true);
                  }}
                />
                <div className="small mt-2 text-dark text-center fw-medium">
                  <div>{img.uploaded_by?.name}</div>
                  <div style={{ fontSize: "0.75rem" }}>
                    {new Date(img.uploaded_by?.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <CModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        size="lg"
        centered
      >
        <CModalBody>
          {selectedImage && (
            <CImage
              src={selectedImage}
              fluid
              alt="Full Preview"
              style={{
                maxHeight: "500px",
                width: "100%",
                objectFit: "contain",
              }}
            />
          )}
        </CModalBody>
      </CModal>
    </div>
  );
};

export default UploadImages;
