import React, { useState, useEffect, useReducer } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  CButton,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CInputGroup,
  CFormInput,
  CRow,
  CCol,
  CContainer,
  CCard,
  CCardHeader,
  CCardBody,
  CTooltip,
  CBadge,
} from "@coreui/react";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_BLOCKDATA_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_BLOCKDATA_SUCCESS":
      return {
        ...state,
        loading: false,
        robots: action.payload.robots,
        blocks: action.payload.blocks,
      };
    case "FETCH_BLOCKDATA_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "SEND_DOWNLINK_REQUEST":
      return { ...state, Commandloading: true, commandError: "" };
    case "SEND_DOWNLINK_SUCCESS":
      return {
        ...state,
        Commandloading: false,
      };
    case "SEND_DOWNLINK_FAIL":
      return { ...state, Commandloading: false, commandError: action.payload };
    default:
      return state;
  }
};

const BlockManagement = () => {
  const [
    { error, robots, blocks, loading, commandError, Commandloading },
    dispatch,
  ] = useReducer(reducer, {
    robots: [],
    blocks: [],
    loading: false,
    Commandloading: false,
    commandError: "",
  });

  const navigate = useNavigate();
  // const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  const { site_id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [visible, setVisible] = useState(false);
  const [sitename, setSitename] = useState("");
  const [sitelocation, setSitLocation] = useState("");
  // NEW STATES for block-level modal
  const [blockModalVisible, setBlockModalVisible] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_BLOCKDATA_REQUEST" });
      try {
        const result = await axios.get(
          `/api/v1/robots/site-management/${site_id}`,
          {
            // headers: { Authorization: `Bearer ${authtoken}` },
            withCredentials: true,
          },
        );

        dispatch({
          type: "FETCH_BLOCKDATA_SUCCESS",
          payload: {
            robots: result.data.data.robots || [],
            blocks: result.data.data.blocks || [],
          },
        });
        setSitename(result.data.data?.site_name || "Unknown");
        setSitLocation(result.data.data?.location || "Unknown");
      } catch (error) {
        dispatch({
          type: "FETCH_BLOCKDATA_FAIL",
          payload: error.message || "Failed to fetch data",
        });
        toast.error("Failed to fetch block data");
      }
    };

    fetchData();
  }, [site_id]);

  const sendMulticastDownlink = async () => {
    if (
      !window.confirm(
        `Are you sure you want Stop All Robots at ${sitename}, ${sitelocation}?`,
      )
    ) {
      return;
    }

    let alldeveuis = robots.map((robot) => robot.deveui); // Corrected arrow function syntax

    //deveui,command,robot_no,site_id,lora_no
    let robotdownlink = {
      deveui: alldeveuis,
      block: "All",
      site_id: site_id,
      command: "14",
    };
    dispatch({ type: "SEND_DOWNLINK_REQUEST" });
    try {
      const data = await axios.post(
        "/api/v1/robots/send-mqtt-multicast-downlink",
        robotdownlink,
        {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        },
      );

      toast.success(data.data.message);
      dispatch({ type: "SEND_DOWNLINK_SUCCESS" });
    } catch (error) {
      dispatch({
        type: "SEND_DOWNLINK_FAIL",
        payload: error.response?.data?.message || error.response.data.error,
      });

      toast.error(error.response.data.message || error.response.data.error);
    }
  };

  const filteredRobots = Array.isArray(robots)
    ? robots
        .filter((robot) => {
          const term = searchTerm.toLowerCase();

          return (
            (robot.robot_no || "").toLowerCase().includes(term) ||
            (robot.deveui || "").toLowerCase().includes(term) ||
            (robot.block || "").toLowerCase().includes(term) ||
            (robot.company || "").toLowerCase().includes(term)
          );
        })
        .sort((a, b) => (a.robot_no || "").localeCompare(b.robot_no || ""))
    : [];

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
  } else if (userInfo?.role === "Factory Admin") {
    adminroute = "factory-admin";
  }
  // const getRobotsByBlock = (blockName) =>
  //   robots.filter((robot) => robot.block === blockName);

  const sortedBlocks = [...blocks].sort((a, b) =>
    (a.block_name || "").localeCompare(b.block_name || "", undefined, {
      numeric: true,
      sensitivity: "base",
    }),
  );
  return (
    <div className="min-vh-90 d-flex flex-column align-items-center">
      <h4 className="p-2 text-center text-success">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <h4>{error}</h4>
        ) : (
          <span>
            {sitename}, {sitelocation}
          </span>
        )}
      </h4>
      <div className="p-2 d-flex justify-content-center">
        <div className="d-flex">
          <CButton
            className="btn btn-secondary btn-sm me-2"
            size="sm"
            onClick={() => setVisible(!visible)}
          >
            All Robot Data
          </CButton>
          <CButton
            className="btn btn-secondary btn-sm"
            size="sm"
            disabled={robots.length === 0 || Commandloading}
            onClick={() => sendMulticastDownlink()}
          >
            {Commandloading ? "Sending..." : "Stop All"}
          </CButton>
        </div>

        <CModal
          backdrop="static"
          size="xl"
          scrollable
          visible={visible}
          onClose={() => setVisible(false)}
        >
          <CModalHeader closeButton={false}>
            <CModalTitle>
              <span className="text-success">
                {sitename}, {sitelocation}
              </span>{" "}
              - Robots Details
            </CModalTitle>
            <button
              type="button"
              className=" border-0 ms-auto py-0 px-1"
              onClick={() => setVisible(false)}
              style={{ background: "none" }}
            >
              <CIcon icon={cilX} size="lg" />
            </button>
          </CModalHeader>
          <CModalBody>
            <CRow className="align-items-center mb-3">
              {/* Left side – badges */}
              <CCol xs={12} md={8}>
                <div className="d-flex align-items-center flex-wrap gap-3">
                  <CBadge
                    color="success"
                    className="px-3 py-2"
                    shape="rounded-pill"
                  >
                    Online:{" "}
                    <span>
                      {robots.filter((r) => r.lora_state === 1).length}
                    </span>
                  </CBadge>

                  <CBadge
                    color="danger"
                    className="px-3 py-2"
                    shape="rounded-pill"
                  >
                    Offline:{" "}
                    <span>
                      {robots.filter((r) => r.lora_state === 0).length}
                    </span>
                  </CBadge>

                  <CBadge
                    color="warning"
                    className="px-3 py-2"
                    shape="rounded-pill"
                  >
                    Cleaning In Progress:{" "}
                    <span>
                      {
                        robots.filter(
                          (r) =>
                            r.last_status === "Cleaning Started" &&
                            r.lora_state === 1,
                        ).length
                      }
                    </span>
                  </CBadge>

                  <CBadge
                    color="primary"
                    className="px-3 py-2"
                    shape="rounded-pill"
                  >
                    Total Robots: <span>{robots.length}</span>
                  </CBadge>
                </div>
              </CCol>

              {/* Right side – search */}
              <CCol xs={12} md={4}>
                <CInputGroup>
                  <CFormInput
                    type="text"
                    placeholder="Search Robot..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </CInputGroup>
              </CCol>
            </CRow>

            <CTable responsive hover bordered>
              <CTableHead color="secondary">
                <CTableRow>
                  <CTableHeaderCell className="text-center">
                    Sr
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center">
                    Robot No
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center">
                    Lora No
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center">
                    Deveui
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center">
                    Battery
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center">
                    Status
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center">
                    Block
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center">
                    Firmware Version
                  </CTableHeaderCell>
                  {/* <CTableHeaderCell className="text-center">
                    timer1
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center">
                    timer2
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center">
                    timer3
                  </CTableHeaderCell> */}
                  <CTableHeaderCell className="text-center">
                    Last Status
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center">
                    Last Uplink
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredRobots.length > 0 ? (
                  filteredRobots.map((robot, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell className="text-center">
                        {index + 1}
                      </CTableDataCell>
                      <CTableDataCell
                        className="text-center"
                        style={{ width: "200px", whiteSpace: "nowrap" }}
                      >
                        {robot.robot_no}
                      </CTableDataCell>

                      <CTableDataCell className="text-center">
                        {robot.lora_no ? (
                          robot.lora_no
                        ) : (
                          <CBadge color="secondary">N/A</CBadge>
                        )}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {robot.deveui}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {robot.battery_voltage} %
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {robot.lora_state === 1 ? (
                          <CBadge color="success">Online</CBadge>
                        ) : (
                          <CBadge color="danger">Offline</CBadge>
                        )}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {robot.block}
                      </CTableDataCell>
                      <CTableDataCell className="text-center ">
                        <CBadge color="warning" className="m-1 fw-light">
                          FW: {robot.version}
                        </CBadge>
                        <CBadge color="warning">
                          PCB: {robot.pcb_version}
                        </CBadge>
                      </CTableDataCell>
                      {/* <CTableDataCell className="text-center">
                        {robot.timer1}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {robot.timer2}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {robot.timer3}
                      </CTableDataCell> */}
                      <CTableDataCell className="text-center">
                        {robot.last_status}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {robot.last_uplink
                          ? new Date(robot.last_uplink).toLocaleString(
                              "en-GB",
                              {
                                year: "numeric",
                                month: "short",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true,
                              },
                            )
                          : "N/A"}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="12" className="text-center">
                      No matching robots found
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </CModalBody>
        </CModal>
      </div>
      {/* === BADGES ROW === */}
      <div className="d-flex justify-content-center align-items-center flex-wrap gap-3">
        <CBadge color="success" className="px-3 py-2" shape="rounded-pill">
          Online: <span>{robots.filter((r) => r.lora_state === 1).length}</span>
        </CBadge>

        <CBadge color="danger" className="px-3 py-2" shape="rounded-pill">
          Offline:{" "}
          <span>{robots.filter((r) => r.lora_state === 0).length}</span>
        </CBadge>
        <CBadge color="warning" className="px-3 py-2" shape="rounded-pill">
          Cleaning In Progress:{" "}
          <span>
            {
              robots.filter(
                (r) =>
                  r.last_status === "Cleaning Started" && r.lora_state === 1,
              ).length
            }
          </span>
        </CBadge>

        <CBadge color="primary" className="px-3 py-2" shape="rounded-pill">
          Total Robots: <span>{robots.length}</span>
        </CBadge>
      </div>
      <div className="m-2 w-100 align-self-stretch px-3">
        <CRow className="mt-4 justify-content-start g-3">
          {/* mapping blocks */}
          {sortedBlocks
            .map((block, index) => {
              const robot = block.blockrobots
                ? block.blockrobots.sort((a, b) =>
                    (a.robot_no || "").localeCompare(b.robot_no || ""),
                  )
                : null; // Handle single robot object
              return (
                <CCol md={4} className="my-2" key={index}>
                  <CCard className="h-100 d-flex flex-column border border-primary shadow-sm rounded-0">
                    <CCardHeader className="text-center fw-bold border-bottom border-primary rounded-0">
                      {block.block_name}
                    </CCardHeader>
                    <CCardBody className="d-flex flex-column flex-grow-1">
                      <div className="d-flex flex-row justify-content-between p-1">
                        <CCol md={3}>
                          <p className="text-center">Total</p>
                          <p className="text-primary fw-bold text-center">
                            {block.total_robot_count}
                          </p>
                        </CCol>
                        <CCol md={3}>
                          <p className="text-center">Online</p>
                          <p className="text-success fw-bold text-center">
                            {block.online}
                          </p>
                        </CCol>
                        <CCol md={3}>
                          <p className="text-center">Running</p>
                          <p className="text-success fw-bold text-center">
                            {block.running}
                          </p>
                        </CCol>
                        <CCol md={3}>
                          <p className="text-center">Offline</p>
                          <p className="text-danger fw-bold text-center">
                            {block.offline}
                          </p>
                        </CCol>
                      </div>

                      <div className="d-flex justify-content-center flex-wrap align-items-center flex-grow-1 mx-3 ">
                        {robot.map((item, index) => (
                          <CTooltip
                            key={index}
                            content={item.last_status}
                            placement="top"
                          >
                            <span
                              className={`tooltip-container p-2 m-1 badge p-1 rounded-1 ${
                                item.lora_state === 1
                                  ? "bg-success"
                                  : "bg-danger"
                              }`}
                            >
                              <div
                                onClick={() =>
                                  navigate(
                                    `/${adminroute}/site-management/block-management/${site_id}/${block.block_name}/${item.robot_no}`,
                                  )
                                }
                              >
                                {item.robot_no.slice(-3)}
                              </div>
                            </span>
                          </CTooltip>
                        ))}
                      </div>
                    </CCardBody>
                    <div className="p-2 d-flex justify-content-center gap-2">
                      {robot ? (
                        <>
                          <Link
                            to={`/${adminroute}/site-management/block-management/${site_id}/${block.block_name}/${block.blockrobots[0].robot_no}`}
                            className="btn btn-sm btn-secondary"
                          >
                            MANAGE
                          </Link>

                          <CButton
                            color="info"
                            size="sm"
                            onClick={() => {
                              setSelectedBlock(block); // choose block
                              setBlockModalVisible(true); // open single modal
                            }}
                          >
                            View Details
                          </CButton>
                        </>
                      ) : (
                        <CButton disabled className="btn-sm btn-secondary">
                          No Robots
                        </CButton>
                      )}
                    </div>

                    {/* 🔹 Single Global Block Modal */}
                    <CModal
                      backdrop="static"
                      size="lg"
                      scrollable
                      visible={blockModalVisible}
                      onClose={() => setBlockModalVisible(false)}
                    >
                      <CModalHeader closeButton={false}>
                        <CModalTitle>
                          <span className="text-primary">
                            {selectedBlock?.block_name}
                          </span>{" "}
                          - Robots
                        </CModalTitle>
                        <button
                          type="button"
                          className="border-0 ms-auto py-0 px-1 bg-transparent"
                          onClick={() => setBlockModalVisible(false)}
                        >
                          <CIcon icon={cilX} size="lg" />
                        </button>
                      </CModalHeader>

                      <CModalBody>
                        <CTable responsive bordered hover>
                          <CTableHead color="secondary">
                            <CTableRow>
                              <CTableHeaderCell className="text-center">
                                Sr
                              </CTableHeaderCell>
                              <CTableHeaderCell className="text-center">
                                Robot No
                              </CTableHeaderCell>
                              <CTableHeaderCell className="text-center">
                                Status
                              </CTableHeaderCell>
                              <CTableHeaderCell className="text-center">
                                Battery (%)
                              </CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>

                          <CTableBody>
                            {selectedBlock?.blockrobots &&
                            selectedBlock.blockrobots.length > 0 ? (
                              selectedBlock.blockrobots.map((r, index) => (
                                <CTableRow key={index}>
                                  <CTableDataCell className="text-center">
                                    {index + 1}
                                  </CTableDataCell>
                                  <CTableDataCell className="text-center">
                                    {r.robot_no}
                                  </CTableDataCell>
                                  <CTableDataCell className="text-center">
                                    {r.lora_state === 1 ? (
                                      <span className="text-success fw-bold">
                                        Online
                                      </span>
                                    ) : (
                                      <span className="text-danger fw-bold">
                                        Offline
                                      </span>
                                    )}
                                  </CTableDataCell>
                                  <CTableDataCell className="text-center">
                                    {r.battery_voltage !== undefined ? (
                                      <span
                                        className={`fw-bold ${
                                          r.battery_voltage < 20
                                            ? "text-danger"
                                            : r.battery_voltage < 50
                                              ? "text-warning"
                                              : "text-success"
                                        }`}
                                      >
                                        {r.battery_voltage}%
                                      </span>
                                    ) : (
                                      "-"
                                    )}
                                  </CTableDataCell>
                                </CTableRow>
                              ))
                            ) : (
                              <CTableRow>
                                <CTableDataCell
                                  colSpan="4"
                                  className="text-center text-muted"
                                >
                                  No Robots Found
                                </CTableDataCell>
                              </CTableRow>
                            )}
                          </CTableBody>
                        </CTable>
                      </CModalBody>
                    </CModal>
                  </CCard>
                </CCol>
              );
            })
            .sort((a, b) => (a.robot_no || "").localeCompare(b.robot_no || ""))}
        </CRow>
      </div>
    </div>
  );
};

export default BlockManagement;
