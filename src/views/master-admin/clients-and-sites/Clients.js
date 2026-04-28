import React, { useEffect, useReducer, useState } from "react";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CRow,
  CCol,
  CForm,
  CBadge,
} from "@coreui/react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import PaginateInput from "../../../components/PaginateInput";
import LoadingSpinner from "../../../components/LoadingSpinner";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };

    case "FETCH_SUCCESS":
      return {
        ...state,
        clients: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
        loading: false,
      };

    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "FETCH_CLIENT_REQUEST":
      return { ...state, fetchClientloading: true };

    case "FETCH_CLIENT_SUCCESS":
      return {
        ...state,
        client: action.payload,
        fetchClientloading: false,
      };

    case "FETCH_CLIENT_FAIL":
      return {
        ...state,
        fetchClientloading: false,
        error: action.payload,
      };
    case "UPDATE_CLIENT_REQUEST":
      return { ...state, updateClientLoading: true };

    case "UPDATE_CLIENT_SUCCESS":
      return {
        ...state,
        clients: state.clients.map((client) =>
          client._id === action.payload._id ? action.payload : client,
        ),
        updateClientLoading: false,
      };

    case "UPDATE_CLIENT_FAIL":
      return {
        ...state,
        updateClientLoading: false,
        error: action.payload,
      };

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

    case "SUBMIT_REQUEST":
      return { ...state, submitLoading: true, success: false };
    case "SUBMIT_SUCCESS":
      return { ...state, submitLoading: false, success: true };

    case "SUBMIT_FAIL":
      return {
        ...state,
        submitLoading: false,
        error: action.payload,
        success: false,
      };
    default:
      return state;
  }
};

const Clients = () => {
  const [
    {
      loading,
      error,
      clients,
      submitLoading,
      loadingUpload,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
    dispatch,
  ] = useReducer(reducer, {
    clients: [],
    client: {},
    loading: true,
    fetchClientloading: true,
    updateClientLoading: true,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    errorUpload: "",
    loadingUpload: false,
    hasPrevPage: false,
    submitLoading: false,
    success: false,
  });
  // const authtoken = useSelector((state) => state.authtoken);

  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [clientLogo, setClientLogo] = useState("");
  const [formData, setFormData] = useState({
    client_name: "",
    client_id: "",
    logo: "",
  });
  const [pageInput, setPageInput] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    let pagination = {
      pg: page,
      limit: limit,
    };
    const fetchClients = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const response = await axios.post(
          `/api/v1/clients/get-clients`,
          pagination,
          {
            // headers: { Authorization: `Bearer ${authtoken}` },
            withCredentials: true,
          },
        );
        let total = Math.ceil(
          Number(response.data.total) / Number(response.data.limit),
        );
        let next = response.data.hasNextPage;
        let prev = response.data.hasPrevPage;
        let result = response.data.data;

        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            data: result,
            totalPages: total,
            hasNextPage: next,
            hasPrevPage: prev,
          },
        });
      } catch (error) {
        console.error("Error fetching Clients:", error);
        dispatch({
          type: "FETCH_FAIL",
          payload: error,
        });
      }
    };

    fetchClients();
  }, [limit, page]);

  // Function to generate client_id from client_name
  const generateClientID = (name) => {
    return name
      .toLowerCase() // Convert to lowercase
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .replace(/[^\w_]/g, ""); // Remove special characters
  };

  // Open modal for fetching client
  const openUpdateModal = async (a) => {
    setModalVisible(true);
    setSelectedItem(a);
  };

  // Open "Add Client" modal
  const openAddClientModal = () => {
    setFormData({ client_name: "", client_id: "", logo: "" });
    setAddModalVisible(true);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };

    // Generate `client_id` dynamically based on `client_name`
    if (name === "client_name") {
      newFormData.client_id = generateClientID(value);
    }
    setFormData(newFormData);

    // setSelectedItem(newFormData);
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    dispatch({ type: "SUBMIT_REQUEST" });
    const newdata = { ...formData, logo: clientLogo };
    try {
      await axios.post("/api/v1/clients", newdata, {
        // headers: { Authorization: `Bearer ${authtoken}` },
        withCredentials: true,
      });

      toast.success("Client Added Successfully");
      dispatch({ type: "SUBMIT_SUCCESS" });
      setAddModalVisible(false);

      setClientLogo("");
    } catch (error) {
      dispatch({
        type: "SUBMIT_FAIL",
        payload: error.response.data.error,
      });

      toast.error(error.response.data.error);
    }
  };

  // Handle update client
  const handleUpdate = async (client) => {
    try {
      dispatch({ type: "UPDATE_CLIENT_REQUEST" });
      const response = await axios.put(
        `/api/v1/clients/${client._id}`,
        formData,
        {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        },
      );

      // Update local state with the modified ticket
      dispatch({
        type: "UPDATE_CLIENT_SUCCESS",
        payload: response.data.data,
      });
      setModalVisible(false);
    } catch (error) {
      dispatch({ type: "UPDATE_CLIENT_FAIL", payload: error });
      console.error("Error Updating Client Data:", error);
    }
  };

  const filteredData = clients
    ? clients.filter(
        (item) =>
          item.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.client_id.toLowerCase().includes(searchTerm.toLowerCase()),
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

  //   const handleFileChange = async (event) => {
  //     const { files } = event.target;
  //     if (files.length === 0) return;

  //     const file = files[0];
  //     const formData = new FormData();
  //     formData.append("file", file);

  //     try {
  //       setUploading(true);

  //       const response = await axios.post(
  //         "/api/v1/image-upload/client-logo",
  //         formData,
  //         {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //             Authorization: `Bearer ${authtoken}`,
  //           },
  //         }
  //       );

  //       setClientLogo(response.data.url);
  //     } catch (error) {
  //       console.error("File upload error:", error);
  //     } finally {
  //       setUploading(false);
  //     }
  //   };
  //   const removeLogo = () => {
  //     setClientLogo(""); // Remove the uploaded image
  //   };

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
        },
      );
      dispatch({ type: "UPLOAD_SUCCESS" });

      setClientLogo(data.url);

      toast.success("Image uploaded successfully. click Update to apply it");
    } catch (err) {
      console.error(error);
    }
  };
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

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>All Clients</h2>
        {![
          "Master User",
          "Service Admin",
          "Project User",
          "Service User",
        ].includes(userInfo?.role) && (
          <CButton color="primary" size="sm" onClick={openAddClientModal}>
            Add New
          </CButton>
        )}
      </div>

      <CRow className="justify-content-end">
        <CCol md={4} lg={4}>
          <CFormInput
            type="text"
            placeholder="Search by Client Name or Client ID"
            className="mb-3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
      </CRow>

      {/* Clients Table */}
      <CTable
        bordered
        hover
        responsive
        className="text-center shadow-sm bg-important"
      >
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>Sr</CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "200px" }}>
              Client Name
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "200px" }}>
              Client ID
            </CTableHeaderCell>
            <CTableHeaderCell>Logo</CTableHeaderCell>
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
          ) : error ? (
            <CTableRow>{error}</CTableRow>
          ) : (
            filteredData.map((client, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{client.client_name}</CTableDataCell>
                <CTableDataCell>{client.client_id}</CTableDataCell>
                <CTableDataCell>
                  <img
                    src={client.logo}
                    alt="Client Logo"
                    className="img-thumbnail border-0"
                    width="100"
                    height="50"
                  />
                </CTableDataCell>
                <CTableDataCell>
                  <div className="d-flex justify-content-center align-items-center">
                    {" "}
                    <Link
                      className="m-1 btn btn-sm btn-primary"
                      style={{ minWidth: "200px" }}
                      color="primary"
                      size="sm"
                      to={`/${adminroute}/clients-dashboard/clients-data/${client.client_id}`}
                    >
                      View Assigned Sites
                    </Link>
                    {![
                      "Master User",
                      "Project User",
                      "Service User",
                      "Service Admin",
                    ].includes(userInfo?.role) && (
                      <CButton
                        className="m-1"
                        color="warning"
                        size="sm"
                        onClick={() => openUpdateModal(client)}
                      >
                        Update
                      </CButton>
                    )}
                  </div>
                </CTableDataCell>
              </CTableRow>
            ))
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
        handleLimitChange={setLimit} // New prop
      />

      {/* Add New Client Modal */}
      <CModal
        backdrop="static"
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>Add New Client</CModalTitle>
          <button
            type="button"
            className=" border-0 ms-auto py-0 px-1"
            onClick={() => setAddModalVisible(false)}
            style={{ background: "none" }}
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              type="text"
              name="client_name"
              value={formData.client_name}
              label="Client Name"
              onChange={handleChange}
              className="mb-3"
            />
            <CFormInput
              type="text"
              name="client_id"
              value={formData.client_id}
              label="Client ID (Auto-generated)"
              disabled
              className="mb-3"
            />

            <CFormInput
              type="file"
              name="logo"
              label="Upload Logo"
              onChange={handleFileChange}
              className="mb-3 file"
            />

            {loadingUpload ? (
              <div className="mt-2 d-flex justify-content-center">
                <LoadingSpinner />
              </div>
            ) : clientLogo ? (
              <div className="my-2">
                <img
                  src={clientLogo}
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
                ></CBadge>
              </div>
            ) : null}
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton
            size="sm"
            color="secondary"
            onClick={() => setAddModalVisible(false)}
          >
            Cancel
          </CButton>
          <CButton size="sm" color="primary" onClick={handleAddClient}>
            {submitLoading ? (
              <>
                Adding <LoadingSpinner />
              </>
            ) : (
              "Add"
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Update Modal */}
      <CModal
        backdrop="static"
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        {selectedItem && (
          <>
            <CModalHeader closeButton={false}>
              <CModalTitle>
                Update Client :{" "}
                <span className="badge bg-success">
                  {selectedItem.client_id}
                </span>
              </CModalTitle>
              <button
                type="button"
                className=" border-0 ms-auto py-0 px-1"
                onClick={() => setModalVisible(false)}
                style={{ background: "none" }}
              >
                <CIcon icon={cilX} size="lg" />
              </button>
            </CModalHeader>
            <CModalBody>
              <CForm>
                <CFormInput
                  type="text"
                  name="client_name"
                  value={selectedItem.client_name}
                  label="Client Name"
                  onChange={handleChange}
                  className="mb-3"
                />
                <CFormInput
                  type="text"
                  name="client_id"
                  value={selectedItem.client_id}
                  label="Client ID"
                  disabled
                  className="mb-3"
                />
                <img
                  src={selectedItem.logo}
                  alt="Client Logo"
                  className="img-thumbnail border-0"
                  width="100"
                  height="50"
                />
                <br />

                {loadingUpload ? (
                  <div className="mt-2 d-flex justify-content-center">
                    <LoadingSpinner />
                  </div>
                ) : clientLogo ? (
                  <div className="my-2">
                    <img
                      src={clientLogo}
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
                    ></CBadge>
                  </div>
                ) : null}
                <CFormInput
                  type="file"
                  name="logo"
                  label="Upload new Logo"
                  onChange={handleFileChange}
                  className="mb-3"
                />
              </CForm>
            </CModalBody>
            <CModalFooter>
              <CButton
                size="sm"
                color="secondary"
                onClick={() => setModalVisible(false)}
              >
                Cancel
              </CButton>
              <CButton
                size="sm"
                color="primary"
                onClick={() => handleUpdate(selectedItem)}
              >
                Save Changes
              </CButton>
            </CModalFooter>
          </>
        )}
      </CModal>
    </div>
  );
};

export default Clients;
