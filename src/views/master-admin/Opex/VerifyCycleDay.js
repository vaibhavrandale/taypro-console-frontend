import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CFormCheck,
  CButton,
  CFormTextarea,
  CFormLabel,
  CBadge,
} from "@coreui/react";
import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { formatDistanceToNow } from "date-fns";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, dayDataLoading: true, dayDataError: "" };
    case "FETCH_SUCCESS":
      return { ...state, day: action.payload, dayDataLoading: false };
    case "FETCH_FAIL":
      return { ...state, dayDataLoading: false, dayDataError: action.payload };
    case "VERIFY_REQUEST":
      return { ...state, verifying: true };
    case "VERIFY_SUCCESS":
      return { ...state, verifying: false, verifiedData: action.payload };
    case "VERIFY_FAIL":
      return { ...state, verifying: false, error: action.payload };
    default:
      return state;
  }
};

const VerifyCycleDay = () => {
  const [
    { dayDataLoading, day, dayDataError, verifying, verifiedData },
    dispatch,
  ] = useReducer(reducer, {
    day: {},
    dayDataLoading: true,
    dayDataError: "",
    verifying: false,
    verifiedData: null,
  });
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    is_cleaning_done: false,
    is_sunday: false,
    is_pm: false,
    is_labour_absent: false,
    is_other: false,
    modules_cleaned_for_day: 0,
    remarks: "",
  });

  const authtoken = useSelector((state) => state.authtoken);
  const { moduleId, cycleId, dayId } = useParams();

  useEffect(() => {
    const fetchCycle = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const result = await axios.get(
          `/api/v1/opex/${moduleId}/cycle/${cycleId}/day/${dayId}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );
        console.log(result.data.data);

        dispatch({
          type: "FETCH_SUCCESS",
          payload: result.data.data,
        });
        setFormData(result.data.data);
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data.error || error.response?.data.message,
        });
        toast.error(error.response?.data.error || error.response?.data.message);
      }
    };

    fetchCycle();
  }, [authtoken, moduleId, cycleId, dayId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "VERIFY_REQUEST" });

      const result = await axios.put(
        `/api/v1/opex/${moduleId}/cycle/${cycleId}/day/${dayId}/verify`,

        formData,
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
      );

      dispatch({
        type: "VERIFY_SUCCESS",
        payload: result.data,
      });

      toast.success(result.data.message);
      navigate(-1);
    } catch (error) {
      dispatch({
        type: "VERIFY_FAIL",
        payload: error.response?.data.error || error.response?.data.message,
      });
      toast.error(error.response?.data.error || error.response?.data.message);
    }
  };

  //   const handleChange = (e) => {
  //     const { name, value, type, checked } = e.target;
  //     setFormData({
  //       ...formData,
  //       [name]: type === "checkbox" ? checked : value,
  //     });
  //   };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="p-3">
      {dayDataLoading ? (
        <LoadingSpinner />
      ) : dayDataError ? (
        <p className="text-danger">{dayDataError}</p>
      ) : (
        <>
          <CCard>
            <CCardHeader>
              <h5>
                Verify Day -{" "}
                {new Date(day.date).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </h5>
            </CCardHeader>
            <CCardBody>
              <CRow className="mt-3">
                <CCol>
                  <h6>Day Information</h6>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(day.date).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                  <p>
                    <strong>Modules Planned:</strong>{" "}
                    {day.modules_planned_for_day}
                  </p>
                  <p>
                    <strong>Modules cleaned:</strong>{" "}
                    {day.modules_cleaned_for_day}
                  </p>
                  <p>
                    <strong>Modules Remaining:</strong>{" "}
                    {day.modules_remaining_for_day}
                  </p>
                </CCol>
              </CRow>
              <CForm onSubmit={handleSubmit}>
                <CRow className="mb-3">
                  <CCol>
                    <h6>Status Flags</h6>
                    <CRow>
                      <CCol md={4}>
                        <CFormCheck
                          type="checkbox"
                          id="is_cleaning_done"
                          label="Cleaning Done"
                          name="is_cleaning_done"
                          checked={formData.is_cleaning_done}
                          onChange={handleChange}
                        />
                      </CCol>
                      <CCol md={4}>
                        <CFormCheck
                          type="checkbox"
                          id="is_sunday"
                          label="Sunday"
                          name="is_sunday"
                          checked={formData.is_sunday}
                          onChange={handleChange}
                        />
                      </CCol>
                      <CCol md={4}>
                        <CFormCheck
                          type="checkbox"
                          id="is_pm"
                          label="PM Scheduled"
                          name="is_pm"
                          checked={formData.is_pm}
                          onChange={handleChange}
                        />
                      </CCol>
                    </CRow>
                    <CRow className="mt-2">
                      <CCol md={4}>
                        <CFormCheck
                          type="checkbox"
                          id="is_labour_absent"
                          label="Labour Absent"
                          name="is_labour_absent"
                          checked={formData.is_labour_absent}
                          onChange={handleChange}
                        />
                      </CCol>
                      <CCol md={4}>
                        <CFormCheck
                          type="checkbox"
                          id="is_other"
                          label="Other Reason"
                          name="is_other"
                          checked={formData.is_other}
                          onChange={handleChange}
                        />
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>

                {formData.is_cleaning_done && (
                  <CRow className="mb-3">
                    <CCol>
                      <CFormLabel>
                        Modules Cleaned Today{" "}
                        <span className="text-muted">
                          (Once you enterd value this cannot be change later)
                        </span>
                      </CFormLabel>
                      <CFormInput
                        type="number"
                        id="modules_cleaned_for_day"
                        name="modules_cleaned_for_day"
                        value={formData.modules_cleaned_for_day}
                        onChange={handleChange}
                        min="0"
                        required={formData.is_cleaning_done}
                      />
                    </CCol>
                  </CRow>
                )}

                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormTextarea
                      id="remarks"
                      label="Remarks"
                      name="remarks"
                      rows={4}
                      value={formData.remarks}
                      onChange={handleChange}
                      placeholder="Enter any remarks or notes here"
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol>
                    <CButton
                      type="submit"
                      color="btn btn primary btn-sm"
                      disabled={verifying || formData.is_verified}
                    >
                      {verifying ? "Verifying..." : "Verify Day"}
                    </CButton>
                  </CCol>
                </CRow>
              </CForm>

              <hr />
            </CCardBody>
          </CCard>

          {day.is_verified && (
            <CCard className="my-2">
              <CCardHeader>Verified By</CCardHeader>
              <CCardBody>
                <div className="d-flex align-items-center pb-3 mb-3">
                  <img
                    src={day.verified_by.profile_image}
                    alt="Profile"
                    className="rounded-circle"
                    width="50"
                    height="50"
                    style={{ objectFit: "cover", cursor: "pointer" }}
                  />
                  <div className="flex-grow-1 mx-2">
                    <p className="mb-1 fw-semibold d-flex justify-content-between flex-wrap">
                      <span className="fw-semibold">
                        {day.verified_by.name} -{" "}
                        <span className="text-muted small">
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
                            }
                          )}
                        </span>
                      </span>
                      <span className="d-flex flex-column">
                        <span className="text-muted small">
                          {day.verified_by.verified_at
                            ? formatDistanceToNow(
                                new Date(day.verified_by.verified_at),
                                {
                                  addSuffix: true,
                                }
                              )
                            : "NA"}
                        </span>
                      </span>
                    </p>

                    <p
                      className=" maxw-75 mw-75"
                      style={{
                        fontSize: "14px",
                        lineHeight: "1.5",
                        textAlign: "start",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: `<span class="text-warning bg-warning p-1 rounded-1">Details</span> :&nbsp; ${day.verified_by.details.replace(
                          /, /g,
                          ",<br>"
                        )}`,
                      }}
                    >
                      {/* <CBadge color="warning">Details</CBadge> :&nbsp; */}
                      {/* {day.verified_by.details} */}
                    </p>

                    <p
                      className=" maxw-75 mw-75"
                      style={{
                        fontSize: "14px",
                        lineHeight: "1.5",
                        textAlign: "start",
                      }}
                    >
                      <CBadge color="warning">Remark</CBadge> :&nbsp;
                      {day.remarks ? day.remarks : "N/A"}
                    </p>
                  </div>
                </div>
              </CCardBody>
            </CCard>
          )}
        </>
      )}
    </div>
  );
};

export default VerifyCycleDay;
