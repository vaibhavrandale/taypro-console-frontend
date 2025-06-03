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
} from "@coreui/react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import LastActivity from "../../../components/LastActivity";
import PaginateInput from "../../../components/PaginateInput";
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
  const [selectedRobot, setSelectedRobot] = useState(null);

  const [pageInput, setPageInput] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

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

  // Open modal and load robot data
  const openModal = (robot) => {
    setSelectedRobot(robot);
    setFormData(robot);
    setModalVisible(true);
  };
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
        <Link
          className="btn btn-sm btn-success m-1"
          to="/master-admin/add-robot/add-robot-using-lorano"
        >
          Add Robots
        </Link>
        <Link
          className="btn btn-sm btn-success m-1"
          to="/master-admin/robots/shift-block-wise"
        >
          Shift Block Wise
        </Link>
        <Link
          className="btn btn-sm btn-secondary m-1"
          to="/master-admin/activate-robots"
        >
          Activate Robots
        </Link>
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
            <CTableHeaderCell style={{ minWidth: "180px" }}>
              Action
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loadingRobots ? (
            <CTableRow>
              <CTableDataCell colSpan="9" className="text-start fw-bold">
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
                    <CBadge color="warning" shape="rounded-pill">
                      Active
                    </CBadge>
                  ) : (
                    <CBadge className="bg-blue" shape="rounded-pill">
                      In Active
                    </CBadge>
                  )}
                </CTableDataCell>
                <CTableDataCell>{robot.block}</CTableDataCell>
                <CTableDataCell>{robot.site_id}</CTableDataCell>
                <CTableDataCell>
                  <Link
                    className="btn btn-sm btn-secondary m-1"
                    color="secondary"
                    size="sm"
                    to={`/${adminroute}/robots/${robot._id}`}
                    // onClick={() => openModal(robot)}
                  >
                    View
                  </Link>

                  <Link
                    className="btn btn-sm btn-warning m-1"
                    to={`/master-admin/robots/${robot._id}`}
                  >
                    Update
                  </Link>
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
