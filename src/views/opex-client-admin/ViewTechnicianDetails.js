import React, { useEffect, useReducer, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CAvatar,
  CImage,
  CWidgetStatsB,
  CBadge,
  CModal,
  CModalBody,
  CModalHeader,
  CTableRow,
  CTableDataCell,
  CTableBody,
  CTableHeaderCell,
  CTableHead,
  CTable,
} from "@coreui/react";
import { cilCheckCircle, cilX, cilXCircle } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import LoadingSpinner from "../../components/LoadingSpinner";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, day: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const ViewTechnicianDetails = () => {
  const [{ loading, day, error }, dispatch] = useReducer(reducer, {
    day: {},
    loading: true,
    error: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // const authtoken = useSelector((state) => state.authtoken);
  const { moduleId, cycleId, dayId } = useParams();

  useEffect(() => {
    const fetchCycle = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const result = await axios.get(
          `/api/v1/opex/${moduleId}/cycle/${cycleId}/day/${dayId}`,
          {
            // headers: { Authorization: `Bearer ${authtoken}` },
            withCredentials: true,
          },
        );
        dispatch({
          type: "FETCH_SUCCESS",
          payload: result.data.data,
        });
      } catch (error) {
        const msg = error.response?.data.error || error.response?.data.message;
        dispatch({ type: "FETCH_FAIL", payload: msg });
        toast.error(msg);
      }
    };
    fetchCycle();
  }, [moduleId, cycleId, dayId]);

  const handleImageClick = (file) => {
    setSelectedFile(file);
    setShowModal(true);
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <CBadge color="danger">{error}</CBadge>
      ) : (
        <>
          {" "}
          <CRow className="g-4">
            {/* Header Card */}
            <CCol xs={12}>
              <CCard className="shadow-sm">
                <CCardHeader className="">
                  Day {day.dayNo + 1} of Cycle {day.CycleNo + 1}&nbsp; Cleaning
                  Details -{" "}
                  {new Date(day.date)
                    .toLocaleDateString("en-GB")
                    .replace(/\//g, "-")}
                </CCardHeader>
                <CCardBody>
                  <CBadge
                    color={day.is_verified ? "success" : "danger"}
                    className="me-2"
                  >
                    {day.is_verified ? (
                      <>
                        <CIcon icon={cilCheckCircle} className="me-1" />{" "}
                        Verified
                      </>
                    ) : (
                      <>
                        <CIcon icon={cilXCircle} className="me-1" /> Not
                        Verified
                      </>
                    )}
                  </CBadge>
                  <CBadge color={day.is_cleaning_done ? "success" : "warning"}>
                    {day.is_cleaning_done ? "Cleaning Completed" : "Pending"}
                  </CBadge>
                </CCardBody>
              </CCard>
            </CCol>

            {/* Stats */}
            <CCol md={4}>
              <CWidgetStatsB
                className="mb-3"
                color="primary"
                value={day.modules_planned_for_day}
                title="Modules Planned"
              />
            </CCol>
            <CCol md={4}>
              <CWidgetStatsB
                className="mb-3"
                color="success"
                value={day.modules_cleaned_for_day}
                title="Modules Cleaned"
              />
            </CCol>
            <CCol md={4}>
              <CWidgetStatsB
                className="mb-3"
                color="danger"
                value={
                  day.modules_remaining_for_day === 0
                    ? "0"
                    : day.modules_remaining_for_day
                }
                title="Modules Remaining for Day"
              />
            </CCol>
            <CCol xs={12}>
              {/* Technician Attendance Table */}
              <CCard>
                <CCardHeader className="">Technician Attendance</CCardHeader>
                <CCardBody>
                  {day.technicianAttendance.length > 0 ? (
                    <CTable striped hover responsive>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>Sr</CTableHeaderCell>
                          <CTableHeaderCell>Profile</CTableHeaderCell>
                          <CTableHeaderCell>Name</CTableHeaderCell>
                          <CTableHeaderCell>Punch-In Time</CTableHeaderCell>
                          <CTableHeaderCell>Punch-Out Time</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {day.technicianAttendance.map((item, index) => (
                          <CTableRow key={index}>
                            <CTableDataCell>{index + 1}</CTableDataCell>
                            <CTableDataCell>
                              <CImage
                                src={item.profile_image}
                                width={40}
                                height={40}
                                className="rounded-circle"
                              />
                            </CTableDataCell>
                            <CTableDataCell>{item.username}</CTableDataCell>
                            <CTableDataCell>
                              {new Date(item.punchin_time).toLocaleString(
                                "en-IN",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                },
                              )}
                            </CTableDataCell>
                            <CTableDataCell>
                              {item.punchout_time ? (
                                new Date(item.punchout_time).toLocaleString(
                                  "en-IN",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                  },
                                )
                              ) : (
                                <CBadge color="warning">No Data</CBadge>
                              )}
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  ) : (
                    <div className="text-center  py-5"> No Data Found</div>
                  )}
                </CCardBody>
              </CCard>
            </CCol>
            {/* Attachments */}
            <CCol xs={12}>
              <CCard className="shadow-sm">
                <CCardHeader className="">Cleaning Attachments</CCardHeader>
                <CCardBody>
                  {/* <CRow className="g-3">
                    {
                    
                    day.attachments.map((file) => (
                      <CCol key={file._id} xs={12} sm={6} md={4} lg={3}>
                        <CCard className="h-100 shadow-sm">
                          <CImage
                            src={file.url}
                            alt="attachment"
                            className="w-100"
                            style={{
                              height: "200px",
                              objectFit: "cover",
                              cursor: "pointer",
                            }}
                            onClick={() => handleImageClick(file)}
                          />
                          <CCardBody>
                            <div className="d-flex align-items-center">
                              <CAvatar
                                src={file.uploaded_by.profile_image}
                                size="md"
                                className="me-2"
                              />
                              <div>
                                <div className="">
                                  {file.uploaded_by.name}
                                </div>
                                <small className="text-muted">
                                  {new Date(
                                    file.uploaded_by.timestamp
                                  ).toLocaleString()}
                                </small>
                              </div>
                            </div>
                          </CCardBody>
                        </CCard>
                      </CCol>
                    ))}
                  </CRow> */}
                  <CRow className="g-3">
                    {day.attachments && day.attachments.length > 0 ? (
                      day.attachments.map((file) => (
                        <CCol key={file._id} xs={12} sm={6} md={4} lg={3}>
                          <CCard className="h-100 shadow-sm">
                            <CImage
                              src={file.url}
                              alt="attachment"
                              className="w-100"
                              style={{
                                height: "200px",
                                objectFit: "cover",
                                cursor: "pointer",
                              }}
                              onClick={() => handleImageClick(file)}
                            />
                            <CCardBody>
                              <div className="d-flex align-items-center">
                                <CAvatar
                                  src={file.uploaded_by.profile_image}
                                  size="md"
                                  className="me-2"
                                />
                                <div>
                                  <div className="">
                                    {file.uploaded_by.name}
                                  </div>
                                  <small className="text-muted">
                                    {new Date(
                                      file.uploaded_by.timestamp,
                                    ).toLocaleString("en-GB", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      second: "2-digit",
                                      hour12: true,
                                    })}
                                  </small>
                                </div>
                              </div>
                            </CCardBody>
                          </CCard>
                        </CCol>
                      ))
                    ) : (
                      <CCol xs={12}>
                        <div className="text-center text-muted py-5">
                          <h6>No images found</h6>
                        </div>
                      </CCol>
                    )}
                  </CRow>
                </CCardBody>
              </CCard>
            </CCol>

            <CCol xs={12}>
              <CCard className="shadow-sm">
                <CCardHeader className="">Remarks & Verification</CCardHeader>
                <CCardBody>
                  <p>
                    <strong>Remarks:</strong> {day.remarks || "No remarks"}
                  </p>
                  {day.verified_by && (
                    <div className="d-flex align-items-center mt-3">
                      <CAvatar
                        src={day.verified_by.profile_image}
                        size="lg"
                        className="me-3"
                      />
                      <div>
                        <div className="">{day.verified_by.name}</div>
                        <small className="text-muted">
                          Verified on{" "}
                          {new Date(day.verified_by.verified_at).toLocaleString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: true,
                            },
                          )}
                        </small>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: day.verified_by.details,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
          {showModal && (
            <CModal
              scrollable
              size="xl"
              visible={showModal}
              onClose={() => setShowModal(false)}
            >
              <CModalHeader closeButton={false} className="p-2">
                <div className=" d-flex align-items-center justify-content-center">
                  <CAvatar
                    src={selectedFile.uploaded_by.profile_image}
                    size="md"
                    className="me-2"
                  />
                  <div>
                    <div className="">{selectedFile.uploaded_by.name}</div>
                    <small className="text-muted">
                      {new Date(
                        selectedFile.uploaded_by.timestamp,
                      ).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })}
                    </small>
                  </div>
                </div>
                <button
                  type="button"
                  className=" border-0 ms-auto py-0 px-1"
                  onClick={() => setShowModal(false)}
                  style={{ background: "none" }}
                >
                  <CIcon icon={cilX} size="lg" />
                </button>
              </CModalHeader>
              <CModalBody className="text-center">
                {selectedFile && (
                  <>
                    {" "}
                    <CImage
                      src={selectedFile.url}
                      fluid
                      className="mb-3"
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </>
                )}
              </CModalBody>
            </CModal>
          )}
        </>
      )}
    </>
  );
};

export default ViewTechnicianDetails;
