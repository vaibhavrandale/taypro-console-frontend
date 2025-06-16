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
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_GATEWAY_REQUEST":
      return { ...state, loadingGateway: true, gatewayError: "" };

    case "FETCH_GATEWAY_SUCCESS":
      return {
        ...state,
        loadingGateway: false,
        gateway: action.payload,
      };

    case "FETCH_GATEWAY_FAIL":
      return { ...state, loadingGateway: false, gatewayError: action.payload };

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

const ViewGateway = () => {
  const { id } = useParams();
  const [
    { gateway, robotError, gatewayError, loadingGateway, robot, loadingRobot },
    dispatch,
  ] = useReducer(reducer, {
    gateway: {},
    robot: {},
    loadingRobot: false,
    loadingGateway: false,
    robotError: "",
    gatewayError: "",
  });
  const authtoken = useSelector((state) => state.authtoken);

  useEffect(() => {
    const fetchGateways = async () => {
      dispatch({ type: "FETCH_GATEWAY_REQUEST" });

      try {
        const result = await axios.get(`/api/v1/gateways/${id}`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        console.log(result.data.data);

        dispatch({
          type: "FETCH_GATEWAY_SUCCESS",
          payload: result.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_GATEWAY_FAIL",
          payload: error.response?.data?.error || error.response?.data?.message,
        });
        toast.error(
          error.response?.data?.error || error.response?.data?.message
        );
      }
    };
    if (gateway.gateway_type === "Outdoor") {
      const fetchRobotByGateway = async () => {
        dispatch({ type: "FETCH_ROBOT_REQUEST" });

        try {
          const data = await axios.get(
            `/api/v1/robots/get-robot-using-robot-no/${gateway.gateway_robot_no}`,
            {
              headers: { Authorization: `Bearer ${authtoken}` },
            }
          );

          dispatch({ type: "FETCH_ROBOT_SUCCESS", payload: data.data });
        } catch (error) {
          dispatch({
            type: "FETCH_ROBOT_FAIL",
            payload: error.response.data.error,
          });
          toast.error(
            error.response?.data?.error || error.response?.data?.message
          );
        }
      };
      fetchRobotByGateway();
    }
    fetchGateways();
  }, [authtoken, gateway.gateway_robot_no, gateway.gateway_type, id]);

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
                {gateway.gateway_status ? (
                  <CBadge color="success" className="">
                    Online
                  </CBadge>
                ) : (
                  <CBadge color="danger" className="">
                    Offline
                  </CBadge>
                )}
              </CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableHeaderCell>Last Online Update</CTableHeaderCell>
              <CTableDataCell>
                {new Date(gateway.last_uplink).toLocaleString()}
              </CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableHeaderCell>Gateway Name in Server</CTableHeaderCell>
              <CTableDataCell>
                {gateway.gateway_name_in_lns_server}
              </CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableHeaderCell>Longitude,Latitude</CTableHeaderCell>
              <CTableDataCell>
                {gateway.gateway_longitude === "" ||
                gateway.gateway_lattitude === "" ? (
                  "N/A"
                ) : (
                  <>
                    {gateway.gateway_longitude}&nbsp;,&nbsp;
                    {gateway.gateway_lattitude}&nbsp;{" "}
                    <Link
                      target="blank"
                      to={`https://www.google.com/maps/search/?api=1&query=${gateway.gateway_longitude},${gateway.gateway_lattitude}`}
                    >
                      view on map
                    </Link>
                  </>
                )}
              </CTableDataCell>
            </CTableRow>

            <CTableRow>
              <CTableHeaderCell>SIM Number</CTableHeaderCell>
              <CTableDataCell>
                {gateway.gateway_simnumber ? gateway.gateway_simnumber : "N/A"}
              </CTableDataCell>
            </CTableRow>
            {/* <CTableRow>
              <CTableHeaderCell>Robot Number</CTableHeaderCell>
              <CTableDataCell>
                {gateway.gateway_robot_no ? gateway.gateway_robot_no : "N/A"}
              </CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableHeaderCell>LoRa Number</CTableHeaderCell>
              <CTableDataCell>
                {gateway.gateway_lora_no ? gateway.gateway_lora_no : "N/A"}
              </CTableDataCell>
            </CTableRow> */}
          </CTableBody>
        </CTable>
      )}

      <div className="my-2">
        <h5 className="mt-4 mb-3">Connected Robot/Lora</h5>
        {loadingRobot ? (
          <LoadingSpinner />
        ) : robotError ? (
          <CBadge color="danger" className="p-2">
            No connected robot found.
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
                  {robot.lora_no}&nbsp;&nbsp;({robot.deveui})
                </CTableDataCell>
                <CTableDataCell>{robot.battery_voltage}&nbsp;%</CTableDataCell>
                <CTableDataCell>
                  {robot.last_uplink ? (
                    new Date(robot.last_uplink).toLocaleString()
                  ) : (
                    <CBadge color="warning">LoRa is not activated yet</CBadge>
                  )}
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        )}
      </div>
      <LastActivity lastactivity={gateway.last_activity} />
    </div>
  );
};

export default ViewGateway;
