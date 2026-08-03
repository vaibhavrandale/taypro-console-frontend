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
  CAlert,
} from "@coreui/react";
import Select from "react-select";
import "../master-admin.css";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import axios from "axios";
import LoadingSpinner from "../../../components/LoadingSpinner";
import LastActivity from "../../../components/LastActivity";
import { formatDistanceToNow } from "date-fns";
import PaginateInput from "../../../components/PaginateInput";
import SiteSelect from "../../../components/SiteSelect";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";

const darkSelectStyles = {
  control: (provided) => ({
    ...provided,
    background: "#111c44",
    border: "none",
    borderRadius: "8px",
    minHeight: "38px",
    cursor: "pointer",
    boxShadow: "none",
  }),
  menu: (provided) => ({
    ...provided,
    background: "#16213e",
    borderRadius: "5px",
    overflow: "hidden",
    zIndex: 9999,
  }),
  menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
  menuList: (provided) => ({
    ...provided,
    padding: 0,
    background: "#16213e",
  }),
  option: (provided, state) => ({
    ...provided,
    background: state.isSelected
      ? "#00d4ff22"
      : state.isFocused
        ? "#1b2a52"
        : "#16213e",
    color: state.isSelected ? "#00d4ff" : "#ffffff",
    padding: 8,
    cursor: "pointer",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#ffffff",
    fontWeight: 500,
  }),
  input: (provided) => ({ ...provided, color: "#ffffff" }),
  placeholder: (provided) => ({ ...provided, color: "#94a3b8" }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: state.isFocused ? "#00d4ff" : "#94a3b8",
    "&:hover": { color: "#00d4ff" },
  }),
  clearIndicator: (provided) => ({
    ...provided,
    color: "#94a3b8",
    "&:hover": { color: "#ffffff" },
  }),
  indicatorSeparator: () => ({ display: "none" }),
  noOptionsMessage: (provided) => ({ ...provided, color: "#94a3b8" }),
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_LORACONFIG_REQUEST":
      return { ...state, loadingloraconfig: true, error: "" };
    case "FETCH_LORACONFIG_SUCCESS":
      return {
        ...state,
        loadingloraconfig: false,
        lora_configuration: action.payload.data,
        totalPages: action.payload.totalPages,
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
          config.deveui === action.payload.deveui ? action.payload : config,
        ),
      };

    case "UPDATE_LORA_FAIL":
      return { ...state, updatingLora: false, updateError: action.payload };

    case "FETCH_LINK_ROBOTS_REQUEST":
      return { ...state, loadingLinkRobots: true, linkRobotsError: "" };
    case "FETCH_LINK_ROBOTS_SUCCESS":
      return {
        ...state,
        loadingLinkRobots: false,
        linkRobots: action.payload,
      };
    case "FETCH_LINK_ROBOTS_FAIL":
      return {
        ...state,
        loadingLinkRobots: false,
        linkRobotsError: action.payload,
      };

    case "LINK_ROBOT_REQUEST":
      return {
        ...state,
        linkingRobot: true,
        linkResult: null,
        linkError: "",
      };
    case "LINK_ROBOT_SUCCESS":
      return {
        ...state,
        linkingRobot: false,
        linkResult: action.payload,
      };
    case "LINK_ROBOT_FAIL":
      return {
        ...state,
        linkingRobot: false,
        linkError: action.payload,
        linkResult: null,
      };

    case "LINK_ROBOT_RESET":
      return {
        ...state,
        linkingRobot: false,
        linkError: "",
        linkResult: null,
        linkRobots: [],
        linkRobotsError: "",
        activatingLinkedRobot: false,
        activateLinkedError: "",
        activateLinkedSuccess: "",
      };

    case "ACTIVATE_LINKED_ROBOT_REQUEST":
      return {
        ...state,
        activatingLinkedRobot: true,
        activateLinkedError: "",
        activateLinkedSuccess: "",
      };
    case "ACTIVATE_LINKED_ROBOT_SUCCESS":
      return {
        ...state,
        activatingLinkedRobot: false,
        activateLinkedSuccess: action.payload,
      };
    case "ACTIVATE_LINKED_ROBOT_FAIL":
      return {
        ...state,
        activatingLinkedRobot: false,
        activateLinkedError: action.payload,
      };

    default:
      return state;
  }
};
const LoraConfiguration = () => {
  const [
    {
      error,
      updatingLora,
      lora_configuration,
      loadingloraconfig,
      addloadingloraconfig,
      totalPages,
      hasNextPage,
      hasPrevPage,
      linkRobots,
      loadingLinkRobots,
      linkRobotsError,
      linkingRobot,
      linkResult,
      linkError,
      activatingLinkedRobot,
      activateLinkedError,
      activateLinkedSuccess,
    },
    dispatch,
  ] = useReducer(reducer, {
    lora_configuration: [],
    loadingloraconfig: false,
    addloadingloraconfig: false,
    updatingLora: false,
    error: "",
    updateError: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    linkRobots: [],
    loadingLinkRobots: false,
    linkRobotsError: "",
    linkingRobot: false,
    linkResult: null,
    linkError: "",
    activatingLinkedRobot: false,
    activateLinkedError: "",
    activateLinkedSuccess: "",
  });
  // const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);

  const [addmodalVisible, setAddModalVisible] = useState(false);
  const [linkModalVisible, setLinkModalVisible] = useState(false);
  const [linkLora, setLinkLora] = useState(null);
  const [selectedLinkRobot, setSelectedLinkRobot] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [deveuiObj, setDeveuiObj] = useState({});
  const [pageInput, setPageInput] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const fetchloraconfigurations = async () => {
    let pagination = {
      pg: page,
      limit: limit,
    };
    dispatch({ type: "FETCH_LORACONFIG_REQUEST" });
    try {
      const result = await axios.post(
        `/api/v1/loraconfigurations/get-loraconfigurations`,
        pagination,
        {
          withCredentials: true,
        },
      );

      let total = Math.ceil(
        Number(result.data.total) / Number(result.data.limit),
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
    } catch (error) {
      dispatch({
        type: "FETCH_LORACONFIG_FAIL",
        payload: error.response.data.error || error.response.data.message,
      });
      toast.error(error.response.data.error || error.response.data.message);
    }
  };

  useEffect(() => {
    fetchloraconfigurations();
  }, [limit, page]);

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

    setViewModalVisible(true);
  };

  const openLinkModal = async (item) => {
    setLinkLora(item);
    setSelectedLinkRobot(null);
    setLinkModalVisible(true);
    dispatch({ type: "LINK_ROBOT_RESET" });
    dispatch({ type: "FETCH_LINK_ROBOTS_REQUEST" });
    try {
      const result = await axios.get(
        `/api/v1/robots/get-robots/robots-without-pg`,
        { withCredentials: true },
      );
      const robots = (result.data.data || []).filter(
        (robot) =>
          robot.robot_type === "Automatic" &&
          (robot.lora_no == null || robot.lora_no === "") &&
          robot.robot_no &&
          robot.deveui &&
          String(robot.robot_no) === String(robot.deveui),
      );
      dispatch({ type: "FETCH_LINK_ROBOTS_SUCCESS", payload: robots });
    } catch (error) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to fetch robots";
      dispatch({ type: "FETCH_LINK_ROBOTS_FAIL", payload: msg });
      toast.error(msg);
    }
  };

  const closeLinkModal = () => {
    setLinkModalVisible(false);
    setLinkLora(null);
    setSelectedLinkRobot(null);
    dispatch({ type: "LINK_ROBOT_RESET" });
  };

  const handleLinkRobot = async () => {
    if (!linkLora || !selectedLinkRobot) {
      toast.error("Please select a robot to link");
      return;
    }

    dispatch({ type: "LINK_ROBOT_REQUEST" });
    try {
      const payload = {
        lora_id: linkLora._id,
        lora_sr: linkLora.serial,
        robot_id: selectedLinkRobot._id,
        robot_no: selectedLinkRobot.robot_no,
        site_id: selectedLinkRobot.site_id || linkLora.site_id,
        robot_type: selectedLinkRobot.robot_type || "Automatic",
        deveui: linkLora.formatted_deveui || linkLora.deveui,
        block: selectedLinkRobot.block || "Block-1",
      };

      const response = await axios.put(
        `/api/v1/robots/link-lora-to-robot`,
        payload,
        { withCredentials: true },
      );

      dispatch({ type: "LINK_ROBOT_SUCCESS", payload: response.data });
      toast.success(response.data.message || "Robot linked successfully");
      fetchloraconfigurations();
    } catch (error) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to link robot";
      dispatch({ type: "LINK_ROBOT_FAIL", payload: msg });
    }
  };

  const handleActivateLinkedRobot = async () => {
    const deveui = linkResult?.data?.deveui;
    if (!deveui) {
      toast.error("Deveui not found in link response");
      return;
    }

    dispatch({ type: "ACTIVATE_LINKED_ROBOT_REQUEST" });
    try {
      await axios.put(
        "/api/v1/robots/activate",
        { deveuiArray: [deveui] },
        { withCredentials: true },
      );
      const msg = `Robot with deveui ${deveui} activated successfully.`;
      dispatch({ type: "ACTIVATE_LINKED_ROBOT_SUCCESS", payload: msg });
      toast.success(msg);
    } catch (error) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to activate robot";
      dispatch({ type: "ACTIVATE_LINKED_ROBOT_FAIL", payload: msg });
      toast.error(msg);
    }
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
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        },
      );

      toast.success(response.data.message);
      // Update robots state with new data
      dispatch({
        type: "ADD_LORA_SUCCESS",
        payload: [response.data.data, ...lora_configuration], // Append instead of replace
      });

      setDeveuiObj({});

      setAddModalVisible(false);
    } catch (error) {
      toast.error(error.response.data.error || error.response.data.message);
      dispatch({
        type: "ADD_LORA_FAIL",
        payload: error.response.data.error || error.response.data.message,
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
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        },
      );

      dispatch({
        type: "UPDATE_LORA_SUCCESS",
        payload: response.data.data,
      });

      toast.success(
        `${filteredFormData.serial} Lora Configuration updated successfully!`,
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

  const filteredData = lora_configuration.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.robot_no?.toLowerCase().includes(term) ||
      item.deveui?.toLowerCase().includes(term) ||
      item.site_id?.toLowerCase().includes(term) ||
      item.serial?.toString().toLowerCase().includes(term) ||
      item.formatted_deveui?.toLowerCase().includes(term) ||
      item.status?.toLowerCase().includes(term)
    );
  });

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

  return (
    <div className="">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="text-center">Lora Configuration</h2>
        {/* {!["Master User", "Project User", "Service User"].includes(
          userInfo?.role
        ) && ( */}
        <CButton
          color="success"
          size="sm"
          className="text-white"
          onClick={openAddModal}
        >
          + Add New
        </CButton>
        {/* )} */}
      </div>
      {/* Add Modal */}
      <CModal
        visible={addmodalVisible}
        onClose={() => setAddModalVisible(false)}
        backdrop="static"
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>Add New Lora </CModalTitle>
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
            <CTableHeaderCell>Status</CTableHeaderCell>
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
            filteredData.map((item, index) => (
              <CTableRow key={index}>
                <CTableDataCell className="sticky-column">
                  {item.serial}
                </CTableDataCell>
                <CTableDataCell>
                  <CBadge
                    color={
                      item.status === "available"
                        ? "warning"
                        : item.status === "in-use"
                          ? "success"
                          : "danger"
                    }
                  >
                    {" "}
                    {item.status}
                  </CBadge>
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
                  {item.last_activity.length > 0 ? (
                    item.last_activity[item.last_activity.length - 1] ===
                    null ? (
                      <span className="badge bg-danger">N/A</span>
                    ) : (
                      <span className="badge bg-success">
                        {item.last_activity[item.last_activity.length - 1].name}
                      </span>
                    )
                  ) : (
                    <span className="badge bg-danger">N/A</span>
                  )}
                </CTableDataCell>
                <CTableDataCell style={{ minWidth: "170px" }}>
                  {item.last_activity.length > 0 ? (
                    item.last_activity[item.last_activity.length - 1] ===
                    null ? (
                      <span className="badge bg-danger">N/A</span>
                    ) : (
                      <span className="badge bg-success">
                        {new Date(
                          item.last_activity[item.last_activity.length - 1]
                            .timestamp,
                        ).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    )
                  ) : (
                    <span className="badge bg-danger">N/A</span>
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
                  {/* {!["Master User", "Project User", "Service User"].includes(
                    userInfo?.role
                  ) && ( */}
                  <CButton
                    color="success"
                    className="btn-sm m-1"
                    onClick={() => openModal(item)}
                  >
                    Update
                  </CButton>
                  {/* )} */}
                  {item.status === "available" && (
                    <CButton
                      color="info"
                      className="btn-sm m-1 text-white"
                      onClick={() => openLinkModal(item)}
                    >
                      Link Robot
                    </CButton>
                  )}
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

      {/* view Modal */}
      <CModal
        visible={viewModalVisible}
        size="xl"
        onClose={() => setViewModalVisible(false)}
      >
        {selectedItem && (
          <>
            <CModalHeader closeButton={false}>
              <CModalTitle>
                View Lora Configuration :{" "}
                <CBadge className="badge bg-danger">
                  {selectedItem.serial}
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
        <CModalHeader closeButton={false}>
          <CModalTitle>
            Update Lora{" "}
            <b className="px-3 badge bg-danger">{formData.serial}</b>
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
                  <SiteSelect
                    value={formData.site_id || ""}
                    onChange={(site_id) =>
                      setFormData((prev) => ({ ...prev, site_id }))
                    }
                    width="100%"
                    placeholder="Search site..."
                  />
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

              {(userInfo.role === "Master Admin" ||
                userInfo.role === "Service Admin") && (
                <CRow className="mt-3">
                  {" "}
                  <CCol md={6}>
                    <CFormLabel>Status</CFormLabel>
                    <CFormSelect
                      size="md"
                      className="mb-3"
                      aria-label="Large select example"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="in-use">in use</option>
                      <option value="available">available</option>
                      <option value="faulty">faulty</option>
                    </CFormSelect>
                  </CCol>
                </CRow>
              )}
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

      {/* Link Robot Modal */}
      <CModal
        visible={linkModalVisible}
        onClose={closeLinkModal}
        backdrop="static"
        size="lg"
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>
            Link Robot to Lora{" "}
            {linkLora && (
              <CBadge color="danger" className="ms-2">
                {linkLora.serial}
              </CBadge>
            )}
          </CModalTitle>
          <button
            type="button"
            className="border-0 ms-auto py-0 px-1"
            onClick={closeLinkModal}
            style={{ background: "none" }}
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>
        <CModalBody>
          {linkLora && (
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Lora Sr</CFormLabel>
                <CFormInput value={linkLora.serial || ""} disabled />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Deveui</CFormLabel>
                <CFormInput
                  value={linkLora.formatted_deveui || linkLora.deveui || ""}
                  disabled
                />
              </CCol>
              <CCol md={6} className="mt-2">
                <CFormLabel>Status</CFormLabel>
                <CFormInput value={linkLora.status || ""} disabled />
              </CCol>
              <CCol md={6} className="mt-2">
                <CFormLabel>Site ID</CFormLabel>
                <CFormInput value={linkLora.site_id || "N/A"} disabled />
              </CCol>
            </CRow>
          )}

          <div className="mb-3">
            <CFormLabel>
              Select Robot {loadingLinkRobots && <LoadingSpinner />}
            </CFormLabel>
            <Select
              styles={darkSelectStyles}
              menuPortalTarget={document.body}
              menuPosition="fixed"
              isClearable
              isSearchable
              isLoading={loadingLinkRobots}
              placeholder="Search Automatic robots (no lora)..."
              value={
                selectedLinkRobot
                  ? {
                      value: selectedLinkRobot._id,
                      label: `${selectedLinkRobot.robot_no} | ${selectedLinkRobot.site_id || "N/A"}`,
                      robot: selectedLinkRobot,
                    }
                  : null
              }
              onChange={(opt) => setSelectedLinkRobot(opt?.robot || null)}
              options={(linkRobots || []).map((robot) => ({
                value: robot._id,
                label: `${robot.robot_no} | ${robot.site_id || "N/A"} | ${robot.deveui || ""}`,
                robot,
              }))}
            />
            {linkRobotsError && (
              <div className="text-danger small mt-1">{linkRobotsError}</div>
            )}
            {!loadingLinkRobots &&
              linkRobots.length === 0 &&
              !linkRobotsError && (
                <div className="text-muted small mt-1">
                  No Automatic robots found with empty lora and robot_no =
                  deveui.
                </div>
              )}
          </div>

          {selectedLinkRobot && (
            <CRow className="mb-3">
              <CCol md={4}>
                <CFormLabel>Robot No</CFormLabel>
                <CFormInput value={selectedLinkRobot.robot_no || ""} disabled />
              </CCol>
              <CCol md={4}>
                <CFormLabel>Site</CFormLabel>
                <CFormInput value={selectedLinkRobot.site_id || ""} disabled />
              </CCol>
              <CCol md={4}>
                <CFormLabel>Type</CFormLabel>
                <CFormInput
                  value={selectedLinkRobot.robot_type || "Automatic"}
                  disabled
                />
              </CCol>
            </CRow>
          )}

          {linkError && (
            <CAlert color="danger" className="mb-2">
              {linkError}
            </CAlert>
          )}

          {linkResult && (
            <CAlert color="success" className="mb-2">
              <div className="fw-semibold mb-1">
                {linkResult.message || "Linked successfully"}
              </div>
            </CAlert>
          )}

          {activateLinkedError && (
            <CAlert color="danger" className="mb-2">
              {activateLinkedError}
            </CAlert>
          )}
          {activateLinkedSuccess && (
            <CAlert color="success" className="mb-2">
              {activateLinkedSuccess}
            </CAlert>
          )}

          {linkResult?.success && !activateLinkedSuccess && (
            <CButton
              color="success"
              size="sm"
              className="text-white"
              disabled={activatingLinkedRobot || !linkResult?.data?.deveui}
              onClick={handleActivateLinkedRobot}
            >
              {activatingLinkedRobot ? (
                <>
                  Activating..
                  <LoadingSpinner />
                </>
              ) : (
                "Activate Robot"
              )}
            </CButton>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" size="sm" onClick={closeLinkModal}>
            Close
          </CButton>
          {selectedLinkRobot && !linkResult?.success && (
            <CButton
              color="primary"
              size="sm"
              disabled={linkingRobot}
              onClick={handleLinkRobot}
            >
              {linkingRobot ? (
                <>
                  Linking..
                  <LoadingSpinner />
                </>
              ) : (
                "Link Robot"
              )}
            </CButton>
          )}
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default LoraConfiguration;
