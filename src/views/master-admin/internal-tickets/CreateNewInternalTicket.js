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
  CListGroup,
  CListGroupItem,
  CBadge,
} from "@coreui/react";

import { departments } from "../../../data";
import "./internaltickts.css";
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
        internal_tickets: action.payload,
      };
    case "CREATE_TICKET_FAIL":
      return { ...state, createTicketloading: false, error: action.payload };

    case "FETCH_USERS_REQUEST":
      return { ...state, fetchusersloading: true, error: "" };
    case "FETCH_USERS_SUCCESS":
      return {
        ...state,
        fetchusersloading: false,
        users: action.payload,
      };
    case "FETCH_USERS_FAIL":
      return { ...state, fetchusersloading: false, error: action.payload };
    default:
      return state;
  }
};
const CreateInternalTicket = () => {
  const [{ createTicketloading, users }, dispatch] = useReducer(reducer, {
    users: [],
    error: "",
    createTicketloading: false,
    internal_tickets: {},
    fetchusersloading: false,
  });

  const authtoken = useSelector((state) => state.authtoken);
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

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate();
  const [uploadingFields, setUploadingFields] = useState({});
  const [formData, setFormData] = useState({
    department: "",
    subject: "",
    description: "",
    priority: "",
    status: "Open",
    assigned_to: null, // <-- now it's an object, not a string
    ticket_generated_images1: "",
    ticket_generated_images2: "",
    ticket_generated_images3: "",
    ticket_generated_images4: "",
    ticket_generated_images5: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      dispatch({ type: "FETCH_USERS_REQUEST" });
      try {
        const result = await axios.get(
          "/api/v1/users/get-all-internal-users-without-pg",

          {
            headers: { authorization: `Bearer ${authtoken}` },
          }
        ); // Replace with your API endpoint

        const data = result.data.data;
        dispatch({
          type: "FETCH_USERS_SUCCESS",
          payload: data,
        });
      } catch (error) {
        console.error("Error fetching users:", error);
        dispatch({
          type: "FETCH_USERS_FAIL",
          payload: "Failed to fetch users",
        });
      }
    };

    fetchUsers();
  }, [authtoken]); // Runs only once on mount

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDepartmentChange = (e) => {
    const selectedDepartment = e.target.value;
    const departmentData = departments.find(
      (dept) => dept.department === selectedDepartment
    );

    setFormData((prev) => ({
      ...prev,
      department: selectedDepartment,
      department_email: departmentData ? departmentData.email : "",
    }));
  };

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.length === 0) {
      setFormData({ ...formData, assigned_to: null });
      setFilteredUsers([]);
      return;
    }

    const filteredUserEmails = users.filter((user) =>
      user.email.toLowerCase().includes(term)
    );

    const filteredDepartmentEmails = departments.filter((dept) =>
      dept.email.toLowerCase().includes(term)
    );

    const combinedResults = [
      ...filteredUserEmails.map((user) => ({
        id: user._id,
        email: user.email,
        username: user.username,
        profile_image: user.profile_image,
        role: user.role,
      })),
      ...filteredDepartmentEmails.map((dept) => ({
        id: dept.id,
        email: dept.email,
        name: dept.department,
      })),
    ];

    setFilteredUsers(combinedResults);
  };

  const selectUser = (user) => {
    setFormData({
      ...formData,
      assigned_to: user, // ✅ this is the full user object
    });

    setSearchTerm(user.email);

    setFilteredUsers([]);
  };

  const deleteFileHandler = async (fileName) => {
    setFormData((prevData) => ({
      ...prevData,
      [`ticket_generated_images${fileName}`]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      dispatch({ type: "CREATE_TICKET_REQUEST" });

      const response = await axios.post("/api/v1/internaltickets", formData, {
        headers: { authorization: `Bearer ${authtoken}` },
      });

      dispatch({
        type: "CREATE_TICKET_SUCCESS",
        payload: response.data.data, // Append new robot to state
      });

      toast.success(response.data.message);
      navigate(`/${adminroute}/internal-tickets`); // Redirect after success
    } catch (error) {
      console.error(error);
      dispatch({
        type: "CREATE_TICKET_FAIL",
        payload: error.response
          ? error.response.data.error
          : "An error occurred",
      });
      alert(error.response ? error.response.data.error : "An error occurred");
    }
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
        "/api/v1/image-upload/internal-tickets",
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
    <CRow className="justify-content-center mt-2">
      <CCol md={12}>
        <CCard className="shadow">
          <CCardHeader>
            <h4>Create New Internal Ticket</h4>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <CRow>
                {/* Assign To Email (Search) */}
                <CCol md={6}>
                  <CFormInput
                    type="email"
                    name="assigned_to_email"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    label="Assign To Email"
                    className="mb-3"
                    autoComplete="off"
                    placeholder="Search by email..."
                  />

                  {/* 📌 Display Search Suggestions */}
                  {filteredUsers.length > 0 && (
                    <CListGroup className="mb-3" id="userlist">
                      {filteredUsers.map((user, index) => (
                        <CListGroupItem
                          key={index}
                          id="userlistitem"
                          onClick={() => selectUser(user)}
                        >
                          {user.username} - {user.email}
                        </CListGroupItem>
                      ))}
                    </CListGroup>
                  )}
                </CCol>

                {/* Assigned To Name (Auto-filled) */}
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    name="assigned_to"
                    readOnly
                    value={formData.assigned_to?.username || ""}
                    label="Assign To"
                    className="mb-3"
                  />
                </CCol>

                <CCol md={6}>
                  <CFormSelect
                    name="department"
                    value={formData.department}
                    onChange={handleDepartmentChange}
                    label="To Department"
                    required
                    className=""
                  >
                    <option value="">Select Department</option>
                    {departments
                      .sort((a, b) => a.department.localeCompare(b.department)) // Sorting Alphabetically
                      .map((item, index) => (
                        <option key={index} value={item.department}>
                          {item.department}
                        </option>
                      ))}
                  </CFormSelect>
                  <span className="mx-1 text-danger mb-3">
                    {formData.department_email}
                  </span>
                  {formData.department_email ? (
                    <span className="text-muted">(this email is for cc)</span>
                  ) : (
                    ""
                  )}
                  {/* Hidden Department Email Field (Auto-Filled) */}
                  <CFormInput
                    type="hidden"
                    name="department_email"
                    value={formData.department_email}
                    label=""
                    disabled
                    className="mb-3"
                  />
                </CCol>

                {/* Subject */}
                <CCol md={6}>
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

                {/* Priority */}
                <CCol md={6}>
                  <CFormSelect
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    label="Priority"
                    className="mb-3"
                  >
                    <option value="">Select</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </CFormSelect>
                </CCol>

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

                <CCol md={12}>
                  <CButton
                    className=""
                    size="sm"
                    type="submit"
                    color="primary"
                    disabled={createTicketloading}
                  >
                    {createTicketloading ? (
                      <>
                        {" "}
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

export default CreateInternalTicket;
