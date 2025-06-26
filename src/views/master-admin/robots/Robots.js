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
} from "@coreui/react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import LastActivity from "../../../components/LastActivity";
import PaginateInput from "../../../components/PaginateInput";
import { deleteRobotFromDatabase, deleteRobotFromLns } from "./DeleteRobots";
import { cilX } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SITES_REQUEST":
      return { ...state, loadingSites: true, error: "" };
    case "FETCH_SITES_SUCCESS":
      return { ...state, loadingSites: false, sites: action.payload };
    case "FETCH_SITES_FAIL":
      return { ...state, loadingSites: false, error: action.payload };

    case "FETCH_ROBOTS_REQUEST":
      return { ...state, loadingRobots: true, error: "" };
    case "FETCH_ROBOTS_SUCCESS":
      return {
        ...state,
        loadingRobots: false,
        robots: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_ROBOTS_FAIL":
      return { ...state, loadingRobots: false, error: action.payload };
    default:
      return state;
  }
};
const Robots = () => {
  const [
    { error, robots, loadingRobots, totalPages, hasNextPage, hasPrevPage },
    dispatch,
  ] = useReducer(reducer, {
    sites: [],
    robots: [],
    loading: true,
    loadingRobots: true,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);

  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [pageInput, setPageInput] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState(""); // 'lns' or 'db'
  const [selectedRobot, setSelectedRobot] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    robot_no: "",
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
    const fetchRobots = async () => {
      dispatch({ type: "FETCH_ROBOTS_REQUEST" });
      try {
        const result = await axios.post(
          `/api/v1/robots/get-robots`,
          pagination,
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
          type: "FETCH_ROBOTS_SUCCESS",
          payload: {
            data: result.data.data,
            totalPages: total,
            hasNextPage: next,
            hasPrevPage: prev,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_ROBOTS_FAIL",
          payload: error.response?.data?.message || error.response?.data?.error,
        });
        toast.error(
          error.response?.data?.message || error.response?.data?.error
        );
      }
    };

    fetchRobots();
  }, [authtoken, limit, page]);

  // Filter robots based on search term
  const filteredRobots = robots.filter(
    (robot) =>
      robot?.robot_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      robot?.deveui?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      robot?.site_id?.toLowerCase().includes(searchTerm.toLowerCase())
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
  } else if (userInfo?.role === "Project Admin") {
    adminroute = "project-admin";
  } else if (userInfo?.role === "Client Admin") {
    adminroute = "client-admin";
  } else if (userInfo?.role === "Site Incharge") {
    adminroute = "site-incharge";
  } else if (userInfo?.role === "Site Technician") {
    adminroute = "site-technician";
  } else if (userInfo?.role === "Client Technician") {
    adminroute = "client-technician";
  }
  return (
    <div className="p-2">
      <h2 className="text-center">All Robots</h2>
      <div className="d-flex justify-content-end mb-3">
        {/* Hide Add Robots button for Master User, Project User, Service User */}
        {!["Master User", "Project User", "Service User"].includes(
          userInfo?.role
        ) && (
          <Link
            className="btn btn-sm btn-success m-1"
            to="/master-admin/add-robot/add-robot-using-lorano"
          >
            Add Robots
          </Link>
        )}

        {/* Hide Shift Block Wise button for Master User, Project User, Service User */}
        {!["Master User", "Project User", "Service User"].includes(
          userInfo?.role
        ) && (
          <Link
            className="btn btn-sm btn-success m-1"
            to="/master-admin/robots/shift-block-wise"
          >
            Shift Block Wise
          </Link>
        )}

        {/* Hide Activate Robots button for Master User, Project User, Service User */}
        {!["Master User", "Project User", "Service User"].includes(
          userInfo?.role
        ) && (
          <Link
            className="btn btn-sm btn-secondary m-1"
            to="/master-admin/activate-robots"
          >
            Activate Robots
          </Link>
        )}
      </div>
      {/* Search Input */}
      <CRow className="justify-content-end mb-3">
        <CCol md={4}>
          <CFormInput
            type="text"
            placeholder="Search by Robot No, Deveui, or Site ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
      </CRow>

      {/* Robots Table */}
      <CTable bordered hover responsive className="text-center shadow-sm">
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "200px" }}>
              Robot No
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "200px" }}>
              Firmwaere Version
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "200px" }}>
              Deveui
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "100px" }}>
              Lora No
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
            <CTableHeaderCell style={{ minWidth: "340px" }}>
              Actions
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loadingRobots ? (
            <CTableRow>
              <CTableDataCell colSpan="10" className="text-start fw-bold">
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : error ? (
            <CTableRow>
              {" "}
              <CTableDataCell colSpan="9" className="text-center fw-bold">
                {error}
              </CTableDataCell>
            </CTableRow>
          ) : filteredRobots.length > 0 ? (
            filteredRobots.map((robot, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>
                  <Link
                    className="text-decoration-none m-1"
                    to={`/${adminroute}/robots/${robot._id}`}
                  >
                    {robot.robot_no}
                  </Link>
                </CTableDataCell>
                <CTableDataCell>
                  {robot.version === "V"
                    ? "Robot is not yet operated"
                    : robot.version}
                </CTableDataCell>
                <CTableDataCell>{robot.deveui}</CTableDataCell>
                <CTableDataCell>{robot.lora_no}</CTableDataCell>
                <CTableDataCell>
                  {robot.lora_state === 1 ? (
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
                  {robot.activate === true ? (
                    <CBadge color="success" shape="rounded-pill">
                      Active
                    </CBadge>
                  ) : (
                    <CBadge color="danger" shape="rounded-pill">
                      In Active
                    </CBadge>
                  )}
                </CTableDataCell>
                <CTableDataCell>{robot.block}</CTableDataCell>
                <CTableDataCell>{robot.site_id}</CTableDataCell>
                <CTableDataCell>
                  {/* View button - visible to all roles */}
                  <Link
                    className="btn btn-sm btn-secondary m-1"
                    to={`/${adminroute}/robots/${robot._id}`}
                  >
                    View
                  </Link>

                  {/* Conditional buttons - only for admin roles */}
                  {!["Master User", "Project User", "Service User"].includes(
                    userInfo?.role
                  ) && (
                    <>
                      <Link
                        className="btn btn-sm btn-warning m-1"
                        to={`/master-admin/robots/update/${robot._id}`}
                      >
                        Update
                      </Link>
                      <button
                        className="btn btn-sm btn-danger m-1"
                        onClick={() => {
                          setSelectedRobot(robot);
                          setDeleteType("lns");
                          setShowDeleteModal(true);
                        }}
                      >
                        Del from LNS
                      </button>
                      <button
                        className="btn btn-sm btn-outline-warning m-1"
                        onClick={() => {
                          setSelectedRobot(robot);
                          setDeleteType("db");
                          setShowDeleteModal(true);
                        }}
                      >
                        Del from DB
                      </button>
                    </>
                  )}
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="7" className="text-center fw-bold">
                No matching robots found.
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>

      {/* delete Modal */}
      <CModal
        size="md"
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        backdrop="static"
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>Delete Robot - {selectedRobot?.robot_no}</CModalTitle>
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
            Are you sure you want to delete this robot from{" "}
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
                  await deleteRobotFromLns(
                    selectedRobot.robot_no,
                    selectedRobot.deveui,
                    authtoken,
                    deleteReason
                  );
                } else {
                  await deleteRobotFromDatabase(
                    selectedRobot.robot_no,
                    authtoken,
                    deleteReason
                  );
                }
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
        handleLimitChange={setLimit} // New prop
      />
      {/* view Modal */}
      <CModal
        size="xl"
        scrollable
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>
            Robot Data :&nbsp;
            <span className="badge bg-success">{formData.robot_no}</span>{" "}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedRobot && (
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
                    .filter(([key]) => key !== "last_activity") // Exclude last_activity
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
                              className=""
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
    </div>
  );
};

export default Robots;
