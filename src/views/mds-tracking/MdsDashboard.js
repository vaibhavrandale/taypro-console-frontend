import React, { useEffect, useReducer, useRef, useState } from "react";
import MdsRowTrack from "./MdsRowTrack";
import Robot from "./Robot";
import MdsRailingTrack from "./MdsRailingTrack";
import { CCol, CFormInput, CFormSelect, CRow } from "@coreui/react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import socket from "../../components/Socket";
import { FaArrowUp } from "react-icons/fa";
import {
  calculateRobotPosition,
  getMdsStatus,
  mergeLastActivity,
  mergeRows,
  mergeUniqueArrayByKey,
} from "./mdsTrackingHelper";
import { Link, useNavigate } from "react-router-dom";
import MdsSidebar from "./MdsSidebar";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };

    case "FETCH_SUCCESS":
      // ✅ Check if payload is a function (state updater)
      const updatedMdsDevices =
        typeof action.payload === "function"
          ? action.payload(state.mdsdevices)
          : action.payload;

      return {
        ...state,
        loading: false,
        mdsdevices: updatedMdsDevices,
      };

    case "FETCH_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
        mdsdevices: [],
      };

    case "FETCH_MDS_DEVICES_REQUEST":
      return { ...state, mdsdevicesLoading: true, error: "" };

    case "FETCH_MDS_DEVICES_SUCCESS":
      return {
        ...state,
        mdsdevicesLoading: false,
        allMdsDevices: action.payload,
      };

    case "FETCH_MDS_DEVICES_FAIL":
      return {
        ...state,
        mdsdevicesLoading: false,
        mdsError: action.payload,
      };

    case "FETCH_SITES_REQUEST":
      return { ...state, loadingSites: true, sitesError: "" };
    case "FETCH_SITES_SUCCESS":
      return { ...state, loadingSites: false, sites: action.payload };
    case "FETCH_SITES_FAIL":
      return { ...state, loadingSites: false, sitesError: action.payload };
    default:
      return state;
  }
};

const MdsDashboard = () => {
  const navigate = useNavigate();
  const [
    {
      error,
      mdsdevices,
      loading,

      loadingSites,
      sites,
      sitesError,
      mdsError,
      allMdsDevices,
      mdsdevicesLoading,
    },
    dispatch,
  ] = useReducer(reducer, {
    mdsdevices: [],
    loading: true,
    error: "",
    sendCommandError: "",
    sendingCommandloading: false,
    sites: [],
    loadingSites: true,
    sitesError: "",
    allMdsDevices: [],
    mdsdevicesLoading: false,
    mdsError: "",
  });

  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);

  const [site_id, setSiteId] = useState("");
  const [mdsDevice, setMdsDevice] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedMdsDeviceId, setSelectedMdsDeviceId] = useState(null);
  const mdsRef = useRef([]);

  useEffect(() => {
    const fetchSites = async () => {
      dispatch({ type: "FETCH_SITES_REQUEST" });
      try {
        const res = await axios.get(`/api/v1/sites`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });

        const siteData = res.data.data || [];
        dispatch({ type: "FETCH_SITES_SUCCESS", payload: siteData });

        // ✅ Immediately set siteId after fetching if user is External
        if (siteData.length > 0) {
          setSiteId(siteData[0].site_id);
        }
      } catch (err) {
        const errorMsg =
          err.response?.data?.error || err.response?.data?.message;
        dispatch({ type: "FETCH_SITES_FAIL", payload: errorMsg });
        toast.error(errorMsg);
      }
    };
    fetchSites();
  }, [authtoken]);

  useEffect(() => {
    if (site_id) {
      socket.emit("join_mds_site_id_room", site_id);
      console.log("Joined site:", site_id);
    }
    return () => socket.emit("leave_mds_site_id_room", site_id);
  }, [site_id]);

  useEffect(() => {
    if (!site_id) return;
    const fetchmdsTracking = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const response = await axios.post(
          "/api/v1/mds-tracking/sitewise/fetch-by-sites-and-date",
          {
            site_id: site_id,
            date: date,
          },
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: response.data.data });
      } catch (err) {
        const msg = err.response?.data?.error || err.response?.data?.message;
        dispatch({ type: "FETCH_FAIL", payload: msg });
        toast.error(msg);
      }
    };

    // /get-mdsno-by-site-and-block/:site_id/:block
    if (site_id) {
      const fetchAllmdsdevices = async () => {
        dispatch({ type: "FETCH_MDS_DEVICES_REQUEST" });
        try {
          const response = await axios.get(
            `/api/v1/mds-device/get-mdsno-by-site-and-block/${site_id}/Block-1`,
            {
              headers: { Authorization: `Bearer ${authtoken}` },
            }
          );
          dispatch({
            type: "FETCH_MDS_DEVICES_SUCCESS",
            payload: response.data.data,
          });
        } catch (err) {
          const msg = err.response?.data?.error || err.response?.data?.message;
          dispatch({ type: "FETCH_MDS_DEVICES_FAIL", payload: msg });
          toast.error(msg);
        }
      };
      fetchAllmdsdevices();
    }
    fetchmdsTracking();
  }, [authtoken, date, site_id]);

  mdsRef.current = mdsdevices;

  const handleMdsUpdate = ({ tracking }) => {
    toast.success(`${tracking.mds_no} Updated`, { position: "top-right" });

    dispatch({
      type: "FETCH_SUCCESS",
      payload: () => {
        const index = mdsRef.current.findIndex(
          (m) => m._id === tracking._id || m.mds_no === tracking.mds_no
        );

        if (index !== -1) {
          const existing = mdsRef.current[index];

          // console.log(existing);
          const mergedPositions = mergeUniqueArrayByKey(
            existing.mds_positions || [],
            tracking.mds_positions || [],
            "row_number"
          );

          const mergedActivity = mergeLastActivity(
            existing.last_activity || [],
            tracking.last_activity || []
          );

          const mergedRows = mergeRows(
            existing.rows || [],
            tracking.rows || []
            // "_id"
          );

          const updated = [...mdsRef.current];
          updated[index] = {
            ...existing,
            ...tracking,
            mds_positions: mergedPositions,
            last_activity: mergedActivity,
            rows: mergedRows,
            updatedAt: new Date().toISOString(),
          };
          console.log(mergedRows);

          return updated;
        }

        // New MDS → add at the start
        return [tracking, ...mdsRef.current];
        // return [...prevMdsDevices, tracking];
      },
    });
  };

  useEffect(() => {
    // Remove old listener first
    socket.off("emitMdsUpdate", handleMdsUpdate);
    socket.on("emitMdsUpdate", handleMdsUpdate);

    return () => socket.off("emitMdsUpdate", handleMdsUpdate);
  }, [dispatch]);

  const handleOpenSidebar = (mdsDevice) => {
    // Example: you can store selected device in state
    setSelectedMdsDeviceId(mdsDevice._id);
    setIsSidebarOpen(true);
  };

  const selectedMDS = mdsdevices.find((r) => r._id === selectedMdsDeviceId);

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
  }

  return (
    <div className="p-2" style={{ display: "flex", flexDirection: "column" }}>
      {(loadingSites || loading) && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "70vh",
          }}
        >
          <LoadingSpinner />
        </div>
      )}
      {sitesError ||
        (error && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "70vh",
            }}
          >
            <h5 className="text-light">{sitesError || error}</h5>
          </div>
        ))}
      {!loadingSites && !loading && (
        <>
          <CRow className="m-1 d-flex justify-content-between align-items-center">
            <CCol md={3}>
              <h4 className="text-light text-center text-success">
                MDS And Robot Tracking
              </h4>
            </CCol>
            <CCol md={3}>
              <CFormSelect
                id="siteSelect"
                className="p-2 m-2"
                value={site_id}
                onChange={(e) => setSiteId(e.target.value)}
              >
                <option value="">Select Site</option>
                {sites?.map((site, index) => (
                  <option key={index} value={site.site_id}>
                    {site.site_id}
                  </option>
                ))}
              </CFormSelect>
            </CCol>

            {allMdsDevices && allMdsDevices.length > 0 && (
              <CCol md={3}>
                <CFormSelect
                  id="siteSelect"
                  className="p-2 m-2"
                  value={mdsDevice}
                  onChange={(e) => {
                    const selectedMds = allMdsDevices.find(
                      (mds) => mds.mds_no === e.target.value
                    );

                    if (selectedMds) {
                      setMdsDevice(e.target.value);
                      navigate(
                        `/${adminroute}/mds/site-management/block-management/${selectedMds.site_id}/${selectedMds.block}/${selectedMds.mds_no}`
                      );
                    }
                  }}
                >
                  <option value="">Select MDS</option>

                  {allMdsDevices.map((mds, index) => (
                    <option key={index} value={mds.mds_no}>
                      {mds.mds_no}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            )}
            <CCol md={3}>
              <CFormInput
                type="date"
                className="p-2 m-2"
                placeholder="Search by Category..."
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </CCol>
          </CRow>

          {mdsdevices.length > 0 ? (
            mdsdevices.map((data, index) => {
              const totalRows = data?.no_of_rows;

              //getMdsStatus helper usage
              const { isDocked, isMoving } = getMdsStatus(data);

              const activeMdsPosition = data?.mds_positions.find(
                (p) => p.active || (p.robot_released && !p.robot_returned)
              );

              const activeRowNumber = isDocked
                ? 1
                : activeMdsPosition?.row_number || 1;

              return (
                <div
                  key={index}
                  onClick={() => handleOpenSidebar(data)}
                  className="mb-5 border p-3 rounded cursor-pointer"
                >
                  <h6 className="mb-3">{data.mds_no}</h6>
                  <div className="d-flex justify-content-end align-items-center">
                    <Link
                      to={`/${adminroute}/mds/site-management/block-management/${data.site_id}/${data.block}/${data.mds_no}`}
                      className="btn btn-primary btn-sm mb-2 d-flex align-items-center"
                    >
                      Command
                      <FaArrowUp />
                    </Link>
                  </div>

                  <div className="d-flex align-items-start">
                    <MdsRailingTrack
                      totalRows={totalRows}
                      activeRow={activeRowNumber}
                    />

                    <div className="d-flex flex-column ms-4">
                      {data.rows.map((row, index) => {
                        // helper functions to calculate robot position
                        const { robotPos, showRobotOnMds } =
                          calculateRobotPosition(
                            row,
                            activeRowNumber,
                            isDocked,
                            data
                          );

                        const mdsPosition = data?.mds_positions.find(
                          (p) => p.row_number === row.row_no
                        );

                        const showMdsBridge =
                          mdsPosition?.active ||
                          (isDocked && row.row_no === 1) ||
                          (isMoving && row.row_no === activeRowNumber);

                        return (
                          <div
                            key={index}
                            style={{ position: "relative", height: "70px" }}
                          >
                            <MdsRowTrack row={row} />

                            {/* Bridge */}
                            {showMdsBridge && (
                              <div
                                style={{
                                  position: "absolute",
                                  left: "-71px",
                                  top: "0px",
                                  width: "70px",
                                  height: "39px",
                                  borderRadius: "1px",
                                  border: "1px solid grey",
                                  transition: "width 0.5s linear",
                                }}
                              >
                                <span
                                  className="d-flex justify-content-center align-items-center ms-4"
                                  style={{ height: "100%" }}
                                >
                                  {row.row_no}
                                </span>
                              </div>
                            )}

                            {/* Robot */}
                            {row.row_no === activeRowNumber &&
                              (isMoving || activeMdsPosition || isDocked) && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "0px",
                                    left: `${
                                      showRobotOnMds ? -75 : robotPos * 5
                                    }px`,
                                    transition: "left 0.2s linear",
                                    zIndex: 10,
                                  }}
                                >
                                  <Robot />
                                </div>
                              )}

                            {/* MDS visual */}
                            {showMdsBridge && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "0px",
                                  left: "-71px",
                                  width: "30px",
                                  height: "39px",
                                  background:
                                    "linear-gradient(to bottom, #263238, #455A64, #263238)",
                                  borderRadius: "1px",
                                  boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                                  color: "#fff",
                                  textAlign: "center",
                                  fontSize: "12px",
                                  lineHeight: "25px",
                                }}
                              >
                                <span className="d-flex flex-column justify-content-start align-items-center">
                                  MDS{" "}
                                  <span className="d-flex">
                                    {isDocked ? (
                                      <span
                                        style={{
                                          color: "lime",
                                          fontSize: "12px",
                                          position: "relative",
                                          top: "15px",
                                        }}
                                      >
                                        Docked
                                      </span>
                                    ) : (
                                      <span
                                        style={{
                                          width: "10px",
                                          height: "10px",
                                          backgroundColor: isMoving
                                            ? "orange"
                                            : "lime",
                                          borderRadius: "50%",
                                          display: "inline-block",
                                        }}
                                      />
                                    )}
                                  </span>
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div
              style={{
                minHeight: "50vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h5 className="text-light">No MDS Tracking Found at {date}</h5>
            </div>
          )}
        </>
      )}
      {/* Sidebar component */}
      <MdsSidebar
        mds={selectedMDS}
        onClose={() => setIsSidebarOpen(false)}
        visible={isSidebarOpen}
        userInfo={userInfo}
      />

      {/*footer */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          padding: "5px 5px",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "15px",
          backgroundColor: "#080f25",
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
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

export default MdsDashboard;
