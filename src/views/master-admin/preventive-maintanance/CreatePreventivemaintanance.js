import React, { useReducer, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CFormLabel,
  CFormInput,
  CListGroup,
  CListGroupItem,
  CRow,
  CCol,
  CButton,
  CFormSelect,
} from "@coreui/react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../components/LoadingSpinner";

const initialState = {
  pm_id: "",
  robot_no: "",
  robot_type: "",
  client_id: "",
  site_name: "",
  site_id: "",
  site_location: "",
  physical_condition_of_transPipe_condition: "",
  physical_condition_of_transPipe_image: "",
  physical_condition_of_channel_condition: "",
  physical_condition_of_channel_image: "",
  oiling_need_for_bearing_condition: "",
  oiling_need_for_bearing_condition_image: "",
  oiling_need_for_motors_condition: "",
  oiling_need_for_motors_image: "",
  mf_clothes_alignment: "",
  wheels_alignment: "",
  is_wheels_loose: "",
  is_nutbolt_loose: "",
  start_date: "",
  end_date: "",
  loadingUpload: false,
  loadingRobots: true,
  robots: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_PM_REQUEST":
      return { ...state, loadingPM: true, error: "" };

    case "ADD_PM_SUCCESS":
      return {
        ...state,
        loadingPM: false,
        pmData: action.payload,
        success: true,
      };

    case "ADD_PM_FAIL":
      return {
        ...state,
        loadingPM: false,
        error: action.payload,
        success: false,
      };

    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };
    case "FILL_ROBOT_DATA":
      return { ...state, ...action.data };
    case "SET_IMAGE":
      return { ...state, [action.field]: action.url };

    case "UPLOAD_REQUEST":
      return {
        ...state,
        loadingUpload: { ...state.loadingUpload, [action.field]: true },
      };

    case "UPLOAD_SUCCESS":
      return {
        ...state,
        loadingUpload: { ...state.loadingUpload, [action.field]: false },
      };

    case "UPLOAD_FAIL":
      return {
        ...state,
        loadingUpload: { ...state.loadingUpload, [action.field]: false },
        errorUpload: action.payload,
      };
    case "FETCH_ROBOTS_REQUEST":
      return { ...state, loadingRobots: true, error: "" };
    case "FETCH_ROBOTS_SUCCESS":
      return {
        ...state,
        loadingRobots: false,
        robots: action.payload.data,
      };
    case "FETCH_ROBOTS_FAIL":
      return { ...state, loadingRobots: false, error: action.payload };

    case "RESET":
      return initialState;
    default:
      return state;
  }
};

const CreatePreventiveMaintenance = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const authtoken = useSelector((state) => state.authtoken);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRobots, setFilteredRobots] = useState([]);

  useEffect(() => {
    const fetchRobots = async () => {
      dispatch({ type: "FETCH_ROBOTS_REQUEST" });
      try {
        const result = await axios.get(
          "/api/v1/robots/get-robots/robots-without-pg",
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );
        dispatch({
          type: "FETCH_ROBOTS_SUCCESS",
          payload: {
            data: result.data.data,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_ROBOTS_FAIL",
          payload: "Failed to fetch Robots",
        });
        toast.error("Failed to fetch robots");
      }
    };
    fetchRobots();
  }, [authtoken]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      const filtered = state.robots.filter((robot) => {
        const robotNo = robot.robot_no?.toLowerCase() || "";
        const siteId = robot.site_id?.toLowerCase() || "";
        const searchValue = value.toLowerCase();

        return robotNo.includes(searchValue) || siteId.includes(searchValue);
      });

      setFilteredRobots(filtered);
    } else {
      setFilteredRobots([]);
    }
  };

  const selectRobotFromSearch = (robot) => {
    dispatch({
      type: "FILL_ROBOT_DATA",
      data: {
        robot_no: robot.robot_no,
        robot_type: robot.robot_type,
        site_id: robot.site_id,
      },
    });
    setSearchTerm("");
    setFilteredRobots([]);
  };

  const handleImageUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const bodyFormData = new FormData();
    bodyFormData.append("file", file);

    dispatch({ type: "UPLOAD_REQUEST", field: fieldName }); // Set loading for this specific field

    try {
      const { data } = await axios.post(
        "/api/v1/image-upload/preventive-maintanance",
        bodyFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authtoken}`,
          },
        }
      );

      if (data?.url) {
        dispatch({ type: "SET_IMAGE", field: fieldName, url: data.url });
      }

      dispatch({ type: "UPLOAD_SUCCESS", field: fieldName }); // Stop loading for this field
      toast.success("Image uploaded successfully.");
    } catch (err) {
      dispatch({
        type: "UPLOAD_FAIL",
        field: fieldName,
        payload: "Upload failed",
      });
      toast.error("Image upload failed.");
    }
  };

  const handleChange = (e) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: e.target.name,
      value: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      dispatch({ type: "ADD_PM_REQUEST" });

      const data = await axios.post("/api/v1/preventivemaintenances", state, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });
      dispatch({ type: "ADD_PM_SUCCESS", payload: data.data });
      toast.success("Preventive Maintenance Created Successfully!");

      // toast.success("Preventive Maintenance Created!");
      navigate("/master-admin/preventive-maintanance-dashboard");
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong");
      dispatch({ type: "ADD_PM_FAIL", payload: error.message });
      toast.error(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <CCard className="max-w-3xl mx-auto p-4 shadow-lg rounded-lg">
      <CCardHeader>
        <h2>Create Preventive Maintenance</h2>
      </CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}>
          <CRow className="gy-3">
            <CCol md={12}>
              handleSearchChange
              <CFormLabel>
                Search Robot {state.loadingRobots && <LoadingSpinner />}{" "}
              </CFormLabel>
              <CFormInput
                type="text"
                placeholder="Search Robot No or Site ID..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <CListGroup className="mb-3">
                {searchTerm && filteredRobots.length === 0 ? (
                  <CListGroupItem>No robots found</CListGroupItem>
                ) : (
                  filteredRobots.map((robot, index) => (
                    <CListGroupItem
                      key={index}
                      action
                      onClick={() => selectRobotFromSearch(robot)}
                    >
                      {robot.robot_no} - {robot.site_id}
                    </CListGroupItem>
                  ))
                )}
              </CListGroup>
            </CCol>

            {["robot_no", "robot_type", "site_id"].map((field) => (
              <CCol md={6} key={field}>
                <CFormLabel>{field.replace(/_/g, " ")}</CFormLabel>
                <CFormInput
                  type="text"
                  name={field}
                  value={state[field]}
                  readOnly
                />
              </CCol>
            ))}

            {[
              "physical_condition_of_transPipe_condition",
              "physical_condition_of_channel_condition",
              "physical_condition_of_top_bottom_cover_condition",
              "oiling_need_for_bearing_condition",
              "oiling_need_for_coupling_condition",
              "oiling_need_for_motors_condition",
              "mf_clothes_alignment",
              "wheels_alignment",
              "is_wheels_loose",
              "is_nutbolt_loose",
            ].map((field) => (
              <CCol md={6} key={field}>
                <CFormLabel>{field.replace(/_/g, " ")}</CFormLabel>

                <CFormSelect
                  name={field}
                  value={state[field]}
                  onChange={handleChange}
                >
                  {[
                    "mf_clothes_alignment",
                    "wheels_alignment",
                    "physical_condition_of_transPipe_condition",
                    "physical_condition_of_channel_condition",
                    "physical_condition_of_top_bottom_cover_condition",
                  ].includes(field) ? (
                    <>
                      <option value="">Select</option>
                      <option value="OK">OK</option>
                      <option value="Not OK">Not OK</option>
                    </>
                  ) : (
                    <>
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </>
                  )}
                </CFormSelect>
              </CCol>
            ))}

            {[
              "physical_condition_of_transPipe_image",
              "physical_condition_of_channel_image",
              "physical_condition_of_top_bottom_cover_image",
              "oiling_need_for_bearing_condition_image",
              "oiling_need_for_coupling_image",
              "oiling_need_for_motors_image",
            ].map((field) => (
              <CCol md={6} key={field}>
                <CFormLabel>{field.replace(/_/g, " ")}</CFormLabel>

                {state.loadingUpload[field] ? ( // Show spinner while uploading
                  <LoadingSpinner />
                ) : state[field] ? ( // Show View link only if image exists
                  <Link to={state[field]} target="_blank">
                    View
                  </Link>
                ) : (
                  <p>No Image Available</p> // Show this only when no image is uploaded
                )}

                <CFormInput
                  type="file"
                  onChange={(e) => handleImageUpload(e, field)}
                />
              </CCol>
            ))}
          </CRow>

          <CButton
            color="primary"
            type="submit"
            className="mt-4"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </CButton>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default CreatePreventiveMaintenance;
