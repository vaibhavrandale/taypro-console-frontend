import React, { useEffect, useReducer, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CRow,
  CTab,
  CTabContent,
  CTabList,
  CTabPanel,
  CTabs,
} from "@coreui/react";
import LoadingSpinner from "../../../components/LoadingSpinner";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, fetchloading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, fetchloading: false, robot: action.payload };
    case "FETCH_FAIL":
      return { ...state, fetchloading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, updateloading: true };
    case "UPDATE_SUCCESS":
      return { ...state, updateloading: false, success: true };
    case "UPDATE_FAIL":
      return { ...state, updateloading: false, error: action.payload };
    default:
      return state;
  }
};

const UpdateRobot = () => {
  const [{ error, fetchloading, updateloading }, dispatch] = useReducer(
    reducer,
    {
      sites: [],
      robot: {},
      loading: true,
      fetchloading: true,
      updateloading: false,
      error: "",
    },
  );
  const { id } = useParams();
  const navigate = useNavigate();
  // const authtoken = useSelector((state) => state.authtoken);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchRobot = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const response = await axios.get(`/api/v1/robots/get-one/${id}`, {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        });
        dispatch({ type: "FETCH_SUCCESS", payload: response.data.data });
        setFormData(response.data.data);
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data?.message || error.message,
        });
      }
    };

    fetchRobot();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "UPDATE_REQUEST" });
    try {
      const {
        createdAt,
        _id,
        last_activity,
        last_uplink,
        manufactured_date,
        ...filteredFormData
      } = formData;
      await axios.put(`/api/v1/robots/${id}`, filteredFormData, {
        // headers: { Authorization: `Bearer ${authtoken}` },
        withCredentials: true,
      });

      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success(`${filteredFormData.robot_no}  updated successfully!`);
      navigate("/master-admin/robots"); // Redirect after update
    } catch (error) {
      dispatch({
        type: "UPDATE_FAIL",
        payload: error.response?.data?.message || error.message,
      });

      toast.error("Failed to update robot!");
    }
  };

  if (fetchloading) return <LoadingSpinner />;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="update-robot-container px-3">
      <CCard className="w-100 shadow-sm rounded-lg">
        <CCardHeader>
          <h4 className="mb-0">Update Robot : {formData.robot_no}</h4>
        </CCardHeader>
        <CCardBody>
          <form onSubmit={handleSubmit}>
            <CTabs
              // defaultActiveItemKey="basic-info"
              activeItemKey="basic-info"
            >
              <CTabList variant="tabs">
                <CTab itemKey="basic-info">Basic Info</CTab>
                <CTab itemKey="timers">Timers</CTab>
                <CTab itemKey="sensors">Sensor & Motor Data</CTab>
                <CTab itemKey="flags">Configuration Flags</CTab>
              </CTabList>

              <CTabContent>
                {/* BASIC INFO TAB */}
                <CTabPanel className="p-3" itemKey="basic-info">
                  <CRow>
                    {[
                      "robot_no",
                      "site_robot_sr_no",
                      "block",
                      "deveui",
                      "robot_type",
                      "version",
                      "last_status",
                      "battery_status",
                      "dock",
                      "weather_lock_state",
                      "manufactured_date",
                      "last_motor_update",
                      "site_id",
                      "company",
                      "last_gateway",
                      "update_debug_log",
                      "soiling_loss",
                      "last_command",
                      "certificate_no",
                      "breakdown_status",
                      "last_uplink",
                    ].map((field) => (
                      <CCol key={field} md={4} className="mb-3">
                        <CFormLabel htmlFor={field}>
                          {field.replace(/_/g, " ").toUpperCase()}
                        </CFormLabel>
                        <CFormInput
                          type="text"
                          name={field}
                          value={formData[field] || ""}
                          onChange={handleChange}
                        />
                      </CCol>
                    ))}
                  </CRow>
                </CTabPanel>

                {/* TIMERS TAB */}
                <CTabPanel className="p-3" itemKey="timers">
                  <CRow>
                    {["1", "2", "3"].map((num) => (
                      <React.Fragment key={num}>
                        <CCol md={6} className="mb-3">
                          <CFormLabel
                            htmlFor={`timer${num}`}
                          >{`TIMER ${num}`}</CFormLabel>
                          <CFormInput
                            type="text"
                            name={`timer${num}`}
                            value={formData[`timer${num}`] || ""}
                            onChange={handleChange}
                          />
                        </CCol>
                        <CCol md={6} className="mb-3">
                          <CFormLabel
                            htmlFor={`timer${num}_date`}
                          >{`TIMER ${num} DATE`}</CFormLabel>
                          <CFormInput
                            type="date"
                            name={`timer${num}_date`}
                            value={formData[`timer${num}_date`] || ""}
                            onChange={handleChange}
                          />
                        </CCol>
                      </React.Fragment>
                    ))}
                  </CRow>
                </CTabPanel>

                {/* SENSOR & MOTOR TAB */}
                <CTabPanel className="p-3" itemKey="sensors">
                  <CRow>
                    {[
                      "wheel_motor_speed",
                      "brush_motor_speed",
                      "battery_percentage",
                      "battery_voltage",
                      "temperature",
                      "rssi",
                      "lora_no",
                      "old_lora_no",
                      "snr",
                      "row_length",
                      "row_number",
                      "last_battery_diff",
                      "brush_current",
                      "wheel_current",
                      "stuck_count",
                    ].map((field) => (
                      <CCol key={field} md={4} className="mb-3">
                        <CFormLabel htmlFor={field}>
                          {field.replace(/_/g, " ").toUpperCase()}
                        </CFormLabel>
                        <CFormInput
                          type="number"
                          name={field}
                          value={formData[field] || ""}
                          onChange={handleChange}
                        />
                      </CCol>
                    ))}
                  </CRow>
                </CTabPanel>

                {/* FLAGS TAB */}
                <CTabPanel className="p-3" itemKey="flags">
                  <CRow>
                    {[
                      "lora_state",
                      "auto_clean",
                      "rescheduled_cycle",
                      "activate",
                      "weather_lock_1",
                      "weather_lock_2",
                      "test_mode",
                      "is_current_limit",
                      "manual_mode",
                      "actuator",
                      "tracker",
                      "cleaning_flag",
                      "stop_command",
                    ].map((field) => (
                      <CCol key={field} md={4} className="mb-3">
                        <div className="d-flex align-items-center">
                          <CFormCheck
                            id={field}
                            name={field}
                            checked={formData[field] || false}
                            onChange={handleChange}
                          />
                          <CFormLabel htmlFor={field} className="ms-2 mb-0">
                            {field.replace(/_/g, " ").toUpperCase()}
                          </CFormLabel>
                        </div>
                      </CCol>
                    ))}
                  </CRow>
                </CTabPanel>
              </CTabContent>
            </CTabs>

            {/* Submit Button */}
            <div className="d-flex justify-content-end mt-4">
              <CButton type="submit" color="warning" size="sm" className="w-25">
                {updateloading ? (
                  <>
                    Updating...
                    <LoadingSpinner />
                  </>
                ) : (
                  "Update"
                )}
              </CButton>
            </div>
          </form>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default UpdateRobot;
