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
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };

    case "FETCH_SUCCESS":
      return { ...state, loading: false, gateway: action.payload };

    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
const ViewGateway = () => {
  const { id } = useParams();
  // const authtoken = useSelector((state) => state.authtoken);

  const [{ gateway, error, loading }, dispatch] = useReducer(reducer, {
    gateway: {},
    error: "",
    loading: false,
  });

  useEffect(() => {
    const fetchGateway = async () => {
      dispatch({ type: "FETCH_REQUEST" });

      try {
        const res = await axios.get(`/api/v1/gateways/${id}`, {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        });
        console.log(res.data.data);
        dispatch({
          type: "FETCH_SUCCESS",
          payload: res.data.data,
        });
      } catch (error) {
        const msg =
          error?.response?.data?.error || error?.response?.data?.message;

        dispatch({ type: "FETCH_FAIL", payload: msg });
        toast.error(msg);
      }
    };

    fetchGateway();
  }, [id]);

  return (
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <CBadge color="danger" className="p-2">
          {error}
        </CBadge>
      ) : (
        <>
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

          <div className="my-4">
            <h5 className="mb-3">Connected Robot / Lora</h5>

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
                  <CTableDataCell>{gateway?.robot?.robot_no}</CTableDataCell>

                  <CTableDataCell>
                    <CBadge
                      color={
                        gateway?.robot?.lora_state === 1 ? "success" : "danger"
                      }
                    >
                      {gateway?.robot?.lora_state === 1 ? "Online" : "Offline"}
                    </CBadge>
                  </CTableDataCell>

                  <CTableDataCell>{gateway?.robot?.site_id}</CTableDataCell>

                  <CTableDataCell>
                    {gateway?.robot?.lora_no} ({gateway?.robot?.deveui})
                  </CTableDataCell>

                  <CTableDataCell>
                    {gateway?.robot?.battery_voltage ?? "N/A"}%
                  </CTableDataCell>

                  <CTableDataCell>
                    {gateway?.robot?.last_uplink ? (
                      new Date(gateway?.robot?.last_uplink).toLocaleString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          minute: "2-digit",
                          hour: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        },
                      )
                    ) : (
                      <CBadge color="warning">LoRa is not activated yet</CBadge>
                    )}
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </div>

          <LastActivity lastactivity={gateway.last_activity} />
        </>
      )}
    </div>
  );
};

export default ViewGateway;
