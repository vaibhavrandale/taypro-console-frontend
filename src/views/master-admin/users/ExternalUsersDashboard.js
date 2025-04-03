// import React from "react";

// const ExternalUsersDashboard = () => {
//   return <div>ExternalUsersDashboard</div>;
// };

// export default ExternalUsersDashboard;

import React, { useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormInput,
  CRow,
  CCol,
  CModalFooter,
  CButton,
  CFormLabel,
  CModalBody,
  CModalTitle,
  CModalHeader,
  CModal,
  CFormSelect,
  CBadge,
  CFormCheck,
  CTabPane,
  CTabContent,
  CNav,
  CNavItem,
  CNavLink,
  CForm,
  CTabs,
  CTabList,
  CTab,
  CTabPanel,
} from "@coreui/react";
import { departments, role_permissions } from "../../../data"; // Ensure correct path
import LoadingSpinner from "../../../components/LoadingSpinner";
import axios from "axios";
import PaginateInput from "../../../components/PaginateInput";
import toast from "react-hot-toast";
import CIcon from "@coreui/icons-react";
import { cilTrash, cilX } from "@coreui/icons";
import { Link } from "react-router-dom";
// import InventoryOverview from "../inventories/InventoryOverview";
// import logo from '../../../assets/brand/logoforwhitebg.png';

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        users: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "FETCH_SITES_REQUEST":
      return { ...state, loadingSites: true, error: "" };
    case "FETCH_SITES_SUCCESS":
      return {
        ...state,
        loadingSites: false,
        sites: action.payload,
      };
    case "FETCH_SITES_FAIL":
      return { ...state, loadingSites: false, error: action.payload };

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

    case "ADD_USER_REQUEST":
      return { ...state, userAddloading: true, error: "" };
    case "ADD_USER_SUCCESS":
      return { ...state, userAddloading: false, users: action.payload };
    case "ADD_USER_FAIL":
      return { ...state, userAddloading: false, error: action.payload };

    case "UPDATE_REQUEST":
      return { ...state, updatingUserLoading: true, updateError: "" };

    case "UPDATE_SUCCESS":
      return {
        ...state,
        updatingUserLoading: false,
        users: state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        ),
      };

    case "UPDATE_FAIL":
      return {
        ...state,
        updatingUserLoading: false,
        updateError: action.payload,
      };

    case "ASSIGN_SITE_REQUEST":
      return { ...state, assignsiteloading: true, assgnedSiteError: "" };

    // case "ASSIGN_SITE_SUCCESS":
    //   return {
    //     ...state,
    //     assignsiteloading: false,
    //     assigned_sites: [...state.assigned_sites, action.payload], // Append new site
    //   };
    case "ASSIGN_SITE_SUCCESS":
      return {
        ...state,
        assignsiteloading: false,
        assigned_sites: state.assigned_sites
          ? [...state.assigned_sites, action.payload]
          : [action.payload], // ✅ Ensure it's always an array
      };

    case "ASSIGN_SITE_FAIL":
      return {
        ...state,
        assignsiteloading: false,
        assgnedSiteError: action.payload,
      };

    case "REMOVE_SITE_REQUEST":
      return {
        ...state,
        removesiteloading: true,
      };

    case "REMOVE_SITE_SUCCESS":
      return {
        ...state,
        removesiteloading: false,
        assigned_sites: state.assigned_sites.filter(
          (site) => site._id !== action.payload
        ), // ✅ Remove site
      };
    case "REMOVE_SITE_FAIL":
      return {
        ...state,
        removesiteloading: false,
        removeSiteError: action.payload, // ✅ Store error message
      };

    default:
      return state;
  }
};

const ExternalUsersDashboard = () => {
  const [
    {
      error,
      loading,
      users,
      sites,
      totalPages,
      hasNextPage,
      hasPrevPage,
      loadingUpload,
      userAddloading,
      updatingUserLoading,
      assignsiteloading,
      assgnedSiteError,
      removesiteloading,
      removeSiteError,
    },
    dispatch,
  ] = useReducer(reducer, {
    users: [],
    sites: [],
    assigned_sites: [],
    loading: false,
    loadingUpload: false,
    userAddloading: false,
    updatingUserLoading: false,
    removesiteloading: false,
    assignsiteloading: false,
    assgnedSiteError: false,
    error: "",
    removeSiteError: "",
    updateError: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  // const { userInfo, authtoken } = useSelector((state) => state);
  const userInfo = useSelector((state) => state.userInfo);
  const authtoken = useSelector((state) => state.authtoken);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [assignedSitesModalVisible, setassignedSitesModalVisible] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [assgnedSites, setAssignedSites] = useState([]);
  // const [users, setUsers] = useState([]); // State for users
  const [pageInput, setPageInput] = useState("");
  const [image, setImage] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [activeTab, setActiveTab] = useState("assigned");

  const [selectedSite, setSelectedSite] = useState("");
  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    // setLoading(true);
    const fetchUsers = async () => {
      let pagination = {
        pg: page,
        limit: limit,
      };
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.post(
          "/api/v1/users/get-external-users",
          pagination,
          {
            headers: { authorization: `Bearer ${authtoken}` },
          }
        ); // Replace with your API endpoint
        let total = Math.ceil(
          Number(result.data.total) / Number(result.data.limit)
        );
        let next = result.data.hasNextPage;
        let prev = result.data.hasPrevPage;
        // setUsers(filteredUsers)
        const data = result.data.data;
        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            data: data,
            totalPages: total,
            hasNextPage: next,
            hasPrevPage: prev,
          },
        });
        // setUsers(data);
        // setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        dispatch({
          type: "FETCH_FAIL",
          payload: "Failed to fetch users",
        });
      }
    };

    const fetchSites = async () => {
      dispatch({ type: "FETCH_SITES_REQUEST" });
      try {
        const result = await axios.get(`/api/v1/sites`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        dispatch({
          type: "FETCH_SITES_SUCCESS",
          payload: result.data.data,
        });
        // console.log("Sites:", result.data.data);
      } catch (error) {
        dispatch({
          type: "FETCH_SITES_FAIL",
          payload: error.response?.data?.error || "Error fetching sites",
        });
        toast.error(error.response.data.error || "Error fetching sites");
      }
    };
    fetchSites();
    fetchUsers();
  }, [authtoken, limit, page, userInfo]); // Runs only once on mount

  // Open Update Modal and Set Selected User Data
  const openModal = (user) => {
    setSelectedUser(user);
    setFormData(user);
    setModalVisible(true);
  };

  const openAssignedSitesModal = (user) => {
    console.log(user);

    setAssignedSites(user.assigned_sites);
    setSelectedUser(user);
    setassignedSitesModalVisible(true);
  };

  // Open Add User Modal
  const openAddModal = () => {
    setFormData({
      id: `U00${users.length + 1}`, // Generate unique user ID
      username: "",
      email: "",
      role: "",
      department: "",
      phone: "",
      type: "External",
      profile_image: "",
    });
    setAddModalVisible(true);
  };

  // const handleChange = (e) => {
  //   const { name, type, checked, value } = e.target;

  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: type === "checkbox" ? checked : value,
  //   }));
  // };

  const handleChange = (e) => {
    console.log("Change detected:", e.target.name, e.target.value); // Debug log
    const { name, type, checked, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle Update User
  // const handleUpdate = () => {
  //   console.log("Updated User:", formData);
  //   setModalVisible(false);
  // };

  const handleAdd = async () => {
    try {
      dispatch({ type: "ADD_USER_REQUEST" });
      const newdata = { ...formData, profile_image: image };
      const response = await axios.post("/api/v1/users", newdata, {
        headers: { authorization: `Bearer ${authtoken}` },
      });

      if (response.status === 201 || response.status === 200) {
        console.log("User successfully added:", response.data);
        dispatch({
          type: "ADD_USER_SUCCESS",
          payload: [...users, response.data.data], // Append new robot to state
        });
        setAddModalVisible(false);
      }
      toast.success(response.data.message);
      setImage("");
    } catch (error) {
      console.error(error);
      dispatch({ type: "ADD_USER_FAIL", payload: error.response.data.error });
      alert(error.response.data.error);
    }
  };

  // Filter Users based on Search Term and ensure they are "Internal" type
  const filteredUsers = users
    ? users.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.department.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  // // console.log(uniqueSitenames);
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handlePageInputSubmit = () => {
    const pageNumber = parseInt(pageInput);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      handlePageChange(pageNumber);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post(
        "/api/v1/image-upload/client-logo",
        bodyFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authtoken}`,
          },
        }
      );
      dispatch({ type: "UPLOAD_SUCCESS" });
      //   console.log(data);

      setImage(data.url);

      toast.success("Image uploaded successfully");
    } catch (err) {
      console.error(error);
    }
  };

  const handleUpdate = async () => {
    try {
      console.log(formData);

      dispatch({ type: "UPDATE_REQUEST" });
      const {
        createdAt,
        _id,
        last_activity,
        addedAt,

        ...filteredFormData
      } = formData;

      // const newdata = { ...filteredFormData, profile_image: image };

      const newdata = image
        ? { ...filteredFormData, profile_image: image }
        : filteredFormData;

      const response = await axios.put(
        `/api/v1/users/${formData._id}`,
        newdata,
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
      );

      dispatch({
        type: "UPDATE_SUCCESS",
        payload: response.data.data,
      });

      toast.success(`${filteredFormData.username} user updated successfully!`);
      setModalVisible(false);
    } catch (error) {
      dispatch({
        type: "UPDATE_FAIL",
        payload: error.response?.data?.message || "Failed to update user",
      });
      toast.error(error.response?.data?.message);
    }
  };

  const handleAssignSite = async () => {
    if (!selectedSite) {
      toast.error("Please select a site to assign.");
      return;
    }

    try {
      dispatch({ type: "ASSIGN_SITE_REQUEST" });
      const response = await axios.post(
        "/api/v1/users/assign-site",
        {
          userId: selectedUser._id,
          siteId: selectedSite,
        },
        {
          headers: { authorization: `Bearer ${authtoken}` },
        }
      ); // Replace with your API endpoint
      if (response.data.success) {
        // Update assigned sites in UI

        dispatch({
          type: "ASSIGN_SITE_SUCCESS",
          payload: response.data.data, // Let the reducer handle appending
        });
        setAssignedSites((prev) => [...prev, response.data.data]);
        // Reset selection
        setSelectedSite("");
        setActiveTab("assigned"); // Switch back to Assigned Sites tab
        toast.success(response.data.message);
      }
    } catch (err) {
      console.log(err);

      dispatch({
        type: "ASSIGN_SITE_FAIL",
        payload: err.response.data.error,
      });
      toast.error(err.response.data.error);
    }
  };

  const handleRemoveSite = async (sitedata) => {
    if (
      !window.confirm(
        `Are you sure you want to remove site 🚨 ${sitedata.site_id}?`
      )
    ) {
      return;
    }

    try {
      dispatch({ type: "REMOVE_SITE_REQUEST" });

      const response = await axios.post(
        "/api/v1/users/remove-assign-site", // ✅ Ensure correct API endpoint
        {
          userId: selectedUser._id,
          siteId: sitedata._id,
        },
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);

        // ✅ Update Redux state
        dispatch({
          type: "REMOVE_SITE_SUCCESS",
          payload: sitedata._id,
        });

        // ✅ Update UI without refresh
        setAssignedSites((prevSites) =>
          prevSites.filter((site) => site._id !== sitedata._id)
        );
      }
    } catch (error) {
      console.error("Error removing site:", error);

      dispatch({
        type: "REMOVE_SITE_FAIL",
        payload: error.response?.data?.error || "Failed to remove site",
      });

      toast.error(error.response?.data?.error || "Failed to remove site");
    }
  };

  console.log(role_permissions);

  return (
    <div className="">
      {/* <img src={logo} alt="logo" className="border" /> */}
      {/* Search & Add User Button */}
      <div>
        <h2 className="text-center">External Users </h2>
      </div>
      <div className="d-flex justify-content-end align-items-center mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <Link
            to="/master-admin/users"
            className="btn btn-sm btn-secondary m-1"
          >
            Internal Users
          </Link>
          <CButton
            color="success"
            size="sm"
            className="text-whit m-1e"
            onClick={openAddModal}
          >
            + Add User
          </CButton>
        </div>
      </div>
      <CRow className="mb-3 justify-content-end">
        {" "}
        <CCol md={4} className="my-2">
          <CFormInput
            type="text"
            placeholder="Search by Name, Email, Role, or Department"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
      </CRow>

      {/* Users Table */}
      <CTable bordered hover responsive className="text-center">
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Profile</CTableHeaderCell>
            <CTableHeaderCell>Username</CTableHeaderCell>
            <CTableHeaderCell>Email</CTableHeaderCell>
            <CTableHeaderCell>Role</CTableHeaderCell>
            <CTableHeaderCell>Department</CTableHeaderCell>
            <CTableHeaderCell>Phone</CTableHeaderCell>

            <CTableHeaderCell>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>

        <CTableBody>
          {loading ? (
            <CTableRow>
              <CTableDataCell colSpan="8" className="text-center">
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <CTableRow
                key={index}
                className={user.is_delete ? " table-danger" : ""}
              >
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>
                  <img
                    src={user.profile_image}
                    alt="Profile"
                    className="rounded-circle"
                    width="50"
                    height="50"
                  />
                </CTableDataCell>
                <CTableDataCell>{user.username}</CTableDataCell>
                <CTableDataCell>{user.email}</CTableDataCell>
                <CTableDataCell style={{ minWidth: "120px" }}>
                  {user.role}
                </CTableDataCell>
                <CTableDataCell>{user.department}</CTableDataCell>
                <CTableDataCell style={{ minWidth: "120px" }}>
                  {user.phone}
                </CTableDataCell>

                <CTableDataCell style={{ minWidth: "260px" }}>
                  <CButton
                    color="secondary"
                    size="sm"
                    className="m-1"
                    onClick={() => openAssignedSitesModal(user)}
                  >
                    view Assigned Sites
                  </CButton>
                  <CButton
                    color="primary"
                    size="sm"
                    className="m-1"
                    onClick={() => openModal(user)}
                  >
                    Update
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="8" className="text-center text-danger">
                No users found.
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
      {/* <PaginateInput
        page={page}
        totalPages={totalPages}
        hasPrevPage={hasPrevPage}
        hasNextPage={hasNextPage}
        pageInput={pageInput}
        handlePageChange={handlePageChange}
        handlePageInputChange={handlePageInputChange}
        handlePageInputSubmit={handlePageInputSubmit}
      /> */}
      <PaginateInput
        page={page}
        totalPages={totalPages}
        hasPrevPage={hasPrevPage}
        hasNextPage={hasNextPage}
        pageInput={pageInput}
        handlePageChange={handlePageChange}
        handlePageInputChange={handlePageInputChange}
        handlePageInputSubmit={handlePageInputSubmit}
        limit={limit}
        handleLimitChange={setLimit} // New prop
      />

      {/*------------- Add User Modal  start---------------------*/}
      <CModal
        size="lg"
        scrollable
        backdrop="static"
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>Add New User</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormLabel>Username</CFormLabel>
          <CFormInput
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <CFormLabel>Email</CFormLabel>
          <CFormInput
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {/* <CFormLabel>Role</CFormLabel>
          <CFormInput
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
          /> */}
          <CFormLabel>Role </CFormLabel>
          <CFormSelect
            name="role"
            onChange={handleChange} // ✅ Calls the function correctly
            value={formData.role}
          >
            <option value="">Select Role</option>
            {role_permissions?.length > 0 &&
              role_permissions.map((role, index) => (
                <option key={index} value={role.role}>
                  {role.role}
                </option>
              ))}
          </CFormSelect>
          <CFormLabel>Department </CFormLabel>
          <CFormSelect
            name="department"
            onChange={handleChange} // ✅ Calls the function correctly
            value={formData.department}
          >
            <option value="">Select Department</option>
            {departments?.length > 0 &&
              departments.map((dep, index) => (
                <option key={index} value={dep.department}>
                  {dep.department}
                </option>
              ))}
          </CFormSelect>
          <CFormLabel>Phone</CFormLabel>
          <CFormInput
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <CFormLabel>Password</CFormLabel>
          <CFormInput
            type="text"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <CFormLabel>Profile Image </CFormLabel>
          <CFormInput
            type="file"
            name="profile_image"
            value={formData.profile_image}
            onChange={handleFileChange}
          />{" "}
          {loadingUpload ? (
            <div className="mt-2 d-flex justify-content-center">
              <LoadingSpinner />
            </div>
          ) : image ? (
            <div className="my-2">
              <img
                src={image}
                alt="Uploaded Logo"
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
                className="p-1"
              >
                {/* <CIcon
                    icon={cilX}
                    cursor="pointer"
                    // onClick={removeLogo}
                    title="Remove file"
                  /> */}
              </CBadge>
            </div>
          ) : null}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            size="sm"
            onClick={() => setAddModalVisible(false)}
          >
            Cancel
          </CButton>
          <CButton
            color="success"
            size="sm"
            className="text-white"
            onClick={handleAdd}
          >
            {userAddloading ? (
              <>
                Adding..
                <LoadingSpinner />
              </>
            ) : (
              "Add User"
            )}
          </CButton>
        </CModalFooter>
      </CModal>
      {/*---------------------- Add User Modal  end-----------------------------*/}

      {/* ---------------------Update User Modal  start ----------------------*/}
      <CModal
        size="lg"
        scrollable
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        backdrop="static"
      >
        <CModalHeader>
          <CModalTitle>Update User - {formData.username}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormLabel>Username</CFormLabel>
          <CFormInput
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <CFormLabel>Email</CFormLabel>
          <CFormInput
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {/* <CFormLabel>Role</CFormLabel>
          <CFormInput
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
          />
          <CFormLabel>Department</CFormLabel>
          <CFormInput
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
          /> */}
          <CFormLabel>Role </CFormLabel>
          <CFormSelect
            name="role"
            onChange={handleChange} // ✅ Calls the function correctly
            value={formData.role}
          >
            <option value="">Select Role</option>
            {role_permissions?.length > 0 &&
              role_permissions.map((role, index) => (
                <option key={index} value={role.role}>
                  {role.role}
                </option>
              ))}
          </CFormSelect>
          <CFormLabel>Department </CFormLabel>
          <CFormSelect
            name="department"
            onChange={handleChange} // ✅ Calls the function correctly
            value={formData.department}
          >
            <option value="">Select Department</option>
            {departments?.length > 0 &&
              departments.map((dep, index) => (
                <option key={index} value={dep.department}>
                  {dep.department}
                </option>
              ))}
          </CFormSelect>
          <CFormLabel>Phone</CFormLabel>
          <CFormInput
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <br />
          <CFormLabel>
            Active Status
            <span className="text-muted ms-2">
              (If it is checked then user cannot be logged in)
            </span>
          </CFormLabel>{" "}
          <br />
          <CFormCheck
            id="is_delete"
            name="is_delete"
            checked={formData.is_delete || false}
            onChange={handleChange}
          />{" "}
          <br />
          <CFormLabel>Image</CFormLabel>
          <CFormInput
            type="file"
            name="profile_image"
            onChange={handleFileChange}
          />
          {loadingUpload ? (
            <div className="mt-2 d-flex justify-content-center">
              <LoadingSpinner />
            </div>
          ) : image ? (
            <div className="my-2">
              <img
                src={image}
                alt="Uploaded Logo"
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
                className="p-1"
              >
                <CIcon
                  icon={cilX}
                  cursor="pointer"
                  // onClick={removeLogo}
                  title="Remove file"
                />
              </CBadge>
            </div>
          ) : formData.profile_image ? (
            <div className="my-2">
              <img
                src={formData.profile_image}
                alt="Uploaded Logo"
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
                className="p-1"
              >
                <CIcon
                  icon={cilX}
                  cursor="pointer"
                  // onClick={removeLogo}
                  title="Remove file"
                />
              </CBadge>
            </div>
          ) : null}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            size="sm"
            onClick={() => setModalVisible(false)}
          >
            Cancel
          </CButton>
          {/* <CButton color="primary" size="sm" onClick={handleUpdate}>
            Save Changes
          </CButton> */}
          <CButton color="primary" className="btn-sm" onClick={handleUpdate}>
            {updatingUserLoading ? (
              <>
                Updating..
                <LoadingSpinner />
              </>
            ) : (
              "Update"
            )}
          </CButton>
        </CModalFooter>
      </CModal>
      {/*---------------------- -Update User Modal  end-----------------------------*/}

      {/*---------------- Assigned Sites modal Modal start ------------------*/}
      <CModal
        size="lg"
        scrollable
        visible={assignedSitesModalVisible}
        onClose={() => setassignedSitesModalVisible(false)}
        backdrop="static"
      >
        <CModalHeader>
          <CModalTitle>
            Assigned Sites of &nbsp;:&nbsp;
            <CBadge color="primary">
              {selectedUser ? selectedUser.username : ""}
            </CBadge>
          </CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CTabs activeItemKey={activeTab} onActiveItemChange={setActiveTab}>
            <CTabList variant="tabs">
              <CTab itemKey="assigned">Assigned Sites</CTab>
              <CTab itemKey="assign">Assign New Site</CTab>
            </CTabList>

            <CTabContent>
              {/* Assigned Sites Tab */}
              <CTabPanel className="p-3" itemKey="assigned">
                <CTable bordered hover responsive className="text-center mt-3">
                  <CTableHead color="secondary">
                    <CTableRow>
                      <CTableHeaderCell>#</CTableHeaderCell>
                      <CTableHeaderCell>Site ID</CTableHeaderCell>
                      <CTableHeaderCell>Site Name</CTableHeaderCell>
                      <CTableHeaderCell>Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {assgnedSites.length > 0 ? (
                      assgnedSites.map((site, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>{index + 1}</CTableDataCell>
                          <CTableDataCell>{site.site_id}</CTableDataCell>
                          <CTableDataCell>{site.siteName}</CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color="danger"
                              className="text-white"
                              size="sm"
                              onClick={() => handleRemoveSite(site)}
                            >
                              <CIcon className=" fw-bolder" icon={cilTrash} />
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell
                          colSpan="4"
                          className="text-center text-danger"
                        >
                          No assigned sites found.
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              </CTabPanel>

              {/* Assign New Site Tab */}
              <CTabPanel className="p-3" itemKey="assign">
                <CForm className="mt-3">
                  <div className="mb-3">
                    <CFormLabel>Select Site</CFormLabel>
                    <CFormSelect
                      name="item_name"
                      value={selectedSite}
                      onChange={(e) => setSelectedSite(e.target.value)}
                    >
                      <option value="">Assign Site</option>
                      {sites?.length > 0 &&
                        sites.map((item, index) => (
                          <option key={index} value={item._id}>
                            {item.site_id}-({item.siteName})
                          </option>
                        ))}
                    </CFormSelect>
                  </div>
                  <CButton
                    color="primary"
                    size="sm"
                    // onClick={() => handleAssignSite(selectedSite)}
                    onClick={handleAssignSite}
                    disabled={!selectedSite}
                  >
                    {assignsiteloading ? (
                      <>
                        Assigning..
                        <LoadingSpinner />
                      </>
                    ) : (
                      "Assign Site"
                    )}
                  </CButton>
                </CForm>
              </CTabPanel>
            </CTabContent>
          </CTabs>
        </CModalBody>
      </CModal>
      {/*----------------- Assigned Sites modal Modal end -------------------*/}
    </div>
  );
};

export default ExternalUsersDashboard;
