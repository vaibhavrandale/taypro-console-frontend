import React, { useEffect, useReducer, useState } from "react";
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CBadge,
  CProgress,
  CButton,
} from "@coreui/react";
import {
  Cpu,
  MemoryStick,
  HardDrive,
  Activity,
  Clock,
  Server,
  RefreshCcw,
} from "lucide-react";
// import { system_latest_status } from "../../../data";
import SystemMetricsDashboard from "./SystemMetricsDashboard";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SYS_INFO_LOGS_REQUEST":
      return {
        ...state,
        fetchSysInfoLogsLoading: true,
        fetchSysInfoLogsError: "",
      };

    case "FETCH_SYS_INFO_LOGS_SUCCESS":
      return {
        ...state,
        fetchSysInfoLogsLoading: false,
        sysInfoLogs: action.payload,
      };

    case "FETCH_SYS_INFO_LOGS_FAIL":
      return {
        ...state,
        fetchSysInfoLogsLoading: false,
        fetchSysInfoLogsError: action.payload,
      };

    case "FETCH_SYS_INFO_REQUEST":
      return { ...state, fetchSysInfoLoading: true, fetchSysInfoError: "" };

    case "FETCH_SYS_INFO_SUCCESS":
      return { ...state, fetchSysInfoLoading: false, sysInfo: action.payload };

    case "FETCH_SYS_INFO_FAIL":
      return {
        ...state,
        fetchSysInfoLoading: false,
        fetchSysInfoError: action.payload,
      };

    default:
      return state;
  }
};

const StatusBadge = ({ status }) => {
  const colorMap = {
    normal: "success",
    warning: "warning",
    critical: "danger",
  };
  return <CBadge color={colorMap[status]}>{status?.toUpperCase()}</CBadge>;
};

const SystemDashboard = () => {
  const [
    {
      fetchSysInfoLogsLoading,
      sysInfoLogs,
      fetchSysInfoLogsError,

      fetchSysInfoLoading,
      sysInfo,
      fetchSysInfoError,
    },
    dispatch,
  ] = useReducer(reducer, {
    fetchSysInfoLogsLoading: false,
    sysInfoLogs: [],
    fetchSysInfoLogsError: "",
    fetchSysInfoLoading: false,
    sysInfo: {},
    fetchSysInfoError: "",
  });
  // const authtoken = useSelector((state) => state.authtoken);
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    const fetchSysInfo = async () => {
      dispatch({ type: "FETCH_SYS_INFO_REQUEST" });
      try {
        const result = await axios.get(
          `/api/v1/sysinfo`,

          {
            // headers: { Authorization: `Bearer ${authtoken}` },
            withCredentials: true,
          },
        );
        // console.log(result);

        dispatch({
          type: "FETCH_SYS_INFO_SUCCESS",
          payload: result.data.data[0],
        });
      } catch (error) {
        dispatch({
          type: "FETCH_SYS_INFO_FAIL",
          payload: error.response.data.error || error.response.data.message,
        });
        toast.error(error.response.data.error || error.response.data.message);
      }
    };

    // const fetchSysInfoLogs = async () => {
    //   dispatch({ type: "FETCH_SYS_INFO_LOGS_REQUEST" });
    //   try {
    //     const result = await axios.get(
    //       `/api/v1/sysinfo-logs`,

    //       {
    //         // headers: { Authorization: `Bearer ${authtoken}` },
    // withCredentials: true,
    //       }
    //     );
    //     console.log(result);

    //     dispatch({
    //       type: "FETCH_SYS_INFO_LOGS_SUCCESS",
    //       payload: result.data.data,
    //     });
    //   } catch (error) {
    //     dispatch({
    //       type: "FETCH_SYS_INFO_LOGS_FAIL",
    //       payload: error.response.data.error || error.response.data.message,
    //     });
    //     toast.error(error.response.data.error || error.response.data.message);
    //   }
    // };

    const fetchSysInfoLogs = async () => {
      dispatch({ type: "FETCH_SYS_INFO_LOGS_REQUEST" });
      try {
        const result = await axios.get(`/api/v1/sysinfo-logs?range=10m`, {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        });

        dispatch({
          type: "FETCH_SYS_INFO_LOGS_SUCCESS",
          payload: result.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_SYS_INFO_LOGS_FAIL",
          payload: error.response.data.error || error.response.data.message,
        });
      }
    };

    fetchSysInfo();
    fetchSysInfoLogs();
  }, [refreshKey]);

  if (!sysInfo) return null;

  const memoryPercent = Math.round(
    (sysInfo.memory_mb?.used / sysInfo.memory_mb?.total) * 100,
  );

  return (
    <div>
      {fetchSysInfoLoading ? (
        <LoadingSpinner />
      ) : fetchSysInfoError ? (
        fetchSysInfoError
      ) : (
        <>
          <CRow className="g-4">
            {/* Header */}
            <CCol xs={12}>
              <CCard>
                <CCardBody className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">
                      <Server size={18} className="me-2" />
                      {sysInfo.hostname}
                    </h5>
                    <small className="text-muted">{sysInfo.instance_id}</small>
                  </div>

                  <div className="d-flex flex-column align-items-center gap-2 mb-3">
                    <StatusBadge status={sysInfo.status?.overall} />
                    <CButton
                      size="sm"
                      color="primary"
                      onClick={() => setRefreshKey((prev) => prev + 1)}
                    >
                      <RefreshCcw size={18} /> Refresh
                    </CButton>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>

            {/* CPU */}
            <CCol md={4}>
              <CCard>
                <CCardHeader>
                  <Cpu size={16} className="me-2" />
                  CPU Usage
                </CCardHeader>
                <CCardBody>
                  <p>User: {sysInfo.cpu?.user}%</p>
                  <p>System: {sysInfo.cpu?.system}%</p>
                  <p>Idle: {sysInfo.cpu?.idle}%</p>
                  <CProgress value={100 - sysInfo.cpu?.idle} />
                  <div className="mt-2">
                    <StatusBadge status={sysInfo.status?.cpu} />
                  </div>
                </CCardBody>
              </CCard>
            </CCol>

            {/* Memory */}
            <CCol md={4}>
              <CCard>
                <CCardHeader>
                  <MemoryStick size={16} className="me-2" />
                  Memory
                </CCardHeader>
                <CCardBody>
                  <p>
                    Total: {(sysInfo.memory_mb?.total / 1024).toFixed(2)} GB
                  </p>
                  <p>Used: {(sysInfo.memory_mb?.used / 1024).toFixed(2)} GB</p>
                  <p>
                    Available: {(sysInfo.memory_mb?.free / 1024).toFixed(2)} GB
                  </p>
                  <CProgress value={memoryPercent} />
                  <div className="mt-2">
                    <StatusBadge status={sysInfo.status?.memory} />
                  </div>
                </CCardBody>
              </CCard>
            </CCol>

            {/* Disk */}
            <CCol md={4}>
              <CCard>
                <CCardHeader>
                  <HardDrive size={16} className="me-2" />
                  Disk
                </CCardHeader>
                <CCardBody>
                  {sysInfo.disk?.map((d, idx) => (
                    <div
                      key={idx}
                      className="mb-3 d-flex flex-column justify-content-between"
                    >
                      <span>{d.mount}</span>
                      <p className="mb-1">Total: {d.size_gb} GB</p>
                      <p className="mb-1">Used: {d.used_gb} GB</p>
                      <p className="mb-1">
                        Availale: {(d.size_gb - d.used_gb).toFixed(2)} GB
                      </p>
                      <CProgress value={d.usage_percent} />
                    </div>
                  ))}
                  <StatusBadge status={sysInfo.status?.disk} />
                </CCardBody>
              </CCard>
            </CCol>

            {/* Load & Uptime */}
            <CCol md={6}>
              <CCard>
                <CCardHeader>
                  <Activity size={16} className="me-2" />
                  Load Average
                </CCardHeader>
                <CCardBody className="d-flex justify-content-between align-items-center">
                  <p>1 min: {sysInfo.load_avg?.one}</p>
                  <p>5 min: {sysInfo.load_avg?.five}</p>
                  <p>15 min: {sysInfo.load_avg?.fifteen}</p>
                </CCardBody>
              </CCard>
            </CCol>

            <CCol md={6}>
              <CCard>
                <CCardHeader>
                  <Clock size={16} className="me-2" />
                  Uptime
                </CCardHeader>
                <CCardBody className="d-flex justify-content-between align-items-center">
                  <h4>{Math.floor(sysInfo.uptime_sec / 3600)} hours</h4>
                  <small className="text-muted">
                    Last updated :
                    <span className="mx-2">
                      {new Date(sysInfo.last_updated).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </small>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
          <SystemMetricsDashboard
            loading={fetchSysInfoLogsLoading}
            error={fetchSysInfoLogsError}
            data={sysInfoLogs}
          />
        </>
      )}
    </div>
  );
};

export default SystemDashboard;
