import React, { useEffect } from "react";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CAlert,
  CCol,
  CRow,
  CBadge,
  CTable,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from "@coreui/react";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../LoadingSpinner";
import Robot from "../../views/robot-position/Robot";
import CleaningStatusCard from "../../views/robot-position/CleaningStatusCard";
import CIcon from "@coreui/icons-react";
import { cilCheckCircle, cilX, cilXCircle } from "@coreui/icons";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_LOG_DETAILS_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_LOG_DETAILS_SUCCESS":
      return { ...state, loading: false, log: action.payload };
    case "FETCH_LOG_DETAILS_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
const Logmodal = ({ _id, modalState, onClose, authtoken, userInfo }) => {
  const [{ loading, log, error }, dispatch] = React.useReducer(reducer, {
    loading: false,
    log: null,
    error: null,
  });

  useEffect(() => {
    const fetchLogDetails = async () => {
      if (!_id) return;

      try {
        dispatch({ type: "FETCH_LOG_DETAILS_REQUEST" });
        // 🔁 Replace with your API
        const res = await axios.get(`/api/v1/robot-tracking/${_id}`, {
          headers: {
            Authorization: `Bearer ${authtoken}`,
          },
        });
        console.log(res);
        dispatch({ type: "FETCH_LOG_DETAILS_SUCCESS", payload: res.data.data });
      } catch (err) {
        dispatch({
          type: "FETCH_LOG_DETAILS_FAILURE",
          payload: err.response.data.error || err.response.data.message,
        });
        toast.error(err.response.data.error || err.response.data.message);
      }
    };

    if (modalState) {
      fetchLogDetails();
    }
  }, [_id, authtoken, modalState]);

  const handleRobotClick = (robot) => {
    toast.success(`Data for Robot ${log.robot_no} clicked!`);
  };

  return (
    <CModal
      visible={modalState}
      onClose={onClose}
      size="xl" // 🔥 Large modal
      alignment="top"
      backdrop="static" // optional (prevents click outside close)
      scrollable
    >
      <CModalHeader
        closeButton={false}
        className="d-flex justify-content-between align-items-center"
      >
        <CModalTitle>
          <span>Log Details </span>
        </CModalTitle>
        <button
          type="button"
          className="border-0 p-0"
          onClick={onClose}
          style={{ background: "none" }}
        >
          <CIcon icon={cilX} size="xl" />
        </button>
      </CModalHeader>

      {/* <CModalBody
        style={{
          width: "100%",
        }}
        className="overflow-auto"
      >
        {loading ? (
          <div className="text-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="p-3">
            <p>
              <strong>Log ID:</strong> {_id}
            </p>

         
            {log && log ? (
              <>
              <Robot
                robot={log}
                handleRobotClick={handleRobotClick}
                deleteHandler={""}
                loadingDelete={""}
              />
              
              </>
            ) : (
              <p>No data found</p>
            )}
          </div>
        )}
      </CModalBody> */}
      <CModalBody className="p-3">
        {loading ? (
          <div className="text-center">
            <LoadingSpinner />
          </div>
        ) : log ? (
          <>
            {/* 🔷 HEADER SUMMARY */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="mb-0">{log.robot_no}</h5>
                <small className="text-medium-emphasis">
                  {log.site_id} | {log.block}
                </small>
              </div>
            </div>

            {/* 🔷 TRACK + VISUAL */}
            <CCard className="mb-3">
              <CCardHeader>Robot Movement</CCardHeader>
              <CCardBody className="py-4 overflow-x-auto">
                <Robot
                  robot={log}
                  handleRobotClick={handleRobotClick}
                  deleteHandler={""}
                  loadingDelete={""}
                />
              </CCardBody>
            </CCard>

            <CleaningStatusCard robot={log} userInfo={userInfo} />

            {userInfo.type === "Internal" && (
              <CCard>
                <CCardHeader>Tracking Logs</CCardHeader>
                <CCardBody style={{ maxHeight: "250px", overflow: "auto" }}>
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Point</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        log.track_details
                          ?.map((t, i) => (
                            <tr key={i}>
                              <td>{t.point}</td>
                              <td>
                                {new Date(t.timestamp).toLocaleString("en-GB", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                  hour12: true,
                                })}
                              </td>
                            </tr>
                          ))
                          .reverse() /* Show latest first */
                      }
                    </tbody>
                  </table>
                </CCardBody>
              </CCard>
            )}

            <CCard className="border-0 my-3 shadow-sm bg-secondary text-light">
              <CCardBody>
                <h5 className="text-light mb-3">🤖 Robot Information</h5>
                <CTable
                  striped
                  hover
                  small
                  bordered
                  responsive
                  size="sm"
                  className="mb-0 text-light"
                >
                  <CTableBody>
                    <CTableRow>
                      <CTableHeaderCell scope="row">Robot</CTableHeaderCell>
                      <CTableDataCell
                        style={{ minWidth: "100px", fontSize: "13px" }}
                      >
                        {log.robot_no}
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell scope="row">Block</CTableHeaderCell>
                      <CTableDataCell
                        style={{ minWidth: "100px", fontSize: "13px" }}
                      >
                        {log.block}
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell scope="row">Type</CTableHeaderCell>
                      <CTableDataCell
                        style={{ minWidth: "100px", fontSize: "13px" }}
                      >
                        {log.robot_type}
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell scope="row">Site</CTableHeaderCell>
                      <CTableDataCell
                        style={{ minWidth: "100px", fontSize: "13px" }}
                      >
                        {log.site_id}
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell scope="row">Lora No</CTableHeaderCell>
                      <CTableDataCell
                        style={{ minWidth: "100px", fontSize: "13px" }}
                      >
                        {log.lora_no}
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell scope="row">
                        Row Length
                      </CTableHeaderCell>
                      <CTableDataCell
                        style={{ minWidth: "100px", fontSize: "13px" }}
                      >
                        {log.row_length * 2} m
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>

            {log.cleaning?.cleaning_mertic && (
              <CCard className="border-0 my-3 shadow-sm bg-secondary text-light">
                <CCardBody>
                  <h5 className="text-light mb-3">
                    Cleaning Metric{" "}
                    {log.cleaning?.cleaning_mertic ? (
                      <CIcon
                        icon={cilCheckCircle}
                        style={{
                          color: "black",
                          background: "green",
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      <CIcon
                        icon={cilXCircle}
                        style={{
                          color: "black",
                          background: "red",
                          borderRadius: "50%",
                        }}
                      />
                    )}
                  </h5>
                  <CTable
                    striped
                    hover
                    bordered
                    responsive
                    size="sm"
                    className="mb-0 text-light"
                  >
                    <CTableBody>
                      <CTableRow>
                        <CTableHeaderCell>Metric</CTableHeaderCell>
                        <CTableHeaderCell
                          style={{ minWidth: "10px", fontSize: "14px" }}
                        >
                          Value
                        </CTableHeaderCell>
                        <CTableHeaderCell>Received At</CTableHeaderCell>
                      </CTableRow>

                      {userInfo.type === "Internal" && (
                        <>
                          <CTableRow>
                            <CTableHeaderCell
                              scope="row"
                              style={{ minWidth: "170px", fontSize: "14px" }}
                            >
                              Forward Cleaning Time
                            </CTableHeaderCell>
                            <CTableDataCell
                              style={{ minWidth: "100px", fontSize: "13px" }}
                            >
                              {log.cleaning.forward_cleaning_time ? (
                                <>{log.cleaning.forward_cleaning_time} Sec.</>
                              ) : (
                                <CBadge color="warning">N/A</CBadge>
                              )}
                            </CTableDataCell>

                            <CTableDataCell
                              style={{ minWidth: "100px", fontSize: "13px" }}
                            >
                              {log.cleaning
                                .forward_cleaning_time_received_at ? (
                                <>
                                  {new Date(
                                    log.cleaning
                                      .forward_cleaning_time_received_at,
                                  ).toLocaleString("en-GB", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: true,
                                  })}{" "}
                                </>
                              ) : (
                                <CBadge color="warning">N/A</CBadge>
                              )}
                            </CTableDataCell>
                          </CTableRow>

                          <CTableRow>
                            <CTableHeaderCell
                              scope="row"
                              style={{ minWidth: "170px", fontSize: "14px" }}
                            >
                              Reverse Cleaning Time
                            </CTableHeaderCell>
                            <CTableDataCell
                              style={{ minWidth: "100px", fontSize: "13px" }}
                            >
                              {log.cleaning.reverse_cleaning_time ? (
                                <>{log.cleaning.reverse_cleaning_time} Sec.</>
                              ) : (
                                <CBadge color="warning">N/A</CBadge>
                              )}
                            </CTableDataCell>
                            <CTableDataCell
                              style={{ minWidth: "100px", fontSize: "13px" }}
                            >
                              {log.cleaning
                                .reverse_cleaning_time_received_at ? (
                                new Date(
                                  log.cleaning
                                    .reverse_cleaning_time_received_at,
                                ).toLocaleString("en-GB", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                  hour12: true,
                                })
                              ) : (
                                <CBadge color="warning">N/A</CBadge>
                              )}
                            </CTableDataCell>
                          </CTableRow>
                        </>
                      )}

                      <CTableRow>
                        <CTableHeaderCell
                          scope="row"
                          style={{ minWidth: "170px", fontSize: "14px" }}
                        >
                          Total Cleaning Time
                        </CTableHeaderCell>
                        <CTableDataCell
                          style={{ minWidth: "100px", fontSize: "13px" }}
                        >
                          {log.cleaning.total_cleaning_time ? (
                            <>
                              {" "}
                              {new Date(
                                log.cleaning.total_cleaning_time,
                              ).toLocaleString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true,
                              })}{" "}
                            </> // Use the utility function here
                          ) : (
                            <CBadge color="warning">N/A</CBadge>
                          )}
                        </CTableDataCell>
                        <CTableDataCell
                          style={{ minWidth: "100px", fontSize: "13px" }}
                        >
                          {log.cleaning.total_cleaning_time_received_at ? (
                            new Date(
                              log.cleaning.total_cleaning_time_received_at,
                            ).toLocaleString("en-GB", {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: true,
                            })
                          ) : (
                            <CBadge color="warning">N/A</CBadge>
                          )}
                        </CTableDataCell>
                      </CTableRow>

                      <CTableRow>
                        <CTableHeaderCell
                          scope="row"
                          style={{ minWidth: "170px", fontSize: "14px" }}
                        >
                          Battery Before Cleaning
                        </CTableHeaderCell>
                        <CTableDataCell
                          style={{ minWidth: "100px", fontSize: "13px" }}
                        >
                          {log.cleaning.battery_before_cleaning ? (
                            <>{log.cleaning.battery_before_cleaning} %</>
                          ) : (
                            <CBadge color="warning">N/A</CBadge>
                          )}
                        </CTableDataCell>
                        <CTableDataCell
                          style={{ minWidth: "100px", fontSize: "13px" }}
                        >
                          {log.cleaning.battery_before_cleaning_received_at ? (
                            new Date(
                              log.cleaning.battery_before_cleaning_received_at,
                            ).toLocaleString("en-GB", {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: true,
                            })
                          ) : (
                            <CBadge color="warning">N/A</CBadge>
                          )}
                        </CTableDataCell>
                      </CTableRow>

                      <CTableRow>
                        <CTableHeaderCell
                          scope="row"
                          style={{ minWidth: "170px", fontSize: "14px" }}
                        >
                          Battery After Cleaning
                        </CTableHeaderCell>
                        <CTableDataCell
                          style={{ minWidth: "100px", fontSize: "13px" }}
                        >
                          {log.cleaning.battery_after_cleaning ? (
                            <>{log.cleaning.battery_after_cleaning} %</>
                          ) : (
                            <CBadge color="warning">N/A</CBadge>
                          )}
                        </CTableDataCell>
                        <CTableDataCell
                          style={{ minWidth: "100px", fontSize: "13px" }}
                        >
                          {log.cleaning.battery_after_cleaning_received_at ? (
                            new Date(
                              log.cleaning.battery_after_cleaning_received_at,
                            ).toLocaleString("en-GB", {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: true,
                            })
                          ) : (
                            <CBadge color="warning">N/A</CBadge>
                          )}
                        </CTableDataCell>
                      </CTableRow>
                      {userInfo.type === "Internal" && (
                        <>
                          <CTableRow>
                            <CTableHeaderCell
                              scope="row"
                              style={{ minWidth: "170px", fontSize: "14px" }}
                            >
                              Battery At Reverse Station
                            </CTableHeaderCell>
                            <CTableDataCell
                              style={{ minWidth: "100px", fontSize: "13px" }}
                            >
                              {log.cleaning.battery_at_reverse_station ? (
                                <>{log.cleaning.battery_at_reverse_station} %</>
                              ) : (
                                <CBadge color="warning">N/A</CBadge>
                              )}
                            </CTableDataCell>
                            <CTableDataCell
                              style={{ minWidth: "100px", fontSize: "13px" }}
                            >
                              {log.cleaning
                                .battery_at_reverse_station_received_at ? (
                                new Date(
                                  log.cleaning
                                    .battery_at_reverse_station_received_at,
                                ).toLocaleString("en-GB", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                  hour12: true,
                                })
                              ) : (
                                <CBadge color="warning">N/A</CBadge>
                              )}
                            </CTableDataCell>
                          </CTableRow>

                          <CTableRow>
                            <CTableHeaderCell
                              scope="row"
                              style={{ minWidth: "170px", fontSize: "14px" }}
                            >
                              Temp. Before Cleaning
                            </CTableHeaderCell>
                            <CTableDataCell
                              style={{ minWidth: "100px", fontSize: "13px" }}
                            >
                              {log.cleaning.temperature_before_cleaning ? (
                                <>
                                  {log.cleaning.temperature_before_cleaning} °C
                                </>
                              ) : (
                                <CBadge color="warning">N/A</CBadge>
                              )}
                            </CTableDataCell>
                            <CTableDataCell
                              style={{ minWidth: "100px", fontSize: "13px" }}
                            >
                              {log.cleaning
                                .temperature_before_cleaning_received_at ? (
                                new Date(
                                  log.cleaning
                                    .temperature_before_cleaning_received_at,
                                ).toLocaleString("en-GB", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                  hour12: true,
                                })
                              ) : (
                                <CBadge color="warning">N/A</CBadge>
                              )}
                            </CTableDataCell>
                          </CTableRow>

                          <CTableRow>
                            <CTableHeaderCell
                              scope="row"
                              style={{ minWidth: "170px", fontSize: "14px" }}
                            >
                              Temp. At Reverse Station
                            </CTableHeaderCell>
                            <CTableDataCell
                              style={{ minWidth: "100px", fontSize: "13px" }}
                            >
                              {log.cleaning.temperature_at_reverse_station ? (
                                <>
                                  {log.cleaning.temperature_at_reverse_station}{" "}
                                  °C
                                </>
                              ) : (
                                <CBadge color="warning">N/A</CBadge>
                              )}
                            </CTableDataCell>
                            <CTableDataCell
                              style={{ minWidth: "100px", fontSize: "13px" }}
                            >
                              {log.cleaning
                                .temperature_at_reverse_station_received_at ? (
                                new Date(
                                  log.cleaning
                                    .temperature_at_reverse_station_received_at,
                                ).toLocaleString("en-GB", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                  hour12: true,
                                })
                              ) : (
                                <CBadge color="warning">N/A</CBadge>
                              )}
                            </CTableDataCell>
                          </CTableRow>

                          <CTableRow>
                            <CTableHeaderCell
                              scope="row"
                              style={{ minWidth: "170px", fontSize: "14px" }}
                            >
                              Temp. After Cleaning
                            </CTableHeaderCell>
                            <CTableDataCell
                              style={{ minWidth: "100px", fontSize: "13px" }}
                            >
                              {log.cleaning.temperature_after_cleaning ? (
                                <>
                                  {log.cleaning.temperature_after_cleaning} °C
                                </>
                              ) : (
                                <CBadge color="warning">N/A</CBadge>
                              )}
                            </CTableDataCell>
                            <CTableDataCell
                              style={{ minWidth: "100px", fontSize: "13px" }}
                            >
                              {log.cleaning
                                .temperature_after_cleaning_received_at ? (
                                new Date(
                                  log.cleaning
                                    .temperature_after_cleaning_received_at,
                                ).toLocaleString("en-IN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                  hour12: true,
                                })
                              ) : (
                                <CBadge color="warning">N/A</CBadge>
                              )}
                            </CTableDataCell>
                          </CTableRow>

                          <CTableRow>
                            <CTableHeaderCell
                              scope="row"
                              style={{ minWidth: "170px", fontSize: "14px" }}
                            >
                              Average Brush Current
                            </CTableHeaderCell>
                            <CTableDataCell
                              style={{ minWidth: "100px", fontSize: "13px" }}
                            >
                              {log.cleaning.cycle_average_brush_current ? (
                                <>
                                  {log.cleaning.cycle_average_brush_current} A
                                </>
                              ) : (
                                <CBadge color="warning">N/A</CBadge>
                              )}
                            </CTableDataCell>
                            <CTableDataCell
                              style={{ minWidth: "100px", fontSize: "13px" }}
                            >
                              {log.cleaning
                                .cycle_average_brush_current_received_at ? (
                                new Date(
                                  log.cleaning
                                    .cycle_average_brush_current_received_at,
                                ).toLocaleString("en-GB", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                  hour12: true,
                                })
                              ) : (
                                <CBadge color="warning">N/A</CBadge>
                              )}
                            </CTableDataCell>
                          </CTableRow>

                          <CTableRow>
                            <CTableHeaderCell
                              scope="row"
                              style={{ minWidth: "170px", fontSize: "14px" }}
                            >
                              Average Wheel Current
                            </CTableHeaderCell>
                            <CTableDataCell
                              style={{ minWidth: "100px", fontSize: "13px" }}
                            >
                              {log.cleaning.cycle_average_wheel_current ? (
                                <>
                                  {log.cleaning.cycle_average_wheel_current} A
                                </>
                              ) : (
                                <CBadge color="warning">N/A</CBadge>
                              )}
                            </CTableDataCell>
                            <CTableDataCell
                              style={{ minWidth: "100px", fontSize: "13px" }}
                            >
                              {log.cleaning
                                .cycle_average_wheel_current_received_at ? (
                                new Date(
                                  log.cleaning
                                    .cycle_average_wheel_current_received_at,
                                ).toLocaleString("en-GB", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                  hour12: true,
                                })
                              ) : (
                                <CBadge color="warning">N/A</CBadge>
                              )}
                            </CTableDataCell>
                          </CTableRow>

                          <CTableRow>
                            <CTableHeaderCell
                              scope="row"
                              style={{ minWidth: "170px", fontSize: "14px" }}
                            >
                              Max Brush Current
                            </CTableHeaderCell>
                            <CTableDataCell
                              style={{ minWidth: "100px", fontSize: "13px" }}
                            >
                              {log.cleaning.cycle_max_brush_current !== null &&
                              log.cleaning.cycle_max_brush_current !==
                                undefined ? (
                                <>{log.cleaning.cycle_max_brush_current} A</>
                              ) : (
                                <CBadge color="warning">N/A</CBadge>
                              )}
                            </CTableDataCell>

                            <CTableDataCell
                              style={{ minWidth: "100px", fontSize: "13px" }}
                            >
                              {log.cleaning
                                .cycle_max_brush_current_received_at ? (
                                new Date(
                                  log.cleaning
                                    .cycle_max_brush_current_received_at,
                                ).toLocaleString("en-GB", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                  hour12: true,
                                })
                              ) : (
                                <CBadge color="warning">N/A</CBadge>
                              )}
                            </CTableDataCell>
                          </CTableRow>

                          <CTableRow>
                            <CTableHeaderCell
                              scope="row"
                              style={{ minWidth: "170px", fontSize: "14px" }}
                            >
                              Max Wheel Current
                            </CTableHeaderCell>
                            <CTableDataCell
                              style={{ minWidth: "100px", fontSize: "13px" }}
                            >
                              {log.cleaning.cycle_max_wheel_current ? (
                                <>{log.cleaning.cycle_max_wheel_current} A</>
                              ) : (
                                <CBadge color="warning">N/A</CBadge>
                              )}
                            </CTableDataCell>
                            <CTableDataCell
                              style={{ minWidth: "100px", fontSize: "13px" }}
                            >
                              {log.cleaning
                                .cycle_max_wheel_current_received_at ? (
                                new Date(
                                  log.cleaning
                                    .cycle_max_wheel_current_received_at,
                                ).toLocaleString("en-GB", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                  hour12: true,
                                })
                              ) : (
                                <CBadge color="warning">N/A</CBadge>
                              )}
                            </CTableDataCell>
                          </CTableRow>

                          <CTableRow>
                            <CTableHeaderCell
                              scope="row"
                              style={{ minWidth: "170px", fontSize: "14px" }}
                            >
                              Cycle Number
                            </CTableHeaderCell>
                            <CTableDataCell
                              style={{ minWidth: "100px", fontSize: "13px" }}
                            >
                              {log.cleaning.cycle_count ? (
                                log.cleaning.cycle_count
                              ) : (
                                <CBadge color="warning">N/A</CBadge>
                              )}
                            </CTableDataCell>
                            <CTableDataCell
                              style={{ minWidth: "100px", fontSize: "13px" }}
                            >
                              {log.cleaning.cycle_count_received_at ? (
                                new Date(
                                  log.cleaning.cycle_count_received_at,
                                ).toLocaleString("en-GB", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                  hour12: true,
                                })
                              ) : (
                                <CBadge color="warning">N/A</CBadge>
                              )}
                            </CTableDataCell>
                          </CTableRow>
                        </>
                      )}
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </CCard>
            )}
          </>
        ) : (
          <p>No data found</p>
        )}
      </CModalBody>
    </CModal>
  );
};

export default Logmodal;
