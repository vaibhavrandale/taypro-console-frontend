import axios from "axios";
import React, { useEffect, useReducer } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../components/LoadingSpinner";
import "./scada.css";
import InverterPanel from "./InverterPanel";
import LogsGraph from "./LogsGraph";
import socket from "../../components/Socket";
// const reducer = (state, action) => {
//   switch (action.type) {
//     case "FETCH_REQUEST":
//       return { ...state, loading: true, error: "" };
//     case "FETCH_SUCCESS":
//       return { ...state, loading: false, scadaData: action.payload };
//     case "FETCH_FAIL":
//       return { ...state, loading: false, error: action.payload };
//     case "FETCH_LOGS_REQUEST":
//       return { ...state, logsLoading: true, logsError: "" };
//     case "FETCH_LOGS_SUCCESS":
//       return { ...state, logsLoading: false, scadaLogs: action.payload };
//     case "FETCH_LOGS_FAIL":
//       return { ...state, logsLoading: false, logsError: action.payload };
//     default:
//       return state;
//   }
// };
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };

    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        scadaData:
          typeof action.payload === "function"
            ? action.payload(state.scadaData)
            : action.payload,
      };

    case "FETCH_LOGS_SUCCESS":
      return {
        ...state,
        scadaLogs:
          typeof action.payload === "function"
            ? action.payload(state.scadaLogs)
            : action.payload,
      };

    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const ScadaDashboard = () => {
  const [
    { error, loading, scadaData, logsLoading, scadaLogs, logsError },
    dispatch,
  ] = useReducer(reducer, {
    scadaData: [],
    loading: true,
    error: "",
    scadaLogs: [],
    logsLoading: true,
    logsError: "",
  });

  const site_id = "taypro_office";
  const invertor_id = "INV01";
  // const authtoken = useSelector((state) => state.authtoken);
  useEffect(() => {
    socket.emit("scada-join-site", site_id);

    return () => {
      socket.emit("scada-leave-site", site_id); // optional but clean
    };
  }, [site_id]);

  useEffect(() => {
    const fetchScadaData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(`/api/v1/scada-master-data/${site_id}`, {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        });

        dispatch({
          type: "FETCH_SUCCESS",
          payload: result.data.data, // ✅ important
        });

        console.log(result.data);
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data?.message || "Fetch failed",
        });
        toast.error(error.response?.data?.message || "Fetch failed");
      }
    };

    const fetchScadaLogsData = async () => {
      dispatch({ type: "FETCH_LOGS_REQUEST" });
      try {
        const result = await axios.get(`/api/v1/scada-logs/${invertor_id}`, {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        });

        dispatch({
          type: "FETCH_LOGS_SUCCESS",
          payload: result.data.data, // ✅ important
        });
      } catch (error) {
        dispatch({
          type: "FETCH_LOGS_FAIL",
          payload: error.response?.data?.message || error.response?.data?.error,
        });
        toast.error(
          error.response?.data?.message || error.response?.data?.error,
        );
      }
    };

    fetchScadaData();
    fetchScadaLogsData();
  }, [site_id]);
  useEffect(() => {
    const handleScadaEvent = (msg) => {
      if (msg.site_id !== site_id) return;

      // 1️⃣ Update inverter live data
      dispatch({
        type: "FETCH_SUCCESS",
        payload: (prev) =>
          prev.map((site) =>
            site.site_id !== msg.site_id
              ? site
              : {
                  ...site,
                  invertors: site.invertors.map((inv) =>
                    inv.invertor === msg.invertor
                      ? {
                          ...inv,
                          voltage: msg.voltage,
                          current: msg.current,
                          power: msg.power,
                        }
                      : inv,
                  ),
                  updatedAt: msg.createdAt,
                },
          ),
      });

      // 2️⃣ Push log for graph (keep last 50)
      dispatch({
        type: "FETCH_LOGS_SUCCESS",
        payload: (prev) => [...prev, msg].slice(-20),
      });
    };

    socket.on("scada-update", handleScadaEvent);

    return () => socket.off("scada-update", handleScadaEvent);
  }, [site_id]);

  return (
    <div className="scada-container">
      {/* ===== Header ===== */}
      <div className="scada-header mb-3">
        <h4 className="mb-0">SCADA Dashboard</h4>
      </div>

      {/* ===== Content ===== */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          {/* ===== Inverter Section ===== */}
          <div className="inverter-grid mb-3">
            {scadaData.map((site) =>
              site.invertors.map((inv, idx) => (
                <InverterPanel
                  key={`${site._id}-${inv.invertor}-${idx}`}
                  site={site}
                  inv={inv}
                />
              )),
            )}
          </div>

          {/* ===== Analytics Section ===== */}
          <div className="scada-graph-section">
            <LogsGraph logs={scadaLogs} />
          </div>
        </>
      )}
    </div>
  );
};

export default ScadaDashboard;
