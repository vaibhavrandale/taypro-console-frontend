import React, { useEffect, useReducer, useState } from "react";
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CDropdownMenu,
  CDropdownItem,
  CDropdown,
  CDropdownToggle,
  CInputGroup,
  CFormInput,
  CSpinner,
  CTooltip,
} from "@coreui/react";
import { FaArrowUp } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6"; // Correct import
import { Link, useParams } from "react-router-dom";
import "./management.css";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { formatDistanceToNow } from "date-fns";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };

    case "FETCH_SUCCESS":
      return { ...state, downlink: action.payload, loading: false };

    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };

    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };

    case "DELETE_FAIL":
      return { ...state, loadingDelete: false, successDelete: false };

    case "DELETE_RESET":
      return { ...state, successDelete: false };

    case "FETCH_ROBOTS_REQUEST":
      return { ...state, loadingRobots: true, error: "" };

    case "FETCH_ROBOTS_SUCCESS":
      return { ...state, loadingRobots: false, robots: action.payload };

    case "FETCH_ROBOTS_FAIL":
      return { ...state, loadingRobots: false, error: action.payload };

    default:
      return state;
  }
};

const RobotOperating = () => {
  const { site_id, block, robot_no } = useParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [siteRobots, setSiteRobots] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const authtoken = useSelector((state) => state.authtoken);

  const [
    { loading, error, downlink, successDelete, loadingRobots, robots },
    dispatch,
  ] = useReducer(reducer, {
    downlink: [],
    robots: [],
    loading: true,
    error: "",
    loadingRobots: true,
  });

  useEffect(() => {
    const getDownlinks = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const response = await axios.get("/api/v1/downlinks", {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: response.data.data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response ? error.response.data.message : error.message,
        });
      }
    };

    const getRobots = async () => {
      try {
        dispatch({ type: "FETCH_ROBOTS_REQUEST" });
        const response = await axios.get(`/api/v1/robots/site/${site_id}`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });

        const robotsData = response.data.data; // Ensure correct data access

        dispatch({ type: "FETCH_ROBOTS_SUCCESS", payload: robotsData });

        // ✅ Filter robots assigned to this site
        if (site_id) {
          const extractNumber = (robotNo) =>
            parseInt(robotNo.match(/\d+/g)?.join("") || "0", 10);

          const filteredRobots = robotsData
            .filter(
              (robot) => robot.site_id === site_id && robot.block === block
            )
            .sort(
              (a, b) => extractNumber(a.robot_no) - extractNumber(b.robot_no)
            );

          setSiteRobots(filteredRobots);
        }
      } catch (error) {
        dispatch({
          type: "FETCH_ROBOTS_FAIL",
          payload: error.response ? error.response.data.message : error.message,
        });
      }
    };

    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      getDownlinks();
    }

    getRobots();
  }, [block, site_id, successDelete, authtoken]);

  const deleteDownlink = async (downlink) => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        await axios.delete(`/api/v1/downlinks/${downlink._id}`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });

        toast.success("Downlink deleted successfully");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (err) {
        toast.error(err.response ? err.response.data.message : err.message);
        dispatch({ type: "DELETE_FAIL" });
      }
    }
  };

  // ✅ Ensure robots exist before filtering
  const Robotdata =
    robots?.length > 0
      ? robots.filter(
          (robot) =>
            robot.site_id === site_id &&
            robot.block === block &&
            robot.robot_no === robot_no
        )
      : [];

  const sendCommand = (command) => {
    // Send command to robot
    toast.success(`${command} Command sent Successfully!`);
  };

  return (
    <>
      {loadingRobots ? (
        <div className="loading-container">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <h1>{error}</h1>
      ) : (
        <div className="">
          {/* Page Header */}
          <CRow>
            <CCol>
              <h4 className="fw-bold text-center">
                <span className="text-dark">{site_id} -&nbsp;</span>
                <span className="text-primary">{block}</span>
                &nbsp;-&nbsp;Robot's Configuration
              </h4>
            </CCol>
          </CRow>

          {/* Action Buttons */}
          <CRow className="my-2">
            <CCol>
              <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
                START ALL
              </CButton>
              <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
                STOP ALL
              </CButton>
              <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
                RETURN TO DOCK ALL
              </CButton>
              <Link
                to={`/master-admin/site-management/block-management/${site_id}/${block}/${robot_no}/debug_logs`}
                className="btn btn-sm btn-secondary  btn-sm m-1 shadow-sm"
              >
                DEBUG LOG
              </Link>
              <Link
                to={`/master-admin/site-management/block-management/${site_id}/${block}/${robot_no}/cleaning_logs`}
                className="btn btn-sm btn-secondary m-1 shadow-sm"
              >
                CLEANING LOG
              </Link>

              <CDropdown className="dropdown">
                {siteRobots.length > 1 ? (
                  <CDropdownToggle size="sm" className="shadow-sm ">
                    {Robotdata[0].robot_no}
                  </CDropdownToggle>
                ) : (
                  <CButton
                    className={`${
                      Robotdata[0].lora_state === 1 ? `` : `text-white`
                    } shadow-sm`}
                    color={`${
                      Robotdata[0].lora_state === 1 ? `danger` : `success`
                    }`}
                    size="sm"
                  >
                    {Robotdata[0].robot_no}
                  </CButton>
                )}

                <CDropdownMenu className="z-3 px-2 py-1 dropdown-menu border">
                  {siteRobots.length === 1
                    ? ""
                    : siteRobots.map((item, index) => (
                        <CDropdownItem
                          key={index}
                          href={`${
                            item.robot_no === robot_no
                              ? `#`
                              : `${item.robot_no}`
                          }`}
                          className={`dopdown-item ${
                            item.lora_state === 1 ? `online` : `offline`
                          }`}
                        >
                          {item.robot_no}
                        </CDropdownItem>
                      ))}
                </CDropdownMenu>
              </CDropdown>
            </CCol>
          </CRow>
          <CRow className="my-2">
            <CCol></CCol>
          </CRow>

          <CRow className="">
            {/* First Card */}
            <CCol md={5} className="mt-2">
              <CCard className="shadow border-0" style={{ height: "100%" }}>
                <CCardBody>
                  <CTable borderless>
                    <CTableBody>
                      <CTableRow>
                        <CTableDataCell>
                          <span
                            className="text-secondary"
                            style={{ fontSize: "15px" }}
                          >
                            {Robotdata[0].robot_no}
                          </span>
                        </CTableDataCell>
                        <CTableDataCell>
                          🔋: {Robotdata[0].battery_voltage}%
                        </CTableDataCell>
                        <CTableDataCell>
                          <span className="badge bg-success">
                            {Robotdata[0].version}
                          </span>
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell className="text-danger">
                          <span
                            className="text-secondary"
                            style={{ fontSize: "13px" }}
                          >
                            {" "}
                            {Robotdata[0].deveui}{" "}
                          </span>
                        </CTableDataCell>
                        <CTableDataCell>Wheel Speed</CTableDataCell>
                        <CTableDataCell>
                          <span className="badge bg-danger">
                            {Robotdata[0].wheel_motor_speed}
                          </span>
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>
                          Lora:{" "}
                          <span className="text-success">
                            {Robotdata[0].lora_no}
                          </span>
                        </CTableDataCell>
                        <CTableDataCell>Brush Speed</CTableDataCell>
                        <CTableDataCell>
                          <span className="badge bg-danger">
                            {Robotdata[0].brush_motor_speed}
                          </span>
                        </CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </CCard>
            </CCol>

            {/* Second Card */}
            <CCol md={4} className="mt-2">
              <CCard className="shadow border-0 " style={{ height: "100%" }}>
                <CCardBody>
                  <CTable borderless>
                    <CTableBody>
                      <CTableRow>
                        <CTableDataCell>
                          <span
                            className={`text-${
                              Robotdata[0].lora_state === "1"
                                ? `success`
                                : `danger`
                            }`}
                          >
                            {Robotdata[0].lora_state === "1"
                              ? `online`
                              : `offline`}
                          </span>
                        </CTableDataCell>
                        <CTableDataCell>
                          <span className="text-secondary">
                            {Robotdata[0].last_status}
                          </span>
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>
                          <span className="text-danger">
                            SC : {Robotdata[0].stuck_count}
                          </span>
                        </CTableDataCell>
                        <CTableDataCell>
                          <span className="">
                            <CTooltip
                              content={new Date(
                                Robotdata[0].last_uplink
                              ).toLocaleString()}
                              placement="top"
                            >
                              <span>
                                {formatDistanceToNow(
                                  new Date(Robotdata[0].last_uplink),
                                  {
                                    addSuffix: true,
                                  }
                                )}
                              </span>
                            </CTooltip>
                          </span>
                        </CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </CCard>
            </CCol>

            {/* Third Card (Custom Downlink) */}
            <CCol md={3} className="mt-2">
              <CCard className="shadow border-0 " style={{ height: "100%" }}>
                <CCardBody>
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="fw-bold">Custom Downlink</h6>
                    <FaCircleInfo
                      className="text-primary"
                      style={{ cursor: "pointer" }}
                      onClick={() => setModalVisible(true)}
                    />
                  </div>
                  <form className="position-relative mt-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter command"
                    />
                    <CButton
                      type="button"
                      className="d-flex justify-content-between align-items-center btn-sm position-absolute send-button"
                    >
                      <FaArrowUp />
                    </CButton>
                  </form>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          {/* Modal for Commands */}
          <CModal
            scrollable
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            size="xl"
          >
            <CModalHeader>
              <CModalTitle>Custom Downlink</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CRow className="d-flex justify-content-between">
                <CCol xs={12} sm={10} md={6} lg={4}>
                  <CInputGroup className="mb-3">
                    <CFormInput
                      type="text"
                      placeholder="Search downlink..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </CInputGroup>
                </CCol>
                <CCol
                  className="d-flex justify-content-end align-items-center"
                  xs={12}
                  sm={10}
                  md={6}
                  lg={4}
                >
                  <Link
                    className="btn btn-sm btn-warning justify-content-end"
                    size="md"
                    // to="/master-admin/site-management/add-downlink"
                    to={`/master-admin/site-management/block-management/${site_id}/${block}/${robot_no}/add-downlink`}
                  >
                    Add Downlink
                  </Link>
                </CCol>
              </CRow>
              <CTable responsive hover bordered>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell style={{ minWidth: "70px" }}>
                      Sr No
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ minWidth: "150px" }}>
                      Command
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ minWidth: "150px" }}>
                      Decoded String
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ minWidth: "120px" }}>
                      Hexa decimal
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ minWidth: "120px" }}>
                      Uplink
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ minWidth: "240px" }}>
                      Description
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      style={{ minWidth: "250px" }}
                      className="text-center"
                    >
                      Action
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {loading ? (
                    <CTableRow className="text-center">
                      <CTableDataCell colSpan={7}>
                        <CSpinner color="primary" />
                      </CTableDataCell>
                    </CTableRow>
                  ) : error ? (
                    <CTableRow>
                      <CTableDataCell
                        colSpan={7}
                        className="text-center text-danger"
                      >
                        {error}
                      </CTableDataCell>
                    </CTableRow>
                  ) : downlink.length > 0 ? (
                    downlink.map((item, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>{index + 1}</CTableDataCell>

                        <CTableDataCell>
                          <Link onClick={() => sendCommand(item.downlink)}>
                            {item.downlink}
                          </Link>
                        </CTableDataCell>
                        <CTableDataCell>{item.decodedString}</CTableDataCell>
                        <CTableDataCell>{item.hexadecimal}</CTableDataCell>
                        <CTableDataCell>{item.uplink}</CTableDataCell>
                        <CTableDataCell>{item.additionalInfo}</CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex justify-content-center align-items-center">
                            <Link
                              to={`/master-admin/site-management/block-management/${site_id}/${block}/${robot_no}/view-downlink/${item._id}`}
                              color=""
                              size="sm"
                              className="btn btn-sm btn-secondary m-1"
                            >
                              View
                            </Link>

                            <Link
                              to={`/master-admin/site-management/block-management/${site_id}/${block}/${robot_no}/update-downlink/${item._id}`}
                              color="warning"
                              size="sm"
                              className="btn btn-sm btn-warning m-1"
                            >
                              Edit
                            </Link>

                            <Link
                              color="danger"
                              size="sm"
                              className=" btn btn-sm btn-danger m-1 text-white"
                              onClick={() => deleteDownlink(item)}
                            >
                              Delete
                            </Link>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell className="text-center" colSpan={7}>
                        No Data Found.
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CModalBody>

            <CModalFooter>
              <CButton color="secondary" onClick={() => setModalVisible(false)}>
                Close
              </CButton>
            </CModalFooter>
          </CModal>

          <CRow className="my-2">
            {/* First Card - Cleaning Cycle */}
            <CCol md={3} className="mt-2">
              <CCard className="shadow border-0 " style={{ height: "100%" }}>
                <CCardBody>
                  <p>Cleaning Cycle</p>
                  <CButton className="btn btn-sm btn-secondary m-1 shadow">
                    START
                  </CButton>
                  <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
                    STOP
                  </CButton>
                  <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
                    RETURN
                  </CButton>
                </CCardBody>
              </CCard>
            </CCol>

            {/* Second Card - Set Wheel Speed */}
            <CCol md={3} className="mt-2">
              <CCard className="shadow border-0 " style={{ height: "100%" }}>
                <CCardBody>
                  <p>Set Wheel Speed</p>
                  <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
                    LOW
                  </CButton>
                  <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
                    MEDIUM
                  </CButton>
                  <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
                    HIGH
                  </CButton>
                </CCardBody>
              </CCard>
            </CCol>

            {/* Third Card - Set Brush Speed */}
            <CCol md={3} className="mt-2">
              <CCard className="shadow border-0 " style={{ height: "100%" }}>
                <CCardBody>
                  <p>Set Brush Speed</p>
                  <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
                    LOW
                  </CButton>
                  <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
                    MEDIUM
                  </CButton>
                  <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
                    HIGH
                  </CButton>
                </CCardBody>
              </CCard>
            </CCol>

            {/* Fourth Card - Text To Base64 */}
            <CCol md={3} className="mt-2">
              <CCard className="shadow border-0 " style={{ height: "100%" }}>
                <CCardBody>
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="fw-bold">Text to Base64</h6>
                  </div>
                  <form className="position-relative mt-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter value"
                    />
                    <CButton
                      type="button"
                      className="d-flex justify-content-between align-items-center btn-sm position-absolute send-button"
                    >
                      <FaArrowUp />
                    </CButton>
                  </form>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </div>
      )}
    </>
  );
};

export default RobotOperating;
