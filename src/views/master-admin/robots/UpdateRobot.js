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
  const [{ loading, error, robot, fetchloading, updateloading }, dispatch] =
    useReducer(reducer, {
      sites: [],
      robot: {},
      loading: true,
      fetchloading: true,
      updateloading: false,
      error: "",
    });
  const { id } = useParams();
  const navigate = useNavigate();
  const authtoken = useSelector((state) => state.authtoken);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchRobot = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const response = await axios.get(`/api/v1/robots/${id}`, {
          headers: { Authorization: `Bearer ${authtoken}` },
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
  }, [id, authtoken]);

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
        headers: { Authorization: `Bearer ${authtoken}` },
      });

      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success(`${filteredFormData.robot_no}  updated successfully!`);
      navigate("/master-admin/robots"); // Redirect after update
    } catch (error) {
      console.log(error.response);
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
    <div className="update-robot-container">
      <CCard className="max-w-3xl mx-auto p-6 shadow-lg rounded-lg">
        <CCardHeader>
          {" "}
          <h2>Update Robot : {formData.robot_no}</h2>
        </CCardHeader>
        <CCardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <CRow>
              {/* Text Inputs */}
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
                "timer1",
                "timer2",
                "timer3",
                "last_gateway",
                "update_debug_log",
                "soiling_loss",
                "last_command",
                "certificate_no",
                "breakdown_status",
                "last_uplink",
              ].map((field) => (
                <CCol key={field} md={3} className="my-2">
                  <div>
                    <CFormLabel htmlFor={field}>
                      {field.replace(/_/g, " ").toUpperCase()}
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      name={field}
                      value={formData[field] || ""}
                      onChange={handleChange}
                    />
                  </div>
                </CCol>
              ))}

              {/* Number Inputs */}
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
                <CCol key={field} md={3} className="my-2">
                  <div>
                    <CFormLabel htmlFor={field}>
                      {field.replace(/_/g, " ").toUpperCase()}
                    </CFormLabel>
                    <CFormInput
                      type="number"
                      name={field}
                      value={formData[field] || ""}
                      onChange={handleChange}
                    />
                  </div>
                </CCol>
              ))}

              {/* Date Inputs */}
              {["timer1_date", "timer2_date", "timer3_date"].map((field) => (
                <CCol key={field} md={3} className="my-2">
                  <div>
                    <CFormLabel htmlFor={field}>
                      {field.replace(/_/g, " ").toUpperCase()}
                    </CFormLabel>
                    <CFormInput
                      type="date"
                      name={field}
                      value={formData[field] || ""}
                      onChange={handleChange}
                    />
                  </div>
                </CCol>
              ))}

              {/* Checkbox Inputs */}
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
                <CCol key={field} md={3} className="my-2">
                  <div className="flex items-center space-x-2 my-2">
                    <CFormCheck
                      id={field}
                      name={field}
                      checked={formData[field] || false}
                      onChange={handleChange}
                    />
                    &nbsp;&nbsp;
                    <CFormLabel htmlFor={field}>
                      {field.replace(/_/g, " ").toUpperCase()}
                    </CFormLabel>
                  </div>
                </CCol>
              ))}
            </CRow>

            {/* Submit Button */}
            <div className="d-flex justify-content-end">
              <CButton
                type="submit"
                color="warning"
                size="sm"
                className="w-full"
              >
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
