import React, { useEffect, useState } from "react";
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
  CListGroup,
  CListGroupItem,
  CBadge,
} from "@coreui/react";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { cilX } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateServiceTicket = () => {
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

  const authtoken = useSelector((state) => state.authtoken);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRobots, setFilteredRobots] = useState([]);
  const [uploadingFields, setUploadingFields] = useState({});
  const [robots, setRobots] = useState([]);
  const [faults, setFaults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [faultLoading, setFaultLoading] = useState(false);
  const navigate = useNavigate();

  // 📌 Handle search input change

  useEffect(() => {
    const fetchAllRobots = async () => {
      try {
        const response = await axios.get("/api/v1/robots", {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        let result = response.data.data;
        setRobots(result);
        console.log(result);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    const fetchAllFaults = async () => {
      setFaultLoading(true);
      try {
        const response = await axios.get("/api/v1/serviceticketsfaults", {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        let result = response.data.data;
        setFaults(result);
        setFaultLoading(false);
        console.log(result);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchAllRobots();
    fetchAllFaults();
  }, [authtoken]);

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 0) {
      const filtered = robots.filter(
        (robot) =>
          robot.robot_no.toLowerCase().includes(value.toLowerCase()) ||
          robot.site_id.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredRobots(filtered);
    } else {
      setFilteredRobots([]);
    }
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
        headers: { Authorization: `Bearer ${authtoken}` },
      });
      toast.success(
        `${response.data.data.ticket_id}, Ticket Created Successfully!`
      );
      setLoading(false);
      navigate("/master-admin/service-tickets");
      console.log("Created Ticket:", response.data);
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
            Authorization: `Bearer ${authtoken}`,
          },
        }
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
              {/* 📌 Search for Robot */}
              <CFormInput
                type="text"
                placeholder="Search Robot No or Site ID..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="mb-3"
              />
              {/* 📌 Display Search Suggestions */}
              {filteredRobots.length > 0 && (
                <CListGroup className="mb-3">
                  {filteredRobots.map((robot) => (
                    <CListGroupItem
                      id="robot_no"
                      style={{ cursor: "pointer" }}
                      key={robot.robot_no}
                      action
                      onClick={() => selectRobotFromSearch(robot)}
                    >
                      {robot.robot_no} - {robot.site_id}
                    </CListGroupItem>
                  ))}
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
                    value={formData.lora_no}
                    label="Lora No"
                    disabled
                    className="mb-3"
                  />
                </CCol>
              </CRow>
              {faultLoading ? <LoadingSpinner /> : ""}{" "}
              {/* 📌 Select Fault Type */}
              <CFormSelect
                name="fault_type"
                value={formData.fault_type}
                onChange={(e) =>
                  setFormData({ ...formData, fault_type: e.target.value })
                }
                className="mb-3"
              >
                <option value="">Select Fault Type</option>
                {faults.map((fault, index) => (
                  <option key={index} value={fault.name}>
                    {fault.fault_name.replace(/-/g, " ")}
                  </option>
                ))}
              </CFormSelect>
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
              {[1, 2, 3, 4, 5].map((num) => (
                <CRow>
                  <CCol md={3} key={`resolved-${num}`}>
                    <CFormInput
                      label={`Ticket Generated Image ${num}`}
                      type="file"
                      name={`ticket_generated_images${num}`}
                      onChange={handleFileChange}
                      disabled={
                        uploadingFields[`ticket_generated_images${num}`]
                      } // ✅ Disable only the input being uploaded
                    />
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
              <CButton type="submit" color="primary" className="w-100 m-2">
                {loading ? (
                  <>
                    Creating... <LoadingSpinner />{" "}
                  </>
                ) : (
                  "Create Ticket"
                )}
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default CreateServiceTicket;
