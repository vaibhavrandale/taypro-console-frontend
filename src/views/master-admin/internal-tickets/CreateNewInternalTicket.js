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
} from "@coreui/react";

import { departments } from "../../../data";
import "./internaltickts.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import LoadingSpinner from "../../../components/LoadingSpinner";
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
  const [
    { error, createTicketloading, internal_tickets, users, fetchusersloading },
    dispatch,
  ] = useReducer(reducer, {
    users: [],
    error: "",
    createTicketloading: false,
    internal_tickets: {},

    fetchusersloading: false,
  });
  // const { userInfo, authtoken } = useSelector((state) => state);
  // const userInfo = useSelector((state) => state.userInfo);
  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  // console.log(Robotdata[0].last_uplink);
  let adminroute = "";

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    adminroute = "project-admin";
  }

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    department: "",
    subject: "",
    description: "",
    priority: "",
    status: "Open",
    assigned_to: null, // <-- now it's an object, not a string
    // assigned_to: "",
    // assigned_to_email: "",
    // assigned_to_id: "",
  });

  useEffect(() => {
    // setLoading(true);
    const fetchUsers = async () => {
      dispatch({ type: "FETCH_USERS_REQUEST" });
      try {
        const result = await axios.get(
          "/api/v1/users/get-all-internal-users-without-pg",

          {
            headers: { authorization: `Bearer ${authtoken}` },
          }
        ); // Replace with your API endpoint
        console.log(result.data.data);

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

  // const handleDepartmentChange = (e) => {
  //   const selectedDepartment = e.target.value;
  //   const departmentData = departments.find(
  //     (dept) => dept.department === selectedDepartment
  //   );

  //   setFormData((prev) => ({
  //     ...prev,
  //     department: selectedDepartment,
  //     department_email: departmentData ? departmentData.email : "", // Ensure correct department email
  //     assigned_to_email: prev.assigned_to ? prev.assigned_to.email : "",
  //     assigned_to_id: prev.assigned_to ? prev.assigned_to._id : "",

  //   }));
  // };

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
    // setFormData({
    //   ...formData,
    //   assigned_to: user, // Store the entire user object
    // });
    setFormData({
      ...formData,
      assigned_to: user, // ✅ this is the full user object
    });

    // setSearchTerm(user.email);

    setSearchTerm(user.email);

    setFilteredUsers([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    console.log(formData);
    try {
      dispatch({ type: "CREATE_TICKET_REQUEST" });

      const response = await axios.post("/api/v1/internaltickets", formData, {
        headers: { authorization: `Bearer ${authtoken}` },
      });

      console.log("Ticket successfully created:", response.data);
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

                {/* Created At (Auto-Filled) */}
                {/* <CCol md={6}>
                  <CFormInput
                    type="datetime-local"
                    name="created_at"
                    value={formData.created_at}
                    label="Created At"
                    disabled
                    className="mb-3"
                  />
                </CCol> */}

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
