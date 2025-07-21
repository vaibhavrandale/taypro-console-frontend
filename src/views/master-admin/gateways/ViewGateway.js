import axios from "axios";
import React, { useEffect, useReducer } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  CTable,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CBadge,
  CTableHead,
} from "@coreui/react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import LastActivity from "../../../components/LastActivity";

const initialState = {
  gateway: {},
  robot: {},
  loadingGateway: false,
  loadingRobot: false,
  gatewayError: "",
  robotError: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_GATEWAY_REQUEST":
      return { ...state, loadingGateway: true, gatewayError: "" };
    case "FETCH_GATEWAY_SUCCESS":
      return { ...state, loadingGateway: false, gateway: action.payload };
    case "FETCH_GATEWAY_FAIL":
      return { ...state, loadingGateway: false, gatewayError: action.payload };

    case "FETCH_ROBOT_REQUEST":
      return { ...state, loadingRobot: true, robotError: "" };
    case "FETCH_ROBOT_SUCCESS":
      return { ...state, loadingRobot: false, robot: action.payload };
    case "FETCH_ROBOT_FAIL":
      return { ...state, loadingRobot: false, robotError: action.payload };

    default:
      return state;
  }
};

const ViewGateway = () => {
  const { id } = useParams();
  const authtoken = useSelector((state) => state.authtoken);

  const [
    { gateway, robot, loadingGateway, loadingRobot, gatewayError, robotError },
    dispatch,
  ] = useReducer(reducer, {
    gateway: {},
    robot: {},
    loadingGateway: false,
    loadingRobot: false,
    gatewayError: "",
    robotError: "",
  });

  useEffect(() => {
    const fetchGateway = async () => {
      dispatch({ type: "FETCH_GATEWAY_REQUEST" });
      try {
        const res = await axios.get(`/api/v1/gateways/${id}`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        const gatewayData = res.data.data;
        dispatch({ type: "FETCH_GATEWAY_SUCCESS", payload: gatewayData });

        // Fetch robot only if gateway is Outdoor with required fields
        const {
          gateway_type,
          gateway_robot_no,
          gateway_lora_deveui,
          gateway_lora_no,
        } = gatewayData;
        const hasRobotInfo =
          gateway_robot_no && gateway_lora_deveui && gateway_lora_no;
        if (gateway_type === "Outdoor" && hasRobotInfo) {
          fetchRobotByGateway(gateway_robot_no);
        }
      } catch (error) {
        const msg =
          error?.response?.data?.error || error?.response?.data?.message;
        dispatch({ type: "FETCH_GATEWAY_FAIL", payload: msg });
        toast.error(msg);
      }
    };

    const fetchRobotByGateway = async (robotNo) => {
      dispatch({ type: "FETCH_ROBOT_REQUEST" });
      try {
        const res = await axios.get(
          `/api/v1/robots/get-robot-using-robot-no/${robotNo}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );

        dispatch({ type: "FETCH_ROBOT_SUCCESS", payload: res.data.data });
      } catch (error) {
        const msg =
          error?.response?.data?.error || error?.response?.data?.message;
        dispatch({ type: "FETCH_ROBOT_FAIL", payload: msg });
        toast.error(msg);
      }
    };

    fetchGateway();
  }, [authtoken, id]);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleString();
  console.log(robot);

  return (
    <div>
      {loadingGateway ? (
        <LoadingSpinner />
      ) : (
        <CTable striped bordered responsive className="bg-important">
          <CTableBody>
            <CTableRow>
              <CTableHeaderCell>Gateway ID</CTableHeaderCell>
              <CTableDataCell>
                {gateway.gateway_id_in_lns_server}
              </CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableHeaderCell>Gateway Status</CTableHeaderCell>
              <CTableDataCell>
                <CBadge color={gateway.gateway_status ? "success" : "danger"}>
                  {gateway.gateway_status ? "Online" : "Offline"}
                </CBadge>
              </CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableHeaderCell>Last Online Update</CTableHeaderCell>
              <CTableDataCell>
                {gateway.last_uplink
                  ? new Date(gateway.last_uplink).toLocaleString("en-GB")
                  : "N/A"}
              </CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableHeaderCell>Gateway Name in Server</CTableHeaderCell>
              <CTableDataCell>
                {gateway.gateway_name_in_lns_server}
              </CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableHeaderCell>Longitude, Latitude</CTableHeaderCell>
              <CTableDataCell>
                {gateway.gateway_longitude && gateway.gateway_lattitude ? (
                  <>
                    {gateway.gateway_longitude}, {gateway.gateway_lattitude}{" "}
                    <Link
                      target="blank"
                      to={`https://www.google.com/maps/search/?api=1&query=${gateway.gateway_longitude},${gateway.gateway_lattitude}`}
                    >
                      view on map
                    </Link>
                  </>
                ) : (
                  "N/A"
                )}
              </CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableHeaderCell>SIM Number</CTableHeaderCell>
              <CTableDataCell>
                {gateway.gateway_simnumber || "N/A"}
              </CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>
      )}
      <div className="my-4">
        <h5 className="mb-3">Connected Robot / Lora</h5>

        {loadingRobot ? (
          <LoadingSpinner />
        ) : robotError ? (
          <CBadge color="danger" className="p-2">
            {robotError}
          </CBadge>
        ) : !robot || Object.keys(robot).length === 0 ? (
          <CBadge color="warning" className="p-3">
            No Lora/Robot assigned to this gateway.
          </CBadge>
        ) : (
          <CTable striped bordered hover responsive className="bg-important">
            <CTableHead color="secondary">
              <CTableRow>
                <CTableHeaderCell>Robot No</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Site ID</CTableHeaderCell>
                <CTableHeaderCell>LoRa Serial No</CTableHeaderCell>
                <CTableHeaderCell>Battery %</CTableHeaderCell>
                <CTableHeaderCell>Last Seen</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow>
                <CTableDataCell>{robot.robot_no}</CTableDataCell>
                <CTableDataCell>
                  <CBadge color={robot.lora_state === 1 ? "success" : "danger"}>
                    {robot.lora_state === 1 ? "Online" : "Offline"}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>{robot.site_id}</CTableDataCell>
                <CTableDataCell>
                  {robot.lora_no} ({robot.deveui})
                </CTableDataCell>
                <CTableDataCell>{robot.battery_voltage}%</CTableDataCell>
                <CTableDataCell>
                  {robot.last_uplink ? (
                    <>{new Date(robot.last_uplink).toLocaleString("en-GB")}</>
                  ) : (
                    <CBadge color="warning">LoRa is not activated yet</CBadge>
                  )}
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        )}
      </div>

      {gatewayError && (
        <CBadge color="danger" className="p-2">
          {gatewayError}
        </CBadge>
      )}
      <LastActivity lastactivity={gateway.last_activity} />
    </div>
  );
};

export default ViewGateway;
