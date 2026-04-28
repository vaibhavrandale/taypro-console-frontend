import React, { useEffect, useReducer, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CForm,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CRow,
  CCol,
  CBadge,
} from "@coreui/react";

import "../../master-admin/internal-tickets/internaltickts.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import LoadingSpinner from "../../../components/LoadingSpinner";
import CIcon from "@coreui/icons-react";
import { cilCloudUpload, cilX } from "@coreui/icons";
const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_TICKET_REQUEST":
      return { ...state, createTicketloading: true, error: "" };
    case "CREATE_TICKET_SUCCESS":
      return {
        ...state,
        createTicketloading: false,
        // client_tickets: action.payload,
      };
    case "CREATE_TICKET_FAIL":
      return { ...state, createTicketloading: false, error: action.payload };

    case "FETCH_SITEID_REQUEST":
      return { ...state, loadingSiteIds: true, error: "" };
    case "FETCH_SITEID_SUCCESS":
      return {
        ...state,
        loadingSiteIds: false,
        siteIds: action.payload,
      };
    case "FETCH_SITEID_FAIL":
      return { ...state, loadingSiteIds: false, error: action.payload };
    case "SELECT_SITENAME_REQUEST":
      return { ...state, loadingFields: true };
    case "SELECT_SITENAME_SUCCESS":
      return {
        ...state,
        loadingFields: false,
        selectedSiteName: action.payload,
      };
    case "SELECT_SITENAME_FAIL":
      return { ...state, loadingFields: false };
    default:
      return state;
  }
};
const CreateNewClientTicketClient = () => {
  const [{ createTicketloading, loadingSiteIds, siteIds }, dispatch] =
    useReducer(reducer, {
      users: [],
      error: "",
      createTicketloading: false,
      client_tickets: {},
      loadingFields: false,
      loadingSites: false,
      loadingSiteIds: false,
      siteIds: [],
      fetchusersloading: false,
    });

  const [siteName, setSiteName] = useState({
    site_id: "",
  });

  // const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  let adminroute = "";

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    adminroute = "project-admin";
  } else if (userInfo.role === "Client Admin") {
    adminroute = "client-admin";
  }

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    creation_image1: "",
    creation_image2: "",
  });
  const [creationImage1, setCreationImage1] = useState("");
  const [creationImage2, setCreationImage2] = useState("");
  const [uploading1, setUploading1] = useState(false);
  const [uploading2, setUploading2] = useState(false);

  useEffect(() => {
    const fetchSiteIds = async () => {
      dispatch({ type: "FETCH_SITEID_REQUEST" });
      try {
        const result = await axios.get(`/api/v1/sites`, {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        });
        dispatch({
          type: "FETCH_SITEID_SUCCESS",
          payload: result.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_SITEID_FAIL",
          payload: error.response?.data?.error || "Error fetching sites",
        });
        toast.error(error.response.data.error || "Error fetching sites");
      }
    };
    fetchSiteIds();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSiteNameChange = (e) => {
    dispatch({ type: "SELECT_SITENAME_REQUEST" });

    const selectedSiteName = e.target.value;
    const selectedSite = siteIds.find(
      (site) => site.site_id.toString() === selectedSiteName,
    );

    if (selectedSite) {
      setSiteName({
        site_id: selectedSite.site_id,
      });

      dispatch({ type: "SELECT_SITENAME_SUCCESS", payload: selectedSite });
    } else {
      dispatch({ type: "SELECT_SITENAME_FAIL" });
    }
  };

  const handleImageUpload1 = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading1(true);

      const { data } = await axios.post(
        "/api/v1/image-upload/client-tickets",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            // Authorization: `Bearer ${authtoken}`,
          },
          withCredentials: true,
        },
      );

      setCreationImage1(data.url);
      toast.success("Image 1 uploaded");
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setUploading1(false);
    }
  };
  const handleImageUpload2 = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading2(true);

      const { data } = await axios.post(
        "/api/v1/image-upload/client-tickets",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            // Authorization: `Bearer ${authtoken}`,
          },
          withCredentials: true,
        },
      );

      setCreationImage2(data.url);
      toast.success("Image 2 uploaded");
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setUploading2(false);
    }
  };
  const deleteImage1 = () => {
    setCreationImage1("");
    toast.success("Image 1 removed");
  };

  const deleteImage2 = () => {
    setCreationImage2("");
    toast.success("Image 2 removed");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject) {
      toast.error("Please fill all required fields");
      return;
    }
    console.log(formData);

    dispatch({ type: "CREATE_TICKET_REQUEST" });

    const payload = {
      ...formData,
      site_id: siteName.site_id,
      creation_image1: creationImage1,
      creation_image2: creationImage2,
    };

    try {
      await axios.post("/api/v1/clienttickets", payload, {
        // headers: {
        //   Authorization: `Bearer ${authtoken}`,
        // },
        withCredentials: true,
      });

      toast.success("Ticket submitted successfully!");
      dispatch({
        type: "CREATE_TICKET_SUCCESS",
      });

      navigate(`/${adminroute}/clientadmin-client-ticket`);
    } catch (error) {
      dispatch({
        type: "CREATE_TICKET_FAIL",
        payload: error.response.data.error || error.response.data.message,
      });

      toast.error(error.response.data.error || error.response.data.message);
    }
  };

  return (
    <CRow className="justify-content-center mt-2">
      <CCol md={12}>
        <CCard className="shadow">
          <CCardHeader>
            <h4>Create New Client Ticket</h4>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <CRow>
                <CCol md="3">
                  <div className="mb-3">
                    <label className="form-label">
                      Site Id {loadingSiteIds && <LoadingSpinner />}
                    </label>
                    <CFormSelect
                      name="site_id"
                      value={siteName.site_id}
                      onChange={handleSiteNameChange}
                    >
                      <option value="">Select Site Name</option>
                      {siteIds?.length > 0 &&
                        siteIds.map((item) => (
                          <option key={item.site_id} value={item.site_id}>
                            {item.site_id}
                          </option>
                        ))}
                    </CFormSelect>
                  </div>
                </CCol>
                {/* Subject */}
                <CCol md={12}>
                  <CFormInput
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    label="Subject"
                    required
                    className="mb-3"
                  />
                </CCol>

                {/* Description */}
                <CCol md={12}>
                  <CFormTextarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    label="Description"
                    required
                    className="mb-3"
                  />
                </CCol>

                <CCol md="3">
                  <label className="form-label">Image 1</label>

                  {/* Upload Button */}
                  <div className="container-btn-file p-2 m-2 w-30">
                    <CIcon icon={cilCloudUpload} className="upload-icon" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload1}
                      disabled={uploading1}
                      className="file"
                    />
                  </div>

                  {/* Preview */}
                  {uploading1 ? (
                    <div className="d-flex justify-content-center">
                      <LoadingSpinner />
                    </div>
                  ) : creationImage1 ? (
                    <div className="position-relative d-inline-block">
                      <img
                        src={creationImage1}
                        alt="creation im 2"
                        width="50"
                        height="50"
                        style={{ objectFit: "cover", borderRadius: "5px" }}
                      />
                      <CBadge
                        className="p-1 position-absolute"
                        style={{
                          top: "-8px",
                          right: "-8px",
                          cursor: "pointer",
                          borderRadius: "50%",
                          backgroundColor: "red",
                        }}
                        onClick={deleteImage1}
                      >
                        <CIcon icon={cilX} size="sm" />
                      </CBadge>
                    </div>
                  ) : null}
                </CCol>

                <CCol md="3">
                  <label className="form-label">Image 2</label>

                  {/* Upload Button */}
                  <div className="container-btn-file p-2 m-2 w-30">
                    <CIcon icon={cilCloudUpload} className="upload-icon" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload2}
                      disabled={uploading2}
                      className="file"
                    />
                  </div>

                  {/* Preview */}
                  {uploading2 ? (
                    <div className="d-flex justify-content-center">
                      <LoadingSpinner />
                    </div>
                  ) : creationImage2 ? (
                    <div className="position-relative d-inline-block">
                      <img
                        src={creationImage2}
                        alt="creation im 2"
                        width="50"
                        height="50"
                        style={{ objectFit: "cover", borderRadius: "5px" }}
                      />
                      <CBadge
                        className="p-1 position-absolute"
                        style={{
                          top: "-8px",
                          right: "-8px",
                          cursor: "pointer",
                          borderRadius: "50%",
                          backgroundColor: "red",
                        }}
                        onClick={deleteImage2}
                      >
                        <CIcon icon={cilX} size="sm" />
                      </CBadge>
                    </div>
                  ) : null}
                </CCol>

                <CCol md={12} className="my-2">
                  <CButton
                    className=""
                    size="sm"
                    type="submit"
                    color="primary"
                    disabled={createTicketloading}
                  >
                    {createTicketloading ? (
                      <>
                        Creating... <LoadingSpinner />
                      </>
                    ) : (
                      "Create"
                    )}
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default CreateNewClientTicketClient;
