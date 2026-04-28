import axios from "axios";
import React, { useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  CCol,
  CRow,
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner,
  CAlert,
} from "@coreui/react";
import LastActivity from "../../../components/LastActivity";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, downlink: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const ViewDownlink = () => {
  const [{ loading, error, downlink }, dispatch] = useReducer(reducer, {
    downlink: {},
    loading: true,
    error: "",
  });

  const { id } = useParams();
  // const authtoken = useSelector((state) => state.authtoken);

  useEffect(() => {
    const fetchDownlink = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axios.get(`/api/v1/downlinks/${id}`, {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        });

        dispatch({ type: "FETCH_SUCCESS", payload: data.data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data || "Failed to fetch data",
        });
        toast.error(error.response?.data || "Failed to fetch data");
      }
    };

    fetchDownlink();
  }, [id]);

  return (
    <div className="container mt-4">
      <h2>Downlink Details</h2>
      {loading && <CSpinner color="primary" />}
      {error && <CAlert color="danger">{error}</CAlert>}

      {!loading && !error && (
        <CCard className="my-4">
          <CCardHeader>Downlink Information</CCardHeader>
          <CCardBody>
            <CRow>
              <CCol>
                <strong>Downlink:</strong> {downlink.downlink || "N/A"}
              </CCol>
              <CCol>
                <strong>Decoded String:</strong>{" "}
                {downlink.decodedString || "N/A"}
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol>
                <strong>Hexadecimal:</strong> {downlink.hexadecimal || "N/A"}
              </CCol>
              <CCol>
                <strong>Uplink:</strong> {downlink.uplink || "N/A"}
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol>
                <strong>Additional Info:</strong>{" "}
                {downlink.additionalInfo || "N/A"}
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      )}

      {!loading && !error && (
        <LastActivity lastactivity={downlink.last_activity} />
      )}
    </div>
  );
};

export default ViewDownlink;
