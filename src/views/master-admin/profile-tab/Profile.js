import React, {
  useState,
  useRef,
  useCallback,
  useReducer,
  useEffect,
} from "react";
import { useSelector } from "react-redux";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardImage,
  CCol,
  CRow,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
} from "@coreui/react";
import { cilX } from "@coreui/icons";
import Webcam from "react-webcam";
import axios from "axios";
import LastActivity from "../../../components/LastActivity";
import LoadingSpinner from "../../../components/LoadingSpinner"; // adjust path
import toast from "react-hot-toast";
import CIcon from "@coreui/icons-react";

const reducer = (state, action) => {
  switch (action.type) {
    case "UPLOAD_USER_IMAGE_REQUEST":
      return { ...state, uploadingImage: true, uploadError: null };
    case "UPLOAD_USER_IMAGE_SUCCESS":
      return { ...state, uploadingImage: false };
    case "UPLOAD_USER_IMAGE_FAIL":
      return { ...state, uploadingImage: false, uploadError: action.payload };
    case "SAVE_USER_IMAGE_REQUEST":
      return { ...state, savingImage: true, saveError: null };
    case "SAVE_USER_IMAGE_SUCCESS":
      return { ...state, savingImage: false };
    case "SAVE_USER_IMAGE_FAIL":
      return { ...state, savingImage: false, saveError: action.payload };
    case "FETCH_USER_REQUEST":
      return { ...state, usersLoading: true };
    case "FETCH_USER_SUCCESS":
      return { ...state, user: action.payload, usersLoading: false };
    case "FETCH_USER_FAIL":
      return { ...state, usersLoading: false, userError: action.payload };
    default:
      return state;
  }
};

const Profile = () => {
  const [
    {
      uploadingImage,
      savingImage,
      uploadError,
      saveError,
      user,
      usersLoading,
      userError,
    },
    dispatch,
  ] = useReducer(reducer, {
    uploadingImage: false,
    savingImage: false,
    uploadError: null,
    saveError: null,
    usersLoading: true,
    userError: "",
    user: {},
  });

  const userInfo = useSelector((state) => state.userInfo);
  const authtoken = useSelector((state) => state.authtoken);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const webcamRef = useRef(null);
  const isProcessing = uploadingImage || savingImage;
  const isInternal = userInfo.type?.toLowerCase() === "internal";

  const fetchUserDetails = useCallback(async () => {
    try {
      dispatch({ type: "FETCH_USER_REQUEST" });
      const { data } = await axios.get(`/api/v1/users/${userInfo._id}`, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });
      dispatch({ type: "FETCH_USER_SUCCESS", payload: data.data });
    } catch (err) {
      dispatch({
        type: "FETCH_USER_FAIL",
        payload: err.response?.data?.message || "Fetch failed",
      });
    }
  }, [userInfo._id, authtoken]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  const captureImage = useCallback(() => {
    const src = webcamRef.current.getScreenshot();
    setCapturedImage(src);
  }, []);

  const base64ToBlob = (base64, mimeType) => {
    const bytes = atob(base64.split(",")[1]);
    const arr = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
    return new Blob([arr], { type: mimeType });
  };

  const handleImageUpload = useCallback(async () => {
    if (!capturedImage) return;
    const blob = base64ToBlob(capturedImage, "image/jpeg");
    const form = new FormData();
    form.append("file", blob, "captured.jpg");

    try {
      dispatch({ type: "UPLOAD_USER_IMAGE_REQUEST" });
      const { data } = await axios.post(
        "/api/v1/image-upload/user-images",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authtoken}`,
          },
        }
      );
      dispatch({ type: "UPLOAD_USER_IMAGE_SUCCESS" });
      setUploadedImageUrl(data.url);
      // toast.success("Image uploaded");
    } catch (err) {
      dispatch({
        type: "UPLOAD_USER_IMAGE_FAIL",
        payload: err.response?.data?.error || "Upload failed",
      });
      toast.error("Upload failed");
    }
  }, [capturedImage, authtoken]);

  const handleSaveImage = useCallback(async () => {
    if (!uploadedImageUrl) return;
    try {
      dispatch({ type: "SAVE_USER_IMAGE_REQUEST" });
      const { data } = await axios.post(
        "/api/v1/users/save-image",
        { userId: userInfo._id, image: uploadedImageUrl },
        { headers: { Authorization: `Bearer ${authtoken}` } }
      );
      dispatch({ type: "SAVE_USER_IMAGE_SUCCESS" });
      toast.success(data.message);

      // REFRESH PROFILE
      await fetchUserDetails();

      // reset local UI state
      setCapturedImage(null);
      setUploadedImageUrl("");
      setShowCameraModal(false);
    } catch (err) {
      dispatch({
        type: "SAVE_USER_IMAGE_FAIL",
        payload: err.response?.data?.error || "Save failed",
      });
      toast.error(err.response?.data?.error || "Save failed");
    }
  }, [uploadedImageUrl, userInfo._id, authtoken, fetchUserDetails]);

  useEffect(() => {
    if (uploadedImageUrl && !uploadingImage && !uploadError) {
      handleSaveImage();
    }
  }, [uploadedImageUrl, uploadingImage, uploadError, handleSaveImage]);

  const handleUploadAndSave = async () => {
    await handleImageUpload();
  };

  const handleClose = () => {
    setShowCameraModal(false);
    setCapturedImage(null);
    setUploadedImageUrl("");
  };

  const retake = () => setCapturedImage(null);

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "N/A";

  return (
    <div className="container mt-6">
      <CCard className="shadow-lg w-100 w-md-75">
        <div className="bg-primary text-white text-center py-3 mb-3">
          <h5 className="mb-0 text-uppercase">Profile Summary</h5>
        </div>
        <CRow className="g-0 flex-column flex-md-row align-items-start">
          <CCol xs={12} md={4} className="text-center mb-4 mb-md-0">
            <div
              className="border border-dark rounded-circle overflow-hidden mx-auto"
              style={{ width: "180px", height: "180px" }}
            >
              <CCardImage
                src={userInfo.profile_image}
                alt="User"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            </div>
          </CCol>
          <CCol xs={12} md={8}>
            <CCardBody className="pt-0">
              <div className="text-start" style={{ fontSize: "14px" }}>
                {[
                  ["Name", userInfo.username],
                  ["Role", userInfo.role],
                  ["Email", userInfo.email],
                  ["User ID", userInfo._id],
                  ["Created", formatDate(userInfo.createdAt)],
                  ...(isInternal
                    ? [
                        ["Salutation", userInfo.salutation],
                        ["Department", userInfo.department],
                        ["Designation", userInfo.designation],
                        ["Phone", userInfo.phone],
                        ["Employee ID", userInfo.employee_id],
                        [
                          "Last Login",
                          userInfo.last_login
                            ? new Date(userInfo.last_login).toLocaleString(
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
                              )
                            : "N/A",
                        ],
                      ]
                    : []),
                ].map(([label, value]) => (
                  <CRow className="mb-2" key={label}>
                    <CCol xs={5}>
                      <strong>{label}</strong>
                    </CCol>
                    <CCol xs={7}>{value || "N/A"}</CCol>
                  </CRow>
                ))}
              </div>
              {userInfo.assigned_sites?.length > 0 && (
                <>
                  <hr className="my-3" />
                  <div className="text-start mb-2 fw-bold">Assigned Sites</div>
                  <ol className="ps-3 mb-0 small">
                    {userInfo.assigned_sites.map((s) => (
                      <li key={s._id}>{s.site_id}</li>
                    ))}
                  </ol>
                </>
              )}
              <LastActivity lastactivity={userInfo.last_activity} />
            </CCardBody>
          </CCol>
        </CRow>
      </CCard>

      <CCard className="shadow-lg w-100 w-md-75 mt-4">
        <CCardHeader>
          <h4 className="mb-0">Capture Self Profile Photos</h4>
        </CCardHeader>
        <CCardBody className="text-center">
          <CButton
            color="primary"
            size="sm"
            onClick={() => setShowCameraModal(true)}
            disabled={isProcessing}
          >
            Open Camera
          </CButton>
          {usersLoading ? (
            <LoadingSpinner />
          ) : userError ? (
            <div className="text-danger mt-2">{userError}</div>
          ) : null}
          {user.user_images?.length > 0 && (
            <div className="mt-3">
              <small className="text-muted">
                You have {user.user_images.length} images
              </small>
            </div>
          )}
        </CCardBody>
      </CCard>

      <CModal visible={showCameraModal} onClose={handleClose} size="lg">
        <CModalHeader closeButton={false}>
          <CModalTitle>Capture Profile Photo</CModalTitle>
          <span>(with white bg)</span>
          <button
            type="button"
            className=" border-0 ms-auto py-0 px-1"
            onClick={handleClose}
            style={{ background: "none" }}
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>
        <CModalBody className="text-center">
          {capturedImage ? (
            <>
              <img
                src={capturedImage}
                alt="Captured"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "8px",
                  border: "2px solid #ccc",
                }}
              />
              {uploadedImageUrl && (
                <div className="mt-2 text-success">✓ uploaded successfully</div>
              )}
            </>
          ) : (
            <Webcam
              audio={false}
              height={480}
              width={640}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              mirrored
              style={{
                borderRadius: "8px",
                border: "2px solid #ccc",
                maxWidth: "100%",
                height: "auto",
              }}
            />
          )}
        </CModalBody>
        <CModalFooter className="d-flex justify-content-center gap-2">
          {capturedImage ? (
            <>
              <CButton
                color="success"
                size="sm"
                onClick={handleUploadAndSave}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <LoadingSpinner />
                    {uploadingImage ? "Uploading..." : "Saving..."}
                  </>
                ) : (
                  "Save Photo"
                )}
              </CButton>
              <CButton
                color="warning"
                size="sm"
                onClick={retake}
                disabled={isProcessing}
              >
                Retake
              </CButton>
            </>
          ) : (
            <CButton color="primary" size="sm" onClick={captureImage}>
              Capture
            </CButton>
          )}
          {/* <CButton
            color="secondary"
            size="sm"
            onClick={handleClose}
            disabled={isProcessing}
          >
            Cancel
          </CButton> */}
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default Profile;
