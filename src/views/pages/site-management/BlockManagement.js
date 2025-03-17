import React, { useState, useEffect, useReducer } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
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
  CInputGroup,
  CFormInput,
} from "@coreui/react";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import "./management.css";
import LoadingSpinner from "../../../components/LoadingSpinner";

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
      return { ...state, loadingRobots: false, robots: action.payload };
    case "FETCH_ROBOTS_FAIL":
      return { ...state, loadingRobots: false, error: action.payload };

    case "SET_SITE_DATA":
      return {
        ...state,
        siteRobots: action.payload.siteRobots,
        siteName: action.payload.siteName,
        siteLocation: action.payload.siteLocation,
        blocks: action.payload.blocks,
        totalAssigned: action.payload.totalAssigned,
        totalOnline: action.payload.totalOnline,
        totalOffline: action.payload.totalOffline,
        totalRunning: action.payload.totalRunning,
      };

    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };

    default:
      return state;
  }
};

const BlockManagement = () => {
  const [{ loadingRobots, loadingSites, error, robots, sites }, dispatch] =
    useReducer(reducer, {
      sites: [],
      robots: [],
      loadingRobots: false,
      loadingSites: false,
      error: "",
    });
  const authtoken = useSelector((state) => state.authtoken);
  const { site_id } = useParams();
  const [blocks, setBlocks] = useState({});
  const [siteName, setSiteName] = useState("");
  const [siteLocation, setSiteLocation] = useState("");
  const [totalAssigned, setTotalAssigned] = useState(0);
  const [totalOnline, setTotalOnline] = useState(0);
  const [totalOffline, setTotalOffline] = useState(0);
  const [totalRunning, setTotalRunning] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchSites = async () => {
      dispatch({ type: "FETCH_SITES_REQUEST" });
      try {
        const { data } = await axios.get("/api/v1/sites", {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        dispatch({ type: "FETCH_SITES_SUCCESS", payload: data.data });
        console.log(data.data);
      } catch (error) {
        dispatch({
          type: "FETCH_SITES_FAIL",
          payload: "Failed to fetch sites",
        });
        toast.error("Failed to fetch sites");
      }
    };

    const fetchRobots = async () => {
      dispatch({ type: "FETCH_ROBOTS_REQUEST" });
      try {
        const result = await axios.get(`/api/v1/robots/site/${site_id}`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        dispatch({ type: "FETCH_ROBOTS_SUCCESS", payload: result.data.data });
      } catch (error) {
        dispatch({
          type: "FETCH_ROBOTS_FAIL",
          payload: "Failed to fetch robots",
        });
        toast.error("Failed to fetch robots");
      }
    };

    fetchSites();
    fetchRobots();
  }, [authtoken, site_id]);

  useEffect(() => {
    if (site_id && sites.length && robots.length) {
      const filteredRobots = robots.filter(
        (robot) => robot.site_id === site_id
      );
      const siteData = sites.find((site) => site.site_id === site_id);
      if (!siteData) {
        toast.error("Site not found");
        return;
      }
      setSiteName(siteData.siteName);
      setSiteLocation(siteData.location);
      const blockData = {};
      let assignedCount = 0,
        onlineCount = 0,
        offlineCount = 0,
        runningCount = 0;

      filteredRobots.forEach((robot) => {
        if (!blockData[robot.block]) {
          blockData[robot.block] = {
            id: robot.block,
            assigned: 0,
            running: 0,
            online: 0,
            offline: 0,
            robots: [],
          };
        }
        blockData[robot.block].assigned++;
        assignedCount++;
        if (robot.lora_state === 1) {
          blockData[robot.block].online++;
          onlineCount++;
        } else {
          blockData[robot.block].offline++;
          offlineCount++;
        }
        if (robot.last_status === "Cleaning Started") {
          blockData[robot.block].running++;
          runningCount++;
        }
        blockData[robot.block].robots.push(robot);
      });
      setBlocks(blockData);
      setTotalAssigned(assignedCount);
      setTotalOnline(onlineCount);
      setTotalOffline(offlineCount);
      setTotalRunning(runningCount);
    }
  }, [site_id, sites, robots]);

  const filteredRobotsData = robots.filter(
    (robot) =>
      robot.robot_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      robot.deveui.toLowerCase().includes(searchTerm.toLowerCase()) ||
      robot.block.toLowerCase().includes(searchTerm.toLowerCase()) ||
      robot.company.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="min-vh-90 d-flex flex-column align-items-center">
      <h4 className="p-2 text-center text-primary">
        {loadingRobots && loadingSites ? (
          <LoadingSpinner />
        ) : error ? (
          <h4>{error}</h4>
        ) : (
          <span>
            {siteName}, {siteLocation}
          </span>
        )}
      </h4>
      <div className="p-2 d-flex justify-content-center">
        <CButton
          className="btn btn-secondary btn-sm"
          size="sm"
          onClick={() => setVisible(!visible)}
        >
          All Robot Data
        </CButton>

        <CModal
          backdrop="static"
          size="xl"
          scrollable
          visible={visible}
          onClose={() => setVisible(false)}
          aria-labelledby="StaticBackdropExampleLabel"
        >
          <CModalHeader>
            <CModalTitle id="StaticBackdropExampleLabel">
              <span className="text-primary">
                {siteName}, {siteLocation} -
              </span>{" "}
              Robots Details
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow className="justify-content-end">
              <CCol xs={12} sm={10} md={6} lg={4}>
                <CInputGroup className="mb-3">
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
                  <CTableHeaderCell
                    className="text-center"
                    scope="col"
                    style={{ minWidth: "20px" }}
                  >
                    Sr
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    className="text-center"
                    scope="col"
                    style={{ minWidth: "120px" }}
                  >
                    Robot No
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    className="text-center"
                    scope="col"
                    style={{ minWidth: "120px" }}
                  >
                    deveui
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    className="text-center"
                    scope="col"
                    style={{ minWidth: "120px" }}
                  >
                    Lora State
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    className="text-center"
                    scope="col"
                    style={{ minWidth: "120px" }}
                  >
                    Block
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {loadingRobots && loadingSites ? (
                  <CTableRow>
                    <CTableDataCell colSpan="5" className="text-center fw-bold">
                      <LoadingSpinner />
                    </CTableDataCell>
                  </CTableRow>
                ) : error ? (
                  <CTableRow>
                    <CTableDataCell colSpan="5" className="text-center fw-bold">
                      {error}
                    </CTableDataCell>
                  </CTableRow>
                ) : filteredRobotsData.length > 0 ? (
                  filteredRobotsData.map((item, index) => (
                    <CTableRow key={index}>
                      <CTableHeaderCell
                        scope="row"
                        style={{ minWidth: "20px" }}
                      >
                        {index + 1}
                      </CTableHeaderCell>
                      <CTableDataCell style={{ minWidth: "120px" }}>
                        {item.robot_no}
                      </CTableDataCell>
                      <CTableDataCell style={{ minWidth: "120px" }}>
                        {item.deveui}
                      </CTableDataCell>
                      <CTableDataCell style={{ minWidth: "120px" }}>
                        {item.lora_state === 1 ? (
                          <span className="badge bg-success">Online</span>
                        ) : (
                          <span className="badge bg-danger">Offline</span>
                        )}
                      </CTableDataCell>
                      <CTableDataCell style={{ minWidth: "120px" }}>
                        {item.block}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="5" className="text-center fw-bold">
                      No Robots Found
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </CModalBody>
          <CModalFooter className="d-flex justify-content-center">
            <span className="fw-bold text-primary">
              A Complete Robot Monitoring Console
            </span>
          </CModalFooter>
        </CModal>
      </div>

      {/* Block Display with Manage Button */}
      <CContainer>
        <CRow className="mt-4 justify-content-center">
          {Object.keys(blocks).map((blockId) => {
            const block = blocks[blockId];

            // Ensure robots are sorted and select the first robot
            const firstRobot = block.robots.length > 0 ? block.robots[0] : null;

            return (
              <CCol md={4} className="my-2" key={block.id}>
                <CCard className="h-100 d-flex flex-column border-0 shadow-sm">
                  <CCardHeader className="text-center fw-bold border">
                    {block.id}
                  </CCardHeader>
                  <CCardBody className="d-flex flex-column flex-grow-1">
                    <div className="d-flex flex-row justify-content-between p-1">
                      <CCol md={3}>
                        <p className="text-center">Assigned</p>
                        <p className="text-danger fw-bold text-center">
                          {block.assigned}
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

                    {/* Robot List Display */}
                    <div className="d-flex justify-content-center flex-wrap align-items-center flex-grow-1">
                      {block.robots.map((robot, index) => {
                        const robotNumberMatch = robot.robot_no.match(/\d+/g);
                        const robotNumber = robotNumberMatch
                          ? robotNumberMatch.join("")
                          : "000";
                        const lastThreeDigits = robotNumber.slice(-3);

                        return (
                          <span
                            key={index}
                            className={`tooltip-container m-1 badge ${
                              robot.lora_state === 1
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            {lastThreeDigits}
                            <span className="tooltip-text">
                              {robot.last_status}
                            </span>
                          </span>
                        );
                      })}
                    </div>
                  </CCardBody>

                  {/* Manage Button with First Robot */}
                  <div className="p-2 d-flex justify-content-center">
                    {firstRobot ? (
                      <Link
                        to={`/master-admin/site-management/block-management/${site_id}/${block.id}/${firstRobot.robot_no}`}
                        className="btn btn-sm btn btn-secondary"
                        size="sm"
                      >
                        MANAGE
                      </Link>
                    ) : (
                      <CButton disabled className="btn-sm btn-secondary">
                        No Robots
                      </CButton>
                    )}
                  </div>
                </CCard>
              </CCol>
            );
          })}
        </CRow>
      </CContainer>
    </div>
  );
};

export default BlockManagement;
