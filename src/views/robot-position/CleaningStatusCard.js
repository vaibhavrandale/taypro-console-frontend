import {
  CBadge,
  CProgress,
  CProgressBar,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import React from "react";
import { getCleaningPercentage } from "./helpers";

const CleaningStatusCard = ({ robot, userInfo }) => {
  const lastPoint = robot.track_details?.length
    ? robot.track_details[robot.track_details.length - 1].point
    : 0;

  const { distanceCovered, totalDistance, percentage } = getCleaningPercentage(
    lastPoint,
    robot
  );
  return (
    <>
      <div className="card border-0 shadow-sm my-2 bg-dark text-light ">
        <div className="card-body  p-2">
          <div className="border-bottom">
            <small className="my-2 text-end">
              Distance covered&nbsp;
              {userInfo.type === "Internal" ? (
                <span>
                  {" "}
                  {distanceCovered} / {totalDistance}
                </span>
              ) : (
                ""
              )}
            </small>

            <CProgress className="mb-2 ">
              <CProgressBar value={percentage}>{percentage}%</CProgressBar>
            </CProgress>
          </div>

          <div className="d-flex justify-content-between align-items-center my-2">
            <span className="mb-0 ">Cleaning Status</span>
            {robot.cleaning?.finish ? (
              <CBadge color="success" className="fw-normal">
                ✅ Finished
              </CBadge>
            ) : robot.cleaning?.cleaning_cancelled ? (
              <CBadge color="danger" className="fw-normal">
                ❌ Cancelled
              </CBadge>
            ) : robot.cleaning?.battery_dead ? (
              <CBadge color="danger" className="fw-normal">
                🔋 Battery Issue
              </CBadge>
            ) : !robot.cleaning?.start && !robot.cleaning?.finish ? (
              <CBadge color="primary">At Dock</CBadge>
            ) : (
              <CBadge color="warning" className="fw-normal">
                ⏳ In Progress
              </CBadge>
            )}
          </div>

          <CTable bordered small hover responsive className="mb-3">
            <CTableBody>
              {/* Start Time */}
              <CTableRow>
                <CTableHeaderCell>Start</CTableHeaderCell>
                <CTableDataCell>
                  {robot.cleaning?.startAt ? (
                    <span className="text-success">
                      {new Date(robot.cleaning.startAt).toLocaleString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        }
                      )}
                    </span>
                  ) : (
                    <span className="badge bg-warning">Not Started</span>
                  )}
                </CTableDataCell>
              </CTableRow>

              {/* Finish Time */}
              <CTableRow>
                <CTableHeaderCell>Finish</CTableHeaderCell>
                <CTableDataCell>
                  {robot.cleaning?.finishAt ? (
                    <span className="text-success">
                      {new Date(robot.cleaning.finishAt).toLocaleString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        }
                      )}
                    </span>
                  ) : (
                    <span className="badge bg-warning text-dark">
                      Not Finished
                    </span>
                  )}
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
          {(robot.comments ||
            robot.cleaning.cleaning_cancelled ||
            robot.cleaning.battery_dead) && (
            <div className="shadow-sm border-0 p-2">
              <div className="">
                {/* Robot comment */}
                {robot.comments && (
                  <div>
                    <strong>Comment: </strong>
                    <span>{robot.comments}</span>
                  </div>
                )}

                {/* Status badges */}
                <div className="d-flex gap-2 flex-wrap my-2">
                  {robot.cleaning.cleaning_cancelled && (
                    <span className="badge bg-warning text-dark">
                      Cleaning Cancelled
                    </span>
                  )}
                  {robot.cleaning.battery_dead && (
                    <span className="badge bg-danger">Battery Dead</span>
                  )}
                  {/* Timestamp */}
                  {robot.cleaning.cleaning_cancelled_at && (
                    <small className="text-muted">
                      {new Date(
                        robot.cleaning.cleaning_cancelled_at
                      ).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </small>
                  )}
                  {robot.cleaning.battery_dead_at && (
                    <small className="text-muted">
                      {new Date(robot.cleaning.battery_dead_at).toLocaleString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        }
                      )}
                    </small>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CleaningStatusCard;
