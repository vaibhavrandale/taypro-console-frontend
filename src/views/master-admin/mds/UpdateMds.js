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
      return { ...state, fetchloading: false, mds: action.payload };
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

const UpdateMds = () => {
  const [{ error, fetchloading, updateloading }, dispatch] = useReducer(
    reducer,
    {
      mds: {},
      fetchloading: true,
      updateloading: false,
      error: "",
    }
  );

  const { id } = useParams();
  const navigate = useNavigate();
  const authtoken = useSelector((state) => state.authtoken);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchMds = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const response = await axios.get(`/api/v1/mds-device/get-mds/${id}`, {
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

    fetchMds();
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

      await axios.put(`/api/v1/mds-device/update-mds/${id}`, filteredFormData, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });

      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success(`${filteredFormData.mds_no} updated successfully!`);
      navigate("/master-admin/mds-device");
    } catch (error) {
      dispatch({
        type: "UPDATE_FAIL",
        payload: error.response?.data?.message || error.message,
      });
      toast.error("Failed to update MDS!");
    }
  };

  if (fetchloading) return <LoadingSpinner />;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="update-mds-container px-3">
      <CCard className="w-100 shadow-sm rounded-lg">
        <CCardHeader>
          <h4 className="mb-0">Update MDS : {formData.mds_no}</h4>
        </CCardHeader>
        <CCardBody>
          <form onSubmit={handleSubmit}>
            <CTabs activeItemKey="basic-info">
              <CTabList variant="tabs">
                <CTab itemKey="basic-info">Basic Info</CTab>
                <CTab itemKey="technical">Technical Data</CTab>
                <CTab itemKey="flags">Configuration Flags</CTab>
              </CTabList>

              <CTabContent>
                {/* BASIC INFO TAB */}
                <CTabPanel className="p-3" itemKey="basic-info">
                  <CRow>
                    {[
                      "mds_no",
                      "block",
                      "deveui",
                      "site_id",
                      "company",
                      "manufactured_date",
                      "version",
                      "pcb_version",
                      "speed",
                      "lora_no",
                      "old_lora_no",
                      "last_gateway",
                      "last_uplink",
                      "last_motor_update",
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

                {/* TECHNICAL TAB */}
                <CTabPanel className="p-3" itemKey="technical">
                  <CRow>
                    {[
                      "last_status",
                      "battery_voltage",
                      "temperature",
                      "dock",
                      "rssi",
                      "snr",
                      "motor1_current",
                      "motor2_current",
                      "no_of_rows",
                      "last_location",
                      "current_location",
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

                {/* FLAGS TAB */}
                <CTabPanel className="p-3" itemKey="flags">
                  <CRow>
                    {["activate", "auto_clean", "lora_state"].map((field) => (
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

export default UpdateMds;
