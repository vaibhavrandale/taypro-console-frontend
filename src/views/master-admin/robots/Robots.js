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
} from "@coreui/react";
// import { robots, sites } from "../../../data"; // Import robots data
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import LastActivity from "../../../components/LastActivity";
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
    {
      error,
      robots,
      sites,
      loadingRobots,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
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

  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRobot, setSelectedRobot] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const page = parseInt(queryParams.get("pg")) || 1;
  const limit = parseInt(queryParams.get("limit")) || 10;

  // const [selectedSite, setSelectedSite] = useState('');
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
    const fetchRobots = async () => {
      dispatch({ type: "FETCH_ROBOTS_REQUEST" });
      try {
        const result = await axios.get(
          `/api/v1/robots?pg=${page}&limit=${limit}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );
        // console.log(result.data);

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
          payload: "Failed to fetch robots",
        });
        toast.error("Failed to fetch robots");
      }
    };

    fetchRobots();
  }, [authtoken, limit, page]);

  // Filter robots based on search term
  const filteredRobots = robots.filter(
    (robot) =>
      robot.robot_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      robot.deveui.toLowerCase().includes(searchTerm.toLowerCase()) ||
      robot.site_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      robot.lora_no.toString().includes(searchTerm) // Convert lora_no to string
  );

  // Open modal and load robot data
  const openModal = (robot) => {
    setSelectedRobot(robot);
    setFormData(robot);
    setModalVisible(true);
  };
  const handlePageChange = (newPage) => {
    navigate(`?pg=${newPage}&limit=${limit}`);
  };
  return (
    <div className="p-2">
      <h2 className="text-center">All Robots</h2>
      <div className="d-flex justify-content-end mb-3">
        <Link
          className="btn btn-sm btn-primary m-1"
          to="/master-admin/add-robot/add-robot-using-lorano"
        >
          Add Robots
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
            placeholder="Search by Robot No, Deveui,Lora No, or Site ID..."
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
              <CTableDataCell colSpan="9" className="text-center fw-bold">
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
                <CTableDataCell>{robot.robot_no}</CTableDataCell>
                <CTableDataCell>{robot.deveui}</CTableDataCell>
                <CTableDataCell>{robot.lora_no}</CTableDataCell>
                <CTableDataCell>
                  {robot.lora_state === "1" ? (
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
                      Activate
                    </CBadge>
                  ) : (
                    <CBadge className="bg-primary" shape="rounded-pill">
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
                    onClick={() => openModal(robot)}
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
                {/* <CTableBody>
                  {Object.entries(formData)
                    .filter(([key]) => key !== "last_activity") // Exclude lastActivity
                    .map(([key, value]) => (
                      <CTableRow key={key}>
                        <CTableDataCell>
                          {key.replace(/_/g, " ").toUpperCase()}
                        </CTableDataCell>
                        <CTableDataCell>{String(value)}</CTableDataCell>
                      </CTableRow>
                    ))}
                </CTableBody> */}

                <CTableBody>
                  {Object.entries(formData)
                    .filter(([key]) => key !== "last_activity") // Exclude last_activity
                    .map(([key, value]) => (
                      <CTableRow key={key} className="align-middle">
                        <CTableDataCell className="fw-semibold text-uppercase text-secondary">
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
                            <span className="text-dark fw-medium">
                              {String(value)}
                            </span>
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
