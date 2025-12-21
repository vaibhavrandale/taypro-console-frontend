import React, { useState } from "react";
import {
  COffcanvas,
  COffcanvasHeader,
  COffcanvasTitle,
  COffcanvasBody,
  CBadge,
  CCard,
  CCardBody,
  CTable,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
} from "@coreui/react";
import BatteryStatusCard from "./BatteryStatusCard";
import CleaningStatusCard from "./CleaningStatusCard";
import TrackingDetailsTable from "./TrackDetailsTable";
import { cilCheckCircle, cilX, cilXCircle } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { getRobotPhase } from "./helpers";
import RobotLastActivity from "./RobotLastActivity";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../components/LoadingSpinner";

const RobotSidebar = ({
  robot,
  deleteHandler,
  loadingDelete,
  visible,
  onClose,
  userInfo,
}) => {
  const lastreeivedPointInTracking =
    robot.track_details?.slice(-1)[0]?.point || 0;
  let L = robot.row_length;
  let item = robot.cleaning;
  // const distanceCovered = pt;
  const { phase, badgeColor } = getRobotPhase(
    lastreeivedPointInTracking,
    L,
    item,
    robot.track_details,
    robot.createdAt // ✅ Pass createdAt to check if document is from today
  );
  const navigate = useNavigate();
  const authtoken = useSelector((state) => state.authtoken);
  const [commandButton, setCommandButton] = useState(null);

  // Command codes
  const start = "11";
  const stop = "14";
  const returntodock = "15";

  // Send downlink command to robot
  const sendsingleDownlink = async (command, index) => {
    setCommandButton(index);
    try {
      const data = await axios.post(
        "/api/v1/robots/send-mqtt-downlink",
        {
          deveui: robot.deveui,
          robot_no: robot.robot_no,
          site_id: robot.site_id,
          payload: command,
          lora_no: robot.lora_no,
        },
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
      );

      toast.success(data.data.message || "Command sent successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to send command"
      );
    } finally {
      setCommandButton(null);
    }
  };

  // 🔹 Utility function (can put this in a utils.js file or above your component)
  const formatTime = (totalSec) => {
    if (!totalSec || isNaN(totalSec)) return "N/A";

    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    let result = "";
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m `;
    if (seconds > 0) result += `${seconds}s`;

    return result.trim();
  };

  return (
    <COffcanvas
      placement="end"
      visible={visible} // ✅ controlled by parent
      onHide={onClose} // ✅ call parent handler
      className="bg-dark text-light"
      size="lg"
      style={{
        width: "100%",
        maxWidth: window.innerWidth < 768 ? "100%" : "42%",
      }}
    >
      <COffcanvasHeader className="d-flex justify-content-between align-items-start">
        {/* LEFT SIDE CONTENT */}
        <div className="d-flex flex-column">
          <span style={{ fontSize: "15px" }}>
            Robot Details –{" "}
            <CBadge color="warning" className="px-2 py-2">
              {robot.robot_no}
            </CBadge>
          </span>

          <span style={{ fontSize: "15px" }}>Doc id – {robot._id}</span>

          <span style={{ fontSize: "15px" }}>
            Robot Current State –{" "}
            {robot.lora_state === 1 ? (
              <CBadge color="success" className="p-2">
                ONLINE
              </CBadge>
            ) : (
              <CBadge color="danger" className="p-2">
                OFFLINE
              </CBadge>
            )}
          </span>
        </div>

        {/* RIGHT SIDE BUTTONS */}
        <div className="d-flex align-items-center">
          {userInfo.role === "Master Admin" && (
            <CButton
              color="primary"
              variant="ghost"
              className="me-2 px-3 py-1 btn-sm"
              onClick={() =>
                navigate(`/master-admin/robots-tracker/update/${robot._id}`)
              }
            >
              Update
            </CButton>
          )}

          <button
            type="button"
            className="border-0 p-0"
            onClick={onClose}
            style={{ background: "none" }}
          >
            <CIcon icon={cilX} size="xl" />
          </button>
        </div>
      </COffcanvasHeader>

      <COffcanvasBody className=" p-1">
        <CCard style={{ fontSize: "14px" }} className="border-0">
          <CCardBody className="d-flex justify-content-between">
            <span> Cleaning Phase</span>
            <CBadge
              color={badgeColor}
              className=" "
              style={{ fontSize: "14px" }}
            >
              {phase}
            </CBadge>
          </CCardBody>
        </CCard>

        <CleaningStatusCard robot={robot} userInfo={userInfo} />

        <BatteryStatusCard cleaning={robot.cleaning} />

        {/* ✅ Cleaning Cycle Control Buttons */}
        <CCard className="border-0 my-3 shadow-sm bg-secondary text-light">
          <CCardBody>
            <h5 className="text-light mb-3">🎮 Cleaning Cycle Control</h5>
            <div className="d-flex flex-wrap gap-2">
              <CButton
                className="btn btn-sm btn-secondary shadow"
                disabled={commandButton === 1}
                onClick={() => sendsingleDownlink(start, 1)}
              >
                {commandButton === 1 ? (
                  <>
                    START&nbsp;
                    <LoadingSpinner />
                  </>
                ) : (
                  "START"
                )}
              </CButton>
              <CButton
                className="btn btn-sm btn-secondary shadow-sm"
                disabled={commandButton === 2}
                onClick={() => sendsingleDownlink(stop, 2)}
              >
                {commandButton === 2 ? (
                  <>
                    STOP&nbsp;
                    <LoadingSpinner />
                  </>
                ) : (
                  "STOP"
                )}
              </CButton>
              <CButton
                className="btn btn-sm btn-secondary shadow-sm"
                disabled={commandButton === 3}
                onClick={() => sendsingleDownlink(returntodock, 3)}
              >
                {commandButton === 3 ? (
                  <>
                    RETURN TO DOCK&nbsp;
                    <LoadingSpinner />
                  </>
                ) : (
                  "RETURN TO DOCK"
                )}
              </CButton>
            </div>
          </CCardBody>
        </CCard>

        {userInfo.type === "Internal" && (
          <TrackingDetailsTable trackDetails={robot.track_details} />
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
                    {robot.robot_no}
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell scope="row">Block</CTableHeaderCell>
                  <CTableDataCell
                    style={{ minWidth: "100px", fontSize: "13px" }}
                  >
                    {robot.block}
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell scope="row">Type</CTableHeaderCell>
                  <CTableDataCell
                    style={{ minWidth: "100px", fontSize: "13px" }}
                  >
                    {robot.robot_type}
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell scope="row">Site</CTableHeaderCell>
                  <CTableDataCell
                    style={{ minWidth: "100px", fontSize: "13px" }}
                  >
                    {robot.site_id}
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell scope="row">Lora No</CTableHeaderCell>
                  <CTableDataCell
                    style={{ minWidth: "100px", fontSize: "13px" }}
                  >
                    {robot.lora_no}
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell scope="row">Row Length</CTableHeaderCell>
                  <CTableDataCell
                    style={{ minWidth: "100px", fontSize: "13px" }}
                  >
                    {robot.row_length * 2} m
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
        {robot.cleaning?.cleaning_mertic && (
          <CCard className="border-0 my-3 shadow-sm bg-secondary text-light">
            <CCardBody>
              <h5 className="text-light mb-3">
                Cleaning Metric{" "}
                {robot.cleaning?.cleaning_mertic ? (
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
                          {robot.cleaning.forward_cleaning_time ? (
                            <>{robot.cleaning.forward_cleaning_time} Sec.</>
                          ) : (
                            <CBadge color="warning">N/A</CBadge>
                          )}
                        </CTableDataCell>

                        <CTableDataCell
                          style={{ minWidth: "100px", fontSize: "13px" }}
                        >
                          {robot.cleaning.forward_cleaning_time_received_at ? (
                            <>
                              {new Date(
                                robot.cleaning.forward_cleaning_time_received_at
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
                          {robot.cleaning.reverse_cleaning_time ? (
                            <>{robot.cleaning.reverse_cleaning_time} Sec.</>
                          ) : (
                            <CBadge color="warning">N/A</CBadge>
                          )}
                        </CTableDataCell>
                        <CTableDataCell
                          style={{ minWidth: "100px", fontSize: "13px" }}
                        >
                          {robot.cleaning.reverse_cleaning_time_received_at ? (
                            new Date(
                              robot.cleaning.reverse_cleaning_time_received_at
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
                      {robot.cleaning.total_cleaning_time ? (
                        <> {formatTime(robot.cleaning.total_cleaning_time)} </> // Use the utility function here
                      ) : (
                        <CBadge color="warning">N/A</CBadge>
                      )}
                    </CTableDataCell>
                    <CTableDataCell
                      style={{ minWidth: "100px", fontSize: "13px" }}
                    >
                      {robot.cleaning.total_cleaning_time_received_at ? (
                        new Date(
                          robot.cleaning.total_cleaning_time_received_at
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
                      {robot.cleaning.battery_before_cleaning ? (
                        <>{robot.cleaning.battery_before_cleaning} %</>
                      ) : (
                        <CBadge color="warning">N/A</CBadge>
                      )}
                    </CTableDataCell>
                    <CTableDataCell
                      style={{ minWidth: "100px", fontSize: "13px" }}
                    >
                      {robot.cleaning.battery_before_cleaning_received_at ? (
                        new Date(
                          robot.cleaning.battery_before_cleaning_received_at
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
                      {robot.cleaning.battery_after_cleaning ? (
                        <>{robot.cleaning.battery_after_cleaning} %</>
                      ) : (
                        <CBadge color="warning">N/A</CBadge>
                      )}
                    </CTableDataCell>
                    <CTableDataCell
                      style={{ minWidth: "100px", fontSize: "13px" }}
                    >
                      {robot.cleaning.battery_after_cleaning_received_at ? (
                        new Date(
                          robot.cleaning.battery_after_cleaning_received_at
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
                          {robot.cleaning.battery_at_reverse_station ? (
                            <>{robot.cleaning.battery_at_reverse_station} %</>
                          ) : (
                            <CBadge color="warning">N/A</CBadge>
                          )}
                        </CTableDataCell>
                        <CTableDataCell
                          style={{ minWidth: "100px", fontSize: "13px" }}
                        >
                          {robot.cleaning
                            .battery_at_reverse_station_received_at ? (
                            new Date(
                              robot.cleaning.battery_at_reverse_station_received_at
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
                          {robot.cleaning.temperature_before_cleaning ? (
                            <>{robot.cleaning.temperature_before_cleaning} °C</>
                          ) : (
                            <CBadge color="warning">N/A</CBadge>
                          )}
                        </CTableDataCell>
                        <CTableDataCell
                          style={{ minWidth: "100px", fontSize: "13px" }}
                        >
                          {robot.cleaning
                            .temperature_before_cleaning_received_at ? (
                            new Date(
                              robot.cleaning.temperature_before_cleaning_received_at
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
                          {robot.cleaning.temperature_at_reverse_station ? (
                            <>
                              {robot.cleaning.temperature_at_reverse_station} °C
                            </>
                          ) : (
                            <CBadge color="warning">N/A</CBadge>
                          )}
                        </CTableDataCell>
                        <CTableDataCell
                          style={{ minWidth: "100px", fontSize: "13px" }}
                        >
                          {robot.cleaning
                            .temperature_at_reverse_station_received_at ? (
                            new Date(
                              robot.cleaning.temperature_at_reverse_station_received_at
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
                          {robot.cleaning.temperature_after_cleaning ? (
                            <>{robot.cleaning.temperature_after_cleaning} °C</>
                          ) : (
                            <CBadge color="warning">N/A</CBadge>
                          )}
                        </CTableDataCell>
                        <CTableDataCell
                          style={{ minWidth: "100px", fontSize: "13px" }}
                        >
                          {robot.cleaning
                            .temperature_after_cleaning_received_at ? (
                            new Date(
                              robot.cleaning.temperature_after_cleaning_received_at
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
                          {robot.cleaning.cycle_average_brush_current ? (
                            <>{robot.cleaning.cycle_average_brush_current} A</>
                          ) : (
                            <CBadge color="warning">N/A</CBadge>
                          )}
                        </CTableDataCell>
                        <CTableDataCell
                          style={{ minWidth: "100px", fontSize: "13px" }}
                        >
                          {robot.cleaning
                            .cycle_average_brush_current_received_at ? (
                            new Date(
                              robot.cleaning.cycle_average_brush_current_received_at
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
                          {robot.cleaning.cycle_average_wheel_current ? (
                            <>{robot.cleaning.cycle_average_wheel_current} A</>
                          ) : (
                            <CBadge color="warning">N/A</CBadge>
                          )}
                        </CTableDataCell>
                        <CTableDataCell
                          style={{ minWidth: "100px", fontSize: "13px" }}
                        >
                          {robot.cleaning
                            .cycle_average_wheel_current_received_at ? (
                            new Date(
                              robot.cleaning.cycle_average_wheel_current_received_at
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
                          {robot.cleaning.cycle_max_brush_current !== null &&
                          robot.cleaning.cycle_max_brush_current !==
                            undefined ? (
                            <>{robot.cleaning.cycle_max_brush_current} A</>
                          ) : (
                            <CBadge color="warning">N/A</CBadge>
                          )}
                        </CTableDataCell>

                        <CTableDataCell
                          style={{ minWidth: "100px", fontSize: "13px" }}
                        >
                          {robot.cleaning
                            .cycle_max_brush_current_received_at ? (
                            new Date(
                              robot.cleaning.cycle_max_brush_current_received_at
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
                          {robot.cleaning.cycle_max_wheel_current ? (
                            <>{robot.cleaning.cycle_max_wheel_current} A</>
                          ) : (
                            <CBadge color="warning">N/A</CBadge>
                          )}
                        </CTableDataCell>
                        <CTableDataCell
                          style={{ minWidth: "100px", fontSize: "13px" }}
                        >
                          {robot.cleaning
                            .cycle_max_wheel_current_received_at ? (
                            new Date(
                              robot.cleaning.cycle_max_wheel_current_received_at
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
                          {robot.cleaning.cycle_count ? (
                            robot.cleaning.cycle_count
                          ) : (
                            <CBadge color="warning">N/A</CBadge>
                          )}
                        </CTableDataCell>
                        <CTableDataCell
                          style={{ minWidth: "100px", fontSize: "13px" }}
                        >
                          {robot.cleaning.cycle_count_received_at ? (
                            new Date(
                              robot.cleaning.cycle_count_received_at
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
        {userInfo.type === "Internal" && robot.last_activity && (
          <RobotLastActivity last_activity={robot.last_activity} />
        )}

        {userInfo.role === "Master Admin" && (
          <div className="m-2 d-flex justify-content-center align-items-center ">
            {" "}
            <CButton
              className="w-100"
              onClick={(e) => deleteHandler(e, robot._id)}
            >
              Delete
            </CButton>
          </div>
        )}
      </COffcanvasBody>
    </COffcanvas>
  );
};

export default RobotSidebar;
