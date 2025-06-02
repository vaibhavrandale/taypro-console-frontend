import axios from "axios";
import React, { useEffect, useReducer } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  CTable,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CBadge,
  CTableHead,
  CTableHeaderCell,
} from "@coreui/react";
import LastActivity from "../../../components/LastActivity";
import LoadingSpinner from "../../../components/LoadingSpinner";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_ROBOT_REQUEST":
      return { ...state, loadingRobot: true, robotError: "" };

    case "FETCH_ROBOT_SUCCESS":
      return {
        ...state,
        loadingRobot: false,
        robot: action.payload.data,
      };

    case "FETCH_ROBOT_FAIL":
      return { ...state, loadingRobot: false, robotError: action.payload };

    default:
      return state;
  }
};

const ViewRobot = () => {
  const { id } = useParams();
  const [{ robot, loadingRobot, robotError }, dispatch] = useReducer(reducer, {
    robot: {},
    loadingRobot: false,

    robotError: "",
  });
  const authtoken = useSelector((state) => state.authtoken);

  useEffect(() => {
    const fetchRobot = async () => {
      dispatch({ type: "FETCH_ROBOT_REQUEST" });

      try {
        const data = await axios.get(`/api/v1/robots/get-one/${id}`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });

        dispatch({ type: "FETCH_ROBOT_SUCCESS", payload: data.data });
      } catch (error) {
        dispatch({
          type: "FETCH_ROBOT_FAIL",
          payload: error.response.data.error || error.response.data.message,
        });
        toast.error(
          error.response?.data?.error || error.response?.data?.message
        );
      }
    };
    fetchRobot();
  }, [authtoken, id]);

  return (
    <div>
      {loadingRobot ? (
        <LoadingSpinner />
      ) : (
        <>
          <CTable bordered responsive>
            <CTableHead color="secondary">
              <CTableRow>
                <CTableHeaderCell>Field</CTableHeaderCell>
                <CTableHeaderCell>Value</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {Object.entries(robot)
                .filter(([key]) => key !== "last_activity") // Exclude last_activity
                .map(([key, value]) => (
                  <CTableRow key={key} className="align-middle">
                    <CTableDataCell className="fw-semibold text-uppercase ">
                      {key.replace(/_/g, " ")}
                    </CTableDataCell>
                    <CTableDataCell>
                      {typeof value === "boolean" ? (
                        <CBadge
                          color={value ? "success" : "danger"}
                          shape="rounded-pill"
                          className=""
                        >
                          {value ? "Active" : "Inactive"}
                        </CBadge>
                      ) : (
                        <span className=" fw-medium">{String(value)}</span>
                      )}
                    </CTableDataCell>
                  </CTableRow>
                ))}
            </CTableBody>
          </CTable>
          <LastActivity lastactivity={robot.last_activity} />
        </>
      )}
    </div>
  );
};

export default ViewRobot;
