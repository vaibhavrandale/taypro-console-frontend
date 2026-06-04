import React, { useEffect, useReducer, useRef, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import Robot from "./Robot";
import RobotSidebar from "./RobotSidebar";
import { smoothScroll } from "./helpers";
import socket from "../../components/Socket";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  CCol,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CRow,
} from "@coreui/react";
import SubscriptionExpiryCard from "../../components/SubscriptionExpiryCard";

import { Link } from "react-router-dom";
import FullScreen from "./FullScreen";
import SiteSelect from "../../components/SiteSelect";
// import CleaningSummary from "./CleaningSummary";
// import bgImage from "../../assets/brand/solapannelbg.avif";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, robots: action.payload };
    case "FETCH_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
        subscriptiondata: action.subscriptiondata,
        subscriptionStatus: action.subscriptionStatus,
        robots: [], // 🔥 clear previous robots on error
      };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true };
    case "DELETE_SUCCESS":
      return {
        ...state,
        loadingDelete: false,
        deleteSuccess: true,
        // robots: state.robots.filter((r) => r._id !== action.payload), // remove deleted robot
      };

    // case "FETCH_SITES_REQUEST":
    //   return { ...state, loadingSites: true, sitesError: "" };
    // case "FETCH_SITES_SUCCESS":
    //   return { ...state, loadingSites: false, sites: action.payload };
    // case "FETCH_SITES_FAIL":
    //   return { ...state, loadingSites: false, sitesError: action.payload };

    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "DELETE_RESET":
      return { ...state, deleteSuccess: false };

    case "SOCKET_UPDATE":
      // ✅ Handle socket updates - silently update robots without showing spinner
      // Keep loading state unchanged (don't trigger loading spinner)
      return {
        ...state,
        robots: action.payload,
        // Explicitly keep loading false to prevent spinner
        loading: false,
      };

    default:
      return state;
  }
};

const RobotTracker = () => {
  const [
    {
      error,
      robots,
      loading,
      loadingDelete,
      // loadingSites,
      // sites,
      // sitesError,
      subscriptiondata,
      subscriptionStatus,
      deleteSuccess,
    },
    dispatch,
  ] = useReducer(reducer, {
    robots: [],
    loading: false,
    error: "",
    loadingDelete: false,
    // sites: [],
    // loadingSites: true,
    // sitesError: "",
    subscriptiondata: {},
    subscriptionStatus: "",
    deleteSuccess: false,
  });
  const scrollRefs = useRef({});
  const robotsRef = useRef([]);
  const pageRef = useRef(null);
  const [site_id, setSiteId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  // const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  const [selectedRobotId, setSelectedRobotId] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState("");

  // const [selectedRobot, setSelectedRobot] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const mergeLastActivity = (existing, incoming) => {
    const existingKeys = new Set(
      existing.map((a) => new Date(a.timestamp).getTime()),
    );
    const newItems = (incoming || []).filter(
      (a) => !existingKeys.has(new Date(a.timestamp).getTime()),
    );
    return [...existing, ...newItems];
  };

  // useEffect(() => {
  //   const fetchSites = async () => {
  //     dispatch({ type: "FETCH_SITES_REQUEST" });
  //     try {
  //       const res = await axios.get(`/api/v1/sites`, {
  //         // headers: { Authorization: `Bearer ${authtoken}` },
  //         withCredentials: true,
  //       });

  //       const siteData = res.data.data || [];
  //       dispatch({ type: "FETCH_SITES_SUCCESS", payload: siteData });

  //       // ✅ Immediately set siteId after fetching if user is External
  //       if (siteData.length > 0) {
  //         setSiteId(siteData[0].site_id);
  //       }
  //     } catch (err) {
  //       const errorMsg =
  //         err.response?.data?.error || err.response?.data?.message;
  //       dispatch({ type: "FETCH_SITES_FAIL", payload: errorMsg });
  //       toast.error(errorMsg);
  //     }
  //   };
  //   fetchSites();
  // }, []);

  useEffect(() => {
    if (site_id) {
      // ✅ Ensure socket is connected before joining room
      if (socket.connected) {
        socket.emit("join_site_id_room", site_id);
        console.log("✅ Joined site room:", site_id);
      } else {
        socket.once("connect", () => {
          socket.emit("join_site_id_room", site_id);
          console.log("✅ Socket connected, joined site room:", site_id);
        });
      }
    }
    return () => {
      if (site_id) {
        socket.emit("leave_site_id_room", site_id);
      }
    };
  }, [site_id]);

  // Fetch robot tracking data
  useEffect(() => {
    if (!site_id) return; // ❌ Exit if no site selected yet

    const fetchRobotTracking = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const response = await axios.post(
          "/api/v1/robot-tracking/sitewise/fetch-by-sites-and-date",
          {
            site_id: site_id,
            date: date,
          },
          {
            // headers: { Authorization: `Bearer ${authtoken}` },
            withCredentials: true,
          },
        );
        dispatch({ type: "FETCH_SUCCESS", payload: response.data.data });
        dispatch({ type: "DELETE_RESET" }); // 👈 reset flag
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data?.error || error.response?.data?.message,
          subscriptiondata: error.response?.data?.data,
          subscriptionStatus: error.response?.data?.subscriptionStatus,
        });
        toast.error(
          error.response?.data?.error || error.response?.data?.message,
        );
      }
    };
    if (deleteSuccess) {
      fetchRobotTracking();
    } else {
      fetchRobotTracking();
    }
  }, [date, site_id, deleteSuccess]);

  // ✅ Keep robotsRef in sync with robots state for smooth scroll
  useEffect(() => {
    robotsRef.current = robots;
  }, [robots]);

  useEffect(() => {
    const handleUpdate = ({ tracking }) => {
      // ✅ Silent update - no console logs to avoid unnecessary re-renders
      const newPoint = parseInt(tracking.uplink?.data || "0", 10);

      // ✅ Get current robots from ref (updated by useEffect)
      const currentRobots = robotsRef.current;
      const index = currentRobots.findIndex(
        (r) => r._id === tracking._id || r.robot_no === tracking.robot_no,
      );

      let updatedRobots;

      // ✅ Case 1: Robot already exists - update it with new data
      if (index !== -1) {
        const existing = currentRobots[index];
        updatedRobots = [...currentRobots];

        // ✅ Merge track_details intelligently (avoid duplicates)
        const existingTrackDetails = existing.track_details || [];
        const newTrackDetails = tracking.track_details || [];
        const trackDetailsMap = new Map();

        // Add existing track details to map
        existingTrackDetails.forEach((td) => {
          const key = `${td.point}_${new Date(td.timestamp).getTime()}`;
          trackDetailsMap.set(key, td);
        });

        // Add new track details (will overwrite duplicates)
        newTrackDetails.forEach((td) => {
          const key = `${td.point}_${new Date(td.timestamp).getTime()}`;
          trackDetailsMap.set(key, td);
        });

        // ✅ Update the robot with complete new data - prioritize new tracking data
        updatedRobots[index] = {
          ...tracking, // Start with new tracking data (has all latest fields)
          ...existing, // Then merge existing (for any missing fields)
          last_activity: mergeLastActivity(
            existing.last_activity || [],
            tracking.last_activity || [],
          ),
          track_details: Array.from(trackDetailsMap.values()).sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
          ),
          cleaning: {
            ...existing.cleaning,
            ...tracking.cleaning, // Merge cleaning state (includes start, finish, metrics, etc.)
          },
          uplink: tracking.uplink || existing.uplink,
          updatedAt: new Date().toISOString(),
        };
      } else {
        // ✅ Case 2: Robot not found → add as new
        updatedRobots = [tracking, ...currentRobots];
      }

      // ✅ Dispatch socket update action
      dispatch({
        type: "SOCKET_UPDATE",
        payload: updatedRobots,
      });

      // ✅ Smooth scroll update (only if it's a location point update)
      if (newPoint >= 20 && newPoint <= 40) {
        // Use setTimeout to ensure state is updated before accessing
        setTimeout(() => {
          const updatedRobots = robotsRef.current;
          const robot = updatedRobots.find(
            (r) => r._id === tracking._id || r.robot_no === tracking.robot_no,
          );
          const el = scrollRefs.current[tracking._id || robot?._id];

          if (robot && el) {
            const L = robot.row_length || 100;
            let segmentPct = 0;

            if (newPoint >= 20 && newPoint <= 29) {
              segmentPct = (newPoint - 19) / (29 - 19);
            } else if (newPoint >= 31 && newPoint <= 40) {
              segmentPct = (newPoint - 29) / (40 - 29);
            } else {
              segmentPct = newPoint / L;
            }

            const iconOffsetPx = segmentPct * L * 14; // Match SolarPannelRow calculation
            const halfWidth = el.clientWidth / 2;

            let targetScroll =
              newPoint >= 20 && newPoint <= 29
                ? iconOffsetPx - el.clientWidth * 0.25
                : newPoint >= 31 && newPoint <= 40
                  ? iconOffsetPx - el.clientWidth * 0.75
                  : iconOffsetPx - halfWidth;

            targetScroll = Math.max(
              0,
              Math.min(targetScroll, el.scrollWidth - el.clientWidth),
            );

            smoothScroll(el, targetScroll, 400);
          }
        }, 100);
      }
    };

    // ✅ Socket connection check (only log once on mount, not on every update)
    if (!socket.connected) {
      socket.once("connect", () => {
        console.log("✅ Socket connected for real-time updates");
      });
    }

    // Remove old listener before adding
    socket.off("robotPositionUpdate", handleUpdate);
    socket.on("robotPositionUpdate", handleUpdate);

    return () => {
      socket.off("robotPositionUpdate", handleUpdate);
    };
  }, [dispatch, robots]); // ✅ Add robots to dependencies to ensure fresh data
  useEffect(() => {
    // When robots are fetched, sync filtered list
    if (robots.length > 0) {
      setFilteredRobot(robots);
    }
  }, [robots]);

  const handleRobotClick = (robot) => {
    setSelectedRobotId(robot._id);
    setSidebarVisible(true); // ✅ open sidebar
  };

  const handleSidebarClose = () => setSidebarVisible(false);
  const selectedRobot = robots.find((r) => r._id === selectedRobotId);
  // Delete handler
  const deleteHandler = async (e, id) => {
    e.preventDefault();
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this robot tracking (${id})?`,
    );
    if (!confirmDelete) return; // Exit if user cancels

    dispatch({ type: "DELETE_REQUEST" });
    try {
      const response = await axios.delete(`/api/v1/robot-tracking/${id}`, {
        // headers: { Authorization: `Bearer ${authtoken}` },
        withCredentials: true,
      });
      dispatch({ type: "DELETE_SUCCESS", deleteSuccess: true });
      toast.success(response.data.message);
    } catch (error) {
      dispatch({ type: "DELETE_FAIL" });
      toast.error(error.response?.data?.error || error.response?.data?.message);
    }
  };

  const checkStatus = [
    "subscriptionSitesAssigned",
    "subscriptionFound",
    "subscriptionaRenewStatus",
    "subscriptionPaymentStatus",
    "subscriptionPlanAccess",
  ];

  const uniqueBlocks = [...new Set(robots.map((r) => r.block).filter(Boolean))];

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRobot, setFilteredRobot] = useState([]);

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 0) {
      const filtered = robots.filter((robot) =>
        robot.robot_no.toLowerCase().includes(value.toLowerCase()),
      );
      setFilteredRobot(filtered);
    } else {
      setFilteredRobot(robots);
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
  } else if (userInfo?.role === "Client Site Technician") {
    adminroute = "client-site-technician";
  } else if (userInfo?.role === "Master User") {
    adminroute = "master-user";
  } else if (userInfo?.role === "Service User") {
    adminroute = "service-user";
  } else if (userInfo?.role === "Project User") {
    adminroute = "project-user";
  } else if (userInfo?.role === "Factory Admin") {
    adminroute = "factory-admin";
  }

  let InternaladminRoles = [
    "Master Admin",
    "Service Admin",
    "Project Admin",
    "Service User",
    "Project User",
  ];
  let technicianRole = ["Site Technician"];
  let clientAdminRole = ["Client Admin"];

  return (
    <div
      className=""
      ref={pageRef}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh", // Required
        overflowY: "auto", // Required
        overflowX: "hidden",
      }}
    >
      {
        <>
          <div className="text-center my-2">
            <h5 className=" text-center text-success">Robot Tracking</h5>
          </div>
          <CRow className="d-flex justify-content-center align-items-center">
            <CCol md={2} className="mb-2">
              <CFormSelect
                id="blockSelect"
                className="p-2"
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value)}
                disabled={uniqueBlocks.length === 0}
              >
                <option value="">All Blocks</option>
                {uniqueBlocks.map((b, idx) => (
                  <option key={idx} value={b}>
                    {b}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={3} className="mb-2">
              <SiteSelect value={site_id} onChange={setSiteId} />
            </CCol>
            <CCol md={2} className="mb-2">
              <CFormInput
                type="date"
                className="p-2"
                placeholder="Search by Category..."
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </CCol>

            <CCol md={1} className="mb-2">
              <CInputGroup className="">
                <CFormInput
                  type="text"
                  placeholder="Search Robot No..."
                  value={searchTerm}
                  className="form-control"
                  onChange={handleSearchChange}
                />
              </CInputGroup>
            </CCol>
            <CCol md={1} xs={12} sm={12} className="mb-2">
              {InternaladminRoles.includes(userInfo.role) && (
                <Link
                  className="btn btn-sm btn-warning"
                  to={`/${adminroute}/all-site-cleaning-log/sitewise-cleaning-log/${site_id}`}
                >
                  Log
                </Link>
              )}

              {clientAdminRole.includes(userInfo.role) && (
                <Link
                  className="btn btn-sm btn-warning"
                  to={`/${adminroute}/cleaning-log-sites/daywise-cleaning/${site_id}`}
                >
                  Log
                </Link>
              )}

              {technicianRole.includes(userInfo.role) && (
                <Link
                  className="btn btn-sm btn-warning"
                  to={`/${adminroute}/cleaning-log-sites/${site_id}`}
                >
                  Log
                </Link>
              )}
            </CCol>

            <CCol md={1} xs={12} sm={12} className="mb-2">
              <FullScreen pageRef={pageRef} />
            </CCol>
          </CRow>
          {/* <CleaningSummary
            successFullCleaningCount={successFullCleaningCount}
            CleaninginProgressCount={CleaninginProgressCount}
            BatteryDeadCount={BatteryDeadCount}
            CleaningCancelCount={CleaningCancelCount}
            noCleaningCount={noCleaningCount}
            totalCount={totalCount}
            totalDeleted={totalDeleted}
            userInfo={userInfo}
          /> */}
          {/* {sitesError && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // height: "0vh", // centers spinner vertically
              }}
            >
              <div className="alert alert-danger w-50 text-center">
                {sitesError}
              </div>
            </div>
          )} */}
          <div className="custom-scrollbar">
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh", // centers spinner vertically
                }}
              >
                <LoadingSpinner />
              </div>
            ) : checkStatus.includes(subscriptionStatus) ? (
              <SubscriptionExpiryCard
                data={subscriptiondata}
                subscriptionStatus={subscriptionStatus}
                error={error}
              />
            ) : (
              <div
                style={{
                  overflowX: "auto",
                  height: "auto",
                  overflowY: "hidden",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {filteredRobot.length > 0 ? (
                  filteredRobot
                    .filter((r) => !selectedBlock || r.block === selectedBlock)
                    .map((robot) => (
                      <div
                        className="col-md-12 my-1"
                        key={robot._id || robot.robot_no}
                      >
                        <Robot
                          robot={robot}
                          handleRobotClick={handleRobotClick}
                          deleteHandler={(e) => deleteHandler(e, robot._id)}
                          loadingDelete={loadingDelete}
                        />
                      </div>
                    ))
                ) : (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      // height: "50vh", // centers spinner vertically
                    }}
                  >
                    <div className="alert alert-danger w-50 text-center">
                      No Robots Tracking Found on {date}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      }

      {/* Sidebar and Footer remain exactly the same */}
      {/* Sidebar */}
      {selectedRobot && (
        <RobotSidebar
          deleteHandler={deleteHandler}
          robot={selectedRobot}
          visible={sidebarVisible}
          onClose={handleSidebarClose}
          userInfo={userInfo}
        />
      )}
      {/*footer */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          padding: "5px 5px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "15px",
          backgroundColor: "#080f25",
          zIndex: 50,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: "#FFA000",
            }}
          ></div>
          <span>Running</span>
        </div>
        |
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: "#4CAF50",
            }}
          ></div>
          <span>At Dock/Cleaning Completed</span>
        </div>
        |
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: "#ff0000ab",
            }}
          ></div>
          <span>Cancelled/Stuck/Battery Dead</span>
        </div>
        |
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: "#ffffff",
            }}
          ></div>
          <span>No Cleaning</span>
        </div>
      </div>
    </div>
  );
};

export default RobotTracker;
