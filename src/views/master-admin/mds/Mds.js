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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CBadge,
  CButton,
  CModalFooter,
  CFormLabel,
  CTabList,
  CTab,
  CTabContent,
  CTabPanel,
  CForm,
  CFormSelect,
  CTabs,
} from "@coreui/react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import LastActivity from "../../../components/LastActivity";
import PaginateInput from "../../../components/PaginateInput";
import { cilTrash, cilX } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { deleteMdsFromDatabase, deleteMdsFromLns } from "./DeleteMds";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_MDS_REQUEST":
      return { ...state, loadingMds: true, error: "" };
    case "FETCH_MDS_SUCCESS":
      return {
        ...state,
        loadingMds: false,
        mdsDevices: action.payload.data,
        totalPages: action.payload.totalPages,
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_MDS_FAIL":
      return { ...state, loadingMds: false, error: action.payload };
    case "FETCH_ROBOTS_REQUEST":
      return { ...state, loadingRobots: true, robotError: "" };
    case "FETCH_ROBOTS_SUCCESS":
      return {
        ...state,
        loadingRobots: false,
        robots: action.payload,
      };
    case "FETCH_ROBOTS_FAIL":
      return { ...state, loadingRobots: false, robotError: action.payload };
    // case "ASSIGN_ROBOT_REQUEST":
    //   return { ...state, assignRobotLoading: true, assignRobotError: "" };

    // case "ASSIGN_ROBOT_SUCCESS":
    //   return {
    //     ...state,
    //     assignRobotLoading: false,
    //     assigned_robots: state.assigned_robots
    //       ? [...state.assigned_robots, action.payload]
    //       : [action.payload],
    //   };

    // case "ASSIGN_ROBOT_FAIL":
    //   return {
    //     ...state,
    //     assignRobotLoading: false,
    //     assignRobotError: action.payload,
    //   };
    default:
      return state;
  }
};

const Mds = () => {
  const [
    {
      error,
      mdsDevices,
      loadingMds,
      totalPages,
      hasNextPage,
      hasPrevPage,
      robots,
    },
    dispatch,
  ] = useReducer(reducer, {
    mdsDevices: [],
    loadingMds: true,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    robots: [],
  });

  // const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);

  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [pageInput, setPageInput] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState("");
  const [selectedMds, setSelectedMds] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // --- Add these new states after your delete-related useStates ---
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  // const [robots, setRobots] = useState([]);
  const [selectedRobot, setSelectedRobot] = useState("");
  // const [assignedRobots, setAssignedRobots] = useState([]);
  const [assignRobotLoading, setAssignRobotLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("assigned");

  const [formData, setFormData] = useState({
    mds_no: "",
    deveui: "",
    block: "",
    site_id: "",
    company: "",
    last_update: "",
    lora_state: "",
    activate: "",
    last_status: "",
    battery_percentage: "",
    version: "",
    old_lora_no: "",
    lora_no: "",
    wheel_speed: "",
    brush_speed: "",
    stuck_count: "",
  });

  useEffect(() => {
    let pagination = {
      pg: page,
      limit: limit,
    };
    const fetchMds = async () => {
      dispatch({ type: "FETCH_MDS_REQUEST" });
      try {
        const result = await axios.post(
          `/api/v1/mds-device/getAll-mds`,
          pagination,
          {
            // headers: { Authorization: `Bearer ${authtoken}` },
            withCredentials: true,
          },
        );

        let total = Math.ceil(
          Number(result.data.total) / Number(result.data.limit),
        );

        dispatch({
          type: "FETCH_MDS_SUCCESS",
          payload: {
            data: result.data.data,
            totalPages: total,
            hasNextPage: result.data.hasNextPage,
            hasPrevPage: result.data.hasPrevPage,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_MDS_FAIL",
          payload: error.response?.data?.message || error.response?.data?.error,
        });
        toast.error(
          error.response?.data?.message || error.response?.data?.error,
        );
      }
    };

    fetchMds();
  }, [limit, page]);

  useEffect(() => {
    const fetchRobotsBySite = async () => {
      dispatch({ type: "FETCH_ROBOTS_REQUEST" });
      try {
        const result = await axios.get(
          `/api/v1/robots/get-all-robots-sitewise/${selectedMds.site_id}`,
          {
            // headers: { Authorization: `Bearer ${authtoken}` },
            withCredentials: true,
          },
        );
        dispatch({
          type: "FETCH_ROBOTS_SUCCESS",
          payload: result.data.data,
        });
        console.log("Fetched Robots:", result.data.data);
      } catch (error) {
        dispatch({
          type: "FETCH_ROBOTS_FAIL",
          payload: error.response?.data?.error || "Error fetching robots",
        });
        toast.error(error.response.data.error || "Error fetching robots");
      }
    };
    if (assignModalVisible && selectedMds?.site_id) {
      fetchRobotsBySite();
    }
  }, [assignModalVisible, selectedMds]);
  // ---------------------------------------------------------------------------------

  // --- Add this function for assigning robot to selected MDS ---
  const handleAssignRobotToMds = async (mds, robotNo) => {
    if (!mds || !robotNo) {
      toast.error("Please select both MDS and Robot.");
      return;
    }

    setAssignRobotLoading(true);
    try {
      const response = await axios.post(
        `/api/v1/mds-device/assign-robot-to-mds`,
        {
          mds_id: mds._id,
          robot_no: robotNo,
        },
        {
          // headers: { Authorization: `Bearer ${authtoken}`      }
          withCredentials: true,
        },
      );

      toast.success(response.data?.message || "Robot assigned successfully!");
      setAssignModalVisible(false);
      setSelectedRobot("");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to assign robot.",
      );
    } finally {
      setAssignRobotLoading(false);
    }
  };
  // ---------------------------------------------------------------------------------

  const filteredMds = mdsDevices.filter((mds) =>
    ["mds_no", "deveui", "site_id", "version", "lora_no"].some((field) =>
      (mds?.[field] ?? "")
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    ),
  );

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

  let adminroute = "";

  if (userInfo?.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo?.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo?.role === "Service User") {
    adminroute = "service-user";
  } else if (userInfo?.role === "Project Admin") {
    adminroute = "project-admin";
  } else if (userInfo?.role === "Project User") {
    adminroute = "project-user";
  } else if (userInfo?.role === "Factory Admin") {
    adminroute = "factory-admin";
  }

  return (
    <div className="p-2">
      <h2 className="text-center">All MDS Devices</h2>
      <div className="d-flex justify-content-end mb-3">
        {userInfo?.role === "Master Admin" && (
          <Link
            className="btn btn-sm btn-success m-1"
            to={`/${adminroute}/add-mds-device/add-mds-using-lorano`}
          >
            Add MDS
          </Link>
        )}
        {/* {[
          "Master Admin",
          "Master User",
          "Project User",
          "Service User",
        ].includes(userInfo?.role) && (
          <Link
            className="btn btn-sm btn-success m-1"
            to={`/${adminroute}/mds-devices/shift-block-wise`}
          >
            Shift Block Wise
          </Link>
        )} */}

        {userInfo?.role === "Master Admin" && (
          <Link
            className="btn btn-sm btn-secondary m-1"
            to={`/${adminroute}/mds-devices/activate-mds-devices`}
          >
            Activate MDS
          </Link>
        )}
      </div>

      <CRow className="justify-content-end mb-3">
        <CCol md={4}>
          <CFormInput
            type="text"
            placeholder="Search: MDS No, Version, Lora No, Deveui, Site ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
      </CRow>

      <CTable bordered hover responsive className="text-center shadow-sm">
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "200px" }}>
              MDS No
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "200px" }}>
              Firmware Version
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "200px" }}>
              Deveui
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "100px" }}>
              Lora No
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "200px" }}>
              Version
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "140px" }}>
              Connection Status
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "140px" }}>
              Activate Status
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "100px" }}>
              Block
            </CTableHeaderCell>
            <CTableHeaderCell>Site ID</CTableHeaderCell>
            {userInfo?.role === "Master Admin" && (
              <CTableHeaderCell style={{ minWidth: "480px" }}>
                Actions
              </CTableHeaderCell>
            )}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loadingMds ? (
            <CTableRow>
              <CTableDataCell colSpan="10" className="text-start fw-bold">
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : error ? (
            <CTableRow>
              <CTableDataCell colSpan="9" className="text-center fw-bold">
                {error}
              </CTableDataCell>
            </CTableRow>
          ) : filteredMds.length > 0 ? (
            filteredMds.map((mds, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>
                  <Link
                    className="text-decoration-none m-1"
                    to={`${
                      userInfo?.role === "Master Admin"
                        ? `/${adminroute}/mds-devices/view/${mds._id}`
                        : `/${adminroute}/mds/site-management/block-management/${mds.site_id}/${mds.block}/${mds.mds_no}`
                    }`}
                  >
                    {mds.mds_no}
                  </Link>
                </CTableDataCell>
                <CTableDataCell>
                  {mds.version === "V" ? "MDS not yet operated" : mds.version}
                </CTableDataCell>
                <CTableDataCell>{mds.deveui}</CTableDataCell>
                <CTableDataCell>{mds.lora_no}</CTableDataCell>
                <CTableDataCell>{mds.version}</CTableDataCell>
                <CTableDataCell>
                  {mds.lora_state === 1 ? (
                    <CBadge color="success" shape="rounded-pill">
                      Online
                    </CBadge>
                  ) : (
                    <CBadge className="bg-danger" shape="rounded-pill">
                      Offline
                    </CBadge>
                  )}
                </CTableDataCell>
                <CTableDataCell>
                  {mds.activate === true ? (
                    <CBadge color="success" shape="rounded-pill">
                      Active
                    </CBadge>
                  ) : (
                    <CBadge color="danger" shape="rounded-pill">
                      Inactive
                    </CBadge>
                  )}
                </CTableDataCell>
                <CTableDataCell>{mds.block}</CTableDataCell>
                <CTableDataCell>{mds.site_id}</CTableDataCell>
                {userInfo?.role === "Master Admin" && (
                  <CTableDataCell>
                    <CButton
                      color="info"
                      size="sm"
                      onClick={() => {
                        setSelectedMds(mds);
                        setAssignModalVisible(true);
                      }}
                    >
                      Assign Robot
                    </CButton>

                    <Link
                      className="btn btn-sm btn-secondary m-1"
                      to={`/${adminroute}/mds-devices/view/${mds._id}`}
                    >
                      View
                    </Link>

                    {userInfo?.role === "Master Admin" && (
                      <>
                        <Link
                          className="btn btn-sm btn-warning m-1"
                          to={`/${adminroute}/mds-devices/update/${mds._id}`}
                        >
                          Update
                        </Link>
                        <button
                          className="btn btn-sm btn-danger m-1"
                          onClick={() => {
                            setSelectedMds(mds);
                            setDeleteType("lns");
                            setShowDeleteModal(true);
                          }}
                        >
                          Delete-LNS
                        </button>
                        <button
                          className="btn btn-sm btn-outline-warning m-1"
                          onClick={() => {
                            setSelectedMds(mds);
                            setDeleteType("db");
                            setShowDeleteModal(true);
                          }}
                        >
                          Delete-DB
                        </button>
                      </>
                    )}
                  </CTableDataCell>
                )}
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="7" className="text-center fw-bold">
                No matching MDS found.
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>

      <CModal
        size="sm"
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        backdrop="static"
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>Delete MDS - {selectedMds?.mds_no}</CModalTitle>
          <button
            type="button"
            className="border-0 ms-auto py-0 px-1"
            onClick={() => {
              setShowDeleteModal(false);
              setDeleteReason("");
            }}
            style={{ background: "none" }}
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>

        <CModalBody>
          <p>
            Are you sure you want to delete this MDS from{" "}
            <strong>{deleteType === "lns" ? "LNS" : "Database"}</strong>?
          </p>

          <CFormLabel>Reason for Deletion</CFormLabel>
          <CFormInput
            type="text"
            placeholder="Enter reason..."
            value={deleteReason}
            onChange={(e) => setDeleteReason(e.target.value)}
          />
        </CModalBody>

        <CModalFooter>
          <CButton
            color="secondary"
            size="sm"
            onClick={() => {
              setShowDeleteModal(false);
              setDeleteReason("");
            }}
          >
            Cancel
          </CButton>

          <CButton
            color="danger"
            size="sm"
            onClick={async () => {
              if (!deleteReason.trim()) {
                toast.error("Reason is required.");
                return;
              }

              setIsDeleting(true);

              try {
                if (deleteType === "lns") {
                  await deleteMdsFromLns(
                    selectedMds.mds_no,
                    selectedMds.deveui,
                    deleteReason,
                  );
                } else if (deleteType === "db") {
                  await deleteMdsFromDatabase(selectedMds.mds_no, deleteReason);
                }

                // Optional: Remove deleted MDS from state instantly
                dispatch({
                  type: "FETCH_MDS_SUCCESS",
                  payload: {
                    data: mdsDevices.filter(
                      (d) => d.mds_no !== selectedMds.mds_no,
                    ),
                    totalPages,
                    hasNextPage,
                    hasPrevPage,
                  },
                });
              } finally {
                setIsDeleting(false);
                setShowDeleteModal(false);
                setDeleteReason("");
              }
            }}
          >
            {isDeleting ? <LoadingSpinner size="sm" /> : "Confirm Delete"}
          </CButton>
        </CModalFooter>
      </CModal>

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

      <CModal
        size="xl"
        scrollable
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>
            MDS Data :&nbsp;
            <span className="badge bg-success">{formData.mds_no}</span>{" "}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedMds && (
            <>
              <CTable bordered responsive>
                <CTableHead color="secondary">
                  <CTableRow>
                    <CTableHeaderCell>Field</CTableHeaderCell>
                    <CTableHeaderCell>Value</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {Object.entries(formData)
                    .filter(([key]) => key !== "last_activity")
                    .map(([key, value]) => (
                      <CTableRow key={key} className="align-middle">
                        <CTableDataCell className="fw-semibold text-uppercase ">
                          {key.replace(/_/g, " ")}
                        </CTableDataCell>
                        <CTableDataCell>
                          {typeof value === "boolean" ? (
                            <CBadge
                              color={value ? "success" : "danger"}
                              shape="rounded-pill"
                            >
                              {value ? "Active" : "Inactive"}
                            </CBadge>
                          ) : (
                            <span className=" fw-medium">{String(value)}</span>
                          )}
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                </CTableBody>
              </CTable>

              {formData.last_activity && (
                <LastActivity lastactivity={formData.last_activity} />
              )}
            </>
          )}
        </CModalBody>
      </CModal>

      {/* Assign Robot Modal */}
      <CModal
        size="xl"
        visible={assignModalVisible}
        onClose={() => setAssignModalVisible(false)}
        backdrop="static"
        scrollable
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>
            Assign Robot to MDS:{" "}
            <span className=" badge bg-primary">{selectedMds?.mds_no}</span>
          </CModalTitle>
          <button
            type="button"
            className="border-0 ms-auto py-0 px-1"
            onClick={() => {
              setAssignModalVisible(false);
              setSelectedRobot("");
            }}
            style={{ background: "none" }}
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>

        <CModalBody>
          <CTabs activeItemKey={activeTab} onActiveItemChange={setActiveTab}>
            <CTabList variant="tabs">
              <CTab itemKey="assigned">Assigned Robots</CTab>
              <CTab itemKey="assign">Assign New Robot</CTab>
            </CTabList>

            <CTabContent>
              {/* ---------- ASSIGNED ROBOTS ---------- */}
              <CTabPanel className="p-3" itemKey="assigned">
                <CTable bordered hover responsive className="text-center mt-3">
                  <CTableHead color="secondary">
                    <CTableRow>
                      <CTableHeaderCell>#</CTableHeaderCell>
                      <CTableHeaderCell>Robot No</CTableHeaderCell>
                      <CTableHeaderCell>Site ID</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {selectedMds?.robot ? (
                      <CTableRow>
                        <CTableDataCell>1</CTableDataCell>
                        <CTableDataCell>
                          {selectedMds.robot.robot_no}
                        </CTableDataCell>
                        <CTableDataCell>
                          {selectedMds.robot.site_id}
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      <CTableRow>
                        <CTableDataCell
                          colSpan="3"
                          className="text-center text-danger"
                        >
                          No assigned robots found.
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              </CTabPanel>

              {/* ---------- ASSIGN NEW ROBOT ---------- */}
              <CTabPanel className="p-3" itemKey="assign">
                <CForm className="mt-3">
                  <div className="mb-3">
                    <CFormLabel htmlFor="robot-select">Select Robot</CFormLabel>
                    <CFormSelect
                      id="robot-select"
                      name="item-name"
                      value={selectedRobot}
                      onChange={(e) => setSelectedRobot(e.target.value)}
                    >
                      <option value="">Assign Robot</option>
                      {robots?.length > 0 &&
                        robots.map((item, index) => (
                          <option key={index} value={item.robot_no}>
                            {item.robot_no}-({item.site_id})
                          </option>
                        ))}
                    </CFormSelect>
                  </div>

                  <CButton
                    color="primary"
                    size="sm"
                    onClick={() =>
                      handleAssignRobotToMds(selectedMds, selectedRobot)
                    }
                    disabled={!selectedRobot || assignRobotLoading}
                  >
                    {assignRobotLoading ? (
                      <>
                        Assigning...
                        <LoadingSpinner />
                      </>
                    ) : (
                      "Assign Robot"
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

export default Mds;
