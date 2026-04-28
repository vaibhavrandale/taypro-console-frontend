/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable default-case */
import React, { useEffect, useReducer, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormSelect,
  CFormInput,
  CFormTextarea,
  CButton,
  CRow,
  CCol,
  CBadge,
  CListGroup,
  CListGroupItem,
} from "@coreui/react";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { cilX } from "@coreui/icons";
import { cilCloudUpload } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./servicetickts.css";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_ROBOTS_REQUEST":
      return { ...state, robotsloading: true };

    case "FETCH_ROBOTS_SUCCESS":
      return { ...state, robots: action.payload, robotsloading: false };

    case "FETCH_ROBOTS_FAIL":
      return { ...state, robotsloading: false, roboterror: action.payload };

    case "FETCH_FAULTS_REQUEST":
      return { ...state, faultsloading: true };

    case "FETCH_FAULTS_SUCCESS":
      return {
        ...state,
        serviceticketsfault: action.payload,
        faultsloading: false,
      };

    case "FETCH_FAULTS_FAIL":
      return { ...state, faultsloading: false, faulterror: action.payload };
  }
};

const CreateServiceTicket = () => {
  const [
    {
      faultsloading,
      roboterror,
      robotsloading,
      faulterror,
      robots,
      serviceticketsfault,
    },
    dispatch,
  ] = useReducer(reducer, {
    faultsloading: true,
    robotsloading: true,
    roboterror: "",
    faulterror: "",
    robots: [],
    serviceticketsfault: [],
  });

  const [formData, setFormData] = useState({
    robot_no: "",
    deveui: "",
    site_id: "",
    company: "",
    lora_no: "",
    fault_type: "",
    ticket_generating_notes: "",
    block: "",
    robot_type: "",
    ticket_resolved: false,
    ticket_generated_images1: "",
    ticket_generated_images2: "",
    ticket_generated_images3: "",
    ticket_generated_images4: "",
    ticket_generated_images5: "",
  });

  // const authtoken = useSelector((state) => state.authtoken);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRobots, setFilteredRobots] = useState([]);
  const [uploadingFields, setUploadingFields] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.userInfo);
  const [faultSearchTerm, setFaultSearchTerm] = useState("");
  const [filteredFaults, setFilteredFaults] = useState([]);
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
  // 📌 Handle search input change

  useEffect(() => {
    const fetchAllRobots = async () => {
      try {
        dispatch({ type: "FETCH_ROBOTS_REQUEST" });

        const response = await axios.get(
          "/api/v1/robots/get-robots/robots-without-pg",
          {
            // headers: { Authorization: `Bearer ${authtoken}` },
            withCredentials: true,
          },
        );

        dispatch({
          type: "FETCH_ROBOTS_SUCCESS",
          payload: response.data.data,
        });
      } catch (error) {
        console.error("Error fetching notifications:", error);

        dispatch({
          type: "FETCH_ROBOTS_FAIL",
          payload: error.response ? error.response.data.error : error.message,
        });
      }
    };
    const fetchAllFaults = async () => {
      try {
        dispatch({ type: "FETCH_FAULTS_REQUEST" });
        const response = await axios.get(
          "/api/v1/serviceticketsfaults/all-serviceticketsfaults-without-pg",
          {
            // headers: { Authorization: `Bearer ${authtoken}` },
            withCredentials: true,
          },
        );

        dispatch({
          type: "FETCH_FAULTS_SUCCESS",
          payload: response.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_ROBOTS_FAIL",
          payload: error.response ? error.response.data.message : error.message,
        });
      }
    };
    fetchAllRobots();
    fetchAllFaults();
  }, []);

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 0) {
      const filtered = robots.filter(
        (robot) =>
          robot.robot_no.toLowerCase().includes(value.toLowerCase()) ||
          robot.site_id.toLowerCase().includes(value.toLowerCase()),
      );

      setFilteredRobots(filtered);
    } else {
      setFilteredRobots([]);
    }
  };
  const handleFaultSearchChange = (e) => {
    const value = e.target.value;
    setFaultSearchTerm(value);
    if (value.length > 0) {
      const filtered = serviceticketsfault.filter((fault) =>
        fault.fault_name.toLowerCase().includes(value.toLowerCase()),
      );
      setFilteredFaults(filtered);
    } else {
      setFilteredFaults([]);
    }
  };
  const selectFaultFromSearch = (fault) => {
    setFormData({ ...formData, fault_type: fault.fault_name });
    setFaultSearchTerm("");
    setFilteredFaults([]);
  };
  const deleteFileHandler = async (fileName) => {
    setFormData((prevData) => ({
      ...prevData,
      [`ticket_generated_images${fileName}`]: "",
    }));
  };

  // 📌 Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/v1/servicetickets", formData, {
        // headers: { Authorization: `Bearer ${authtoken}` },
        withCredentials: true,
      });
      toast.success(
        `${response.data.data.ticket_id}, Ticket Created Successfully!`,
      );
      setLoading(false);
      navigate(`/${adminroute}/service-tickets`);
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };
  const selectRobotFromSearch = (robot) => {
    setFormData({
      ...formData,
      robot_no: robot.robot_no,
      deveui: robot.deveui,
      site_id: robot.site_id,
      company: robot.company,
      lora_no: robot.lora_no,
      block: robot.block,
      robot_type: robot.robot_type,
    });
    setSearchTerm(""); // Clear search input
    setFilteredRobots([]); // Hide suggestions
  };
  const handleFileChange = async (event) => {
    const { name, files } = event.target;
    if (files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadingFields((prev) => ({ ...prev, [name]: true })); // ✅ Set only this field to loading

      const response = await axios.post(
        "/api/v1/image-upload/service-tickets",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            // Authorization: `Bearer ${authtoken}`,
          },
          withCredentials: true,
        },
      );

      // ✅ Update uploaded image dynamically for the specific field
      setFormData((prevData) => ({
        ...prevData,
        [name]: response.data.url, // Assuming backend returns { url: "uploaded_image_url" }
      }));

      setUploadingFields((prev) => ({ ...prev, [name]: false })); // ✅ Stop loading for this input
    } catch (error) {
      setUploadingFields((prev) => ({ ...prev, [name]: false })); // ✅ Stop loading on error
      console.error("File upload error:", error);
    }
  };

  return (
    <CRow className="justify-content-center">
      <CCol>
        <CCard className="shadow">
          <CCardHeader>
            <h5>Create New Service Ticket</h5>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              {robotsloading ? (
                <LoadingSpinner />
              ) : roboterror ? (
                <span className="badge bg-danger p-2">{roboterror}</span>
              ) : (
                <CFormInput
                  type="text"
                  placeholder="Search Robot No or Site ID..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="mb-3"
                />
              )}
              {searchTerm && (
                <CListGroup
                  className="mb-3"
                  style={{
                    maxHeight: "250px",
                    overflowY: "auto",
                    width: "300px",
                    padding: "8px",
                    marginTop: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "0.375rem",
                    backgroundColor: "#fff",
                  }}
                >
                  {filteredRobots.length === 0 ? (
                    <CListGroupItem>No robots found</CListGroupItem>
                  ) : (
                    filteredRobots.map((robot, index) => (
                      <CListGroupItem
                        id="robot_no"
                        key={index}
                        action
                        style={{ cursor: "pointer", padding: "10px" }}
                        onClick={() => selectRobotFromSearch(robot)}
                      >
                        {robot.robot_no} - {robot.site_id}
                      </CListGroupItem>
                    ))
                  )}
                </CListGroup>
              )}

              <CRow>
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    name="deveui"
                    value={formData.robot_no}
                    label="Robot No"
                    disabled
                    className="mb-3"
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    name="deveui"
                    value={formData.deveui}
                    label="Deveui"
                    disabled
                    className="mb-3"
                  />
                </CCol>
              </CRow>
              <CRow>
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    name="site_id"
                    value={formData.site_id}
                    label="Site ID"
                    disabled
                    className="mb-3"
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    name="company"
                    value={formData.company}
                    label="Company"
                    disabled
                    className="mb-3"
                  />
                </CCol>
              </CRow>
              <CRow>
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    name="lora_no"
                    value={formData.lora_no ? formData.lora_no : "N/A"}
                    label="Lora No"
                    disabled
                    className="mb-3"
                  />
                </CCol>
              </CRow>

              {/* 📌 Select Fault Type */}
              {faultsloading ? (
                <LoadingSpinner />
              ) : faulterror ? (
                <span className="badge bg-danger p-2">{roboterror}</span>
              ) : (
                <>
                  <CFormInput
                    type="text"
                    placeholder="Search Fault Type..."
                    value={faultSearchTerm}
                    onChange={handleFaultSearchChange}
                    className="mb-3"
                  />
                  {faultSearchTerm && (
                    <CListGroup
                      className="mb-3"
                      style={{
                        maxHeight: "250px",
                        overflowY: "auto",
                        width: "300px",
                        padding: "8px",
                        marginTop: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "0.375rem",
                        backgroundColor: "#fff",
                      }}
                    >
                      {filteredFaults.length === 0 ? (
                        <CListGroupItem>No fault types found</CListGroupItem>
                      ) : (
                        filteredFaults.map((fault, index) => (
                          <CListGroupItem
                            key={index}
                            action
                            style={{ cursor: "pointer", padding: "10px" }}
                            onClick={() => selectFaultFromSearch(fault)}
                          >
                            {fault.fault_name.replace(/-/g, " ")}
                          </CListGroupItem>
                        ))
                      )}
                    </CListGroup>
                  )}
                  {formData.fault_type && !faultSearchTerm && (
                    <div className="mb-3">
                      <strong>Selected Fault:</strong>{" "}
                      {formData.fault_type.replace(/-/g, " ")}
                    </div>
                  )}
                </>
              )}
              {/* 📌 Notes */}
              <CFormTextarea
                name="notes"
                value={formData.ticket_generating_notes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ticket_generating_notes: e.target.value,
                  })
                }
                rows={3}
                placeholder="Add any additional notes..."
                className="mb-3"
              />
              {[1, 2, 3, 4, 5].map((num, index) => (
                <CRow>
                  <CCol md={2} key={`resolved-${index}`}>
                    <div className="container-btn-file p-2 m-2 w-80">
                      <CIcon icon={cilCloudUpload} className="upload-icon" />
                      {`Image ${num}`}
                      <input
                        className="file"
                        name={`ticket_generated_images${num}`}
                        type="file"
                        onChange={handleFileChange}
                        disabled={
                          uploadingFields[`ticket_generated_images${num}`]
                        }
                      />
                    </div>
                  </CCol>

                  <CCol md={3}>
                    {uploadingFields[`ticket_generated_images${num}`] ? ( // ✅ Show loader only for the uploading input
                      <div className="mt-2 d-flex justify-content-center">
                        <LoadingSpinner />
                      </div>
                    ) : formData[`ticket_generated_images${num}`] ? (
                      <div className="my-2">
                        <img
                          className="position-relative "
                          src={formData[`ticket_generated_images${num}`]}
                          alt={`Generated Image ${num}`}
                          width="80"
                          height="80"
                          style={{ objectFit: "cover", borderRadius: "5px" }}
                        />
                        <CBadge
                          color="primary"
                          position="absolute"
                          top="0"
                          left="0"
                          shape="rounded-pill"
                          className=" p-1"
                        >
                          <CIcon
                            icon={cilX}
                            cursor="pointer"
                            onClick={() => deleteFileHandler(num)}
                            title="Download file"
                          />
                        </CBadge>
                      </div>
                    ) : null}
                  </CCol>
                </CRow>
              ))}
              {/* 📌 Submit Button */}
              <div className="d-flex justify-content-end">
                <CButton
                  type="submit"
                  color="primary"
                  size="sm"
                  className=" m-2"
                  disabled={
                    loading || !formData.fault_type || !formData.robot_no
                  }
                >
                  {loading ? (
                    <>
                      Creating... <LoadingSpinner />{" "}
                    </>
                  ) : (
                    "Create Ticket"
                  )}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default CreateServiceTicket;
