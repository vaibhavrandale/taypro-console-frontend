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
  CTabContent,
  CForm,
  CTabs,
  CTabList,
  CTab,
  CTabPanel,
} from "@coreui/react";
import {
  departments,
  projects_role_permissions,
  projects_user_role_permissions,
  role_permissions,
  service_role_permissions,
  service_user_role_permissions,
  design_user_role_permissions,
} from "../../../data";
import LoadingSpinner from "../../../components/LoadingSpinner";
import axios from "axios";
import PaginateInput from "../../../components/PaginateInput";
import toast from "react-hot-toast";
import CIcon from "@coreui/icons-react";
import { cilTrash, cilX } from "@coreui/icons";
import { Link } from "react-router-dom";
import LastActivity from "../../../components/LastActivity";
import {
  canManageUsers,
  getApiErrorMessage,
} from "../../../utils/accessControl";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        users: action.payload.data,
        totalPages: action.payload.totalPages,
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
      return {
        ...state,
        userAddloading: false,
        users: [...state.users, action.payload],
      };

    case "ADD_USER_FAIL":
      return { ...state, userAddloading: false, error: action.payload };

    case "UPDATE_REQUEST":
      return { ...state, updatingUserLoading: true, updateError: "" };

    case "UPDATE_SUCCESS":
      return {
        ...state,
        updatingUserLoading: false,
        users: state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user,
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

    case "ASSIGN_SITE_SUCCESS":
      return {
        ...state,
        assignsiteloading: false,
        assigned_sites: state.assigned_sites
          ? [...state.assigned_sites, action.payload]
          : [action.payload],
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
          (site) => site._id !== action.payload,
        ),
      };
    case "REMOVE_SITE_FAIL":
      return {
        ...state,
        removesiteloading: false,
        removeSiteError: action.payload,
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
      assignsiteloading,
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

  const userInfo = useSelector((state) => state.userInfo);
  let roles = [];
  if (userInfo?.role === "Master Admin") {
    roles = role_permissions;
  } else if (userInfo.role === "Project Admin") {
    roles = projects_role_permissions;
  } else if (userInfo.role === "Service User") {
    roles = service_user_role_permissions;
  } else if (userInfo.role === "Project User") {
    roles = projects_user_role_permissions;
  } else if (userInfo.role === "Design Admin") {
    roles = design_user_role_permissions;
  } else {
    roles = service_role_permissions;
  }

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
  }

  const canEditUsers = canManageUsers(userInfo?.role);

  // const authtoken = useSelector((state) => state.authtoken);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [assignedSitesModalVisible, setassignedSitesModalVisible] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [assgnedSites, setAssignedSites] = useState([]);
  const [pageInput, setPageInput] = useState("");
  const [image, setImage] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [activeTab, setActiveTab] = useState("assigned");
  const [selectedSite, setSelectedSite] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      let pagination = {
        pg: page,
        limit: limit,
      };
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.post(
          "/api/v1/users/get-internal-users",
          pagination,
          {
            // headers: { authorization: `Bearer ${authtoken}` },
            withCredentials: true,
          },
        );
        let total = Math.ceil(
          Number(result.data.total) / Number(result.data.limit),
        );
        let next = result.data.hasNextPage;
        let prev = result.data.hasPrevPage;
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
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data?.error || error.response?.data?.message,
        });
      }
    };

    const fetchSites = async () => {
      dispatch({ type: "FETCH_SITES_REQUEST" });
      try {
        const result = await axios.get(`/api/v1/sites`, {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        });
        dispatch({
          type: "FETCH_SITES_SUCCESS",
          payload: result.data.data,
        });
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
  }, [limit, page, userInfo]);

  const openModal = (user) => {
    setSelectedUser(user);
    setFormData(user);
    setModalVisible(true);
    setImage(""); // Reset image state when opening modal
  };

  const openAssignedSitesModal = (user) => {
    setAssignedSites(user.assigned_sites);
    setSelectedUser(user);
    setassignedSitesModalVisible(true);
  };

  const openViewModal = (user) => {
    setSelectedItem(user);
    setViewModalVisible(true);
  };
  // Open Add User Modal

  const openAddModal = () => {
    setFormData({
      id: `U00${users.length + 1}`,
      username: "",
      email: "",
      role: "",
      department: "",
      phone: "",
      type: "Internal",
      profile_image: "",
      designation: "",
      employee_id: "",
      is_master_opex_site_technician: false,
      access_from_website: true,
    });
    setAddModalVisible(true);
    setImage(""); // Reset image state when opening modal
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAdd = async () => {
    try {
      dispatch({ type: "ADD_USER_REQUEST" });
      const newdata = { ...formData, profile_image: image };
      const response = await axios.post("/api/v1/users", newdata, {
        // headers: { authorization: `Bearer ${authtoken}` },
        withCredentials: true,
      });

      if (response.status === 201 || response.status === 200) {
        dispatch({
          type: "ADD_USER_SUCCESS",
          payload: response.data.data.user,
        });
        setAddModalVisible(false);
        setImage("");
      }
      toast.success(response.data.message);
    } catch (error) {
      console.error(error);
      const message = getApiErrorMessage(error, "Failed to create user");
      dispatch({ type: "ADD_USER_FAIL", payload: message });
      toast.error(message);
    }
  };

  const filteredUsers = users
    ? users.filter(
        (user) =>
          (user.username || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (user.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.role || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.department || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      )
    : [];

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

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
    if (!file) return;
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post(
        "/api/v1/image-upload/profile-image",
        bodyFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            // Authorization: `Bearer ${authtoken}`,
          },
          withCredentials: true,
        },
      );
      dispatch({ type: "UPLOAD_SUCCESS" });
      setImage(data.url);
      toast.success("Image uploaded successfully");
    } catch (err) {
      console.error(error);
    }
  };
  const handleUpdate = async () => {
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      const { createdAt, _id, last_activity, addedAt, ...filteredFormData } =
        formData;

      const newdata = image
        ? { ...filteredFormData, profile_image: image }
        : filteredFormData;

      const response = await axios.put(
        `/api/v1/users/${formData._id}`,
        newdata,
        {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        },
      );

      dispatch({
        type: "UPDATE_SUCCESS",
        payload: response.data.data,
      });

      toast.success(`${filteredFormData.username} user updated successfully!`);
      setModalVisible(false);
      setImage("");
    } catch (error) {
      const message = getApiErrorMessage(error, "Failed to update user");
      dispatch({
        type: "UPDATE_FAIL",
        payload: message,
      });
      toast.error(message);
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
          // headers: { authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        },
      );
      if (response.data.success) {
        dispatch({
          type: "ASSIGN_SITE_SUCCESS",
          payload: response.data.data,
        });
        setAssignedSites((prev) => [...prev, response.data.data]);
        setSelectedSite("");
        setActiveTab("assigned");
        toast.success(response.data.message);
      }
    } catch (err) {
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
        `Are you sure you want to remove site 🚨 ${sitedata.site_id}?`,
      )
    ) {
      return;
    }

    try {
      dispatch({ type: "REMOVE_SITE_REQUEST" });
      const response = await axios.post(
        "/api/v1/users/remove-assign-site",
        {
          userId: selectedUser._id,
          siteId: sitedata._id,
        },
        {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        },
      );

      if (response.data.success) {
        toast.success(response.data.message);
        dispatch({
          type: "REMOVE_SITE_SUCCESS",
          payload: sitedata._id,
        });
        setAssignedSites((prevSites) =>
          prevSites.filter((site) => site._id !== sitedata._id),
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

  return (
    <div className="">
      <div>
        <h2 className="text-center ">Internal Users</h2>
      </div>
      <div className="d-flex justify-content-end align-items-center mb-3">
        <div className="d-flex justify-content-between align-items-center">
          {/* External Users link - hidden for restricted roles */}
          <Link
            to={`/${adminroute}/external-users`}
            className="btn btn-sm btn-secondary m-1"
            aria-label="View external users"
          >
            External Users
          </Link>
          {/* Add User button - admin roles only */}
          {canEditUsers && (
            <CButton
              color="success"
              size="sm"
              className="text-white m-1"
              onClick={openAddModal}
              aria-label="Add new user"
            >
              + Add User
            </CButton>
          )}
        </div>
      </div>
      <CRow className="mb-3 justify-content-end">
        <CCol md={4} className="my-2">
          <CFormInput
            type="text"
            placeholder="Search by Name, Email, Role, or Department"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search users"
          />
        </CCol>
      </CRow>

      {error && <div className="alert alert-danger text-center">{error}</div>}

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
            <CTableHeaderCell>Last Login</CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>

        <CTableBody>
          {loading ? (
            <CTableRow>
              <CTableDataCell colSpan="9" className="text-center">
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : filteredUsers?.length > 0 ? (
            filteredUsers?.map((user, index) => (
              <CTableRow
                key={index}
                className={user.is_delete ? " table-danger" : ""}
              >
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>
                  <div className="d-flex align-items-center">
                    <img
                      src={user.profile_image || "/default-profile.png"}
                      alt={`Profile of ${user.username}`}
                      className="rounded-circle"
                      width="50"
                      height="50"
                      style={{ objectFit: "contain", cursor: "pointer" }}
                      onClick={() => openViewModal(user)}
                    />
                  </div>
                </CTableDataCell>
                <CTableDataCell>{user.username}</CTableDataCell>
                <CTableDataCell>{user.email}</CTableDataCell>
                <CTableDataCell style={{ minWidth: "120px" }}>
                  {user.role}
                </CTableDataCell>
                <CTableDataCell>{user.department}</CTableDataCell>
                <CTableDataCell style={{ minWidth: "120px" }}>
                  {user.phone || "N/A"}
                </CTableDataCell>
                <CTableDataCell style={{ minWidth: "160px" }}>
                  {user.last_login
                    ? new Date(user.last_login)
                        .toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })
                        .replace(
                          /(\d{2}:\d{2}\s[apAP][mM]) (\d{2})\/(\d{2})\/(\d{4})/,
                          (_, time, day, month, year) =>
                            `${time}, ${year}-${month}-${day}`,
                        )
                    : ""}
                </CTableDataCell>
                <CTableDataCell style={{ minWidth: "260px" }}>
                  <CButton
                    color="secondary"
                    size="sm"
                    className="m-1"
                    onClick={() => openAssignedSitesModal(user)}
                    aria-label={`View assigned sites for ${user.username}`}
                  >
                    View Assigned Sites
                  </CButton>
                  {/* Update button - admin roles only */}
                  {canEditUsers && (
                    <CButton
                      color="success"
                      size="sm"
                      className="m-1"
                      onClick={() => openModal(user)}
                      aria-label={`Edit user ${user.username}`}
                    >
                      Update
                    </CButton>
                  )}
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="9" className="text-center text-danger">
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
        limit={limit}
        handleLimitChange={setLimit}
      />

      {/* Add User Modal */}
      <CModal
        size="lg"
        scrollable
        backdrop="static"
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        aria-labelledby="addUserModalTitle"
      >
        <CModalHeader closeButton={false}>
          <CModalTitle id="addUserModalTitle">Add New User</CModalTitle>
          <button
            type="button"
            className="border-0 ms-auto py-0 px-1"
            onClick={() => setAddModalVisible(false)}
            style={{ background: "none" }}
            aria-label="Close"
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>
        <CModalBody>
          <CFormLabel htmlFor="username">Username</CFormLabel>
          <CFormInput
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <CFormLabel htmlFor="email">Email</CFormLabel>
          <CFormInput
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <CFormLabel htmlFor="email">employee ID</CFormLabel>
          <CFormInput
            id="employee_id"
            type="text"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            required
          />
          <CFormLabel htmlFor="role">Role</CFormLabel>
          <CFormSelect
            id="role"
            name="role"
            onChange={handleChange}
            value={formData.role}
            required
          >
            <option value="">Select Role</option>
            {roles?.length > 0 &&
              roles.map((role, index) => (
                <option key={index} value={role.role}>
                  {role.role}
                </option>
              ))}
          </CFormSelect>
          <CFormLabel htmlFor="department">Department</CFormLabel>
          <CFormSelect
            id="department"
            name="department"
            onChange={handleChange}
            value={formData.department}
            required
          >
            <option value="">Select Department</option>
            {departments?.length > 0 &&
              departments.map((dep, index) => (
                <option key={index} value={dep.department}>
                  {dep.department}
                </option>
              ))}
          </CFormSelect>
          <CFormLabel htmlFor="phone">Phone</CFormLabel>
          <CFormInput
            id="phone"
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <CFormLabel htmlFor="designation">Designation</CFormLabel>
          <CFormInput
            id="designation"
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
          />
          <CFormLabel htmlFor="password">Password</CFormLabel>
          <CFormInput
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <CFormLabel htmlFor="profile_image">Profile Image</CFormLabel>
          <CFormInput
            id="profile_image"
            type="file"
            name="profile_image"
            accept="image/*"
            onChange={handleFileChange}
          />
          <CFormLabel className="my-2">
            Master Opex Site Technician{" "}
            <span className="text-muted">
              (This user have access to update daily dpr of opex acitivty)
            </span>
          </CFormLabel>
          <br />
          <CFormCheck
            id="is_master_opex_site_technician"
            name="is_master_opex_site_technician"
            checked={formData.is_master_opex_site_technician || false}
            onChange={handleChange}
          />{" "}
          {(formData.role === "Site Technician" ||
            formData.role === "Client Site Technician" ||
            formData.role === "Opex Site Technician") && (
            <>
              <br />
              <CFormLabel className="my-2">
                Access From Website{" "}
                <span className="text-muted">
                  (If unchecked, technician can only use the mobile app)
                </span>
              </CFormLabel>
              <br />
              <CFormCheck
                id="access_from_website"
                name="access_from_website"
                checked={formData.access_from_website !== false}
                onChange={handleChange}
              />
            </>
          )}
          {loadingUpload ? (
            <div className="mt-2 d-flex justify-content-center">
              <LoadingSpinner />
            </div>
          ) : image ? (
            <div className="my-2 position-relative">
              <img
                className="my-2 border rounded"
                src={image}
                alt="Profile preview"
                width="100"
                height="100"
                style={{ objectFit: "contain" }}
              />
              <button
                className="position-absolute top-11 end-5 bg-danger border-0 rounded-circle "
                onClick={() => setImage("")}
                aria-label="Remove image"
              >
                <CIcon icon={cilX} />
              </button>
            </div>
          ) : null}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            size="sm"
            onClick={() => {
              setAddModalVisible(false);
              setImage("");
            }}
          >
            Cancel
          </CButton>
          <CButton
            color="success"
            size="sm"
            className="text-white"
            onClick={handleAdd}
            disabled={
              userAddloading ||
              !formData.username ||
              !formData.email ||
              !formData.role ||
              !formData.department ||
              !formData.password
            }
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

      {/* Update User Modal */}
      <CModal
        size="lg"
        scrollable
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        backdrop="static"
        aria-labelledby="updateUserModalTitle"
      >
        <CModalHeader closeButton={false}>
          <CModalTitle id="updateUserModalTitle">
            Update User - {formData.username}
          </CModalTitle>
          <button
            type="button"
            className="border-0 ms-auto py-0 px-1"
            onClick={() => setModalVisible(false)}
            style={{ background: "none" }}
            aria-label="Close"
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>
        <CModalBody>
          <CFormLabel htmlFor="update-username">Username</CFormLabel>
          <CFormInput
            id="update-username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <CFormLabel htmlFor="update-email">Email</CFormLabel>
          <CFormInput
            id="update-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <CFormLabel htmlFor="update-employee-id">Employee ID</CFormLabel>
          <CFormInput
            id="update-employee-id"
            type="text"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
          />
          <CFormLabel htmlFor="update-role">Role</CFormLabel>
          <CFormSelect
            id="update-role"
            name="role"
            onChange={handleChange}
            value={formData.role}
          >
            <option value="">Select Role</option>
            {roles?.length > 0 &&
              roles.map((role, index) => (
                <option key={index} value={role.role}>
                  {role.role}
                </option>
              ))}
          </CFormSelect>
          <CFormLabel htmlFor="update-department">Department</CFormLabel>
          <CFormSelect
            id="update-department"
            name="department"
            onChange={handleChange}
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
          <CFormLabel htmlFor="update-phone">Phone</CFormLabel>
          <CFormInput
            id="update-phone"
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <CFormLabel htmlFor="update-designation">Designation</CFormLabel>
          <CFormInput
            id="update-designation"
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
          />
          <br />
          <CFormLabel>
            Robot Command Access
            <span className="text-muted ms-2">
              (If it is un-checked then user can't Send command.)
            </span>
          </CFormLabel>
          <br />
          <CFormCheck
            id="robot_command_access"
            name="robot_command_access"
            checked={formData.robot_command_access || false}
            onChange={handleChange}
          />
          {(formData.role === "Site Technician" ||
            formData.role === "Client Site Technician" ||
            formData.role === "Opex Site Technician") && (
            <>
              <br />
              <CFormLabel className="my-2">
                Access From Website
                <span className="text-muted ms-2">
                  (If unchecked, technician can only use the mobile app)
                </span>
              </CFormLabel>
              <br />
              <CFormCheck
                id="update_access_from_website"
                name="access_from_website"
                checked={formData.access_from_website !== false}
                onChange={handleChange}
              />
            </>
          )}
          <br />
          <hr />
          <CFormLabel>
            User Active Status
            <span className="text-muted ms-2">
              (If it is checked then user can't Login.)
            </span>
          </CFormLabel>
          <br />
          <CFormCheck
            id="is_delete"
            name="is_delete"
            checked={formData.is_delete || false}
            onChange={handleChange}
          />
          <br />
          <CFormLabel htmlFor="update-profile-image">Image</CFormLabel>
          <CFormInput
            id="update-profile-image"
            type="file"
            name="profile_image"
            accept="image/*"
            onChange={handleFileChange}
          />
          {loadingUpload ? (
            <div className="mt-2 d-flex justify-content-center">
              <LoadingSpinner />
            </div>
          ) : image ? (
            <div className="my-2 position-relative">
              <img
                className="my-2 border rounded"
                src={image}
                alt="Profile preview"
                width="100"
                height="100"
                style={{ objectFit: "contain" }}
              />
              <button
                className="position-absolute top-11 end-5 bg-danger border-0 rounded-circle"
                onClick={() => setImage("")}
                aria-label="Remove image"
              >
                <CIcon icon={cilX} />
              </button>
            </div>
          ) : formData.profile_image ? (
            <div className="my-2 position-relative">
              <img
                className="my-2 border rounded"
                src={formData.profile_image}
                alt="Current profile"
                width="100"
                height="100"
                style={{ objectFit: "contain" }}
              />
              <button
                className="position-absolute top-11 end-5 bg-danger border-0 rounded-circle"
                onClick={() => setFormData({ ...formData, profile_image: "" })}
                aria-label="Remove image"
              >
                <CIcon icon={cilX} />
              </button>
            </div>
          ) : null}
          <CFormLabel className="my-2">
            Master Opex Site Technician{" "}
            <span className="text-muted">
              (This user have access to update daily dpr of opex acitivty)
            </span>
          </CFormLabel>
          <br />
          <CFormCheck
            id="is_master_opex_site_technician"
            name="is_master_opex_site_technician"
            checked={formData.is_master_opex_site_technician || false}
            onChange={handleChange}
          />{" "}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            size="sm"
            onClick={() => {
              setModalVisible(false);
              setImage("");
            }}
          >
            Cancel
          </CButton>
          <CButton
            color="primary"
            className="btn-sm"
            onClick={handleUpdate}
            disabled={updatingUserLoading}
          >
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

      {/* View User Modal */}
      <CModal
        scrollable
        visible={viewModalVisible}
        size="xl"
        onClose={() => setViewModalVisible(false)}
        aria-labelledby="viewUserModalTitle"
      >
        {selectedItem && (
          <>
            <CModalHeader closeButton={false}>
              <CModalTitle id="viewUserModalTitle">
                View User Details:{" "}
                <CBadge className="badge bg-primary">
                  {selectedItem.username}
                </CBadge>
              </CModalTitle>
              <button
                type="button"
                className=" border-0 ms-auto py-0 px-1"
                onClick={() => setViewModalVisible(false)}
                style={{ background: "none" }}
              >
                <CIcon icon={cilX} size="lg" />
              </button>
            </CModalHeader>
            <CModalBody>
              <CTable bordered hover responsive>
                <CTableBody>
                  <CTableRow>
                    <CTableHeaderCell>Username</CTableHeaderCell>
                    <CTableDataCell>{selectedItem.username}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Email</CTableHeaderCell>
                    <CTableDataCell>{selectedItem.email}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Employee ID</CTableHeaderCell>
                    <CTableDataCell>{selectedItem.employee_id}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Phone</CTableHeaderCell>
                    <CTableDataCell>
                      {selectedItem.phone || "N/A"}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Role</CTableHeaderCell>
                    <CTableDataCell>{selectedItem.role}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Department</CTableHeaderCell>
                    <CTableDataCell>{selectedItem.department}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Designation</CTableHeaderCell>
                    <CTableDataCell>
                      {selectedItem.designation || "N/A"}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Location</CTableHeaderCell>
                    <CTableDataCell>
                      {selectedItem.location || "N/A"}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Type</CTableHeaderCell>
                    <CTableDataCell>{selectedItem.type}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Employee ID</CTableHeaderCell>
                    <CTableDataCell>
                      {selectedItem.employee_id || "N/A"}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Profile Image</CTableHeaderCell>
                    <CTableDataCell>
                      <img
                        src={
                          selectedItem.profile_image || "/default-profile.png"
                        }
                        alt={`Profile of ${selectedItem.username}`}
                        width="100"
                        height="100"
                        style={{ objectFit: "contain", borderRadius: "8px" }}
                      />
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
              <LastActivity lastactivity={selectedItem.last_activity} />
            </CModalBody>
            <CModalFooter>
              <CButton
                color="secondary"
                onClick={() => setViewModalVisible(false)}
              >
                Close
              </CButton>
            </CModalFooter>
          </>
        )}
      </CModal>

      {/* Assigned Sites Modal */}
      <CModal
        size="lg"
        scrollable
        visible={assignedSitesModalVisible}
        onClose={() => setassignedSitesModalVisible(false)}
        backdrop="static"
        aria-labelledby="assignedSitesModalTitle"
      >
        <CModalHeader closeButton={false}>
          <CModalTitle id="assignedSitesModalTitle">
            Assigned Sites of &nbsp;:&nbsp;
            <CBadge color="primary">
              {selectedUser ? selectedUser.username : ""}
            </CBadge>
          </CModalTitle>
          <button
            type="button"
            className="border-0 ms-auto py-0 px-1"
            onClick={() => setassignedSitesModalVisible(false)}
            style={{ background: "none" }}
            aria-label="Close"
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>

        <CModalBody>
          <CTabs activeItemKey={activeTab} onActiveItemChange={setActiveTab}>
            <CTabList variant="tabs">
              <CTab itemKey="assigned">Assigned Sites</CTab>
              <CTab itemKey="assign">Assign New Site</CTab>
            </CTabList>

            <CTabContent>
              <CTabPanel className="p-3" itemKey="assigned">
                <CTable bordered hover responsive className="text-center mt-3">
                  <CTableHead color="secondary">
                    <CTableRow>
                      <CTableHeaderCell>#</CTableHeaderCell>
                      <CTableHeaderCell>Site ID</CTableHeaderCell>
                      <CTableHeaderCell>Site Name</CTableHeaderCell>

                      <CTableHeaderCell style={{ minWidth: "300px" }}>
                        Action
                      </CTableHeaderCell>
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
                              disabled={assignsiteloading}
                              aria-label={`Remove site ${site.site_id}`}
                            >
                              <CIcon className="fw-bolder" icon={cilTrash} />
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

              <CTabPanel className="p-3" itemKey="assign">
                <CForm className="mt-3">
                  <div className="mb-3">
                    <CFormLabel htmlFor="site-select">Select Site</CFormLabel>
                    <CFormSelect
                      id="site-select"
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
                    onClick={handleAssignSite}
                    disabled={!selectedSite || assignsiteloading}
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
    </div>
  );
};

export default UsersDashboard;
