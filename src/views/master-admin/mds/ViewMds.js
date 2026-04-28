import React, { useEffect, useReducer } from "react";
import {
  CTable,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CBadge,
} from "@coreui/react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner";
import LastActivity from "../../../components/LastActivity";
import { format } from "date-fns";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_MDS_REQUEST":
      return { ...state, loadingMds: true, mdsError: "" };
    case "FETCH_MDS_SUCCESS":
      return { ...state, loadingMds: false, mds: action.payload.data };
    case "FETCH_MDS_FAIL":
      return { ...state, loadingMds: false, mdsError: action.payload };
    default:
      return state;
  }
};

const ViewMds = () => {
  const { id } = useParams();
  const [{ mds, loadingMds }, dispatch] = useReducer(reducer, {
    mds: {},
    loadingMds: false,
    mdsError: "",
  });

  // const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);

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

  useEffect(() => {
    const fetchMds = async () => {
      dispatch({ type: "FETCH_MDS_REQUEST" });
      try {
        const data = await axios.get(`/api/v1/mds-device/get-mds/${id}`, {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        });
        dispatch({ type: "FETCH_MDS_SUCCESS", payload: data.data });
      } catch (error) {
        dispatch({
          type: "FETCH_MDS_FAIL",
          payload: error.response?.data?.error || "Failed to fetch MDS Device",
        });
        toast.error(
          error.response?.data?.error || error.response?.data?.message,
        );
      }
    };
    fetchMds();
  }, [id]);

  const formatValue = (key, value) => {
    if (typeof value === "boolean") {
      return (
        <CBadge color={value ? "success" : "danger"} shape="rounded-pill">
          {value ? "Yes" : "No"}
        </CBadge>
      );
    }

    if (value === null || value === undefined) return <i>Not Available</i>;

    if (
      key.includes("date") ||
      key.includes("createdAt") ||
      key.includes("updatedAt")
    ) {
      try {
        return format(new Date(value), "dd MMM yyyy, hh:mm a");
      } catch {
        return value;
      }
    }

    return <span className="fw-medium">{String(value)}</span>;
  };

  const sections = [
    {
      title: "Basic Details",
      fields: [
        "mds_no",
        "block",
        "deveui",
        "site_id",
        "company",
        "manufactured_date",
        "version",
        "pcb_version",
        "speed",
        "lora_no",
        "old_lora_no",
      ],
    },
    {
      title: "Status & Technical Info",
      fields: [
        "lora_state",
        "auto_clean",
        "last_status",
        "battery_voltage",
        "temperature",
        "dock",
        "rssi",
        "snr",
        "last_gateway",
        "last_uplink",
        "motor1_current",
        "motor2_current",
        "activate",
      ],
    },
    {
      title: "Row Details",
      fields: ["no_of_rows", "last_location", "current_location"],
    },
    {
      title: "Linked Robot Info",
      base: "robot",
      fields: [
        "robot_no",
        "deveui",
        "block",
        "lora_no",
        "old_lora_no",
        "version",
        "pcb_version",
      ],
    },
  ];

  return loadingMds ? (
    <LoadingSpinner />
  ) : (
    <>
      {(userInfo?.role === "Master Admin" ||
        userInfo?.role === "Factory Admin") && (
        <div
          className="d-flex justify-content-end gap-2 mx-auto mb-3"
          style={{ maxWidth: "900px" }}
        >
          <Link
            to={`/${adminroute}/mds/site-management/block-management/${
              mds.site_id
            }/${encodeURIComponent(mds.block)}/${mds.mds_no}`}
            className="btn btn-outline-primary btn-sm"
          >
            Mds Operation
          </Link>
          <Link
            to={`/${adminroute}/mds-devices/update/${mds._id}`}
            className="btn btn-outline-warning btn-sm"
          >
            Update MDS
          </Link>
        </div>
      )}

      {sections.map((section) => (
        <div
          key={section.title}
          className="mb-4 mx-auto"
          style={{ maxWidth: "900px" }}
        >
          <div className="d-flex justify-content-center mb-2">
            <h6
              className="bg-light px-3 py-2 text-dark fw-bold border rounded text-center"
              style={{ maxWidth: "300px", width: "100%" }}
            >
              {section.title}
            </h6>
          </div>

          <CTable
            bordered
            responsive
            hover
            className="mb-3"
            style={{ fontSize: "0.9rem" }}
          >
            <CTableBody>
              {section.fields.map((field) => {
                const fullPath = section.base
                  ? `${section.base}.${field}`
                  : field;
                const value = fullPath
                  .split(".")
                  .reduce((obj, key) => obj?.[key], mds);

                return (
                  <CTableRow key={field}>
                    <CTableDataCell
                      className="fw-semibold text-uppercase"
                      style={{
                        color: "white",
                        backgroundColor: "#343a40",
                        width: "35%",
                      }}
                    >
                      {field
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (char) => char.toUpperCase())}
                    </CTableDataCell>
                    <CTableDataCell>{formatValue(field, value)}</CTableDataCell>
                  </CTableRow>
                );
              })}
            </CTableBody>
          </CTable>
        </div>
      ))}
      <LastActivity lastactivity={mds.last_activity} />
    </>
  );
};

export default ViewMds;
