import React, { useEffect, useReducer, useState } from "react";
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
  CTooltip,
} from "@coreui/react";
// import { sites, lora_configuration } from "../../../data"; // Ensure correct path
import "../master-admin.css";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import axios from "axios";
import LoadingSpinner from "../../../components/LoadingSpinner";
import LastActivity from "../../../components/LastActivity";
import { formatDistanceToNow } from "date-fns";
import { useLocation, useNavigate } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
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

    case "FETCH_LORACONFIG_REQUEST":
      return { ...state, loadingloraconfig: true, error: "" };
    case "FETCH_LORACONFIG_SUCCESS":
      return {
        ...state,
        loadingloraconfig: false,
        lora_configuration: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_LORACONFIG_FAIL":
      return { ...state, loadingloraconfig: false, error: action.payload };

    case "ADD_LORA_REQUEST":
      return { ...state, addloadingloraconfig: true, addloraerror: "" };
    case "ADD_LORA_SUCCESS":
      return {
        ...state,
        addloadingloraconfig: false,
        lora_configuration: action.payload,
      };
    case "ADD_LORA_FAIL":
      return {
        ...state,
        addloadingloraconfig: false,
        addloraerror: action.payload,
      };

    case "UPDATE_LORA_REQUEST":
      return { ...state, updatingLora: true, updateError: "" };

    case "UPDATE_LORA_SUCCESS":
      return {
        ...state,
        updatingLora: false,
        lora_configuration: state.lora_configuration.map((config) =>
          config.deveui === action.payload.deveui ? action.payload : config
        ),
      };

    case "UPDATE_LORA_FAIL":
      return { ...state, updatingLora: false, updateError: action.payload };
    default:
      return state;
  }
};
const LoraConfiguration = () => {
  const [
    {
      error,
      addloraerror,
      updatingLora,
      updateError,
      sites,
      lora_configuration,
      loadingloraconfig,
      addloadingloraconfig,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
    dispatch,
  ] = useReducer(reducer, {
    sites: [],
    lora_configuration: [],
    loadingSites: false,
    loadingloraconfig: false,
    addloadingloraconfig: false,
    updatingLora: false,
    error: "",
    updateError: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const authtoken = useSelector((state) => state.authtoken);

  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);

  const [addmodalVisible, setAddModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [deveuiObj, setDeveuiObj] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const page = parseInt(queryParams.get("pg")) || 1;
  const limit = parseInt(queryParams.get("limit")) || 10;

  // console.log(formData);
  useEffect(() => {
    const fetchloraconfigurations = async () => {
      dispatch({ type: "FETCH_LORACONFIG_REQUEST" });
      try {
        const result = await axios.get(
          `/api/v1/loraconfigurations?pg=${page}&limit=${limit}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );

        let total = Math.ceil(
          Number(result.data.total) / Number(result.data.limit)
        );
        let next = result.data.hasNextPage;
        let prev = result.data.hasPrevPage;

        dispatch({
          type: "FETCH_LORACONFIG_SUCCESS",
          payload: {
            data: result.data.data,
            totalPages: total,
            hasNextPage: next,
            hasPrevPage: prev,
          },
        });
        // console.log(result.data.data);
      } catch (error) {
        dispatch({
          type: "FETCH_LORACONFIG_FAIL",
          payload: "Failed to fetch loraconfigurations",
        });
        toast.error("Failed to fetch loraconfigurations");
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
        // console.log(result.data.data);
      } catch (error) {
        dispatch({
          type: "FETCH_SITES_FAIL",
          payload: "Failed to fetch sites",
        });
        toast.error("Failed to fetch sites");
      }
    };

    fetchloraconfigurations();
    fetchSites();
  }, [authtoken, limit, page]);

  // Open Modal and Set Selected Item Data
  const openModal = (item) => {
    setSelectedItem(item);
    setFormData(item);
    setModalVisible(true);
  };
  // Open Modal and Set Selected Item Data
  const openAddModal = () => {
    setAddModalVisible(true);
  };
  const openViewModal = (item) => {
    setSelectedItem(item);
    console.log(item);

    setViewModalVisible(true);
  };

  const handleDeveuiChange = (e) => {
    setDeveuiObj({ ...deveuiObj, deveui: e.target.value });
  };

  const handleAdd = async () => {
    if (deveuiObj.deveui.length > 23) {
      toast.error("Please enter a valid Deveui!");
      return;
    }
    try {
      dispatch({ type: "ADD_LORA_REQUEST" });
      const response = await axios.post(
        "/api/v1/loraconfigurations",
        deveuiObj,
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
      );
      // console.log(response.data.message);

      toast.success(response.data.message);
      // Update robots state with new data
      dispatch({
        type: "ADD_LORA_SUCCESS",
        payload: [...lora_configuration, response.data.data], // Append instead of replace
      });

      setDeveuiObj({});

      setAddModalVisible(false);
    } catch (error) {
      toast.error(error.response.data.error);
      dispatch({
        type: "ADD_LORA_FAIL",
        payload: error.response.data.error,
      });
      setAddModalVisible(false);
    }
  };

  // Handle Input Change in Form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      dispatch({ type: "UPDATE_LORA_REQUEST" });
      const { createdAt, _id, last_activity, addedAt, ...filteredFormData } =
        formData;
      const response = await axios.put(
        `/api/v1/loraconfigurations/${formData._id}`,
        filteredFormData,
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
      );

      dispatch({
        type: "UPDATE_LORA_SUCCESS",
        payload: response.data.data,
      });

      toast.success(
        `${filteredFormData.serial} Lora Configuration updated successfully!`
      );
      setModalVisible(false);
    } catch (error) {
      dispatch({
        type: "UPDATE_LORA_FAIL",
        payload: error.response?.data?.message || "Failed to update data",
      });
      toast.error(error.response?.data?.message);
    }
  };

  // Filter data based on search term
  const filteredData = lora_configuration.filter(
    (item) =>
      item.robot_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.deveui.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.site_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const uniqueSitenames = sites.filter(
    (value, index, self) =>
      index === self.findIndex((t) => t.site_id === value.site_id)
  );

  // console.log(uniqueSitenames);
  const handlePageChange = (newPage) => {
    navigate(`?pg=${newPage}&limit=${limit}`);
  };
  return (
    <div className="">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="text-center">Lora Configuration</h2>
        <CButton
          color="success"
          size="sm"
          className="text-white"
          onClick={openAddModal}
        >
          + Add New
        </CButton>
      </div>
      {/* Add Modal */}
      <CModal
        visible={addmodalVisible}
        onClose={() => setAddModalVisible(false)}
        backdrop="static"
      >
        <CModalHeader>
          <CModalTitle>Add New Lora </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol md={12}>
              <CFormLabel>Deveui</CFormLabel>
              <CFormInput
                type="text"
                name="deveui"
                value={deveuiObj.deveui}
                onChange={handleDeveuiChange}
                placeholder="ENTER DEVEUI"
                className="mb-3"
              />
            </CCol>
            {/* <CCol md={12}>
              <CFormLabel>Site ID (Default: taypro_office)</CFormLabel>
              <CFormInput
                type="text"
                value="taypro_office"
                disabled
                className="mb-3"
              />
            </CCol> */}
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            size="sm"
            onClick={() => setAddModalVisible(false)}
          >
            Cancel
          </CButton>
          <CButton color="primary" size="sm" onClick={handleAdd}>
            {addloadingloraconfig ? (
              <>
                Adding..
                <LoadingSpinner />
              </>
            ) : (
              "Add"
            )}
          </CButton>
        </CModalFooter>
      </CModal>
      <CRow className="justify-content-end">
        <CCol md={4} lg={3}>
          <CFormInput
            type="text"
            placeholder="Search by Robot No, Deveui, or Site ID"
            className="mb-3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
      </CRow>
      <CTable bordered hover responsive className="text-center table-container">
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell className="sticky-column">
              Lora Sr
            </CTableHeaderCell>
            <CTableHeaderCell>Robot No</CTableHeaderCell>
            <CTableHeaderCell>Deveui</CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "190px" }}>
              Formatted Deveui
            </CTableHeaderCell>
            <CTableHeaderCell>Site ID</CTableHeaderCell>
            <CTableHeaderCell>Added By</CTableHeaderCell>
            <CTableHeaderCell>Added At</CTableHeaderCell>
            <CTableHeaderCell>Last Update</CTableHeaderCell>
            <CTableHeaderCell>Last Update By</CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loadingloraconfig ? (
            <CTableRow>
              <CTableDataCell colSpan="10" className="text-center fw-bold">
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : error ? (
            <CTableRow>
              <CTableDataCell
                colSpan="10"
                className="text-center text-danger fw-bold"
              >
                {error}
              </CTableDataCell>
            </CTableRow>
          ) : filteredData.length === 0 ? (
            <CTableRow>
              <CTableDataCell colSpan="10" className="text-center text-danger">
                No Lora Found
              </CTableDataCell>
            </CTableRow>
          ) : (
            filteredData
              .slice()
              .reverse()
              .map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell className="sticky-column">
                    {item.serial}
                  </CTableDataCell>
                  <CTableDataCell style={{ minWidth: "150px" }}>
                    {item.robot_no}
                  </CTableDataCell>
                  <CTableDataCell style={{ minWidth: "150px" }}>
                    {item.deveui}
                  </CTableDataCell>
                  <CTableDataCell style={{ minWidth: "150px" }}>
                    {item.formatted_deveui}
                  </CTableDataCell>
                  <CTableDataCell style={{ minWidth: "150px" }}>
                    {item.site_id}
                  </CTableDataCell>
                  <CTableDataCell style={{ minWidth: "170px" }}>
                    {item.added_by}
                  </CTableDataCell>
                  <CTableDataCell style={{ minWidth: "170px" }}>
                    <CTooltip
                      content={new Date(item.addedAt).toLocaleString()}
                      placement="top"
                    >
                      <span>
                        {formatDistanceToNow(new Date(item.addedAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </CTooltip>
                  </CTableDataCell>

                  <CTableDataCell style={{ minWidth: "170px" }}>
                    {item.lastUpdated_by === null ? (
                      <span className="badge bg-danger">N/A</span>
                    ) : (
                      <span className="badge bg-success">
                        {item.lastUpdated_by}
                      </span>
                    )}
                  </CTableDataCell>
                  <CTableDataCell style={{ minWidth: "170px" }}>
                    {item.lastUpdateAt === null ? (
                      <span className="badge bg-danger">N/A</span>
                    ) : (
                      <span className="badge bg-success">
                        {item.lastUpdateAt}
                      </span>
                    )}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="secondary"
                      className="btn-sm m-1"
                      onClick={() => openViewModal(item)}
                    >
                      View
                    </CButton>
                    <CButton
                      color="primary"
                      className="btn-sm m-1"
                      onClick={() => openModal(item)}
                    >
                      Update
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))
          )}
        </CTableBody>
      </CTable>
      <CRow className="mt-3">
        <CCol className="d-flex justify-content-end">
          <CButton
            color="secondary"
            disabled={!hasPrevPage}
            onClick={() => handlePageChange(page - 1)}
            className="mx-1"
            size="sm"
          >
            Prev
          </CButton>

          {Array.from({ length: totalPages }, (_, i) => (
            <CButton
              key={i + 1}
              color={page === i + 1 ? "primary" : ""}
              onClick={() => handlePageChange(i + 1)}
              className="mx-1"
            >
              {i + 1}
            </CButton>
          ))}

          <CButton
            color="secondary"
            disabled={!hasNextPage}
            onClick={() => handlePageChange(page + 1)}
            className="mx-1"
            size="sm"
          >
            Next
          </CButton>
        </CCol>
      </CRow>
      {/* view Modal */}
      <CModal
        visible={viewModalVisible}
        size="xl"
        onClose={() => setViewModalVisible(false)}
      >
        {selectedItem && (
          <>
            <CModalHeader>
              <CModalTitle>
                View Lora Configuration :{" "}
                <CBadge className="badge bg-danger">
                  {selectedItem.serial}
                </CBadge>
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CTable bordered hover responsive>
                <CTableBody>
                  <CTableRow>
                    <CTableHeaderCell>Serial</CTableHeaderCell>
                    <CTableDataCell>{selectedItem.serial}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Deveui</CTableHeaderCell>
                    <CTableDataCell>{selectedItem.deveui}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Formatted Deveui</CTableHeaderCell>
                    <CTableDataCell>
                      {selectedItem.formatted_deveui}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Robot No</CTableHeaderCell>
                    <CTableDataCell>{selectedItem.robot_no}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Site ID</CTableHeaderCell>
                    <CTableDataCell>
                      {selectedItem.site_id || "N/A"}
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

      {/* Update Modal */}
      <CModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        backdrop="static"
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>
            Update Lora{" "}
            <b className="px-3 badge bg-danger">{formData.serial}</b>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedItem && (
            <div>
              <CRow className="">
                <CCol md={6}>
                  <CFormLabel>Robot No</CFormLabel>
                  <CFormInput
                    type="text"
                    name="robot_no"
                    value={formData.robot_no}
                    onChange={handleChange}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Site ID</CFormLabel>
                  {uniqueSitenames.length === 0 ? (
                    <p className="text-danger">No sites Found</p>
                  ) : (
                    <CFormSelect
                      size="md"
                      className="mb-3"
                      aria-label="Large select example"
                      name="site_id"
                      value={formData.site_id}
                      onChange={handleChange}
                    >
                      <option value="">Select site</option>
                      {uniqueSitenames.map((item, index) => (
                        <option
                          key={index}
                          value={item.site_id}
                          selected={formData.site_id === item.site_id}
                        >
                          {item.site_id}
                        </option>
                      ))}
                    </CFormSelect>
                  )}
                </CCol>
              </CRow>

              <CRow className="mt-3">
                {" "}
                <CCol md={6}>
                  <CFormLabel>Deveui</CFormLabel>
                  <CFormInput
                    disabled
                    type="text"
                    name="deveui"
                    value={formData.deveui}
                    onChange={handleChange}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Formatted Deveui</CFormLabel>
                  <CFormInput
                    disabled
                    type="text"
                    name="formatted_deveui"
                    value={formData.formatted_deveui}
                    onChange={handleChange}
                  />
                </CCol>
              </CRow>

              {/* <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel>Added By</CFormLabel>
                  <CFormInput
                    disabled
                    type="text"
                    name="added_by"
                    value={formData.added_by}
                    onChange={handleChange}
                  />
                </CCol>{" "}
                <CCol md={6}>
                  <CFormLabel>Added At</CFormLabel>
                  <CFormInput
                    disabled
                    type="text"
                    name="addedAt"
                    value={formData.addedAt}
                    onChange={handleChange}
                  />
                </CCol>
              </CRow> */}

              {/* <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel>Last Updated by</CFormLabel>
                  <CFormInput
                    disabled
                    type="text"
                    name="lastUpdateBy"
                    value={
                      formData.lastUpdateBy === null
                        ? "N/A"
                        : formData.lastUpdateBy
                    }
                    onChange={handleChange}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Last Updated At</CFormLabel>
                  <CFormInput
                    disabled
                    type="text"
                    name="lastUpdateAt"
                    value={
                      formData.lastUpdateAt === null
                        ? "N/A"
                        : formData.lastUpdateAt
                    }
                    onChange={handleChange}
                  />
                </CCol>
              </CRow> */}
            </div>
          )}
        </CModalBody>

        <CModalFooter>
          <CButton
            color="secondary"
            className="btn-sm"
            onClick={() => setModalVisible(false)}
          >
            Cancel
          </CButton>
          <CButton color="primary" className="btn-sm" onClick={handleUpdate}>
            {updatingLora ? (
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
    </div>
  );
};

export default LoraConfiguration;
