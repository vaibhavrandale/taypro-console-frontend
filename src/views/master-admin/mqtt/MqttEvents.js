import React, { useEffect, useReducer, useState } from "react";

import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { CCol, CFormInput, CRow } from "@coreui/react";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };

    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        mqttevents: action.payload,
      };

    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const MqttEvents = () => {
  const [{ loading, error, mqttevents }, dispatch] = useReducer(reducer, {
    mqttevents: [],
    loading: true,
    error: "",
  });
  const robots = JSON.parse(localStorage.getItem("robots")) || [];

  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const fetchSubscriptions = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const response = await axios.get(
          `/api/v1/mqtt-event-logs/robotwise/count`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          },
        );

        const result = response.data.data;
        dispatch({
          type: "FETCH_SUCCESS",
          payload: result,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data?.message || error.response?.data?.error,
        });
        toast.error(
          error.response?.data?.message || error.response?.data?.error,
        );
      }
    };
    fetchSubscriptions();
  }, [authtoken]);
  const getStatus = (count) => {
    if (count >= 30) return { label: "High", color: "danger" };
    if (count >= 20) return { label: "Medium", color: "warning" };
    return { label: "Low", color: "success" };
  };
  //   console.log(robots);
  //   console.log(robots);
  const robotMap = robots.reduce((acc, robot) => {
    acc[robot.robot_no] = robot;
    return acc;
  }, {});

  const mergedData =
    mqttevents &&
    mqttevents.map((event) => {
      const robot = robotMap[event.robot_no];

      return {
        ...event,
        site_id: robot?.site_id || null,
        block: robot?.block || null,
        company: robot?.company || null,
        lora_no: robot?.lora_no || null,
      };
    });

  const filteredData =
    mergedData &&
    mergedData.filter((robot) =>
      robot.robot_no.toLowerCase().includes(searchTerm.toLowerCase()),
    );

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

  return (
    <div className="">
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <>
          {/* ================= SUMMARY ================= */}
          <div className="row mb-3">
            <div className="col-md-4">
              <div className="card shadow-sm m-1">
                <div className="card-body">
                  <h6>Total Robots</h6>
                  <h5>{mqttevents.length}</h5>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm m-1">
                <div className="card-body">
                  <h6>Total Logs</h6>
                  <h5>{mqttevents.reduce((sum, r) => sum + r.count, 0)}</h5>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm m-1">
                <div className="card-body">
                  <h6>Avg Logs / Robot</h6>
                  <h5>
                    {(
                      mqttevents.reduce((s, r) => s + r.count, 0) /
                      mqttevents.length
                    ).toFixed(1)}
                  </h5>
                </div>
              </div>
            </div>
          </div>
          <CRow className="justify-content-end">
            <CCol md={4}>
              <CFormInput
                type="text"
                placeholder="Search by robot no or deveui"
                className="mb-3"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </CCol>
          </CRow>
          {/* ================= TABLE ================= */}
          <div className="table-responsive">
            <table className="table table-bordered table-hover table-sm">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Robot No</th>
                  <th>Deveui</th>
                  <th>Log Count</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredData
                  .filter((r) => r.robot_no) // remove null robot
                  .sort((a, b) => b.count - a.count) // highest first
                  .map((item, index) => {
                    const status = getStatus(item.count);

                    return (
                      <tr key={item.robot_no}>
                        <td>{index + 1}</td>

                        <td>{item.robot_no.trim()}</td>
                        <td>{item.deveui.trim()}</td>

                        <td>{item.count}</td>

                        <td>
                          <span className={`badge bg-${status.color}`}>
                            {status.label}
                          </span>
                        </td>

                        <td>
                          <Link
                            className="btn btn-sm btn-outline-primary"
                            to={`/${adminroute}/site-management/block-management/${item.site_id}/${item.block}/${item.robot_no}/event-and-frames/${item.deveui}`}
                          >
                            View Logs
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default MqttEvents;
