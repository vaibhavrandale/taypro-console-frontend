import {
  cilExitToApp,
  cilLocationPin,
  cilMediaPause,
  cilMediaPlay,
  cilX,
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  CBadge,
  CCol,
  CFormSelect,
  CImage,
  COffcanvas,
  COffcanvasBody,
  COffcanvasHeader,
  COffcanvasTitle,
  CRow,
} from "@coreui/react";
import RobotImg from "../../assets/images/robot.png";
import SubscriptionExpiryCard from "../../components/SubscriptionExpiryCard";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loadingRobots: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loadingRobots: false, robotsData: action.payload };
    case "FETCH_FAIL":
      return {
        ...state,
        loadingRobots: false,
        error: action.payload,
        subscriptiondata: action.subscriptiondata,
        subscriptionStatus: action.subscriptionStatus,
      };
    case "FETCH_SITES_REQUEST":
      return { ...state, loadingSites: true, siteserror: "" };
    case "FETCH_SITES_SUCCESS":
      return {
        ...state,
        loadingSites: false,
        sites: action.payload,
      };
    case "FETCH_SITES_FAIL":
      return { ...state, loadingSites: false, siteserror: action.payload };
    case "FETCH_ROBOT_REQUEST":
      return {
        ...state,
        loadingRobot: true,
        loadingRobotError: "",
        robotDetails: {},
      };
    case "FETCH_ROBOT_SUCCESS":
      return {
        ...state,
        loadingRobot: false,
        robotDetails: action.payload,
      };
    case "FETCH_ROBOT_FAIL":
      return {
        ...state,
        loadingRobot: false,
        loadingRobotError: action.payload,
      };
    default:
      return state;
  }
};

const RobotRow = ({ robot, index }) => {
  const [{ loadingRobot, robotDetails, loadingRobotError }, dispatch] =
    useReducer(reducer, {
      loadingRobot: false,
      robotDetails: {},
      loadingRobotError: "",
    });

  const [distance, setDistance] = useState(0);
  const [atDS, setAtDS] = useState(false);
  const [calculated_finish_timestamp, setFinishTime] = useState("");
  const [totalCovered, setTotalCovered] = useState(0);
  const [isStuckNow, setIsStuckNow] = useState(false);
  const [isCancelledNow, setIsCancelledNow] = useState(false);
  const [isCleaningFinished, setIsCleaningFinished] = useState(false);
  const [isFinishTimeExceed, setIsFinishTimeExceed] = useState(false);
  const [stuckLocation, setStuckLocation] = useState(""); // NEW: Track stuck location for status
  const [cancelledLocation, setCancelledLocation] = useState(""); // NEW: Track stuck location for status
  const [currentLocation, setCurrentLocation] = useState(""); // NEW: Track stuck location for status
  const [sideBarVisible, setsideBarVisible] = useState(false);
  const [selectedRobotNo, setSelectedRobotNo] = useState(null);
  const [loadingRow, setLoadingRow] = useState(null); // Track the row index
  const [commandButton, setCommandButton] = useState(null);
  const authtoken = useSelector((state) => state.authtoken);

  useEffect(() => {
    const oneWayDistance = robot.row_length || 0;
    const totalTripTime =
      (new Date(robot.calculated_finish_timestamp) -
        new Date(robot.start_timestamp)) /
      1000;

    const update = () => {
      const now = new Date();
      const startTime = new Date(robot.start_timestamp);
      const elapsedTime = (now - startTime) / 1000;

      // Sanity check
      if (!isFinite(totalTripTime) || totalTripTime <= 0) {
        setDistance(0);
        setTotalCovered(0);
        return;
      }

      // ✅ CASE 1: Robot is stuck
      if (
        robot.isStuck &&
        (robot.stuck_reason === "Battery Dead" ||
          robot.stuck_reason === "Stuck in bridge/Module") &&
        now >= new Date(robot.stuck_at)
      ) {
        const stuckTime = (new Date(robot.stuck_at) - startTime) / 1000;
        const clampedTime = Math.max(0, Math.min(stuckTime, totalTripTime));
        const progress = clampedTime / totalTripTime;

        let stuckDistance;
        let stuckCovered;
        let location;

        if (progress <= 0.5) {
          stuckDistance = oneWayDistance * (progress * 2);
          stuckCovered = stuckDistance;
          location =
            stuckDistance >= oneWayDistance
              ? "at RS"
              : `at ${Math.round(stuckDistance)}m from DS`;
        } else {
          stuckDistance = oneWayDistance * ((1 - progress) * 2);
          stuckCovered = oneWayDistance + (oneWayDistance - stuckDistance);
          location =
            stuckDistance <= 0
              ? "at DS"
              : `at ${Math.round(stuckDistance)}m from DS`;
        }

        stuckCovered = Math.min(stuckCovered, oneWayDistance * 2);

        setDistance(Math.round(stuckDistance));
        setTotalCovered(Math.round(stuckCovered));
        setIsStuckNow(true);
        setStuckLocation(location);
        setAtDS(false);
        return;
      }

      // ✅ CASE 2: Cleaning finished
      if (robot.isCleaningFinishedReceived) {
        const finishTime = new Date(robot.calculated_finish_timestamp);
        if (now >= finishTime) {
          setAtDS(true);
          setDistance(0);
          setTotalCovered(
            Math.round(robot.calculated_distance || oneWayDistance * 2)
          );
          setIsStuckNow(false);
          setStuckLocation("");
          setIsCleaningFinished(true);
          return;
        }
      }
      // ✅ CASE 3: if cleaning finish is not receivd and calculated finish time is less than current time
      if (
        robot.isOperationCompleted &&
        !robot.isCleaningFinishedReceived &&
        !robot.is_cleaning_cancelled
      ) {
        const finishTime = new Date(robot.calculated_finish_timestamp);
        if (now >= finishTime) {
          setAtDS(true);
          setDistance(0);
          setTotalCovered(
            Math.round(robot.calculated_distance || oneWayDistance * 2)
          );
          setIsStuckNow(false);
          setStuckLocation("");
          setIsFinishTimeExceed(true);
          return;
        }
      }

      //case 4 - cleaning cancelled case
      if (
        robot.is_cleaning_cancelled &&
        robot.cleaning_cancelled_at &&
        new Date(robot.cleaning_cancelled_at) >= startTime
      ) {
        const cancelledTime =
          (new Date(robot.cleaning_cancelled_at) - startTime) / 1000; // seconds
        const speedInMetersPerSecond = robot.speed / 60;

        const cancelledDistanceCovered = Math.min(
          cancelledTime * speedInMetersPerSecond, // ✅ correct conversion
          oneWayDistance * 2
        );

        // Work out location text
        let cancelledLocation;
        if (cancelledDistanceCovered < oneWayDistance) {
          cancelledLocation = `At ${Math.round(
            cancelledDistanceCovered
          )} m from DS`;
        } else if (cancelledDistanceCovered === oneWayDistance) {
          cancelledLocation = "At RS";
        } else {
          const distanceBack = cancelledDistanceCovered - oneWayDistance;
          cancelledLocation =
            distanceBack >= oneWayDistance
              ? "At DS"
              : `Returning, ${Math.round(distanceBack)} m from RS`;
        }

        // ✅ Update UI state
        setDistance(Math.round(cancelledDistanceCovered));
        setTotalCovered(Math.round(cancelledDistanceCovered));
        setIsCancelledNow(true);
        setCancelledLocation(cancelledLocation);
        setAtDS(false);

        return;
      }

      // ✅ CASE 3: Still moving (live approx)
      const clampedTime = Math.max(0, Math.min(elapsedTime, totalTripTime));
      const progress = clampedTime / totalTripTime;

      let currentDistance;
      let covered;

      if (progress <= 0.5) {
        currentDistance = oneWayDistance * (progress * 2);
        covered = currentDistance;
      } else {
        currentDistance = oneWayDistance * ((1 - progress) * 2);
        covered = oneWayDistance + (oneWayDistance - currentDistance);
      }

      covered = Math.min(covered, oneWayDistance * 2);

      const speedInMetersPerSecond = robot.speed / 60;

      const liveDistanceCovered = Math.min(
        elapsedTime * speedInMetersPerSecond, // ✅ correct conversion
        oneWayDistance * 2
      );
      let currentLocation;
      if (liveDistanceCovered < oneWayDistance) {
        currentLocation = `At ${Math.round(liveDistanceCovered)} m from DS`;
      } else if (liveDistanceCovered === oneWayDistance) {
        currentLocation = "At RS";
      } else {
        const distanceBack = liveDistanceCovered - oneWayDistance;
        currentLocation =
          distanceBack >= oneWayDistance
            ? "At DS"
            : `Returning, ${Math.round(distanceBack)} m from RS`;
      }

      setDistance(Math.round(currentDistance));
      setTotalCovered(Math.round(covered));
      setIsStuckNow(false);
      setStuckLocation("");
      setCurrentLocation(currentLocation);

      // 🕒 Format finish time
      if (robot.calculated_finish_timestamp) {
        setFinishTime(
          new Date(robot.calculated_finish_timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      }
    };

    let animationFrameId;
    const loop = () => {
      update();
      animationFrameId = requestAnimationFrame(loop);
    };
    loop();

    return () => cancelAnimationFrame(animationFrameId);
  }, [robot]);

  const percent = Math.min(
    100,
    Math.max(0, (distance / robot.row_length) * 100)
  );

  const isRunning = !atDS && !isStuckNow && !isCancelledNow;
  const robotColor = isStuckNow
    ? "#FF0000" // Red for stuck
    : atDS
    ? "#4CAF50" // Green for at DS
    : isRunning
    ? "#FFA000" // Orange for running
    : isCancelledNow
    ? "#ff0000ab" // crimson for cleaning cancelled
    : "#0D47A1"; // Blue for default

  const handleRobotClick = async (robot_no) => {
    setSelectedRobotNo(robot_no);
    setsideBarVisible(true);
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
          : "Failed to fetch robot details.",
      });
    }
  };

  const sendsingleDownlink = async (command, index) => {
    setLoadingRow(index);
    setCommandButton(index);
    //deveui,command,robot_no,site_id,lora_no......
    let robotdownlink = {
      deveui: robot.deveui,
      robot_no: robot.robot_no,
      site_id: robot.site_id,
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

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div style={{ marginBottom: "10px", padding: "5px 20px" }}>
      <div
        onClick={() => handleRobotClick(robot.robot_no)}
        style={{
          position: "relative",
          height: "50px",
          borderRadius: "4px",
          marginBottom: "35px",
          // width: `${robot.row_length * 5}px`,

          backgroundImage: `
      repeating-linear-gradient(
        to right,
        #0d47a1,
        #0d47a1 10px,
        #ffffff 10px,
        #ffffff 12px
      ),
      linear-gradient(
        to bottom,
        #0d47a1 0%,
        #0d47a1 48%,
        #79aaf4ff 48%,
        #659ef5ff 53%,
        #0d47a1 53%,
        #0d47a1 100%
      )
    `,
          backgroundBlendMode: "overlay",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            color: robotColor,
            left: 0,
            top: "-30px",
            position: "absolute",
            fontWeight: "bold",
          }}
        >
          {robot.robot_no}
        </span>
        <span
          style={{
            position: "absolute",
            left: 0,
            top: "-20px",
            color: "#0277BD",
            fontWeight: "bold",
          }}
        >
          DS{" "}
        </span>
        <span
          style={{
            position: "absolute",
            right: 0,
            top: "-20px",
            color: "#0277BD",
            fontWeight: "bold",
          }}
        >
          RS
        </span>
        <div
          style={{
            position: "absolute",
            left: `calc(${percent}% - 23px)`,
            top: "-12px",
            width: "30px",
            height: "80px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transition: "left 0.5s ease-in-out",
          }}
        >
          <CImage
            src={RobotImg}
            alt="Robot"
            width="100"
            height="78"
            style={{ objectFit: "contain", borderRadius: "5px" }}
          />
        </div>
      </div>

      {/* === Offcanvas with Robot Details === */}
      <COffcanvas
        style={{ backgroundColor: "#080f25" }}
        placement="end"
        visible={sideBarVisible}
        onHide={() => setsideBarVisible(false)}
      >
        <COffcanvasHeader>
          <COffcanvasTitle>Robot Details</COffcanvasTitle>
          <button
            type="button"
            className=" border-0 ms-auto py-0 px-1"
            onClick={() => setsideBarVisible(false)}
            style={{ background: "none" }}
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </COffcanvasHeader>
        <COffcanvasBody>
          {loadingRobot ? (
            <div className="h-75 d-flex justify-content-center align-items-center">
              <LoadingSpinner />
            </div>
          ) : loadingRobotError ? (
            <div style={{ color: "red" }}>{loadingRobotError}</div>
          ) : (
            <div style={{ fontSize: "14px" }}>
              <div className="mb-4">
                {" "}
                <CRow className="d-flex justify-content-between text-center mb-2">
                  <CCol>
                    {commandButton === 1 ? (
                      <LoadingSpinner />
                    ) : (
                      <CIcon
                        icon={cilMediaPlay}
                        className="me-2 cursor-pointer"
                        onClick={() => sendsingleDownlink("C1", 1)}
                        size="xl"
                        style={{ height: "30px", color: "rgb(57, 214, 0)" }}
                      />
                    )}
                    <p>Start</p>
                  </CCol>

                  <CCol>
                    {commandButton === 2 ? (
                      <LoadingSpinner />
                    ) : (
                      <CIcon
                        icon={cilMediaPause}
                        className="me-2 cursor-pointer"
                        onClick={() => sendsingleDownlink("CC", 2)}
                        size="xl"
                        style={{ height: "30px", color: "rgb(57, 214, 0)" }}
                      />
                    )}

                    <p>Stop</p>
                  </CCol>

                  <CCol>
                    {commandButton === 3 ? (
                      <LoadingSpinner />
                    ) : (
                      <CIcon
                        icon={cilExitToApp}
                        className="me-2 cursor-pointer"
                        size="xl"
                        onClick={() => sendsingleDownlink("D1", 3)}
                        style={{ height: "30px", color: "rgb(57, 214, 0)" }}
                      />
                    )}

                    <p>Return</p>
                  </CCol>
                </CRow>
                <h6 className="text-success">Cleaning Record</h6>
                <div className="">
                  {isStuckNow ? (
                    <>
                      <div>
                        🚫 <strong>Stuck</strong> on row {stuckLocation}{" "}
                        (Reason: {robot.stuck_reason})
                      </div>
                      <div>
                        ⏱️ Started: {formatTime(robot.start_timestamp)} | Stuck
                        at: {formatTime(robot.stuck_at)}
                      </div>
                      <div>📏 Total distance: {totalCovered}m</div>
                      <div>📌 Location: {stuckLocation}</div>
                    </>
                  ) : isCancelledNow ? (
                    <>
                      <div>❌ Cleaning Cancelled</div>
                      <div>
                        ⏱️ Started: {formatTime(robot.start_timestamp)} |
                        Cancelled at: {formatTime(robot.cleaning_cancelled_at)}
                      </div>
                      <div>📏 Distance covered: {totalCovered}m</div>
                      <div>📌 Location: {cancelledLocation}</div>
                    </>
                  ) : isCleaningFinished || isFinishTimeExceed ? (
                    <>
                      <div>✅ Cleaning Finished</div>
                      <div>
                        ⏱️ Started: {formatTime(robot.start_timestamp)} |
                        Finished at: {formatTime(robot.cleaning_finished_at)}
                      </div>
                      <div>📏 Distance covered: {totalCovered}m</div>
                      <div>📌 Location: At Dock</div>
                    </>
                  ) : (
                    <>
                      <div>🔄 Cleaning In Progress</div>
                      <div>
                        ⏱️ Started: {formatTime(robot.start_timestamp)} | Approx
                        Finish: {formatTime(robot.calculated_finish_timestamp)}
                      </div>
                      <div>📏 Distance covered: {totalCovered}m</div>
                      <div>📌 Location: {currentLocation}</div>
                    </>
                  )}
                </div>
                <h6 className="text-success mt-4">Robot Information</h6>
                <span>
                  {" "}
                  <strong>Robot No:</strong> {robotDetails.robot_no}
                  <br />
                </span>
                <span>
                  {" "}
                  <strong>Block:</strong> {robotDetails.block}
                  <br />
                </span>
                <span>
                  <strong>Type:</strong> {robotDetails.robot_type}
                  <br />
                </span>
                <span>
                  <strong>Site:</strong> {robotDetails.site_id}
                  <br />
                </span>
                <span>
                  <strong>Lora No:</strong> {robotDetails.lora_no}
                  <br />
                </span>
              </div>
              <h6 className="text-success">Running Status</h6>
              {[
                {
                  label: "Battery Voltage",
                  value: `${robotDetails.battery_voltage}%`,
                },
                { label: "Battery Status", value: robotDetails.battery_status },
                {
                  label: "Brush Motor Speed",
                  value: robotDetails.brush_motor_speed,
                },
                {
                  label: "Wheel Motor Speed",
                  value: robotDetails.wheel_motor_speed,
                },
                {
                  label: "Brush Current",
                  value: robotDetails.brush_current,
                },
                {
                  label: "Wheel Current",
                  value: robotDetails.wheel_current,
                },
                {
                  label: "Temperature",
                  value: `${robotDetails.temperature}°C`,
                },
                { label: "Last Command", value: robotDetails.last_command },
                { label: "Dock", value: robotDetails.dock },
                { label: "RSSI", value: robotDetails.rssi },
                { label: "SNR", value: robotDetails.snr },
                {
                  label: "Last Uplink",
                  value: robotDetails.last_uplink
                    ? new Date(robotDetails.last_uplink).toLocaleString()
                    : "N/A",
                },
                {
                  label: "Manufactured Date",
                  value: robotDetails.manufactured_date
                    ? (() => {
                        const d = new Date(robotDetails.manufactured_date);
                        return `${String(d.getDate()).padStart(
                          2,
                          "0"
                        )}-${String(d.getMonth() + 1).padStart(
                          2,
                          "0"
                        )}-${d.getFullYear()}`;
                      })()
                    : "N/A",
                },
                { label: "Company", value: robotDetails.company },
                { label: "Status", value: robotDetails.last_status },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "6px",
                  }}
                >
                  <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>
                  <span
                    style={{
                      flex: 1,
                      borderBottom: "1px dashed #999",
                      margin: "0 6px",
                    }}
                  ></span>
                  <span style={{ whiteSpace: "nowrap" }}>{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </COffcanvasBody>
      </COffcanvas>
    </div>
  );
};

const RobotPosition = () => {
  const [
    {
      error,
      robotsData,
      loadingRobots,
      sites,
      loadingSites,
      subscriptiondata,
      subscriptionStatus,
    },
    dispatch,
  ] = useReducer(reducer, {
    robotsData: [],
    loadingRobots: true,
    loadingSites: false,
    siteserror: false,
    sites: [],
    error: "",
    subscriptionStatus: "",
    subscriptiondata: {},
  });
  const authtoken = useSelector((state) => state.authtoken);
  const [site_id, setSiteId] = useState("all");

  useEffect(() => {
    let intervalId;

    const fetchRobots = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(
          `/api/v1/robotpositiontracker/${site_id}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );

        dispatch({
          type: "FETCH_SUCCESS",
          payload: result.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data?.message || error.response?.data?.error,
          subscriptiondata: error.response?.data?.data,
          subscriptionStatus: error.response?.data.subscriptionStatus,
        });
        toast.error(
          error.response?.data?.message || error.response?.data?.error
        );
      }
    };

    // Immediately call once
    fetchRobots();

    // Then set interval
    intervalId = setInterval(fetchRobots, 60000); // every 1 minute

    return () => {
      clearInterval(intervalId); // cleanup on unmount
    };
  }, [authtoken, site_id]); // 🔁 include `site_id` if it can change

  useEffect(() => {
    const fetchSites = async () => {
      dispatch({ type: "FETCH_SITES_REQUEST" });
      try {
        const result = await axios.get(`/api/v1/sites`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        dispatch({
          type: "FETCH_SITES_SUCCESS",
          payload: result.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_SITES_FAIL",
          payload: error.response.data.error,
        });
        toast.error("Failed to fetch sites");
      }
    };

    fetchSites();
  }, [authtoken]);
  // 🔁 include `site_id` if it can change
  const handleSiteNameChange = (e) => {
    const selectedSiteId = e.target.value;
    setSiteId(selectedSiteId); // Updates local state
  };

  const checkStatus = [
    "subscriptionSitesAssigned",
    "subscriptionFound",
    "subscriptionaRenewStatus",
    "subscriptionPaymentStatus",
    "subscriptionPlanAccess",
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {loadingRobots || loadingSites ? (
        <LoadingSpinner />
      ) : checkStatus.includes(subscriptionStatus) ? (
        <SubscriptionExpiryCard
          data={subscriptiondata}
          subscriptionStatus={subscriptionStatus}
          error={error}
        />
      ) : (
        <>
          {/* header */}
          <h5 className="text-center">
            <CIcon icon={cilLocationPin} color="primary" size="xl" /> Live Robot
            Position Tracking -{" "}
            {new Date().toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </h5>

          <CRow className="my-2">
            <CCol md={4} xs={12}>
              <div className="m-1">
                {
                  // loadingSites ? (
                  //   <LoadingSpinner />
                  // ) : (

                  sites?.length > 0 && (
                    <CFormSelect
                      name="site_id"
                      value={site_id}
                      onChange={handleSiteNameChange}
                    >
                      <option value="all">All Data</option>
                      {sites.map((item, index) => (
                        <option key={item.site_id} value={item.site_id}>
                          {item.site_id}
                        </option>
                      ))}
                    </CFormSelect>
                  )
                }
              </div>
            </CCol>
          </CRow>

          {/* robots row */}
          <div
            style={{
              flex: 1,
              overflowX: "auto",
              padding: "20px 0",
              minHeight: "350px",
            }}
          >
            {
              // loadingRobots ? (
              //   <LoadingSpinner />
              // ) :
              // error ? (
              //   <div>{error}</div>
              // ) :
              robotsData.length > 0 ? (
                robotsData.map((robot, index) => (
                  <RobotRow key={robot._id} robot={robot} index={index} />
                ))
              ) : (
                <CBadge className="px-5 py-2" color="danger">
                  No robots found for{" "}
                  {new Date().toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </CBadge>
              )
            }
          </div>

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

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "#4CAF50",
                }}
              ></div>
              <span>At Dock</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "#ff0000ab",
                }}
              ></div>
              <span>Cancelled/Stuck</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RobotPosition;
