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
  CFormInput,
  CFormLabel,
  CFormCheck,
  CRow,
  CTabs,
  CTabList,
  CTab,
  CTabContent,
  CTabPanel,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from "@coreui/react";
import LoadingSpinner from "../../components/LoadingSpinner";

// Reducer
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

const UpdateRobotTracking = () => {
  const [{ fetchloading, updateloading, error }, dispatch] = useReducer(
    reducer,
    {
      robot: {},
      fetchloading: true,
      updateloading: false,
      error: "",
    },
  );

  const { id } = useParams();
  const navigate = useNavigate();
  // const authtoken = useSelector((state) => state.authtoken);

  // Local state
  const [formData, setFormData] = useState({
    robot_no: "",
    deveui: "",
    site_id: "",
    block: "",
    robot_type: "",
    row_no: "",
    row_length: "",
    lora_no: "",
    lora_state: "",
    comments: "",
    cleaning: {
      start: false,
      finish: false,
      cleaning_cancelled: false,
      battery_dead: false,
      battery_health_status: "",
    },
    uplink: { data: "" },
    track_details: [],
    last_activity: [],
  });

  // Utility: convert datetime-local → ISO
  const convertLocalToISO = (dateStr) =>
    dateStr ? new Date(dateStr).toISOString() : null;
  // Describe the fields with type
  const cleaningFields = [
    { key: "start", type: "boolean" },
    { key: "startAt", type: "date" },
    { key: "finish", type: "boolean" },
    { key: "finishAt", type: "date" },
    { key: "cleaning_cancelled", type: "boolean" },
    { key: "cleaning_cancelled_at", type: "date" },
    { key: "battery_dead", type: "boolean" },
    { key: "battery_dead_at", type: "date" },
    { key: "battery_health_status", type: "text" },
    { key: "battery_health_status_updated_at", type: "date" },
    { key: "forward_cleaning_time", type: "number" },
    { key: "forward_cleaning_time_received_at", type: "date" },
    { key: "reverse_cleaning_time", type: "number" },
    { key: "reverse_cleaning_time_received_at", type: "date" },
    { key: "total_cleaning_time", type: "number" },
    { key: "total_cleaning_time_received_at", type: "date" },
    { key: "battery_before_cleaning", type: "number" },
    { key: "battery_before_cleaning_received_at", type: "date" },
    { key: "battery_at_reverse_station", type: "number" },
    { key: "battery_at_reverse_station_received_at", type: "date" },
    { key: "battery_after_cleaning", type: "number" },
    { key: "battery_after_cleaning_received_at", type: "date" },
    { key: "temperature_before_cleaning", type: "number" },
    { key: "temperature_before_cleaning_received_at", type: "date" },
    { key: "temperature_at_reverse_station", type: "number" },
    { key: "temperature_at_reverse_station_received_at", type: "date" },
    { key: "temperature_after_cleaning", type: "number" },
    { key: "temperature_after_cleaning_received_at", type: "date" },
    { key: "cycle_average_brush_current", type: "number" },
    { key: "cycle_average_brush_current_received_at", type: "date" },
    { key: "cycle_average_wheel_current", type: "number" },
    { key: "cycle_average_wheel_current_received_at", type: "date" },
    { key: "cycle_max_wheel_current", type: "number" },
    { key: "cycle_max_wheel_current_received_at", type: "date" },
    { key: "cycle_max_brush_current", type: "number" },
    { key: "cycle_max_brush_current_received_at", type: "date" },
    { key: "cycle_count", type: "number" },
    { key: "cycle_count_received_at", type: "date" },
    { key: "cleaning_mertic", type: "boolean" },
    { key: "cleaning_metric_recievet_at", type: "date" },
  ];

  // Fetch robot data
  useEffect(() => {
    const fetchRobot = async () => {
      dispatch({ type: "FETCH_REQUEST" });

      try {
        const response = await axios.get(`/api/v1/robot-tracking/${id}`, {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        });

        dispatch({ type: "FETCH_SUCCESS", payload: response.data.data });

        const convertToLocal = (iso) =>
          iso ? new Date(iso).toISOString().slice(0, 16) : "";

        setFormData({
          ...response.data.data,
          cleaning: response.data.data.cleaning || {},
          uplink: response.data.data.uplink || {},
          track_details: (response.data.data.track_details || []).map((t) => ({
            ...t,
            timestamp: convertToLocal(t.timestamp),
          })),
          last_activity: (response.data.data.last_activity || []).map((a) => ({
            ...a,
            timestamp: convertToLocal(a.timestamp),
          })),
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data?.message || error.message,
        });
      }
    };

    fetchRobot();
  }, [id]);

  // Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleCleaningChange = (field, value) =>
    setFormData({
      ...formData,
      cleaning: { ...formData.cleaning, [field]: value },
    });

  const handleUplinkChange = (field, value) =>
    setFormData({
      ...formData,
      uplink: { ...formData.uplink, [field]: value },
    });

  const handleTrackChange = (i, field, value) => {
    const updated = [...formData.track_details];
    updated[i][field] = value;
    setFormData({ ...formData, track_details: updated });
  };

  const handleActivityChange = (i, field, value) =>
    setFormData({
      ...formData,
      last_activity: formData.last_activity.map((a, index) =>
        index === i ? { ...a, [field]: value } : a,
      ),
    });

  // Submit handler
  // Inside handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "UPDATE_REQUEST" });

    try {
      const { _id, createdAt, updatedAt, ...cleanFormData } = formData;

      // Track details: convert datetime-local to ISO
      cleanFormData.track_details = cleanFormData.track_details.map((t) => ({
        ...t,
        timestamp: t.timestamp ? convertLocalToISO(t.timestamp) : t.timestamp,
      }));

      // Last activity: convert datetime-local to ISO if user edited
      // Last activity: keep user edits exactly
      cleanFormData.last_activity = cleanFormData.last_activity.map((a) => ({
        ...a,
        timestamp: a.timestamp ? convertLocalToISO(a.timestamp) : a.timestamp,
        data: a.data, // keep user-edited data
        topic: a.topic, // keep user-edited topic
        details: a.details, // keep user-edited details
      }));

      await axios.put(`/api/v1/robot-tracking/${id}`, cleanFormData, {
        // headers: { Authorization: `Bearer ${authtoken}` },
        withCredentials: true,
      });

      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success(`${formData.robot_no}`);
      navigate("/master-admin/robots-tracker");
    } catch (error) {
      dispatch({
        type: "UPDATE_FAIL",
        payload: error.response?.data?.message || error.message,
      });
      toast.error(error.response?.data?.message || error.response?.data?.error);
    }
  };

  // Loading / Error UI
  if (fetchloading) return <LoadingSpinner />;
  if (error) return <p className="error">{error}</p>;
  const convertISOtoLocalInput = (isoString) => {
    if (!isoString) return "";

    const date = new Date(isoString);

    // Convert to IST manually
    const istDate = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);

    const year = istDate.getFullYear();
    const month = String(istDate.getMonth() + 1).padStart(2, "0");
    const day = String(istDate.getDate()).padStart(2, "0");
    const hours = String(istDate.getHours()).padStart(2, "0");
    const minutes = String(istDate.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="px-3">
      <CCard className="shadow-sm">
        <CCardHeader>
          <h4 className="mb-0">Update Robot : {formData.robot_no}</h4>
        </CCardHeader>

        <CCardBody>
          <form onSubmit={handleSubmit}>
            {/* Tabs */}
            <CTabs activeItemKey="basic">
              <CTabList variant="tabs">
                <CTab itemKey="basic">Basic Info</CTab>
                <CTab itemKey="cleaning">Cleaning</CTab>
                <CTab itemKey="uplink">Uplink</CTab>
                <CTab itemKey="track-details">Track Details</CTab>
                <CTab itemKey="last-activity">Last Activity</CTab>
              </CTabList>

              <CTabContent>
                {/* Basic Info */}
                <CTabPanel itemKey="basic" className="p-3">
                  <CRow>
                    {[
                      "robot_no",
                      "deveui",
                      "site_id",
                      "block",
                      "robot_type",
                      "row_no",
                      "row_length",
                      "lora_no",
                      "lora_state",
                      "comments",
                    ].map((field) => (
                      <CCol key={field} md={4} className="mb-3">
                        <CFormLabel>
                          {field.replace(/_/g, " ").toUpperCase()}
                        </CFormLabel>
                        <CFormInput
                          name={field}
                          value={formData[field] || ""}
                          onChange={handleChange}
                        />
                      </CCol>
                    ))}
                  </CRow>
                </CTabPanel>

                {/* Cleaning */}
                {/* // Render dynamically in Cleaning section */}
                <CTabPanel itemKey="cleaning" className="p-3">
                  <h5 className="mb-3">Cleaning Status</h5>

                  <CTable bordered hover responsive className="text-center">
                    <CTableHead color="light">
                      <CTableRow>
                        <CTableHeaderCell>Field</CTableHeaderCell>
                        <CTableHeaderCell>Value</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>

                    <CTableBody>
                      {cleaningFields.map(({ key, type }) => (
                        <CTableRow key={key}>
                          <CTableDataCell>
                            {key.replace(/_/g, " ").toUpperCase()}
                          </CTableDataCell>

                          <CTableDataCell>
                            {type === "boolean" ? (
                              <CFormCheck
                                checked={!!formData.cleaning[key]}
                                onChange={(e) =>
                                  handleCleaningChange(key, e.target.checked)
                                }
                              />
                            ) : type === "date" ? (
                              <CFormInput
                                type="datetime-local"
                                value={convertISOtoLocalInput(
                                  formData.cleaning[key],
                                )}
                                onChange={(e) =>
                                  handleCleaningChange(key, e.target.value)
                                }
                              />
                            ) : (
                              <CFormInput
                                type={type}
                                value={formData.cleaning[key] || ""}
                                onChange={(e) =>
                                  handleCleaningChange(key, e.target.value)
                                }
                              />
                            )}
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </CTabPanel>

                {/* Uplink */}
                <CTabPanel itemKey="uplink" className="p-3">
                  <CRow>
                    {/* Received */}
                    <CCol md={4} className="mb-3 d-flex align-items-center">
                      <CFormCheck
                        type="checkbox"
                        id="uplink-received"
                        label="Received"
                        checked={formData.uplink?.received || false}
                        onChange={(e) =>
                          handleUplinkChange("received", e.target.checked)
                        }
                      />
                    </CCol>

                    {/* Data */}
                    <CCol md={4} className="mb-3">
                      <CFormLabel>Data</CFormLabel>
                      <CFormInput
                        value={formData.uplink?.data || ""}
                        onChange={(e) =>
                          handleUplinkChange("data", e.target.value)
                        }
                      />
                    </CCol>

                    {/* Timestamp */}
                    <CCol md={4} className="mb-3">
                      <CFormLabel>Timestamp</CFormLabel>
                      <CFormInput
                        type="datetime-local"
                        value={
                          formData.uplink?.timestamp
                            ? new Date(formData.uplink.timestamp)
                                .toISOString()
                                .slice(0, 16)
                            : ""
                        }
                        onChange={(e) =>
                          handleUplinkChange(
                            "timestamp",
                            new Date(e.target.value),
                          )
                        }
                      />
                    </CCol>
                  </CRow>
                </CTabPanel>

                {/* Track Details */}
                <CTabPanel itemKey="track-details" className="p-3">
                  {formData.track_details.length > 0 && (
                    <>
                      <h5>Track Details</h5>
                      <CTable bordered hover responsive className="text-center">
                        <CTableHead>
                          <CTableRow>
                            <CTableHeaderCell>Point</CTableHeaderCell>
                            <CTableHeaderCell>Timestamp</CTableHeaderCell>
                            <CTableHeaderCell>Reached Next</CTableHeaderCell>
                            <CTableHeaderCell>Next Point</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>

                        <CTableBody>
                          {formData.track_details.map((t, i) => (
                            <CTableRow key={i}>
                              <CTableDataCell>
                                <CFormInput
                                  type="number"
                                  value={t.point}
                                  onChange={(e) =>
                                    handleTrackChange(
                                      i,
                                      "point",
                                      e.target.value,
                                    )
                                  }
                                />
                              </CTableDataCell>

                              <CTableDataCell>
                                <CFormInput
                                  type="datetime-local"
                                  value={t.timestamp || ""}
                                  onChange={(e) =>
                                    handleTrackChange(
                                      i,
                                      "timestamp",
                                      e.target.value,
                                    )
                                  }
                                />
                              </CTableDataCell>

                              <CTableDataCell>
                                <CFormCheck
                                  checked={!!t.reached_to_next_point}
                                  onChange={(e) =>
                                    handleTrackChange(
                                      i,
                                      "reached_to_next_point",
                                      e.target.checked,
                                    )
                                  }
                                />
                              </CTableDataCell>

                              <CTableDataCell>
                                <CFormInput
                                  type="number"
                                  value={t.next_point}
                                  onChange={(e) =>
                                    handleTrackChange(
                                      i,
                                      "next_point",
                                      e.target.value,
                                    )
                                  }
                                />
                              </CTableDataCell>
                            </CTableRow>
                          ))}
                        </CTableBody>
                      </CTable>
                    </>
                  )}
                </CTabPanel>
                {/* Last Activity */}
                <CTabPanel itemKey="last-activity" className="p-3">
                  {formData.last_activity.length > 0 && (
                    <>
                      <h5>Last Activity</h5>
                      <CTable bordered hover responsive className="text-center">
                        <CTableHead>
                          <CTableRow>
                            <CTableHeaderCell>Data</CTableHeaderCell>
                            <CTableHeaderCell>Topic</CTableHeaderCell>
                            <CTableHeaderCell>Details</CTableHeaderCell>
                            <CTableHeaderCell>Timestamp</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>

                        <CTableBody>
                          {formData.last_activity.map((a, i) => (
                            <CTableRow key={i}>
                              <CTableDataCell>
                                <CFormInput
                                  value={a.data || ""}
                                  onChange={(e) =>
                                    handleActivityChange(
                                      i,
                                      "data",
                                      e.target.value,
                                    )
                                  }
                                />
                              </CTableDataCell>

                              <CTableDataCell>
                                <CFormInput
                                  value={a.topic || ""}
                                  onChange={(e) =>
                                    handleActivityChange(
                                      i,
                                      "topic",
                                      e.target.value,
                                    )
                                  }
                                />
                              </CTableDataCell>

                              <CTableDataCell>
                                <CFormInput
                                  value={a.details || ""}
                                  onChange={(e) =>
                                    handleActivityChange(
                                      i,
                                      "details",
                                      e.target.value,
                                    )
                                  }
                                />
                              </CTableDataCell>

                              <CTableDataCell>
                                <CFormInput
                                  type="datetime-local"
                                  value={convertISOtoLocalInput(a.timestamp)}
                                  onChange={(e) =>
                                    handleActivityChange(
                                      i,
                                      "timestamp",
                                      e.target.value,
                                    )
                                  }
                                />
                              </CTableDataCell>
                            </CTableRow>
                          ))}
                        </CTableBody>
                      </CTable>
                    </>
                  )}
                </CTabPanel>
              </CTabContent>
            </CTabs>

            {/* Submit Button */}
            <div className="d-flex justify-content-end mt-4">
              <CButton color="warning" size="sm" type="submit" className="w-25">
                {updateloading ? "Updating..." : "Update Robot"}
              </CButton>
            </div>
          </form>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default UpdateRobotTracking;
