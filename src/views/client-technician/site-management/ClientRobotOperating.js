import React, { useEffect, useReducer, useState } from "react";
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CButton,
  CTable,
  CTableRow,
  CTableBody,
  CTableDataCell,
  CDropdownMenu,
  CDropdownItem,
  CDropdown,
  CDropdownToggle,
  CTooltip,
  CBadge,
} from "@coreui/react";
import { useParams } from "react-router-dom";
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

    case "FETCH_ROBOTS_REQUEST":
      return { ...state, loadingRobots: true, error: "" };

    case "FETCH_ROBOTS_SUCCESS":
      return { ...state, loadingRobots: false, robots: action.payload };

    case "FETCH_ROBOTS_FAIL":
      return { ...state, loadingRobots: false, error: action.payload };

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

const ClientRobotOperating = () => {
  const { site_id, block, robot_no } = useParams();
  const [siteRobots, setSiteRobots] = useState([]);
  const authtoken = useSelector((state) => state.authtoken);

  let start = "C1";
  let stop = "CC";
  let returntodock = "D1";
  const [loadingRow, setLoadingRow] = useState(null); // Track the row index
  const [commandButton, setCommandButton] = useState(null); // Track the row index

  const [{ error, loadingRobots, robots }, dispatch] = useReducer(reducer, {
    robots: [],
    loading: true,
    error: "",
    loadingRobots: true,
    sendingCommandloading: false,
  });

  useEffect(() => {
    const getRobots = async () => {
      try {
        dispatch({ type: "FETCH_ROBOTS_REQUEST" });
        const response = await axios.get(
          `/api/v1/robots/site/${site_id}/${block}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );
        // robots/site/taypro_office/Block-1/
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

    getRobots();
  }, [block, site_id, authtoken]);

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
      deveui: Robotdata[0].deveui,
      robot_no: Robotdata[0].robot_no,
      site_id: site_id,
      command: command,
      lora_no: Robotdata[0].lora_no,
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
        payload: error.response?.data?.message,
      });

      toast.error(error.response.data.message || "Error adding downlink");
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
                <span className="">{site_id} -&nbsp;</span>
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
            <CCol md={7} className="mt-2">
              <CCard className="shadow border-0" style={{ height: "100%" }}>
                <CCardBody>
                  <CTable borderless>
                    <CTableBody>
                      <CTableRow>
                        <CTableDataCell>
                          <span className=" " style={{ fontSize: "15px" }}>
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
                          <span className=" " style={{ fontSize: "13px" }}>
                            {" "}
                          </span>
                        </CTableDataCell>
                        <CTableDataCell>Wheel Speed</CTableDataCell>
                        <CTableDataCell>
                          <CBadge
                            className="badge bg-danger"
                            shape="rounded-pill"
                          >
                            {Robotdata[0].wheel_motor_speed}
                          </CBadge>
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>
                          Deveui:
                          <span className="text-danger">
                            ({Robotdata[0].lora_no})
                          </span>
                          -
                          <span className="text-success">
                            {Robotdata[0].deveui}
                          </span>
                        </CTableDataCell>
                        <CTableDataCell>Brush Speed</CTableDataCell>
                        <CTableDataCell>
                          <CBadge
                            className="badge bg-danger"
                            shape="rounded-pill"
                          >
                            {Robotdata[0].brush_motor_speed}
                          </CBadge>
                        </CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </CCard>
            </CCol>

            {/* Second Card */}
            <CCol md={5} className="mt-2">
              <CCard className="shadow border-0 " style={{ height: "100%" }}>
                <CCardBody>
                  <CTable borderless>
                    <CTableBody>
                      <CTableRow>
                        <CTableDataCell>
                          <span
                            className={`text-${
                              Robotdata[0].lora_state === 1
                                ? `success`
                                : `danger`
                            }`}
                          >
                            {Robotdata[0].lora_state === 1
                              ? `online`
                              : `offline`}
                          </span>
                        </CTableDataCell>
                        <CTableDataCell>
                          <span className=" ">{Robotdata[0].last_status}</span>
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>
                          <span className="text-danger">
                            SC : {Robotdata[0].stuck_count}
                          </span>
                        </CTableDataCell>
                        <CTableDataCell>
                          {!Robotdata[0].last_uplink ||
                          isNaN(
                            new Date(Robotdata[0].last_uplink).getTime()
                          ) ? (
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
                          )}
                        </CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          <CRow className="my-2">
            {/* First Card - Cleaning Cycle */}
            <CCol md={4} className="mt-2">
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
            <CCol md={4} className="mt-2">
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
            <CCol md={4} className="mt-2">
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
          </CRow>
        </div>
      )}
    </>
  );
};

export default ClientRobotOperating;
