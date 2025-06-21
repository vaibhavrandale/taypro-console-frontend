import { cilLocationPin } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../components/LoadingSpinner";
import { CBadge, CCol, CFormSelect, CRow } from "@coreui/react";

const RobotRow = ({ robot, index }) => {
  const [distance, setDistance] = useState(0);
  const [atDS, setAtDS] = useState(false);
  const [calculated_finish_timestamp, setFinishTime] = useState("");
  const [totalCovered, setTotalCovered] = useState(0);
  const [isStuckNow, setIsStuckNow] = useState(false);
  const [stuckLocation, setStuckLocation] = useState(""); // NEW: Track stuck location for status
  console.log(calculated_finish_timestamp);

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
          return;
        }
      }
      // ✅ CASE 3: if cleaning finish is not receivd and calculated finish time is less than current time
      if (robot.isOerationCompleted) {
        const finishTime = new Date(robot.calculated_finish_timestamp);
        if (now >= finishTime) {
          setAtDS(true);
          setDistance(0);
          setTotalCovered(
            Math.round(robot.calculated_distance || oneWayDistance * 2)
          );
          setIsStuckNow(false);
          setStuckLocation("");
          return;
        }
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

      setDistance(Math.round(currentDistance));
      setTotalCovered(Math.round(covered));
      setIsStuckNow(false);
      setStuckLocation("");
    };

    // 🕒 Format finish time
    if (robot.calculated_finish_timestamp) {
      setFinishTime(
        new Date(robot.calculated_finish_timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }

    let animationFrameId;
    const loop = () => {
      update();
      animationFrameId = requestAnimationFrame(loop);
    };
    loop();

    return () => cancelAnimationFrame(animationFrameId);
  }, [robot]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const percent = Math.min(
    100,
    Math.max(0, (distance / robot.row_length) * 100)
  );
  const isRunning = !atDS && !isStuckNow;
  const robotColor = isStuckNow
    ? "#FF0000" // Red for stuck
    : atDS
    ? "#4CAF50" // Green for at DS
    : isRunning
    ? "#FFA000" // Orange for running
    : "#0D47A1"; // Blue for default

  return (
    <div style={{ marginBottom: "40px", padding: "5px 20px" }}>
      <div
        style={{
          position: "relative",
          height: "15px",
          background: "#B3E5FC",
          borderRadius: "4px",
          marginBottom: "50px",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: 10,
            top: "-25px",
            color: "#0277BD",
            fontWeight: "bold",
          }}
        >
          DS
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
            height: "60px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transition: "left 0.5s ease-in-out",
          }}
        >
          <div
            style={{ width: "30px", height: "5px", background: robotColor }}
          />
          <div
            style={{
              width: "10px",
              height: "40px",
              background: robotColor,
            }}
          />
          <div
            style={{ width: "30px", height: "5px", background: robotColor }}
          />
          <div
            style={{
              fontSize: "12px",
              color: robotColor,
              marginTop: "4px",
              fontWeight: "bold",
            }}
          >
            {robot.robot_no.slice(-3)}
          </div>
        </div>
      </div>

      <div
        style={{
          color: "#fff",
          textAlign: "start",
          fontSize: "13px",
        }}
      >
        <div>
          {index + 1}) Robot No: {robot.robot_no}
        </div>
        {isStuckNow ? (
          <>
            <div>
              🚫 <strong>Stuck</strong> on row {stuckLocation} (Reason:{" "}
              {robot.stuck_reason})
            </div>
            <div>
              ⏱️ Started: {formatTime(robot.start_timestamp)} | Stuck at:{" "}
              {formatTime(robot.stuck_at)}
            </div>
            <div>📏 Distance covered: {totalCovered}m</div>
          </>
        ) : atDS ? (
          <>
            <div>✅ Cleaning Completed</div>
            <div>
              ⏱️ Started: {formatTime(robot.start_timestamp)} | Finished:{" "}
              {formatTime(robot.calculated_finish_timestamp)}
            </div>
            <div>📏 Total distance: {totalCovered}m</div>
          </>
        ) : (
          <>
            <div>🔄 Cleaning In Progress</div>
            <div>
              ⏱️ Started: {formatTime(robot.start_timestamp)} | Approx Finish:{" "}
              {formatTime(robot.calculated_finish_timestamp)}
            </div>
            <div>📏 Distance covered: {totalCovered}m</div>
          </>
        )}
      </div>
    </div>
  );
};
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loadingRobots: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loadingRobots: false, robotsData: action.payload };
    case "FETCH_FAIL":
      return { ...state, loadingRobots: false, error: action.payload };
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
    default:
      return state;
  }
};
const RobotPosition = () => {
  // const site_id = "taypro_office";
  const [{ error, robotsData, loadingRobots, sites, loadingSites }, dispatch] =
    useReducer(reducer, {
      robotsData: [],
      loadingRobots: true,
      loadingSites: false,
      siteserror: false,
      sites: [],
      error: "",
    });
  const authtoken = useSelector((state) => state.authtoken);
  const [site_id, setSiteId] = useState("");

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
  }, [authtoken]); // 🔁 include `site_id` if it can change
  const handleSiteNameChange = (e) => {
    const selectedSiteId = e.target.value;
    setSiteId(selectedSiteId); // Updates local state
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "30px", textAlign: "center" }}>
        <CIcon icon={cilLocationPin} color="primary" size="xl" /> Live Robot
        Position Tracking -{" "}
        {new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </h2>
      <CRow className="mb-5">
        <CCol md={2} xs={12}>
          <div className="m-1">
            {loadingSites ? (
              <LoadingSpinner />
            ) : (
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
            )}
          </div>
        </CCol>
      </CRow>

      {loadingRobots ? (
        <LoadingSpinner />
      ) : error ? (
        <div>{error}</div>
      ) : robotsData.length > 0 ? (
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
      )}
    </div>
  );
};

export default RobotPosition;
