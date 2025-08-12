import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  CBadge,
  CCarousel,
  CCarouselCaption,
  CCarouselItem,
  CFormInput,
  CFormLabel,
  CImage,
} from "@coreui/react";

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "FETCH_ATTACHMENTS_REQUEST":
//       return { ...state, loadingAttachments: true, error: "" };
//     case "FETCH_ATTACHMENTS_SUCCESS":
//       return {
//         ...state,
//         loadingAttachments: false,
//         attachmentsData: action.payload,
//         error: "",
//       };
//     case "FETCH_ATTACHMENTS_FAIL":
//       return { ...state, loadingAttachments: false, error: action.payload };
//     case "UPLOAD_REQUEST":
//       return { ...state, loadingUpload: true, errorUpload: "" };
//     case "UPLOAD_SUCCESS":
//       return {
//         ...state,
//         loadingUpload: false,
//         errorUpload: "",
//       };
//     case "UPLOAD_FAIL":
//       return { ...state, loadingUpload: false, errorUpload: action.payload };
//     case "ADD_ATTACHMENT_REQUEST":
//       return { ...state, attachmentAddLoading: true, error: "" };
//     case "ADD_ATTACHMENT_SUCCESS":
//       return {
//         ...state,
//         attachmentAddLoading: false,
//         attachmentsData: [...state.attachmentsData, action.payload], // ✅ update the actual carousel data
//       };

//     case "ADD_ATTACHMENT_FAIL":
//       return { ...state, attachmentAddLoading: false, error: action.payload };
//     default:
//       return state;
//   }
// };

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_ATTACHMENTS_REQUEST":
      return { ...state, loadingAttachments: true, error: "" };

    case "FETCH_ATTACHMENTS_SUCCESS":
      return {
        ...state,
        loadingAttachments: false,
        attachmentsData: Array.isArray(action.payload)
          ? [...action.payload]
          : [],
        error: "",
      };

    case "FETCH_ATTACHMENTS_FAIL":
      return { ...state, loadingAttachments: false, error: action.payload };

    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };

    case "UPLOAD_SUCCESS":
      return { ...state, loadingUpload: false, errorUpload: "" };

    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    case "ADD_ATTACHMENT_REQUEST":
      return { ...state, attachmentAddLoading: true, error: "" };

    case "ADD_ATTACHMENT_SUCCESS": {
      const newData = action.payload;
      // If array, replace; if single object, append
      const updatedData = Array.isArray(newData)
        ? [...newData]
        : [...state.attachmentsData, newData];

      return {
        ...state,
        attachmentAddLoading: false,
        attachmentsData: updatedData,
      };
    }

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

  const authtoken = useSelector((state) => state.authtoken);
  const { moduleId, cycleId, dayId } = useParams();

  const [image, setImage] = useState("");
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
          payload: error.response?.data?.error || error.response?.data?.message,
        });
      }
    };

    fetchAttachments();
  }, [moduleId, cycleId, dayId, authtoken]);
  console.log(image);
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const bodyFormData = new FormData();
    bodyFormData.append("file", file);

    try {
      dispatch({ type: "UPLOAD_REQUEST" });

      // 1. Upload image
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
      // toast.success("Image uploadeed");

      // 2. Immediately send to backend after image upload
      dispatch({ type: "ADD_ATTACHMENT_REQUEST" });

      const response = await axios.post(
        `/api/v1/opex/attachments/${moduleId}/${cycleId}/${dayId}`,
        { url: data.url },
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
      );
      console.log(response.data.data);

      if (response.status === 201 || response.status === 200) {
        dispatch({
          type: "ADD_ATTACHMENT_SUCCESS",
          payload: response.data.data,
        });

        toast.success("Attachment saved successfully");

        setImage(""); // clear preview
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: "UPLOAD_FAIL",
        payload: error.response?.data?.error || error.response?.data?.message,
      });
      toast.error(error.response?.data?.error || error.response?.data?.message);
    }
  };

  return (
    <div className="">
      <h5 className="text-center ">Cleaning Images</h5>

      {/* Image Uplaod */}
      <div className="row g-3 mb-4">
        <div className="col-auto">
          <CFormLabel htmlFor="imageUpload" className="fw-semibold">
            {loadingUpload || attachmentAddLoading ? (
              <div className="mt-3 d-flex justify-content-center">
                <LoadingSpinner />
              </div>
            ) : errorUpload || error ? (
              <CBadge className="" color="danger">
                {error || errorUpload}
              </CBadge>
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
      </div>

      {/* Uploaded images */}
      <div className="">
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
        ) : attachmentsData.length > 0 ? (
          <CCarousel controls indicators dark>
            {attachmentsData.map((img, index) => (
              <CCarouselItem key={index}>
                <CImage
                  className="d-block w-100"
                  src={img.url}
                  alt={`slide-${index}`}
                  style={{
                    height: "400px",
                    width: "100vw",
                    objectFit: "contain",
                  }}
                />
                <CCarouselCaption className="d-none d-md-block">
                  <h5>Slide {index + 1}</h5>
                  <p>
                    {img.uploaded_by?.name || "Unknown"} at{" "}
                    {new Date(img.uploaded_by?.timestamp).toLocaleString(
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
                </CCarouselCaption>
              </CCarouselItem>
            ))}
          </CCarousel>
        ) : (
          <p className="text-center text-muted">No images uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default UploadImages;
