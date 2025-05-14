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
  CTooltip,
  CBadge,
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
import PaginateInput from "../../../components/PaginateInput";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };

    case "FETCH_SUCCESS":
      return {
        ...state,
        downlinks: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
        loading: false,
      };

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

    case "FETCH_ROBOT_REQUEST":
      return { ...state, loadingRobot: true, error: "" };

    case "FETCH_ROBOT_SUCCESS":
      return { ...state, loadingRobot: false, robot: action.payload };

    case "FETCH_ROBOT_FAIL":
      return { ...state, loadingRobot: false, error: action.payload };

    case "SEND_DOWNLINK_REQUEST":
      return { ...state, sendingCommandloading: true, error: "" };

    case "SEND_DOWNLINK_SUCCESS":
      return { ...state, sendingCommandloading: false };

    case "SEND_DOWNLINK_FAIL":
      return { ...state, sendingCommandloading: false, error: action.payload };

    default:
      return state;
  }
};

const RobotOperating = () => {
  const { site_id, block, robot_no } = useParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [siteRobots, setSiteRobots] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [text, setText] = useState("");
  const [base64Text, setBase64Text] = useState("");

  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);

  const [pageInput, setPageInput] = useState("");

  let start = "C1";
  let stop = "CC";
  let returntodock = "D1";
  const [loadingRow, setLoadingRow] = useState(null); // Track the row index
  const [commandButton, setCommandButton] = useState(null); // Track the row index

  const [
    {
      loading,
      error,
      robot,
      downlinks,
      successDelete,
      loadingRobots,
      robots,
      totalPages,
      hasNextPage,
      hasPrevPage,
      sendingCommandloading,
    },
    dispatch,
  ] = useReducer(reducer, {
    downlinks: [],
    robots: [],
    robot: {},
    loading: true,
    error: "",
    loadingRobots: true,
    sendingCommandloading: false,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [customDownlink, setCustomDownlink] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const getRobots = async () => {
      try {
        dispatch({ type: "FETCH_ROBOTS_REQUEST" });
        const response = await axios.get(
          `/api/v1/robots/get-robotsno-by-site-and-block/${site_id}/${block}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );
        // robots/site/taypro_office/Block-1/
        const robotsData = response.data.data; // Ensure correct data access

        dispatch({ type: "FETCH_ROBOTS_SUCCESS", payload: robotsData });

        if (site_id) {
          const extractNumber = (robotNo) =>
            parseInt(robotNo.match(/\d+/g)?.join("") || "0", 10);

          const filteredRobots = robotsData.sort(
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

    const getRobot = async () => {
      try {
        dispatch({ type: "FETCH_ROBOT_REQUEST" });
        const response = await axios.get(
          `/api/v1/robots/get-robot-using-robot-no/${robot_no}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );

        dispatch({ type: "FETCH_ROBOT_SUCCESS", payload: response.data.data });
      } catch (error) {
        dispatch({
          type: "FETCH_ROBOT_FAIL",
          payload: error.response
            ? error.response.data.message
            : error.response.data.error,
        });
      }
    };

    getRobots();
    getRobot();
  }, [block, site_id, authtoken, robot_no]);

  useEffect(() => {
    let pagination = {
      pg: page,
      limit: limit,
    };
    const getDownlinks = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const response = await axios.post(
          `/api/v1/downlinks/get-downlinks`,
          pagination,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );

        let total = Math.ceil(
          Number(response.data.total) / Number(response.data.limit)
        );
        let next = response.data.hasNextPage;
        let prev = response.data.hasPrevPage;
        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            data: response.data.data,
            totalPages: total,
            hasNextPage: next,
            hasPrevPage: prev,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response ? error.response.data.message : error.message,
        });
      }
    };

    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      getDownlinks();
    }
  }, [successDelete, authtoken, page, limit]);

  const filteredDownlink = downlinks.filter((item) =>
    item.downlink.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteDownlink = async (downlink) => {
    if (
      window.confirm(
        `Are you sure you want to delete downlink ${downlink.downlink}🚫`
      )
    ) {
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

  const blockwiserobots =
    robots?.length > 0 ? robots.filter((robot) => robot.block === block) : [];

  const sendsingleDownlink = async (command, index) => {
    setLoadingRow(index);
    setCommandButton(index);
    //deveui,command,robot_no,site_id,lora_no
    let robotdownlink = {
      deveui: robot.deveui,
      robot_no: robot.robot_no,
      site_id: site_id,
      command: command,
      lora_no: robot.lora_no,
    };
    dispatch({ type: "SEND_DOWNLINK_REQUEST" });
    try {
      const data = await axios.post("/api/v1/robots/downlink", robotdownlink, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });

      toast.success(data.data.message);
      dispatch({ type: "SEND_DOWNLINK_SUCCESS" });
    } catch (error) {
      dispatch({
        type: "SEND_DOWNLINK_FAIL",
        payload: error.response?.data?.message || error.response.data.error,
      });

      toast.error(error.response.data.message || error.response.data.error);
    }
    setLoadingRow(null);
    setCommandButton(null);
  };
  const sendCustomDownlink = async (command) => {
    //deveui,command,robot_no,site_id,lora_no
    let robotdownlink = {
      deveui: robot.deveui,
      robot_no: robot.robot_no,
      site_id: site_id,
      command: command,
      lora_no: robot.lora_no,
    };
    dispatch({ type: "SEND_DOWNLINK_REQUEST" });
    try {
      const data = await axios.post(
        "/api/v1/robots/custom-downlink",
        robotdownlink,
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
      );

      toast.success(data.data.message);
      dispatch({ type: "SEND_DOWNLINK_SUCCESS" });
    } catch (error) {
      dispatch({
        type: "SEND_DOWNLINK_FAIL",
        payload: error.response?.data?.message || error.response?.data?.error,
      });

      toast.error(error.response.data.message || error.response?.data?.error);
    }
    setLoadingRow(null);
    setCommandButton(null);
  };

  const sendMulticastDownlink = async (command, index) => {
    let alldeveuis = blockwiserobots.map((robot) => robot.deveui); // Corrected arrow function syntax

    setCommandButton(index);
    //deveui,command,robot_no,site_id,lora_no
    let robotdownlink = {
      deveui: alldeveuis,
      block: block,
      site_id: site_id,
      command: command,
    };
    dispatch({ type: "SEND_DOWNLINK_REQUEST" });
    try {
      const data = await axios.post(
        "/api/v1/robots/multicast-downlink",
        robotdownlink,
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
      );

      toast.success(data.data.message);
      dispatch({ type: "SEND_DOWNLINK_SUCCESS" });
    } catch (error) {
      dispatch({
        type: "SEND_DOWNLINK_FAIL",
        payload: error.response?.data?.message,
      });

      toast.error(error.response.data.message || "Error adding downlink");
    }

    setCommandButton(null);
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

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    adminroute = "project-admin";
  }

  const TextToBase64 = (text) => {
    const base64 = btoa(text);
    setBase64Text(base64);
    setTimeout(() => {
      setBase64Text("");
    }, 5000);
    setText("");
    return base64;
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
              <CButton
                className="btn btn-sm btn-secondary m-1 shadow-sm"
                onClick={() => sendMulticastDownlink(start, 1)}
              >
                START ALL
              </CButton>
              <CButton
                className="btn btn-sm btn-secondary m-1 shadow-sm"
                onClick={() => sendMulticastDownlink(stop, 2)}
              >
                STOP ALL
              </CButton>
              <CButton
                className="btn btn-sm btn-secondary m-1 shadow-sm"
                onClick={() => sendMulticastDownlink(returntodock, 3)}
              >
                RETURN TO DOCK ALL
              </CButton>
              <Link
                to={`/${adminroute}/site-management/block-management/${site_id}/${block}/${robot_no}/debug_logs`}
                className="btn btn-sm btn-secondary  btn-sm m-1 shadow-sm"
              >
                DEBUG LOG
              </Link>
              <Link
                to={`/${adminroute}/site-management/block-management/${site_id}/${block}/${robot_no}/cleaning_logs`}
                className="btn btn-sm btn-secondary m-1 shadow-sm"
              >
                CLEANING LOG
              </Link>
              <Link
                to={`/${adminroute}/site-management/robot-activity`}
                className="btn btn-sm btn-secondary m-1 shadow-sm"
              >
                Robot Activity
              </Link>

              <CDropdown className="dropdown">
                {siteRobots.length > 1 ? (
                  <CDropdownToggle size="sm" className="shadow-sm ">
                    {robot.robot_no}
                  </CDropdownToggle>
                ) : (
                  <CButton
                    className={`${
                      robot.lora_state === 1 ? `` : `text-white`
                    } shadow-sm`}
                    color={`${robot.lora_state === 1 ? `danger` : `success`}`}
                    size="sm"
                  >
                    {robot.robot_no}
                  </CButton>
                )}

                <CDropdownMenu className="z-3 px-2 py-1 dropdown-menu-robot border">
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
                            {robot.robot_no}
                          </span>
                        </CTableDataCell>
                        <CTableDataCell>
                          🔋: {robot.battery_voltage}%
                        </CTableDataCell>
                        <CTableDataCell>
                          <span className="badge bg-success">
                            {robot.version}
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
                            {robot.deveui}{" "}
                          </span>
                        </CTableDataCell>
                        <CTableDataCell>Wheel Speed</CTableDataCell>
                        <CTableDataCell>
                          <CBadge
                            className="badge bg-danger"
                            shape="rounded-pill"
                          >
                            {robot.wheel_motor_speed}
                          </CBadge>
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>
                          Lora:{" "}
                          <span className="text-success">{robot.lora_no}</span>
                        </CTableDataCell>
                        <CTableDataCell>Brush Speed</CTableDataCell>
                        <CTableDataCell>
                          <CBadge
                            className="badge bg-danger"
                            shape="rounded-pill"
                          >
                            {robot.brush_motor_speed}
                          </CBadge>
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
                              robot.lora_state === "1" ? `success` : `danger`
                            }`}
                          >
                            {robot.lora_state === "1" ? `online` : `offline`}
                          </span>
                        </CTableDataCell>
                        <CTableDataCell>
                          <span className="text-secondary">
                            {robot.last_status}
                          </span>
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>
                          <span className="text-danger">
                            SC : {robot.stuck_count}
                          </span>
                        </CTableDataCell>
                        {/* <CTableDataCell>
                          {robot.last_uplink === null ? (
                            <CBadge
                              className="badge bg-danger"
                              shape="rounded-pill"
                            >
                              Robot is not activated
                            </CBadge>
                          ) : (
                            <span className="">
                              <CTooltip
                                content={new Date(
                                  robot.last_uplink
                                ).toLocaleString()}
                                placement="top"
                              >
                                <span>
                                  {formatDistanceToNow(
                                    new Date(robot.last_uplink),
                                    {
                                      addSuffix: true,
                                    }
                                  )}
                                </span>
                              </CTooltip>
                            </span>
                          )}
                        </CTableDataCell> */}
                        <CTableDataCell>
                          {!robot.last_uplink ||
                          isNaN(new Date(robot.last_uplink).getTime()) ? (
                            <CBadge
                              className="badge bg-danger"
                              shape="rounded-pill"
                            >
                              Robot is not activated
                            </CBadge>
                          ) : (
                            <span>
                              <CTooltip
                                content={new Date(
                                  robot.last_uplink
                                ).toLocaleString()}
                                placement="top"
                              >
                                <span>
                                  {formatDistanceToNow(
                                    new Date(robot.last_uplink),
                                    {
                                      addSuffix: true,
                                    }
                                  )}
                                </span>
                              </CTooltip>
                            </span>
                          )}
                        </CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </CCard>
            </CCol>

            {/* Third Card (Custom Downlink) */}
            {userInfo.role === "Master Admin" && (
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
                        name={customDownlink}
                        onChange={(e) => setCustomDownlink(e.target.value)}
                      />
                      <CButton
                        disabled={!customDownlink}
                        onClick={() => sendCustomDownlink(customDownlink)}
                        type="button"
                        className="d-flex justify-content-center align-items-center btn-sm send-button"
                      >
                        <span className="d-flex justify-content-center align-items-center">
                          {" "}
                          {sendingCommandloading ? (
                            <LoadingSpinner />
                          ) : (
                            <FaArrowUp />
                          )}
                        </span>
                      </CButton>
                    </form>
                  </CCardBody>
                </CCard>
              </CCol>
            )}
          </CRow>

          {/* Modal for Commands */}
          <CModal
            scrollable
            backdrop="static"
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
                <CTableHead color="secondary">
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
                        <LoadingSpinner />
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
                  ) : filteredDownlink.length > 0 ? (
                    filteredDownlink.map((item, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>{index + 1}</CTableDataCell>

                        <CTableDataCell>
                          <Link
                            className="text-secondary"
                            style={{ textDecoration: "none" }}
                            onClick={() =>
                              sendsingleDownlink(item.downlink, index)
                            }
                          >
                            {item.downlink}&nbsp;
                            {loadingRow === index ? <LoadingSpinner /> : ""}
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

              {/* <PaginateInput
                page={page}
                totalPages={totalPages}
                hasPrevPage={hasPrevPage}
                hasNextPage={hasNextPage}
                pageInput={pageInput}
                handlePageChange={handlePageChange}
                handlePageInputChange={handlePageInputChange}
                handlePageInputSubmit={handlePageInputSubmit}
              /> */}
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
            </CModalBody>

            <CModalFooter>
              <CButton
                size="sm"
                color="secondary"
                onClick={() => setModalVisible(false)}
              >
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
                  <CButton
                    className="btn btn-sm btn-secondary m-1 shadow"
                    onClick={() => sendsingleDownlink(start, 1)}
                  >
                    {commandButton === 1 ? (
                      <>
                        START&nbsp;
                        <LoadingSpinner />
                      </>
                    ) : (
                      "START"
                    )}
                  </CButton>
                  <CButton
                    className="btn btn-sm btn-secondary m-1 shadow-sm"
                    onClick={() => sendsingleDownlink(stop, 2)}
                  >
                    {commandButton === 2 ? (
                      <>
                        STOP&nbsp;
                        <LoadingSpinner />
                      </>
                    ) : (
                      "STOP"
                    )}
                  </CButton>
                  <CButton
                    className="btn btn-sm btn-secondary m-1 shadow-sm"
                    onClick={() => sendsingleDownlink(returntodock, 3)}
                  >
                    {commandButton === 3 ? (
                      <>
                        RETURN&nbsp;
                        <LoadingSpinner />
                      </>
                    ) : (
                      "RETURN"
                    )}
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
            {userInfo.role === "Master Admin" && (
              <CCol md={3} className="mt-2">
                <CCard className="shadow border-0 " style={{ height: "100%" }}>
                  <CCardBody>
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="fw-bold">Text to Base64</h6>
                      <span className="text-danger fst-italic">
                        {base64Text}
                      </span>
                    </div>
                    <form className="position-relative mt-4">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter value"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                      />
                      <CButton
                        onClick={() => TextToBase64(text)}
                        type="button"
                        className="d-flex justify-content-between align-items-center btn-sm position-absolute send-button"
                      >
                        <FaArrowUp />
                      </CButton>
                    </form>
                  </CCardBody>
                </CCard>
              </CCol>
            )}
          </CRow>
        </div>
      )}
    </>
  );
};

export default RobotOperating;
