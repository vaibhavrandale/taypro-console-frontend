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
} from "@coreui/react";
import { departments, role_permissions } from "../../../data"; // Ensure correct path
import LoadingSpinner from "../../../components/LoadingSpinner";
import axios from "axios";
import PaginateInput from "../../../components/PaginateInput";
import toast from "react-hot-toast";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";
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

    default:
      return state;
  }
};

const UsersDashboard = () => {
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
    },
    dispatch,
  ] = useReducer(reducer, {
    users: [],
    sites: [],
    loading: false,
    loadingUpload: false,
    userAddloading: false,
    updatingUserLoading: false,
    error: "",
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
        const result = await axios.post("/api/v1/users/get-users", pagination, {
          headers: { authorization: `Bearer ${authtoken}` },
        }); // Replace with your API endpoint
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

  const openAssignedSitesModal = (assigned_sites) => {
    setAssignedSites(assigned_sites);
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
      type: "Internal",
      profile_image: "",
    });
    setAddModalVisible(true);
  };

  // Handle Input Change
  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  const handleChange = (e) => {
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
  const filteredUsers = users.filter(
    (user) =>
      user.type === "Internal" &&
      (user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

  const handleAssignSite = async (userId) => {
    if (!selectedSite) {
      toast.error("Please select a site to assign.");
      return;
    }

    try {
      const response = await axios.post("/api/assign-site", {
        userId,
        siteId: selectedSite,
      });

      if (response.data.success) {
        // Update assigned sites in UI
        setAssignedSites([...assgnedSites, response.data.data]);

        // Reset selection
        setSelectedSite("");
        setActiveTab("assigned"); // Switch back to Assigned Sites tab
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error assigning site.");
    }
  };

  return (
    <div className="">
      {/* <img src={logo} alt="logo" className="border" /> */}
      {/* Search & Add User Button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="text-center">User Management</h2>
        </div>

        <div>
          <CButton
            color="success"
            size="sm"
            className="text-white"
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
                    onClick={() => openAssignedSitesModal(user.assigned_sites)}
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
      <PaginateInput
        page={page}
        totalPages={totalPages}
        hasPrevPage={hasPrevPage}
        hasNextPage={hasNextPage}
        pageInput={pageInput}
        handlePageChange={handlePageChange}
        handlePageInputChange={handlePageInputChange}
        handlePageInputSubmit={handlePageInputSubmit}
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
          <CFormLabel>Role</CFormLabel>
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
          />
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
          <CFormLabel>Role</CFormLabel>
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
          />
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
              (If it is checked then user can't Login.)
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
          <CModalTitle>Assigned Sites of Vaibhav Randale</CModalTitle>
        </CModalHeader>

        <CModalBody>
          {/* Tabs Navigation */}
          <CNav variant="tabs">
            <CNavItem>
              <CNavLink
                active={activeTab === "assigned"}
                onClick={() => setActiveTab("assigned")}
              >
                Assigned Sites
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === "assign"}
                onClick={() => setActiveTab("assign")}
              >
                Assign New Site
              </CNavLink>
            </CNavItem>
          </CNav>

          {/* Tab Content */}
          <CTabContent>
            {/* Assigned Sites Tab */}
            <CTabPane visible={activeTab === "assigned"}>
              <CTable bordered hover responsive className="text-center mt-3">
                <CTableHead color="secondary">
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Site ID</CTableHeaderCell>
                    <CTableHeaderCell>Site Name</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {assgnedSites.length > 0 ? (
                    assgnedSites.map((site, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>{site.site_id}</CTableDataCell>
                        <CTableDataCell>{site.siteName}</CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell
                        colSpan="3"
                        className="text-center text-danger"
                      >
                        No sites found.
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CTabPane>

            {/* Assign New Site Tab */}
            <CTabPane visible={activeTab === "assign"}>
              <CForm className="mt-3">
                <div className="mb-3">
                  <CFormLabel>Select Site</CFormLabel>
                  <CFormSelect
                    name="item_name"
                    // value={formData.assigned_sites.siteId}
                    //  onChange={handleSiteChange}
                  >
                    <option value="">Assign Site</option>
                    {sites?.length > 0 &&
                      sites.map((item, index) => (
                        <option key={index} value={item.site_id}>
                          {item.site_id}-({item.siteName})
                        </option>
                      ))}
                  </CFormSelect>
                </div>
                <CButton
                  color="primary"
                  // onClick={() => handleAssignSite(selectedSite)}
                  // disabled={!selectedSite}
                >
                  Assign Site
                </CButton>
              </CForm>
            </CTabPane>
          </CTabContent>
        </CModalBody>
      </CModal>
      {/*----------------- Assigned Sites modal Modal end -------------------*/}
    </div>
  );
};

export default UsersDashboard;
