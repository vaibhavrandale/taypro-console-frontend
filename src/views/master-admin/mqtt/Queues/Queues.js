import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CAlert,
  CButton,
} from "@coreui/react";
import axios from "axios";
import React, { useEffect, useReducer } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../../components/LoadingSpinner";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, queues: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "SEND_FLUSH_REQUEST":
      return { ...state, loadingFlush: true, flushError: "" };
    case "SEND_FLUSH_SUCCESS":
      return { ...state, loadingFlush: false };
    case "SEND_FLUSH_FAIL":
      return { ...state, loadingFlush: false, flushError: action.payload };
    default:
      return state;
  }
};

const decodeToHex = (base64) => {
  try {
    return Array.from(atob(base64))
      .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join(" ")
      .toUpperCase();
  } catch {
    return base64;
  }
};

const Queues = ({ deveui }) => {
  const [{ loading, error, queues, loadingFlush, flushError }, dispatch] =
    useReducer(reducer, {
      queues: {},
      loading: true,
      error: "",
      loadingFlush: false,
      flushError: "",
    });

  const authtoken = useSelector((state) => state.authtoken);

  useEffect(() => {
    const fetchQueues = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const response = await axios.get(
          `/api/v1/robots/get-queues/${deveui}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          },
        );
        dispatch({ type: "FETCH_SUCCESS", payload: response.data.data });
      } catch (err) {
        const msg = err.response?.data?.message || err.response?.data?.error;
        dispatch({ type: "FETCH_FAIL", payload: msg });
        toast.error(msg);
      }
    };
    fetchQueues();
  }, [deveui, authtoken]);

  const handleFlushQueue = async () => {
    if (!deveui) {
      toast.error("deveui required to flush queue");
      return;
    }

    dispatch({ type: "SEND_FLUSH_REQUEST" });

    try {
      const res = await axios.post(
        // "/api/v1/robots/send-downlink-in-bulk",
        "/api/v1/robots/flush-queue",
        { deveuiList: [deveui] },
        { headers: { Authorization: `Bearer ${authtoken}` } },
      );
      dispatch({ type: "SEND_FLUSH_SUCCESS" });

      toast.success(res.data.message);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "flush failed";
      dispatch({ type: "SEND_FLUSH_FAIL", payload: msg });
      toast.error(msg);
    }
  };

  return (
    <div>
      {/* Header */}
      {!loading && !error && queues?.totalCount > 0 && (
        <div className="d-flex align-items-center justify-content-between mb-3">
          <span className="fw-bold">📡 Downlink Queue</span>
          <div className="d-flex justify-content-center align-items-center">
            <CBadge color="primary" className="rounded-pill px-3">
              {queues.totalCount} item{queues.totalCount !== 1 ? "s" : ""}
            </CBadge>
            <CButton
              className="btn btn-sm btn-danger m-1"
              onClick={() => handleFlushQueue()}
            >
              {loadingFlush ? <LoadingSpinner /> : "Flush Queue"}
            </CButton>
          </div>
          {flushError && (
            <CAlert color="danger" className="mt-2 mb-0">
              ⚠️ {flushError}
            </CAlert>
          )}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <CAlert color="danger">⚠️ {error}</CAlert>
      ) : queues?.result?.length > 0 ? (
        <div className="table-responsive">
          <CTable bordered small hover align="middle" className="mb-0">
            <CTableHead color="dark">
              <CTableRow>
                <CTableHeaderCell scope="col" style={{ width: 40 }}>
                  #
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                <CTableHeaderCell scope="col">DevEUI</CTableHeaderCell>
                <CTableHeaderCell scope="col" style={{ width: 40 }}>
                  fPort
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" style={{ width: 40 }}>
                  fCnt↓
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">Payload (HEX)</CTableHeaderCell>
                <CTableHeaderCell scope="col" style={{ width: 40 }}>
                  Status
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" style={{ width: 40 }}>
                  Confirmed
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" style={{ width: 40 }}>
                  Encrypted
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {queues.result.map((queue, idx) => (
                <CTableRow key={queue.id}>
                  {/* # */}
                  <CTableDataCell className="text-muted text-center fw-semibold">
                    {idx + 1}
                  </CTableDataCell>

                  {/* ID */}
                  <CTableDataCell>{queue.id}</CTableDataCell>

                  {/* DevEUI */}
                  <CTableDataCell>{queue.devEui}</CTableDataCell>

                  {/* fPort */}
                  <CTableDataCell className="text-center">
                    <CBadge color="info" textColor="dark">
                      {queue.fPort}
                    </CBadge>
                  </CTableDataCell>

                  {/* fCntDown */}
                  <CTableDataCell className="text-center">
                    <CBadge color="warning">{queue.fCntDown}</CBadge>
                  </CTableDataCell>

                  {/* Payload */}
                  <CTableDataCell>
                    <div className="d-flex justify-content-between align-items-center">
                      <p>{decodeToHex(queue.data)}</p>
                      <p>{queue.data}</p>
                    </div>
                  </CTableDataCell>

                  {/* Status */}
                  <CTableDataCell className="text-center">
                    <CBadge color={queue.isPending ? "warning" : "success"}>
                      {queue.isPending ? "Pending" : "Ready"}
                    </CBadge>
                  </CTableDataCell>

                  {/* Confirmed */}
                  <CTableDataCell className="text-center">
                    <CBadge
                      color={queue.confirmed ? "primary" : "light"}
                      textColor={queue.confirmed ? "white" : "dark"}
                    >
                      {queue.confirmed ? "✓ Yes" : "No"}
                    </CBadge>
                  </CTableDataCell>

                  {/* Encrypted */}
                  <CTableDataCell className="text-center">
                    <CBadge
                      color={queue.isEncrypted ? "danger" : "light"}
                      textColor={queue.isEncrypted ? "white" : "dark"}
                    >
                      {queue.isEncrypted ? "🔒 Yes" : "No"}
                    </CBadge>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </div>
      ) : (
        <div className="text-center text-muted py-5">
          <div style={{ fontSize: 36 }}>📭</div>
          <div className="fw-semibold mt-2">No queued commands</div>
          <small>Queue is empty for this device</small>
        </div>
      )}
    </div>
  );
};

export default Queues;
